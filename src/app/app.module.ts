import { CustomValidators } from './validators/custom.validators'
import { TokenInterceptor } from './auth/token.interceptor'
import { AuthGuardService } from './auth/auth-guard.service'
import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Br365NavigationComponent } from './br365-navigation/br365-navigation.component'
import { LayoutModule } from '@angular/cdk/layout'
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatAutocompleteModule
} from '@angular/material'
import { WelcomeComponent } from './welcome/welcome.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ReadingPlanComponent } from './reading-plan/reading-plan.component'
import { UpdatePlanComponent } from './dashboard/dashboard.component'
import { ChaptersPerDayComponent } from './plan-cards/chapters-per-day/chapters-per-day.component'
import { DeliveryAddressComponent } from './plan-cards/delivery-address/delivery-address.component'
import { TomorrowsReadingComponent } from './plan-cards/tomorrows-reading/tomorrows-reading.component'
import { DeliveryTimeComponent } from './plan-cards/delivery-time/delivery-time.component'
import { TranslationComponent } from './plan-cards/translation/translation.component'
import { ActivityComponent } from './plan-cards/activity/activity.component'
import { TitleComponent } from './plan-cards/title/title.component'
import { InfoComponent } from './plan-cards/info/info.component'
import { LoginComponent } from './auth/login/login.component'
import { PoliciesComponent } from './policies/policies.component'
import { TermsComponent } from './terms/terms.component'
import { AbbrevPipe } from './pipes/abbrev.pipe'
import { UserComponent } from './user/user.component'
import { EmailVerificationModalComponent } from './verification-modals/email-verification-modal.component'
import { TextVerificationModalComponent } from './verification-modals/text-verification-modal.component'
import { BibleDisplayComponent } from './bible-display/bible-display.component'
import { BookDisplayNamePipe } from './pipes/book-display-name.pipe'
import { PhoneFormatPipe } from './pipes/phone-format.pipe'
import { CarrierDisplayNamePipe } from './pipes/carrier-display-name.pipe'
import { DeliveryPhoneComponent } from './plan-cards/delivery-phone/delivery-phone.component'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: WelcomeComponent },
  { path: 'authenticate', component: LoginComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuardService] },
  { path: 'newplan', component: SignUpComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard', component: UpdatePlanComponent, canActivate: [AuthGuardService] },
  { path: 'read/:version/:reference', component: BibleDisplayComponent, canActivate: [AuthGuardService] },
  { path: 'read/:version', component: BibleDisplayComponent, canActivate: [AuthGuardService] },
  { path: 'read', component: BibleDisplayComponent, canActivate: [AuthGuardService] },
  { path: 'privacy', component: PoliciesComponent },
  { path: 'terms', component: TermsComponent },
  { path: '**', redirectTo: '/home' }
]

@NgModule({
  declarations: [
    AppComponent,
    Br365NavigationComponent,
    WelcomeComponent,
    SignUpComponent,
    ReadingPlanComponent,
    UpdatePlanComponent,
    ChaptersPerDayComponent,
    DeliveryAddressComponent,
    TomorrowsReadingComponent,
    DeliveryTimeComponent,
    TranslationComponent,
    ActivityComponent,
    TitleComponent,
    InfoComponent,
    LoginComponent,
    PoliciesComponent,
    TermsComponent,
    AbbrevPipe,
    UserComponent,
    EmailVerificationModalComponent,
    TextVerificationModalComponent,
    BibleDisplayComponent,
    BookDisplayNamePipe,
    PhoneFormatPipe,
    CarrierDisplayNamePipe,
    DeliveryPhoneComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatAutocompleteModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    CustomValidators
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule],
  entryComponents: [EmailVerificationModalComponent, TextVerificationModalComponent]
})
export class AppModule { }
