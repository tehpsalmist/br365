import validator from 'validator'

import Plans from '../_models/planModel'

import { verifyEmail, verifyPhone, deletePlan, getPhoneFromString, stringAndIntFromReference, referenceFromString } from './utilities'

import errorEmail from '../_devOps/errorEmail'

import { bibleStructure, bibleArray, translations, timezones, carriers, months } from '../_dataServices'
import { baseUrl } from '../_config'

import { sendEmail, sendText } from './functions/sendEmail'
import { createTimer, updateTimer, deleteTimer } from './functions/timers'

const { BIBLE_EMAIL } = process.env

export const createPlan = async (req, res) => {
  const email = req.bodyEmail('email')
  const phone = getPhoneFromString(req.bodyString('phone')) || null
  const carrier = req.bodyOneOf('carrier', carriers)

  if (!email && (!phone || !carrier)) return res.status(400).json({ message: 'Must send a valid email or phone' })

  const planName = req.bodyString('planName')
  const translation = req.bodyOneOf('translation', translations.map(t => t.code))

  const chapters = validator.isInt(String(req.body.chapters), { max: 12, min: 1 }) ? req.bodyInt('chapters') : 1

  const timeZone = req.bodyOneOf('timeZone', timezones.map(t => t.value))
  const time = req.bodyPattern('time', /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)

  const book = req.bodyOneOf('book', Object.keys(bibleStructure))
  const chapter = Number(
    req.bodyOneOf('chapter', bibleStructure[book].map((v, i) => i + 1)) ||
    req.bodyOneOf('chapter', bibleStructure[book].map((v, i) => String(i + 1)))
  ) || 1

  const validating = { planName, translation, timeZone, time, book }
  const invalid = Object.keys(validating).filter(key => validating[key] === null)

  if (invalid.length) return res.status(422).json({ message: 'invalid inputs', keys: invalid })

  const [phoneVerification, emailVerification] = await Promise.all([
    (phone && carrier) ? verifyPhone(req.user, phone, carrier) : { verified: true },
    email ? verifyEmail(req.user, email) : { verified: true }
  ])

  if (!emailVerification.verified || !phoneVerification.verified) {
    return res.status(403).json({
      message: 'Unverified contacts',
      email: !emailVerification.verified ? email : undefined,
      phone: !phoneVerification.verified ? phone : undefined
    })
  }

  const activeEmail = !!email
  const activeText = !!(phone && carrier)

  const userName = req.user['https://preferredName'] || req.user.name || req.user.nickname
  const userId = req.user.sub

  const date = new Date()
  date.setDate(date.getDate() + 1)

  const dateString = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

  const startingChapter = bibleStructure[book][chapter - 1]
  const startingChapterInt = bibleArray.findIndex(item => item === startingChapter)

  const fullTranslation = translations.find(t => t.code === translation)

  const newPlan = new Plans({
    phone,
    carrier,
    email,
    translation,
    chapters,
    timeZone,
    time,
    planName,
    userId,
    activeEmail,
    activeText,
    timerId: null,
    firstday: {
      date,
      string: dateString
    },
    startingChapter: {
      string: startingChapter,
      int: startingChapterInt
    },
    nextChapter: {
      string: startingChapter,
      int: startingChapterInt
    }
  })

  const savedPlan = await newPlan.save()
    .catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))

  if (savedPlan instanceof Error) {
    return res.status(500).json({ message: 'Error saving plan' })
  }

  if (activeEmail || activeText) {
    const createdTimerId = await createTimer(savedPlan)

    if (!createdTimerId) {
      res.status(500).json({ message: 'plan created but timer failed' })
    }

    const updatedTimerIdOnPlan = await Plans.findByIdAndUpdate(savedPlan._id, { timerId: createdTimerId })
      .catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))

    if (updatedTimerIdOnPlan instanceof Error) {
      errorEmail({
        err: updatedTimerIdOnPlan,
        subject: 'Error Updating Timer',
        message: `${JSON.stringify(savedPlan, null, 2)}:`
      })

      return res.status(500).json({ message: 'plan created but timer failed' })
    }

    activeEmail && sendEmail({
      to: email,
      subject: 'Your Bible Reminder 365 Reading Plan',
      html: `<h6>${dateString}</h6><h4>Hey ${userName}!</h4><p>Your reading plan '${planName}' is now active! ${chapters > 1 ? chapters + ' chapters' : '1 chapter'} of the Bible (${fullTranslation.fullText}) ${chapters > 1 ? 'have' : 'has'} been predestined to arrive in your inbox at ${time} every day.</p><p>If you have any suggestions or feedback regarding this service, simply reply to any of the emails you receive from us and we will get back to you as quickly as we can. Tolle Lege!</p>`
    })

    activeText && sendText({
      to: `${phone}@${carrier}`,
      subject: 'Plan Started',
      text: `${planName} is active! ${baseUrl}/read`
    })
  }

  const { __v, timerId, ...returnPlan } = savedPlan.toObject()

  res.status(200).json({
    plan: {
      ...returnPlan,
      startingChapter: referenceFromString(returnPlan.startingChapter.string)
    }
  })

  sendEmail({
    to: BIBLE_EMAIL,
    subject: 'New User Signup!',
    html: `<h2>New User Signup:</h2><h3>${email}/${phone}: ${planName}</h3><p>${userName} will be receiving ${chapters > 1 ? chapters + ' chapters' : '1 chapter'} of the ${fullTranslation.acronym} at ${time} each day.</p>`
  })
}

export const getPlan = (req, res) => {
  const planId = req.paramString('id')
  const userId = req.user.sub

  Plans.findById(planId, (err, plan) => {
    if (err) {
      res.status(500).json(err)
    } else if (!plan || plan.userId !== userId) {
      res.status(404).json({ message: 'No plan found' })
    } else {
      res.status(200).json({
        noPlan: false,
        plan: {
          ...plan.toObject(),
          startingChapter: referenceFromString(plan.startingChapter.string),
          lastChapter: referenceFromString(plan.lastChapter.string),
          nextChapter: referenceFromString(plan.nextChapter.string)
        }
      })
    }
  })
}

export const getAllPlans = (req, res) => {
  Plans.find({ userId: req.user.sub }, (err, plans) => {
    if (err) {
      res.status(500).json(err)
    } else if (!plans.length) {
      res.status(404).json({ message: 'No plans associated with this user' })
    } else {
      res.json(plans.map(plan => ({
        ...plan.toObject(),
        startingChapter: referenceFromString(plan.startingChapter.string),
        lastChapter: referenceFromString(plan.lastChapter.string),
        nextChapter: referenceFromString(plan.nextChapter.string)
      })))
    }
  })
}

export const updatePlan = async (req, res) => {
  // Verify email, if applicable
  const email = req.bodyEmail('email') || undefined

  if (email) {
    const { verified } = await verifyEmail(req.user, email)

    if (!verified) return res.status(403).json({ message: 'Unverified contacts', email })
  }

  // Verify phone/carrier, if applicable
  const phone = getPhoneFromString(req.bodyString('phone')) || undefined
  const carrier = req.bodyOneOf('carrier', carriers) || undefined

  if ((phone && !carrier) || (!phone && carrier)) {
    return res.status(400).json({
      message: 'Phone numbers and carriers cannot be updated independently, please send both'
    })
  }

  if (phone && carrier) {
    const { verified } = await verifyPhone(req.user, phone, carrier)

    if (!verified) return res.status(403).json({ message: 'Unverified contacts', phone })
  }

  // Verify bible reference, if applicable
  const book = req.body.hasOwnProperty('book') && req.bodyOneOf('book', Object.keys(bibleStructure))

  const chapter = req.body.hasOwnProperty('chapter') && Number(
    req.bodyOneOf('chapter', bibleStructure[book].map((v, i) => i + 1)) ||
    req.bodyOneOf('chapter', bibleStructure[book].map((v, i) => String(i + 1)))
  )

  // Verify the remaining properties, where applicable
  const updateCandidates = {
    email,
    phone,
    carrier,
    planName: req.body.hasOwnProperty('planName') && req.bodyString('planName'),
    translation: req.body.hasOwnProperty('translation') && req.bodyOneOf('translation', translations.map(t => t.code)),
    chapters: req.body.hasOwnProperty('chapters') ? validator.isInt(String(req.body.chapters), { max: 12, min: 1 }) ? req.bodyInt('chapters') : null : false,
    timeZone: req.body.hasOwnProperty('timeZone') && req.bodyOneOf('timeZone', timezones.map(t => t.value)),
    time: req.body.hasOwnProperty('time') && req.bodyPattern('time', /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    nextChapter: (req.body.hasOwnProperty('book') || req.body.hasOwnProperty('chapter')) ? book && chapter ? stringAndIntFromReference({ book, chapter }) : null : false,
    activeEmail: req.body.hasOwnProperty('activeEmail') ? typeof req.body.activeEmail === 'boolean' ? req.body.activeEmail : null : undefined,
    activeText: req.body.hasOwnProperty('activeText') ? typeof req.body.activeText === 'boolean' ? req.body.activeText : null : undefined
  }

  const planId = req.paramString('id')

  const unsanitized = Object.keys(updateCandidates).filter(key => updateCandidates[key] === null)

  if (planId === null || unsanitized.length) {
    return res.status(422).json({ message: `Invalid input${unsanitized.length > 1 ? 's' : ''}`, details: unsanitized })
  }

  // prepare updates object to be sent to the database
  const updates = Object.keys(updateCandidates)
    .filter(key => (key === 'activeEmail' || key === 'activeText') && updateCandidates[key] !== undefined ? true : Boolean(updateCandidates[key]))
    .reduce((allProps, key) => ({ ...allProps, [key]: updateCandidates[key] }), {})

  Plans.findByIdAndUpdate(planId, updates, { new: true }, async (err, plan) => {
    if (err) return res.status(500).json(err)

    if (!plan) return res.status(404).json({ message: 'No plan by that id' })

    const previouslyActive = !!plan.timerId
    const activeNow = !!(plan.activeEmail || plan.activeText)
    const timeChanged = !!(req.body.time || req.body.timeZone)

    if (previouslyActive !== activeNow) {
      // tslint:disable-next-line: no-shadowed-variable
      let timerId = null

      if (previouslyActive && !activeNow) {
        const deletion = await deleteTimer(plan.timerId)

        if (!deletion) {
          return res.status(500).json({ message: 'Error while removing timer' })
        }
      } else {
        timerId = await createTimer(plan)

        if (!timerId) {
          return res.status(500).json({ message: 'Error while creating timer' })
        }
      }

      const updatedTimerIdOnPlan = await Plans.findByIdAndUpdate(planId, { timerId })
        .catch(error => error instanceof Error ? error : new Error(JSON.stringify(error)))

      if (updatedTimerIdOnPlan instanceof Error) {
        errorEmail({
          err: updatedTimerIdOnPlan,
          subject: 'Error Updating Timer',
          message: `${JSON.stringify(plan, null, 2)}:`
        })

        return res.status(500).json({ message: 'Error while updating plan with timer details' })
      }
    } else if (timeChanged && activeNow) {
      await updateTimer(plan)
    }

    const { __v, timerId, ...savedPlan } = plan.toObject()

    res.status(200).json({
      ...savedPlan,
      startingChapter: referenceFromString(plan.startingChapter.string),
      lastChapter: referenceFromString(plan.lastChapter.string),
      nextChapter: referenceFromString(plan.nextChapter.string)
    })
  })
}

export const deletePlanRoute = async (req, res) => {
  const planId = req.paramString('id')

  const deletion = await deletePlan(planId, req.user.sub).catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))

  if (deletion instanceof Error) {
    errorEmail({
      subject: 'Plan deletion error',
      message: `Error deleting plan ${planId}:`,
      err: deletion
    })

    return res.status(500).json({ message: 'An error occurred while deleting plan' })
  }

  const timerDeletion = await deleteTimer(deletion.timerId)

  if (!timerDeletion) {
    errorEmail({
      subject: 'Timer deletion error',
      message: `Error deleting timer for plan: ${JSON.stringify(deletion, null, 2)}`,
      err: 'unable to delete timer'
    })
  }

  res.status(200).json({ success: true })
}

export const recoverPlans = async (req, res) => {
  const email = req.bodyEmail('email')
  const userId = req.user.sub

  const { verified } = await verifyEmail(req.user, email)

  if (!verified) return res.status(403).json({ message: 'Unverified contacts', email })

  Plans.find({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') }, userId: null })
    .then(plans => plans.length && Promise.all(plans.map(plan => Plans.findByIdAndUpdate(plan._id, { userId }))))
    .then(plans => res.status(200).json({ plans }))
    .catch(err => res.status(500).json({ message: 'Error recovering plans', error: err }))
}
