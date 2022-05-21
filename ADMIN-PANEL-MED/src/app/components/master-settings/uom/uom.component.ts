import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { UomService } from 'src/app/services/uom.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss'],
})
export class UOMComponent implements OnInit {
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
        title: 'UOM Title',
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
    public _uomService: UomService
  ) {}

  /**
   * ! below lines is inserted by sinan
   * !1111111111111111111111111111111
   */
  uomForm = new FormGroup({
    uomId: new FormControl(null),
    title: new FormControl(null, [Validators.required]),
    isDisabled: new FormControl(false, [Validators.required]),
  });

  onAddOrUpdateUom() {
    if (this.uomForm.invalid) {
      ////console.log(this.uomForm);
      this.hasError = true;
      return;
    }
    let title = this.uomForm.value.title;
    let wsRegex = /^\s+|\s+$/g;
    let result = title.replace(wsRegex, '');

    this.uomForm.patchValue({
      title: result,
    });

    if (this.uomForm.invalid) {
      ////console.log(this.uomForm);
      this.hasError = true;
      return;
    }

    if (this.add_Modal_Flag) {
      ////console.log('on add');
      ////console.log(this.uomForm.value);

      this._uomService.createUom(this.uomForm.value).subscribe(
        (res: any) => {
          if (res.status) {
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
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${res.data}`,
              footer: '<a href="">Try Another Name?</a>',
              showConfirmButton: true,
            }).then(() => {});
          }
        },
        (err: any) => {
          Swal.fire({
            title: 'Danger!!',
            text: 'server refused to connect',
            icon: 'error',
            showConfirmButton: true,
          }).then((refresh) => {});
        }
      );
    } else {
      ////console.log('on edit');
      ////console.log(this.uomForm.value);
      this._uomService.updateUom(this.uomForm.value).subscribe(
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
              footer: '<a href="">Try Another Name?</a>',
              showConfirmButton: true,
            }).then(() => {});
          }
        },
        (err: any) => {
          ////console.log(err);
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
  onDeleteUom(id) {
    ////console.log('from delete fn' + id);
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
        this._uomService.deleteUomById(id).subscribe(
          (res: any) => {
            if (res.status) {
              ////console.log(res);
              this.ngOnInit();

              Swal.fire({
                title: 'Done',
                text: 'deleted successfully',
                icon: 'info',
                timer: 1000,
                showConfirmButton: false,
              }).then(() => {});
            } else {
              ////console.log('eror from delete ' + res);
              Swal.fire({
                title: 'sorry!!',
                text: `${res.data}`,
                icon: 'info',

                showConfirmButton: true,
              }).then(() => {});
            }
          },
          (error) => {
            console.log(error);
            // Swal.fire({
            //   title: 'oops!!',
            //   text: 'That thing is still around',
            //   icon: 'question',
            //   showConfirmButton: true,
            // })
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  updateStatus(uomId, title, isDisabled) {
    this.uomForm.setValue({
      uomId: uomId,
      title: title,
      isDisabled: !isDisabled,
    });
    ////console.log(this.uomForm.value);
    this._uomService.updateUom(this.uomForm.value).subscribe(
      (res: any) => {
        if (res.status) {
          ////console.log('edited' + res);
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
          ////console.log('error in editing' + res);
          Swal.fire({
            title: 'oops!!',
            text: `${res.message}`,
            icon: 'error',
            showConfirmButton: true,
          }).then(() => {
            this.ngOnInit();
          });
        }
      },
      (error: any) => {
        ////console.log('db error' + error);
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
    ////console.log('component initializing');
    this._uomService.fetchUoms().subscribe(
      (res: any) => {
        if (res.status) {
          ////console.log(res.data);
          this._uomService.uoms = [];
          res.data.forEach((item, index) => {
            this._uomService.uoms.push(JSON.parse(JSON.stringify(item)));
            this._uomService.uoms[index].no = index + 1;
          });
          ////console.log('uomValue is');
          ////console.log(this._uomService.uoms);
        } else {
          ////console.log(res);
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
        ////console.log(error.message);
      }
    );

    /**
     * ! above lines is inseted by sinan
     * !11111111111111111111111
     */
    ////console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(
        this.location.path().split('/').pop()
      );
      ////console.log(this.permissions);
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
    //////console.log('event: ', event)
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

  open(content, id: any, title: any, Value: any) {
    if (Value === 'add') {
      this.hasError = false;
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;

      this.uomForm.reset();
      this.uomForm.patchValue({
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

      this.uomForm.patchValue({
        uomId: id,
        title: title,
      });
      ////console.log(this.uomForm.value);

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
      this.hasError = false;
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

  isValid(controlName) {
    return (
      (this.uomForm.get(controlName).invalid &&
        this.uomForm.get(controlName).touched) ||
      (this.hasError && this.uomForm.get(controlName).invalid)
    );
  }
  ngOnDestroy() {
    this._uomService.uoms = [];
  }
}
