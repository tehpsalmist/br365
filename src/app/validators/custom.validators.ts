import { AuthService } from '../auth/auth.service'
import { AbstractControl } from '@angular/forms'
import { Injectable } from '@angular/core'

@Injectable()
export class CustomValidators {
  constructor (private authService: AuthService) { }

  unverifiedEmail (control: AbstractControl): { [key: string]: boolean } | null {
    if (this.authService.unverifiedEmails.some(email => email === control.value)) {
      return { unverifiedEmail: true }
    }
    return null
  }

  unverifiedPhone (control: AbstractControl): { [key: string]: boolean } | null {
    if (this.authService.unverifiedPhones.some(phone => phone === control.value)) {
      return { unverifiedPhone: true }
    }
    return null
  }
}
