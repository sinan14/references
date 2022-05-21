import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CouponService {
  public _api: string = environment.baseUrl;
  constructor(private _http: HttpClient) {}
  fetchCoupons(): Observable<any> {
    return this._http
      .get(`${this._api}/user/get_web_coupon_by_user`)
      .pipe(catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
