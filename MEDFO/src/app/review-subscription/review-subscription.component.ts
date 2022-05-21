import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
 import Swal from 'sweetalert2';
// import Player from '@vimeo/player';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from 'src/app/services/cart.service';
import { ClipboardService } from 'ngx-clipboard';
import { Location, ViewportScroller } from '@angular/common';
import { PaymentService } from 'src/app/services/payment.service';
import { environment } from 'src/environments/environment.prod';
import { HeaderService } from 'src/app/services/header.service';
import { NewCartService } from 'src/app/services/new-cart.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserDashboardService } from 'src/app/services/user-dashboard.service';

declare var Razorpay: any;

@Component({
  selector: 'app-review-subscription',
  templateUrl: './review-subscription.component.html',
  styleUrls: ['./review-subscription.component.css']
})
export class ReviewSubscriptionComponent implements OnInit {


  public razorPayKey = environment.razorPayKey;

  public order_id :any = '';
  public cartList :any = [];
  public cartDetails :any = [];
  public token :any ;
  public totalPrescriptionCount :any = 0;
  public medimallFoundationValue :any = 10;
  public customerAddress :any;
  public orderReview :any = [];
  public firstdeliveryDate :any = '';

  public subscriptionID :any = '';
  public paymentType :any = '';

  public DeliveryInterval :any = '';
  public nextDeliveryDate :any = '';
  public iDontHaveAPrescription :boolean;
  public personal_info: any;


  public userAddresses: any;
  phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  indianPinRegex: any = '';
  closeResult: string;
  add_Modal_Flag: boolean;
  update_Modal_Flag: boolean;
  errorInAddress: boolean;
  
  response;
  razorpayResponse;
  showModal = false;
  razorpayService: any;


  constructor(
    public activatedRoute: ActivatedRoute,
    public _sanitizer : DomSanitizer,
    public _cartService:CartService,
    public _router : Router,
    private _clipboardService: ClipboardService,
    private _location :Location,
    private  _paymentService : PaymentService,
    private Header_Service: HeaderService,
    private _fb: FormBuilder,
    private _newcartService: NewCartService,
    public _userDashboardService: UserDashboardService,) { }

  ngOnInit(): void {


    this.iDontHaveAPrescription = JSON.parse(sessionStorage.getItem('iDontHaveAPrescription'));
    this.DeliveryInterval = sessionStorage.getItem('interval'); 

    this.getPersonalDetails();
    this.token = localStorage.getItem('token');
    if(this.token != null){
      this.getCartDetails();
     // this.getAvailableCoupon();
    }

    
    this.razorpayService
    .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
    .subscribe();


  }

  getPersonalDetails() {
    this._userDashboardService.getPersonalInfo().subscribe(
      (res: any) => {
        if (res.error == false) {
          this.personal_info = res.data;
          console.log(this.personal_info);
        } else {
          console.log('onh no error');
        }
      },
      (error: any) => {
        console.log('oh no error occure from server');
        console.log(error);
      }
    );
  }


 

  generateNextDeliveryDate(){
    var myDate = new Date(this.cartDetails.deliveryDate);
    var nextDay = new Date(this.cartDetails.deliveryDate);
    nextDay.setDate(myDate.getDate()+parseInt(this.DeliveryInterval));


    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(nextDay, 'MMM dd, yyyy');
   
    this.nextDeliveryDate = end;

    console.log('next delivery', this.nextDeliveryDate)

  }


  getCartDetails() {
    this._cartService.get_Cart_Details().subscribe((res: any) => {
      console.log(res);
      if (res.data.length > 0) {

        

        this.cartList = res.data[1].subscriptionCart.products.filter((res:any)=>res.outOfStock!=true);
        this.cartDetails = res.data[1].subscriptionCart.cartDetails;
        this.generateNextDeliveryDate();
        //check chether address id available or not
        if (Object.keys(res.data[1].subscriptionCart.address).length === 0 && res.data[1].subscriptionCart.address.constructor === Object) {
          this.customerAddress = '';
          console.log(this.customerAddress);
        }
        else {
          this.customerAddress = res.data[1].subscriptionCart.address;
          //this.userAddresses.push(res.data[0].medCart.address)
        }

        if(this.cartDetails.cashOnDelivery){
          this.paymentType = 'cod';
        }
        else{
          this.paymentType = 'razorpay';
        }

       


        this.totalPrescriptionCount = this.cartDetails.totalCountOfProductsThatRequirePrescription
      }
    })
  }


    RAZORPAY_OPTIONS = {
      "key": this.razorPayKey, // Enter the Key ID generated from the Dashboard
      "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "order_id": this.order_id,
      "name": "Acme Corp",
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
      "prefill": {
          "name": "Gaurav Kumar",
          "email": "gaurav.kumar@example.com",
          "contact": "9999999999"
      },
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#0056b3"
      }
  };

  public proceed() {
    this.RAZORPAY_OPTIONS.amount = this.cartDetails.totalAmountToBePaid + '00';
      this.RAZORPAY_OPTIONS.name = this.personal_info.name +' '+this.personal_info.surname;
      this.RAZORPAY_OPTIONS.image = this.personal_info.image;
      this.RAZORPAY_OPTIONS.description = 'Cart Payment';
      this.RAZORPAY_OPTIONS.prefill.name = this.personal_info.name;
      this.RAZORPAY_OPTIONS.prefill.email = this.personal_info.email;
      this.RAZORPAY_OPTIONS.prefill.contact = this.personal_info.phone;
      this.RAZORPAY_OPTIONS.order_id = this.order_id;
      //this.RAZORPAY_OPTIONS.subscription_id = this.subscriptionID;

      // binding this object to both success and dismiss handler
      this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

      // this.showPopup();

      let razorpay = new Razorpay(this.RAZORPAY_OPTIONS)
      razorpay.open();
  }

  public razorPaySuccessHandler(response) {
      console.log(response);
      this.verify_RazorPay_Payment(response);
    
  }

  public test() {
      document.getElementById('response-modal').style.display = 'block';
      this.response = `dummy text`;
  }


  selectPaymentType(type:any){
  // alert(type);
  if(type==='cod'){
    this.paymentType = type;
   
  }
  else if(type=="razorpay"){
    this.paymentType = type;
   
  }
  }


  continuePayment(){


    if(this.paymentType==''){
      return;
    }
    //Cash on delivery
    if(this.paymentType==='cod'){
      document.getElementById('dismiss-payment-mode').click();


      let subscriptionItem:any = [];
      let cartItem:any = [];
      this.cartList.map((t:any)=>{
        let d = {
          "cartId":t.cartId,
          "subscription":true,
          "interval":this.DeliveryInterval
        }

        cartItem.push(d);
      })
      let input = {
        "paymentType":this.paymentType,
        "iDontHaveAPrescription":this.iDontHaveAPrescription,
        "cartItems":cartItem,
        "subscription":true,
      }


      console.log(input);
      this._paymentService.purchase_order(input).subscribe((res:any)=>{
        console.log(res);
        if(!res.error){
          
          document.getElementById('display-success-popup').click();
          // Swal.fire({
          //   icon: 'success',
          //   text: res.message,
          //   showConfirmButton: true,
          // }).then((res)=>{
          //   sessionStorage.removeItem('SubscriptionItems');
          //   sessionStorage.removeItem('iDontHaveAPrescription');
          //   this.getCartDetails();
          //   this._router.navigate(['/']);
          // })
        }
      })
    }
    else  if(this.paymentType==='razorpay'){
      //ONLINE PAYMENT
      document.getElementById('dismiss-payment-mode').click();


      let subscriptionItem:any = [];
      let cartItem:any = [];
      this.cartList.map((t:any)=>{
        let d = {
          "cartId":t.cartId,
          "subscription":true,
          "interval":this.DeliveryInterval
        }

        cartItem.push(d);
      })
      let input = {
        "paymentType":this.paymentType,
        "iDontHaveAPrescription":this.iDontHaveAPrescription,
        "cartItems":cartItem,
        "subscription":true,
      }


      console.log(input);
      this._paymentService.purchase_order(input).subscribe((res:any)=>{
        console.log(res);
        if(!res.error){
          this.order_id = res.data.order_id;
          this.proceed();
        }
      })

    }
  }
  //Razorpay verification
  verify_RazorPay_Payment(response){
    let input = {
        "paymentId": response.razorpay_payment_id,
        "orderId": this.order_id,
        "razorPaySignature": response.razorpay_signature
        
    }
    console.log(input)
    this._paymentService.verify_razorpay_payment(input).subscribe((res:any)=>{
      document.getElementById('display-success-popup').click();
      // if(!res.error){
      //   Swal.fire({
      //     icon: 'success',
      //     text: res.message,
      //   }).then((res)=>{
      //     this.getCartDetails();
      //     this._router.navigate(['/']);
      //   });
      // }
    })
  }

  redirectToHome(){
    this._router.navigate(['/']);
  }


}
