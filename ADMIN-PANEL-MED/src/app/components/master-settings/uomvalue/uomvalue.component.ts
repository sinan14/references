import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { UomValueService } from 'src/app/services/uom-value.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UomService } from 'src/app/services/uom.service';
import Swal from 'sweetalert2';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-uomvalue',
  templateUrl: './uomvalue.component.html',
  styleUrls: ['./uomvalue.component.scss'],
})
export class UOMValueComponent implements OnInit, OnDestroy {
  activeUoms: any;
  hasError: boolean = false;
  public gridView: GridDataResult;
  public skip=0;
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

  public settings = {
    mode: 'external',
    actions: {
      columnTitle: '',
      add: false,
      position: 'right',
    },
    columns: {
      no: {
        title: 'No',
      },
      uomtitle: {
        title: 'UOM Name',
      },
      uomvalue: {
        title: 'UOM Value',
      },
    },
  };

  public closeResult: string;

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public addFlag: boolean;

  constructor(
    private _router: Router,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private location: Location,
    public _uomValueService: UomValueService,
    private _uomService: UomService
  ) {}
  /***
   * ! below lines edited by sinan
   * ! ======================================================================
   */

  uomValueForm = new FormGroup({
    uomId: new FormControl(null, [Validators.required]),
    uomValueId: new FormControl(null),
    uomValue: new FormControl(null, [Validators.required]),
    isDisabled: new FormControl(false, [Validators.required]),
  });
  onAddOrUpdateUomValue() {
    if (this.uomValueForm.invalid) {
      //console.log(`form is invalid`);
      this.hasError = true;
      return;
    }
    let title = this.uomValueForm.value.uomValue;
    let wsRegex = /^\s+|\s+$/g;
    let result = title.replace(wsRegex, '');
    this.uomValueForm.patchValue({
      uomValue:result
    })
    if (this.uomValueForm.invalid) {
      //console.log(`form is invalid`);
      this.hasError = true;
      return;
    }
    if (this.add_Modal_Flag) {
      //console.log('from add \n');
      //console.log(this.uomValueForm.value);
      this._uomValueService.createUomValue(this.uomValueForm.value).subscribe(
        (res: any) => {
          if (res.status) {
            //console.log(`success` + res);

            Swal.fire({
              title: 'Done !!',
              text: `${res.data}`,
              icon: 'success',
              timer: 800,
              showConfirmButton: false,
            }).then(() => {
              this.ngOnInit();
            });
          } else {
            //console.log('erro in adding');
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${res.data}`,
              showConfirmButton: true,
            }).then(() => {});
          }
        },
        (err) => {
          //console.log('error from add' + err);
          Swal.fire({
            title: 'Danger!!',
            text: 'server refused to connect',
            icon: 'error',
            showConfirmButton: true,
          }).then((refresh) => {});
        }
      );
    } else {
      //console.log('from edit \n');
      //console.log(this.uomValueForm.value);

      this._uomValueService.updateUomValue(this.uomValueForm.value).subscribe(
        (res: any) => {
          if (res.status) {
            //console.log('edited' + res);
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
            //console.log('error in editing');
            //console.log(res);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${res.data}!`,
              showConfirmButton: true,
            }).then(() => {});
          }
        },
        (error: any) => {
          //console.log('db error' + error);
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
  onDeleteUomValue(id) {
    //console.log('from delete fn' + id);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this._uomValueService.deleteUomValueById(id).subscribe(
          (res: any) => {
            if (res.status) {
              //console.log(res);
              this.ngOnInit();

              Swal.fire({
                title: 'Done',
                text: 'deleted successfully',
                icon: 'info',
                timer: 1000,
                showConfirmButton: false,
              }).then(() => {});
            } else {
              //console.log('eror from delete ' + res);
              Swal.fire({
                title: 'sorry!!',
                text: `${res.data}`,
                icon: 'info',

                showConfirmButton: true,
              }).then(() => {});
            }
          },
          (error) => {
            //console.log(error);
            Swal.fire({
              title: 'oops!!',
              text: 'That thing is still around',
              icon: 'question',
              showConfirmButton: true,
            }).then((refresh) => {});
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  
  updateDisableStatus(_id, uomValue, uomId, isDisabled) {
    this.uomValueForm.setValue({
      uomId: uomId,
      uomValue: uomValue,
      uomValueId: _id,
      isDisabled: !isDisabled,
    });
    //console.log(this.uomValueForm.value);
    this._uomValueService.updateUomValue(this.uomValueForm.value).subscribe(
      (res: any) => {
        if (res.status) {
          //console.log('edited' + res);
          Swal.fire({
            title: 'Done !!',
            text: 'status changed successfully',
            icon: 'success',
            timer: 1000,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
            confirmButtonAriaLabel: 'Thumbs up, great!',
          }).then(() => {
            this.ngOnInit();
          });
        } else {
          //console.log('error in editing' + res);
          Swal.fire({
            title: 'oops!!',
            text: `${res.data}`,
            icon: 'error',
            showConfirmButton: true,
          }).then(() => {
            this.ngOnInit();
          });
        }
      },
      (error: any) => {
        //console.log('db error' + error);
        Swal.fire({
          title: 'Danger!!',
          text: 'server refused to connect',
          icon: 'error',
          showConfirmButton: true,
        }).then(() => {});
      }
    );
  }

  ngOnInit(): void {
    this.hasError = false;
    this.update_Modal_Flag = false;
    this.add_Modal_Flag = false;
    this.modalService.dismissAll();
    this._uomValueService.fetchUomValues().subscribe(
      (res: any) => {
        if (res.status) {
          //console.log(res.data);
          this._uomValueService.uomValues = [];
          res.data.forEach((item, index) => {
            this._uomValueService.uomValues.push(
              JSON.parse(JSON.stringify(item))
            );
            this._uomValueService.uomValues[index].no = index + 1;
          });
          //console.log('uomValue is');
          //console.log(this._uomValueService.uomValues);
        } else {
          //console.log(`error from fetching ${res}`);
          //console.log(res);
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
        //console.log(error.message);
      }
    );
    this._uomService.fetchActiveUoms().subscribe(
      (res: any) => {
        if (res.status) {
          this.activeUoms = [];
          this.activeUoms = JSON.parse(JSON.stringify(res.data));
        } else {
          //console.log(`error from fetching ${res}`);
          //console.log(res);
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
        //console.log(error.message);
      }
    );

    /**
     * !======================================================================
     * Above  is edited
     */
    //console.log(this.location.path().split('/').pop());
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
    this.addFlag = this.permissionService.addFlag;
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
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

  editRow(event, content, Value) {
    ////console.log('event: ', event)
    if (Value === 'edit') {
      this.add_Modal_Flag = false;
      this.update_Modal_Flag = true;
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

  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  open(content, uomid, uomvalue, id, disabledStatus, Value: any) {
    if (Value === 'add') {
      this.hasError = false;
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.uomValueForm.reset();
      this.uomValueForm.patchValue({
        isDisabled: false,
      });
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
      this.hasError = false;
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      // //console.log( uomvalue, id);
      this.uomValueForm.patchValue({
        uomId: uomid,
        uomValue: uomvalue,
        uomValueId: id,
        isDisabled: disabledStatus,
      });
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
  // public vendors = [
  //   {
  //     no: '1',
  //     uomtitle: 'Pack Of',
  //     uomvalue: '100gm x 3',
  //   },
  //   {
  //     no: '2',
  //     uomtitle: 'Flavour',
  //     uomvalue: 'Spring Blossom',
  //   },
  //   {
  //     no: '3',
  //     uomtitle: 'Weight',
  //     uomvalue: 'Spring Blossom',
  //   },
  //   {
  //     no: '4',
  //     uomtitle: 'Pack Of',
  //     uomvalue: 'Fresh Linen',
  //   },
  //   {
  //     no: '5',
  //     uomtitle: 'Size',
  //     uomvalue: 'NABIL',
  //   },
  //   {
  //     no: '6',
  //     uomtitle: 'Color',
  //     uomvalue: 'KISMET',
  //   },
  // ];
  isValid(controlName) {
    return (
      (this.uomValueForm.get(controlName).invalid &&
        this.uomValueForm.get(controlName).touched) ||
      (this.hasError && this.uomValueForm.get(controlName).invalid)
    );
  }
  ngOnDestroy() {
    this.activeUoms = [];
    this._uomValueService.uomValues = [];
  }
}
