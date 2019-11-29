import { Router, ActivatedRoute } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { BrApiService } from '../services/api.service'
import { Plan } from '../models/plan.interface'
import { AuthService } from '../auth/auth.service'
import { MessageService } from '../services/message.service'

@Component({
  selector: 'br365-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class UpdatePlanComponent implements OnInit {

  currentPlan: any
  loading: boolean
  plans: Plan[]
  expanded: any = {}

  constructor (private apiService: BrApiService, private messageService: MessageService, private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit () {
    const id = this.router.parseUrl(this.router.url).queryParams.id

    this.hydratePlans(id)
  }

  hydratePlans (id?: string) {
    this.loading = true

    this.apiService.getAllPlans().subscribe({
      next: (plans: Plan[]) => {
        this.loading = false
        this.plans = plans

        if (id && this.plans.some(plan => plan._id === id)) {
          this.expanded[id] = true
          setTimeout(() => {
            document.querySelector(`[id='${id}']`).scrollIntoView({
              behavior: 'smooth'
            })
          }, 0)
          this.router.navigate(['.'], { relativeTo: this.route })
        } else if (id) {
          this.messageService.warn('The requested plan does not belong to your account. Try verifying your email address(es) in the User Settings Page.', 10000)
          this.router.navigate(['.'], { relativeTo: this.route })
        }
      },
      error: err => {
        this.loading = false
        const message = err.status === 401 || err.status === 403
          ? 'Authentication Error: Try refreshing dashboard or logging out and back in.'
          : err.status === 404
            ? 'No plans found for your account.'
            : 'An unexpected error occurred. Try refreshing the dashboard.'
        this.messageService.warn(message)
      }
    })
  }

  onPlanChange ({ id, changes, del }) {
    if (id && changes) {
      this.loading = true

      this.apiService.updatePlan(id, changes).subscribe({
        next: result => {
          this.loading = false
          this.messageService.success('Reading Plan Updated!')

          this.hydratePlans()
        },
        error: err => {
          this.loading = false

          const unverifiedContacts = err.error && err.status === 403 && err.error.message === 'Unverified contacts'
          const unverifiedEmail = unverifiedContacts && err.error.email
          const unverifiedPhone = unverifiedContacts && err.error.phone
          const message = unverifiedContacts ? 'Email or Phone Unverified' : 'Failed to update plan; please try again.'

          if (unverifiedEmail) this.authService.addUnverifiedEmail(err.error.email)
          if (unverifiedPhone) this.authService.addUnverifiedPhone(err.error.phone)

          this.messageService.warn(message, 5000)

          this.hydratePlans()
        }
      })
    } else if (id && del) {
      this.apiService.removePlan(id)
        .subscribe({
          next: result => {
            this.loading = false
            this.plans = this.plans.filter(plan => plan._id !== id)
            this.messageService.success('Successfully Deleted.', 3500)
          },
          error: error => {
            this.messageService.warn('Failed to Delete Plan.', 3500)
          }
        })
    }
  }
}
