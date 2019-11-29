import { Book } from '../services/constants.service'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { BibleService } from '../services/bible.service'
import { Component, OnInit } from '@angular/core'
import { ConstantsService } from '../services/constants.service'

@Component({
  selector: 'br365-bible-display',
  templateUrl: './bible-display.component.html',
  styles: []
})
export class BibleDisplayComponent implements OnInit {
  passage: SafeHtml
  version: string
  chapter: number
  loading: boolean
  prevReference: string
  nextReference: string
  form: FormGroup
  displayChapter: number
  displayBook: string
  choosingBook: boolean
  choosingChapter: boolean
  chapterOptions: { label: number, value: string }[]

  constructor (private bibleService: BibleService, private sanitizer: DomSanitizer, private route: ActivatedRoute, public constants: ConstantsService, private router: Router) { }

  ngOnInit() {
    this.loading = true

    this.form = new FormGroup({
      translation: new FormControl(this.version || 'esv', Validators.required)
    })

    this.bibleService.currentChapterObservable.subscribe((passage: string) => {
      this.passage = this.sanitizer.bypassSecurityTrustHtml(passage)
      this.loading = false
    })

    this.route.paramMap.subscribe(params => {
      this.loading = true
      const version = params.get('version')
      const reference = params.get('reference')

      const { recentVersion, recentIndex, recentReference } = this.bibleService.getRecentChapter(version, reference)

      if (!recentVersion || !recentReference) {
        const fallbackReference = recentReference || this.constants.chapters[recentIndex] || 'John1'
        const fallbackVersion = recentVersion || 'net'

        return this.router.navigate(['/read', fallbackVersion, fallbackReference])
      }

      this.setState(recentReference, recentIndex, recentVersion)
    })
  }

  setState (reference: string, chapter: number, version: string) {
    [this.prevReference, this.nextReference] = this.setReferences(chapter)
    this.chapter = chapter

    this.form.setValue({ translation: version })
    this.version = version

    const [, tempBook, tempChapter] = reference.match(/(.[^\d]+)(\d+)/)
    this.displayBook = tempBook
    this.displayChapter = Number(tempChapter)

    this.bibleService.changeChapter(chapter, version)
  }

  changeVersion () {
    this.router.navigate(['/read', this.form.get('translation').value, this.displayBook + this.displayChapter])
  }

  openList (type?: 'book' | 'chapter') {
    if (this.choosingChapter) {
      type = 'book'
      const reference = this.constants.chapters[this.chapter]

      const [, tempBook, tempChapter] = reference.match(/(.[^\d]+)(\d+)/)
      this.displayBook = tempBook
      this.displayChapter = Number(tempChapter)
    } else if (this.choosingBook && type === 'book') {
      type = null
      const reference = this.constants.chapters[this.chapter]

      const [, tempBook, tempChapter] = reference.match(/(.[^\d]+)(\d+)/)
      this.displayBook = tempBook
      this.displayChapter = Number(tempChapter)

      this.choosingBook = false
    }

    if (type === 'book') {
      this.choosingBook = true
      this.choosingChapter = false
    } else if (type === 'chapter') {
      this.choosingBook = false
      this.choosingChapter = true
    }
  }

  closeLists () {
    this.choosingBook = false
    this.choosingChapter = false
  }

  chooseBook (book: Book) {
    this.setChapterOptions(book)
    this.displayBook = book.value
    this.openList('chapter')
  }

  chooseChapter ({ label, value }) {
    this.displayChapter = label
    this.closeLists()

    this.router.navigate(['/read', this.version, value])
  }

  setChapterOptions (book: Book) {
    this.chapterOptions = Array(book.chapters)
      .fill(book.start)
      .map((option, i) => ({
        label: i + 1,
        value: `${book.value}${i + 1}`
      }))
  }

  setReferences (index: number) {
    const prev = (1189 + index - 1) % 1189
    const next = (index + 1) % 1189

    return [this.constants.chapters[prev], this.constants.chapters[next]]
  }
}
