import nodemailer from 'nodemailer'
const {
  BIBLE_EMAIL,
  BIBLE_EMAIL_CLIENT_ID,
  BIBLE_EMAIL_CLIENT_SECRET,
  BIBLE_EMAIL_REFRESH_TOKEN
} = process.env

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: BIBLE_EMAIL,
    type: 'oauth2',
    clientId: BIBLE_EMAIL_CLIENT_ID,
    clientSecret: BIBLE_EMAIL_CLIENT_SECRET,
    refreshToken: BIBLE_EMAIL_REFRESH_TOKEN
  }
})

/**
 * nodemailer sendMail params
 * @param {Object} mailOptions
 * @param {string} mailOptions.to
 * @param {string} mailOptions.subject
 * @param {string} mailOptions.html
 */
export const sendEmail = function (mailOptions) {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail({
      from: BIBLE_EMAIL,
      ...mailOptions,
      dsn: {
        id: `${new Date().toISOString()}:${mailOptions.to}:${mailOptions.subject}`,
        return: 'headers',
        notify: ['success', 'failure', 'delay'],
        recipient: BIBLE_EMAIL
      }
    }, (error, response) => {
      if (error || response.rejected[0]) return reject(error || response)
      return resolve(response)
    })
  })
}

/**
 * nodemailer sendMail params
 * @param {Object} textOptions
 * @param {string} textOptions.to
 * @param {string} textOptions.text
 * @param {string} textOptions.subject
 */
export const sendText = function (textOptions) {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail({
      from: BIBLE_EMAIL,
      ...textOptions,
      subject: textOptions.subject
        ? textOptions.subject.substring(0, 140 - 6 - BIBLE_EMAIL.length - textOptions.text.length)
        : 'BR365',
      dsn: {
        id: `${new Date().toISOString()}:${textOptions.to}`,
        return: 'headers',
        notify: ['success', 'failure', 'delay'],
        recipient: BIBLE_EMAIL
      }
    }, (error, response) => {
      if (error || response.rejected[0]) return reject(error || response)
      return resolve(response)
    })
  })
}
