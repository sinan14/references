import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { MainPincodeSService } from 'src/app/services/main-pincode-s.service';


@Component({
  selector: 'app-main-pincode',
  templateUrl: './main-pincode.component.html',
  styleUrls: ['./main-pincode.component.scss']
})
export class MainPincodeComponent implements OnInit {

  public closeResult: string;


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


  public PINCODE_ARRAY: any = [];
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
    public fb: FormBuilder,
    private Pincode_Service: MainPincodeSService) { }



  ngOnInit(): void {
    console.log(this.location.path().split('/').pop());

    this.user = JSON.parse(sessionStorage.getItem('userData'));
    console.log(this.user);


    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

    this.Pincode_Form = this.fb.group({
      pincode: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(6), Validators.minLength(6)]],
      status: ['']
    })

    this.get_ALL_PINCODE()

  }

  get_ALL_PINCODE() {
    this.Pincode_Service.get_ALL_PINCODE().subscribe((res: any) => {
      console.log(res, "all pins res");
      this.PINCODE_ARRAY = res.data.serviceablePincodes
    })
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
        status: this.Pincode_Form.get('status').value,
      }
      this.addLoading = true
      this.Pincode_Service.edit_PINCODE(this.ID, bdy).subscribe((res: any) => {
        console.log(res, "update api res");
        this.pop(res)
      })
    }
  }

  Save() {
    this.attemptedSubmit = true
    if (this.Pincode_Form.valid) {
      let bdy = {
        code: this.Pincode_Form.get('pincode').value,
        status: this.Pincode_Form.get('status').value,
      }
      this.addLoading = true
      this.Pincode_Service.add_PINCODE(bdy).subscribe((res: any) => {
        this.pop(res)
      })
    }
  }

  Deactivate(event: any, id: any) {

    let bdy = {
      status: event.target.checked ? true : false
    }

    this.Pincode_Service.deactivate_PINCODE(id, bdy).subscribe((res: any) => {
      console.log(res, "deactivation res");
      this.pop(res)
    })
  }


  // COD_Activae(event: any, id: any) {

  //   let body = {
  //     status: event.target.checked ? true : false
  //   }
  //   console.log(id);
  //   console.log(event.target.checked);
  //   console.log(body);


  // }



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
        this.Pincode_Service.delete_PINCODE(item._id, data).subscribe((res: any) => {
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
    this.ID = null

    console.log(itm, "pin edit itm");
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
        status: itm.cashOnDelivery
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



  // BackRedirectTo() {
  //   this._router.navigate(['/master-settings/store-creation'])
  // }


  pop(res: any) {

    console.log(res.data, "res data");
    console.log(res.status, "res status");
    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })

      this.get_ALL_PINCODE()
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
    }
    this.addLoading = false;
    this.attemptedSubmit = false;


  }









}
