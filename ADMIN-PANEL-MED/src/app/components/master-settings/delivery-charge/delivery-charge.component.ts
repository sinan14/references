import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { DeliveryChargeService } from 'src/app/services/master-settings-delivery-charge.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delivery-charge',
  templateUrl: './delivery-charge.component.html',
  styleUrls: ['./delivery-charge.component.scss']
})
export class DeliveryChargeComponent implements OnInit {

  public closeResult: string;
  public listArticle: Array<string> = ['Artilce 1', 'Artilce 2', 'Artilce 3', 'Artilce 4'];
  // public vendors = [
  //   {
  //     level:"Same Level",
  //     deliverytime : "3 hr",
  //     charge : "75",
  //   },
  //   {
  //     level : "Sub sub store to sub store",
  //     deliverytime : "7 day",
  //     charge : "30",
  //   },
  //   {
  //     level : "Any store to main store",
  //     deliverytime : "7 day",
  //     charge : "20",
  //   },
  //   {
  //     level : "Sub sub store to store",
  //     deliverytime : "24 hr",
  //     charge : "10",
  //   },

  //   {
  //     level : "Sub store to store",
  //     deliverytime : "24 hr",
  //     charge : "10",
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

  public attemptedSubmit: boolean = false;

  public ID: any;
  public addLoading: boolean = false;

  public DELIV_CHARGE_GET_ARRAY: any = [];
  public DeliveryChargeUpdateForm: FormGroup

  constructor(private _router: Router,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private location: Location,
    private MAS_DELIV_CHARGE_SERVICE: DeliveryChargeService,
    public fb: FormBuilder) {
  }

  ngOnInit(): void {
    console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }


    this.get_delivery_charge()

    this.DeliveryChargeUpdateForm = this.fb.group({
      level: ['', Validators.required],
      DeliveryTime: ['', Validators.required],
      charge: ['', Validators.required],
      DeliveryChargeTimeId: [''],
    })

  }

  get_delivery_charge() {
    this.MAS_DELIV_CHARGE_SERVICE.get_delivery_charge().subscribe((res: any) => {
      console.log(res);
      this.DELIV_CHARGE_GET_ARRAY = res.data
      console.log(this.DELIV_CHARGE_GET_ARRAY, "get arrr");

    })
  }




  disableTab(value) {
    let flag = this.permissionService.setBoxPrivilege(value, this.user.isAdmin);
    // this.addFlag = this.permissionService.addFlag;
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

  // editRow(event, content, Value) {
  //   //console.log('event: ', event)
  //   if (Value === 'edit') {
  //     this.add_Modal_Flag = false;
  //     this.update_Modal_Flag = true;
  //     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     }); this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     });
  //   }
  // }

  Update(){
    console.log("called update");
    
    this.attemptedSubmit = true
    if (this.DeliveryChargeUpdateForm.valid) {
      this.addLoading = true
      let data = {
        level: this.DeliveryChargeUpdateForm.get('level').value,
        DeliveryTime: this.DeliveryChargeUpdateForm.get('DeliveryTime').value,
        charge: this.DeliveryChargeUpdateForm.get('charge').value,
        DeliveryChargeTimeId: this.ID
      }
      console.log(data,"passing this");
      
      this.MAS_DELIV_CHARGE_SERVICE.edit_delivery_charge(data).subscribe((res: any) => {
        console.log(res);
        
        // console.log(res.data,"res data");
        // console.log(res.status,"res status");
        // this.attemptedSubmit = false
        this.pop(res)

      })
    }else{
      console.log("else err form");
      
    }
  }


  open(content, Value: any, itm) {
    console.log(itm, "data");

    // this.ID = ''

    if (Value == 'add') {
      this.DeliveryChargeUpdateForm.reset()
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value == 'edit') {

      this.ID = itm._id


      this.DeliveryChargeUpdateForm.patchValue({
        level: itm.level,
        DeliveryTime: itm.DeliveryTime,
        charge: itm.charge,
      })



      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }


    else if (Value == '') {
      this.update_Modal_Flag = false;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  }


  pop(res: any) {
    
    console.log(res.data,"res data");
    console.log(res.status,"res status");
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
    this.get_delivery_charge()
    // this.addLoading = false;
    this.modalService.dismissAll();
    
  }


}
