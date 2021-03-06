import { BrApiService } from '../services/api.service'
import { Router, ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { Auth0Lock } from 'auth0-lock'
import { BehaviorSubject, Observable, timer, Subscription } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  lockOptions = {
    allowSignUp: false,
    autoclose: true,
    auth: {
      audience: 'https://biblereminder365.com/api',
      params: {
        scope: 'openid profile email user_metadata app_metadata'
      },
      redirect: true,
      responseType: 'token id_token',
      redirectUrl: `${environment.redirectUrl}/authenticate`,
      sso: true,
      autoParseHash: true
    },
    closable: true,
    container: 'auth0-lock',
    initialScreen: 'signUp',
    languageDictionary: {
      signUpTitle: '',
      title: ''
    },
    rememberLastLogin: true,
    socialButtonStyle: 'small',
    theme: {
      logo: '/assets/line-png-32.png',
      labeledSubmitButton: false,
      primaryColor: '#9ccc65'
    }
  }

  lock = new Auth0Lock(
    'IdJW5whZjnaYiIf7NUIkbTq6LkJzzkls',
    'br365.auth0.com',
    this.lockOptions
  )

  userProfileSubject: BehaviorSubject<any> = new BehaviorSubject(null)
  userProfile: Observable<any> = this.userProfileSubject.asObservable()

  accessToken: string
  idToken: string
  authExpiration: number

  localRoute: string = localStorage.getItem('protectedRedirectRoute')
  unverifiedEmails: string[] = []
  unverifiedPhones: string[] = []

  logoutTimer: Subscription
  logoutKeys: string[] = [
    'profile',
    'accessToken',
    'idToken',
    'authExpiration'
  ]

  constructor (private router: Router, private apiService: BrApiService) {
    this.userProfileSubject.next(JSON.parse(localStorage.getItem('profile')))

    this.accessToken = localStorage.getItem('accessToken')
    this.idToken = localStorage.getItem('idToken')
    this.authExpiration = Number(localStorage.getItem('authExpiration'))

    if (this.authExpiration > Date.now() && !this.logoutTimer) {
      this.setLogoutTimer((this.authExpiration - Date.now()) / 1000)
    }

    this.lock.on('authenticated', (authResult) => {
      this.handleAuthResult(authResult, true)
    })

    this.lock.on('authorization_error', (error) => {
      this.lock.show({
        flashMessage: {
          type: 'error',
          text: error.errorDescription
        }
      })
    })
  }

  set route (newRoute: string) {
    this.localRoute = newRoute
    localStorage.setItem('protectedRedirectRoute', newRoute)
  }

  get route () {
    return this.localRoute
  }

  handleAuthResult (authResult: any, initialSignIn: boolean) {
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      if (error) return this.logout()

      localStorage.setItem('accessToken', authResult.accessToken)
      this.accessToken = authResult.accessToken
      localStorage.setItem('idToken', authResult.idToken)
      this.idToken = authResult.idToken
      this.authExpiration = Date.now() + (authResult.expiresIn * 1000) - 60000
      localStorage.setItem('authExpiration', String(this.authExpiration))
      localStorage.setItem('profile', JSON.stringify(profile))
      this.userProfileSubject.next(profile)

      this.setLogoutTimer(authResult.expiresIn - 60)

      const navAway = () => {
        if (this.localRoute && initialSignIn) {
          const parsed = this.router.parseUrl(this.localRoute)
          this.router.navigate([this.localRoute.split('?')[0]], { queryParams: parsed.queryParams })
        } else if (initialSignIn) {
          this.router.navigate(['dashboard'])
        }

        localStorage.removeItem('protectedRedirectRoute')
      }

      if (
        profile['https://logins'] < 5 &&
        profile['https://bremails'].length &&
        profile['https://bremails'].filter(e => e.verified).length
      ) {
        return Promise.all(profile['https://bremails'].map(e => new Promise((resolve, reject) => {
          this.apiService.recoverPlans(e.email).subscribe(plans => resolve(plans), err => resolve(err))
        }))).then(() => {
          navAway()
        })
      }

      navAway()
    })
  }

  getToken () {
    if (!this.accessToken) this.accessToken = localStorage.getItem('accessToken')
    return this.accessToken
  }

  getIdToken () {
    if (!this.idToken) this.idToken = localStorage.getItem('idToken')
    return this.idToken
  }

  isAuthenticated () {
    return Boolean(this.accessToken) && this.authExpiration > Date.now()
  }

  logout () {
    this.router.navigate(['authenticate'])
    this.accessToken = this.authExpiration = this.idToken = null
    this.userProfileSubject.next(null)
    this.clearProtectedStorage()
    this.logoutTimer && this.logoutTimer.unsubscribe()
  }

  clearProtectedStorage () {
    this.logoutKeys.forEach(key => localStorage.removeItem(key))
  }

  setLogoutTimer (seconds: number) {
    this.logoutTimer && this.logoutTimer.unsubscribe()
    this.logoutTimer = timer(seconds * 1000).subscribe(done => {
      this.lock.checkSession({ scope: 'openid profile email user_metadata app_metadata' }, (err, authResult) => {
        if (err) return this.logout()

        this.handleAuthResult(authResult, false)
      })
    })
  }

  addUnverifiedEmail (email: string) {
    if (this.unverifiedEmails.every(e => e !== email)) {
      this.unverifiedEmails.push(email)
    }
  }

  removeUnverifiedEmail (email: string) {
    this.unverifiedEmails = this.unverifiedEmails.filter(e => e !== email)
  }

  addUnverifiedPhone (phone: string) {
    if (this.unverifiedPhones.every(p => p !== phone)) {
      this.unverifiedPhones.push(phone)
    }
  }

  removeUnverifiedPhone (phone: string) {
    this.unverifiedPhones = this.unverifiedPhones.filter(p => p !== phone)
  }

  updateProfile (profile) {
    localStorage.setItem('profile', JSON.stringify(profile))
    this.userProfileSubject.next(profile)
  }

  supportsPopups () {
    if (((a) => {
      return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
    })(navigator.userAgent || navigator.vendor || window['opera'])) {
      return false
    }

    const didItWork = ('' + window.open).indexOf('[native code]') !== -1

    return Boolean(didItWork)
  }
}
