import { sendEmail, sendText } from './functions/sendEmail'

import errorEmail from '../_devOps/errorEmail'

import { emailVerificationCode } from './emailComponents'

import { auth0, redis } from '../_config'

import { verifyEmail, verifyPhone, deletePlan, findPlansByIdentifiers, getPhoneFromString, generateCode } from './utilities'

export const requestEmailVerification = async (req, res) => {
  const email = req.bodyEmail('email')

  const { verified, hasEmail } = await verifyEmail(req.user, email)

  if (verified) return res.status(200).send({ verified })

  const userId = req.user.sub
  const code = generateCode(6)
  const verificationKey = email + userId

  const conn = await redis.connect().catch(err => err instanceof Error ? err : new Error(err))

  if (conn instanceof Error) {
    redis.disconnect()
    errorEmail({
      err: conn,
      subject: 'REDIS ERROR',
      message: `Error connecting to Redis: ${conn.message}`
    })
    return res.status(500).json(conn)
  }

  // store code
  const setVKey = await Promise.all([
    redis.hsetnx(verificationKey, 'code', code),
    redis.hsetnx(verificationKey, 'tries', 0)
  ]).catch(err => err instanceof Error ? err : new Error(err))

  if (setVKey instanceof Error) {
    redis.disconnect()

    return res.status(500).send(setVKey)
  }

  // Is this already stored? => return expiration time
  if (!setVKey[0]) {
    return redis.ttl(verificationKey)
      .then(time => {
        if (time < 0) return res.status(404).send('code expired')

        const unixMs = (time * 1000) + Date.now()
        redis.disconnect()

        return res.status(200).send({ unix: unixMs, verification: 'pre-existing' })
      })
      .catch(err => {
        redis.disconnect()
        res.status(500).send(err)
      })
  }

  // set expiration
  const expireSet = await redis.expire(verificationKey, 300).catch(err => err instanceof Error ? err : new Error(err))

  if (expireSet instanceof Error || !expireSet) {
    return redis.del([verificationKey])
      .then(() => res.status(500).send(expireSet))
      .catch(err => {
        redis.disconnect()
        res.status(500).send(err)
      })
  }

  const unix = (299 * 1000) + Date.now()

  redis.disconnect()

  // send email
  const emailSent = await sendEmail({
    to: email,
    subject: 'Verification Code for BR365',
    html: emailVerificationCode(code)
  }).catch(err => err instanceof Error ? err : new Error(err))

  if (emailSent instanceof Error) return res.status(500).send(emailSent.message)

  // update usermetadata with email pending expiration time
  return auth0.getUser({ id: userId })
    .then(u => {
      const updatedEmails = hasEmail
        ? u.user_metadata.emails.map(e => e.email === email ? { ...e, pending: unix } : e)
        : u.user_metadata.emails.concat([{ email, verified, pending: unix }])
      return auth0.updateUserMetadata({ id: userId }, { emails: updatedEmails })
    })
    .then(result => res.status(200).send({ unix, verification: 'started' }))
    .catch(err => res.status(500).send(err.message || JSON.stringify(err)))
}

export const requestTextVerification = async (req, res) => {
  const phone = getPhoneFromString(req.bodyString('phone'))
  const carrier = req.bodyString('carrier')

  const { verified, hasPhone } = await verifyPhone(req.user, phone, carrier)

  if (verified) return res.status(200).send({ verified })

  const userId = req.user.sub
  const code = generateCode(6)
  const verificationKey = phone + carrier + userId

  const conn = await redis.connect().catch(err => err instanceof Error ? err : new Error(err))

  if (conn instanceof Error) {
    redis.disconnect()

    errorEmail({
      err: conn,
      subject: 'REDIS ERROR',
      message: `Error connecting to Redis: ${conn.message}`
    })

    return res.status(500).json(conn)
  }

  // store code
  const setVKey = await Promise.all([
    redis.hsetnx(verificationKey, 'code', code),
    redis.hsetnx(verificationKey, 'tries', 0)
  ]).catch(err => err instanceof Error ? err : new Error(err))

  if (setVKey instanceof Error) {
    redis.disconnect()

    return res.status(500).send(setVKey)
  }

  // Is this already stored? => return expiration time
  if (!setVKey[0]) {
    return redis.ttl(verificationKey)
      .then(time => {
        if (time < 0) return res.status(404).send('code expired')

        const unixMs = (time * 1000) + Date.now()
        redis.disconnect()

        return res.status(200).send({ unix: unixMs, verification: 'pre-existing' })
      })
      .catch(err => {
        redis.disconnect()
        res.status(500).send(err)
      })
  }

  // set expiration
  const expireSet = await redis.expire(verificationKey, 300).catch(err => err instanceof Error ? err : new Error(err))

  if (expireSet instanceof Error || !expireSet) {
    return redis.del([verificationKey])
      .then(() => res.status(500).send(expireSet))
      .catch(err => {
        redis.disconnect()
        res.status(500).send(err)
      })
  }

  const unix = (299 * 1000) + Date.now()

  redis.disconnect()

  // send email
  const emailSent = await sendEmail({
    to: `${phone}@${carrier}`,
    from: 'bible365reminder@gmail.com',
    subject: ' ',
    text: `Your Bible Reminder 365 verification code is: ${code}`
  }).catch(err => err instanceof Error ? err : new Error(err))

  if (emailSent instanceof Error) return res.status(500).send(emailSent.message)

  // update usermetadata with email pending expiration time
  return auth0.getUser({ id: userId })
    .then(u => {
      const updatedPhones = hasPhone
        ? u.user_metadata.phones.map(p => p.phone === phone && p.carrier === carrier ? { ...p, pending: unix } : p)
        : u.user_metadata.phones.concat([{ phone, carrier, verified, pending: unix }])

      return auth0.updateUserMetadata({ id: userId }, { phones: updatedPhones })
    })
    .then(result => res.status(200).send({ unix, verification: 'started' }))
    .catch(err => res.status(500).send(err.message || JSON.stringify(err)))
}

export const resendVerificationEmail = async (req, res) => {
  const email = req.bodyEmail('email')

  const { verified, hasEmail } = await verifyEmail(req.user, email)

  if (verified) return res.status(200).send({ verified: true, message: 'Already verified' })

  if (!hasEmail) return res.status(404).send({ verified: false, message: 'This email is not pending verification' })

  const userId = req.user.sub
  const verificationKey = email + userId

  const conn = await redis.connect().catch(err => err instanceof Error ? err : new Error(err))

  if (conn instanceof Error) {
    redis.disconnect()
    return res.status(500).send(conn.message)
  }

  const code = await redis.hget(verificationKey, 'code').catch(err => err instanceof Error ? err : new Error(err))

  if (code instanceof Error) {
    redis.disconnect()
    errorEmail({ err: code, message: `verification key: ${verificationKey}`, subject: 'Error getting code from redis' })
    return res.status(500).send('Server error while looking up a verification code.')
  }

  redis.disconnect()

  return code
    ? sendEmail({
      to: email,
      subject: 'Verification Code for BR365',
      html: emailVerificationCode(code)
    }).then(result => res.status(200).send({ message: 'Successfully resent verification email' }))
    : res.status(404).send({ verified: false, message: 'This email\'s verification code has likely expired or never existed' })
}

export const resendVerificationText = async (req, res) => {
  const phone = getPhoneFromString(req.bodyString('phone'))
  const carrier = req.bodyString('carrier')

  const { verified, hasPhone } = await verifyPhone(req.user, phone, carrier)

  if (verified) return res.status(200).send({ verified: true, message: 'Already verified' })

  if (!hasPhone) return res.status(404).send({ verified: false, message: 'This phone number is not pending verification' })

  const userId = req.user.sub
  const verificationKey = phone + carrier + userId

  const conn = await redis.connect().catch(err => err instanceof Error ? err : new Error(err))

  if (conn instanceof Error) {
    redis.disconnect()
    return res.status(500).send(conn.message)
  }

  const code = await redis.hget(verificationKey, 'code').catch(err => err instanceof Error ? err : new Error(err))

  if (code instanceof Error) {
    redis.disconnect()
    errorEmail({ err: code, message: `verification key: ${verificationKey}`, subject: 'Error getting code from redis' })
    return res.status(500).send('Server error while looking up a verification code.')
  }

  redis.disconnect()

  return code
    ? sendText({
      to: `${phone}@${carrier}`,
      text: `Your Bible Reminder 365 verification code is: ${code}`
    }).then(result => res.status(200).send({ message: 'Successfully resent verification email' }))
    : res.status(404).send({ verified: false, message: 'This email\'s verification code has likely expired or never existed' })
}

export const submitVerificationCode = async (req, res) => {
  const email = req.bodyEmail('email')
  const phone = getPhoneFromString(req.bodyString('phone'))
  const carrier = req.bodyString('carrier')

  if (email && phone) return res.status(400).json({ message: 'Email and phone are exclusive. Pick one to verify.' })

  const { verified, hasPhone, hasEmail } = email
    ? await verifyEmail(req.user, email)
    : await verifyPhone(req.user, phone, carrier)

  if (verified) return res.status(200).send({ verified: true, message: 'Already verified' })

  if (email ? !hasEmail : !hasPhone) {
    return res.status(404).send({
      verified: false,
      message: `This ${email ? 'email' : 'phone number'} is not pending verification`
    })
  }

  const code = req.bodyString('code')
  const userId = req.user.sub
  const verificationKey = email ? email + userId : phone + carrier + userId

  const conn = await redis.connect().catch(err => err instanceof Error ? err : new Error(err))

  if (conn instanceof Error) {
    redis.disconnect()
    return res.status(500).send(conn.message)
  }

  const actualCode = await redis.hget(verificationKey, 'code').catch(err => err instanceof Error ? err : new Error(err))

  if (actualCode instanceof Error) {
    redis.disconnect()
    errorEmail({ err: actualCode, message: `verification key: ${verificationKey}`, subject: 'Error getting code from redis' })
    return res.status(500).send('Server error while looking up a verification code.')
  }

  if (!actualCode) {
    redis.disconnect()

    return res.status(404).send({
      verified: false,
      message: `This ${email ? 'email' : 'phone number'} is not pending verification`
    })
  }

  if (code === actualCode) {
    return Promise.all([
      redis.del([verificationKey]).catch(err => errorEmail({
        err,
        subject: 'Code Deletion Error',
        message: `Code Deletion Error for ${verificationKey}:`
      })),
      auth0.getUser({ id: userId }).then(u => {
        if (email) {
          const updatedEmails = u.user_metadata.emails
            .map(e => e.email === email ? { ...e, pending: false, verified: true } : e)

          return auth0.updateUserMetadata({ id: userId }, { emails: updatedEmails })
        } else {
          const updatedPhones = u.user_metadata.phones
            .map(p => p.phone === phone && p.carrier === carrier ? { ...p, pending: false, verified: true } : p)

          return auth0.updateUserMetadata({ id: userId }, { phones: updatedPhones })
        }
      })
    ])
      .then(result => {
        redis.disconnect()
        return res.status(200).send({ verified: true, message: 'Successfully verified' })
      })
      .catch(err => {
        redis.disconnect()
        return res.status(500).send(err)
      })
  } else {
    return redis.hincrby(verificationKey, 'tries', 1)
      .then(tries => {
        if (tries > 4) {
          return Promise.all([
            redis.del([verificationKey]).catch(err => errorEmail({
              err,
              subject: 'Code Deletion Error',
              message: `Code Deletion Error for ${verificationKey} after ${tries} tries:`
            })),
            auth0.getUser({ id: userId }).then(u => {
              if (email) {
                const updatedEmails = u.user_metadata.emails
                  .map(e => e.email === email ? { ...e, pending: false, verified: false } : e)

                return auth0.updateUserMetadata({ id: userId }, { emails: updatedEmails })
              } else {
                const updatedPhones = u.user_metadata.phones
                  .map(p => p.phone === phone && p.carrier === carrier ? { ...p, pending: false, verified: false } : p)

                return auth0.updateUserMetadata({ id: userId }, { phones: updatedPhones })
              }
            })
          ])
            .then(result => {
              redis.disconnect()
              return res.status(404).send({
                verified: false,
                message: 'Maximum tries exceeded for this code. Please request verification again.'
              })
            })
            .catch(err => errorEmail({
              err,
              subject: 'Code Deletion Error',
              message: `Error resetting ${verificationKey} after ${tries} tries:`
            }))
        } else {
          redis.disconnect()
          return res.status(403).send({
            tries,
            verified: false,
            message: 'Code did not match expectations. Check your code and try again.'
          })
        }
      })
  }
}

export const updateUserName = (req, res) => {
  const preferredName = req.bodyString('name')

  if (!preferredName) return res.status(406).send()

  return auth0.updateUserMetadata({ id: req.user.sub }, { preferredName })
    .then(result => res.send(result))
    .catch(err => res.status(500).json(err.message || JSON.stringify(err)))
}

export const removeUserEmail = async (req, res) => {
  const email = req.paramEmail('email')
  const userId = req.user.sub
  const verificationKey = email + userId

  if (req.user.email === email) {
    return res.status(403).json({ message: 'Emails that originate with social provider cannot be removed from account.' })
  }

  const conn = await redis.connect().catch(err => err instanceof Error ? err : new Error(err))

  if (conn instanceof Error) {
    redis.disconnect()
    return res.status(500).send(conn.message)
  }

  const deletion = await redis.del([verificationKey]).catch(err => err instanceof Error ? err : new Error(err))

  if (deletion instanceof Error) {
    errorEmail({
      message: `Code Deletion Error during email removal for ${verificationKey}:`,
      err: deletion,
      subject: 'Code Deletion Error'
    })

    redis.disconnect()

    return res.status(500).send(deletion.message)
  }

  redis.disconnect()

  const emails = req.user['https://bremails'].filter(e => e.email !== email)

  const plans = await findPlansByIdentifiers({ email }).catch(err => err instanceof Error ? err : new Error(err))

  if (plans instanceof Error) {
    errorEmail({ err: plans, subject: 'Error finding plans by email', message: `${email}` })

    return res.status(500).json({ error: 'Unable to delete plans associated with this email' })
  }

  return Promise.all([
    auth0.updateUserMetadata({ id: userId }, { emails }),
    ...plans.length ? plans.map(plan => deletePlan(plan._id, userId)) : []
  ])
    .then(([auth0Result, deletionResults]) => {
      return auth0Result.user_metadata.emails.findIndex(e => e.email === email) === -1
        ? res.status(200).json({ message: 'Successfully deleted email' })
        : res.status(500).json({ message: 'Problem deleting email' })
    })
    .catch(err => res.status(500).json(err))
}

export const removeUserPhone = async (req, res) => {
  const phone = req.paramString('phone')
  const userId = req.user.sub
  const verificationKey = phone + userId

  const conn = await redis.connect().catch(err => err instanceof Error ? err : new Error(err))

  if (conn instanceof Error) {
    redis.disconnect()
    return res.status(500).send(conn.message)
  }

  const deletion = await redis.del([verificationKey]).catch(err => err instanceof Error ? err : new Error(err))

  if (deletion instanceof Error) {
    errorEmail({
      message: `Code Deletion Error during phone removal for ${verificationKey}:`,
      err: deletion,
      subject: 'Code Deletion Error'
    })

    redis.disconnect()

    return res.status(500).send(deletion.message)
  }

  redis.disconnect()

  const phones = req.user['https://brphones'].filter(p => p.phone !== phone)

  // const plans = await findPlansByIdentifiers({ phone }).catch(err => err instanceof Error ? err : new Error(err))

  // if (plans instanceof Error) {
  //   errorEmail({ err: plans, subject: 'Error finding plans by phone', message: `${phone}` })
  // }

  return Promise.all([
    auth0.updateUserMetadata({ id: userId }, { phones })
    // ...plans.length ? plans.map(plan => deletePlan(plan._id, userId)) : []
  ])
    .then(([auth0Result, deletionResults]) => {
      return auth0Result.user_metadata.phones.findIndex(p => p.phone === phone) === -1
        ? res.status(200).json({ message: 'Successfully deleted phone' })
        : res.status(500).json({ message: 'Problem deleting phone' })
    })
    .catch(err => res.status(500).json(err))
}

export const deleteUser = (req, res) => {
  const userId = req.user.sub

  findPlansByIdentifiers({ userId })
    .then(plans => plans.length && Promise.all(plans.map(plan => deletePlan(plan._id, userId))))
    .then(() => auth0.deleteUser({ id: userId }))
    .then(success => res.status(200).json({ message: success }))
    .catch(err => {
      res.status(500).json({ message: 'Error deleting plans associated with this account', error: err })
    })
}
