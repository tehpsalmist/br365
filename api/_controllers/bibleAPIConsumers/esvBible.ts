import fetch from 'node-fetch'
import { sendEmail } from '../functions/sendEmail'
import { months, books, translations, bibleArray } from '../../_dataServices'
import { visitDashboardButton, nextChapterButton } from '../emailComponents'
import errorEmail from '../../_devOps/errorEmail'
import { reduceReferenceStringToObject } from '../utilities'

const { ESV_API_TOKEN } = process.env

export const sendESVEmailReminder = async (readingArray, plan) => {
  const reading = getESVReading(readingArray)

  const getESV = await fetch(`https://api.esv.org/v3/passage/html?q=${reading}&inline-styles=true&include-book-titles=true&attach-audio-link-to=passage`, {
    headers: {
      Authorization: `Token ${ESV_API_TOKEN}`
    }
  }).catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))

  if (getESV instanceof Error) {
    errorEmail({ subject: 'ESV Fetching Error', err: getESV, message: 'getESV errored out:' })
  }

  const response = await getESV.json().catch(err => err instanceof Error ? err : new Error(err))

  if (response instanceof Error) {
    errorEmail({ subject: 'ESV Fetching Error', err: response, message: 'getESV.json() errored out:' })
  }

  const now = new Date()
  const fullTranslation = translations.find(t => plan.translation === t.code)
  const nextReference = bibleArray[bibleArray.findIndex(ref => ref === readingArray[readingArray.length - 1]) + 1].split(':')[0]

  return sendEmail({
    to: plan.email,
    subject: `${plan.planName} (${fullTranslation.acronym}): ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
    html: `${response.passages.join('')}<br><br>${nextChapterButton(plan.translation, nextReference)}<br><br>${visitDashboardButton(plan._id)}`
  })
}

function getESVReading (readingArray) {
  if (readingArray.length === 1) {
    return readingArray[0]
  } else {
    const first = readingArray[0]
    const last = readingArray[readingArray.length - 1]
    return getOctalReference(first, last)
  }
}

function getOctalReference (first, last) {
  const lastVerse = threeDigitNumber(last.split('-')[1])
  const firstObject = reduceReferenceStringToObject(first)
  const lastObject = reduceReferenceStringToObject(last)
  const firstBookNumber = twoDigitNumber(books.findIndex(book => book === firstObject.book) + 1)
  const lastBookNumber = twoDigitNumber(books.findIndex(book => book === lastObject.book) + 1)
  const firstChapterNumber = threeDigitNumber(firstObject.chapter)
  const lastChapterNumber = threeDigitNumber(lastObject.chapter)
  const connector = firstBookNumber.includes('66') && !lastBookNumber.includes('66') ? '001-66022021,01001001-' : '001-'
  return `${firstBookNumber}${firstChapterNumber}${connector}${lastBookNumber}${lastChapterNumber}${lastVerse}`
}

function threeDigitNumber (number) {
  return number.toString().length === 3
    ? number.toString()
    : number.length === 2
      ? `0${number}`
      : `00${number}`
}

function twoDigitNumber (number) {
  return number.toString().length === 2
    ? number.toString()
    : `0${number}`
}
