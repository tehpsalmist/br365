import { AuthService } from './auth.service'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor (private authService: AuthService) { }

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      return true
    } else {
      this.authService.route = state.url
      this.authService.logout()

      return false
    }
  }
}
