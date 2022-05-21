import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { PageChangeEvent } from "@progress/kendo-angular-grid";
import { MasterStoreCreationService } from 'src/app/services/master-store-creation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store-creation',
  templateUrl: './store-creation.component.html',
  styleUrls: ['./store-creation.component.scss']
})
export class StoreCreationComponent implements OnInit {


  // public listStore: Array<string> = ['Store 1', 'Store 2', 'Store 3','Store 4'];
  public listStoreCategory: Array<string> = ['Mini', 'Micro', 'Medimall'];

  // public vendors = [
  //   {
  //     storename : "ABC",
  //     parentstore: "Store 1",
  //     storecategory:"Category 1",
  //     mailid: "abc123@gmail.com",
  //     mobile: "9830921345",
  //     password: "abc7463",
  //   },
  //   {
  //     storename : "ABC",
  //     parentstore: "Store 2",
  //     storecategory:"Category 2",
  //     mailid: "abc123@gmail.com",
  //     mobile: "9830921345",
  //     password: "abc7463",
  //     action:"<div><input type='checkbox' class='toggle-switch oversize' id='toggle2' checked></div>"
  //   },
  //   {
  //     no:"1",
  //     storename : "ABC",
  //     parentstore: "Store 3",
  //     storecategory:"Category 3",
  //     mailid: "abc123@gmail.com",
  //     mobile: "9830921345",
  //     password: "abc7463",
  //     action:"<button type='submit' class='btn btn-dark'>ACTIVE</button>"
  //   },
  //   {
  //     no:"1",
  //     storename : "ABC",
  //     parentstore: "Store 4",
  //     storecategory:"Category 4",
  //     mailid: "abc123@gmail.com",
  //     mobile: "9830921345",
  //     password: "abc7463",
  //     action:"<button type='submit' class='btn btn-dark'>ACTIVE</button>"
  //   },
  //   {
  //     no:"1",
  //     storename : "ABC",
  //     parentstore: "Store 5",
  //     storecategory:"Category 5",
  //     mailid: "abc123@gmail.com",
  //     mobile: "9830921345",
  //     password: "abc7463",
  //     action:"<button type='submit' class='btn btn-dark'>ACTIVE</button>"
  //   },


  // ];


  public settings = {
    mode: 'external',
    actions: {
      columnTitle: '',
      add: false,
      edit: "<button type='button' class='btn btn-dark btn-dark-rounded' data-toggle='modal' data-original-title='test' data-target='#exampleModal' (click)='open(content)' >EDIT</button>",
      position: 'right'
    },
    columns: {
      storename: {
        title: 'Store Name',
        filter: true
      },
      parentstore: {
        title: 'Parent Store',
        filter: true
      },
      mailid: {
        title: 'Email ID',
        filter: true
      },
      mobile: {
        title: 'Mobile No',
        filter: true
      },
      password: {
        title: 'Password',
        filter: true
      },
      action: {
        title: '',
        type: 'html',
        filter: false,
        valuePrepareFunction: (value) => {
          return `<div><input type="checkbox" class="toggle-switch oversize" id="toggle2" checked>value</div>`
        },
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
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;


  public LIST_ALL_STORE: any = [];
  public STORE_DROPDOWN: any = [];
  public Store_Creation_Form: FormGroup
  public attemptedSubmit: boolean = false
  public addLoading: boolean = false
  public itm: any
  public TEMP: any = [];
  public ID: any
  public hasError: boolean = false
  public skip = 0;
  
  // public LIST_ALL_STORE: any = [];

  constructor(
    private modalService: NgbModal,
    private _route: Router,
    private permissionService: PermissionService,
    private location: Location,
    private Store_Creation_Service: MasterStoreCreationService,
    public formbuilder: FormBuilder) {
  }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

    this.get_ALL_STORE()
    this.get_STORE_DROPDOWN()


    console.log(typeof [42]);
    console.log(typeof "42");


    // ,Validators.email

    this.Store_Creation_Form = this.formbuilder.group({
      parent: ['', Validators.required],
      category: ['', Validators.required],
      // name: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      // email: ["",Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      pin: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(6), Validators.minLength(6)]],
      state: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.minLength(3)]],
      country: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.minLength(3)]],
      gst: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15)]],
      regNo: ['', [Validators.required]],
      // managerName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.minLength(3)]],
      managerName: ['', [Validators.required, Validators.minLength(3)]],
      managerPhone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      // serviceablePincodes: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      serviceablePincodes: ['', [Validators.required]],

      posUsername: ['', [Validators.required, Validators.minLength(3)]],
      posPassword: ['', [Validators.required, Validators.minLength(8)]]
      // [{ "code": "123654" }, { "code": "123654" }, { "code": "123654" }] ------ serviceablePincodes
    })


  }


  get_ALL_STORE() {
    this.Store_Creation_Service.get_ALL_STORE().subscribe((res: any) => {
      console.log(res);
      this.LIST_ALL_STORE = res.data
    })
  }

  get_STORE_DROPDOWN() {
    this.Store_Creation_Service.get_STORE_DROPDOWN().subscribe((res: any) => {
      console.log(res);
      this.STORE_DROPDOWN = res.data
    })
  }

  Deactivate(event: any, id) {
    let bdy = {
      status: event.target.checked ? false : true
    }
    this.Store_Creation_Service.deactivate_STORE(id, bdy).subscribe((res: any) => {
      console.log(res);
      this.pop(res)
    })
  }


  Save() {
    this.attemptedSubmit = true
    console.log("clik");


    let pin = this.Store_Creation_Form.get('serviceablePincodes').value
    let chara = []
    chara.push(pin)
    chara = pin.split(',')
    //  chara.splice(-1)

    var len = chara.slice(-1)
    if (len[0] == '' || len[0].length != 6) {
      console.log(len[0].length, "empt len check");

      chara.splice(-1)

      // console.log(len[0]);
      console.log("empt check");

    }
    console.log(len.length, len, "len");

    console.log(chara.length, chara, "rmv coma");

    console.log(chara[chara.length - 1].length);


    this.Store_Creation_Form.patchValue({
      serviceablePincodes: chara
    })

    ////////////////// may need later...............................
    // if(chara[chara.length - 1].length == 6){
    //   this.Store_Creation_Form.patchValue({
    //     serviceablePincodes: chara
    //   })
    // }else{

    // }


    if (this.Store_Creation_Form.valid) {

      let snd_array = []
      // let pinC_array = this.Store_Creation_Form.get('serviceablePincodes').value.split(',')
      let pinC_array = this.Store_Creation_Form.get('serviceablePincodes').value

      pinC_array.forEach((e) => {
        var obj = { code: e }
        console.log(obj, "obj crean");
        snd_array.push(obj)
      })

      let data = {
        parent: this.Store_Creation_Form.get('parent').value,
        category: this.Store_Creation_Form.get('category').value,
        name: this.Store_Creation_Form.get('name').value,
        email: this.Store_Creation_Form.get('email').value,
        phone: this.Store_Creation_Form.get('phone').value,
        address: this.Store_Creation_Form.get('address').value,
        password: this.Store_Creation_Form.get('password').value,
        pin: this.Store_Creation_Form.get('pin').value,
        state: this.Store_Creation_Form.get('state').value,
        country: this.Store_Creation_Form.get('country').value,
        gst: this.Store_Creation_Form.get('gst').value,
        regNo: this.Store_Creation_Form.get('regNo').value,
        managerName: this.Store_Creation_Form.get('managerName').value,
        managerPhone: this.Store_Creation_Form.get('managerPhone').value,
        serviceablePincodes: snd_array,
        posUsername: this.Store_Creation_Form.get('posUsername').value,
        posPassword: this.Store_Creation_Form.get('posPassword').value
      }
      console.log(data, "sending dataaaaaaaaaa");

      this.addLoading = true;
      this.Store_Creation_Service.add_STORE(data).subscribe((res: any) => {
        console.log(res);
        this.pop(res)
      })

    }
  }

  Update() {
    // 6151b3b670a85d5e021ce123
    this.attemptedSubmit = true

    // if (this.Store_Creation_Form.get('serviceablePincodes').value != '') {

    let pin = this.Store_Creation_Form.get('serviceablePincodes').value
    let chara = []
    chara.push(pin)
    chara = pin.split(',')
    //  chara.splice(-1)

    var len = chara.slice(-1)
    if (len[0] == '' || len[0].length != 6) {
      console.log(len[0].length, "empt len check");

      chara.splice(-1)

      // console.log(len[0]);
      console.log("empt check");

    }
    console.log(len.length, len, "len");

    console.log(chara, "rmv coma");

    this.Store_Creation_Form.patchValue({
      serviceablePincodes: chara
    })

    if (this.Store_Creation_Form.valid) {
      let send_array = []
      // let pin_array = []
      console.log(this.Store_Creation_Form.get('serviceablePincodes').value, "old pin");

      //  pin_array = this.Store_Creation_Form.get('serviceablePincodes').value.split(',')

      let pin_array = this.Store_Creation_Form.get('serviceablePincodes').value



      pin_array.forEach((e) => {
        var obj = { code: e }
        // console.log(obj, "obj crean");
        send_array.push(obj)
      })
      // console.log(pin_array, "split array");

      let bdy = {
        parent: this.Store_Creation_Form.get('parent').value,
        category: this.Store_Creation_Form.get('category').value,
        name: this.Store_Creation_Form.get('name').value,
        email: this.Store_Creation_Form.get('email').value,
        phone: this.Store_Creation_Form.get('phone').value,
        address: this.Store_Creation_Form.get('address').value,
        password: this.Store_Creation_Form.get('password').value,
        pin: this.Store_Creation_Form.get('pin').value,
        state: this.Store_Creation_Form.get('state').value,
        country: this.Store_Creation_Form.get('country').value,
        gst: this.Store_Creation_Form.get('gst').value,
        regNo: this.Store_Creation_Form.get('regNo').value,
        managerName: this.Store_Creation_Form.get('managerName').value,
        managerPhone: this.Store_Creation_Form.get('managerPhone').value,
        serviceablePincodes: send_array,
        posUsername: this.Store_Creation_Form.get('posUsername').value,
        posPassword: this.Store_Creation_Form.get('posPassword').value
      }
      this.addLoading = true;
      this.Store_Creation_Service.edit_STORE(this.ID, bdy).subscribe((res: any) => {
        console.log(res);
        this.pop(res)

      })
    }
    // }

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



  open(content, Value: any, id) {
    // console.log(itm,"edit item");
    this.itm = null
    this.attemptedSubmit = false
    this.addLoading = false
    this.Store_Creation_Form.reset()

    if (Value === 'add') {
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      this.ID = id

      this.Store_Creation_Service.get_DATA_by_ID(id).subscribe((res: any) => {
        console.log(res, "get by id");
        this.itm = res.data;
        console.log(this.itm, "itm get by api");
        this.TEMP = []
        this.itm.serviceablePincodes.forEach((a) => {
          console.log(a, "ele");

          this.TEMP.push(a.code)
        })
        console.log(this.TEMP, "temp array");


        this.Store_Creation_Form.patchValue({
          parent: this.itm.parent,
          category: this.itm.category,
          name: this.itm.name,
          email: this.itm.email,
          phone: this.itm.phone,
          address: this.itm.address,
          password: this.itm.password,
          pin: this.itm.pin,
          state: this.itm.state,
          country: this.itm.country,
          gst: this.itm.gst,
          regNo: this.itm.regNo,
          managerName: this.itm.managerName,
          managerPhone: this.itm.managerPhone,
          serviceablePincodes: this.TEMP.toString(),
          // serviceablePincodes: this.itm.serviceablePincodes.toString()        
          // [{ "code": "123654" }, { "code": "123654" }, { "code": "123654" }]
          posUsername: this.itm.posUsername,
          posPassword: this.itm.posPassword
        })
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

  cellClickHandler(id) {
    console.log(id, "pass this id");
    this._route.navigate(['/master-settings/pincode/' + id])
  }

  // alphaNumberOnly(e) {  // Accept only alpha numerics, not special characters 
  //   var regex = new RegExp("^[0-9]*$");
  //   var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  //   if (regex.test(str)) {
  //     this.hasError = true;
  //     return true;
  //   }

  //   this.hasError = false;
  //   // e.preventDefault();
  //   return false;
  // }


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
      this.get_ALL_STORE()
      this.get_STORE_DROPDOWN()
      this.modalService.dismissAll();
      this.skip = 0;
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


  Pincodes(event) {
    // console.log(event.target.value, " value");
    if (event.keyCode === 8) {
      console.log("BACKSPACE");
    } else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
      console.log("ok aan");
      console.log(event.target.value);
      let a = event.target.value
      console.log(typeof a);

      let pin = event.target.value.split(',')
      console.log(pin, "pin array");
      let num = []
      num = num + pin.slice(-1)
      console.log(num, num.length, "num");

      if (num.length == 6) {
        console.log("length is 6");
        this.Store_Creation_Form.patchValue({
          serviceablePincodes: pin + ','
        })
      }
    } else {
      console.log("letters");
      console.log(typeof this.Store_Creation_Form.get('serviceablePincodes').value);

      let letter = this.Store_Creation_Form.get('serviceablePincodes').value
      let chara = []
      chara.push(letter)
      chara = letter.split(',')
      chara.splice(-1)
      //  letter = letter.slice(-1)
      console.log(chara);

      this.Store_Creation_Form.patchValue({
        serviceablePincodes: chara + ','
      })


      console.log(letter, "new letter");

    }
    // let i = 0
    // for (i = 0; i < pin.length; i++) {
    //   console.log(pin[i]);
    //   if (num.length < 6) { console.warn("less") }
    //   else if (num.length > 6) { console.warn("more") }
    //   else { console.warn("6") }
    // }
  }










  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    // this.get_ALL_STORE()
    // this.get_STORE_DROPDOWN()
  }


}
