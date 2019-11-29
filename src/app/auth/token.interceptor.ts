import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http'
import { AuthService } from './auth.service'
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor (public authService: AuthService) { }

  intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getIdToken()}`
      }
    })

    return next.handle(request)
  }
}
