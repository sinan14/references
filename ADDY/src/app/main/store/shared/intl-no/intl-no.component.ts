import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-intl-no',
  templateUrl: './intl-no.component.html',
  styleUrls: ['./intl-no.component.css'],
})
export class IntlNoComponent implements OnInit {
  private phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  private hasErrorNumber: boolean = false;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];

  verifyNumberForm: FormGroup = new FormGroup({
    phone: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    countryCode: new FormControl(null, [Validators.required]),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(this.phoneReg),
    ]),
  });
  isValidPhone(controlName: any) {
    return (
      (this.verifyNumberForm.get(controlName).invalid &&
        this.verifyNumberForm.get(controlName).touched) ||
      (this.hasErrorNumber && this.verifyNumberForm.get(controlName).invalid)
    );
  }

  extractNum() {
    console.log(this.verifyNumberForm.value);
    if (this.verifyNumberForm.get('phone').value === null) {
      this.hasErrorNumber = true;
      return;
    }
    this.verifyNumberForm.patchValue({
      code: this.verifyNumberForm.get('phone').value.dialCode.substring(1),
      countryCode: this.verifyNumberForm.get('phone').value.countryCode,
      mobile: this.verifyNumberForm
        .get('phone')
        .value.number.replace(/\s/g, '')
        .replace(/\D/g, ''),
    });
    if (this.verifyNumberForm.invalid) {
      this.hasErrorNumber = true;
      return;
    }
    this.hasErrorNumber = false;
    console.log(this.verifyNumberForm.value);
    const num = { ...this.verifyNumberForm.value };
    delete num.phone;
    this._auth.getOtp(num).subscribe(
      (res: any) => {
        console.log(res);
        this._auth.intlNumber = num;
        this._auth.startTimer();
        Swal.fire({
          icon: 'success',
          title: 'An otp has sent to given number',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 1000,
        }).then(() => {
          this.verifyNumberForm.reset();
          document.getElementById('openOtp').click();
        });
      },
      (error) => {
        console.log(error.error);
        this._auth.sw('error', error.error.message);
      }
    );
    // this.last2Digit = this.verifyNumberForm
    //   .get('phone')
    //   .value.toString()
    //   .slice(-2);
    //console.log('last 2 digint is ' + this.lastTwoDigit);
  }

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {}
  onCountryChange(e: any) {
    console.log(e);
  }
  telInputObject(obj) {
    console.log(obj);
    obj.setCountry('in');
  }
}
