import { sendEmail } from '../functions/sendEmail'
import errorEmail from '../../_devOps/errorEmail'
import { isValidJSON } from '../utilities'
import fetch from 'node-fetch'
import { translations, months, bibleArray } from '../../_dataServices'
import { visitDashboardButton, nextChapterButton } from '../emailComponents'

export default function (readingArray, plan) {
  const promises = []

  if (readingArray.length > 6) {
    const reading2 = readingArray.splice(6, 6).join(';')
    const reading1 = readingArray.join(';')
    promises.push(getScriptureJSON(reading1, plan.translation))
    promises.push(getScriptureJSON(reading2, plan.translation))
  } else {
    promises.push(getScriptureJSON(readingArray.join(';'), plan.translation))
  }

  return Promise.all(promises)
    .then(strings => {
      const verseData = strings.reduce((aggregate, string) => string ? [...aggregate, ...JSON.parse(string).book] : [...aggregate, string], [])
      const fullTranslation = translations.find(t => plan.translation === t.code)

      const htmlArray = [
        `<h2>Translation: ${fullTranslation.fullText}</h2>`,
        ...verseData.map(item => {
          if (!item) return '<p>An unfortunate error occurred while formatting this chapter.<br>Visit your dashboard to attempt to resend today\'s reading.</p>'

          let chapterString = `<h3>${item.book_name} ${item.chapter_nr}</h3><p style="line-height: 1.75em;">`

          Object.keys(item.chapter).forEach(verse => {
            chapterString += `${item.chapter[verse].verse_nr === 1 ? '' : `<sup style="line-height: .75em; font-size: .75em; vertical-align: top; color: green;">${item.chapter[verse].verse_nr}</sup>`}${item.chapter[verse].verse} `
          })

          chapterString += `</p>`

          return chapterString
        })
      ]

      const finalHTML = htmlArray.join('')
      const now = new Date()
      const nextReference = bibleArray[bibleArray.findIndex(ref => ref === readingArray[readingArray.length - 1]) + 1].split(':')[0]

      return sendEmail({
        to: plan.email,
        subject: `${plan.planName} (${fullTranslation.acronym}): ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
        html: `${finalHTML}<br><br>${nextChapterButton(plan.translation, nextReference)}<br><br>${visitDashboardButton(plan._id)}`
      })
    })
    .catch(err => errorEmail({
      err,
      subject: 'Error',
      message: `getBibleDotNet.js Error:`
    }))

  function getScriptureJSON (readingList, translation, iteration = 0) {
    return fetch(`http://getbible.net/json?p=${readingList}&v=${translation}`)
      .then(response => response.text())
      .then(text => {
        const JSONstring = text[0] === '(' ? text.slice(1, -2) : text

        return isValidJSON(JSONstring) || (iteration < 5 && getScriptureJSON(readingList, translation, ++iteration))
      })
      .catch(err => {
        errorEmail({ err, subject: 'Error', message: `getBibleDotNet.js Error:` })

        return iteration < 5 && getScriptureJSON(readingList, translation, ++iteration)
      })
  }
}
