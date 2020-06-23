import { bibleArray } from '../../_dataServices'
import Plans from '../../_models/planModel'
import errorEmail from '../../_devOps/errorEmail'

export default function (plan) {
  const readingArray = []

  if (plan.nextChapter.int + plan.chapters > 1188) {
    const leftovers = plan.chapters - (1189 - plan.nextChapter.int)
    readingArray.push(...bibleArray.slice(plan.nextChapter.int))
    readingArray.push(...bibleArray.slice(0, leftovers))
  } else {
    readingArray.push(...bibleArray.slice(plan.nextChapter.int, plan.nextChapter.int + plan.chapters))
  }

  const newLastChapterString = readingArray[readingArray.length - 1]

  const newLastChapterInt = bibleArray.findIndex(item => item === newLastChapterString)
  let newNextChapterInt = newLastChapterInt + 1

  if (newNextChapterInt > 1188) newNextChapterInt -= 1189

  Plans.findByIdAndUpdate(
    plan._id,
    {
      lastChapter: {
        int: newLastChapterInt,
        string: newLastChapterString
      },
      nextChapter: {
        string: bibleArray[newNextChapterInt],
        int: newNextChapterInt
      }
    },
    {
      upsert: true,
      strict: false
    },
    err => err && errorEmail({ err, subject: 'Error updating current reading', message: `${plan._id} ${plan.planName}` })
  )

  return readingArray
}
