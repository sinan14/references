import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private tokenExpirationTimer: any;

  public _API = environment.baseUrl;
  loginStatusChanged = new EventEmitter<any>();
  emitLoginStatus() {
    this.addExpirationTime();
    // this.loginStatusChanged.emit(true);
    console.log('start checking cart');
    // this._cartService.checkLocalCart(); //check item in local storage
    // this._cartService.setLiveCartData(); //set Live Cart
    console.log('cart checked');
    window.location.reload();
  }
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _socialAuthService: SocialAuthService,
    public _cartService: CartService
  ) {}

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  autoLogout(expirationDuration: any) {
    console.log('this is from auto logout');

    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.removeCredentials();
      console.log('this is from auto logout success');
    }, expirationDuration);
  }
  removeCredentials() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('expirationDuration');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  autoLogin() {
    const token = !!localStorage.getItem('token');

    if (!token) {
      return;
    }
    const expiresIn = JSON.parse(localStorage.getItem('expirationDuration'));
    console.log('this is from auto login');

    console.log(expiresIn);

    const expirationDuration =
      new Date(expiresIn).getTime() - new Date().getTime();

    this.autoLogout(expirationDuration);
  }

  addExpirationTime() {
    const data = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
    localStorage.setItem('expirationDuration', JSON.stringify(data));
    this.autoLogout(1000 * 60 * 60 * 24 * 7);
  }
  // addExpirationTime() {
  //   const data = new Date(new Date().getTime() + 60000);
  //   localStorage.setItem('expirationDuration', JSON.stringify(data));
  //   this.autoLogout(60000);
  // }

  signOut(): void {
    this._socialAuthService.signOut();
  }
  logout() {
    if (this.loggedIn()) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this !`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, sign out!',
        cancelButtonText: 'No, keep me logged in',
        imageHeight: 50,
      }).then((result) => {
        if (result.value) {
          this.removeCredentials();
          this.signOut();
          this._router.navigate(['/']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } else {
    }
  }
  getToken() {
    return localStorage.getItem('token');
  }
  getGuestToken() {
    return localStorage.getItem('guestToken');
  }
  isGuestIn() {
    return !!localStorage.getItem('guestToken');
  }
  loggedIn() {
    const token = !!localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (token && userType === 'true') {
      return true;
    } else {
      return false;
    }
  }
  isHaveToken() {
    return !!localStorage.getItem('token');
  }

  submitNumverForVerify(phone: any): Observable<any> {
    return this._http
      .post(`${this._API}/user/verify_number`, phone)
      .pipe(catchError(this.handleError));
  }
  verifyOtp(otpAdndNumber: any): Observable<any> {
    return this._http
      .post(`${this._API}/user/verify_OTP`, otpAdndNumber)
      .pipe(catchError(this.handleError));
  }
  createUser(userData: any): Observable<any> {
    return this._http
      .post(`${this._API}/user/update_profile`, userData)
      .pipe(catchError(this.handleError));
  }
  signInWithPassword(phAndPsw: any): Observable<any> {
    return this._http
      .post(`${this._API}/user/signin`, phAndPsw)
      .pipe(catchError(this.handleError));
  }
  getOtpForSignin(phone: any): Observable<any> {
    return this._http
      .post(`${this._API}/user/signin_otp`, phone)
      .pipe(catchError(this.handleError));
  }
  recoverPassword(credentials: any): Observable<any> {
    return this._http
      .post(`${this._API}/user/reset_password`, credentials)
      .pipe(catchError(this.handleError));
  }
  requestOtpToRecoverPassword(phone: any): Observable<any> {
    return this._http
      .post(`${this._API}/user/forgot_password_otp`, phone)
      .pipe(catchError(this.handleError));
  }
  gooLogin(tok): Observable<any> {
    return this._http
      .post(`${this._API}/user/signin-with-google`, tok)
      .pipe(catchError(this.handleError));
  }
  gooLoginUpdateNumber(number): Observable<any> {
    return this._http
      .post(`${this._API}/user/social-account-update-number`, number)
      .pipe(catchError(this.handleError));
  }
  gooVerifyOtp(number): Observable<any> {
    return this._http
      .post(`${this._API}/user/social-account-verify-otp`, number)
      .pipe(catchError(this.handleError));
  }
  fbLogin(tok): Observable<any> {
    return this._http
      .post(`${this._API}/user/signin-with-facebokk`, tok)
      .pipe(catchError(this.handleError));
  }

  // 143.110.240.107:8000/user/social-account-verify-otp //number,otp
  // 143.110.240.107:8000/user/social-account-update-number //number
  //143.110.240.107:8000/user/signin-with-google //token access_token
  showModal() {
    document.getElementById('login-button').click();
  }
  gotoPrivacyPolicy() {
    this._router.navigate(['/privacy-policy']);
  }
  navigateToTerms() {
    this._router.navigate(['/terms-and-conditions']);
  }
}
