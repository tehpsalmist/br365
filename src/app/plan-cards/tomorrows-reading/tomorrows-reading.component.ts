import { MatInput } from '@angular/material/input';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ConstantsService } from '../../services/constants.service'
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'

@Component({
  selector: 'br365-tomorrows-reading',
  templateUrl: './tomorrows-reading.component.html',
  styles: []
})
export class TomorrowsReadingComponent implements OnInit {

  @Input() book: string
  @Input() chapter: number
  @Output() updateReference: EventEmitter<{ book: string, chapter: number }> = new EventEmitter()
  @ViewChild('bookControl') bookControl: MatInput

  form: FormGroup

  editing: boolean

  books: any[]
  availableChapters: number[]
  selectedBook: string
  selectedChapter: number
  changed: boolean

  constructor (private constantsService: ConstantsService) { }

  ngOnInit () {
    this.selectedBook = this.book
    this.selectedChapter = this.chapter
    this.form = new FormGroup({
      book: new FormControl(this.book, Validators.required),
      chapter: new FormControl(this.chapter, Validators.required)
    })
    this.books = this.constantsService.books
  }

  onEditMode () {
    this.editing = true
    this.assessChapters(this.selectedBook)
    setTimeout(() => {
      this.bookControl.focus()
    }, 0)
  }

  onDoneEditing () {
    if (this.form.valid && this.changed) {
      this.book = this.form.get('book').value
      this.chapter = this.form.get('chapter').value
      this.updateReference.emit({ book: this.book, chapter: this.chapter })
      this.editing = false
      this.changed = false
    } else if (this.form.valid) {
      this.editing = false
      this.changed = false
    }
  }

  assessChapters (book?: string) {
    if (book) {
      const limit = this.constantsService.getChapters(book)
      this.availableChapters = Array(limit).fill(1).map((el, i) => el + i)
      if (this.form.get('chapter').value > this.availableChapters.length) {
        this.form.get('chapter').setValue(1)
      }
    } else {
      this.availableChapters = [1]
      this.form.get('chapter').setValue(null)
    }
  }
}
