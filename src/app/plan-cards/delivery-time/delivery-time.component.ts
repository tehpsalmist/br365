import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core'
import { ConstantsService } from '../../services/constants.service'
import { MatInput } from '@angular/material'

@Component({
  selector: 'br365-delivery-time',
  templateUrl: './delivery-time.component.html',
  styles: []
})
export class DeliveryTimeComponent implements OnInit {

  editing: boolean
  changed: boolean

  @Input() time: string
  @Input() timeZone: any
  @Output() updateTime: EventEmitter<{ time: string, timeZone: any }> = new EventEmitter()
  @ViewChild('timeControl') timeControl: MatInput

  timeZones: any[]

  form: FormGroup

  constructor (private constantsService: ConstantsService) { }

  ngOnInit () {
    this.timeZones = this.constantsService.timeZones
    this.form = new FormGroup({
      time: new FormControl(this.time, [Validators.required, Validators.pattern(/^([01]?\d|2[0-3]):([0-5]\d)$/)]),
      timeZone: new FormControl(this.timeZone, Validators.required)
    })
  }

  onEditMode () {
    this.editing = true
    setTimeout(() => {
      this.timeControl.focus()
    }, 0)
  }

  onDoneEditing () {
    if (this.form.valid && this.changed) {
      this.time = this.form.get('time').value
      this.timeZone = this.form.get('timeZone').value
      this.updateTime.emit({ time: this.time, timeZone: this.timeZone })
      this.editing = false
      this.changed = false
    } else if (this.form.valid) {
      this.editing = false
      this.changed = false
    }
  }

}
