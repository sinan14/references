import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { SharedServiceService } from '../../../shared-service.service';
import { PermissionService } from 'src/app/permission.service';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;


  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if ((element.nodeName === 'TD' || element.nodeName === 'TH')
      && element.offsetWidth < element.scrollWidth) {
      this.tooltipDir.toggle(element);
    } else {
      this.tooltipDir.hide();
    }
  }


  public listPolicy: Array<string> = ['Diwali Festive Offer'];




  public orderData = [
    {
      slno: "1",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      name: "Aswin Vinod",
      items: "2+",
      contact: "9843256587",
    },
    {
      slno: "2",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      name: "Aswin Vinod",
      items: "2+",
      contact: "9843256587",
    },
    {
      slno: "3",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      name: "Aswin Vinod",
      items: "2+",
      contact: "9843256587",
    },
    {
      slno: "4",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      name: "Aswin Vinod",
      items: "2+",
      contact: "9843256587",
    },
    {
      slno: "5",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      name: "Aswin Vinod",
      items: "2+",
      contact: "9843256587",
    },
  ]


  public packing_pending = [
    {
      slno: "1",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      name: "Aswin Vinod",
      store: "Store 1",
      items: "2+",
      approval: "10 : 00 am",
      approvaldate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
    {
      slno: "2",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      name: "Aswin Vinod",
      store: "Store 2",
      items: "2+",
      approval: "10 : 00 am",
      approvaldate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
    {
      slno: "3",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      name: "Aswin Vinod",
      store: "Store 3",
      items: "2+",
      approval: "10 : 00 am",
      approvaldate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
  ]

  public auto_pickup = [
    {
      slno: "1",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      items: "2+",
      packingtime: "10 : 00 am",
      packingdate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
    {
      slno: "2",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      items: "2+",
      packingtime: "10 : 00 am",
      packingdate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
    {
      slno: "3",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      items: "2+",
      packingtime: "10 : 00 am",
      packingdate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
  ];


  public manual_pickup = []


  public transit_auto_pickup = [
    {
      slno: "1",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      items: "2+",
      pickuptime: "10 : 00 am",
      pickupdate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
    {
      slno: "2",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      items: "2+",
      pickuptime: "10 : 00 am",
      pickupdate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
    {
      slno: "3",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      items: "2+",
      pickuptime: "10 : 00 am",
      pickupdate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
  ]


  public delivered_auto_pickup = [
    {
      slno: "1",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      items: "2+",
      deliveredtime: "10 : 00 am",
      delivereddate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
    {
      slno: "2",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      items: "2+",
      deliveredtime: "10 : 00 am",
      delivereddate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
    {
      slno: "3",
      orderid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      items: "2+",
      deliveredtime: "10 : 00 am",
      delivereddate: "21 Dec 2021",
      zone: "Kerala 562523"
    },
  ];


  public return_data = [];
  public Quality_Check = [];
  public Quality_Check_Flag: boolean = false;
  public Delivery_Boy_Collected: boolean = false;
  public Refund_Approval_Declined = [];
  public Return_Reason: any = '';
  public Return_Notes: any = '';



  public return_data_pickup = [
    {
      slno: "1",
      returnid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      orderid: "SDE4525 ",
      items: "2+",
      amount: "Kerala 562523"
    },
    {
      slno: "2",
      returnid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      orderid: "SDE4525 ",
      items: "2+",
      amount: "Kerala 562523"
    },
    {
      slno: "3",
      returnid: "SDE4525 ",
      date: "Dec 10,10:00 am",
      trackingid: "23453",
      orderid: "SDE4525 ",
      items: "2+",
      amount: "Kerala 562523"
    },
  ];



  public deliveryBoyData = []


  public formArray = [{
    product_id: "",
    variantId: "",
    quantity: "",
    whenToTake: "before",
    morning: "0",
    noon: "0",
    night: "0",
    days: "1",
    instructions: "",
    uomValue: "",
    productName: "",
    status: "",
  }];
  public UOM_Dropdown_Array = []

  public closeResult: string;
  public accountForm: FormGroup;
  public permissionForm: FormGroup;

  public media = [];

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public editPermFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public addFlag: boolean;

  public PRESCRIPTION_AWAITED_Array: any = []
  public Total_Prescription_Awaited_Data: any = 0
  public current_page: any;
  public hasNextPage: boolean;
  public total_page: any;
  public hasPrevPage: boolean;


  public count_approved: any;
  public count_declined: any;
  public count_qualityCheck: any;
  public count_returnPickup: any;
  public count_returnRequests: any;

  public Date_Now: any
  public Time_Now: any
  public loading: boolean = true;
  public CreatePrescriptionLoading: boolean = false;
  public StatusBlank: boolean = false;


  // public current_page_prescriptionh_awaited: any;
  // public hasNextPage_prescriptionh_awaited: boolean;
  // public total_pag_prescriptionh_awaitede: any;
  // public hasPrevPage_prescriptionh_awaited: boolean;
  public PrerscriptionAwaitedOrderId: any = ''
  public RejectReason: any = 'Others'


  public Total_Packing_Pending_Data: any = 0
  // public current_page_packing_pending: any;
  // public hasNextPage_packing_pending: boolean;
  // public total_page_packing_pending: any;
  // public hasPrevPage_packing_pending: boolean;

  public Order_Object_ID: any;

  public Invoice_Array: any = []
  public Name: any = ''
  public Age: any = ''
  public Order_Time: any = ''
  public Shipping: any = ''
  public Contact_Number: any = ''
  public ShippingAddress: any = ''
  public Payment_Type: any = ''
  public TotalAmount: any = ''
  public MedCoins: any = ''
  public MemberDiscount: any = ''
  public CouponAppliedDiscount: any = ''
  public PayableAmount: any = ''
  public DeliveryCharge: any = ''
  public DonationAmount: any = ''
  public DeliveryWasFree: boolean = false;

  public BankAccName: any = ''
  public BancAccNum: any = ''
  public BankIfsc: any = ''
  public BankName: any = ''
  public BankBranch: any = ''
  public BankAccType: any = ''



  public RETURN_ID: any = ''
  public RETURN_DT: any = ''
  public ORDER_ID: any = ''
  public ORDER_DT: any = ''
  public DELIVERY_DT: any = ''
  public DELIVERY_ADDR: any = ''
  public DELIVERY_NAME: any = ''
  public PICKUP_NAME: any = ''
  public PICKUP_ADDR: any = ''
  public STORE_ADDR: any = ''
  public RefundableAmount: any = ''


  public returnStatuses = []




  public body: any

  public Remark_Form: FormGroup
  public Create_Prescription_Form: FormGroup
  public Description_Create_Prescription: any = ''
  public About_Diagnosis_Create_Prescription: any = ''
  public Allergies_Create_Prescription: any = ''

  public attemptedSubmit: boolean = false
  public formArrayErrorFlag: boolean = false
  // public Prescription_Awaited_Search_Key: any = ''

  public Payment_Awaited_Body: any
  public Search_Key: any = ''
  public Payment_Awaited_Type: any = 'payable'
  public Payment_Awaited_Array: any = []

  public Total_Payment_Awaited_Payable_Data: any = 0
  public Total_Payment_Awaited_Receiveable_Data: any = 0
  // public current_page_payment_awaited: any;
  // public hasNextPage_payment_awaited: boolean;
  // public total_page_payment_awaited: any;
  // public hasPrevPage_payment_awaited: boolean;

  public Review_Pending_Array: any = []
  public Review_Pending_Total_Data: any = []
  public Review_Pending_Flag: boolean = false


  ////used for remark updation type (remark type)
  public Tab_Type: any = 'prescription awaited'
  public Current_Tab: any = 'prescription'
  public Inner_Tab: any = ''
  public APPROVE_DECLINE_STATUS: any = ''



  public Delivery_Boy_Button: boolean = true
  public Packing_Pending_Btn: boolean = true
  public Return_Flag: boolean = false


  public Item_Id: any = ''
  public UserId_For_HealthData: any = ''
  public UserId_For_Detailpg_Redirection: any = ''


  public healthData_Array: any = []

  //order id for ACCEPT / REJECT REVIEW PENDING ORDER
  public ReviewPendingOrderId: any = ''
  public deliveryBoyId: any = ''

  public Prescription_Image_Array = []

  public Admin: boolean = false
  public Store: boolean = false


  public Doctor_Name: any = ''
  public Doctor_Sign: any = ''


  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _Shared_Service: SharedServiceService,
    private router: Router, private location: Location,
    private permissionService: PermissionService,
    private Order_Service: OrderServiceService) {
    this.media = mediaDB.data;
    this.createAccountForm();
    this.createPermissionForm();
  }


  ngOnInit() {
    console.log(this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }
    if (this.user.isAdmin === true) {
      this.Admin = true
      this.Store = false
    } else if (this.user.isStore === true) {
      this.Admin = false
      this.Store = true
    } else {
      this.Admin = false
      this.Store = false
      this.get_DOCTOR_DETAILS()
    }
    // this.formArray.push('3');
    // this.Current_Tab = 'prescription'
    this.get_table_functions(1)
    // this.Prescription_Awaited(1, '')
    // this.Packing_Pending(1, '')
    // this.Review_Pending(1, '')

    this.init_Forms()

  }

  // get_DOCTOR_DETAILS
  get_DOCTOR_DETAILS() {
    this.Order_Service.get_DOCTOR_DETAILS().subscribe((res: any) => {
      console.log(res);

      this.Doctor_Name = res.data.doctorDetails.fullName
      this.Doctor_Sign = res.data.doctorDetails.signature
    })
  }

  //Prescription Awaited Functions
  Prescription_Awaited(page, search_key) {
    console.log(this.Current_Tab, "called by pop");
    this.loading = true

    this.Search_Key = search_key
    if (this.Search_Key == '') {

      this.Order_Service.get_PRESCRIPTION_AWAITED(page, '').subscribe((res: any) => {
        console.log(res, "prespresprespres");

        this.Total_Prescription_Awaited_Data = res.data.pageDetails.totalDocuments

        if (this.Current_Tab == 'prescription') {
          this.PRESCRIPTION_AWAITED_Array = []
          this.PRESCRIPTION_AWAITED_Array = res.data.prescriptionAwaitedOrders

          this.current_page = res.data.pageDetails.currentPage
          this.hasNextPage = res.data.pageDetails.hasNextPage
          this.total_page = res.data.pageDetails.totalPages
          this.hasPrevPage = res.data.pageDetails.hasPrevPage
          this.loading = false

        }


        // this.current_page_prescriptionh_awaited = res.data.pageDetails.currentPage
        // this.hasNextPage_prescriptionh_awaited = res.data.pageDetails.hasNextPage
        // this.total_pag_prescriptionh_awaitede = res.data.pageDetails.totalPages
        // this.hasPrevPage_prescriptionh_awaited = res.data.pageDetails.hasPrevPage

      })
    } else {
      let body = {
        "searchBy": this.Search_Key
      }
      this.Order_Service.get_PRESCRIPTION_AWAITED(page, body).subscribe((res: any) => {
        console.log(res, "prespresprespres");

        this.Total_Prescription_Awaited_Data = res.data.pageDetails.totalDocuments
        // this.current_page_prescriptionh_awaited = res.data.pageDetails.currentPage
        // this.hasNextPage_prescriptionh_awaited = res.data.pageDetails.hasNextPage
        // this.total_pag_prescriptionh_awaitede = res.data.pageDetails.totalPages
        // this.hasPrevPage_prescriptionh_awaited = res.data.pageDetails.hasPrevPage
        if (this.Current_Tab == 'prescription') {
          this.PRESCRIPTION_AWAITED_Array = []
          this.PRESCRIPTION_AWAITED_Array = res.data.prescriptionAwaitedOrders

          this.current_page = res.data.pageDetails.currentPage
          this.hasNextPage = res.data.pageDetails.hasNextPage
          this.total_page = res.data.pageDetails.totalPages
          this.hasPrevPage = res.data.pageDetails.hasPrevPage
          this.loading = false

        }

      })
    }
  }


  //PAYMENT_AWAITED
  get_PAYMENT_AWAITED(pg, search_key) {
    this.loading = true

    if (search_key == '') {
      this.body = {
        "page": pg,
        "type": this.Payment_Awaited_Type
      }
    } else {
      this.body = {
        "page": pg,
        "type": this.Payment_Awaited_Type,
        "searchBy": this.Search_Key
      }
    }
    this.Order_Service.get_PAYMENT_AWAITED(this.body).subscribe((res: any) => {
      console.log(res);


      // this.Payment_Awaited_Array = res.data.paymentAwaitedOrders

      this.Total_Payment_Awaited_Receiveable_Data = res.data.pageDetails.totalReceivableDocumentsCount
      this.Total_Payment_Awaited_Payable_Data = res.data.pageDetails.totalPayableDocumentsCount

      // this.current_page_payment_awaited = res.data.pageDetails.currentPage
      // this.hasNextPage_payment_awaited = res.data.pageDetails.hasNextPage
      // this.total_page_payment_awaited = res.data.pageDetails.totalPages
      // this.hasPrevPage_payment_awaited = res.data.pageDetails.hasPrevPage
      if (this.Current_Tab == 'payment-awaited') {
        this.Payment_Awaited_Array = []
        this.Payment_Awaited_Array = res.data.paymentAwaitedOrders

        this.current_page = res.data.pageDetails.currentPage
        this.hasNextPage = res.data.pageDetails.hasNextPage
        this.total_page = res.data.pageDetails.totalPages
        this.hasPrevPage = res.data.pageDetails.hasPrevPage
        this.loading = false

      }
    })

  }


  //Add Remark
  Add_Remark() {
    this.attemptedSubmit = true
    if (this.Remark_Form.valid) {
      let body = {
        "orderId": this.Order_Object_ID,
        "remarks": this.Remark_Form.get('remark').value,
        "remarkType": this.Tab_Type
      }
      console.log(body);
      this.Order_Service.update_REMARK(body).subscribe((res: any) => {
        console.log(res);
        this.pop(res)
      })
    }
  }


  Medicine_Dropdown1_Select(val, i) {
    // console.log(i, "index index index");
    // this.formArray[i].productName = val.productName
    // console.log(this.formArray[i].productName, "name name nmae");

    // console.log(val, "may be");
    // let new_array = this.formArray[i]
    this.formArray[i].product_id = val
    // console.log(this.formArray, "new test test 123123123")
    // console.log(this.listPolicy,"array test");

    this.listPolicy.forEach((itm: any) => {
      if (itm.product_id == val) {
        this.UOM_Dropdown_Array = []
        this.UOM_Dropdown_Array = itm.variants
        this.formArray[i].variantId = ''
      }
    })
  }

  UOM_Dropdown_Select(val, i) {
    this.formArray[i].variantId = val
    console.log(this.formArray, "form array");

  }


  Create_Prescription() {
    // Create_Prescription(medicineForm:any) {
    // console.log(medicineForm);


    this.attemptedSubmit = true
    this.formArrayErrorFlag = false
    console.log("click 1");
    console.log(this.formArrayErrorFlag);
    console.log(this.formArray);
    if (this.formArray.length != 0) {


      for (let i = 0; i < this.formArray.length; i++) {
        console.log(this.formArray[i].morning + this.formArray[i].noon + this.formArray[i].night, "sumsumsumsumsumsumsumsumsumsunmsum");


        // !medicineForm.valid ||
        // (this.formArray[i].morning == '' && this.formArray[i].noon == '' && this.formArray[i].night == '')
        // !pricingForm.valid || || this.formArray[i].instructions == ''variantId || this.formArray[i].uomValue == '' ||
        if (this.formArray[i].product_id == '' ||
          this.formArray[i].quantity == '' || (this.formArray[i].morning + this.formArray[i].noon + this.formArray[i].night == '0') ||
          this.formArray[i].days == '' || this.formArray[i].variantId == ''
          || this.formArray[i].whenToTake == '') {
          this.formArrayErrorFlag = true
          return false;
        } else {
          this.formArrayErrorFlag = false
        }
      }

      console.log(this.formArrayErrorFlag);


      if (this.Create_Prescription_Form.valid && !this.formArrayErrorFlag) {
        // let med_array = []
        this.CreatePrescriptionLoading = true
        let med_array = this.formArray.map((i) => (
          {
            "product_id": i.product_id,
            "variantId": i.variantId,
            "quantity": i.quantity,
            "whenToTake": i.whenToTake,
            "morning": i.morning,
            "noon": i.noon,
            "night": i.night,
            "days": i.days,
            "instructions": i.instructions.length == 0 ? null : i.instructions
          }
        ))
        // med_array.push(itm)
        console.log(med_array, "med3medmedmedmedmedmedmed");


        let body = {
          "orderId": this.Order_Object_ID,
          "patientName": this.Create_Prescription_Form.get('patientName').value,
          "age": this.Create_Prescription_Form.get('age').value,
          "sex": this.Create_Prescription_Form.get('sex').value,
          "aboutDiagnosis": this.About_Diagnosis_Create_Prescription.length == 0 ? null : this.About_Diagnosis_Create_Prescription,
          "allergies": this.Allergies_Create_Prescription.length == 0 ? null : this.Allergies_Create_Prescription,
          "description": this.Description_Create_Prescription.length == 0 ? null : this.Description_Create_Prescription,
          "medicineProducts": med_array
        }

        // console.log(this.About_Diagnosis_Create_Prescription,this.About_Diagnosis_Create_Prescription.length,"length check");
        // console.log(this.Allergies_Create_Prescription,this.Allergies_Create_Prescription.length,"length check allergies");
        // console.log(this.Description_Create_Prescription);


        console.log(body, "passing this");


        this.Order_Service.create_PRESCRIPTION(body).subscribe((res: any) => {
          console.log(res);

          this.pop(res)
        })

      }
    } else if (this.formArray.length == 0) {
      Swal.fire({
        text: "Can't Create Prescription With No Products",
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
    }
  }


  // Review_Pending
  Review_Pending(pg, search) {
    this.loading = true

    if (search == '') {
      this.body = {
        "page": pg
      }
    } else {
      this.body = {
        "page": pg,
        "searchBy": search
      }
    }
    this.Order_Service.get_REVIEW_PENDING(this.body).subscribe((res: any) => {
      console.log(res);

      this.Review_Pending_Total_Data = res.data.pageDetails.totalDocuments

      if (this.Current_Tab == 'review-pending') {
        this.Review_Pending_Array = []
        this.Review_Pending_Array = res.data.reviewPendingOrders

        this.current_page = res.data.pageDetails.currentPage
        this.hasNextPage = res.data.pageDetails.hasNextPage
        this.total_page = res.data.pageDetails.totalPages
        this.hasPrevPage = res.data.pageDetails.hasPrevPage
        this.loading = false

      }

    })
  }

  // get_Health_Data PACKING PANDING & REVIEW PENDING
  get_Health_Data(content) {
    console.log(this.UserId_For_HealthData);

    let body = {
      userId: this.UserId_For_HealthData
    }
    this.Order_Service.get_Health_Data(body).subscribe((res: any) => {
      console.log(res);

      if (res.error == true) {
        this.pop(res)
      } else {
        this.healthData_Array = []
        this.healthData_Array = res.data.healthData
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }


    })
  }




  // Packing_Pending
  Packing_Pending(page, search) {
    this.loading = true

    if (search == '') {
      this.body = {
        "page": page
      }
    } else {
      this.body = {
        "page": page,
        "searchBy": search
      }
    }

    this.Order_Service.get_Packing_Pending(this.body).subscribe((res: any) => {
      console.log(res);
      this.body = ''

      this.Total_Packing_Pending_Data = res.data.pageDetails.totalDocuments
      // this.current_page_packing_pending = res.data.pageDetails.currentPage
      // this.hasNextPage_packing_pending = res.data.pageDetails.hasNextPage
      // this.total_page_packing_pending = res.data.pageDetails.totalPages
      // this.hasPrevPage_packing_pending = res.data.pageDetails.hasPrevPage
      if (this.Current_Tab == 'packing-pending') {
        this.packing_pending = []
        this.packing_pending = res.data.packingPendingOrders

        this.current_page = res.data.pageDetails.currentPage
        this.hasNextPage = res.data.pageDetails.hasNextPage
        this.total_page = res.data.pageDetails.totalPages
        this.hasPrevPage = res.data.pageDetails.hasPrevPage
        this.loading = false

      }

    })
  }


  //Pickup_Pending_Manual_Pickup
  get_Pickup_Pending_Manual(page, search) {
    this.loading = true

    if (search == '') {
      this.body = {
        "page": page
      }
    } else {
      this.body = {
        "page": page,
        "searchBy": search
      }
    }

    this.Order_Service.get_Pickup_Pending_Manual(this.body).subscribe((res: any) => {
      console.log(res);
      if (this.Current_Tab == 'pickup-pending') {
        this.manual_pickup = []
        this.manual_pickup = res.data.pickupPendingOrders

        this.current_page = res.data.pageDetails.currentPage
        this.hasNextPage = res.data.pageDetails.hasNextPage
        this.total_page = res.data.pageDetails.totalPages
        this.hasPrevPage = res.data.pageDetails.hasPrevPage
        this.loading = false

      }

    })

  }


  // Transit_Manual
  get_Transit_Manual(page, search) {
    this.loading = true

    if (search == '') {
      this.body = {
        "page": page
      }
    } else {
      this.body = {
        "page": page,
        "searchBy": search
      }
    }


    this.Order_Service.get_Transit_Manual(this.body).subscribe((res: any) => {
      console.log(res);
      if (this.Current_Tab == 'transit') {
        this.manual_pickup = []
        this.manual_pickup = res.data.pickupPendingOrders

        this.current_page = res.data.pageDetails.currentPage
        this.hasNextPage = res.data.pageDetails.hasNextPage
        this.total_page = res.data.pageDetails.totalPages
        this.hasPrevPage = res.data.pageDetails.hasPrevPage
        this.loading = false

      }

    })


  }

  // Transit_Manual
  get_Delivered_Manual(page, search) {
    this.loading = true

    if (search == '') {
      this.body = {
        "page": page
      }
    } else {
      this.body = {
        "page": page,
        "searchBy": search
      }
    }


    this.Order_Service.get_Delivered_Manual(this.body).subscribe((res: any) => {
      console.log(res);
      if (this.Current_Tab == 'delivered') {
        this.manual_pickup = []
        this.manual_pickup = res.data.pickupPendingOrders

        this.current_page = res.data.pageDetails.currentPage
        this.hasNextPage = res.data.pageDetails.hasNextPage
        this.total_page = res.data.pageDetails.totalPages
        this.hasPrevPage = res.data.pageDetails.hasPrevPage
        this.loading = false

      }

    })

  }

  //RETURN MANAGEMENT FUNCTIONS

  //RETURN_REQUEST
  get_RETURN_REQUEST(page, search) {
    this.loading = true

    if (search == '') {
      this.body = {
        "page": page
      }
    } else {
      this.body = {
        "page": page,
        "searchBy": search
      }
    }
    this.Order_Service.get_RETURN_REQUEST(this.body).subscribe((res: any) => {
      console.log(res);
      if (this.Current_Tab == 'return-management') {
        this.count_approved = res.data.count_approved
        this.count_declined = res.data.count_declined
        this.count_qualityCheck = res.data.count_qualityCheck
        this.count_returnPickup = res.data.count_returnPickup
        this.count_returnRequests = res.data.count_returnRequests

        if (this.Inner_Tab == 'Return_Request') {
          this.return_data = []
          this.return_data = res.data.returnRequests


          this.current_page = res.data.CurrentPage
          this.hasNextPage = res.data.hasNextPage
          this.total_page = res.data.totalPages
          this.hasPrevPage = res.data.hasPrevPage
          this.loading = false


        }
      }
    })
  }

  // Direct_Approve_Refund_Order frm return request
  Direct_Approve_Refund_Order() {

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

        let body = {
          "returnId": this.Item_Id
        }
        // console.log(body);

        this.Order_Service.Direct_Approve_Refund_Order(body).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
  //RETURN PICKUP
  get_RETURN_PICKUP(page, search) {
    this.loading = true

    if (search == '') {
      this.body = {
        "page": page
      }
    } else {
      this.body = {
        "page": page,
        "searchBy": search
      }
    }
    this.Order_Service.get_RETURN_PICKUP(this.body).subscribe((res: any) => {
      console.log(res);

      if (this.Inner_Tab == 'Return_Pickup' && this.Current_Tab == 'return-management') {
        this.return_data_pickup = []
        this.return_data_pickup = res.data.returnPickup


        this.current_page = res.data.CurrentPage
        this.hasNextPage = res.data.hasNextPage
        this.total_page = res.data.totalPages
        this.hasPrevPage = res.data.hasPrevPage

        this.loading = false



      }
    })
  }

  //Move_To_QualityCheck From RETURN PICKUP
  Move_To_QualityCheck() {
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
        let body = {
          "id": this.Item_Id
        }
        this.Order_Service.Move_To_QualityCheck(body).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  //QUALITY CHECK
  get_QUALITY_CHECK(page, search) {
    this.loading = true

    if (search == '') {
      this.body = {
        "page": page
      }
    } else {
      this.body = {
        "page": page,
        "searchBy": search
      }
    }
    this.Order_Service.get_QUALITY_CHECK(this.body).subscribe((res: any) => {
      console.log(res);

      if (this.Inner_Tab == 'Quality_Check' && this.Current_Tab == 'return-management') {
        this.Quality_Check = []
        this.Quality_Check = res.data.qualityCheck


        this.current_page = res.data.CurrentPage
        this.hasNextPage = res.data.hasNextPage
        this.total_page = res.data.totalPages
        this.hasPrevPage = res.data.hasPrevPage
        this.loading = false


      }
    })
  }

  // Approve_Reject_ReturnOrder From QUALITY CHECK
  Approve_Reject_ReturnOrder(item, type) {
    item.status = type
    console.log(type, "type", item);
    if (this.returnStatuses.length) {
      let notInArray = true
      this.returnStatuses.forEach((itm) => {
        if (item.variantId == itm.variantId) {
          notInArray = false
          if (type != itm.status) {
            itm.status = type
            console.log("ind", itm);
            console.log(this.returnStatuses, "change status");
          }
        }
      })
      if (notInArray) {
        let obj = {
          variantId: item.variantId,
          status: type
        }
        this.returnStatuses.push(obj)

      }
    } else {
      let obj = {
        variantId: item.variantId,
        status: type
      }
      this.returnStatuses.push(obj)
    }

  }




  // Submit_Approve_Reject_ReturnOrder
  Submit_Approve_Reject_ReturnOrder() {
    console.log("call this");
    // if (this.returnStatuses.length != this.formArray.length) {
    //   this.formArray.forEach((item) => {
    //     if (item.status == '') {
    //       this.StatusBlank = true
    //     }
    //   })
    // }

    if (this.returnStatuses.length) {
      if (this.returnStatuses.length == this.formArray.length) {
        let body = {
          "id": this.Item_Id,
          "returnStatuses": this.returnStatuses
        }
        console.log(this.returnStatuses);
        console.log(body);

        this.Order_Service.Approve_Reject_ReturnOrder(body).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
        })

      } else {
        // if (this.StatusBlank) {
        Swal.fire({
          text: "Choose Status For All Items",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        })
      }

    } else {
      Swal.fire({
        text: "Choose Approve Or Decline",
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
    }
  }



  //REFUND APPROVAL,DECLINED
  get_REFUND_APPROVE_DECLINE(page, search) {
    this.loading = true

    if (search == '') {
      this.body = {
        "page": page,
        "status": this.APPROVE_DECLINE_STATUS
      }
    } else {
      this.body = {
        "page": page,
        "status": this.APPROVE_DECLINE_STATUS,
        "searchBy": search
      }
    }

    this.Order_Service.get_REFUND_APPROVE_DECLINE(this.body).subscribe((res: any) => {
      console.log(res);
      if (this.Current_Tab == 'return-management') {

        if (this.Inner_Tab == 'Refund_Approval' || this.Inner_Tab == 'Refund_Declined') {
          this.Refund_Approval_Declined = []
          this.Refund_Approval_Declined = res.data.approvedOrDeclined


          this.current_page = res.data.CurrentPage
          this.hasNextPage = res.data.hasNextPage
          this.total_page = res.data.totalPages
          this.hasPrevPage = res.data.hasPrevPage
          this.loading = false


        }
      }

    })


  }



  get_RETURN_INVOICE_BY_ORDER_ID(order_id) {
    let body = {
      "orderId": order_id
    }

    this.Order_Service.get_RETURN_INVOICE_BY_ORDER_ID(body).subscribe((res: any) => {
      console.log(res, "RETURN invoice  _id");


      this.Invoice_Array = []
      this.RETURN_ID = ''
      this.RETURN_DT = ''
      this.ORDER_ID = ''
      this.ORDER_DT = ''
      this.DELIVERY_DT = ''
      this.DELIVERY_ADDR = ''
      this.DELIVERY_NAME = ''
      this.PICKUP_NAME = ''
      this.PICKUP_ADDR = ''
      this.STORE_ADDR = ''
      this.RefundableAmount = ''
      this.TotalAmount = ''
      this.MedCoins = ''
      this.MemberDiscount = ''
      this.CouponAppliedDiscount = ''
      this.Payment_Type = ''
      this.Contact_Number = ''

      this.DonationAmount = ''
      this.DeliveryCharge = ''

      this.BankAccName = ''
      this.BancAccNum = ''
      this.BankIfsc = ''
      this.BankName = ''
      this.BankBranch = ''
      this.BankAccType = ''

      this.Invoice_Array = res.data.invoice.productStatements
      this.RETURN_ID = res.data.invoice.returnId
      this.RETURN_DT = res.data.invoice.returnDate
      this.ORDER_ID = res.data.invoice.orderId
      this.ORDER_DT = res.data.invoice.orderDate
      this.DELIVERY_DT = res.data.invoice.deliveryDate
      // this.DELIVERY_ADDR = res.data.invoice.deliveryAddress.name + ',' + res.data.invoice.deliveryAddress.wholeAddress
      this.DELIVERY_ADDR = res.data.invoice.deliveryAddress.wholeAddress
      this.DELIVERY_NAME = res.data.invoice.deliveryAddress.name
      this.PICKUP_NAME = res.data.invoice.pickupAddress.name
      // this.PICKUP_ADDR = res.data.invoice.pickupAddress.wholeAddress
      this.PICKUP_ADDR =  res.data.invoice.pickupAddress.wholeAddress
      this.STORE_ADDR = res.data.invoice.storeAddress
      // this.PICKUP_ADDR = res.data.invoice.pickupAddress.house + ',' + res.data.invoice.pickupAddress.street + ',' + res.data.invoice.pickupAddress.state
      this.RefundableAmount = res.data.invoice.amountStatements.payableAmount
      this.TotalAmount = res.data.invoice.amountStatements.totalAmount
      this.MedCoins = res.data.invoice.amountStatements.medCoins
      this.MemberDiscount = res.data.invoice.amountStatements.memberDiscount
      this.DeliveryCharge = res.data.invoice.amountStatements.deliveryCharge
      this.CouponAppliedDiscount = res.data.invoice.amountStatements.couponAppliedDiscount

      this.Contact_Number = res.data.invoice.contactNumber
      this.Payment_Type = res.data.invoice.paymentType


      this.BankAccName = res.data.invoice.bankDetails.customerName
      this.BancAccNum = res.data.invoice.bankDetails.accountNumber
      this.BankIfsc = res.data.invoice.bankDetails.ifsc
      this.BankName = res.data.invoice.bankDetails.bankName
      this.BankBranch = res.data.invoice.bankDetails.branch
      this.BankAccType = res.data.invoice.bankDetails.accountType


    })
  }





  get_ORDER_INVOICE_BY_ORDER_ID(order_id) {

    let body = {
      "orderId": order_id
    }

    this.Order_Service.get_ORDER_INVOICE_BY_ORDER_ID(body).subscribe((res: any) => {
      console.log(res, "invoice get by order id");

      this.Invoice_Array = []
      this.Name = ''
      this.Age = ''
      this.Order_Time = ''
      this.Shipping = ''
      this.Contact_Number = ''
      this.ShippingAddress = ''
      this.Payment_Type = ''
      this.TotalAmount = ''
      this.MedCoins = ''
      this.MemberDiscount = ''
      this.CouponAppliedDiscount = ''
      this.PayableAmount = ''
      this.DeliveryCharge = ''
      this.DeliveryWasFree = false
      this.DonationAmount = ''

     


      this.Invoice_Array = res.data.invoice.productStatements
      this.Name = res.data.invoice.name
      this.Age = res.data.invoice.age
      this.Order_Time = res.data.invoice.orderTime
      this.Shipping = res.data.invoice.shippingZone
      this.Contact_Number = res.data.invoice.contactNumber
      this.ShippingAddress = res.data.invoice.shippingAddress
      this.Payment_Type = res.data.invoice.paymentType
      this.TotalAmount = res.data.invoice.amountStatements.totalAmount
      this.MedCoins = res.data.invoice.amountStatements.medCoins
      this.MemberDiscount = res.data.invoice.amountStatements.memberDiscount
      this.CouponAppliedDiscount = res.data.invoice.amountStatements.couponAppliedDiscount
      this.PayableAmount = res.data.invoice.amountStatements.payableAmount
      this.DeliveryCharge = res.data.invoice.amountStatements.deliveryCharge
      this.DonationAmount = res.data.invoice.amountStatements.donationAmount
      this.DeliveryWasFree = res.data.invoice.amountStatements.deliveryWasFree


      



      this.Create_Prescription_Form.patchValue({
        patientName: this.Name,
        age: this.Age
      })
    })
  }


  get_DELIVERY_BOYS_BY_ORDER_ID(order_id) {
    let body = {
      "orderId": order_id
    }

    this.Order_Service.get_DELIVERY_BOYS_BY_ORDER_ID(body).subscribe((res: any) => {
      console.log(res);
      this.deliveryBoyData = []
      console.log(this.deliveryBoyId);

      res.data.deliveryBoys.forEach((itm) => {
        if (itm.deliveryBoyId == this.deliveryBoyId) {
          let obj = {
            "credit": itm.credit,
            "deliveryBoyId": itm.deliveryBoyId,
            "fullName": itm.fullName,
            "online": itm.online,
            "_id": itm._id,
            "assigned": true
          }
          this.deliveryBoyData.push(obj)

        } else {
          let obj = {
            "credit": itm.credit,
            "deliveryBoyId": itm.deliveryBoyId,
            "fullName": itm.fullName,
            "online": itm.online,
            "_id": itm._id,
            "assigned": false
          }
          this.deliveryBoyData.push(obj)

        }
      })
      console.log(this.deliveryBoyData);

      // this.deliveryBoyData = []
      // this.deliveryBoyData = res.data.deliveryBoys
    })
  }

  Assign_Delivery_Boy(item) {
    let body = {
      "orderId": this.Order_Object_ID,
      "deliveryBoyId": item._id
    }
    this.Order_Service.Assign_Delivery_Boy(body).subscribe((res: any) => {
      this.pop(res)
    })
  }

  Change_Delivery_Boy(item) {
    console.log(item, this.Item_Id);

    let body = {
      "id": this.Item_Id,
      "deliveryBoyId": item._id
    }
    this.Order_Service.Change_Delivery_Boy(body).subscribe((res: any) => {
      console.log(res);

      this.pop(res)
    })
  }

  Assign_Delivery_Boy_Return(item) {
    console.log(item, this.Item_Id);

    let body = {
      "id": this.Item_Id,
      "deliveryBoyId": item._id
    }
    this.Order_Service.Assign_Delivery_Boy_Return(body).subscribe((res: any) => {
      console.log(res);

      this.pop(res)
    })
  }

  Print_Invoice() {

    //TO PRINT IN CURRENT TAB (NOT READABLE)
    // var printContents = document.getElementById('print').innerHTML;
    // var originalContents = document.body.innerHTML;

    // document.body.innerHTML = printContents;

    // window.print();

    // document.body.innerHTML = originalContents;
    // window.focus();
    // window.location.reload();




    //TO PRINT IN NEW TAB (GOOD AND READABLE)

    var divToPrint = document.getElementById("print");
    let newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();



  }


  Radio_Click(type) {
    console.log(type);
    this.RejectReason = type
  }

  Reject_Prescription() {
    console.log(this.RejectReason);

    let body = {
      "prescriptionAwaitedOrderId": this.PrerscriptionAwaitedOrderId,
      "reason": this.RejectReason
    }

    this.Order_Service.post_REJECT_PRESCRIPTION(body).subscribe((res: any) => {
      console.log(res);
      this.pop(res)
    })

  }









  // handleFilter(value) {
  //   let data = this.listPolicy.filter(
  //     (s) => s.toLowerCase().indexOf(value.toLowerCase()) !== -1
  //   );
  //   this.listPolicy = data;
  // }



  After_Before(event) {
    console.log(event);
    this.formArray[0].whenToTake = event
  }


  //send_PAYMENT_LINK (PAYMENT AWAITED - RECIEVEABLES)
  send_PAYMENT_LINK(id) {
    console.log(id);
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
        let body = {
          "paymentAwaitedOrderId": id
        }

        this.Order_Service.send_PAYMENT_LINK(body).subscribe((res: any) => {
          console.log(res, "send link");
          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  // verify_PAYMENT_AWAITED_ORDER (PAYMENT AWAITED - RECIEVEABLES)
  verify_PAYMENT_AWAITED_ORDER(id) {
    let body = {
      "paymentAwaitedOrderId": id
    }
    this.Order_Service.verify_PAYMENT_AWAITED_ORDER(body).subscribe((res: any) => {
      console.log(res, "verify payment");
      this.pop(res)
    })
  }

  // Move_Patment_Awaqited_To_Review_Pending
  Move_To_Review_Pending(payment_awaited_order_id) {
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
        let body = {
          "paymentAwaitedOrderId": payment_awaited_order_id
        }
        this.Order_Service.Move_To_Review_Pending(body).subscribe((res: any) => {
          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }


  //PAYMENT AWAITED PAYABLES MEDCOIN REFUND
  Refund_Medcoin(payment_awaited_order_id) {
    console.log(payment_awaited_order_id, "paymentAwaitedOrderId");
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
        let body = {
          "paymentAwaitedOrderId": payment_awaited_order_id
        }
        this.Order_Service.Refund_Medcoin(body).subscribe((res: any) => {
          console.log(res);

          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  //PAYMENT AWAITED PAYABLES RAZORPAY REFUND
  Refund_Razorpay(payment_awaited_order_id, order_obj_id) {
    // console.log(payment_awaited_order_id, "paymentAwaitedOrderId");
    // console.log(order_obj_id, "orderId");
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
        let body = {
          "orderId": order_obj_id,
          "paymentAwaitedOrderId": payment_awaited_order_id
        }
        this.Order_Service.Refund_Razorpay(body).subscribe((res: any) => {
          console.log(res);

          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }



  //ACCEPT / REJECT REVIEW PENDING ORDER
  acpt_reject_ORDER(type) {

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
        let body = {
          "reviewPendingOrderId": this.ReviewPendingOrderId,
          "type": type
        }

        this.Order_Service.acpt_reject_ORDER(body).subscribe((res: any) => {
          console.log(res);

          this.pop(res)
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }




  /////////TAB CHANGE FUNCTIONS

  // selectedTab = 'prescription';
  selectedTab = 'prescription';
  tabChangeEvent(event) {
    this.loading = true
    console.log(event.nextId);
    this.Search_Key = ''
    this.Current_Tab = event.nextId
    if (event.nextId == 'prescription') {
      this.Tab_Type = 'prescription awaited'
      this.Prescription_Awaited(1, '')
    } else if (event.nextId == 'payment-awaited') {
      this.Tab_Type = 'payment awaited'
      this.get_PAYMENT_AWAITED(1, '')
    } else if (event.nextId == 'packing-pending') {
      // this.Tab_Type='packing pending'
      this.Packing_Pending(1, '')
    } else if (event.nextId == 'review-pending') {
      this.Tab_Type = 'review pending'
      this.Review_Pending(1, '')
    } else if (event.nextId == 'pickup-pending') {
      this.get_Pickup_Pending_Manual(1, '')
    } else if (event.nextId == 'transit') {
      this.get_Transit_Manual(1, '')
    } else if (event.nextId == 'delivered') {
      this.get_Delivered_Manual(1, '')
    } else if (event.nextId == 'return-management') {
      this.Inner_Tab = 'Return_Request'
      this.get_RETURN_REQUEST(1, '')
    }

    //localStorage.setItem("TabID",event.nextId);
  }


  //Sub Tab(Inner Tab)
  Inner_Tab_Change(name) {
    this.Search_Key = ''
    this.Inner_Tab = name
    this.loading = true

    document.getElementById('Search_Box')
    if (name == 'Payment_Awaited_Payables') {
      this.Delivery_Boy_Button = false

      this.Payment_Awaited_Type = 'payable'
      this.get_PAYMENT_AWAITED(1, '')
    } else if (name == 'Payment_Awaited_Recievables') {
      this.Payment_Awaited_Type = 'receivable'
      this.Delivery_Boy_Button = false
      this.get_PAYMENT_AWAITED(1, '')
    } else if (name == 'Pickup_Pending_Manual') {
      this.Delivery_Boy_Button = false
      this.get_Pickup_Pending_Manual(1, '')
    } else if (name == 'Transit_Manual') {
      this.Delivery_Boy_Button = false
      this.get_Transit_Manual(1, '')
    }


    else if (name == 'Return_Request') {
      this.Delivery_Boy_Button = false
      this.get_RETURN_REQUEST(1, '')
    } else if (name == 'Return_Pickup') {
      this.Delivery_Boy_Button = true

      this.get_RETURN_PICKUP(1, '')
    } else if (name == 'Quality_Check') {
      this.Delivery_Boy_Button = false
      this.get_QUALITY_CHECK(1, '')
    } else if (name == 'Refund_Approval') {
      this.Delivery_Boy_Button = false
      this.APPROVE_DECLINE_STATUS = 'approved'
      this.get_REFUND_APPROVE_DECLINE(1, '')
    } else if (name == 'Refund_Declined') {
      this.Delivery_Boy_Button = false
      this.APPROVE_DECLINE_STATUS = 'declined'
      this.get_REFUND_APPROVE_DECLINE(1, '')
      // this.get_Transit_Manual(1, '')
    }





  }




  ////////SEARCH FUNCTIONS

  // Search_Prescription_Awaited
  // Search_Prescription_Awaited(event) {
  //   console.log(event.target.value);
  //   this.Prescription_Awaited_Search_Key = event.target.value
  //   this.Prescription_Awaited(1, this.Prescription_Awaited_Search_Key)
  // }

  // Search_Packing_Pending
  // Search_Packing_Pending(event) {
  //   console.log(event.target.value);
  //   this.Packing_Pending(1, event.target.value)
  // }

  // Search_Medicine
  Search_Medicine(value) {
    console.log(value);
    let body = {
      keyword: value,
      page: 1,
      limit: 50
    }
    this.Order_Service.search_PRODUCTS(body).subscribe((res: any) => {
      console.log(res, "seraserasersa");
      this.listPolicy = []
      this.listPolicy = res.data.result
      console.log(this.listPolicy);
      // this.form
    })
  }

  // Search_Payment_Awaited
  Search_Order() {
    // this.Payment_Awaited_Search_Key = event.target.value
    if (this.Current_Tab == 'payment-awaited') {
      this.get_PAYMENT_AWAITED(1, this.Search_Key)
    } else if (this.Current_Tab == 'prescription') {
      this.Prescription_Awaited(1, this.Search_Key)
    } else if (this.Current_Tab == 'packing-pending') {
      this.Packing_Pending(1, this.Search_Key)
    } else if (this.Current_Tab == 'review-pending') {
      this.Review_Pending(1, this.Search_Key)
    } else if (this.Current_Tab == 'pickup-pending') {
      this.get_Pickup_Pending_Manual(1, this.Search_Key)
    } else if (this.Current_Tab == 'transit') {
      this.get_Transit_Manual(1, this.Search_Key)
    } else if (this.Current_Tab == 'delivered') {
      this.get_Delivered_Manual(1, this.Search_Key)
    }

    else if (this.Current_Tab == 'return-management') {

      if (this.Inner_Tab == 'Return_Request') {
        this.get_RETURN_REQUEST(1, this.Search_Key)
      } else if (this.Inner_Tab == 'Return_Pickup') {
        this.get_RETURN_PICKUP(1, this.Search_Key)
      } else if (this.Inner_Tab == 'Quality_Check') {
        this.get_QUALITY_CHECK(1, this.Search_Key)
      } else if (this.Inner_Tab == 'Refund_Approval') {
        this.get_REFUND_APPROVE_DECLINE(1, this.Search_Key)
      } else if (this.Inner_Tab == 'Refund_Declined') {
        this.get_REFUND_APPROVE_DECLINE(1, this.Search_Key)
      }

      // this.get_RETURN_REQUEST(1, this.Search_Key)
      console.log(this.Search_Key);

    }

  }








  /////////PAGINATION FUNCTIONS

  //Packing_Pending
  onPageChangeLow(page, type) {
    if (type == 'Packing_Pending') {
      console.log(page);
      // this.Packing_Pending(page, '')

      // if (this.Search_Key == '') {
      //   this.Packing_Pending(page, '')
      // } else {
      this.Packing_Pending(page, this.Search_Key)
      // }

    } else if (type == 'Prescription_Awaited') {
      // if (this.Search_Key == '') {
      //   this.Prescription_Awaited(page, '')
      // } else {
      this.Prescription_Awaited(page, this.Search_Key)
      // }
    } else if (type == 'PAYMENT_AWAITED') {
      // if (this.Search_Key == '') {
      //   this.get_PAYMENT_AWAITED(page, '')
      // } else {
      this.get_PAYMENT_AWAITED(page, this.Search_Key)
      // }
    } else if (type == 'Review_Pending') {
      // if (this.Search_Key == '') {
      //   this.Review_Pending(page, '')
      // } else {
      this.Review_Pending(page, this.Search_Key)
      // }
    } else if (type == 'Pickup_Pending_Manual') {
      // if (this.Search_Key == '') {
      //   this.get_Pickup_Pending_Manual(page, '')
      // } else {
      this.get_Pickup_Pending_Manual(page, this.Search_Key)
      // }
    } else if (type == 'Transit_Manual') {
      // if (this.Search_Key == '') {
      //   this.get_Transit_Manual(page, '')
      // } else {
      this.get_Transit_Manual(page, this.Search_Key)
      // }
    } else if (type == 'Delivered_Manual') {
      // if (this.Search_Key == '') {
      //   this.get_Delivered_Manual(page, '')
      // } else {
      this.get_Delivered_Manual(page, this.Search_Key)
      // }
    }


    else if (type == 'Return_Request') {
      // if (this.Search_Key == '') {
      //   this.get_RETURN_REQUEST(page, '')
      // } else {
      this.get_RETURN_REQUEST(page, this.Search_Key)
      // }
    }
    else if (type == 'Return_Pickup') {
      // if (this.Search_Key == '') {
      //   this.get_RETURN_PICKUP(page, '')
      // } else {
      this.get_RETURN_PICKUP(page, this.Search_Key)
      // }
    }
    else if (type == 'Quality_Check') {
      // if (this.Search_Key == '') {
      //   this.get_QUALITY_CHECK(page, '')
      // } else {
      this.get_QUALITY_CHECK(page, this.Search_Key)
      // }
    }
    else if (type == 'Refund_Approval_Declined') {
      // if (this.Search_Key == '') {
      //   this.get_REFUND_APPROVE_DECLINE(page, '')
      // } else {
      this.get_REFUND_APPROVE_DECLINE(page, this.Search_Key)
      // }
    }




  }

  //Prescription_Awaited
  // onPageChangeLow_Prescription_Awaited(page) {
  //   console.log(page);
  //   if (this.Prescription_Awaited_Search_Key == '') {
  //     this.Prescription_Awaited(page, '')
  //   } else {
  //     this.Prescription_Awaited(page, this.Prescription_Awaited_Search_Key)
  //   }
  //   // this.get_CUSTOMER_DATABASE(page);
  //   // this.addLoading = false;
  // }


  // onPageChangeLow_Payment_Awaited(page) {
  //   console.log(page);
  //   if (this.Payment_Awaited_Search_Key == '') {
  //     this.get_PAYMENT_AWAITED(page, '')
  //   } else {
  //     this.get_PAYMENT_AWAITED(page, this.Payment_Awaited_Search_Key)
  //   }
  // }

  // onPageChangeLow(page) {
  //   console.log(page);
  //   this.Prescription_Awaited(page)
  //   // this.get_CUSTOMER_DATABASE(page);
  //   // this.addLoading = false;
  // }








  ////PHONE NUM MASKING FUNCTION
  getmaskPhoneNumber(number: string) {
    let num = this._Shared_Service.numberMasking(number);
    return num;
  }

  //CUSTOMER DETAIL PAGE
  Customer_Detail_pg(table_id) {
    // UIN MDFL 21 11 10021
    console.log(this.UserId_For_HealthData, "obj id not needed");
    if (this.Admin == true) {
      if (table_id != '') {
        this.router.navigate(['customer-details/cust/' + table_id]);
      } else {
        this.router.navigate(['customer-details/cust/' + this.UserId_For_Detailpg_Redirection]);
        this.modalService.dismissAll();
      }
    }

    // this._routes.navigate(['/customer-details'])
    // + id
  }


  changeDateFormat() {
    // chnageDateFormat(date:any){
    var myDate = new Date();
    // var nextDay = new Date(date);


    var datePipe = new DatePipe('en-US');
    this.Date_Now = datePipe.transform(myDate, 'MMM : dd : yyyy');
    this.Time_Now = datePipe.transform(myDate, 'h : mm a');


  }





  open(content, itm, type) {
    console.log(itm, "itmtitmtitmtitmitm");
    if (itm.deliveryBoyId) {
      this.deliveryBoyId = itm.deliveryBoyId
    }
    this.changeDateFormat()
    this.CreatePrescriptionLoading = false
    // this.Date_Now = new Date();
    //  this.Time_Now = new Date();
    this.returnStatuses = []
    this.deliveryBoyData = []
    this.Prescription_Image_Array = []
    if (itm._id) {
      this.Item_Id = itm._id
    }
    if (itm.status == 'Submitted') {
      this.Delivery_Boy_Collected = true
      this.Quality_Check_Flag = true
    } else if (itm.status == 'Collected') {
      this.Delivery_Boy_Collected = true
      this.Quality_Check_Flag = false
    } else {
      this.Quality_Check_Flag = false
      this.Delivery_Boy_Collected = false
    }
    if (itm.reasons) {
      this.Return_Reason = itm.reasons
    } else {
      this.Return_Reason = ''
    }
    if (itm.notes) {
      this.Return_Notes = itm.notes
    } else {
      this.Return_Notes = ''
    }
    if (itm.prescription) {
      this.Prescription_Image_Array = itm.prescription
    }
    if (this.Current_Tab == 'pickup-pending') {
      this.Delivery_Boy_Button = true
      this.Packing_Pending_Btn = false
      this.Return_Flag = false
    } else if (this.Current_Tab == 'packing-pending') {
      this.Delivery_Boy_Button = false
      this.Packing_Pending_Btn = true
      this.Return_Flag = false
    }
    else if (this.Current_Tab == 'return-management') {
      this.Delivery_Boy_Button = false
      this.Packing_Pending_Btn = false
      this.Return_Flag = true
    }
    //  else if (this.Inner_Tab == 'Return_Pickup'){
    //   this.Delivery_Boy_Button = true
    //   this.Packing_Pending_Btn = false
    //   this.Return_Flag = true
    // }
    else {
      this.Packing_Pending_Btn = false
      this.Delivery_Boy_Button = false
      this.Return_Flag = false

    }

    if (itm.customerId) {
      this.UserId_For_Detailpg_Redirection = itm.customerId
    }

    if (itm.userId) {
      this.UserId_For_HealthData = itm.userId
    } else {
      this.UserId_For_HealthData = ''
    }

    if (itm.ReviewPendingOrderId) {
      this.ReviewPendingOrderId = itm.ReviewPendingOrderId
    } else {
      this.ReviewPendingOrderId = ''
    }


    if (itm.remarks != '') {
      this.Remark_Form.patchValue({
        remark: itm.remarks
      })

    } else {
      this.Remark_Form.reset()
    }


    if (itm.medicineProducts) {
      // if(itm.medicineProducts.length == 0){
      //   this.Search_Medicine(' ')
      // }else{
      // this.listPolicy = []
      // this.listPolicy = itm.medicineProducts;
      // this.formArray = itm.medicineProducts;

      // }


      this.formArray = itm.medicineProducts.map(i => {
        this.UOM_Dropdown_Array = i.variants

        return {
          "product_id": i.product_id,
          "variantId": i.variantId,
          "uomValue": i.uomValue,
          "productName": i.productName,
          "quantity": i.quantity,
          "whenToTake": 'before',
          "morning": 0,
          "noon": 0,
          "night": 0,
          "days": 1,
          "instructions": '',
          "status": "",

        }
      })
      this.listPolicy = []
      this.listPolicy = itm.medicineProducts;
      // this.UOM_Dropdown_Array =itm.medicineProducts;

      console.log(this.formArray);
    } else if (itm.products) {
      console.log(itm.products);

      this.listPolicy = []
      this.listPolicy = itm.products;


      this.formArray = itm.products.map(i => {
        this.UOM_Dropdown_Array = i.variants

        return {
          "product_id": i.product_id,
          "variantId": i.variantId,
          "uomValue": i.uomValue,
          "productName": i.productName,
          "quantity": i.quantity,
          "whenToTake": 'before',
          "morning": 0,
          "noon": 0,
          "night": 0,
          "days": 1,
          "instructions": '',
          "status": "",

        }
      })
      // this.Search_Medicine('')
      // this.UOM_Dropdown_Array =itm.medicineProducts;
      // this.formArray = itm.products;
      console.log(this.formArray);
    } else {
      this.formArray = [{
        product_id: "",
        variantId: "",
        quantity: "",
        whenToTake: "before",
        morning: "0",
        noon: "0",
        night: "0",
        days: '1',
        instructions: "",
        uomValue: "",
        productName: "",
        status: "",
      }]

    }



    if (itm.prescriptionAwaitedOrderId) {
      this.PrerscriptionAwaitedOrderId = ''
      this.PrerscriptionAwaitedOrderId = itm.prescriptionAwaitedOrderId
    }

    if (itm.orderObjectId && type != 'Return_Management') {
      this.Order_Object_ID = ''
      this.Order_Object_ID = itm.orderObjectId
      console.log(this.Order_Object_ID);
      this.get_ORDER_INVOICE_BY_ORDER_ID(this.Order_Object_ID)

    } else if (itm.orderObjectId && type == 'Return_Management') {

      this.Order_Object_ID = ''
      this.Order_Object_ID = itm.orderObjectId
      console.log(this.Order_Object_ID);
      // this.get_RETURN_INVOICE_BY_ORDER_ID(this.Order_Object_ID)
      this.get_RETURN_INVOICE_BY_ORDER_ID(itm._id)
    }

    if (type == 'Review_Pending') {
      this.Review_Pending_Flag = true
    } else {
      this.Review_Pending_Flag = false
    }


    if (itm == 'ReadyPickupManuallyContent') {
      this.deliveryBoyId = ''
      console.log(this.Order_Object_ID);
      this.get_DELIVERY_BOYS_BY_ORDER_ID(this.Order_Object_ID)
    } else if (itm == 'ChangeDeliverBoy') {
      console.log(this.Order_Object_ID);
      this.get_DELIVERY_BOYS_BY_ORDER_ID(this.Order_Object_ID)
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log(this.formArray);

  }




  disableTab(value) {
    if (this.user.isAdmin === true) {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      this.editPermFlag = this.permissionService.viewFlag;
      return flag;
    }
    else if (this.user.isStore === true) {
      let flag = this.permissionService.setPrivilages(value, this.user.isStore);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      this.editPermFlag = this.permissionService.viewFlag;
      return flag;
    }
    else {
      let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      this.editPermFlag = this.permissionService.viewFlag;
      return flag;
    }
  }



  public settings = {

    columns: {
      img: {
        title: 'Image',
        type: 'html',
      },
      file_name: {
        title: 'File Name'
      },
      url: {
        title: 'Url',
      },
    },
  };


  public config1: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };





  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      fname: [''],
      lname: [''],
      email: [''],
      password: [''],
      confirmPwd: ['']
    })
  }
  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({
    })
  }



  addForm() {
    console.log(this.formArray);
    // this.formArrayErrorFlag = false

    // for (let i = 0; i < this.formArray.length; i++) {
    //   // !pricingForm.valid || || this.formArray[i].instructions == ''
    //   if (this.formArray[i].product_id == '' || this.formArray[i].uomValue == '' ||
    //     this.formArray[i].quantity == '' || (this.formArray[i].morning == '' &&
    //       this.formArray[i].noon == '' && this.formArray[i].night == '') ||
    //     this.formArray[i].days == '' || this.formArray[i].variantId == ''
    //     || this.formArray[i].whenToTake == '') {
    //     this.formArrayErrorFlag = true
    //     return false;
    //   } else {
    //     this.formArrayErrorFlag = false
    this.Search_Medicine('')


    this.formArray.push({
      product_id: "",
      variantId: "",
      quantity: "",
      whenToTake: "before",
      morning: "0",
      noon: "0",
      night: "0",
      days: '1',
      instructions: "",
      uomValue: "",
      productName: "",
      status: "",
    });

    console.log(this.formArray);
    // }
    // }
  }
  removeForm(id) {
    console.log(this.formArray);
    this.formArray.splice(id, 1);
    console.log(this.formArray);
  }

  trackByFn(index: any) {
    return index;
  }




  pop(res: any) {
    this.attemptedSubmit = false
    this.CreatePrescriptionLoading = false

    if (res.error === false) {
      Swal.fire({
        text: res.message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })

      this.Order_Object_ID = ''
      this.Description_Create_Prescription = ''
      this.About_Diagnosis_Create_Prescription = ''
      this.Allergies_Create_Prescription = ''
      this.Remark_Form.reset()
      this.returnStatuses = []
      // this.Prescription_Awaited(this.current_page, this.Search_Key)
      // this.Packing_Pending(this.current_page, this.Search_Key)
      // this.Review_Pending(this.current_page, this.Search_Key)

      this.get_table_functions(this.current_page)
      // this.Packing_Pending(this.current_page_packing_pending,'')
      this.modalService.dismissAll();

    } else {
      Swal.fire({
        text: res.message,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })

      // this.updateFlag = false
    }
    // this.addLoading = false;
    // this.submitted = false;
  }

  init_Forms() {
    this.Remark_Form = this.formBuilder.group({
      remark: ['', [Validators.required]]
    })

    this.Create_Prescription_Form = this.formBuilder.group({

      patientName: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      sex: ['male', [Validators.required]],
      // aboutDiagnosis: [''],
      // allergies: [''],
      // labTest: [''],
      //need expansion inside this array
      medicineProducts: [''],
      description: ['']

    })
  }

  //function to get table data based on tabs
  get_table_functions(page) {

    this.get_PAYMENT_AWAITED(page, this.Search_Key)

    this.Prescription_Awaited(page, this.Search_Key)

    this.Packing_Pending(page, this.Search_Key)

    this.Review_Pending(page, this.Search_Key)

    this.get_Pickup_Pending_Manual(page, this.Search_Key)

    this.get_Transit_Manual(page, this.Search_Key)

    this.get_Delivered_Manual(page, this.Search_Key)

    this.get_RETURN_REQUEST(page, this.Search_Key)
    this.get_RETURN_PICKUP(page, this.Search_Key)
    this.get_QUALITY_CHECK(page, this.Search_Key)
    this.get_REFUND_APPROVE_DECLINE(page, this.Search_Key)






  }

}
