import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer: any;
  public addressToUpdate: any;
  public deliveryLocation: any;

  public intlNumber: any = {
    code: '91',
    countryCode: 'IN',
    mobile: '1234567890',
  };
  public timeLeft: number = 30;
  private interval;
  private _api: string = environment.baseUrl;
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  constructor(private _http: HttpClient, private _router: Router) {}
  getOtp(data) {
    const endPoint = `${this._api}/user/account/customer_login`;
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  resendOtp(data) {
    const endPoint = `${this._api}/user/account/resend_otp`;

    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  verifyOtp(data) {
    const endPoint = `${this._api}/user/account/verify_otp`;

    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  submitUserData(data) {
    const endPoint = `${this._api}/user/account/update_user_info`;

    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }

  sw(icon, title, text = '') {
    Swal.fire({
      text,
      icon,
      title,
      showCancelButton: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      imageHeight: 1000,
    });
  }
  startTimer() {
    this.timeLeft = 30;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.pauseTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timeLeft = 0;
    clearInterval(this.interval);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
  autoLogin() {
    const token = this.getToken();
    if (!token) {
      return;
    }
    const expiresIn = JSON.parse(localStorage.getItem('expirationDuration'));
    const expirationDuration =
      new Date(expiresIn).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }

  logout() {
    this._router.navigate(['/']);
    localStorage.removeItem('token');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  setUser(token: any) {
    localStorage.setItem('token', token);
    const exp = 1000 * 60 * 60 * 24 * 7;
    const expirationDuration = new Date(new Date().getTime() + exp);
    //todo we mimic full authentication here
    localStorage.setItem('token_status', 'true');
    localStorage.setItem(
      'expirationDuration',
      JSON.stringify(expirationDuration)
    );
    this.autoLogout(exp);
  }
  //todo we mimic full authentication here

  fullyAuthenticate() {
    localStorage.setItem('token_status', 'true');
  }
  getToken() {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   return JSON.parse(token);
    // }
    return localStorage.getItem('token');
    // return null;
  }

  checkToken() {
    const token = !!localStorage.getItem('token');
    const token_status = localStorage.getItem('token_status');
    if (token && token_status === 'true') {
      return true;
    } else {
      return false;
    }
  }
  //! delivery address

  getUserAddresses() {
    const endPoint = `${this._api}/user/account/get-user-address`;

    return this._http.get(endPoint).pipe(catchError(this.handleError));
  }

  addNewDeliveryAddresses(data) {
    const endPoint = `${this._api}/user/account/add-user-address`;
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  updateDeliveryAddresses(data) {
    //id must be given here
    const endPoint = `${this._api}/user/account/update-user-address`;
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  deleteAddress(id: any) {
    const endPoint = `${this._api}/user/account/update-user-address`;
    return this._http.delete(endPoint, id).pipe(catchError(this.handleError));
  }
  getCurrency() {
    const endPoint = 'https://api.exchangerate-api.com/v4/latest/USD';
    return this._http.get(endPoint).pipe(catchError(this.handleError));
  }
}
