import { sendEmail } from '../functions/sendEmail'
import errorEmail from '../../_devOps/errorEmail'
import { isValidJSON, reduceReferenceStringToObject } from '../utilities'
import fetch from 'node-fetch'
import { translations, months, bibleArray, books } from '../../_dataServices'
import { visitDashboardButton, nextChapterButton } from '../emailComponents'

interface VerseData {
  translation: string,
  abbreviation: string,
  lang: string,
  language: string,
  direction: string,
  encoding: string,
  book_nr: number,
  book_name: string,
  chapter: number,
  name: string,
  verses: {
    chapter: number,
    verse: number,
    name: string,
    text: string
  }[]
}

export default function (readingArray, plan) {
  return Promise.all<VerseData>(readingArray.map((reading) => getScriptureJSON(reading, plan.translation)))
    .then((verseData: VerseData[]) => {
      const fullTranslation = translations.find(t => plan.translation === t.code)

      const htmlArray = [
        `<h2>Translation: ${fullTranslation.fullText}</h2>`,
        ...verseData.map(item => {
          if (!item) return '<p>An unfortunate error occurred while formatting this chapter.<br>Visit your dashboard to attempt to resend today\'s reading.</p>'

          let chapterString = `<h3>${item.book_name} ${item.chapter}</h3><p style="line-height: 1.75em;">`

          item.verses.forEach(({ verse, text }) => {
            chapterString += `${verse === 1 ? '' : `<sup style="line-height: .75em; font-size: .75em; vertical-align: top; color: green;">${verse}</sup>`}${text} `
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
}

export function getScriptureJSON (reading, translation, iteration = 0): Promise<VerseData> {
  const { book, chapter } = reduceReferenceStringToObject(reading)

  const bookNumber = books.findIndex(bk => bk === book) + 1

  return fetch(`http://getbible.net/v2/${translation}/${bookNumber}/${chapter}`)
    .then(response => {
      if (!response.ok) {
        return iteration < 5 && getScriptureJSON(reading, translation, ++iteration)
      }
      return response.json()
    })
    .catch(err => {
      errorEmail({ err, subject: 'Error', message: `getBibleDotNet.js Error:` })

      return iteration < 5 && getScriptureJSON(reading, translation, ++iteration)
    })
}
