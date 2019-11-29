import { Schema, model, Document } from 'mongoose'

export interface DBPlan extends Document {
  userId: string,
  email: string,
  phone: string,
  carrier: string,
  translation: string,
  chapters: number,
  firstday: {
    date: Date,
    string: string
  },
  timeZone: string,
  time: string,
  lastChapter: {
    string: string,
    int: number
  },
  startingChapter: {
    string: string,
    int: number
  },
  nextChapter: {
    string: string,
    int: number
  },
  activeEmail: boolean,
  activeText: boolean,
  planName: string,
  timerId: string
}

const planSchema = new Schema({
  userId: String,
  email: String,
  phone: String,
  carrier: String,
  translation: String,
  chapters: Number,
  firstday: {
    date: Date,
    string: String
  },
  timeZone: String,
  time: String,
  lastChapter: {
    string: String,
    int: Number
  },
  startingChapter: {
    string: String,
    int: Number
  },
  nextChapter: {
    string: String,
    int: Number
  },
  activeEmail: Boolean,
  activeText: Boolean,
  planName: String,
  timerId: String
})

const Plans = model<DBPlan>('Plans', planSchema)

export default Plans
