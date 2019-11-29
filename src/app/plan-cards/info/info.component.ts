import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'br365-info',
  templateUrl: './info.component.html',
  styles: []
})
export class InfoComponent implements OnInit {

  @Input() startingReference: { book: string, chapter: number }
  @Input() lastReference: { book?: string, chapter?: number }
  @Input() firstDay: string

  constructor () { }

  ngOnInit () {
  }

}
