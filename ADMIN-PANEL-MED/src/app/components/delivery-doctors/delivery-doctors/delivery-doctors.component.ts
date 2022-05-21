import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbTabset,
} from '@ng-bootstrap/ng-bootstrap';
// import { DatatableComponent } from '@swimlane/ngx-datatable';
// import { SharedServiceService } from 'src/app/shared-service.service';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-delivery-doctors',
  templateUrl: './delivery-doctors.component.html',
  styleUrls: ['./delivery-doctors.component.scss'],
})
export class DeliveryDoctorsComponent implements OnInit {
  maxDate: any;
  public gridView: GridDataResult;
  public skip = 0;
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

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

  public min: Date = new Date();
  public value: Date = new Date();
  public value1: Date = new Date();

  private tabSet: ViewContainerRef;
  @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
    this.tabSet = content;
  }
  selectedTab = '';
  ngAfterViewInit() {
    localStorage.clear();
    ////console.log(this.tabSet.activeTab);
  }

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public pending_min: any;
  public verified_min: any;
  public approved_min: any;
  public rejected_min: any;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private location: Location,
    private _doctorService: DoctorService
  ) {}
  public PendingDoctorsWithIndex: any = [];
  public VerifiedDoctorsWithIndex: any = [];
  public ApprovedDoctorsWithIndex: any = [];
  public RejectedDoctorsWithIndex: any = [];
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(
        this.location.path().split('/').pop()
      );
      //console.log(this.permissions);
    }
    this.fetchPendingDoctors();
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
  pending_date_form: FormGroup = new FormGroup({
    pending_start_date: new FormControl('', Validators.required),
    pending_end_date: new FormControl('', Validators.required),
  });
  getPendingStart(event: any) {
    this.pending_min = event.target.value;
    this.pending_date_form.patchValue({
      pending_end_date: '',
    });
  }

  getPendingEnd() {
    if (this.pending_date_form.get('pending_start_date').valid) {
      var e = this.pending_date_form.get('pending_end_date').value;
      var s = this.pending_date_form.get('pending_start_date').value;
      // var end = e + 'T11:59:59Z';
      var end = new Date(e);
      var b = end.toISOString();
      var start = new Date(s);
      var a = start.toISOString();
      //console.log(a, 'start');
      //console.log(end, 'end');
      let dt = {
        startDate: a,
        endDate: b,
        status: 'pending',
      };
      //console.log('😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁');
      //console.log(dt);
      this._doctorService.postDate(dt).subscribe(async (res: any) => {
        //console.log(res);
        if (res.status) {
          this.PendingDoctorsWithIndex = await JSON.parse(
            JSON.stringify(res.data)
          );
          this.createIndex(this.PendingDoctorsWithIndex);
        } else {
        }
      }),
        (err) => {
          //console.log(err);
        };
    }
  }

  pendingClear() {
    this.pending_date_form.reset();
    this.pending_min = '';
    this.fetchPendingDoctors();
  }

  verified_date_form: FormGroup = new FormGroup({
    verified_start_date: new FormControl('', Validators.required),
    verified_end_date: new FormControl('', Validators.required),
  });
  getVerifiedStart(event: any) {
    this.verified_min = event.target.value;
    this.verified_date_form.patchValue({
      verified_end_date: '',
    });
  }

  getVerifiedEnd() {
    console.log(123);

    if (this.verified_date_form.get('verified_start_date').valid) {
      var e = this.verified_date_form.get('verified_end_date').value;
      var s = this.verified_date_form.get('verified_start_date').value;
      var end = e + 'T11:59:59Z';
      var start = new Date(s);
      var a = start.toISOString();
      //console.log(a, 'start');
      //console.log(end, 'end');
      let dt = {
        startDate: a,
        endDate: end,
        status: 'verified',
      };
      console.log(dt);
      this._doctorService.postDate(dt).subscribe(async (res: any) => {
        //console.log(res);
        if (res.status) {
          this.VerifiedDoctorsWithIndex = await JSON.parse(
            JSON.stringify(res.data)
          );
          this.createIndex(this.VerifiedDoctorsWithIndex);
        } else {
          alert('choose starting value');
        }
      }),
        (err) => {
          //console.log(err);
        };
    }
  }

  verifiedClear() {
    this.verified_date_form.reset();
    this.verified_min = '';
    this.fetchVerifiedDoctors();
  }

  approved_date_form: FormGroup = new FormGroup({
    approved_start_date: new FormControl('', Validators.required),
    approved_end_date: new FormControl('', Validators.required),
  });
  getApprovedStart(event: any) {
    this.approved_min = event.target.value;
    this.approved_date_form.patchValue({
      approved_end_date: '',
    });
  }

  getApprovedEnd() {
    if (this.approved_date_form.get('approved_start_date').valid) {
      var e = this.approved_date_form.get('approved_end_date').value;
      var s = this.approved_date_form.get('approved_start_date').value;
      var end = e + 'T11:59:59Z';
      var start = new Date(s);
      var a = start.toISOString();
      //console.log(a, 'start');
      //console.log(end, 'end');
      let dt = {
        startDate: a,
        endDate: end,
        status: 'approved',
      };
      //console.log(dt);
      this._doctorService.postDate(dt).subscribe(async (res: any) => {
        //console.log(res);
        if (res.status) {
          this.ApprovedDoctorsWithIndex = await JSON.parse(
            JSON.stringify(res.data)
          );
          this.createIndex(this.ApprovedDoctorsWithIndex);
        } else {
        }
      }),
        (err) => {
          //console.log(err);
        };
    }
  }

  approvedClear() {
    this.approved_date_form.reset();
    this.approved_min = '';
    this.fetchApprovedDoctors();
  }

  rejected_date_form: FormGroup = new FormGroup({
    rejected_start_date: new FormControl('', Validators.required),
    rejected_end_date: new FormControl('', Validators.required),
  });
  getRejectedStart(event: any) {
    this.rejected_min = event.target.value;
    this.rejected_date_form.patchValue({
      rejected_end_date: '',
    });
  }

  getRejectedEnd() {
    if (this.rejected_date_form.get('rejected_start_date').valid) {
      var e = this.rejected_date_form.get('rejected_end_date').value;
      var s = this.rejected_date_form.get('rejected_start_date').value;
      var end = e + 'T11:59:59Z';
      var start = new Date(s);
      var a = start.toISOString();
      //console.log(a, 'start');
      //console.log(end, 'end');
      let dt = {
        startDate: a,
        endDate: end,
        status: 'rejected',
      };
      //console.log(dt);
      this._doctorService.postDate(dt).subscribe(async (res: any) => {
        //console.log(res);
        if (res.status) {
          this.RejectedDoctorsWithIndex = await JSON.parse(
            JSON.stringify(res.data)
          );
          this.createIndex(this.RejectedDoctorsWithIndex);
        } else {
        }
      }),
        (err) => {
          //console.log(err);
        };
    }
  }

  rejectedClear() {
    this.rejected_date_form.reset();
    this.rejected_min = '';
    this.fetchRejectedDoctors();
  }

  fetchPendingDoctors() {
    this._doctorService.fetchPendingDoctors().subscribe(
      async (res: any) => {
        if (res.status) {
          this.PendingDoctorsWithIndex = await JSON.parse(
            JSON.stringify(res.data)
          );
          this.createIndex(this.PendingDoctorsWithIndex);
        } else {
          //console.log(res);
          Swal.fire({
            title: 'oops!!',
            text: `${res.data}`,
            icon: 'error',
            timer: 800,
            showConfirmButton: false,
          });
        }
      },
      (error: any) => {
        //console.log('🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵');
      }
    );
  }

  fetchVerifiedDoctors() {
    this._doctorService.fetchVerifiedDoctors().subscribe(
      (res: any) => {
        if (res.status) {
          this.VerifiedDoctorsWithIndex = JSON.parse(JSON.stringify(res.data));
          this.createIndex(this.VerifiedDoctorsWithIndex);
        } else {
          //console.log(res);
          Swal.fire({
            title: 'oops!!',
            text: `${res.data}`,
            icon: 'error',
            timer: 800,
            showConfirmButton: false,
          });
        }
      },
      (error: any) => {
        //console.log('🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵');
      }
    );
  }
  fetchApprovedDoctors() {
    this._doctorService.fetchApprovedDoctors().subscribe(
      (res: any) => {
        if (res.status) {
          this.ApprovedDoctorsWithIndex = JSON.parse(JSON.stringify(res.data));
          this.createIndex(this.ApprovedDoctorsWithIndex);
        } else {
          //console.log(res);
          Swal.fire({
            title: 'oops!!',
            text: `${res.data}`,
            icon: 'error',
            timer: 800,
            showConfirmButton: false,
          });
        }
      },
      (error: any) => {
        //console.log('🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵');
      }
    );
  }
  fetchRejectedDoctors() {
    this._doctorService.fetchRejectedDoctors().subscribe(
      (res: any) => {
        if (res.status) {
          this.RejectedDoctorsWithIndex = JSON.parse(JSON.stringify(res.data));
          this.createIndex(this.RejectedDoctorsWithIndex);
        } else {
          //console.log(res);
          Swal.fire({
            title: 'oops!!',
            text: `${res.data}`,
            icon: 'error',
            timer: 800,
            showConfirmButton: false,
          });
        }
      },
      (error: any) => {
        //console.log('🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵');
      }
    );
  }

  statusChangeForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  verifyDoctor(doctor) {
    this.statusChangeForm.patchValue({
      status: 'true',
      id: doctor._id,
    });
    //console.log('doctor');
    //console.log(doctor);
    //console.log(this.statusChangeForm.value);

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, verify!',
      cancelButtonText: 'Not at this time',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this._doctorService.verifyDoctor(this.statusChangeForm.value).subscribe(
          (res: any) => {
            if (res.status) {
              this.fetchPendingDoctors();
              this.fetchVerifiedDoctors();

              Swal.fire({
                title: 'success',
                text: `${res.data}`,
                icon: 'success',
              });
            } else {
              Swal.fire({
                title: 'oops!!',
                text: `${res.data}`,
                icon: 'error',
              });
            }
          },
          (err: any) => {
            //console.log('🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵');
          }
        );
      } else {
      }
    });
  }
  approveDoctor(doctor) {
    this.statusChangeForm.patchValue({
      status: 'approved',
      id: doctor._id,
    });

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Not at this time',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this._doctorService
          .approveOrReject(this.statusChangeForm.value)
          .subscribe(
            (res: any) => {
              if (res.status) {
                this.fetchVerifiedDoctors();
                this.fetchApprovedDoctors();

                Swal.fire({
                  title: 'success',
                  text: `${res.data}`,
                  icon: 'success',
                });
              } else {
                Swal.fire({
                  title: 'oops!!',
                  text: `${res.data}`,
                  icon: 'error',
                });
              }
            },
            (err: any) => {
              //console.log('🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵');
            }
          );
      } else {
      }
    });
  }

  rejectDoctor(doctor) {
    this.statusChangeForm.patchValue({
      status: 'rejected',
      id: doctor._id,
    });

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject!',
      cancelButtonText: 'No, keep it',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this._doctorService
          .approveOrReject(this.statusChangeForm.value)
          .subscribe(
            (res: any) => {
              if (res.status) {
                this.fetchVerifiedDoctors();
                this.fetchRejectedDoctors();

                Swal.fire({
                  title: 'success',
                  text: `${res.data}`,
                  icon: 'success',
                });
              } else {
                Swal.fire({
                  title: 'oops!!',
                  text: `${res.data}`,
                  icon: 'error',
                });
              }
            },
            (err: any) => {
              //console.log('🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵');
            }
          );
      } else {
      }
    });
  }
  viewDoctor(id) {
    sessionStorage.removeItem('navigator');

    // Save data to sessionStorage
    sessionStorage.setItem('navigator', id);

    this._router.navigate(['delivery-doctors-details'], {
      relativeTo: this.route,
    });
  }

  disableTab(value) {
    if (this.user.isAdmin === true) {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    } else if (this.user.isStore === true) {
      let flag = this.permissionService.setPrivilages(value, this.user.isStore);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    } else {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
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
  async createIndex(arr: any) {
    await arr.forEach((item, index) => {
      item.no = index + 1;
    });
    console.log(arr);
  }
  TabChange(change) {
    if (change.nextId == 'approved') {
      this.clickedApproved();
    } else if (change.nextId == 'pending') {
      this.clickedPending();
    } else if (change.nextId == 'verified') {
      this.clickedVerified();
    } else if (change.nextId == 'rejected') {
      this.clickedRejected();
    }
    this.skip = 0;
  }
  clickedApproved() {
    if (this.ApprovedDoctorsWithIndex.length < 1) {
      this.fetchApprovedDoctors();
    }
  }
  clickedVerified() {
    if (this.VerifiedDoctorsWithIndex.length < 1) {
      this.fetchVerifiedDoctors();
    }
  }
  clickedPending() {
    if (this.PendingDoctorsWithIndex.length < 1) {
      this.fetchPendingDoctors();
    }
  }
  clickedRejected() {
    if (this.RejectedDoctorsWithIndex.length < 1) {
      this.fetchRejectedDoctors();
    }
  }
}
