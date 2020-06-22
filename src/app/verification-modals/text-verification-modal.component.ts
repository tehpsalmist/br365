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
  phone: string
  carrier: string
}

@Component({
  selector: 'br365-text-verification-modal',
  templateUrl: './text-verification-modal.component.html',
  styles: []
})
export class TextVerificationModalComponent implements OnInit, OnDestroy {
  @ViewChild('codeInput', { static: true }) codeInput: MatInput

  timeRemaining: Clock = null

  phone: string
  carrier: string
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
    private modal: MatDialogRef<TextVerificationModalComponent>,
    private messageService: MessageService,
    private timerService: VerificationTimerService,
    private router: Router
  ) { }

  ngOnInit () {
    this.phone = this.data.phone
    this.carrier = this.data.carrier
    this.codeInput.focus()
    this.notifier.subscribe(unix => {
      this.timer = this.timerService.registerPhoneTimer(this.phone, this.carrier, unix)
        .subscribe({
          next: clock => {
            this.timeRemaining = clock
          },
          complete: () => this.modal.close({ timeout: true })
        })
    })
  }

  onVerify () {
    this.modal.close({ code: this.code.value, phone: this.phone, carrier: this.carrier })
  }

  resendText () {
    this.apiService.resendText(this.phone, this.carrier)
      .subscribe(() => {
        this.messageService.success('Text Successfully Resent!')
      }, err => {
        this.messageService.warn('Trouble sending text, please try again.', 4000)
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
