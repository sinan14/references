import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PremiumMembershipService {
  public _api: string = environment.baseUrl;
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  constructor(private _http: HttpClient) {}
  get_customer_premium_membeship_details(): Observable<any> {
    return this._http
      .get(
        `${this._api}/customer/get_customer_premium_membeship_details/:customerId`
      )
      .pipe(catchError(this.handleError));
  }
  get_user_membership_benefits(): Observable<any> {
    return this._http
      .get(`${this._api}/user/get_user_membership_benefits`)
      .pipe(catchError(this.handleError));
  }
}
