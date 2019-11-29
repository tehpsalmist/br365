import { map, take, takeWhile } from 'rxjs/operators'
import { interval, Observable } from 'rxjs'
import { AuthService } from '../auth/auth.service'
import { Injectable } from '@angular/core'

function twoDigitize (num: number) {
  return num < 10 ? '0' + String(num) : String(num)
}

export interface Clock {
  total: number
  s: string
  m: string
}

@Injectable({
  providedIn: 'root'
})
export class VerificationTimerService {
  clocks: {
    [key: string]: Observable<Clock>
  } = {}

  constructor (private authService: AuthService) { }

  // Timer factory listens to auth events to clear out and start timers
  registerEmailTimer (email: string, end: number) {
    if (this.clocks[email]) return this.clocks[email]

    this.updateProfileEmail(email, end, false)

    this.clocks[email] = interval(1000).pipe(
      map(x => {
        const seconds = Math.round((end - Date.now()) / 1000)
        return {
          total: seconds,
          s: twoDigitize(seconds % 60),
          m: String(Math.floor(seconds / 60))
        }
      }),
      takeWhile(x => x.total > 0),
      takeWhile(x => this.clocks[email] !== null)
    )

    this.clocks[email].subscribe({ complete: () => this.clocks[email] && this.unregisterEmailTimer(email, false) })

    return this.clocks[email]
  }

  registerPhoneTimer (phone: string, carrier: string, end: number) {
    if (this.clocks[phone]) return this.clocks[phone]

    this.updateProfilePhone(phone, carrier, end, false)

    this.clocks[phone] = interval(1000).pipe(
      map(x => {
        const seconds = Math.round((end - Date.now()) / 1000)
        return {
          total: seconds,
          s: twoDigitize(seconds % 60),
          m: String(Math.floor(seconds / 60))
        }
      }),
      takeWhile(x => x.total > 0),
      takeWhile(x => this.clocks[phone] !== null)
    )

    this.clocks[phone].subscribe({ complete: () => this.clocks[phone] && this.unregisterPhoneTimer(phone, carrier, false) })

    return this.clocks[phone]
  }

  unregisterEmailTimer (email: string, verified: boolean) {
    if (verified) {
      this.authService.removeUnverifiedEmail(email)
    }

    this.clocks[email] = null
    this.updateProfileEmail(email, false, verified)
  }

  unregisterPhoneTimer (phone: string, carrier: string, verified: boolean) {
    if (verified) {
      this.authService.removeUnverifiedPhone(phone)
    }

    this.clocks[phone] = null
    this.updateProfilePhone(phone, carrier, false, verified)
  }


  updateProfileEmail (email: string, unix: number | boolean, verified: boolean) {
    this.authService.userProfile.pipe(take(1)).subscribe(profile => {
      const index = profile['https://bremails'].findIndex(e => e.email === email)

      if (index !== -1) {
        profile['https://bremails'][index].pending = unix
        profile['https://bremails'][index].verified = verified
      } else {
        profile['https://bremails'].push({ email, verified, pending: unix })
      }

      this.authService.updateProfile(profile)
    })
  }

  updateProfilePhone (phone: string, carrier: string, unix: number | boolean, verified: boolean) {
    this.authService.userProfile.pipe(take(1)).subscribe(profile => {
      const index = profile['https://brphones'].findIndex(p => p.phone === phone && p.carrier === carrier)

      if (index !== -1) {
        profile['https://brphones'][index].pending = unix
        profile['https://brphones'][index].verified = verified
      } else {
        profile['https://brphones'].push({ phone, carrier, verified, pending: unix })
      }

      this.authService.updateProfile(profile)
    })
  }
}
