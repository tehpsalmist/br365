import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'br365-activity',
  templateUrl: './activity.component.html',
  styles: []
})
export class ActivityComponent implements OnInit {

  @Input() activeEmail: boolean
  @Input() activeText: boolean
  @Output() updateEmailStatus: EventEmitter<boolean> = new EventEmitter()
  @Output() updateTextStatus: EventEmitter<boolean> = new EventEmitter()
  @Output() delete: EventEmitter<any> = new EventEmitter()

  constructor () { }

  ngOnInit () { }

  changeEmailStatus () {
    this.activeEmail = !this.activeEmail
    this.updateEmailStatus.emit(this.activeEmail)
  }

  changeTextStatus () {
    this.activeText = !this.activeText
    this.updateTextStatus.emit(this.activeText)
  }

  deletePlan () {
    if (confirm('The gifts and calling of God, and the deletion of this plan, are irrevocable. Proceed?')) this.delete.emit()
  }

}
