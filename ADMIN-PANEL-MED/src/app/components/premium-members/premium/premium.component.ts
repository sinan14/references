import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PremiumService } from '../../../services/premium.service';
import Swal from 'sweetalert2';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss'],
})
export class PremiumComponent implements OnInit {
  public gridView: GridDataResult;
  public skip = 0;
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }
  premiumData: any;
  allowFloat: any = /^\-?\d+((\.|\,)\d+)?$/;
  specialProducts: any;
  hasError: boolean = false;
  hasErrorSp: boolean = false;
  allowEdit: boolean;
  premiumForm: FormGroup = new FormGroup({
    _id: new FormControl(null, Validators.required),
    cashBack: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(this.allowFloat),

      Validators.max(100),
    ]),
    freeDelivery: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(this.allowFloat),
    ]),
    miniMumOffer: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
      Validators.pattern(this.allowFloat),
    ]),
  });

  specialForm: FormGroup = new FormGroup({
    _id: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    month: new FormControl(null, [
      Validators.required,

      Validators.min(0),
      Validators.max(1000),
    ]),

    price: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\-?\d+((\.|\,)\d+)?$/),

      Validators.min(0),
    ]),
    specialPrice: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\-?\d+((\.|\,)\d+)?$/),
      Validators.min(0),
      this.priceValidator,
    ]),
    // referAndEarn: new FormControl(null),
  });

  public closeResult: string;
  public accountForm: FormGroup;
  public permissionForm: FormGroup;

  public media = [];

  public settings = {
    columns: {
      img: {
        title: 'Image',
        type: 'html',
      },
      file_name: {
        title: 'File Name',
      },
      url: {
        title: 'Url',
      },
    },
  };

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editPermFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public addFlag: boolean;

  public config1: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
  };

  constructor(
    private modalService: NgbModal,
    private _router: Router,
    private _premiumService: PremiumService,
    private permissionService: PermissionService,
    private location: Location
  ) {
    this.media = mediaDB.data;
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop());
    }
    this.hasError = false;
    this.hasErrorSp = false;
    this.allowEdit = false;
    this.modalService.dismissAll();
    this.fetchDetails();
    this.fetchSpecials();
  }
  premiumDetails() {
    this._premiumService.premiumDetails();
  }
  fetchDetails() {
    this._premiumService.fetchPremiumBenefitDetails().subscribe(
      (res: any) => {
        if (res.status) {
          console.log(res);

          this.premiumData = JSON.parse(JSON.stringify(res.data[0]));
          this.premiumData.totalActivePremiumUserCount = JSON.parse(
            JSON.stringify(res.totalActivePremiumUserCount)
          );
          this.premiumData.totalPremiumUserCount = JSON.parse(
            JSON.stringify(res.totalPremiumUserCount)
          );
          this.premiumForm.setValue({
            _id: this.premiumData._id,
            freeDelivery: this.premiumData.freeDelivery,
            cashBack: this.premiumData.cashBack,
            miniMumOffer: this.premiumData.miniMumOffer,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${res.data}!`,
            showConfirmButton: true,
          });
        }
      },
      (error) => {
        //console.log('🥵🥵🥵🥵🥵🥵');
        //console.log(error);
      }
    );
  }

  disableTab(value) {
    if (this.user.isAdmin === true) {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editPermFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    } else if (this.user.isStore === true) {
      let flag = this.permissionService.setPrivilages(value, this.user.isStore);
      this.editPermFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    } else {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editPermFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
  }

  isValidSp(controlName) {
    return (
      (this.specialForm.get(controlName).invalid &&
        this.specialForm.get(controlName).touched) ||
      (this.hasErrorSp && this.specialForm.get(controlName).invalid)
    );
  }
  isValid(controlName) {
    return (
      (this.premiumForm.get(controlName).invalid &&
        this.premiumForm.get(controlName).touched) ||
      (this.hasErrorSp && this.premiumForm.get(controlName).invalid)
    );
  }

  onEdit() {
    this.allowEdit = true;
    //console.log(this.editFlag);
  }
  onSave() {
    //console.log(this.editFlag);
    //console.log(this.premiumForm.value);
    if (this.premiumForm.invalid) {
      this.hasError = true;
      //console.log('error in updating ');
      //console.log(this.premiumForm.value);
      return;
    } else {
      this.hasError = false;
      this._premiumService
        .updatePremiumBenefitDetais(this.premiumForm.value)
        .subscribe(
          (res: any) => {
            if (res.status) {
              Swal.fire({
                icon: 'success',
                title: 'success',
                text: `${res.data}!`,
                timer: 7000,
              }).then(() => {
                this.allowEdit = false;

                this.fetchDetails();
              });
            } else {
              this.allowEdit = false;
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${res.data}!`,
                showConfirmButton: true,
              });
            }
          },
          (error) => {
            //console.log('🥵🥵🥵🥵🥵🥵');
            //console.log(error);
          }
        );
    }
  }
  fetchSpecials() {
    this._premiumService.fetchPremiumSpecial().subscribe(
      (res: any) => {
        if (res.status) {
          this.specialProducts = [];
          res.data.forEach((item, index) => {
            this.specialProducts.push(JSON.parse(JSON.stringify(item)));
            this.specialProducts[index].no = index + 1;
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${res.data}!`,
            showConfirmButton: true,
          });
        }
      },
      (error) => {
        //console.log('🥵🥵🥵🥵🥵🥵');
        //console.log(error);
      }
    );
  }

  updateSpecial() {
    if (this.specialForm.invalid) {
      //console.log('error in updating specila');
      //console.log(this.premiumForm.value);
      this.hasErrorSp = true;
      return;
    } else {
      //console.log(this.specialForm.value);
      this.hasError = false;
      this._premiumService
        .updatePremiumSpecial(this.specialForm.value)
        .subscribe(
          (res: any) => {
            if (res.status) {
              Swal.fire({
                icon: 'success',
                title: 'success',
                text: `Updated successfully`,
                timer: 7000,
              }).then(() => {
                this.hasErrorSp = false;
                this.fetchSpecials();
                this.modalService.dismissAll();
              });
            } else {
              //console.log(res);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${res.data}!`,
                showConfirmButton: true,
              }).then(() => {
                this.hasErrorSp = false;
                this.modalService.dismissAll();
              });
            }
          },
          (error) => {
            //console.log('🥵🥵🥵🥵🥵🥵');
            //console.log(error);
          }
        );
    }
  }
  /**
   * !🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑
   */

  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  open(content, id, name, month, price, specialPrice, Value: any) {
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
      this.specialForm.patchValue({
        _id: id,
        name: name,
        month: month,
        price: price,
        specialPrice: specialPrice,
      });
      //console.log(this.specialForm.value);
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

  public editFlag: boolean = false;
  editButtonChange(event: any) {
    //alert(event.target.type);
    if (event.target.type === 'button') {
      this.editFlag = true;
    } else {
      this.editFlag = false;
    }
  }

  priceValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const specialPrice = control.value;

      const priceControl = control.root.get('price');
      if (priceControl) {
        const price = priceControl.value;
        if (price < specialPrice || price === '') {
          return {
            isError: true,
          };
        }
      }
    }

    return null;
  }
}
