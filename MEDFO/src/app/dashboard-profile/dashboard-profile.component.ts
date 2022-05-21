import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { UserDashboardService } from 'src/app/services/user-dashboard.service';
import Swal from 'sweetalert2';
import { UserAuthService } from '../services/user-auth.service';
@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.css'],
})
export class DashboardProfileComponent implements OnInit {
  personal_info: any = {};
  medical_Info: any = {};
  public medicalForm: FormGroup;
  public incompleteData: boolean = false;
  onlyEnglishLetters = /^[a-z]+$/i;
  // emailReg = /^[a-z0-9.%+]+@[a-z09.-]+.[a-z]{2,4}/;
  emailReg: any = /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/i;

  // phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  phoneReg: any = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  public showOrHidePersonal: boolean = true;
  public bgroup: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  public clickToShow() {
    this.showOrHidePersonal = !this.showOrHidePersonal;
  }
  public floatReg: any = /^(?!0\d)\d*(\.\d+)?$/;
  public today: any = this.getToday();
  public reasonForm: FormGroup;
  public medicalLoading: boolean = false;
  public personalLoading: boolean = false;
  public toggleCnfPass: boolean = true;
  public toggleNewPass: boolean = true;
  public toggleOldPass: boolean = true;
  public togglePassTypeOld() {
    this.toggleOldPass = !this.toggleOldPass;
  }
  public togglePassTypeNew() {
    this.toggleNewPass = !this.toggleNewPass;
  }
  public togglePassTypeCnf() {
    this.toggleCnfPass = !this.toggleCnfPass;
  }
  constructor(
    public _userService: UserDashboardService,
    private _auth: UserAuthService,
    private _fb: FormBuilder,
    private router: Router
  ) {
    if (this._auth.loggedIn() == false) {
      this.router.navigate(['/']);
    }
  }
  onCheckboxChange(e) {
    const reason: FormArray = this.reasonForm.get('reason') as FormArray;
    if (e.target.checked) {
      reason.push(new FormControl(this.reasons[e.target.value].name));
    } else {
      const index = reason.controls.findIndex(
        (x) => x.value === this.reasons[e.target.value].name
      );
      reason.removeAt(index);
    }
  }

  public errorPersonalForm: boolean = false;
  public errorMedicalForm: boolean = false;
  public hasErrorPass: boolean = false;
  public invalidReason: boolean = false;
  public reasons: any = [
    { id: 0, name: 'The reason did not meet the expectations' },
    { id: 1, name: 'I am not willing to share my details' },
    { id: 2, name: 'The questions were inappropriate' },
    { id: 3, name: 'I’ll do it later' },
    { id: 4, name: 'Technical issues' },
  ];

  getMedicalDetails() {
    this._userService.getMedicalInfo().subscribe(
      (res: any) => {
        if (res.error == false) {
          this.medical_Info = res.data;
          //console.log(this.medical_Info);
          this.patchMedicalForm(this.medical_Info);
        } else {
          //console.log('onh no error');
        }
      },
      (error: any) => {
        //console.log('oh no error occure from server');
        //console.log(error);
      }
    );
  }
  onSubmitPersonal2() {
    // this.patchPesonalForm2(this.personalForm.value);
    //console.log(this.personalForm2.value);
    if (
      this.personalForm.get('email').invalid ||
      this.personalForm.get('name').invalid ||
      this.personalForm.get('phone').invalid
    ) {
      this.errorPersonalForm = true;
      //console.log('error in personal');
      this.openReason();
      return;
    } else {
      this.clickToShow();
    }
  }

  submitPersonalToDb() {
    this.personalLoading = true;
    this.reasonForm.reset();
    this._userService.addPersonalInfo(this.personalForm.value).subscribe(
      (res: any) => {
        this.personalLoading = false;
        //console.log('personal');
        if (res.error == false) {
          this._userService.getPersonalDetails();
          // this._userService.refreshPerson();
          if (this.incompleteData) {
            Swal.fire({
              icon: 'success',
              title:
                'We value your reason and the remaining profile details updated successfully',
            }).then(() => {
              this.getPersonalDetails();
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Updated successfully',
            }).then(() => {
              this.getPersonalDetails();
            });
          }
        } else {
          //console.log('personal');
          Swal.fire({
            icon: 'error',
            title: `${res.message}`,
          });
        }
      },
      (err: any) => {
        this.personalLoading = false;
        this.serverErr(err);
      }
    );
  }

  onSubmitMedical() {
    this.patchPesonalForm2(this.personalForm.value);
    //console.log(this.medicalForm.value);
    if (this.medicalForm.invalid) {
      //console.log('invalid medical');
      this.errorMedicalForm = true;
      return;
    } else if (this.personalForm2.invalid) {
      this.errorMedicalForm = false;
      this.openReason();
    } else {
      this.errorMedicalForm = false;
      this.saveMedicalToDb();
    }
  }
  saveMedicalToDb() {
    this.medicalLoading = true;
    this._userService.addMedicalInfo(this.medicalForm.value).subscribe(
      (res: any) => {
        this.medicalLoading = false;
        if (res.error == false) {
          this.submitPersonalToDb();
          //console.log('add medical');
          this.getMedicalDetails();
        } else {
          Swal.fire({
            icon: 'error',
            title: `${res.message}`,
          });
        }
      },
      (err: any) => {
        this.medicalLoading = false;
        this.serverErr(err);
      }
    );
  }

  ngOnInit(): void {
    this.getPersonalDetails();
    this._userService.personalUpdated.subscribe((data: any) => {
      this.getPersonalDetails();
    });
    this.medicalLoading = false;
    this.personalLoading = false;
    this.getMedicalDetails();
    this.reasonForm = this._fb.group({
      comment: this._fb.control('', Validators.required),
      reason: this._fb.array([], [Validators.required]),
    });
    this.medicalForm = this._fb.group({
      currentMed: ['false'],
      currentMedDetails: [''],
      allergies: ['false'],
      allergyDetails: [''],
      pastMed: ['false'],
      pastMedDetails: [''],
      chronicDisease: ['false'],
      chronicDiseaseDetails: [''],
      injuries: ['false'],
      injuryDetails: [''],
      surgeries: ['false'],
      surgeryDetails: [''],
    });

    this.medicalForm.get('surgeries').valueChanges.subscribe((val) => {
      if (this.medicalForm.get('surgeries').value == 'true') {
        this.medicalForm.controls['surgeryDetails'].setValidators([
          Validators.required,
        ]);
      } else {
        this.medicalForm.controls['surgeryDetails'].clearValidators();
      }
      this.medicalForm.controls['surgeryDetails'].updateValueAndValidity();
    });
    this.medicalForm.get('injuries').valueChanges.subscribe((val) => {
      if (this.medicalForm.get('injuries').value == 'true') {
        this.medicalForm.controls['injuryDetails'].setValidators([
          Validators.required,
        ]);
      } else {
        this.medicalForm.controls['injuryDetails'].clearValidators();
      }
      this.medicalForm.controls['injuryDetails'].updateValueAndValidity();
    });
    this.medicalForm.get('chronicDisease').valueChanges.subscribe((val) => {
      if (this.medicalForm.get('chronicDisease').value == 'true') {
        this.medicalForm.controls['chronicDiseaseDetails'].setValidators([
          Validators.required,
        ]);
      } else {
        this.medicalForm.controls['chronicDiseaseDetails'].clearValidators();
      }
      this.medicalForm.controls[
        'chronicDiseaseDetails'
      ].updateValueAndValidity();
    });
    this.medicalForm.get('pastMed').valueChanges.subscribe((val) => {
      if (this.medicalForm.get('pastMed').value == 'true') {
        this.medicalForm.controls['pastMedDetails'].setValidators([
          Validators.required,
        ]);
      } else {
        this.medicalForm.controls['pastMedDetails'].clearValidators();
      }
      this.medicalForm.controls['pastMedDetails'].updateValueAndValidity();
    });
    this.medicalForm.get('allergies').valueChanges.subscribe((val) => {
      if (this.medicalForm.get('allergies').value == 'true') {
        this.medicalForm.controls['allergyDetails'].setValidators([
          Validators.required,
        ]);
      } else {
        this.medicalForm.controls['allergyDetails'].clearValidators();
      }
      this.medicalForm.controls['allergyDetails'].updateValueAndValidity();
    });
    this.medicalForm.get('currentMed').valueChanges.subscribe((val) => {
      if (this.medicalForm.get('currentMed').value == 'true') {
        this.medicalForm.controls['currentMedDetails'].setValidators([
          Validators.required,
        ]);
      } else {
        this.medicalForm.controls['currentMedDetails'].clearValidators();
      }
      this.medicalForm.controls['currentMedDetails'].updateValueAndValidity();
    });
  }

  personalForm = this._fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(this.onlyEnglishLetters)],
    ],
    surname: ['', [Validators.pattern(this.onlyEnglishLetters)]],
    dob: [''],
    bloodGroup: [''],
    gender: [''],
    maritalStatus: [''],
    height: [
      '',
      [
        Validators.pattern(this.floatReg),
        Validators.max(255),
        Validators.min(1),
      ],
    ],
    weight: [
      '',
      [
        Validators.pattern(this.floatReg),
        Validators.max(255),
        Validators.min(1),
      ],
    ],
    email: ['', [Validators.required, Validators.pattern(this.emailReg)]],
    phone: ['', Validators.required, Validators.pattern(this.phoneReg)],
  });
  personalForm2 = this._fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(this.onlyEnglishLetters)],
    ],
    surname: ['', [Validators.pattern(this.onlyEnglishLetters)]],
    dob: ['', Validators.required],
    bloodGroup: ['', Validators.required],
    gender: ['', Validators.required],
    maritalStatus: ['', Validators.required],
    height: ['', [Validators.required, Validators.pattern(this.floatReg)]],
    weight: ['', [Validators.required, Validators.pattern(this.floatReg)]],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(this.emailReg)]],
  });

  patchPesonalForm(val) {
    this.personalForm.patchValue({
      phone: val.phone,
      email: val.email,
      name: val.name,
      bloodGroup: val.bloodGroup,
      dob: val.dob,
      gender: val.gender,
      height: val.height,
      maritalStatus: val.maritalStatus,
      weight: val.weight,
      surname: val.surname,
    });
  }
  patchPesonalForm2(val) {
    this.personalForm2.patchValue({
      phone: val.phone,
      email: val.email,
      name: val.name,
      bloodGroup: val.bloodGroup,
      dob: val.dob,
      gender: val.gender,
      height: val.height,
      maritalStatus: val.maritalStatus,
      weight: val.weight,
      surname: val.surname,
    });
  }
  patchMedicalForm(val) {
    this.medicalForm.patchValue({
      currentMed: val.currentMed,
      currentMedDetails: val.currentMedDetails,
      allergies: val.allergies,
      allergyDetails: val.allergyDetails,
      pastMed: val.pastMed,
      pastMedDetails: val.pastMedDetails,
      chronicDisease: val.chronicDisease,
      chronicDiseaseDetails: val.chronicDiseaseDetails,
      injuries: val.injuries,
      injuryDetails: val.injuryDetails,
      surgeries: val.surgeries,
      surgeryDetails: val.surgeryDetails,
    });
  }

  emptyCurrentMedDetails() {
    this.medicalForm.patchValue({
      currentMedDetails: '',
    });
  }
  emptyAllergyDetails() {
    this.medicalForm.patchValue({
      allergyDetails: '',
    });
  }
  emptyPastMedDetails() {
    this.medicalForm.patchValue({
      pastMedDetails: '',
    });
  }
  emptyChronicMedDetails() {
    this.medicalForm.patchValue({
      chronicDiseaseDetails: '',
    });
  }
  emptyInjuryMedDetails() {
    this.medicalForm.patchValue({
      injuryDetails: '',
    });
  }
  emptySurjeryMedDetails() {
    this.medicalForm.patchValue({
      surgeryDetails: '',
    });
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
  invalidPersonal(controlName: any) {
    return (
      (this.personalForm.get(controlName)!.invalid &&
        this.personalForm.get(controlName)!.touched) ||
      (this.errorPersonalForm && this.personalForm.get(controlName).invalid)
    );
  }
  invalidMedical(controlName: any) {
    return (
      (this.medicalForm.get(controlName)!.invalid &&
        this.medicalForm.get(controlName)!.touched) ||
      (this.errorMedicalForm && this.medicalForm.get(controlName).invalid)
    );
  }
  changePasswordForm: FormGroup = this._fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmNewPassword: [
      '',
      [Validators.required, Validators.minLength(8), this.passValidator],
    ],
  });
  passValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const cnfpassValue = control.value;

      const passControl = control.root.get('newPassword');
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
  isInvalidChangePass(controlName: any) {
    return (
      (this.changePasswordForm.get(controlName)!.invalid &&
        this.changePasswordForm.get(controlName)!.touched) ||
      (this.hasErrorPass && this.changePasswordForm.get(controlName).invalid)
    );
  }
  updatePassword() {
    if (this.changePasswordForm.invalid) {
      this.hasErrorPass = true;
      //console.log(this.changePasswordForm.value);

      return;
    } else {
      this.hasErrorPass = false;
      this.savePswToDb();
    }
  }
  savePswToDb() {
    document.getElementById('dismiss-change-password').click();
    this._userService
      .changeUserPassword(this.changePasswordForm.value)
      .subscribe(
        (res: any) => {
          //console.log(res);
          //console.log(this.changePasswordForm.value);
          if (res.error == false) {
            Swal.fire({
              icon: 'success',
              title: 'password changed successfully',
              showConfirmButton: false,
            }).then(() => {
              this.resetPassForm();
            });
          } else {
            this.errAlert(res.message);
          }
        },
        (err: any) => {
          //console.log(err);
        }
      );
  }

  submitReason() {
    if (
      this.reasonForm.get('comment')!.invalid &&
      this.reasonForm.get('reason')!.invalid
    ) {
      this.invalidReason = true;
      return;
    } else {
      document.getElementById('dismiss-reason-for-not-completing').click();
      this.invalidReason = false;
      this.saveReasonToDb();
    }
  }
  saveReasonToDb() {
    this._userService
      .uploadReasonForNotCompletingPersonalForm(this.reasonForm.value)
      .subscribe(
        (res: any) => {
          if (res.error == false) {
            //console.log('reason');
            this.saveMedicalToDb();
            this.resetReason();
          } else {
            this.errAlert(res.message);
          }
        },
        (err: any) => {
          this.serverErr(err);
        }
      );
  }
  errAlert(message) {
    Swal.fire({
      icon: 'error',
      title: `${message}`,
    });
  }
  serverErr(e) {
    //console.log(e);
  }
  resetReason() {
    this.invalidReason = false;
    this.reasonForm.reset();
  }
  resetPassForm() {
    this.hasErrorPass = false;
    this.changePasswordForm.reset();
  }
  getPersonalDetails() {
    this._userService.getPersonalInfo().subscribe(
      (res: any) => {
        if (res.error == false) {
          this.personal_info = JSON.parse(JSON.stringify(res.data));
          this.patchPesonalForm(JSON.parse(JSON.stringify(res.data)));
        } else {
          //console.log('onh no error');
        }
      },
      (error: any) => {
        //console.log('oh no error occure from server');
        //console.log(error);
      }
    );
  }
  openReason() {
    document.getElementById('rrr').click();
    this.incompleteData = true;
  }
  closeReason() {
    document.getElementById('dismiss-reason-for-not-completing').click();
    this.showOrHidePersonal = true;
  }
  validateAge() {
    if (this.personalForm.get('age')!.invalid) {
      this.personalForm.patchValue({
        age: null,
      });
    }
  }
  validateHeight() {
    if (this.personalForm.get('height')!.invalid) {
      this.personalForm.patchValue({
        height: null,
      });
    }
  }
  validateWeight() {
    if (this.personalForm.get('weight')!.invalid) {
      this.personalForm.patchValue({
        weight: null,
      });
    }
  }
}
