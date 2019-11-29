export interface Plan {
  _id: string,
  userId: string,
  email: string,
  phone: string,
  carrier: string,
  translation: string,
  chapters: any,
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
  activeEmail: Boolean,
  activeText: Boolean,
  planName: string,
  timerId: string
}
