import { ConstantsService } from '../services/constants.service'
import { MatInput } from '@angular/material'
import { BrApiService } from '../services/api.service'
import { AuthService } from '../auth/auth.service'
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormControl, Validators } from '@angular/forms'
import { VerificationTimerService, Clock } from '../services/verification-timer.service'
import { MessageService } from '../services/message.service'

@Component({
  selector: 'br365-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit, OnDestroy {

  profile: any
  profileSub: Subscription

  newEmail: FormControl = new FormControl(null, [Validators.required, Validators.email])

  newPhone: FormControl = new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)])
  newCarrier: FormControl = new FormControl(null, [Validators.required])


  changingName: boolean
  nameKeys: string[] = ['family_name', 'given_name', 'middle_name', 'name', 'nickname']
  nameOptions: string[]
  otherName: FormControl = new FormControl(null)

  sendingName: boolean
  sendingEmailCode: boolean
  sendingPhoneCode: boolean

  @ViewChild('newEmailControl', { static: true }) newEmailControl: MatInput
  @ViewChild('newPhoneControl', { static: true }) newPhoneControl: MatInput

  controls: {
    [key: string]: FormControl
  } = {}
  timerSubs: {
    [key: string]: Subscription
  } = {}
  clocks: {
    [key: string]: Clock
  } = {}

  carriers = []

  constructor (private authService: AuthService, private apiService: BrApiService, private timerService: VerificationTimerService, private messageService: MessageService, private constantsService: ConstantsService) { }

  ngOnInit () {
    this.profileSub = this.authService.userProfile.subscribe(profile => {
      this.profile = profile

      if (profile) {
        if (profile.sub.split('|')[0] === 'twitter') {
          this.profile.picture = this.profile.picture.replace('normal', '400x400')
        }

        const uniqueNames = {}

        this.nameOptions = this.nameKeys
          .map(key => profile[key])
          .filter(Boolean)
          .filter(name => {
            if (uniqueNames[name]) return false

            uniqueNames[name] = true
            return true
          })
      }
    })

    this.profile['https://bremails'].forEach(e => {
      if (e.pending) {
        this.timerSubs[e.email] = this.timerService.registerEmailTimer(e.email, e.pending)
          .subscribe({
            next: clock => { this.clocks[e.email] = clock },
            complete: () => { this.clocks[e.email] = null }
          })

        this.controls[e.email] = new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^[0-9]*$/)
        ])
      }
    })

    this.profile['https://brphones'].forEach(p => {
      if (p.pending) {
        this.timerSubs[p.phone] = this.timerService.registerPhoneTimer(p.phone, p.carrier, p.pending)
          .subscribe({
            next: clock => { this.clocks[p.phone] = clock },
            complete: () => { this.clocks[p.phone] = null }
          })

        this.controls[p.phone] = new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^[0-9]*$/)
        ])
      }
    })

    this.carriers = Object.keys(this.constantsService.carriers)
  }

  ngOnDestroy () {
    this.profileSub.unsubscribe()
    Object.keys(this.timerSubs).map(key => this.timerSubs[key]).forEach(sub => sub.unsubscribe())
  }

  requestEmailVerification (email: string) {
    if (this.newEmail.invalid) return

    this.controls[email] = new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^[0-9]*$/)
    ])

    this.sendingEmailCode = true

    this.apiService.requestEmailVerification(email)
      .subscribe(
        (r: { unix: number, pending: string }) => {
          this.timerSubs[email] = this.timerService.registerEmailTimer(email, r.unix)
            .subscribe({
              next: clock => { this.clocks[email] = clock },
              complete: () => { this.clocks[email] = null }
            })

          this.sendingEmailCode = false
        },
        e => {
          this.messageService.warn('Error requesting verification: please try again.')
          this.sendingEmailCode = false
        }
      )
  }

  requestTextVerification (phone: string, carrier: string) {
    if (this.newPhone.invalid) return

    this.controls[phone] = new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^[0-9]*$/)
    ])

    this.sendingPhoneCode = true

    this.apiService.requestTextVerification(phone, carrier)
      .subscribe(
        (r: { unix: number, pending: string }) => {
          this.timerSubs[phone] = this.timerService.registerPhoneTimer(phone, carrier, r.unix)
            .subscribe({
              next: clock => { this.clocks[phone] = clock },
              complete: () => { this.clocks[phone] = null }
            })

          this.sendingPhoneCode = false
        },
        e => {
          this.messageService.warn('Error requesting verification: please try again.')
          this.sendingPhoneCode = false
        }
      )
  }

  submitEmailCode (email: string, code: string) {
    this.controls[email].setValue(null)
    this.controls[email].setErrors(null)
    this.sendingEmailCode = true

    this.apiService.submitVerificationCode({ email, code })
      .subscribe(
        (response: { verified: boolean, message: string }) => {
          this.timerService.unregisterEmailTimer(email, response.verified)
          this.messageService.success(`${email} successfully verified!`)
          this.sendingEmailCode = false
          this.recoverPlans(email)
        },
        err => {
          if (err.status === 403) {
            this.messageService.warn(err.error.message || 'Codes did not match. Please check your email and try again.')
          } else if (err.status === 404) {
            this.timerService.unregisterEmailTimer(email, err.error.verified || false)
            this.messageService.warn(err.error.message || `Maximum tries exceeded for this code. Please request a new verification code.`)
          }

          this.sendingEmailCode = false
        }
      )
  }

  submitTextCode (phone: string, carrier: string, code: string) {
    this.controls[phone].setValue(null)
    this.controls[phone].setErrors(null)
    this.sendingPhoneCode = true

    this.apiService.submitVerificationCode({ phone, carrier, code })
      .subscribe(
        (response: { verified: boolean, message: string }) => {
          this.timerService.unregisterPhoneTimer(phone, carrier, response.verified)
          this.messageService.success(`${phone} successfully verified!`)
          this.sendingPhoneCode = false
        },
        err => {
          if (err.status === 403) {
            this.messageService.warn(err.error.message || 'Codes did not match. Please check your text messages and try again.')
          } else if (err.status === 404) {
            this.timerService.unregisterPhoneTimer(phone, carrier, err.error.verified || false)
            this.messageService.warn(err.error.message || `Maximum tries exceeded for this code. Please request a new verification code.`)
          }

          this.sendingPhoneCode = false
        }
      )
  }

  resendEmail (email: string) {
    this.sendingEmailCode = true

    this.apiService.resendEmail(email)
      .subscribe(() => {
        this.messageService.success('Email Successfully Resent!')
        this.sendingEmailCode = false
      }, err => {
        this.messageService.warn('Trouble sending email, please try again.')
        this.sendingEmailCode = false
      })
  }

  resendText (phone: string, carrier: string) {
    this.sendingPhoneCode = true

    this.apiService.resendText(phone, carrier)
      .subscribe(() => {
        this.messageService.success('Text Successfully Resent!')
        this.sendingPhoneCode = false
      }, err => {
        this.messageService.warn('Trouble sending email, please try again.')
        this.sendingPhoneCode = false
      })
  }

  addEmail () {
    if (this.newEmail.valid && this.profile['https://bremails'].every(e => e.email !== this.newEmail.value)) {
      const newProfile = {
        ...this.profile,
        'https://bremails': [
          ...this.profile['https://bremails'],
          {
            email: this.newEmail.value,
            verified: false
          }
        ]
      }

      this.authService.updateProfile(newProfile)
      this.newEmail.setValue(null)
      this.newEmail.setErrors(null)
    }
  }

  addPhone () {
    if (this.newPhone.valid && this.newCarrier.valid && this.profile['https://brphones'].every(p => p.phone !== this.newPhone.value)) {
      const newProfile = {
        ...this.profile,
        'https://brphones': [
          ...this.profile['https://brphones'],
          {
            phone: this.newPhone.value,
            carrier: this.newCarrier.value,
            verified: false
          }
        ]
      }

      this.authService.updateProfile(newProfile)
      this.newPhone.setValue(null)
      this.newPhone.setErrors(null)
      this.newCarrier.setValue(null)
      this.newCarrier.setErrors(null)
    }
  }

  removeEmail ({ email, pending, verified }) {
    if (confirm('Removing this email will permanently delete any reading plans associated with it.\n\nContinue?')) {
      if (email === this.profile.email) {
        this.messageService.warn(`${email} came from your social provider and cannot be removed.`, 4000)
      } else {
        this.sendingEmailCode = true


        this.apiService.removeEmail(email).subscribe(
          success => {
            if (pending) {
              this.timerService.clocks[email] = null
            }

            this.profile['https://bremails'] = this.profile['https://bremails'].filter(e => e.email !== email)
            this.authService.updateProfile(this.profile)
            this.messageService.success(`Successfully removed ${email} from your account.`)
            this.sendingEmailCode = false
          },
          err => {
            this.messageService.warn(`Error removing ${email} from your account. Please try again.`)
            this.sendingEmailCode = false
          }
        )
      }
    }
  }

  removePhone ({ phone, pending, verified }) {
    if (confirm('Removing this phone number will permanently delete any reading plans exclusively associated with it.\n\nContinue?')) {
      this.sendingPhoneCode = true


      this.apiService.removePhone(phone).subscribe(
        success => {
          if (pending) {
            this.timerService.clocks[phone] = null
          }

          this.profile['https://brphones'] = this.profile['https://brphones'].filter(p => p.phone !== phone)
          this.authService.updateProfile(this.profile)
          this.messageService.success(`Successfully removed ${phone} from your account.`)
          this.sendingPhoneCode = false
        },
        err => {
          this.messageService.warn(`Error removing ${phone} from your account. Please try again.`)
          this.sendingPhoneCode = false
        }
      )
    }
  }

  showNameOptions () {
    this.changingName = !this.changingName

    if (this.changingName) {
      this.otherName.setValue(null)
    }
  }

  chooseName (name) {
    if (!name) {
      return this.messageService.warn('Please provide a value for "Other."')
    }

    this.sendingName = true

    this.apiService.updateUserName(name).subscribe(
      success => {
        this.profile['https://preferredName'] = name
        this.authService.updateProfile(this.profile)
        this.messageService.success('Preferred name updated!')
        this.sendingName = false
      },
      err => {
        this.messageService.warn('Unable to update name. Please try again.')
        this.sendingName = false
      }
    )
  }

  deleteAccount () {
    if (confirm('None of your data will be recoverable if you delete your account.\n\nProceed?')) {
      this.apiService.deleteAccount().subscribe(success => {
        this.authService.logout()
      }, err => {
        this.messageService.warn('There was an error deleting your account. No worries, our engineers are on it!', 4000)
      })
    }
  }

  recoverPlans (email) {
    this.apiService.recoverPlans(email).subscribe((plans: any[]) => {
      plans.length && this.messageService.success(`${plans.length} plan${plans.length > 1 ? 's' : ''} recovered!`)
    })
  }
}
