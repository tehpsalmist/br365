import { Router } from '@angular/router'
import { AuthService } from '../auth.service'
import { Component, OnInit, OnDestroy } from '@angular/core'

@Component({
  selector: 'br365-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor (private authService: AuthService, private router: Router) { }

  ngOnInit () {
    if (this.authService.isAuthenticated()) {
      return this.router.navigate([this.authService.route || 'home'])
    }

    this.authService.lock.show()
  }

  ngOnDestroy () {
    this.authService.lock.hide()
  }
}
