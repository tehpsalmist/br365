import { MatInput } from '@angular/material'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'

@Component({
  selector: 'br365-title',
  templateUrl: './title.component.html',
  styles: []
})
export class TitleComponent implements OnInit {

  @Input() name: string
  @Input() planName: string
  @Output() updatePlanName: EventEmitter<string> = new EventEmitter()
  @ViewChild('control') myControl: MatInput

  form: FormGroup

  editing: boolean
  changed: boolean

  constructor () { }

  ngOnInit () {
    this.form = new FormGroup({
      planName: new FormControl(this.planName, Validators.required)
    })
  }

  onEditMode () {
    this.editing = true
    setTimeout(() => {
      this.myControl.focus()
    }, 0)
  }

  onDoneEditing () {
    if (this.form.valid && this.changed) {
      this.planName = this.form.get('planName').value
      this.updatePlanName.emit(this.planName)
      this.editing = false
      this.changed = false
    } else if (this.form.valid) {
      this.editing = false
    }
  }

}
