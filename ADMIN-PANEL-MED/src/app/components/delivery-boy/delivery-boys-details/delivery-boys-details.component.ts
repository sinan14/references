import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import { Router, RouterModule }  from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { DeliveryBoyService } from '../delivery-boy.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { THeadModule } from 'ng2-smart-table/lib/components/thead/thead.module';

@Component({
  selector: 'app-delivery-boys-details',
  templateUrl: './delivery-boys-details.component.html',
  styleUrls: ['./delivery-boys-details.component.scss'],
})
export class DeliveryBoysDetailsComponent implements OnInit {
  public listStore: any = [
    // 'Store 1',
    // 'Store 2',
    // 'Store 3',
    // 'Store 4',
  ];
  public listPincode: any = [];

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


  public List_Array: any = []
  public loading: boolean

  public Delivery_Boy_Form: FormGroup
  public attemptedSubmit: boolean = false

  public selectedStore: any = [];
  public selectedPin: any = []
  public selectedCategoriesValues: any;
  public store_change_flag: boolean = false

  constructor(
    private modalService: NgbModal,
    private _router: Router,
    private intl: IntlService,
    private permissionService: PermissionService,
    private location: Location,
    private route: ActivatedRoute,
    private Delivery_Boy_Service: DeliveryBoyService,
    private formBuilder: FormBuilder
  ) { }
  public paramsSubscription: Subscription;
  public _id: any;

  public str_ids: any = []
  public pin: any = []
  public str: any = []
  public Commission: any
  public Credit: any
public All_store:any = []
public All_Pin:any = []


  ngOnInit(): void {
    // console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(
        this.location.path().split('/').pop()
      );
      console.log(this.permissions);
    }
    this.initform()
    this.get_store()
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this._id = params['id'];
      console.log(this._id);

      this.Get_By_Id(this._id)
    });

  }

  initform() {
    this.Delivery_Boy_Form = this.formBuilder.group({
      Store: ['', Validators.required],
      Pincode: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Commission: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      Credit: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    })
  }

  get_store() {
    this.Delivery_Boy_Service.get_store().subscribe((res: any) => {
      console.log(res);
      this.listStore = []
      this.listStore = res.data
      this.All_store = []
      this.All_store = res.data
    })
  }

  get_active_pincode(store_ids) {
    console.log(store_ids);

    this.Delivery_Boy_Service.get_active_pincode(store_ids).subscribe((res: any) => {
      console.log(res);
      this.listPincode = res.data
      console.log(this.listPincode, "all pinssssssssssss");

      this.All_Pin = []
      this.All_Pin = res.data

      console.log(this.selectedPin, "sel ones");
      let new_arr = []

      this.selectedPin.forEach((ele) => {
        this.listPincode.forEach((itm) => {
          if (ele._id == itm._id) {
            new_arr.push(ele)
          } else {
            console.log(ele, "diff");
          }
        })

      })
      this.selectedPin = new_arr
      console.log(new_arr);

    })

  }

  Get_By_Id(id) {
    this.Delivery_Boy_Service.fetchBoyById(id).subscribe((res: any) => {
      this.loading = true
      console.log(res, "res");
      this.List_Array = []
      this.List_Array = res.data
      this.loading = false
      this.Commission = res.data[0].commission
      this.Credit = res.data[0].credit
      this.pin = []
      this.str = []
      this.pin = res.data[0].pincode
      this.str = res.data[0].store
      this.str_ids = []
      const formdata = new FormData
      res.data[0].store.forEach((itm, index) => {
        formdata.append('storeId[' + index + ']', itm._id);
      })

      this.get_active_pincode(formdata)

    })
  }




  edit_DELIVERY_BOY() {
    this.attemptedSubmit = true
    if (this.Delivery_Boy_Form.valid) {

      const formdata = new FormData
      this.loading = true;

      this.Delivery_Boy_Form.get('Store').value.forEach((ele, index) => {
        formdata.append('store[' + index + ']', ele._id);
      });
      this.Delivery_Boy_Form.get('Pincode').value.forEach((ele, index) => {
        formdata.append('pincode[' + index + ']', ele._id);
      });
      formdata.append('commission', this.Delivery_Boy_Form.get('Commission').value)
      formdata.append('credit', this.Delivery_Boy_Form.get('Credit').value)
      if (this.Delivery_Boy_Form.get('Password').value != '********') {
        formdata.append('password', this.Delivery_Boy_Form.get('Password').value)
      }
      formdata.append('id', this._id)

      this.Delivery_Boy_Service.edit_DELIVERY_BOY(formdata).subscribe((res) => {
        console.log(res);
        this.pop(res)
      })



    }

  }



  handleStoreChange(value: any) {
    console.log(value);
    this.store_change_flag = true
    let data: any = [];
    for (let i = 0; i < this.selectedStore.length; i++) {
      data.push(this.selectedStore[i]['_id'])
    }
    this.selectedCategoriesValues = data;
    console.log(this.selectedCategoriesValues)
  }

  handleCategoryFilter(value: any) {
      // console.log("Filter EV : ",value);
      if (value.length >= 1) {
        this.listStore = this.All_store.filter(
          (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } else {
        this.get_store()
        // this.multiSelectData = this.allSubCategories
      }
  
  }


  handlePinFilter(value: any) {


    if (value.length >= 1) {
      this.listPincode = this.All_Pin.filter(
        (s) => s.code.indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.show_pin()
      // this.multiSelectData = this.allSubCategories
    }




    // if (value.length >= 3) {
    //   let data: any = [];
    //   data = this.listPincode.filter(
    //     (s) => s.code.toLowerCase().indexOf(value.toLowerCase()) !== -1
    //   );
    //   this.listPincode = data;
    // } else if (value === '') {
    //   this.show_pin();
    // }
    // else {
    //   this.show_pin();
    // }
  }


  show_pin() {
    const formdata = new FormData()
    this.Delivery_Boy_Form.get('Store').value.forEach((ele, index) => {
      formdata.append('storeId[' + index + ']', ele._id);
    });
    console.log(formdata);
    this.listPincode = []
    this.get_active_pincode(formdata)
  }



  disableTab(value) {
    let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  open(content, Value: any) {
    this.attemptedSubmit = false
    this.selectedStore = []
    this.listPincode = []
    this.selectedPin = []
    // this.Delivery_Boy_Form.reset()

    console.log(this.Delivery_Boy_Form.value);


    console.log(Value);
    if (Value === 'add') {
      this.Delivery_Boy_Form.reset()
      this.store_change_flag = false
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

      this.selectedPin = this.pin
      this.selectedStore = this.str

      // this.attemptedSubmit = false

      this.Delivery_Boy_Form.patchValue({
        Store: this.str,
        Pincode: this.pin,
        Password: "********",
        Commission: this.Commission,
        Credit: this.Credit
      })


      console.log(this.Delivery_Boy_Form.value);

      this.store_change_flag = true
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
      this.Get_By_Id(this._id)
      this.initform()
      this.get_store()
      // this.get_ALL_STORE()
      // this.get_STORE_DROPDOWN()
      this.modalService.dismissAll();
      // this.skip = 0;
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
    this.loading = false;
    this.attemptedSubmit = false;
  }



  BackRedirectTo() {
    this._router.navigate(['/delivery-boys']);
  }
  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
