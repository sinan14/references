import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbTabset,
} from '@ng-bootstrap/ng-bootstrap';

// import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedServiceService } from 'src/app/shared-service.service';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

import Swal from 'sweetalert2';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrescriptionsService } from 'src/app/services/prescriptions.service';
@Component({
  selector: 'app-prescription-component',
  templateUrl: './prescription-component.component.html',
  styleUrls: ['./prescription-component.component.scss'],
})
export class PrescriptionComponentComponent implements OnInit {
  public prescriptionTable: any;
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
  public presBody: { keyword: string; limit: number; page: number } = {
    limit: 10,
    page: 1,
    keyword: '',
  };
  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  constructor(
    private modalService: NgbModal,
    private shared_Service: SharedServiceService,
    private permissionService: PermissionService,
    private location: Location,
    public _prescriptionService: PrescriptionsService
  ) {}

  ngOnInit(): void {
    // this.maxDate = this.shared_Service.disablePastDate();

    //console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(
        this.location.path().split('/').pop()
      );
      //console.log(this.permissions);
    }

    let tabselected = localStorage.getItem('TabID');
    if (tabselected != '') {
      if (tabselected == 'tab-selectbyid1') {
        this.selectedTab = 'tab-selectbyid1';
      }
    } else {
      localStorage.clear();
      this.selectedTab = '';
    }

    this.fetchPrescription();
    // this.searchPrescription();
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  disableTab(value) {
    let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
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
    //console.log('event: ', event)
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

  open(content, Value: any) {
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
  //! database connect

  fetchPrescription() {
    const body = {
      limit: this.presBody.limit,
      page: this.presBody.page,
    };
    this._prescriptionService.fetchPrescription(body).subscribe(
      (res: any) => {
        //console.log(res);
        if (res.error === false) {
          this.prescriptionTable = JSON.parse(JSON.stringify(res.data));
          this.prescriptionTable.finalResult.forEach((item, index) => {
            item.SlNo = index + 1;
          });
          //console.log(this.prescriptionTable);
        }
      },
      (err: any) => {
        //console.log('server error');
      }
    );
  }
  searchPrescription() {
    if (this.presBody.keyword == '') {
      this.fetchPrescription();
    } else {
      this._prescriptionService.searchPrescription(this.presBody).subscribe(
        (res: any) => {
          //console.log(res);
          if (res.error === false) {
            this.prescriptionTable = JSON.parse(JSON.stringify(res.data));
            this.prescriptionTable.finalResult.forEach((item, index) => {
              item.SlNo = index + 1;
            });
          }
        },
        (err: any) => {
          console.log('server error');
        }
      );
    }
  }
  onChangeKeyword(keyword) {
    this.presBody.keyword = keyword;
    this.searchPrescription();
  }
  pagination(page) {
    // console.log(`${page} \n${this.prescriptionTable.hasNextPage}\n ${this.prescriptionTable.current_page}`)

    if (
      (this.prescriptionTable.hasNextPage == false &&
        page > this.prescriptionTable.current_page) ||
      (this.prescriptionTable.hasPrevPage == false &&
        page < this.prescriptionTable.current_page)
    ) {
      console.log('noo');
      return;
    } else {
      this.presBody.page = page;
      this.searchPrescription();
    }
  }
  onDeletePrescription(item) {
    //console.log('from delete fn' id);
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
        this._prescriptionService.deletePrescription(item._id).subscribe(
          (res: any) => {
            if (res.status) {
              // //here you need to write some code
              // this.prescriptionTable.finalResult =
              //   this.prescriptionTable.finalResult.filter(
              //     (pres) => pres !== item
              //   );
              Swal.fire({
                title: 'Done',
                text: 'deleted successfully',
                icon: 'info',
                timer: 1000,
                showConfirmButton: false,
              });
              this.searchPrescription();
            } else {
              //console.log('eror from delete ' + res);
              Swal.fire({
                title: 'sorry!!',
                text: `${res.message}`,
                icon: 'info',
                showConfirmButton: true,
              });
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

  toDataURL(url) {
    return fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  }

  async download(url, name) {
    const a = document.createElement('a');
    a.href = await this.toDataURL(url);
    a.download = `${name}_prescription.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
