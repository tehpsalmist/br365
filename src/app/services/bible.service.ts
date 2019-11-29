import { environment } from './../../environments/environment'
import { ConstantsService } from './constants.service'
import { BehaviorSubject, Observable } from 'rxjs'
import { BrApiService } from './api.service'
import { Injectable } from '@angular/core'

function calculateFiveChapterIndices (chapter: number) {
  const list = []

  for (let offset = -2; offset <= 2; offset++) {
    if (chapter + offset < 0) {
      list.push(1189 + (chapter + offset))
    } else if (chapter + offset >= 1189) {
      list.push((chapter + offset) % 1189)
    } else {
      list.push(chapter + offset)
    }
  }

  return list
}

@Injectable({
  providedIn: 'root'
})
export class BibleService {
  chapters = {
    net: {},
    esv: {},
    kjv: {},
    asv: {},
    akjv: {},
    basicenglish: {},
    darby: {},
    ylt: {},
    web: {},
    wb: {},
    douayrheims: {}
  }

  currentChapter = '<h1>Tolle Lege</h1>'
  currentChapterSubject: BehaviorSubject<string> = new BehaviorSubject(this.currentChapter)
  currentChapterObservable: Observable<string> = this.currentChapterSubject.asObservable()

  currentVersion: string
  currentChapterIndex: number

  isCacheBusting: boolean

  constructor (private apiService: BrApiService, private constants: ConstantsService) {
    this.measureLocalStorage(!environment.production)

    Object.keys(localStorage).forEach(key => {
      if (key.match(/[net|esv|kjv|asv|akjv|basicenglish|darby|ylt|web|wb|douayrheims]:\d+/)) {
        const [version, chapter] = key.split(':')

        this.chapters[version][chapter] = true
      }
    })
  }

  getRecentChapter (version: string, reference: string): { recentReference: string, recentVersion: string, recentIndex: number } {
    if (version) {
      this.currentVersion = version
    }

    const testIndex = this.constants.chapters.indexOf(reference)
    let recentReference

    if (testIndex !== -1) {
      this.currentChapterIndex = testIndex
      recentReference = reference
    } else {
      recentReference = this.constants.chapters[this.currentChapterIndex]
    }

    if (this.currentVersion && recentReference) {
      return { recentVersion: this.currentVersion, recentIndex: this.currentChapterIndex, recentReference }
    }

    const storedKey = localStorage.getItem('currentChapterKey')

    if (!storedKey) return { recentVersion: this.currentVersion, recentIndex: this.currentChapterIndex, recentReference }

    const [storedVersion, storedChapter] = storedKey.split(':')
    recentReference = this.constants.chapters[storedChapter]

    return {
      recentVersion: this.currentVersion || storedVersion,
      recentIndex: this.currentChapterIndex || Number(storedChapter),
      recentReference
    }
  }

  setChapter (version: string, chapter: number) {
    this.currentVersion = version
    this.currentChapterIndex = chapter

    const key = `${version}:${chapter}`

    localStorage.setItem('currentChapterKey', key)

    this.currentChapter = localStorage.getItem(key)

    if (!this.currentChapter) return this.changeChapter(chapter, version)

    this.currentChapterSubject.next(this.currentChapter)
  }

  changeChapter (chapter: number, version: string) {
    if (this.chapters[version][chapter] && this.chapters[version][chapter] !== 'fetching') {
      this.setChapter(version, chapter)

      this.getFiveChapters(version, chapter)
    } else if (this.chapters[version][chapter] === 'fetching') {
      const waiting = setInterval(() => {
        if (this.chapters[version][chapter] && this.chapters[version][chapter] !== 'fetching') {
          clearInterval(waiting)

          this.setChapter(version, chapter)

          this.getFiveChapters(version, chapter)
        }
      }, 30)
    } else {
      localStorage.setItem('currentChapterKey', `${version}:${chapter}`)

      this.getFiveChapters(version, chapter).then(passages => {
        this.setChapter(version, chapter)
      })
    }
  }

  async getFiveChapters (version: string, chapter: number) {
    const chapterIndices = calculateFiveChapterIndices(chapter)

    const passages: (string | boolean | Error)[] = await Promise.all(chapterIndices.map(chap => {
      if (this.chapters[version][chap]) {
        return false
      } else {
        this.chapters[version][chap] = 'fetching'
        return this.apiService.getBible(version, chap).toPromise()
          .then(response => {
            localStorage.setItem(`${version}:${chap}`, response['passage'])
            this.chapters[version][chap] = true

            return response['passage']
          })
          .catch(err => console.log(err))
      }
    }))

    !this.isCacheBusting && passages.some(Boolean) && this.measureLocalStorage(!environment.production)

    return passages
  }

  measureLocalStorage (log: boolean) {
    const totalLength = Object.keys(localStorage).reduce((total: number, key: string) => {
      const charLength = ((localStorage[key].length + key.length) * 2)

      return total + charLength
      // console.log(key.substr(0, 50) + ' = ' + (charLength / 1024).toFixed(2) + ' KB')
    }, 0)

    const sizeKB = totalLength / 1024

    log && console.log(sizeKB.toFixed(2) + ' KB')

    if (!this.isCacheBusting && sizeKB > 1000) {
      this.bustCache()
    }
  }

  bustCache () {
    const currentKey = localStorage.getItem('currentChapterKey')

    const keys = Object.keys(localStorage)
      .filter(key => key.match(/[net|esv|kjv|asv|akjv|basicenglish|darby|ylt|web|wb|douayrheims]:\d+/))

    const keyLocation = keys.indexOf(currentKey)
    const deletionStart = (keyLocation + Math.floor(keys.length * 3 / 8)) % keys.length
    const totalDeletionsRequired = Math.floor(keys.length / 4)

    for (let i = 0; i <= totalDeletionsRequired; i++) {
      const key = keys[(i + deletionStart) % keys.length]
      const [version, chapter] = key.split(':')

      localStorage.removeItem(key)
      this.chapters[version][chapter] = false
    }
  }
}
