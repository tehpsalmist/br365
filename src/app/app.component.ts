import { environment } from '../environments/environment'
import { Router, NavigationEnd } from '@angular/router'
import { Component } from '@angular/core'

@Component({
  selector: 'br365-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  constructor (private router: Router) {
    if (environment.production) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (<any>window).gtag('event', 'page_view', { 'send_to': 'UA-123064926-1', 'page_path': event.urlAfterRedirects })
        }
      })
    }
  }
}
