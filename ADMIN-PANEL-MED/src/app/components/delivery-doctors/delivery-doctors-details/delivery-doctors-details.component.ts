import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delivery-doctors-details',
  templateUrl: './delivery-doctors-details.component.html',
  styleUrls: ['./delivery-doctors-details.component.scss'],
})
export class DeliveryDoctorsDetailsComponent implements OnInit {
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
  public doctor: any;
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
  public order: any = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
  };

  constructor(
    private modalService: NgbModal,
    private _router: Router,
    private intl: IntlService,
    private permissionService: PermissionService,
    private location: Location,
    private _doctorService: DoctorService
  ) {}
  showVoterImage: boolean;
  establishmentProof: boolean;
  ngOnInit(): void {
    this.showVoterImage=true;
    this.establishmentProof=true;
    //console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(
        this.location.path().split('/').pop()
      );
      //console.log(this.permissions);
    }
    this.fetchDoctorById();
    if (this.doctor.voterId == null) {
      this.showVoterImage = false;
    } else if (this.doctor.voterId == 'http://143.110.240.107:8000/null') {
      this.showVoterImage = false;
    } else {
      this.showVoterImage = true;
    }
  }
  ngAfterViewInit() {
    //console.log('what is this');
    //console.log(this.doctor.establishmentProof);
    //console.log(this.doctor.establishmentProof.length);
    if (this.doctor.establishmentProof.length > 35) {
      this.establishmentProof = true;
    } else {
      this.establishmentProof = false;
    }
    if (this.doctor.voterId.length > 35) {
      this.showVoterImage = true;
    } else {
      this.showVoterImage = false;
    }
  }
  fetchDoctorById() {
    // Get saved data from sessionStorage
    let data = sessionStorage.getItem('navigator');

    this._doctorService.fetchDoctor(data).subscribe(
      (res: any) => {
        if (res.status) {
          this.doctor = res.data[0];
          console.log(this.doctor);
        } else {
          Swal.fire({
            icon: 'error',
          });
        }
      },
      (error: any) => {
        //console.log('🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵');
      }
    );
  }

  disableTab(value) {
    let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
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
    this._router.navigate(['/delivery-doctors']);
  }
}
