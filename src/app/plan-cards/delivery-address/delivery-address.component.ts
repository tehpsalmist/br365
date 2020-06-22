import { AuthService } from '../../auth/auth.service'
import { CustomValidators } from '../../validators/custom.validators'
import { MatInput, ErrorStateMatcher } from '@angular/material'
import { FormControl, Validators, FormGroup } from '@angular/forms'
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core'

export class UnverifiedEmailMatcher implements ErrorStateMatcher {
  isErrorState (control: FormControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched || control.hasError('unverifiedEmail')))
  }
}

@Component({
  selector: 'br365-delivery-address',
  templateUrl: './delivery-address.component.html',
  styles: []
})
export class DeliveryAddressComponent implements OnInit {

  @Input() email: string
  @ViewChild('emailControl') control: MatInput
  form: FormGroup

  @Output() updateEmail: EventEmitter<string> = new EventEmitter()

  editing: boolean
  changed: boolean
  matcher: UnverifiedEmailMatcher = new UnverifiedEmailMatcher()
  availableEmails: string[] = []

  constructor (private customValidators: CustomValidators, private authService: AuthService) { }

  ngOnInit () {
    this.form = new FormGroup({ email: new FormControl(null, [Validators.required, Validators.email, this.customValidators.unverifiedEmail.bind(this.customValidators)]) })
    this.form.get('email').setValue(this.email)

    this.authService.userProfile.subscribe(profile => {
      this.availableEmails = profile['https://bremails'].map((e: {email: string}) => e.email)
    })
  }

  isError () {
    return this.form.get('email').hasError('unverifiedEmail')
  }

  onEditMode () {
    this.editing = true
    setTimeout(() => {
      this.control.focus()
    }, 0)
  }

  onDoneEditing () {
    if (this.form.valid && this.changed) {
      this.email = this.form.get('email').value
      this.updateEmail.emit(this.email)
      this.editing = false
      this.changed = false
    } else if (this.form.valid) {
      this.editing = false
      this.changed = false
    }
  }

}
