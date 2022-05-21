import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedcoinService {
  constructor(private _http: HttpClient) {}
  public _API = environment.apiUrl;

  fetchSegmentWiseCustomers(segment) {
    return this._http.post(
      `${this._API}/admin/get_customers_by_segment`,
      segment
    );
  }
  getMedCoinDetails() {
    return this._http.get(`${this._API}/admin/med_coin_details`);
  }


  rechargeMedcoinAdmin(value) {
    return this._http
      .post(`${this._API}/admin/recharge_med_coin`, value)
      .pipe(catchError(this.handleError));
  }
  withDrawMedcoinAdmin(value) {
    return this._http
      .post(`${this._API}/admin/withdraw_med_coin`, value)
      .pipe(catchError(this.handleError));
  }
  payMedcoin(value) {
    //console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    //console.log(value);
    return this._http
      .post(`${this._API}/admin/pay_med_coin`, value)
      .pipe(catchError(this.handleError));
  }
  redeemMedcoin(value) {
    return this._http
      .post(`${this._API}/admin/withdraw_med_coin_from_user`, value)
      .pipe(catchError(this.handleError));
  }
  getMedCoinStatement(val) {
    return this._http
      .post(`${this._API}/admin/get_med_coin_statements`, val)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
