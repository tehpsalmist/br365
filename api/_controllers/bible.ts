import fetch from 'node-fetch'
import errorEmail from '../_devOps/errorEmail'
import { isValidJSON, reduceReferenceStringToObject } from './utilities'
import { ESVBibleArray, NETBibleArray, bibleArray } from '../_dataServices'
import { getScriptureJSON } from './bibleAPIConsumers/getBibleDotNet'

const chapters = {
  esv: ESVBibleArray,
  net: NETBibleArray,
  other: bibleArray
}

const { ESV_API_TOKEN } = process.env

export const getChapter = async (req, res) => {
  const version = req.params.version
  const chapter = req.params.chapter

  const list = chapters[version] || chapters.other

  const reference = isChapterValidInteger(chapter)
    ? list[Number(chapter) % list.length]
    : list.find(c => c === chapter)

  if (!reference) return res.status(404).json({ message: 'Reference Not Found' })

  const getPassage = version === 'esv' ? getESV : version === 'net' ? getNET : getBibleDotNet

  const passage = await getPassage(reference, version)

  if (!passage) res.status(500).json({ message: 'Error retrieving passage' })

  res.status(200).json({ passage })
}

async function getESV (reference) {
  const fullReference = `${reference.slice(0, 5)}001-${reference}`

  const response = await fetch(`https://api.esv.org/v3/passage/html?q=${fullReference}&attach-audio-link-to=passage&wrapping-div=true&div-classes=esv-text`, {
    headers: {
      Authorization: `Token ${ESV_API_TOKEN}`
    }
  })

  const json = await response.json()

  return json.passages[0]
}

async function getNET (reference) {
  const response = await fetch(`http://labs.bible.org/api/?passage=${reference}&formatting=full`)

  return response.text()
}

async function getBibleDotNet (reference, version) {
  const json = await getScriptureJSON(reference, version)

  if (!json) return null

  let chapterString = `<h2>${json.book_name} ${json.chapter}</h2><p class="leading-relaxed text-lg">`

  json.verses.forEach(({ verse, text }) => {
    chapterString += `${verse === 1 ? '' : `<sup class="text-primary align-super">${verse}</sup>`}${text} `
  })

  chapterString += '</p>'

  return chapterString
}

function isChapterValidInteger (chapter) {
  return !!chapter.match(/^\d{1,4}$/)
}
