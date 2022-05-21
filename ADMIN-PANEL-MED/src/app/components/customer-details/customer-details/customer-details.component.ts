import { Component, OnInit } from '@angular/core';
import * as chartData from '../../../shared/data/chart';
import { productDB } from 'src/app/shared/tables/product-list';
import { reportDB } from 'src/app/shared/tables/report';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { CustomerDetailsService } from 'src/app/services/customer-details.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  private errorInAddToSubscription: boolean = false;
  public customerPremiumDetails: any;
  public customerOrderDetails: any;
  public customerSubscriptionDetails: any;

  public refundModeType: any = 'bank';

  public orderedProducts: any = [
    {
      index: 1,
      IsPrescriptionRequired: false,
      brandName: 'Aush',
      cartId: '61a8b7a1a71ee5fc2b1c44be',
      description:
        'dfgchjvbndfxghj ygvhjblnk ytfvhjbkn yghjknmcg yuughbn yuyfkjbn fvuh ytcghv rsx rrdtfyiu erstdc rtduyv tygub weaezdx 54rdtv rdtv tufyv 5tfv drtucyv  dfgchjvbndfxghj ygvhjblnk ytfvhjbkn yghjknmcg yuughbn yuyfkjbn fvuh ytcghv rsx rrdtfyiu dfgchjvbndfxghj ygvhjblnk ytfvhjbkn yghjknmcg yuughbn yuyfkjbn fvuh ytcghv rsx rrdtfyiu erstdc rtduyv tygub weaezdx 54rdtv rdtv tufyv 5tfv drtucyv  dfgchjvbndfxghj ygvhjblnk ytfvhjbkn yghjknmcg yuughbn yuyfkjbn fvuh ytcghv rsx rrdtfyiu',
      discountAmount: 11,
      discountInPercentage: 9,
      image: 'http://143.110.240.107:8000/inventory/image_1637153739202.jpg',
      isThisProductAddedToWhishList: false,
      offerType: 'Normal',
      outOfStock: false,
      price: 123,
      productName: 'Glucose',
      product_id: '6194fbd5b6ec74b7050ac3e3',
      quantity: 13,
      specialPrice: 112,
      type: 'healthcare',
      uomValue: 'SMALL',
      variantId: '619615dbdef106d807dda743',
    },
  ];
  public showOrderDetails: any = {
    _id: '',
    orderId: '',
    orderItem: '',
    orderDate: '',
    paymentType: '',
    address: '',
    couponUsed: '',
    medcoinUsed: '',
    cashUsed: '',
    totalPaid: '',
    products: [],
  };
  public orderBody: { id: any; keyword: string; limit: number; page: number } =
    {
      page: 1,
      id: '',
      limit: 10,
      keyword: '',
    };

  public product_list = [];
  public report = [];

  public list = [
    {
      img: 'assets/images/electronics/product/medical-mask.png',
      product_title: 'Medical Maks',
      discount: '$500.00',
      price: '$600.00',
      sale: '6',
      tag: 'old',
      qty: '90gm',
    },
  ];

  public closeResult: string;

  public settings = {
    actions: {
      position: 'right',
    },
    columns: {
      name: {
        title: 'Name',
      },
      id: {
        title: 'Transfer Id',
        type: 'html',
      },
      date: {
        title: 'Date',
      },
      total: {
        title: 'Total',
      },
    },
  };

  constructor(
    private _router: Router,
    private modalService: NgbModal,
    private Activated_router: ActivatedRoute,
    private Customer_Details_Service: CustomerDetailsService,
    private formBuilder: FormBuilder
  ) {
    this.product_list = productDB.product;
    this.report = reportDB.report;
  }
  public medcoinDatas: any = [];
  public customerId: any = '';

  public name: any = '';
  public phone: any = '';
  public email: any = '';
  public userId: any = '';
  public customerName: any;
  public customerSurname: any;
  public customerGender: any;
  public customerContact: any;
  public customerDateOfBirth: any;
  public customerBlood: any;
  public customerMaritalStatus: any;
  public customerHeight: any;
  public customerWeight: any;
  public customerEmail: any;
  public customerMedicalReason: any;
  public customerMedicalCMedication: any;
  public customerMedicalCMedicationDetail: any;
  public customerMedicalAllergies: any;
  public customerMedicalAllergiesDetail: any;
  public customerMedicalPMedication: any;
  public customerMedicalPMedicationDetail: any;
  public customerMedicalChronic: any;
  public customerMedicalChronicDetail: any;
  public customerMedicalInjuries: any;
  public customerMedicalInjuriesDetail: any;
  public customerMedicalSurgeries: any;
  public customerMedicalSurgeriesDetail: any;
  public reasonNotCompleting: any;
  public reasonNotComment: any;
  public customerFamilyMember: any;
  public familyArray: any;
  public customerFamilyName: any;
  public customerFamilySurname: any;
  public customerFamilyAge: any;
  public customerFamilyGender: any;
  public customerFamilyBlood: any;
  public customerFamilyHieght: any;
  public customerFamilyWeight: any;
  public customerFamilyRelation: any;
  public removeFamily: any;
  public Complaints_Array: any = [];
  public Dept_Complaints_Array: any = [];
  public View_Complaint_Flag: boolean = false;
  public Register_Complaint_Form: FormGroup;
  public Submitted: boolean = false;
  public preference: any = '';
  public Dept_Array: any = [];
  // public New_Complaint_Flag: boolean = false
  public Premium: boolean = false;
  public Notes_Array: any = [];
  public Notes_Form: FormGroup;
  public ID = '';
  public Dept: any;
  fmailyMemberStatus: any;

  ngOnInit(): void {
    this.Activated_router.paramMap.subscribe((res: any) => {
      this.customerId = res.get('cust_id');
      ////console.log(this.customerId, 'id passed');

      if (this.customerId != '') {
        this.get_User_Details(this.customerId);
        this.fetchMedcoinDetails({ page: 0, customerId: this.customerId });
        ////console.log('premium details');
        this.get_USER_COMPLAINTS_BY_ID(this.customerId);
        ////console.log('user id' + this.userId);
      }
    });
    this.ID = '';
    this.init_Forms();
  }

  init_Forms() {
    this.Register_Complaint_Form = this.formBuilder.group({
      phone: [],
      name: [],
      email: [],
      ReasonForComplaint: ['', [Validators.required]],
      Department: ['', [Validators.required]],
      preference: ['medium', [Validators.required]],
      Details: ['', [Validators.required]],
    });

    this.Notes_Form = this.formBuilder.group({
      notes: ['', Validators.required],
    });
  }

  get_User_Details(customer_id: any) {
    let body = {
      customerId: customer_id,
    };

    this.Customer_Details_Service.get_User_Details(body).subscribe(
      (res: any) => {
        //console.log(res);
        this.name = res.data[0].name;
        this.phone = res.data[0].phone;
        this.email = res.data[0].email;
        this.userId = res.data[0]._id;
        this.Premium = res.data[0].premiumUser;
        ////console.log(this.userId);
        this.orderBody = {
          page: 1,
          limit: 10,
          id: this.userId,
          keyword: '',
        };
        this.fetchOrders(this.orderBody);
        // this.fetchCustomerPremiumDetails(this.userId);
        // this.fetchSubscription({ id: this.userId });
        this.Notes_Array = [];
        this.Notes_Array = res.data[0].notes;
        this.ID = res.data[0]._id;
        //  this.name = res.data[0].name

        this.Customer_Details_Service.get_customer_Details(
          this.userId
        ).subscribe((res: any) => {
          this.customerFamilyMember = res.data.family;
          ////console.log('length=' + this.customerFamilyMember.length);
          if (this.customerFamilyMember.length > 0) {
            this.fmailyMemberStatus = 'Family Members';
          } else {
            this.fmailyMemberStatus = 'No family members';
          }
          this.familyArray = this.customerFamilyMember.slice(1);
          this.customerName = res.data.user.name;
          this.customerSurname = res.data.user.surname;
          this.customerGender = res.data.user.gender;
          this.customerContact = res.data.user.phone;

          this.customerDateOfBirth = res.data.user.dob;
          this.customerBlood = res.data.user.bloodGroup;
          this.customerMaritalStatus = res.data.user.maritalStatus;
          this.customerHeight = res.data.user.height;
          this.customerWeight = res.data.user.weight;
          this.customerEmail = res.data.user.email;
          this.reasonNotCompleting = res.data.reason.reason;
          this.reasonNotComment = res.data.reason.comment;
          if (res.data.medical.currentMed == 'true') {
            this.customerMedicalCMedication = 'Yes';
          } else {
            this.customerMedicalCMedication = 'No';
          }

          this.customerMedicalCMedicationDetail =
            res.data.medical.currentMedDetails;
          if (res.data.medical.allergies == 'true') {
            this.customerMedicalAllergies = 'Yes';
          } else {
            this.customerMedicalAllergies = 'No';
          }

          this.customerMedicalAllergiesDetail = res.data.medical.allergyDetails;
          if (res.data.medical.pastMed == 'true') {
            this.customerMedicalPMedication = 'Yes';
          } else {
            this.customerMedicalPMedication = 'No';
          }

          this.customerMedicalPMedicationDetail =
            res.data.medical.pastMedDetails;
          if (res.data.medical.chronicDisease == 'true') {
            this.customerMedicalChronic = 'Yes';
          } else {
            this.customerMedicalChronic = 'No';
          }

          this.customerMedicalChronicDetail =
            res.data.medical.chronicDiseaseDetails;
          if (res.data.medical.injuries == 'true') {
            this.customerMedicalInjuries = 'Yes';
          } else {
            this.customerMedicalInjuries = 'No';
          }

          this.customerMedicalInjuriesDetail = res.data.medical.injuryDetails;
          if (res.data.medical.surgeries == 'true') {
            this.customerMedicalSurgeries = 'Yes';
          } else {
            this.customerMedicalSurgeries = 'No';
          }

          this.customerMedicalSurgeriesDetail = res.data.medical.surgeryDetails;
          this.customerFamilyName = res.data.family[0].name;
          this.customerFamilySurname = res.data.family[0].surname;
          this.customerFamilyAge = res.data.family[0].age;
          this.customerFamilyGender = res.data.family[0].gender;
          this.customerFamilyBlood = res.data.family[0].bloodGroup;
          this.customerFamilyHieght = res.data.family[0].height;
          this.customerFamilyWeight = res.data.family[0].weight;
          this.customerFamilyRelation = res.data.family[0].relation;

          ////console.log('persional data' + res.data.user._id);
        });
      }
    );
  }

  // inside pop up below
  get_USER_COMPLAINTS_BY_ID(customer_id: any) {
    this.Customer_Details_Service.get_USER_COMPLAINTS_BY_ID(
      customer_id
    ).subscribe((res: any) => {
      ////console.log(res, 'complaints');
      // this.Complaints_Array = res.data
      this.Complaints_Array = [];
      this.Complaints_Array = res.data;
    });
  }

  get_All_DEPARTMENTS() {
    this.Customer_Details_Service.get_All_DEPARTMENTS().subscribe(
      (res: any) => {
        ////console.log(res);
        this.Dept_Array = [];
        this.Dept_Array = res.data;
      }
    );
  }

  // get_DEPT_COMPLAINTS() {
  //   this.Customer_Details_Service.get_DEPT_COMPLAINTS().subscribe((res: any) => {
  //     ////console.log(res);
  //     this.Dept_Complaints_Array = []
  //     this.Dept_Complaints_Array = res.data
  //   })
  // }

  ReasonDropChange(event) {
    //console.log(event);
  }
  Dept_Change(itm) {
    ////console.log(itm,"123123123");
    this.Dept_Array.find((val) => {
      if (val._id == itm) {
        ////console.log(val,"kittimoone");
        this.Dept = val.name;
      }
    });
  }

  Add_User_Complaint() {
    this.Submitted = true;

    if (this.Register_Complaint_Form.valid) {
      ////console.log(this.Register_Complaint_Form.value,'valid');

      let data = this.Register_Complaint_Form.get('Department').value;
      ////console.log(data,'datadata');

      let body = {
        CustomerId: this.customerId,
        ReasonForComplaint:
          this.Register_Complaint_Form.get('ReasonForComplaint').value,
        departmentId: this.Register_Complaint_Form.get('Department').value,
        Department: this.Dept,
        preference: this.preference,
        Details: this.Register_Complaint_Form.get('Details').value,
      };
      ////console.log(body,"passsdasdsadfsadfsadf");

      this.Customer_Details_Service.add_USER_COMPLAINT(body).subscribe(
        (res: any) => {
          ////console.log(res, "line 402");
          this.pop(res);
        }
      );
    }
  }

  Add_Note() {
    if (this.Notes_Form.valid) {
      let body = {
        notes: this.Notes_Form.get('notes').value,
        id: this.ID,
      };

      this.Customer_Details_Service.add_Note(body).subscribe((res: any) => {
        ////console.log(res);
        this.pop(res);
      });
    } else {
      Swal.fire({
        text: 'Please Add Notes',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
    }
  }

  Preference_Value_Set(value) {
    this.preference = value;
    this.Register_Complaint_Form.patchValue({
      preference: this.preference,
    });
  }

  Tab_Change_Function(event) {
    ////console.log(event);
    if (event.nextId == 'Complaints') {
      // this.get_DEPT_COMPLAINTS()
      this.get_All_DEPARTMENTS();
      this.get_USER_COMPLAINTS_BY_ID(this.customerId);
    } else if (event.nextId == 'medcoinTab') {
      // if (this.customerId != '' || this.customerId != null) {
      //   this.fetchMedcoinDetails({ page: 0, customerId: this.customerId });
      // }
    } else if (event.nextId == 'premiumTab') {
      if (this.userId != '' || this.userId != null) {
        this.fetchCustomerPremiumDetails(this.userId);
      }
    } else if (event.nextId == 'subscriptionTab') {
      if (this.userId != '' || this.userId != null) {
        this.fetchSubscription({ id: this.userId });
      }
    } else if (event.nextId == 'ordersTab') {
      if (this.userId != '' || this.userId != null) {
        this.orderBody = {
          page: 1,
          limit: 10,
          id: this.userId,
          keyword: '',
        };
        this.fetchOrders(this.orderBody);
      }
    } else {
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

  open(content, id, type, slNo: any) {
    if (type === 'orderItems') {
      this.orderedProducts =
        this.customerOrderDetails.result[slNo - 1].products;
      this.orderedProducts.forEach((e, index) => {
        e.index = index + 1;
      });
    } else if (type === 'subscribedProducts') {
      this.orderedProducts =
        this.customerSubscriptionDetails.subscribedProducts[slNo].products;
      this.orderedProducts.forEach((e, index) => {
        e.index = index + 1;
      });
      ////console.log(this.orderedProducts);
    } else if (type === 'viewOrderDetails') {
      ////console.log(slNo);
      const order = this.customerOrderDetails.result[slNo - 1];
      const orderItemsDetails = order.products.map((item) => item.productName);
      const productIds = order.products.map((item) => item.product_id);
      const s = order.orderStatus;

      this.showOrderDetails = {
        _id: order._id,
        addressId: order.address._id,
        productIds,
        productsArray: order.products,
        orderItem: orderItemsDetails.join(', '),
        products: order.products,
        orderId: order.orderId,
        paymentType: order.paymentType,
        name: order.address.name,
        wholeAddress: order.address.wholeAddress,
        couponAppliedDiscount: order.cartDetails.couponAppliedDiscount,
        medCoinRedeemed: order.cartDetails.medCoinRedeemed,
        memberDiscount: order.cartDetails.memberDiscount,
        donationAmount: order.cartDetails.donationAmount,
        deliveryCharge: order.cartDetails.deliveryCharge,
        totalAmountToBePaid: order.cartDetails.totalAmountToBePaid,
        totalCartValue: order.cartDetails.totalCartValue,
        deliveryDate: order.cartDetails.deliveryDate,
        deliveryStatus: order.delivered,
        orderStatus: s[0].toUpperCase() + s.slice(1),
        // indexNo: arr.indexOf(order.orderStatus),
        trackingDates: order.trackingDates,
      };
      console.log(this.showOrderDetails);

      // console.log(orderItemsDetails);
      console.log(order);
      // this.viewOrderDetails(slNo);
    } else if (type == 'return') {
      const orderId = this.showOrderDetails._id;
      const products = this.showOrderDetails.productIds;
      this.getRefundAmount({ orderId, products });
    } else if (type == 'cancel') {
      const orderId = this.showOrderDetails._id;
      const products = this.showOrderDetails.productIds;
      this.getRefundAmount({ orderId, products });
    } else if (type == 'view') {
      this.View_Complaint_Flag = true;
    } else if (type == 'addToSubscription') {
      this.addToSubscriptionForm.patchValue({
        orderId: slNo,
      });
    } else {
      this.View_Complaint_Flag = false;
    }
    // this.New_Complaint_Flag = false
    this.Submitted = false;

    if (id != '') {
      this.Customer_Details_Service.get_CUSTOMER_SINGLE_COMPLAINTS(
        id
      ).subscribe((res: any) => {
        //console.log(res);

        this.Register_Complaint_Form.patchValue({
          phone: res.data[0].phone,
          name: res.data[0].name,
          email: res.data[0].email,
          ReasonForComplaint: res.data[0].ReasonForComplaint,
          Department: res.data[0].departmentId,
          preference: res.data[0].preference,
          Details: res.data[0].Details,
        });
        this.preference = res.data[0].preference;
        ////console.log(this.preference);
      });
    } else {
      this.Register_Complaint_Form.reset();
      this.preference = '';
      // this.New_Complaint_Flag = true
      this.get_USER_COMPLAINTS_BY_ID(this.customerId);
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

  makeNewOrder() {
    this._router.navigate(['/customer-details/medimall/' + this.userId]);
    // this._router.navigate(['/medi-mall'])
  }

  pop(res: any) {
    ////console.log(res.data, 'res data');
    ////console.log(res.status, 'res status');
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

      this.init_Forms();
      this.Register_Complaint_Form.reset();
      this.get_User_Details(this.customerId);
      this.get_USER_COMPLAINTS_BY_ID(this.customerId);

      // this.get_DEPT_COMPLAINTS()
      // this.get_All_DEPARTMENTS()
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
    // this.addLoading = false;
    this.Submitted = false;
    this.modalService.dismissAll();
  }
  //second tab
  fetchMedcoinDetails(values) {
    this.Customer_Details_Service.admin_get_med_coin_details(values).subscribe(
      (res: any) => {
        ////console.log(res);
        if (res.error == false) {
          this.medcoinDatas = JSON.parse(JSON.stringify(res.data));
          this.medcoinDatas.currentPage = values.page;
          ////console.log(this.medcoinDatas);
        } else {
          Swal.fire({
            icon: 'error',
            title: res.message,
          });
        }
      },
      (error) => {
        ////console.log(error.error);
      }
    );
  }
  public onPageChange(page) {
    ////console.log(page);
    if (
      (this.medcoinDatas.hasNextPage == false &&
        page > this.medcoinDatas.current_page) ||
      (this.medcoinDatas.hasPrevPage == false &&
        page < this.medcoinDatas.current_page)
    ) {
      return;
    } else {
      ////console.log(page);
      this.fetchMedcoinDetails({
        page,
        customerId: this.customerId,
      });
    }
  }
  fetchCustomerPremiumDetails(customer_id) {
    this.Customer_Details_Service.get_customer_premium_membeship_details(
      customer_id
    ).subscribe(
      (res: any) => {
        ////console.log('premium details');
        ////console.log(res);
        this.customerPremiumDetails = JSON.parse(JSON.stringify(res.data));
        ////console.log(this.customerPremiumDetails);
        ////console.log(this.customerPremiumDetails.length);
      },
      (error: any) => {
        ////console.log('server err');
      }
    );
  }
  fetchOrders(data) {
    const body = {
      page: data.page,
      limit: 10,
      id: data.id,
    };

    ////console.log(this.orderBody);
    ////console.log('hooooooooooooooooooooooooooo');
    this.Customer_Details_Service.fetchCustomerOrders(body).subscribe(
      (res: any) => {
        ////console.log('order details');
        ////console.log(res);

        this.customerOrderDetails = JSON.parse(JSON.stringify(res.data));
        this.customerOrderDetails.result.forEach((orders, index) => {
          orders.no = index + 1;
        });
        //console.log(this.customerOrderDetails);
      },
      (error: any) => {
        ////console.log('server err');
      }
    );
  }

  filterOrders(data) {
    ////console.log(data);
    if (data.keyword == '') {
      this.fetchOrders(this.orderBody);
    } else {
      this.Customer_Details_Service.searchCustomerOrders(data).subscribe(
        (res: any) => {
          ////console.log('order details');
          ////console.log(res);
          if (res.error == false) {
            this.customerOrderDetails = JSON.parse(JSON.stringify(res.data));
            this.customerOrderDetails.result.forEach((orders, index) => {
              orders.no = index + 1;
            });
            ////console.log(this.customerOrderDetails);
          } else {
          }
        },
        (error: any) => {
          ////console.log('server err');
        }
      );
    }
  }

  orderPagination(page) {
    ////console.log(page);
    if (
      (this.customerOrderDetails.hasNextPage == false &&
        page > this.customerOrderDetails.current_page) ||
      (this.customerOrderDetails.hasPrevPage == false &&
        page < this.customerOrderDetails.current_page)
    ) {
      return;
    } else {
      this.orderBody.page = page;
      ////console.log(this.orderBody);
      this.filterOrders(this.orderBody);
    }
  }
  searchOrders(keyword) {
    this.orderBody.page = 1;
    this.orderBody.keyword = keyword;
    this.filterOrders(this.orderBody);
  }
  //fetch subscription
  fetchSubscription(dbId) {
    this.Customer_Details_Service.fetchCustomerSubscription(dbId).subscribe(
      (res: any) => {
        ////console.log(res);
        if (res.error == false) {
          this.customerSubscriptionDetails = {
            loop: [],
            subscribedProducts: [],
          };
          this.customerSubscriptionDetails.subscribedProducts = JSON.parse(
            JSON.stringify(res.data.result)
          );

          JSON.parse(JSON.stringify(res.data.result)).forEach((item, index) => {
            const arr = {
              index,
              orderId: item._id,
              status: item.active,
              firstDeliveryDate: item.firstDeliveryDate,
              interval: item.interval,
              numberOfItems: item.products.length,
              subscriptionId: item.subscriptionId,
              nextDeliveryDate: item.nextDeliveryDate,
            };
            this.customerSubscriptionDetails.loop.push(arr);
          });
          console.log(this.customerSubscriptionDetails);
        } else {
        }
      },
      (err: any) => {
        ////console.log('something went wrong');
      }
    );
  }
  viewOrderDetails(id) {
    this.Customer_Details_Service.getOrderDetails(id).subscribe(
      (res: any) => {
        //console.log(res);
        if (res.status) {
          const order = JSON.parse(JSON.stringify(res.data));
          const orderItemsDetails = order.products.map(
            (item) => item.productName
          );

          // order.orderStatus = arr[0];
        }
      },
      (err: any) => {
        //console.log(err);
      }
    );
  }
  addToSubscriptionForm: FormGroup = new FormGroup({
    subscriptionInterval: new FormControl(30, Validators.required),
    orderId: new FormControl(null, Validators.required),
  });
  addToSubscriptionApi() {
    this.modalService.dismissAll();
    this.Customer_Details_Service.addOrderToSubscription(
      this.addToSubscriptionForm.value
    ).subscribe(
      (res: any) => {
        if (!res.error) {
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
        } else {
        }
      },
      (e: any) => {
        console.log(e.error);
      }
    );
  }
  isValidAddToSubscription(controlName: any) {
    return (
      (this.addToSubscriptionForm.get(controlName)!.invalid &&
        this.addToSubscriptionForm.get(controlName)!.touched) ||
      (this.errorInAddToSubscription &&
        this.addToSubscriptionForm.get(controlName).invalid)
    );
  }

  addToSubscription() {
    console.log(this.addToSubscriptionForm.value);

    if (this.addToSubscriptionForm.invalid) {
      this.errorInAddToSubscription = true;
      return;
    }
    this.errorInAddToSubscription = false;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add to subscription ',
      cancelButtonText: 'Not at this time',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this.addToSubscriptionApi();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  // cancelOrder() {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, cancel this order',
  //     cancelButtonText: 'discard',
  //     imageHeight: 50,
  //   }).then((result) => {
  //     if (result.value) {
  //       this.cancelOrderApi('something');
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //     }
  //   });
  // }
  // returnOrder() {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, return the order',
  //     cancelButtonText: 'discard',
  //     imageHeight: 50,
  //   }).then((result) => {
  //     if (result.value) {
  //       this.cancelOrderApi('something');
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //     }
  //   });
  // }

  private ifscReg: any = '/^[A-Za-z]{4}d{7}$/';
  private accountReg: any = '/^d{9,18}$/';
  private hasErrorBank: boolean = false;

  cancelOrderApi(data) {
    this.Customer_Details_Service.cancelOrder(data).subscribe(
      (res: any) => {},
      (e) => {
        console.log(e.error);
      }
    );
  }
  onSubmitReturn() {
    console.log(this.returnForm.value);
    if (this.returnForm.invalid) {
      Swal.fire('Choose a product to return', '', 'error');
      return;
    }

    if (this.returnForm.get('paymentMethod').value === 'bank') {
      this.modalService.dismissAll();
      console.log(this.returnForm.get('paymentMethod').value);
      document.getElementById('openBankBtn').click();
    } else {
      const data = {
        products: this.returnForm.get('products').value,
        paymentMethod: this.returnForm.get('paymentMethod').value,
        id: this.showOrderDetails._id,
        address: this.showOrderDetails.addressId,
        refundableAmount: this.showOrderDetails.refundableAmount,
      };
      this.returnOrderApi(data);
    }
  }

  submitBankDetails() {
    console.log(this.bankForm.value);
    if (this.bankForm.invalid) {
      this.hasErrorBank = true;
    }

    const returnData = {
      products: this.returnForm.get('products').value,
      paymentMethod: this.returnForm.get('paymentMethod').value,
      id: this.showOrderDetails._id,
      address: this.showOrderDetails.addressId,
      refundableAmount: this.showOrderDetails.refundableAmount,
    };
    const data = Object.assign(returnData, this.bankForm.value);
    this.returnOrderApi(data);
  }
  openReturn() {
    this.modalService.dismissAll();
    document.getElementById('openReturn').click();
    this.initializeReturnForm();
  }
  initializeReturnForm() {
    this.returnForm = this.formBuilder.group({
      products: new FormArray([], [Validators.required]),
      paymentMethod: ['medcoin', Validators.required],
    });
  }
  returnOrderApi(data) {
    console.log(data);

    this.Customer_Details_Service.returnOrder(data).subscribe(
      (res: any) => {
        this.modalService.dismissAll();
        if (!res.error) {
          Swal.fire(res.message, '', 'success');
          this.ngOnInit();
        } else {
          Swal.fire(res.message, '', 'error');
        }
      },
      (e) => {
        console.log(e);
      }
    );
  }
  getRefundAmount(body) {
    this.Customer_Details_Service.getRefundableAmount(body).subscribe(
      (res: any) => {
        console.log(res);
        this.showOrderDetails.refundableAmount = res.data.refundableAmount;
      },
      (e) => {
        console.log(e);
      }
    );
  }
  returnForm: FormGroup;
  bankForm: FormGroup = this.formBuilder.group({
    customerName: [null, Validators.required],
    accountNumber: [null, Validators.required],
    reAccountNumber: [
      null,
      [Validators.required, this.confirmAccountValidator],
    ],
    bankName: [null, Validators.required],
    ifsc: [null, Validators.required],
    branch: [null, Validators.required],
    accountType: ['savings', Validators.required],
  });
  onReturnCheckboxChange(event) {
    const formArray: FormArray = this.returnForm.get('products') as FormArray;
    const products = this.showOrderDetails.productsArray
      .filter((item) => item.product_id == event.target.value)
      .map((p: any) => {
        return {
          product_id: p.product_id,
          quantity: p.quantity,
          varientId: p.variantId,
        };
      });
    console.log(products);
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(products[0]));
    } else {
      /* unselected */
      // find the unselected element

      console.log(products[0]);
      formArray.controls.forEach((ctrl: FormControl, index: number) => {
        console.log(ctrl.value);
        console.log(index);
        if (ctrl.value.product_id === products[0].product_id) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(index);
          return;
        }
      });
    }
    console.log(this.returnForm.value);
  }
  isValidBank(controlName) {
    return (
      (this.bankForm.get(controlName).invalid &&
        this.bankForm.get(controlName).touched) ||
      (this.hasErrorBank && this.bankForm.get(controlName).invalid)
    );
  }
  closeAll() {
    this.bankForm.reset();
    this.initializeReturnForm();
  }
  confirmAccountValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const cnfpassValue = control.value;
      const passControl = control.root.get('accountNumber');
      if (passControl) {
        const passValue = passControl.value;
        if (passValue !== cnfpassValue || passValue === '') {
          return {
            isError: true,
          };
        }
      }
    }

    return null;
  }
  //cancel order

  cancel_COD_Order(id: any) {
    let input = {
      id: id,
    };
    console.log(input);
    this.Customer_Details_Service.cancelOrder(input).subscribe((res: any) => {
      if (!res.error) {
        Swal.fire({
          icon: 'success',
          titleText: res.message,
        }).then(() => {
          this.modalService.dismissAll();
          this.ngOnInit();
        });
      } else {
        Swal.fire({
          icon: 'warning',
          titleText: res.message,
        });
      }
    });
  }

  changeRefundType(type) {
    this.refundModeType = type;
  }

  Cancel_online_order(id: any) {
    let input = {
      id: id,
      refundMethod: this.refundModeType,
    };
    console.log(input);
    this.Customer_Details_Service.cancelOrder(input).subscribe((res: any) => {
      if (!res.error) {
        Swal.fire({
          icon: 'success',
          titleText: res.message,
        }).then(() => {
          this.modalService.dismissAll();
          this.ngOnInit();
        });
      } else {
        Swal.fire({
          icon: 'warning',
          titleText: res.message,
        });
      }
    });
  }
}
