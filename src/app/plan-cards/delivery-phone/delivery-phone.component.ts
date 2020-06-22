import { AuthService } from '../../auth/auth.service'
import { ConstantsService } from '../../services/constants.service'
import { CustomValidators } from '../../validators/custom.validators'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatInput, ErrorStateMatcher } from '@angular/material'
import { Component, OnInit, EventEmitter, Input, ViewChild, Output } from '@angular/core'

export class UnverifiedPhoneMatcher implements ErrorStateMatcher {
  isErrorState (control: FormControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched || control.hasError('unverifiedPhone')))
  }
}

@Component({
  selector: 'br365-delivery-phone',
  templateUrl: './delivery-phone.component.html',
  styles: []
})
export class DeliveryPhoneComponent implements OnInit {
  @Input() phone: string
  @Input() carrier: string
  @ViewChild('phoneControl') control: MatInput
  form: FormGroup

  @Output() updatePhone: EventEmitter<{ phone: string, carrier: string }> = new EventEmitter()

  editing: boolean
  changed: boolean
  matcher: UnverifiedPhoneMatcher = new UnverifiedPhoneMatcher()

  carriers: string[]
  availablePhones: string[] = []

  constructor (private customValidators: CustomValidators, private constantsService: ConstantsService, private authService: AuthService) { }

  ngOnInit () {
    this.carriers = Object.keys(this.constantsService.carriers)

    this.form = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
        this.customValidators.unverifiedPhone.bind(this.customValidators)
      ]),
      carrier: new FormControl(null, [Validators.required])
    })

    this.form.get('phone').setValue(this.phone)
    this.form.get('carrier').setValue(this.carrier)

    this.authService.userProfile.subscribe(profile => {
      this.availablePhones = profile['https://brphones'].map((p: {phone: string}) => p.phone)
    })
  }

  isError () {
    return this.form.get('phone').hasError('unverifiedPhone')
  }

  onEditMode () {
    this.editing = true
    setTimeout(() => {
      this.control.focus()
    }, 0)
  }

  onDoneEditing () {
    if (this.form.valid && this.changed) {
      this.phone = this.form.get('phone').value
      this.carrier = this.form.get('carrier').value
      this.updatePhone.emit({ phone: this.phone, carrier: this.carrier })
      this.editing = false
      this.changed = false
    } else if (this.form.valid) {
      this.editing = false
      this.changed = false
    }
  }
}
