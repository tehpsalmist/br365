import { reduceReferenceStringToObject } from '../utilities'
import { sendText } from './sendEmail'
import { baseUrl } from '../../_config'

export default (reading, plan) => {
  const { book, chapter } = reduceReferenceStringToObject(reading[0])

  const url = `${baseUrl}/read/${plan.translation}/${book}${chapter}`

  return sendText({
    to: `${plan.phone}@${plan.carrier}`,
    subject: plan.planName,
    text: url
  }).catch((err) => console.error('text error:', err))
}
