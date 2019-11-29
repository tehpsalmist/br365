import { AuthService } from '../auth/auth.service'
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { trigger, state, style, animate, transition } from '@angular/animations'

@Component({
  selector: 'br365-navigation',
  templateUrl: './br365-navigation.component.html',
  styles: [`
    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 200px;
      box-shadow: 3px 0 6px rgba(0,0,0,.24);
    }
  `],
  animations: [
    trigger('navExpand', [
      state('contracted', style({
        width: '64px'
      })),
      state('expanded', style({
        width: '200px'
      })),
      transition('expanded <=> contracted', animate(100))
    ]),
    trigger('contentMargin', [
      state('contracted', style({
        'margin-left': '64px'
      })),
      state('expanded', style({
        'margin-left': '200px'
      })),
      state('removed', style({
        'margin-left': '0'
      })),
      transition('* <=> *', animate(100))
    ]),
    trigger('profilePic', [
      state('contracted', style({
        transform: 'scale(1)'
      })),
      state('expanded', style({
        transform: 'scale(1.5)'
      })),
      transition('* <=> *', animate(300))
    ])
  ]
})
export class Br365NavigationComponent implements OnInit, OnDestroy {

  @ViewChild('drawer', { static: true }) drawer

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.HandsetPortrait)
    .pipe(map(result => result.matches))

  currentHandset: Boolean

  navExpanded = 'contracted'
  showFullMenu = false

  userImg: String
  profileSub: Subscription

  constructor (private breakpointObserver: BreakpointObserver, public authService: AuthService) { }

  ngOnInit () {
    this.isHandset$.subscribe(bool => {
      this.currentHandset = bool
    })

    if (this.currentHandset) this.navExpanded = 'removed'

    this.profileSub = this.authService.userProfile.subscribe(profile => {
      this.userImg = profile && profile.picture ? profile.picture : ''
    })
  }

  ngOnDestroy () {
    this.profileSub.unsubscribe()
  }

  toggleNavExpansion () {
    if (!this.currentHandset) {
      this.navExpanded = this.navExpanded === 'contracted' ? 'expanded' : 'contracted'
    } else {
      this.drawer.toggle()
      this.navExpanded = 'removed'
    }
  }

  closeNavMobile () {
    if (this.currentHandset) {
      this.drawer.toggle()
      this.navExpanded = 'removed'
    }
  }

  onOpen () {
    if (this.currentHandset) {
      this.showFullMenu = true
      this.navExpanded = 'expanded'
    }
  }

  onClose () {
    this.navExpanded = 'removed'
  }

  whenNavToggled (event) {
    if (event.toState === 'contracted') { this.showFullMenu = false }
  }

  afterNavToggled (event) {
    if (event.toState === 'expanded') { this.showFullMenu = true }
  }

  logout () {
    this.authService.logout()
  }
}
