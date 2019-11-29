import { environment } from '../../environments/environment'
import { HttpClient, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class BrApiService {

  constructor (private http: HttpClient) { }

  getAllPlans () {
    return this.http.get(`${environment.baseUrl}/api/plans`)
  }

  getPlanById (id: string) {
    return this.http.get(`${environment.baseUrl}/api/plan/${id}`)
  }

  createPlan (formValue) {
    const req = new HttpRequest(
      'POST',
      `${environment.baseUrl}/api/plan`,
      formValue,
      { reportProgress: true, responseType: 'json' }
    )

    return this.http.request(req)
  }

  updatePlan (id: string, plan) {
    return this.http.put(`${environment.baseUrl}/api/plan/${id}`, plan)
  }

  removePlan (id: string) {
    return this.http.delete(`${environment.baseUrl}/api/plan/${id}`)
  }

  recoverPlans (email: string) {
    return this.http.post(`${environment.baseUrl}/api/plans`, { email })
  }

  updateUserName (name: string) {
    return this.http.put(`${environment.baseUrl}/api/user/name`, { name })
  }

  requestEmailVerification (email: string) {
    return this.http.post(`${environment.baseUrl}/api/requestEmailVerification`, { email })
  }

  requestTextVerification (phone: string, carrier: string) {
    return this.http.post(`${environment.baseUrl}/api/requestTextVerification`, { phone, carrier })
  }

  submitVerificationCode ({ email, phone, carrier, code }: { email?: string, code: number | string, phone?: string, carrier?: string }) {
    return this.http.post(`${environment.baseUrl}/api/submitVerificationCode`, { email, code, phone, carrier })
  }

  resendEmail (email: string) {
    return this.http.post(`${environment.baseUrl}/api/resendVerificationEmail`, { email })
  }

  resendText (phone: string, carrier: string) {
    return this.http.post(`${environment.baseUrl}/api/resendVerificationText`, { phone, carrier })
  }

  removeEmail (email: string) {
    return this.http.delete(`${environment.baseUrl}/api/user/email/${email}`)
  }

  removePhone (phone: string) {
    return this.http.delete(`${environment.baseUrl}/api/user/phone/${phone}`)
  }

  deleteAccount () {
    return this.http.delete(`${environment.baseUrl}/api/user`)
  }

  getBible (version: string, chapter: number | string) {
    return this.http.get(`${environment.baseUrl}/api/bible/${version}/${chapter}`)
  }
}
