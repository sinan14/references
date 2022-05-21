import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StoreHomeService } from 'src/app/services/store-home.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('otpBox1') otp1: ElementRef;
  @ViewChild('otpBox2') otp2: ElementRef;
  @ViewChild('otpBox3') otp3: ElementRef;
  @ViewChild('otpBox4') otp4: ElementRef;
  @ViewChild('otpBox5') otp5: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('openUser') openUser: ElementRef;

  private onlyEnglishLetters: any = /^[a-zA-Z ]*$/;
  private emailReg: any = /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/i;
  private otpReg = new RegExp('^[0-9]+$');
  public hasAddress: boolean = false;
  // public last2Digit: number;
  // private hasErrorNumber: boolean = false;
  public hasErrorOtp: boolean = false;
  public userAddresses: any = [];
  private hasErrorUser: boolean = false;
  public phoneForm: FormGroup = new FormGroup({
    phone: new FormControl(null, [Validators.required]),
  });

  public otpForm: FormGroup = new FormGroup({
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
    fifth: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(9),
      Validators.pattern(this.otpReg),
    ]),
  });
  public userForm: FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.emailReg),
    ]),
    first_name: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.onlyEnglishLetters),
    ]),
    last_name: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.onlyEnglishLetters),
    ]),
  });
  constructor(
    private _router: Router,
    public _auth: AuthService,
    private _storeHome: StoreHomeService
  ) {}
  ngOnInit(): void {
    this.listAddresses();
  }

  resendOtp() {
    if (this._auth.timeLeft > 0) {
      return;
    }
    const body = {
      mobile: this._auth.intlNumber.mobile,
      countryCode: this._auth.intlNumber.countryCode,
      code: this._auth.intlNumber.code,
    };
    console.log(body);
    this._auth.resendOtp(body).subscribe(
      (res: any) => {
        this._auth.startTimer();
      },
      (e: HttpErrorResponse) => {
        this.serverError(e);
      }
    );
  }
  retypeNumber() {
    this.otpForm.reset();
    this.closeModals();
    this.openOtp();
  }

  submitOtp() {
    console.log(this.otpForm.value);
    if (this.otpForm.invalid) {
      this.hasErrorOtp = false;
      return;
    }
    const otp1 = this.otpForm.value.first.toString();
    const otp2 = this.otpForm.value.second.toString();
    const otp3 = this.otpForm.value.third.toString();
    const otp4 = this.otpForm.value.fourth.toString();
    const otp5 = this.otpForm.value.fifth.toString();
    const OTP = otp1 + otp2 + otp3 + otp4 + otp5;
    console.log(this._auth.intlNumber);
    const body = {
      otp: OTP,
      lang: 'english',
      mobile: this._auth.intlNumber.mobile,
      countryCode: this._auth.intlNumber.countryCode,
      code: this._auth.intlNumber.code,
    };
    // console.log(body);
    this._auth.verifyOtp(body).subscribe(
      (res: any) => {
        this.otpForm.reset();

        this.closeModal.nativeElement.click();

        if (res.data.toScreen === 'know_more') {
          // this.openUser.nativeElement.click();

          Swal.fire({
            icon: 'success',
            title: 'Mobile number verified',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 1000,
          }).then(() => {
            this.openUserModal();
          });
        }
        if (
          res.data.toScreen === 'address' ||
          res.data.toScreen === 'userName'
        ) {
          Swal.fire({
            icon: 'success',
            title: 'Mobile number verified',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 1000,
          }).then(() => {
            this._auth.setUser(res.data.api_key);
            this.openAddressModal();
          });
        }
        this._auth.setUser(res.data.api_key);
      },
      (e: HttpErrorResponse) => {
        this.serverError(e);
      }
    );
  }

  setFocus1() {
    if (this.otpForm.valid && this.otpForm.get('fifth').valid) {
      this.submitOtp();
    } else {
      this.otpForm.patchValue({ fifth: null });
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
    if (this.otpForm.get('fourth').valid) {
      this.otp5.nativeElement.focus();
    } else {
      this.otpForm.patchValue({ fourth: null });
    }
  }
  submitUserDetails() {
    console.log(this.userForm.value);

    if (this.userForm.invalid) {
      this.hasErrorUser = true;
      return;
    }
    this.hasErrorUser = false;

    this._auth.submitUserData(this.userForm.value).subscribe(
      (res: any) => {
        console.log(res);
        this.openAddressModal();
      },
      (e) => this.serverError(e)
    );
  }
  handleLogin(res: any) {}

  serverError(error: any) {
    console.log(error.error);
    Swal.fire(error.error.message, '', 'error');
  }

  isValidUser(controlName: any) {
    return (
      (this.userForm.get(controlName)!.invalid &&
        this.userForm.get(controlName)!.touched) ||
      (this.hasErrorUser && this.userForm.get(controlName).invalid)
    );
  }
  gotomapNew() {
    this._router.navigate([`/address/new`]);
  }
  gotomap(address) {
    this._auth.addressToUpdate = address;
    localStorage.setItem('addressToUpdate', JSON.stringify(address));
    this._router.navigate([`/complete-address/update`]);
  }
  listAddresses() {
    this._auth.getUserAddresses().subscribe(
      (res: any) => {
        if (res.status) {
          this.hasAddress = true;
          this.userAddresses = res.data;
          // this._storeHome.deliveryAddressId = res.data[0]._id;
          // console.log(this.userAddresses);
        }
      },
      (e) => {
        console.log(e.error);
      }
    );
  }
  deleteAddress(id) {
    this._auth.deleteAddress({ id }).subscribe(
      (res: any) => {
        Swal.fire('Address deleted successfully', '', 'success');
      },
      (e) => {
        this.serverError(e);
      }
    );
  }
  selectAddress(id) {
    this._storeHome.deliveryAddressId = id;
    console.log(this._storeHome.deliveryAddressId);
  }

  ngAfterViewInit() {
    $(document).on('click', '.second-div h4', function () {
      $('.second-div h4').removeClass('border');
      $(this).addClass('border');
    });
  }
  openAddressModal() {
    document.getElementById('openAddress').click();
    document.getElementById('h40').click();
  }
  openUserModal() {
    document.getElementById('openUser').click();
  }
  closeModals() {
    document.getElementById('closeModal').click();
  }
  openOtp() {
    document.getElementById('openOtp').click();
  }
}
