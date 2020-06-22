import { Router } from '@angular/router'
import { FormControl, Validators } from '@angular/forms'
import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { BrApiService } from '../services/api.service'
import { Subscription, Subject } from 'rxjs'
import { VerificationTimerService, Clock } from '../services/verification-timer.service'
import { MessageService } from '../services/message.service'

export interface Data {
  email: string
}

@Component({
  selector: 'br365-email-verification-modal',
  templateUrl: './email-verification-modal.component.html',
  styles: []
})
export class EmailVerificationModalComponent implements OnInit, OnDestroy {
  @ViewChild('codeInput', { static: true }) codeInput: MatInput

  timeRemaining: Clock = null

  email: string
  timer: Subscription

  notifier: Subject<number> = new Subject()

  code: FormControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
    Validators.pattern(/^[0-9]*$/)
  ])

  constructor (
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private apiService: BrApiService,
    private modal: MatDialogRef<EmailVerificationModalComponent>,
    private messageService: MessageService,
    private timerService: VerificationTimerService,
    private router: Router
  ) { }

  ngOnInit () {
    this.email = this.data.email
    this.codeInput.focus()
    this.notifier.subscribe(unix => {
      this.timer = this.timerService.registerEmailTimer(this.email, unix)
        .subscribe(
          clock => {
            this.timeRemaining = clock
          },
          undefined,
          () => this.modal.close({ timeout: true })
        )
    })
  }

  onVerify () {
    this.modal.close({ code: this.code.value, email: this.email })
  }

  resendEmail () {
    this.apiService.resendEmail(this.email)
      .subscribe(() => {
        this.messageService.success('Email Successfully Resent!')
      }, err => {
        this.messageService.warn('Trouble sending email, please try again.', 4000)
      })
  }

  ngOnDestroy () {
    this.timer && this.timer.unsubscribe()
  }

  goToUserPage () {
    this.modal.close()
    this.router.navigate(['/user'])
  }
}
