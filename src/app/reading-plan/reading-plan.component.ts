import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'br365-reading-plan',
  templateUrl: './reading-plan.component.html',
  styles: []
})
export class ReadingPlanComponent implements OnInit {

  @Input() plan
  @Output() planChange: EventEmitter<{ id: string, changes?: any, del?: boolean }> = new EventEmitter()

  constructor () { }

  ngOnInit () { }

  onUpdatePlanName (newPlanName) {
    this.plan.planName = newPlanName
    this.planChange.emit({ id: this.plan._id, changes: { planName: newPlanName } })
  }

  onUpdateChapters (newChapters) {
    this.plan.chapters = newChapters
    this.planChange.emit({ id: this.plan._id, changes: { chapters: newChapters } })
  }

  onUpdateEmail (newEmail) {
    this.plan.email = newEmail
    this.planChange.emit({ id: this.plan._id, changes: { email: newEmail } })
  }

  onUpdateReference ({ book, chapter }) {
    this.plan.nextChapter.book = book
    this.plan.nextChapter.chapter = chapter
    this.planChange.emit({ id: this.plan._id, changes: { book, chapter } })
  }

  onUpdateTime ({ time, timeZone }) {
    this.plan.time = time
    this.plan.timeZone = timeZone
    this.planChange.emit({ id: this.plan._id, changes: { time, timeZone } })
  }

  onUpdatePhone ({ phone, carrier }) {
    this.plan.phone = phone
    this.plan.carrier = carrier
    this.planChange.emit({ id: this.plan._id, changes: { phone, carrier } })
  }

  onUpdateTranslation (newTranslation) {
    this.plan.translation = newTranslation.code
    this.planChange.emit({ id: this.plan._id, changes: { translation: newTranslation.code } })
  }

  onUpdateEmailStatus (status: boolean) {
    this.plan.activeEmail = status
    this.planChange.emit({ id: this.plan._id, changes: { activeEmail: status } })
  }

  onUpdateTextStatus (status: boolean) {
    this.plan.activeText = status
    this.planChange.emit({ id: this.plan._id, changes: { activeText: status } })
  }

  onDelete () {
    this.planChange.emit({ del: true, id: this.plan._id })
  }
}
