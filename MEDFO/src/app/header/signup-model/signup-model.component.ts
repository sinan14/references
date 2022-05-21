import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import {
  FormControl,
  FormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { CartService } from 'src/app/services/cart.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-model',
  templateUrl: './signup-model.component.html',
  styleUrls: ['./signup-model.component.css'],
})
export class SignupModelComponent implements OnInit {
  public username: string = 'user';
  onlyEnglishLetters: any = /^[a-zA-Z ]*$/;
  // emailReg: any = /^[a-z0-9.%+]+@[a-z09.-]+.[a-z]{2,4}/;
  emailReg: any = /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/i;
  phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  public otpReg = new RegExp('^[0-9]+$');
  user: SocialUser;
  isSignedin: boolean = null;
  googleFlag: boolean = false;
  fbFlag: boolean = false;
  public phoneFlag: boolean = true;
  public phoneFlagSocial: boolean = false;
  public lastTwoDigit: string;
  public passFlag: boolean = false;
  public forgotPassFlag: boolean = false;
  public otpFlag: boolean = false;
  public otpFlagSocial: boolean = false;
  public newUserFlag: boolean = false;
  public userType: string;
  timeLeft: number = 60;
  interval;
  public hasErrorNumber: boolean;
  public hasErrorOtp: boolean;
  public hasErrorNumberSocial: boolean;
  public hasErrorOtpSocial: boolean;
  public hasErrorPassword: boolean;
  public hasErrorUser: boolean;
  public hasErrorForgot: boolean;

  phoneForm: FormGroup;
  otpForm: FormGroup;
  phoneFormSocial: FormGroup;
  otpFormSocial: FormGroup;
  verifyNumberForm: FormGroup;
  loginPasswordForm: FormGroup;
  userForm: FormGroup;
  recoverPassForm: FormGroup;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  verifyNumberFormSocial: FormGroup;

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  clickedGoogle() {
    this.googleFlag = true;
    this.fbFlag = false;
    //console.log('google clicked');
  }
  clickedFb() {
    this.googleFlag = false;
    this.fbFlag = true;
  }

  constructor(
    public _auth: UserAuthService,
    public _socialAuthService: SocialAuthService,
    private _router: Router
  ) {}

  @ViewChild('otpBox1') otp1: ElementRef;
  @ViewChild('otpBox2') otp2: ElementRef;
  @ViewChild('otpBox3') otp3: ElementRef;
  @ViewChild('otpBox4') otp4: ElementRef;
  @ViewChild('otpBox5') otp5: ElementRef;
  @ViewChild('otpBox6') otp6: ElementRef;
  @ViewChild('otpBox7') otp7: ElementRef;
  @ViewChild('otpBox8') otp8: ElementRef;
  @ViewChild('phone') phone1: ElementRef;
  @ViewChild('phoneSocial') phone2: ElementRef;

  @ViewChild('passwordOnly') psw1: ElementRef;
  @ViewChild('userEmail') newUserEmail: ElementRef;

  setFocus1() {
    if (this.otpForm.get('fourth').valid) {
      this.otp1.nativeElement.focus();
      this.OTPVerification();
    } else {
      this.otpForm.patchValue({ fourth: null });
    }
  }
  setFocus2() {
    if (this.otpForm.get('first').valid) {
      this.otp2.nativeElement.focus();
    } else {
      this.otpForm.patchValue({ first: null });
    }
  }
  setFocus3() {
    if (this.otpForm.get('second').valid) {
      this.otp3.nativeElement.focus();
    } else {
      this.otpForm.patchValue({ second: null });
    }
  }
  setFocus4() {
    if (this.otpForm.get('third').valid) {
      this.otp4.nativeElement.focus();
    } else {
      this.otpForm.patchValue({ third: null });
    }
  }
  setFocus5() {
    if (this.otpFormSocial.get('fourth').valid) {
      this.otp5.nativeElement.focus();
      this.OTPVerification();
    } else {
      this.otpFormSocial.patchValue({ fourth: null });
    }
  }
  setFocus6() {
    if (this.otpFormSocial.get('first').valid) {
      this.otp6.nativeElement.focus();
    } else {
      this.otpFormSocial.patchValue({ first: null });
    }
  }
  setFocus7() {
    if (this.otpFormSocial.get('second').valid) {
      this.otp7.nativeElement.focus();
    } else {
      this.otpFormSocial.patchValue({ second: null });
    }
  }
  setFocus8() {
    if (this.otpFormSocial.get('third').valid) {
      this.otp8.nativeElement.focus();
    } else {
      this.otpFormSocial.patchValue({ third: null });
    }
  }

  public isActiveForgotNewPass: boolean = false;
  public changePassType1() {
    this.isActiveForgotNewPass = !this.isActiveForgotNewPass;
  }
  public isActiveForgotCnfPass: boolean = false;
  public changePassType2() {
    this.isActiveForgotCnfPass = !this.isActiveForgotCnfPass;
  }
  public isActiveNewUserPass: boolean = false;
  public changePassType3() {
    this.isActiveNewUserPass = !this.isActiveNewUserPass;
  }
  public isActiveNewUserPass2: boolean = false;
  public changePassType4() {
    this.isActiveNewUserPass2 = !this.isActiveNewUserPass2;
  }
  public isActiveExistingUserPass: boolean = false;
  public changePassType5() {
    this.isActiveExistingUserPass = !this.isActiveExistingUserPass;
  }

  ngOnInit() {
    this.isActiveNewUserPass = true;
    this.isActiveNewUserPass2 = true;
    this.isActiveExistingUserPass = true;
    this.isActiveForgotNewPass = true;
    this.isActiveForgotCnfPass = true;
    this.hasErrorNumber = false;
    this.hasErrorOtp = false;
    this.hasErrorPassword = false;
    this.hasErrorUser = false;
    this.hasErrorForgot = false;
    this.phoneForm = new FormGroup({
      phone: new FormControl(null, [Validators.required]),
    });
    this.verifyNumberForm = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.phoneReg),
      ]),
    });
    this.otpForm = new FormGroup({
      first: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.otpReg),
      ]),
      second: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
        Validators.pattern(this.otpReg),
      ]),
      third: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
        Validators.pattern(this.otpReg),
      ]),
      fourth: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
        Validators.pattern(this.otpReg),
      ]),
    });

    this.phoneFormSocial = new FormGroup({
      phone: new FormControl(null, [Validators.required]),
    });
    this.verifyNumberFormSocial = new FormGroup({
      number: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.phoneReg),
      ]),
    });
    this.otpFormSocial = new FormGroup({
      first: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.otpReg),
      ]),
      second: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
        Validators.pattern(this.otpReg),
      ]),
      third: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
        Validators.pattern(this.otpReg),
      ]),
      fourth: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
        Validators.pattern(this.otpReg),
      ]),
    });

    this.loginPasswordForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.phoneReg),
      ]),
    });
    this.userForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.onlyEnglishLetters),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.emailReg),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      reEnterPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        this.passValidator,
      ]),
    });
    this.recoverPassForm = new FormGroup({
      otp: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern(this.otpReg),
      ]),
      phone: new FormControl(null, [Validators.required]),
      new_password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirm_new_password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        this.passValidatorForRecover,
      ]),
    });
    this._socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.isSignedin = user != null;
      console.log(this.user);
      if (this.isSignedin && (this.googleFlag || this.fbFlag)) {
        this.sendSocialLoginCredentials(this.user);
      }
    });
    this.phoneFlag = true;

    $(document).ready(function () {
      //@ts-ignore
      $('#phoneSlide').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: false,
        dots: true,
        autoplay: true,
        margin: 0,
      });
    });
    this.phoneFlagSocial = false;
    this.otpFlagSocial = false;
    this.passFlag = false;
    this.forgotPassFlag = false;
    this.otpFlag = false;
    this.newUserFlag = false;
    // this.toVerifyNumberPopUp();
    // this.toCreatePopUp();
    // this.toPasswordFormPopUp();
    // this.toOtpPopUp()
    // this.toForgotPasswordField();
    // this.toSocialNumberPopUp();
    // this.toSocialOtpPopUp();
  }

  sendSocialLoginCredentials(value) {
    if (this.googleFlag) {
      this.sendCredentialsGoogle(value);
      this.googleFlag = false;
    } else {
      this.sendCredentialsFB(value);
      this.fbFlag = false;
    }
  }
  sendCredentialsGoogle(val) {
    this._auth.gooLogin({ token: val.idToken }).subscribe(
      (res: any) => {
        //console.log(res);
        if (res.error === false) {
          this.username = JSON.parse(JSON.stringify(val.name));
          if (res.data.toScreen === 1) {
            this.handleLogin(res);
          } else if (res.data.toScreen === 0) {
            this.toSocialNumberPopUp();
            localStorage.setItem('token', res.data.token);
          } else {
          }
        } else {
          this.alertMsg('error', res.message);
        }
      },
      (error: any) => {
        this.serverError(error);
      }
    );
  }
  sendCredentialsFB(val) {
    this._auth.fbLogin({ token: val.idToken }).subscribe(
      (res: any) => {
        //console.log(res);
        if (res.error === false) {
          this.username = JSON.parse(JSON.stringify(val.name));

          if (res.data.toScreen === 1) {
            this.handleLogin(res);
          } else if (res.data.toScreen === 0) {
            this.toSocialNumberPopUp();
            localStorage.setItem('token', res.data.token);
          } else {
          }
        } else {
          this.alertMsg('error', res.message);
        }
      },
      (error: any) => {
        this.serverError(error);
      }
    );
  }

  signInWithGoogle(): void {
    this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this._socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  extractSocialNumber() {
    if (this.phoneFormSocial.get('phone').value === null) {
      this.hasErrorNumberSocial = true;
      return;
    }
    this.verifyNumberFormSocial.patchValue({
      number: this.phoneFormSocial
        .get('phone')
        .value.number.replace(/\s/g, '')
        .replace(/\D/g, ''),
    });
    this.validateSocialNum();
  }
  validateSocialNum() {
    //console.log(this.verifyNumberFormSocial.value);
    //console.log(this.verifyNumberFormSocial.get('number').value);
    if (this.verifyNumberFormSocial.invalid) {
      this.hasErrorNumberSocial = true;
      return;
    } else {
      this.hasErrorNumberSocial = false;
      this.lastTwoDigit = this.verifyNumberFormSocial
        .get('number')
        .value.toString()
        .slice(-2);
      //console.log('last 2 digint is ' + this.lastTwoDigit);
      this.sendSocialNumToDb();
    }
  }
  sendSocialNumToDb() {
    this._auth
      .gooLoginUpdateNumber(this.verifyNumberFormSocial.value)
      .subscribe((res: any) => {
        if (res.error == false) {
          //console.log(res);
          this.toSocialOtpPopUp();
        } else {
          this.alertMsg('error', res.message);
        }
      }),
      (error: any) => {
        this.serverError(error);
      };
  }
  socialOtpVerification() {
    if (this.otpFormSocial.invalid) {
      //console.log(this.otpFormSocial.value);
      this.hasErrorOtpSocial = true;
      return;
    } else {
      this.hasErrorOtpSocial = false;
      const otp1 = this.otpFormSocial.value.first.toString();
      const otp2 = this.otpFormSocial.value.second.toString();
      const otp3 = this.otpFormSocial.value.third.toString();
      const otp4 = this.otpFormSocial.value.fourth.toString();
      const OTP = otp1 + otp2 + otp3 + otp4;
      const body = {
        otp: parseInt(OTP),
        number: this.verifyNumberFormSocial.get('number').value,
      };
      //console.log(body);
      this.gooVerifyOtp(body);
    }
  }
  gooVerifyOtp(data) {
    this._auth.gooVerifyOtp(data).subscribe((res: any) => {
      //console.log(res);
      if (res.error == false) {
        this.handleLogin(res);
      } else {
        this.alertMsg('error', res.message);
      }
    }),
      (error: any) => {
        this.serverError(error);
      };
  }

  extractNum() {
    if (this.phoneForm.get('phone').value === null) {
      this.hasErrorNumber = true;
      return;
    }
    this.verifyNumberForm.patchValue({
      phone: this.phoneForm
        .get('phone')
        .value.number.replace(/\s/g, '')
        .replace(/\D/g, ''),
    });
    this.validateNumber();
  }
  validateNumber() {
    //console.log(this.phoneForm.value);

    //console.log(this.verifyNumberForm.get('phone').value);
    if (this.verifyNumberForm.invalid) {
      this.hasErrorNumber = true;
      return;
    } else {
      this.hasErrorNumber = false;
      this.lastTwoDigit = this.verifyNumberForm
        .get('phone')
        .value.toString()
        .slice(-2);
      //console.log('last 2 digint is ' + this.lastTwoDigit);

      this.sendNumToDb();
    }
  }
  sendNumToDb() {
    this._auth
      .submitNumverForVerify(this.verifyNumberForm.value)
      .subscribe((res: any) => {
        //console.log(res);
        if (res.error == false) {
          if (res.data.mode == 1) {
            //existing user mode == 1;redirected to pass and otp login
            localStorage.setItem('userType', 'existingUser');
            this.toPasswordFormPopUp();
          } else if (res.data.mode == 0) {
            //new user mode == 0;otp got
            localStorage.setItem('userType', 'newUser');
            this.toOtpPopUp();
          } else {
          }
        } else {
          this.alertMsg('error', res.message);
        }
      }),
      (error: any) => {
        this.serverError(error);
      };
  }
  resendOtpSocial() {
    this.otpFormSocial.reset();
    this.timeLeft = 60;
    this.validateSocialNum();
  }
  reTypeNumberSocial() {
    this.toVerifyNumberPopUp();
    this.otpFormSocial.reset();
    this.phoneFormSocial.reset();
    this.verifyNumberFormSocial.reset();
  }
  resendOtp() {
    this.otpForm.reset();
    const userType = localStorage.getItem('userType');
    this.timeLeft = 60;
    if (userType == 'newUser') {
      this.validateNumber();
    } else {
      this.loginByOtp();
    }
  }
  reTypeNumber() {
    this.toVerifyNumberPopUp();
    this.otpForm.reset();
    this.phoneForm.reset();
    this.verifyNumberForm.reset();
  }

  OTPVerification() {
    if (this.otpForm.invalid) {
      //console.log(this.otpForm.value);
      this.hasErrorOtp = true;
      return;
    } else {
      this.hasErrorOtp = false;
      const otp1 = this.otpForm.value.first.toString();
      const otp2 = this.otpForm.value.second.toString();
      const otp3 = this.otpForm.value.third.toString();
      const otp4 = this.otpForm.value.fourth.toString();
      const OTP = otp1 + otp2 + otp3 + otp4;
      //console.log('hi');
      const body = {
        phone: this.verifyNumberForm.get('phone').value,
        otp: OTP,
      };
      const userType = localStorage.getItem('userType');
      if (userType === 'newUser') {
        this._auth.verifyOtp(body).subscribe((res: any) => {
          //console.log(res);
          if (res.error == false) {
            this.toCreatePopUp();
            localStorage.setItem('token', res.data.token);
          } else {
            this.alertMsg('error', res.message);
          }
        }),
          (error: any) => {
            this.serverError(error);
          };
      } else if (userType === 'existingUser') {
        this._auth.verifyOtp(body).subscribe((res: any) => {
          //console.log(res);
          if (res.error == false) {
            this.handleLogin(res);
          } else {
            this.alertMsg('error', res.message);
          }
        }),
          (error: any) => {
            this.serverError(error);
          };
      } else {
      }
    }
  }

  loginByPassword() {
    this.loginPasswordForm.patchValue({
      phone: this.verifyNumberForm.value.phone,
    });

    if (this.loginPasswordForm.invalid) {
      this.hasErrorPassword = true;
      return;
    } else {
      this.hasErrorPassword = false;

      this._auth
        .signInWithPassword(this.loginPasswordForm.value)
        .subscribe((res: any) => {
          //console.log(res);
          if (res.error == false) {
            this.handleLogin(res);
          } else {
            this.alertMsg('error', res.message);
          }
        });
    }
  }

  newUser() {
    //console.log('newuserForm');
    //console.log(this.userForm.value);
    if (this.userForm.invalid) {
      this.hasErrorUser = true;
      return;
    } else {
      this.hasErrorUser = false;
      this.saveNewUserToDb();
    }
  }
  saveNewUserToDb() {
    this._auth.createUser(this.userForm.value).subscribe(
      (res: any) => {
        //console.log(res);
        if (res.error == false) {
          this.handleLogin(res);
        } else {
          this.alertMsg('error', res.message);
        }
      },
      (error: any) => {
        this.serverError(error);
      }
    );
  }

  loginByOtp() {
    this._auth.getOtpForSignin(this.verifyNumberForm.value).subscribe(
      (res: any) => {
        //console.log(res);

        if (res.error == false) {
          this.toOtpPopUp();
        } else {
          this.alertMsg('error', res.message);
        }
      },
      (error: any) => {
        this.serverError(error);
      }
    );
  }

  forgotPassword() {
    this._auth
      .requestOtpToRecoverPassword(this.verifyNumberForm.value)
      .subscribe(
        (res: any) => {
          //console.log(res);
          if (res.error == false) {
            this.toForgotPasswordField();
            this.recoverPassForm.patchValue({
              phone: this.verifyNumberForm.value.phone,
            });
          } else {
            this.alertMsg('error', res.message);
          }
        },
        (error: any) => {
          this.serverError(error);
        }
      );
  }

  resetPassword() {
    //console.log(this.recoverPassForm.value);

    if (this.recoverPassForm.invalid) {
      //console.log(this.recoverPassForm.value);
      this.hasErrorForgot = true;
      return;
    } else {
      this.hasErrorForgot = false;
      this.sendResetPassword();
    }
  }
  sendResetPassword() {
    this._auth.recoverPassword(this.recoverPassForm.value).subscribe(
      (res: any) => {
        //console.log(res);
        if (res.error == false) {
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Successful!',
            text: `We've got you back. Your password has been changed successfully`,
          }).then(() => {
            //console.log('recover pass');
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userType', 'true');
            this._auth.emitLoginStatus();
          });
        } else {
          this.alertMsg('error', res.message);
        }
      },
      (error: any) => {
        this.serverError(error);
      }
    );
  }
  //myDiv11
  //this goes to start of every user

  toVerifyNumberPopUp() {
    this.closePopUp();
    this.phoneFlag = true;

    $(document).ready(function () {
      //@ts-ignore
      $('#phoneSlide').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: false,
        dots: true,
        autoplay: true,
        margin: 0,
      });
    });
  }
  toSocialNumberPopUp() {
    this.closePopUp();
    this.phoneFlagSocial = true;
    $(document).ready(function () {
      //@ts-ignore
      $('#phoneSlideSocial').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: false,
        dots: true,
        autoplay: true,
        margin: 0,
      });
    });
  }
  toSocialOtpPopUp() {
    this.closePopUp();
    this.otpFlagSocial = true;
    $(document).ready(function () {
      //@ts-ignore
      $('#otpSlideSocial').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: false,
        dots: true,
        autoplay: false,
        margin: 0,
      });
    });
    this.timeLeft = 60;
    this.startTimer();
    // $('#myModal').on('shown.bs.modal', function () {
    //   setTimeout(function () {
    //     $('#otpField1').focus();
    //   }, 1000);
    // });
    // setTimeout(function () {
    //   this.otp1.nativeElement.focus();
    // }, 1000);
  }
  //myDiv1
  //this goes to otp confirmation of new user and login with otp

  toOtpPopUp() {
    this.closePopUp();
    this.otpFlag = true;

    $(document).ready(function () {
      //@ts-ignore
      $('#otpSlide').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: false,
        dots: true,
        autoplay: false,
        margin: 0,
      });
    });
    this.timeLeft = 60;
    this.startTimer();
    // $('#myModal').on('shown.bs.modal', function () {
    //   setTimeout(function () {
    //     $('#otpField1').focus();
    //   }, 1000);
    // });
    // setTimeout(function () {
    //   this.otp1.nativeElement.focus();
    // }, 1000);
  }
  //myDiv2
  // this goes to existing user after verification of number

  toPasswordFormPopUp() {
    this.closePopUp();
    this.passFlag = true;

    $(document).ready(function () {
      //@ts-ignore
      $('#passwordSlide').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: false,
        dots: true,
        autoplay: false,
        margin: 0,
        responsive: {
          0: {
            items: 1,
          },
          400: {
            items: 1,
          },
          740: {
            items: 1,
          },
          940: {
            items: 1,
          },
        },
      });
    });
  }
  //myDiv3
  //this goes to new user to create profile

  toCreatePopUp() {
    this.closePopUp();
    this.newUserFlag = true;
    $(document).ready(function () {
      //@ts-ignore
      $('#userSlide').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: false,
        dots: true,
        autoplay: false,
        margin: 0,
      });
    });
  }

  // myDiv4
  // this goes to existing user who forgot password
  toForgotPasswordField() {
    this.closePopUp();
    this.forgotPassFlag = true;
    $(document).ready(function () {
      //@ts-ignore
      $('#recoverSlide').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: false,
        dots: true,
        autoplay: false,
        margin: 0,
      });
    });
  }
  closePopUp() {
    this.phoneFlag = false;
    this.passFlag = false;
    this.forgotPassFlag = false;
    this.otpFlag = false;
    this.newUserFlag = false;
    this.phoneFlagSocial = false;
    this.otpFlagSocial = false;
  }
  isValidPassword(controlName: any) {
    return (
      (this.loginPasswordForm.get(controlName)!.invalid &&
        this.loginPasswordForm.get(controlName)!.touched) ||
      (this.hasErrorPassword && this.loginPasswordForm.get(controlName).invalid)
    );
  }
  isValidForgotForm(controlName: any) {
    return (
      (this.recoverPassForm.get(controlName)!.invalid &&
        this.recoverPassForm.get(controlName)!.touched) ||
      (this.hasErrorForgot && this.recoverPassForm.get(controlName).invalid)
    );
  }
  isValidOtp(controlName: any) {
    return (
      (this.otpForm.get(controlName)!.invalid &&
        this.otpForm.get(controlName)!.touched) ||
      (this.hasErrorOtp && this.otpForm.get(controlName).invalid)
    );
  }
  inValidSocialOtp(controlName: any) {
    return (
      (this.otpFormSocial.get(controlName)!.invalid &&
        this.otpFormSocial.get(controlName)!.touched) ||
      (this.hasErrorOtpSocial && this.otpFormSocial.get(controlName).invalid)
    );
  }
  isValidUser(controlName: any) {
    return (
      (this.userForm.get(controlName)!.invalid &&
        this.userForm.get(controlName)!.touched) ||
      (this.hasErrorUser && this.userForm.get(controlName).invalid)
    );
  }
  isValidPhone(controlName: any) {
    return (
      (this.verifyNumberForm.get(controlName).invalid &&
        this.verifyNumberForm.get(controlName).touched) ||
      (this.hasErrorNumber && this.verifyNumberForm.get(controlName).invalid)
    );
  }
  inValidPhoneSocial(controlName: any) {
    return (
      (this.verifyNumberForm.get(controlName).invalid &&
        this.verifyNumberForm.get(controlName).touched) ||
      (this.hasErrorNumberSocial &&
        this.verifyNumberForm.get(controlName).invalid)
    );
  }
  passValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const cnfpassValue = control.value;

      const passControl = control.root.get('password');
      if (passControl) {
        const passValue = passControl.value;
        if (passValue !== cnfpassValue || passValue === '') {
          return {
            isError: true,
          };
        }
      }
    }

    return null;
  }
  passValidatorForRecover(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const cnfpassValue = control.value;

      const passControl = control.root.get('new_password');
      if (passControl) {
        const passValue = passControl.value;
        if (passValue !== cnfpassValue || passValue === '') {
          return {
            isError: true,
          };
        }
      }
    }

    return null;
  }

  //reset all forms
  closeForms() {
    this.verifyNumberForm.reset();
    this.otpForm.reset();
    this.userForm.reset();
    this.recoverPassForm.reset();
    this.loginPasswordForm.reset();
    this.toVerifyNumberPopUp();
    // this.ngOnInit();
  }
  //programatically clicks the dismiss
  closeModal() {
    this.closeForms();
    this.toVerifyNumberPopUp();
    document.getElementById('cancel-btn').click();
  }

  showModal() {
    document.getElementById('login-button').click();
  }

  handleLogin(res) {
    this.closeModal();
    localStorage.setItem('userType', 'true');
    const token = !!localStorage.getItem('token');
    //console.log('iam from handle login');

    if (token) {
      Swal.fire({
        icon: 'success',
        title: 'Congratulations!',
        text: `You've taken the first step towards a healthier life. Let's get started!`,
      }).then(() => {
        //console.log('iam from fresh signup');
        this._auth.emitLoginStatus();
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Login successful',
        text: 'You are back on track, Exciting offers are waiting for you',
      }).then(() => {
        //console.log('iam from existing login');
        localStorage.setItem('token', res.data.token);
        // this.username = JSON.parse(JSON.stringify(res.data.name));
        this._auth.emitLoginStatus();
      });
    }
  }

  alertMsg(val, msg) {
    Swal.fire({ icon: val, title: `${msg}` });
  }
  serverError(error) {
    //console.log('server refused to connect');
    //console.log(error.error);
  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        // this.timeLeft = 60;
        this.pauseTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timeLeft = 0;
    clearInterval(this.interval);
  }
  gotoPrivacyPolicy() {
    document.getElementById('cancel-btn').click();

    this._router.navigate(['/privacy-policy']);
  }
  navigateToTerms() {
    document.getElementById('cancel-btn').click();

    this._router.navigate(['/terms-and-conditions']);
  }
}
