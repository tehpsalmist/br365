import fetch from 'node-fetch'
import { sendEmail } from '../functions/sendEmail'
import { months, translations, bibleArray } from '../../_dataServices'
import { visitDashboardButton, nextChapterButton } from '../emailComponents'

export default async function (reading, plan) {
  const adjustedReading = reading
    .map(reference => reference
      .split(':')[0]
      .split('')
      .reduce((joined, char) => char.match(/[1-9]/) && joined.charAt(joined.length - 1).match(/[a-z]/)
        ? `${joined} ${char}`
        : `${joined}${char}`))
    .join('; ')

  const getNET = await fetch(`http://labs.bible.org/api/?passage=${adjustedReading}&formatting=full`)
  const text = await getNET.text()

  const chaptersArray = adjustedReading.split(';')
  const displayChapters = chaptersArray.length > 1
    ? `${chaptersArray[0]} - ${chaptersArray[chaptersArray.length - 1]}`
    : adjustedReading

  const fullTranslation = translations.find(t => plan.translation === t.code)

  const fullText = `<h3 style="text-align: center;">${displayChapters} (${fullTranslation.fullText})</h3><br>${text}<br><p>Scripture quoted by permission. All scripture quotations, unless otherwise indicated, are taken from the NET Bible® copyright ©1996-2016 by Biblical Studies Press, L.L.C. All rights reserved.</p>`
  const now = new Date()
  const nextReference = bibleArray[bibleArray.findIndex(ref => ref === reading[reading.length - 1]) + 1].split(':')[0]

  return sendEmail({
    to: plan.email,
    subject: `${plan.planName} (${fullTranslation.acronym}): ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
    html: `${fullText}<br><br>${nextChapterButton(plan.translation, nextReference)}<br><br>${visitDashboardButton(plan._id)}`
  })
}
