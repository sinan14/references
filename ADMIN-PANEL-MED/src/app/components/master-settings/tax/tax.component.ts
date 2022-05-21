import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterTaxService } from 'src/app/services/master-tax.service';
import Swal from 'sweetalert2';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss'],
})
export class TaxComponent implements OnInit {
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
      title: {
        title: 'Title',
      },
      charge: {
        title: 'Shipping Charge',
      },
    },
  };

  public Value: any;
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
    private _route: Router,
    private permissionService: PermissionService,
    private location: Location,
    public _taxService: MasterTaxService
  ) {}
  hasError: boolean = false;
   regexp = /^\S*$/;
  taxForm = new FormGroup({
    taxId: new FormControl(null),
    title: new FormControl(null, [Validators.required,]),
    percentage: new FormControl(null, [Validators.required, Validators.min(0),Validators.max(100)]),
    isDisabled: new FormControl(false, [Validators.required]),
  });

  onAddOrUpdateTax() {
    if (this.taxForm.invalid) {
      //console.log(this.taxForm.value);
      //console.log(`form is invalid`);
      this.hasError = true;
      return;
    }
    let title = this.taxForm.value.title;
    let wsRegex = /^\s+|\s+$/g;
    let result = title.replace(wsRegex, '');
    this.taxForm.patchValue({
      title:result
    })
    if (this.taxForm.invalid) {
      //console.log(this.taxForm.value);
      //console.log(`form is invalid`);
      this.hasError = true;
      return;
    }
    this.hasError = false;
    if (this.add_Modal_Flag) {
      //console.log('from add \n');
      //console.log(this.taxForm.value);
      this._taxService.createTax(this.taxForm.value).subscribe(
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
            //console.log('error in adding');

            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${res.data}`,
              footer: '<a href="">Try Another Value?</a>',
              showConfirmButton: true,
            }).then(() => {});
          }
        },
        (err) => {
          //console.log(err);
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
      //console.log(this.taxForm.value);

      this._taxService.updateTax(this.taxForm.value).subscribe(
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
            //console.log(res);

            //console.log('error in editing');
            //console.log(res);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${res.data}!`,
              footer: '<a href="">Try Another Name?</a>',
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
  onDelete(id) {
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
        this._taxService.deleteTaxById(id).subscribe(
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

  updateDisableStatus(id, taxName, taxPercentage, isDisabled) {
    this.taxForm.setValue({
      taxId: id,
      title: taxName,
      percentage: taxPercentage,
      isDisabled: !isDisabled,
    });
    //console.log(this.taxForm.value);
    this._taxService.updateTax(this.taxForm.value).subscribe(
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
    this.update_Modal_Flag = false;
    this.add_Modal_Flag = false;
    this.hasError = false;
    this.modalService.dismissAll();
    this._taxService.fetchTaxes().subscribe(
      (res: any) => {
        if (res.status) {
          this._taxService.taxes = [];
          res.data.forEach((item, index) => {
            this._taxService.taxes.push(JSON.parse(JSON.stringify(item)));
            this._taxService.taxes[index].no = index + 1;
          });
          //console.log('taxes is');
          //console.log(this._taxService.taxes);
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
        //console.log(error.message);
      }
    );

    /**
     * !======================================================================
     * Above  is edited
     */

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(
        this.location.path().split('/').pop()
      );
      //console.log(this.permissions);
    }
  }

  disableTab(value) {
    let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
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

  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;

  open(content, id, title, percentage, Value: any) {
    if (Value === 'add') {
      this.hasError = false;
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.taxForm.reset();
      this.taxForm.patchValue({
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
      this.taxForm.patchValue({
        taxId: id,
        title: title,
        percentage: percentage,
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
  //     no:"1",
  //     title : "GST",
  //     charge:"28"
  //   },
  //   {
  //     no:"2",
  //     title : "GST",
  //     charge:"28"
  //   },
  //   {
  //     no:"3",
  //     title : "GST",
  //     charge:"12"
  //   },
  //   {
  //     no:"4",
  //     title : "GST",
  //     charge:"18"
  //   },
  //   {
  //     no:"5",
  //     title : "NT",
  //     charge:"0"
  //   },
  //   {
  //     no:"6",
  //     title : "GST",
  //     charge:"28"
  //   },

  // ];
  // taxes: any = [];
  isValid(controlName) {
    return (
      (this.taxForm.get(controlName).invalid &&
        this.taxForm.get(controlName).touched) ||
      (this.hasError && this.taxForm.get(controlName).invalid)
    );
  }
  ngOnDestroy() {
    this._taxService.taxes = [];
  }
  
}
