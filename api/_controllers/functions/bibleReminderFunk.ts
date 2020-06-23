import Plans from '../../_models/planModel'
import getBibleDotNet from '../bibleAPIConsumers/getBibleDotNet'
import getNETBible from '../bibleAPIConsumers/netBible'
import { sendESVEmailReminder } from '../bibleAPIConsumers/esvBible'
import currentReading from './currentReading'
import sendTextReminder from './sendTextReminder'
import errorEmail from '../../_devOps/errorEmail'

export default id => new Promise((resolve, reject) => {
  Plans.findById({ _id: id }, (err, plan) => {
    if (err) {
      errorEmail({
        subject: 'Bible Reminder Funk Error',
        message: `Error fetching plan ID: ${id}`,
        err
      })

      reject(err)
    } else if (!plan) {
      errorEmail({
        subject: 'Bible Reminder Funk Error',
        message: `No plan found for ID: ${id}`,
        err: new Error('no plan found')
      })

      reject('No Plan Found')
    } else if (
      plan.translation === 'asv' ||
      plan.translation === 'kjv' ||
      plan.translation === 'akjv' ||
      plan.translation === 'basicenglish' ||
      plan.translation === 'darby' ||
      plan.translation === 'ylt' ||
      plan.translation === 'web' ||
      plan.translation === 'wb' ||
      plan.translation === 'douayrheims'
    ) {
      sendEverything(plan, getBibleDotNet).then(resolve).catch(reject)
    } else if (plan.translation === 'net') {
      sendEverything(plan, getNETBible).then(resolve).catch(reject)
    } else if (plan.translation === 'esv') {
      sendEverything(plan, sendESVEmailReminder).then(resolve).catch(reject)
    } else {
      reject('No idea what happened here...')
    }
  })
})

function sendEverything (plan, emailFunction) {
  const readingList = currentReading(plan)

  return Promise.all([
    plan.activeText && plan.phone && plan.carrier && sendTextReminder(readingList, plan),
    plan.activeEmail && plan.email && emailFunction(readingList, plan)
  ])
}
