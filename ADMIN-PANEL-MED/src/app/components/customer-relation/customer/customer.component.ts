import { Component, HostListener, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Route, Router } from '@angular/router';
import { CustomerDetailsComponent } from '../../customer-details/customer-details/customer-details.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { CustomerRelationService } from 'src/app/services/customer-relation.service';
import Swal from 'sweetalert2';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

import { DatePipe } from '@angular/common';

import { ViewportScroller } from '@angular/common';
import { MedcoinService } from 'src/app/services/medcoin.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  public _API = environment.apiUrl;

  public value_array = [];
  public product_array = [];
  public hasErrorPay: boolean = false;
  public accountForm: FormGroup;
  public permissionForm: FormGroup;
  public customerIds: any = [];
  public media = [];

  constructor(
    private formBuilder: FormBuilder,
    private _routes: Router,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private location: Location,
    private Customer_Relation_Service: CustomerRelationService,
    public datepipe: DatePipe,
    private _medService: MedcoinService
  ) {
    this.media = mediaDB.data;
    this.createAccountForm();
    this.createPermissionForm();
  }

  public vendors = [
    {
      image:
        "<img class='crown_size' src='assets/images/customer/icon-crown.png'><img class='custmr_img' src='assets/images/customer/icon-user-pic1.png'>",
      slno: '1',
      customerid: "<a  href='#/customer-details'>Aswin Vinod</a>",
      mobileno: '9804321787',
      name: 'Aswin Vinod',
      membersince: '20 Dec 2020',
      zone: 'Kerala',
      total: '2500',
      ordervalue: '100',
      remarks:
        "<a class='btn btn-dark btn-dark-rounded' data-toggle='modal' data-original-title='test' data-target='#exampleModal' (click)='open(exampleModalcontent)'>Remarks</a> ",
    },
    {
      image:
        "<img class='crown_size' src='assets/images/customer/icon-crown.png'><img class='custmr_img' src='assets/images/customer/icon-user-pic2.png'>",
      slno: '2',
      customerid: "<a  href='#/customer-details'>Rahul</a>",
      mobileno: '933333387',
      name: 'Aswin Vinod',
      membersince: '20 Dec 2020',
      zone: 'Kerala',
      total: '2500',
      ordervalue: '656',
      remarks: '956',
    },

    {
      image:
        "<img class='custmr_img' src='assets/images/customer/icon-user-pic3.png'>",
      slno: '3',
      customerid: 'Aswin Vinod',
      mobileno: '9804321787',
      name: 'Aswin Vinod',
      membersince: '15 Dec 2020',
      zone: 'Kerala',
      total: '2500',
      ordervalue: '444',
      remarks: '956',
    },

    {
      image:
        "<img class='crown_size' src='assets/images/customer/icon-crown.png'><img class='custmr_img' src='assets/images/customer/icon-user-pic4.png'>",
      slno: '4',
      customerid: 'Aswin Vinod',
      mobileno: '9804321787',
      name: 'Aswin Vinod',
      membersince: '10 Dec 2020',
      zone: 'Kerala',
      total: '2500',
      ordervalue: '567',
      remarks: '256',
    },

    {
      image:
        "<img class='custmr_img' src='assets/images/customer/icon-user-pic5.png'>",
      slno: '5',
      customerid: 'Aswin Vinod',
      mobileno: '98043222287',
      name: 'Aswin Vinod',
      membersince: '23 Dec 2020',
      zone: 'Kerala',
      total: '2500',
      ordervalue: '767',
      remarks: '156',
    },
  ];

  public settings = {
    pager: {
      display: false,
      perPage: 5,
    },
    actions: {
      add: false,
      position: 'none',
    },
    columns: {
      image: {
        filter: false,
        type: 'html',
        hideSubHeader: false,
      },
      slno: {
        title: 'SlNo.',
        filter: true,
      },
      customerid: {
        title: 'Customer ID',
        type: 'html',
        filter: true,
        renderComponent: CustomerDetailsComponent,
      },
      mobileno: {
        title: 'Mobile No',
        filter: true,
      },
      name: {
        title: 'Name',
      },
      membersince: {
        title: 'MemberSince',
      },
      zone: {
        title: 'Zone',
      },
      total: {
        title: 'Total',
      },
      ordervalue: {
        title: 'Order Value',
      },
      remarks: {
        title: 'Remarks',
        filter: false,
        type: 'html',
      },
    },
    attr: {
      class:
        ' ng2-smart-table  .ng2-smart-filter input,.ng2-smart-filter select',
    },
  };

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  public addLoading: boolean = false;
  public Loading: boolean = false;
  public Submitted: boolean = false;
  public Customer_Database_Array: any = [];
  public Add_Customer_Form: FormGroup;
  public Remark_Form: FormGroup;
  public Popup_Banner_Form: FormGroup;
  public Push_Notification_Form: FormGroup;

  public Remark_Id: any;

  public current_page: any;
  public hasNextPage: boolean;
  public total_page: any;
  public hasPrevPage: boolean;
  // public total_items: any;

  public image_URL: any = '';
  public uploadImage: any = '';

  public today = new Date().toISOString().split('T')[0];

  public Customer_Array: any = [];
  public Push_Notification_Form_Flag: boolean = false;
  public Push_Notification_Array: any = [];
  public Medmall_Flag: boolean = false;
  public Immediate_Flag: boolean = false;
  public Scheduled_Push_Flag: boolean = false;
  public Past_Push_Flag: boolean = false;
  public Create_Push_Flag: boolean = false;

  public Main_Segment = '';

  public categoryList: any = [];
  public productList: any = [];
  public All_Customers_Select_Flag: boolean = false;
  public Update_Flag: boolean = false;
  public View_Only_Flag: boolean = false;

  public Edit_Notification_Id: any = '';

  public skip = 0;

  public time_now = this.datepipe.transform(new Date(), 'hh:mm');


  public Search_Word: any = null
  public Search_Flag: boolean = false



  // var time = new Date();
  // console.log(
  //   time.toLocaleString('en-US', { hour: 'numeric', hour12: true })
  // );

  // // @HostListener("window:scroll", ['$event'])
  // Customer_Scroll(event) {
  //   console.log("scrolerl");
  //   console.log(event);

  // }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop());
    }

    // console.log(this.time_now);

    this.get_CUSTOMER_DATABASE(1);
    this.Init_Add_Customer_Form();
    // this.Popup_Banner_Form_Init()
    // this.init_Push_Notification_Form()
    this.skip = 0;
    this.payForm.patchValue({
      segment: 'all_customers',
    });
    this.get_CUSTOMER_BY_SEGMENT({
      segment: this.payForm.get('segment').value,
      page: 0,
      selectAll: false,
    });
  }

  disableTab(value) {
    let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  Init_Add_Customer_Form() {
    this.Add_Customer_Form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mob: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
      email: [
        '',
        [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
      ],
      addr: ['', Validators.minLength(6)],
      pincode: [
        '',
        [
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(6),
          Validators.minLength(6),
        ],
      ],
    });

    this.Remark_Form = this.formBuilder.group({
      remark: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  Popup_Banner_Form_Init() {
    this.Popup_Banner_Form = this.formBuilder.group({
      image: [''],
      date: ['', [Validators.required]],
      type: ['home', [Validators.required]],
    });
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      fname: [''],
      lname: [''],
      email: [''],
      password: [''],
      confirmPwd: [''],
    });
  }
  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({});
  }

  customer_details() {
    this._routes.navigate(['/customer-details']);
  }

  init_Push_Notification_Form() {
    this.Push_Notification_Form = this.formBuilder.group({
      segment: ['all_customers', [Validators.required]],
      date: ['', [Validators.required]],
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
      image: [],
      redirectionType: ['', [Validators.required]],
      type: ['', [Validators.required]],
      redirectionId: [''],
      immediate: [false, [Validators.required]],
      time: ['', [Validators.required]],
      userIds: ['', [Validators.required]],
    });
    this.Main_Segment = 'all_customers';
    let body = {
      segment: this.Main_Segment,
      page: 0,
      selectAll: false,
    };
    console.log(body);

    this.Push_Notification_Form_Flag = true;
    this.Medmall_Flag = false;
    this.Immediate_Flag = false;
    this.get_CUSTOMER_BY_SEGMENT(body);
    this.getCategoryDetails();
    this.getProductsDetails();
  }

  onChange(event: any, width: any, height: any) {
    let setFlag: boolean = false;
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      if (
        e.path[0].naturalHeight === parseInt(height) &&
        e.path[0].naturalWidth === parseInt(width)
      ) {
        setFlag = true;
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;
      } else {
        setFlag = true;
        Swal.fire({
          text: 'Invalid Image Dimension - ' + width + 'x' + height,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
    };
  }

  get_CUSTOMER_DATABASE(pg) {
    let body = {
      page: pg,
      limit: 10,
    };
    this.Search_Flag = false

    this.Customer_Relation_Service.get_CUSTOMER_DATABASE(body).subscribe(
      (res: any) => {
        console.log(res);

        this.addLoading = true;

        this.current_page = res.data.current_page;
        this.hasNextPage = res.data.hasNextPage;
        this.hasPrevPage = res.data.hasPrevPage;
        //  this.total_items = res.data.total_items
        this.total_page = res.data.total_page;

        let mappedData = res.data.finalResult.map((item) => {
          return {
            _id: item._id,
            customerId: item.customerId,
            // createdAt: item.createdAt ? item.createdAt.reverse : 'no dt',
            createdAt: item.createdAt ? item.createdAt.slice(0, 10) : 'no dt',
            sl: item.sl,
            phone: item.phone,
            name: item.name,
            image: item.image,
            locality: item.locality,
            premium: item.premium,
            // total: item.image,
            orderValue: item.orderValue,
          };
        });
        this.Customer_Database_Array = [];
        this.Customer_Database_Array = mappedData;
        this.addLoading = false;
      }
    );
  }

  Add_New_Customer() {
    this.Submitted = true;
    if (this.Add_Customer_Form.valid) {
      console.log(this.Add_Customer_Form.value);
      const formdata = new FormData();
      this.Loading = true;
      formdata.append('name', this.Add_Customer_Form.get('name').value);
      formdata.append('phone', this.Add_Customer_Form.get('mob').value);
      if (this.Add_Customer_Form.get('email').value != null) {
        formdata.append('email', this.Add_Customer_Form.get('email').value);
      }
      if (this.Add_Customer_Form.get('addr').value != null) {
        formdata.append('address', this.Add_Customer_Form.get('addr').value);
      }
      if (this.Add_Customer_Form.get('pincode').value != null) {
        formdata.append('pincode', this.Add_Customer_Form.get('pincode').value);
      }
      this.Customer_Relation_Service.add_NEW_CUSTOMER(formdata).subscribe(
        (res: any) => {
          console.log(res);
          this.pop(res);
        }
      );
    }
  }

  get_CUSTOMER_REMARK(id) {
    this.Customer_Relation_Service.get_CUSTOMER_REMARK(id).subscribe(
      (res: any) => {
        console.log(res);
        if (res.data.result != null) {
          this.Remark_Form.patchValue({
            remark: res.data.result.remarks,
          });
        }
      }
    );
  }

  onPageChangeLow(page) {
    console.log(page);
    console.log(this.Search_Flag);
    console.log(this.Search_Word);

    this.addLoading = false;

    if (this.Search_Flag == true) {
      this.Search_Api_Call(this.Search_Word,page)

      // this.Search_Details(this.Search_Word, page)

    }else{
      this.get_CUSTOMER_DATABASE(page);

    }
  }

  Edit_Remark() {
    this.Submitted = true;
    if (this.Remark_Form.valid) {
      this.Loading = true;
      let body = {
        remarks: this.Remark_Form.get('remark').value,
      };
      this.Customer_Relation_Service.edit_CUSTOMER_REMARK(
        this.Remark_Id,
        body
      ).subscribe((res: any) => {
        console.log(res);
        this.pop(res);
      });
    }
  }

  Popup_Banner_Form_Submit() {
    console.log(this.Popup_Banner_Form.value);
    this.Submitted = true;

    if (this.image_URL === '' || this.image_URL === null) {
      Swal.fire({
        text: 'Please Add Image!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
    } else {
      if (this.Popup_Banner_Form.valid) {
        console.log(this.Popup_Banner_Form.value);
        const formdata = new FormData();
        this.Loading = true;
        formdata.append('type', this.Popup_Banner_Form.get('type').value);
        formdata.append('date', this.Popup_Banner_Form.get('date').value);
        formdata.append('image', this.uploadImage);
        this.Customer_Relation_Service.post_POP_UP_BANNER(formdata).subscribe(
          (res: any) => {
            console.log(res);
            this.pop(res);
          }
        );
      }
    }
  }

  Scheduled_Push_Notification() {
    this.Push_Notification_Form_Flag = false;
    this.Scheduled_Push_Flag = true;
    this.Past_Push_Flag = false;
    this.Create_Push_Flag = false;
    this.skip = 0;

    console.log('sheduled click');
    this.Customer_Relation_Service.list_SCHEDULED_PUSH_NOTIFICATION().subscribe(
      (res: any) => {
        console.log(res);
        this.Push_Notification_Array = [];

        let list_array = res.data.result.map((itm, index) => {
          return {
            sl: index + 1,
            date: itm.date.slice(0, 10),
            title: itm.title,
            _id: itm._id,
          };
        });
        this.Push_Notification_Array = list_array;
        console.log(this.Push_Notification_Array, 'aftr foreach');
      }
    );
  }
  Past_Push_Notification() {
    this.Push_Notification_Form_Flag = false;
    this.Past_Push_Flag = true;
    this.Scheduled_Push_Flag = false;
    this.Create_Push_Flag = false;
    this.skip = 0;

    console.log('past click');
    this.Customer_Relation_Service.list_PAST_PUSH_NOTIFICATION().subscribe(
      (res: any) => {
        console.log(res);
        this.Push_Notification_Array = [];

        let list_array = res.data.result.map((itm, index) => {
          return {
            sl: index + 1,
            date: itm.date.slice(0, 10),
            title: itm.title,
            _id: itm._id,
          };
        });

        this.Push_Notification_Array = list_array;
        console.log(this.Push_Notification_Array, 'aftr foreach');
      }
    );
  }

  Create_Push_Notification() {
    this.Create_Push_Flag = true;
    this.View_Only_Flag = false;
    this.Back_Button_Click();
  }

  Back_Button_Click() {
    this.Push_Notification_Form_Flag = true;
    this.Scheduled_Push_Flag = false;
    this.Past_Push_Flag = false;
    this.Submitted = false;
    this.image_URL = '';
    this.skip = 0;
    // this.View_Only_Flag = false
    this.init_Push_Notification_Form();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    //  this.get_ALL_BRANDS()
    // this.Brands({ activeId: 'all', nextId: 'promoted' })
    // this.Brands({ activeId: 'all', nextId: 'shop' })
    // this.Brands({ activeId: 'all', nextId: 'trending' })
    // this.Brands({ activeId: 'all', nextId: 'featured' })
  }

  Segment_Drop_Change(event, type) {
    console.log(event.target.value);
    this.Main_Segment = '';
    this.Main_Segment = event.target.value;
    let body = {
      segment: this.Main_Segment,
      page: 0,
      selectAll: false,
    };
    this.get_CUSTOMER_BY_SEGMENT(body);
    if (type == 'edit') {
      this.Push_Notification_Form.get('userIds').reset();
    }
  }
  get_CUSTOMER_BY_SEGMENT(body) {
    this.All_Customers_Select_Flag = false;

    this.Customer_Relation_Service.get_CUSTOMER_BY_SEGMENT(body).subscribe(
      (res: any) => {
        console.log(res);

        let mappedData = res.data.customers.map((item) => {
          return {
            _id: item._id,
            name: item.name + '(' + item.phone + ')',
          };
        });
        this.Customer_Array = [];
        this.Customer_Array = mappedData;
      }
    );
  }
  handleFilterProduct(value) {
    console.log(value);

    console.log(this.Main_Segment);

    if (value.length >= 1) {
      let body = {
        segment: this.Main_Segment,
        page: 0,
        name: value,
        selectAll: false,
      };
      this.get_CUSTOMER_BY_SEGMENT(body);
    } else {
      let body = {
        segment: this.Main_Segment,
        page: 0,
        selectAll: false,
      };
      this.get_CUSTOMER_BY_SEGMENT(body);
    }
  }

  All_Customers_Select() {
    let body = {
      segment: this.Main_Segment,
      page: 0,
      selectAll: true,
    };

    this.Customer_Relation_Service.get_CUSTOMER_BY_SEGMENT(body).subscribe(
      (res: any) => {
        console.log(res);

        let mappedData = res.data.customers.map((item) => {
          return {
            _id: item._id,
            name: item.name + '(' + item.phone + ')',
          };
        });
        this.Customer_Array = [];
        this.Customer_Array = mappedData;
        // this.Customer_Array = []
        // this.Customer_Array = res.data.customers
        let user_id_array = [];

        res.data.customers.forEach((itm) => {
          user_id_array.push(itm._id);
        });
        console.log(user_id_array);

        this.Push_Notification_Form.patchValue({
          userIds: user_id_array,
        });
        console.log(this.Push_Notification_Form.value);
      }
    );
    this.All_Customers_Select_Flag = true;
  }

  //  @HostListener("div:scroll", ['$event'])
  //   Customer_Scroll(event) {
  //     console.log("scrolerl");
  //     console.log(event);

  //   }

  add_PUSH_NOTIFICATION(send: any) {
    console.log(this.Push_Notification_Form.value);
    this.Submitted = true;
    if (this.Push_Notification_Form.valid) {
      console.log(this.Push_Notification_Form.value);
      console.log(this.uploadImage);
      const formdata = new FormData();
      this.Loading = true;
      formdata.append('date', this.Push_Notification_Form.get('date').value);
      formdata.append('title', this.Push_Notification_Form.get('title').value);
      formdata.append(
        'message',
        this.Push_Notification_Form.get('message').value
      );

      if (this.uploadImage != undefined) {
        formdata.append('image', this.uploadImage);
      }
      formdata.append(
        'segment',
        this.Push_Notification_Form.get('segment').value
      );
      formdata.append(
        'redirectionType',
        this.Push_Notification_Form.get('redirectionType').value
      );
      formdata.append('type', this.Push_Notification_Form.get('type').value);
      formdata.append(
        'redirectionId',
        this.Push_Notification_Form.get('redirectionId').value
      );
      formdata.append(
        'immediate',
        this.Push_Notification_Form.get('immediate').value
      );
      formdata.append('time', this.Push_Notification_Form.get('time').value);
      this.Push_Notification_Form.get('userIds').value.forEach((ele, index) => {
        formdata.append('userIds[' + index + ']', ele);
      });
      if (send == 'add') {
        this.Customer_Relation_Service.add_PUSH_NOTIFICATION(
          formdata
        ).subscribe((res: any) => {
          console.log(res);
          this.pop(res);
        });
      } else if (send == 'update') {
        this.Customer_Relation_Service.update_PUSH_NOTIFICATION(
          this.Edit_Notification_Id,
          formdata
        ).subscribe((res: any) => {
          console.log(res);
          this.pop(res);
        });
      }
    }
  }

  Date_Min_Setting() {
    this.today = new Date().toISOString().split('T')[0];
    console.log(this.today);
  }

  View_Push_Notification(id: any) {
    this.View_Only_Flag = true;
    this.Update_Flag = false;
    this.Edit_Notification_Id = '';
    this.Edit_Notification_Id = id;
    console.log(id, this.View_Only_Flag);
    this.Back_Button_Click();
    this.get_notification_api_call(id, '');
  }

  Edit_Push_Notification(id: any) {
    this.Update_Flag = true;
    this.View_Only_Flag = false;
    this.Edit_Notification_Id = '';
    this.Edit_Notification_Id = id;
    this.today = new Date().toISOString().split('T')[0];
    console.log(this.today);

    console.log(id);
    this.Back_Button_Click();
    this.get_notification_api_call(id, 'edit');
    this.Date_Min_Setting();
  }

  get_notification_api_call(id: any, type) {
    this.Customer_Relation_Service.get_PUSH_NOTIFICATION_BY_ID(id).subscribe(
      (res: any) => {
        console.log(res);
        this.skip = 0;
        this.Main_Segment = res.data.result.segment;
        if (res.data.result.segment == 'all_customers') {
          let body = {
            segment: this.Main_Segment,
            page: 0,
            selectAll: true,
          };

          this.Customer_Relation_Service.get_CUSTOMER_BY_SEGMENT(
            body
          ).subscribe((res: any) => {
            console.log(res);
            let mappedData = res.data.customers.map((item) => {
              return {
                _id: item._id,
                name: item.name + '(' + item.phone + ')',
              };
            });
            this.Customer_Array = [];
            this.Customer_Array = mappedData;
            // this.Customer_Array = []
            // this.Customer_Array = res.data.customers
          });
        } else {
          let body = {
            segment: this.Main_Segment,
            page: 0,
            selectAll: false,
          };
          this.get_CUSTOMER_BY_SEGMENT(body);
        }
        if (type == 'edit') {
          this.dropDownChange(res.data.result.redirectionType, 'edit');
          this.dropDownProductChange(res.data.result.type, 'edit');
        } else {
          this.dropDownChange(res.data.result.redirectionType, '');
          this.dropDownProductChange(res.data.result.type, '');
        }

        if (res.data.result.immediate == false) {
          this.Immediate_Flag = false;
          this.Push_Notification_Form.patchValue({
            time: res.data.result.time,
            date: res.data.result.date.slice(0, 10),
          });
        } else {
          this.Immediate_Flag = true;
          this.Push_Notification_Form.patchValue({
            date: this.today,
            time: '00:00',
          });
        }

        if (res.data.result.image != null || res.data.result.image != '') {
          this.image_URL = res.data.result.image;
        }

        this.Push_Notification_Form.patchValue({
          segment: res.data.result.segment,
          title: res.data.result.title,
          message: res.data.result.message,
          // image: res.data.result.image,
          redirectionType: res.data.result.redirectionType,
          type: res.data.result.type,
          redirectionId: res.data.result.redirectionId,
          immediate: res.data.result.immediate,
          userIds: res.data.result.userIds,
        });
      }
    );
  }

  Push_Notification_Immediate() {
    this.Immediate_Flag = !this.Immediate_Flag;
    this.Push_Notification_Form.patchValue({
      immediate: this.Immediate_Flag,
    });
    if (this.Immediate_Flag == true) {
      this.Push_Notification_Form.patchValue({
        date: this.today,
        time: '00:00',
      });
    } else {
      this.Push_Notification_Form.patchValue({
        date: '',
        time: '',
      });
    }
  }

  getProductsDetails() {
    this.Customer_Relation_Service.get_products().subscribe((res: any) => {
      this.productList = [];
      this.productList = res.data;
    });
  }

  getCategoryDetails() {
    this.Customer_Relation_Service.get_categories().subscribe((res: any) => {
      this.categoryList = [];
      this.categoryList = res.data;
    });
  }

  handleFilter(value) {
    let listing: any = [];
    if (this.Push_Notification_Form.get('type').value == 'product') {
      if (value.length >= 1) {
        listing = this.productList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      } else if (value === '') {
        this.getProductsDetails();
        this.product_array = this.productList;
      } else {
        this.getProductsDetails();
        this.product_array = this.productList;
      }
    } else if (this.Push_Notification_Form.get('type').value == 'category') {
      if (value.length >= 1) {
        listing = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      } else if (value === '') {
        this.getCategoryDetails();
        this.product_array = this.categoryList;
      } else {
        this.getCategoryDetails();
        this.product_array = this.categoryList;
      }
    }
  }

  dropDownChange(value: any, type) {
    if (value === 'Medimall') {
      this.Medmall_Flag = true;
      this.value_array = ['product', 'category'];
      this.Push_Notification_Form.controls['redirectionId'].setValidators(
        Validators.required
      );
      this.Push_Notification_Form.controls[
        'redirectionId'
      ].updateValueAndValidity();

      // this.Push_Notification_Form.get('redirectionId').setValidators([Validators.required]);
    } else if (value === 'Foliofit') {
      this.Medmall_Flag = false;
      this.value_array = [
        'Fitness Club',
        'Yoga',
        'Diet Regieme',
        'Health',
        'Nutri Chart',
        'BMI',
      ];
      this.product_array = [];
      this.Push_Notification_Form.controls['redirectionId'].clearValidators();
      this.Push_Notification_Form.controls[
        'redirectionId'
      ].updateValueAndValidity();
      // this.Push_Notification_Form.get('redirectionId').clearValidators
    } else if (value === 'Medfeed') {
      this.Medmall_Flag = false;
      this.value_array = [
        'Med Articles',
        'Medquiz',
        'Expert Advice',
        'Health Tips',
        'Live Updates',
        'Home',
      ];
      this.product_array = [];
      this.Push_Notification_Form.controls['redirectionId'].clearValidators();
      this.Push_Notification_Form.controls[
        'redirectionId'
      ].updateValueAndValidity();
      // this.Push_Notification_Form.get('redirectionId').clearValidators
    }

    if (type == 'edit') {
      this.Push_Notification_Form.get('type').reset();
    }

    // this.Push_Notification_Form.get('redirectionId').updateValueAndValidity
  }

  dropDownProductChange(value: any, type) {
    console.log(value);
    if (value === 'product') {
      this.product_array = [];
      this.product_array = this.productList;
      this.Push_Notification_Form.controls['redirectionId'].setValidators(
        Validators.required
      );
      this.Push_Notification_Form.controls[
        'redirectionId'
      ].updateValueAndValidity();
    } else if (value === 'category') {
      this.product_array = [];
      this.product_array = this.categoryList;
      this.Push_Notification_Form.controls['redirectionId'].setValidators(
        Validators.required
      );
      this.Push_Notification_Form.controls[
        'redirectionId'
      ].updateValueAndValidity();
    } else {
      this.dropDownChange(
        this.Push_Notification_Form.get('redirectionType').value,
        ''
      );
    }

    if (type == 'edit') {
      this.Push_Notification_Form.get('redirectionId').reset();
    }
  }

  public closeResult: string;
  open(content, remark_id) {
    this.Submitted = false;
    this.Loading = false;
    console.log(remark_id);
    this.Add_Customer_Form.reset();
    this.Remark_Id = null;
    if (remark_id != '') {
      this.Remark_Id = remark_id;
      this.Remark_Form.reset();
      this.get_CUSTOMER_REMARK(this.Remark_Id);
    } else {
      console.log('no remarks');
    }

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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  tabchange_Function(event) {
    this.image_URL = '';
    this.skip = 0;
    console.log(event.nextId);
    if (event.nextId == 'Customer_Database') {
      this.get_CUSTOMER_DATABASE(1);
      this.Init_Add_Customer_Form();
    } else if (event.nextId == 'Popup_Banner') {
      this.Popup_Banner_Form_Init();
    } else if (event.nextId == 'Push_Notification') {
      this.View_Only_Flag = false;
      this.Update_Flag = false;
      this.Medmall_Flag = false;
      this.Immediate_Flag = false;
      this.Create_Push_Flag = true;
      this.Back_Button_Click();
      this.getCategoryDetails();
      this.getProductsDetails();
      this.init_Push_Notification_Form();
    } else if (event.nextId == 'Medcoin_Distribution') {
    } else if (event.nextId == 'Promotional_Mail') {
    } else if (event.nextId == 'Promotional_SMS') {
    } else {
      console.log('nothing');
    }
  }

  Customer_Detail_pg(id: any) {
    console.log(id);
    
    this._routes.navigate(['customer-details/cust/' + id]);

    // this._routes.navigate(['/customer-details'])
    // + id
  }

  Search_Details(input, pg) {
    console.log(input.target.value, "value");
    if (input.target.value != null) {
      this.Search_Word = input.target.value
      this.Search_Flag = true
    } else {
      this.Search_Word = null
      this.Search_Flag = false
    }
    this.Search_Api_Call(this.Search_Word,pg)
    
  }
  Search_Api_Call(key,pg){
    let data = {
      keyword: key,
      page: pg,
      limit: 10
    }


    this.Customer_Relation_Service.search_CUSTOMER(data).subscribe((res: any) => {
      console.log(res);


      this.addLoading = true;

      this.current_page = res.data.current_page;
      this.hasNextPage = res.data.hasNextPage;
      this.hasPrevPage = res.data.hasPrevPage;
      //  this.total_items = res.data.total_items
      this.total_page = res.data.total_page;

      let mappedData = res.data.finalResult.map((item) => {
        return {
          _id: item._id,
          customerId: item.customerId,
          createdAt: item.createdAt ? item.createdAt.slice(0, 10) : 'no dt',
          sl: item.sl,
          phone: item.phone,
          name: item.name,
          image: item.image,
          locality: item.locality,
          premium: item.premium,
          // total: item.image,
          orderValue: item.orderValue,
        };
      });
      this.Customer_Database_Array = [];
      this.Customer_Database_Array = mappedData;
      this.addLoading = false;


    })
  }


  pop(res: any) {
    console.log(res.data, 'res data');
    console.log(res.status, 'res status');
    // this.attemptedSubmit = false
    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
      this.uploadImage = undefined;
      this.image_URL = '';
      this.Update_Flag = false;
      this.View_Only_Flag = false;

      this.Edit_Notification_Id = '';

      // this.get_ALL_STORE()
      // this.Push_Notification_Form.reset()
      this.get_CUSTOMER_DATABASE(1);
      this.modalService.dismissAll();
      this.Popup_Banner_Form_Init();
      this.init_Push_Notification_Form();
      this.skip = 0;
    } else {
      Swal.fire({
        text: res.data,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
      // this.updateFlag = false
    }
    this.addLoading = false;
    this.Loading = false;
    this.Submitted = false;
    
  }
  public payForm: FormGroup = this.formBuilder.group({
    segment: ['all_customers'],
    customers: ['', [Validators.required]],
    medCoinCount: ['', [Validators.required, Validators.min(1)]],
    narration: ['', [Validators.required]],
    expiryDate: ['', [Validators.required]],
  });

  public onChangeSegment(segmentValue) {
    const body = {
      segment: segmentValue,
      page: 0,
      selectAll: false,
    };
    this.get_CUSTOMER_BY_SEGMENT(body);
  }
  public payCustomerChange(value: any) {
    // let data: any = [];
    // let paginate: any = [];
    this.customerIds = [];
    console.log(this.payForm.value);
    this.payForm.get('customers').value.forEach((el) => {
      this.customerIds.push(el['_id']);
    });
    console.log(this.customerIds);
  }

  public payCustomerFilter(value) {
    if (value.length >= 1) {
      console.log(value);
      const body = {
        segment: this.payForm.get('segment').value,
        name: value.toLowerCase(),
        page: 0,
      };
      this.get_CUSTOMER_BY_SEGMENT(body);
    } else {
      this.get_CUSTOMER_BY_SEGMENT({
        segment: this.payForm.get('segment').value,
        page: 0,
      });
    }
  }
  public isValidPay(controlName) {
    return (
      (this.payForm.get(controlName).invalid &&
        this.payForm.get(controlName).touched) ||
      (this.hasErrorPay && this.payForm.get(controlName).invalid)
    );
  }

  public onSubmitPay() {
    console.log(this.payForm.value);

    if (this.payForm.invalid) {
      this.hasErrorPay = true;
    } else {
      this.hasErrorPay = false;
      const body = {
        customers: this.customerIds,
        medCoinCount: this.payForm.get('medCoinCount')!.value,
        expiryDate: this.payForm.get('expiryDate')!.value,
        narration: this.payForm.get('narration')!.value,
      };
      this._medService.payMedcoin(body).subscribe(
        (res: any) => {
          console.log(res);
          this.payForm.reset();
          this.payForm.get('segment').setValue('all_customers');

          if (res.error == false) {
            Swal.fire({
              icon: 'success',
              title: res.message,
            });
          } else {
            console.log('some error');
            Swal.fire({
              icon: 'error',
              title: res.message,
            });
          }
        },
        (err: any) => {
          this.payForm.reset();
          this.payForm.get('segment').setValue('all_customers');
          console.log(err);
        }
      );
    }
  }
  selectAllCustomers() {
    const body = {
      segment: this.payForm.get('segment').value,
      selectAll: true,
    };
    this.get_CUSTOMER_BY_SEGMENT(body);
    this.payForm.patchValue({
      customers: this.Customer_Array,
    });
    this.payForm.get('customers').value.forEach((el) => {
      this.customerIds.push(el['_id']);
    });
  }
  public getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
  // dateChanged(val) {
  //   console.log(val);
  //   this.payForm.get('expiryDate').setValue(val);
  // }
  // dateInp(val) {
  //   console.log(val);
  // }
}
