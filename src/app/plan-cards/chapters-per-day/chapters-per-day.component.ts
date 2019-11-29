import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'br365-chapters-per-day',
  templateUrl: './chapters-per-day.component.html',
  styles: []
})
export class ChaptersPerDayComponent implements OnInit {

  @Input() chapters: number
  @Output() updateChapters: EventEmitter<number> = new EventEmitter()
  up: boolean
  down: boolean

  constructor () { }

  ngOnInit () { }

  increment () {
    if (this.chapters < 12) {
      this.chapters++
      this.updateChapters.emit(this.chapters)
    }
  }

  decrement () {
    if (this.chapters > 0) {
      this.chapters--
      this.updateChapters.emit(this.chapters)
    }
  }

}
