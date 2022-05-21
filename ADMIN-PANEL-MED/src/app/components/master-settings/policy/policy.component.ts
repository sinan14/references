import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { PolicyService } from 'src/app/services/policy.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
})
export class PolicyComponent implements OnInit {
  hasError: boolean = false;
  public gridView: GridDataResult;
  public skip=0;
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

  public closeResult: string;
  public listArticle: Array<string> = [
    'Artilce 1',
    'Artilce 2',
    'Artilce 3',
    'Artilce 4',
  ];

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
    public _policyService: PolicyService
  ) {}

  ngOnInit(): void {
    this.update_Modal_Flag = false;
    this.add_Modal_Flag = false;
    this.modalService.dismissAll();
    this._policyService.fetchPolicies().subscribe(
      (res: any) => {
        if (res.status) {
          this._policyService.policies = [];
          //console.log(res.data);
          res.data.forEach((item, index) => {
            this._policyService.policies.push(JSON.parse(JSON.stringify(item)));
            this._policyService.policies[index].no = index + 1;
          });
          //console.log('policy is');
          //console.log(this._policyService.policies);
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

  open(content, id, Name, cancelTime, returnTime, status, Value: any) {
    if (Value === 'add') {
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.hasError = false;
      this.hasError = false;
      this.policyForm.reset();
      this.policyForm.patchValue({
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
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.hasError = false;
      this.policyForm.setValue({
        policyId: id,
        title: Name,
        cancel: cancelTime,
        return: returnTime,
        isDisabled: status,
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

  policyForm = new FormGroup({
    policyId: new FormControl(null),
    title: new FormControl(null, [Validators.required]),
    cancel: new FormControl(null, [Validators.required, Validators.min(0)]),
    return: new FormControl(null, [Validators.required, Validators.min(0)]),
    isDisabled: new FormControl(false, [Validators.required]),
  });

  onAddOrUpdate() {
    if (this.policyForm.invalid) {
      //console.log(this.policyForm.value);
      //console.log(`form is invalid`);
      this.hasError = true;
      return;
    }
    //console.log(this.policyForm.value);
    let title = this.policyForm.value.title;
    let wsRegex = /^\s+|\s+$/g;
    let result = title.replace(wsRegex, '');
    this.policyForm.patchValue({
      title:result
    })
    if (this.policyForm.invalid) {
      //console.log(this.policyForm.value);
      //console.log(`form is invalid`);
      this.hasError = true;
      return;
    }
    this.hasError = false;
    if (this.add_Modal_Flag) {
      //console.log('from add \n');
      //console.log(this.policyForm.value);
      this._policyService.createPolicy(this.policyForm.value).subscribe(
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
            //console.log(res.data);
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
      //console.log(this.policyForm.value);

      this._policyService.updatePolicy(this.policyForm.value).subscribe(
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
        this._policyService.deletePolicyById(id).subscribe(
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
  onUpdateStatus(id, Name, cancelTime, returnTime, status) {
    this.policyForm.setValue({
      policyId: id,
      title: Name,
      cancel: cancelTime,
      return: returnTime,
      isDisabled: !status,
    });
    //console.log(this.policyForm.value);
    this._policyService.updatePolicy(this.policyForm.value).subscribe(
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

  isValid(controlName) {
    return (
      (this.policyForm.get(controlName).invalid &&
        this.policyForm.get(controlName).touched) ||
      (this.hasError && this.policyForm.get(controlName).invalid)
    );
  }
}
