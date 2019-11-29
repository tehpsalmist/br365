import { sendEmail } from '../controllers/functions/sendEmail'

const { BIBLE_EMAIL } = process.env

export default ({ subject, err, message }) => {
  console.error(err)

  sendEmail({
    to: BIBLE_EMAIL,
    subject,
    html: `<p>${message}</p><p>${err.message}</p><p>${err.stack || 'no stack trace'}</p>`
  }).catch(error => console.error('errorEmail Catch:', error))
}
