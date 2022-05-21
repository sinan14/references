import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { MasterStoreCreationService } from 'src/app/services/master-store-creation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.scss']
})
export class PincodeComponent implements OnInit {
  public closeResult: string;
  public listArticle: Array<string> = ['Artilce 1', 'Artilce 2', 'Artilce 3', 'Artilce 4'];
  // public vendors = [
  //   {
  //     slno : "1",
  //     pincode: "345678",
  //   },
  //   {
  //     slno : "2",
  //     pincode: "145678",
  //   },
  //   {
  //     slno : "3",
  //     pincode: "735654",
  //   },
  //   {
  //     slno : "4",
  //     pincode: "325678",
  //   },
  //   {
  //     slno : "5",
  //     pincode: "122678",
  //   },
  // ];

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public addFlag: boolean;
  public add_Modal_Flag: boolean = false;
  public update_Modal_Flag: boolean = false;

  public SERVICEABLE_PINCODE_ARRAY: any = [];
  public parentStoreID: any;
  public Pincode_Form: FormGroup
  public ID: any;
  public attemptedSubmit: boolean = false
  public addLoading: boolean = false


  constructor(private _router: Router,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private Store_Creation_Service: MasterStoreCreationService,
    public fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }


    this.activatedRoute.paramMap.subscribe(params => {
      this.parentStoreID = params.get('parentStoreID');
      this.Store_Creation_Service.get_SERVICEABLE_PINCODE(this.parentStoreID).subscribe((res: any) => {
        console.log(res, "getting res");
        this.SERVICEABLE_PINCODE_ARRAY = res.data.serviceablePincodes;
        console.log(this.SERVICEABLE_PINCODE_ARRAY, "SERVICEABLE_PINCODE_ARRAY");

      })
    });

    this.Pincode_Form = this.fb.group({
      pincode: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(6), Validators.minLength(6)]],
      status: ['']
    })





  }
  // get f(){
  //   return this.Pincode_Form.controls;
  // }

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
    //console.log('event: ', event)
    if (Value === 'edit') {
      this.add_Modal_Flag = false;
      this.update_Modal_Flag = true;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }); this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  Update() {
    this.attemptedSubmit = true
    if (this.Pincode_Form.valid) {
      let bdy = {
        code: this.Pincode_Form.get('pincode').value,
        status:this.Pincode_Form.get('status').value
      }
      this.addLoading = true
      this.Store_Creation_Service.edit_SERVICE_PINCODE(this.ID, bdy).subscribe((res: any) => {
        console.log(res, "update api res");
        this.pop(res)
      }), err => {
        console.log(err);

      }
    }
  }

  Save() {
    this.attemptedSubmit = true
    if (this.Pincode_Form.valid) {
      let bdy = {
        code: this.Pincode_Form.get('pincode').value,
        status:this.Pincode_Form.get('status').value
      }
      this.addLoading = true
      this.Store_Creation_Service.add_SERVICE_PINCODE(this.parentStoreID, bdy).subscribe((res: any) => {
        this.pop(res)
      }), err => {
        console.log(err);

      }
    }
  }

  Deactivate(event: any, id: any) {

    let bdy = {
      status: event.target.checked ? true : false
    }

    this.Store_Creation_Service.deactivate_SERVICE_PINCODE(id, bdy).subscribe((res: any) => {
      console.log(res, "deactivation res");
      this.pop(res)
    })
  }

  DeletePin(item) {


    let data = {
      "code": item.code
    }
    console.log(data, "data snd del");

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this.Store_Creation_Service.delete_SERVICE_PINCODE(item._id, data).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
          // if (res.status) {
          //   Swal.fire({
          //     text: 'Successfully Deleted',
          //     icon: 'success',
          //     showCancelButton: false,
          //     confirmButtonText: 'Ok',
          //     confirmButtonColor: '#3085d6',
          //     imageHeight: 500,
          //   });
          //   // this.getHandPick();
          // }
        })
      }



    })
  }


  open(content, Value: any, itm) {
    this.attemptedSubmit = false
    this.addLoading = false

    console.log(itm, "pin edit itm");
    this.ID = null
    if (Value === 'add') {
      this.Pincode_Form.reset()
      this.Pincode_Form.patchValue({
        status: true
      })
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      this.ID = itm._id
      this.Pincode_Form.patchValue({
        pincode: itm.code,
        status:itm.cashOnDelivery
      })

      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }


    else if (Value === '') {
      this.update_Modal_Flag = false;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  }



  BackRedirectTo() {
    this._router.navigate(['/master-settings/store-creation'])
  }


  pop(res: any) {

    console.log(res.data, "res data");
    console.log(res.status, "res status");
    // this.attemptedSubmit = false
    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      this.Store_Creation_Service.get_SERVICEABLE_PINCODE(this.parentStoreID).subscribe((res: any) => {
        console.log(res, "getting res");
        this.SERVICEABLE_PINCODE_ARRAY = res.data.serviceablePincodes;
        console.log(this.SERVICEABLE_PINCODE_ARRAY, "SERVICEABLE_PINCODE_ARRAY");

      })
      this.Pincode_Form.reset()
      this.modalService.dismissAll();
    } else {
      Swal.fire({
        text: res.data,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      // this.updateFlag = false
    }
    this.addLoading = false;
    this.attemptedSubmit = false;
  }


}
