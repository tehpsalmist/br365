import { VerificationTimerService, Clock } from '../services/verification-timer.service'
import { EmailVerificationModalComponent } from '../verification-modals/email-verification-modal.component'
import { TextVerificationModalComponent } from '../verification-modals/text-verification-modal.component'
import { BrApiService } from '../services/api.service'
import { CustomValidators } from '../validators/custom.validators'
import { AuthService } from '../auth/auth.service'
import { Router } from '@angular/router'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms'
import { ConstantsService } from '../services/constants.service'
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser'
import { Subscription } from 'rxjs'
import { MessageService } from '../services/message.service'

@Component({
  selector: 'br365-sign-up',
  templateUrl: './sign-up.component.html',
  styles: [],
  animations: [
    trigger('saved', [
      state('complete', style({
        opacity: '1'
      })),
      state('incomplete', style({
        opacity: '0'
      })),
      transition('* <=> *', animate(400))
    ])
  ]
})
export class SignUpComponent implements OnInit, OnDestroy {
  @ViewChild('signUp', { static: true }) signUpDirective: NgForm
  @ViewChild('codeInput') codeInput: MatInput

  signUpForm: FormGroup
  translations: any[]
  books: any[]
  availableChapters: any[]
  timeZones: any[]
  carriers: string[]
  selectedBook: string

  loading: boolean
  saveProgress = 0
  savedState = 'incomplete'
  errorState: boolean

  emailTimeRemaining: Clock = null
  expiringEmail: string
  emailTimer: Subscription

  phoneTimeRemaining: Clock = null
  expiringPhone: string
  expiringCarrier: string
  phoneTimer: Subscription

  emailCode: FormControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern(/^[0-9]*$/)
  ])

  phoneCode: FormControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern(/^[0-9]*$/)
  ])

  availablePhones: string[] = []
  availableEmails: string[] = []

  get email () {
    return this.signUpForm.get('email')
  }

  get phone () {
    return this.signUpForm.get('phone')
  }

  get carrier () {
    return this.signUpForm.get('carrier')
  }

  constructor (
    private constantsService: ConstantsService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private apiService: BrApiService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private customValidators: CustomValidators,
    private modalService: MatDialog,
    private timerService: VerificationTimerService
  ) {
    this.iconRegistry.addSvgIcon(
      'translation-outline',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/chrome_reader_mode_outline.svg')
    )
    this.iconRegistry.addSvgIcon(
      'book-outline',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/book_outline.svg')
    )
  }

  ngOnInit () {
    this.signUpForm = new FormGroup({
      email: new FormControl(null, [Validators.email, this.customValidators.unverifiedEmail.bind(this.customValidators)]),
      chapters: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(12), Validators.pattern(/[0-9]/)]),
      translation: new FormControl(null, Validators.required),
      book: new FormControl(null, Validators.required),
      chapter: new FormControl(null, Validators.required),
      time: new FormControl(null, [Validators.required, Validators.pattern(/^([01]?\d|2[0-3]):([0-5]\d)$/)]),
      timeZone: new FormControl(null, Validators.required),
      planName: new FormControl(null, Validators.required),
      carrier: new FormControl(null),
      phone: new FormControl(null, [Validators.pattern(/^\d{10}$/), this.customValidators.unverifiedPhone.bind(this.customValidators)])
    })

    this.translations = this.constantsService.translations
    this.timeZones = this.constantsService.timeZones
    this.books = this.constantsService.books
    this.carriers = Object.keys(this.constantsService.carriers)

    this.signUpForm.get('timeZone').setValue('US/Eastern')
    this.assessChapters()

    this.authService.userProfile.subscribe(profile => {
      this.availableEmails = profile['https://bremails'].map((e: {email: string}) => e.email)
      this.availablePhones = profile['https://brphones'].map((p: {phone: string}) => p.phone)

      const userTZ = this.constantsService.timeZones.find(tz => tz.value === profile['https://timezone'])

      if (userTZ) {
        this.signUpForm.get('timeZone').setValue(userTZ.value)
      }
    })
  }

  assessChapters (book?: String) {
    if (book) {
      const limit = this.constantsService.getChapters(book)
      this.availableChapters = Array(limit).fill(1).map((el, i) => el + i)

      if (this.signUpForm.get('chapter').value > this.availableChapters.length) {
        this.signUpForm.get('chapter').setValue(1)
      }
    } else {
      this.availableChapters = [1]
      this.signUpForm.get('chapter').setValue(null)
    }
  }

  onSavePlan () {
    if (this.loading) return

    this.errorState = false
    this.loading = true
    this.saveProgress = 25

    this.apiService.createPlan(this.signUpForm.value)
      .subscribe((result) => {
        if (this.errorState) return

        this.saveProgress += 25

        if (result.type === 4) {
          this.saveProgress = 100
          this.savedState = 'complete'

          setTimeout(() => {
            this.saveProgress = 0
            this.savedState = 'incomplete'
            this.loading = false

            this.signUpDirective.resetForm()
            this.router.navigate(['/dashboard'], { queryParams: { id: result['body'].plan._id } })
          }, 1500)
        }
      }, error => {
        this.errorState = true
        this.saveProgress = 100
        this.savedState = 'complete'

        setTimeout(() => {
          this.saveProgress = 0
          this.savedState = 'incomplete'
          this.loading = false
        }, 1500)

        if (error.status === 403 && error.error && error.error.message === 'Unverified contacts') {
          if (error.error.email) {
            this.authService.addUnverifiedEmail(error.error.email)
            this.signUpForm.controls['email'].updateValueAndValidity()
          }

          if (error.error.phone) {
            this.authService.addUnverifiedPhone(error.error.phone)
            this.signUpForm.controls['phone'].updateValueAndValidity()
          }

          this.messageService.warn('Your contact information has not yet been verified', 5000)
        } else {
          this.messageService.warn('An error occurred while creating your plan, please try again.', 3000)
        }
      })
  }

  requestEmailVerification () {
    this.errorState = false

    const email = this.email.value

    const modal = this.modalService.open(EmailVerificationModalComponent, {
      height: 'auto',
      width: 'auto',
      data: { email }
    })

    this.apiService.requestEmailVerification(email)
      .subscribe((r: { unix: number, pending: string }) => {
        this.emailTimer = this.timerService.registerEmailTimer(email, r.unix)
          .subscribe({
            next: clock => {
              this.emailTimeRemaining = clock
            },
            complete: () => modal.close({ timeout: true })
          })
        modal.componentInstance && modal.componentInstance.notifier.next(r.unix)
      })

    modal.backdropClick().subscribe(event => {
      this.expiringEmail = modal.componentInstance.email
    })

    modal.afterClosed().subscribe((result: { timeout?: boolean, code?: string, email?: string }) => {
      if (result && result.timeout) {
        this.messageService.warn('Your verification code has timed out, please request another code.', 5000)
      } else if (result && result.code && result.email) {
        this.submitEmailVerificationCode(result.email, result.code)
      } else if (this.expiringEmail && this.emailTimeRemaining) {
        this.codeInput.focus()
      }
    })
  }

  requestTextVerification () {
    this.errorState = false

    const phone = this.phone.value
    const carrier = this.carrier.value

    const modal = this.modalService.open(TextVerificationModalComponent, {
      height: 'auto',
      width: 'auto',
      data: { phone, carrier }
    })

    this.apiService.requestTextVerification(phone, carrier)
      .subscribe((r: { unix: number, pending: string }) => {
        this.phoneTimer = this.timerService.registerPhoneTimer(phone, carrier, r.unix)
          .subscribe({
            next: clock => {
              this.phoneTimeRemaining = clock
            },
            complete: () => modal.close({ timeout: true })
          })
        modal.componentInstance && modal.componentInstance.notifier.next(r.unix)
      })

    modal.backdropClick().subscribe(event => {
      this.expiringPhone = modal.componentInstance.phone
      this.expiringCarrier = modal.componentInstance.carrier
    })

    modal.afterClosed().subscribe((result: { timeout?: boolean, code?: string, phone?: string, carrier?: string }) => {
      if (result && result.timeout) {
        this.messageService.warn('Your verification code has timed out, please request another code.', 5000)
      } else if (result && result.code && result.phone && result.carrier) {
        this.submitTextVerificationCode(result.phone, result.carrier, result.code)
      } else if (this.expiringPhone && this.phoneTimeRemaining) {
        this.codeInput.focus()
      }
    })
  }

  submitEmailVerificationCode (email: string, code: string) {
    this.apiService.submitVerificationCode({ email, code })
      .subscribe(
        (response: { verified: boolean, message: string }) => {
          this.timerService.unregisterEmailTimer(email, response.verified)

          this.signUpForm.controls['email'].updateValueAndValidity()

          this.emailTimeRemaining = null
          this.expiringEmail = null

          this.messageService.success(`${email} successfully verified!`)
        },
        err => {
          if (err.status === 403) {
            this.messageService.warn(err.error.message || 'Codes did not match. Please check your email and try again.')
            this.expiringEmail = email
          } else if (err.status === 404) {
            this.timerService.unregisterEmailTimer(email, err.error.verified || false)

            this.emailTimeRemaining = null
            this.expiringEmail = null

            this.messageService.warn(err.error.message || `Maximum tries exceeded for this code. Please request a new verification code.`)
          }
        }
      )
    this.emailCode.setValue(null)
    this.emailCode.setErrors(null)
  }

  submitTextVerificationCode (phone: string, carrier: string, code: string) {
    this.apiService.submitVerificationCode({ phone, carrier, code }).subscribe(
      (response: { verified: boolean, message: string }) => {
        this.timerService.unregisterPhoneTimer(phone, carrier, response.verified)

        this.signUpForm.controls['phone'].updateValueAndValidity()

        this.phoneTimeRemaining = this.expiringPhone = this.expiringCarrier = null

        this.messageService.success(`${phone} successfully verified!`)
      },
      err => {
        if (err.status === 403) {
          this.messageService.warn(err.error.message || 'Codes did not match. Please check your text messages and try again.')
          this.expiringPhone = phone
          this.expiringCarrier = carrier
        } else if (err.status === 404) {
          this.timerService.unregisterPhoneTimer(phone, carrier, err.error.verified || false)

          this.phoneTimeRemaining = this.expiringPhone = this.expiringCarrier = null

          this.messageService.warn(err.error.message || `Maximum tries exceeded for this code. Please request a new verification code.`)
        }
      }
    )

    this.phoneCode.setValue(null)
    this.phoneCode.setErrors(null)
  }

  resendEmail () {
    this.apiService.resendEmail(this.expiringEmail)
      .subscribe(() => {
        this.messageService.success('Email Successfully Resent!')
      }, err => {
        this.messageService.warn('Trouble sending email; please try again.')
      })
  }

  resendText () {
    this.apiService.resendText(this.expiringPhone, this.expiringCarrier)
      .subscribe(() => {
        this.messageService.success('Text Successfully Resent!')
      }, err => {
        this.messageService.warn('Trouble sending text; please try again.')
      })
  }

  ngOnDestroy () {
    this.emailTimer && this.emailTimer.unsubscribe()
    this.phoneTimer && this.phoneTimer.unsubscribe()
  }
}
