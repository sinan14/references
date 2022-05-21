import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MSPreferenceService } from 'src/app/services/ms-preference.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
})
export class PreferenceComponent implements OnInit {
  hasError: boolean = false;
  preferences: any;
  // preference = {
  //   deliveryTimeFrom: '09:00',
  //   deliveryTimeTo: '08:00',
  //   minFreeDeliveryAmount: 1000,
  //   minPurchaseAmount: 500,
  //   prescription: true,
  //   _id: '6152b7b1454f1a17e97a0793',
  // };

  public listStore: Array<string> = [
    'Store 1',
    'Store 2',
    'Store 3',
    'Store 4',
  ];
  public listPincode: Array<string> = [
    'Pincode 1',
    'Pincode 2',
    'Pincode 3',
    'Pincode 4',
  ];

  public closeResult: string;
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  constructor(
    private modalService: NgbModal,
    private _route: Router,
    private intl: IntlService,
    private _router: Router,
    private permissionService: PermissionService,
    private location: Location,
    public _preferenceService: MSPreferenceService
  ) {}

  firstReg: any = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;
  preferForm = new FormGroup({
    preferenceId: new FormControl(null, [Validators.required]),
    prescription: new FormControl(null, [Validators.required]),
    deliveryTimeTo: new FormControl(null, [Validators.required]),
    deliveryTimeFrom: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.firstReg),
    ]),
    minPurchaseAmount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
    ]),
    minFreeDeliveryAmount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
    ]),
    maxMedcoinUse: new FormControl(null, [Validators.required]),
    paymentType: new FormControl(null, [Validators.required]),
  });
  onSubmitPreferences() {
    if (this.preferForm.invalid) {
      //console.log(this.preferForm.value);
      this.hasError = true;
      return;
    } else {
      //console.log('on edit');
      this.hasError = false;
      //console.log(this.preferForm.value);
      this._preferenceService.updatepreference(this.preferForm.value).subscribe(
        (res: any) => {
          if (res.status) {
            Swal.fire({
              title: 'Done !!',
              text: `${res.data}`,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            }).then(() => {
              this.ngOnInit();
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${res.data}!`,
              showConfirmButton: true,
            }).then(() => {});
          }
        },
        (err: any) => {
          //console.log(err);
          Swal.fire({
            title: 'Danger!!',
            text: 'server refused to connect',
            icon: 'error',
            showConfirmButton: true,
          }).then((refresh) => {});
        }
      );
    }
  }
  onSubmit() {
    //console.log('kkoooooooooooooo');
    this.preferForm.setValue({
      preferenceId: this.preferences._id,
      prescription: this.preferences.prescription,
      deliveryTimeTo: this.preferences.deliveryTimeTo,
      deliveryTimeFrom: this.preferences.deliveryTimeFrom,
      minPurchaseAmount: this.preferences.minPurchaseAmount,
      minFreeDeliveryAmount: this.preferences.minFreeDeliveryAmount,
      maxMedcoinUse: this.preferences.maxMedcoinUse,
      paymentType: this.preferences.paymentType,
    });
    this.onSubmitPreferences();
  }

  ngOnInit(): void {
    this.hasError = false;
    this.modalService.dismissAll();
    this._preferenceService.fetchpreferences().subscribe(
      (res: any) => {
        if (res.status) {
          //console.log(res.data);
          this.preferences = JSON.parse(JSON.stringify(res.data[0]));
          //console.log('preferences is');
          //console.log(this.preferences);
        } else {
          //console.log(`error from fetching ${res}`);
          Swal.fire({
            title: 'oops!!',
            text: `${res.data}`,
            icon: 'error',
            timer: 800,
            showConfirmButton: false,
          }).then(() => {});
        }
      },
      (error) => {
        //console.log('🥵🥵🥵🥵🥵');
        //console.log(error.message);
      }
    );

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(
        this.location.path().split('/').pop()
      );
      //console.log(this.permissions);
    }
  }

  disableTab(value) {
    let flag = this.permissionService.setBoxPrivilege(value, this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  open(content, Value: any) {
    //console.log(Value);
    if (Value === 'add') {
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (Value === 'edit') {
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      // this.preferForm.patchValue({
      //   preferenceId: this.preferences._id,
      //   prescription: this.preferences.prescription,
      //   deliveryTimeTo: this.preferences.deliveryTimeTo,
      //   deliveryTimeFrom: this.preferences.deliveryTimeFrom,
      //   minPurchaseAmount: this.preferences.minPurchaseAmount,
      //   minFreeDeliveryAmount: this.preferences.minFreeDeliveryAmount,
      // });

      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (Value === '') {
      this.update_Modal_Flag = false;
      this.add_Modal_Flag = false;
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  BackRedirectTo() {
    this._router.navigate(['/delivery-boys']);
  }
  isValid(controlName) {
    return (
      (this.preferForm.get(controlName).invalid &&
        this.preferForm.get(controlName).touched) ||
      (this.hasError && this.preferForm.get(controlName).invalid)
    );
  }
  closeForms() {
    this.preferForm.reset();
    // //console.log(this.preferForm.value);
    this.ngOnInit();
  }
}
