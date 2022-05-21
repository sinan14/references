import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
 import Swal from 'sweetalert2';
// import Player from '@vimeo/player';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from 'src/app/services/cart.service';
import { ClipboardService } from 'ngx-clipboard';
import { Location, ViewportScroller } from '@angular/common';
import { ExternalLibraryService } from './util';
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
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css']
})
export class OrderReviewComponent implements OnInit {


  public razorPayKey = environment.razorPayKey;

  public order_id :any = '';
  public cartList :any = [];
  public cartDetails :any = [];
  public token :any ;
  public totalPrescriptionCount :any = 0;
  public medimallFoundationValue :any = 10;
  public customerAddress :any;
  public orderReview :any = [];
  public deliveryDate :any = '';
  public subscriptionItem :any = [];
  public isSubscriptionAdded :boolean = false;
  public nextDeliveryDate :any = '';
  public iDontHaveAPrescription :boolean;

  public subscriptionID :any = '';
  public paymentType :any = 'cod';


  public userAddresses: any;
  phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  indianPinRegex: any = '';
  closeResult: string;
  add_Modal_Flag: boolean;
  update_Modal_Flag: boolean;
  errorInAddress: boolean;
  public personal_info: any;
  
  response;
  razorpayResponse;
  showModal = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public _sanitizer : DomSanitizer,
    public _cartService:CartService,
    public _router : Router,
    private _clipboardService: ClipboardService,
    private _location :Location,
    private razorpayService: ExternalLibraryService, 
    private cd: ChangeDetectorRef,
    private  _paymentService : PaymentService,
    private Header_Service: HeaderService,
    private _fb: FormBuilder,
    private _newcartService: NewCartService,
    public _userDashboardService: UserDashboardService, ) { }

  ngOnInit(): void {
    // this.activatedRoute.paramMap.subscribe(params => {
    //   this.cartList = params.get('cart');
    //   this.cartDetails = params.get('cartDetails');
    //   console.log(this.cartList);
    //   console.log(this.cartDetails);
    // });
    this.getPersonalDetails();
    this.iDontHaveAPrescription = JSON.parse(sessionStorage.getItem('iDontHaveAPrescription'));

    this.subscriptionItem = JSON.parse(sessionStorage.getItem('SubscriptionItems'));
    console.log(this.subscriptionItem)
    if(this.subscriptionItem){
      this.isSubscriptionAdded = true;
      this.nextDeliveryDate = sessionStorage.getItem('NextDeliveryDate')
    }
    else{
      this.isSubscriptionAdded = false;
    }

    console.log(this.isSubscriptionAdded)

    this.get_User_details();
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

  generateNextDeliveryDate(day){
    var myDate = new Date();
    var nextDay = new Date(myDate);
    nextDay.setDate(myDate.getDate()+parseInt(day));


    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(nextDay, 'MMM dd, yyyy ');
   
    this.nextDeliveryDate = end;

  }

  get_User_details() {
    this.Header_Service.get_User_details().subscribe((res: any) => {
      console.log(res.data);
      
    });
  }


  getCartDetails(){
    this._cartService.get_Cart_Details().subscribe((res:any)=>{
      console.log(res);
      if(res.data.length>0){
        this._cartService.cartCount = res.data[0].medCart.products;
        this.cartList = res.data[0].medCart.products.filter((res:any)=>res.outOfStock!=true);

        this.deliveryDate = res.data[0].medCart.cartDetails.deliveryDate;

        this._cartService.livecartData = this.cartList;
        if(Object.keys(res.data[0].medCart.address).length === 0 && res.data[0].medCart.address.constructor === Object){
          this.customerAddress = '';
          console.log(this.customerAddress);
        }
        else{
          this.customerAddress = res.data[0].medCart.address;
          //this.userAddresses.push(res.data[0].medCart.address)
        }
        this.cartDetails = res.data[0].medCart.cartDetails;

        if(!this.cartDetails.cashOnDelivery){
          this.paymentType = 'razorpay'
        }
        this.cartDetails.totalAmountToBePaid = res.data[0].medCart.cartDetails.totalAmountToBePaid;
        this.cartDetails.totalCartValue = res.data[0].medCart.cartDetails.totalCartValue;
        this.cartDetails.totalRealCartValue = this.cartDetails.totalCartValue;
        this.orderReview = res.data[0].medCart.orderReview[0];
        this.totalPrescriptionCount = this.cartDetails.totalCountOfProductsThatRequirePrescription
        this._cartService.get_Cart_Count();
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

      // binding this object to both success and dismiss handler
      this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

      // this.showPopup();

      let razorpay = new Razorpay(this.RAZORPAY_OPTIONS)
      razorpay.open();
  }

  public razorPaySuccessHandler(response) {
      console.log(response);
      this.verify_RazorPay_Payment(response);
      // this.razorpayResponse = `Razorpay Response`;
      // this.showModal = true;
      // this.cd.detectChanges()
      // document.getElementById('razorpay-response').style.display = 'block';
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
      if(this.paymentType==='cod'){
        document.getElementById('dismiss-payment-mode').click();

        let cartItem:any = [];
        if(this.isSubscriptionAdded){
       
          this.subscriptionItem.products.map((t:any)=>{
            let d = {
              "cartId":t.cartId,
              "subscription":t.subscriptionadded ? true : false,
              "interval":this.subscriptionItem.interval
            }
  
            cartItem.push(d);
          })
          
        }
        else{
          this.cartList.map((t:any)=>{
            let d = {
              "cartId":t.cartId,
              "subscription":false,
              "interval":""
            }
  
            cartItem.push(d);
          })
          
        }
       

        let input = {
          "paymentType":this.paymentType,
          "iDontHaveAPrescription":this.iDontHaveAPrescription,
          "cartItems":cartItem,
          "subscription":false,
        }
        console.log(input);
        this._paymentService.purchase_order(input).subscribe((res:any)=>{
          console.log(res);
          if(!res.error){
           // alert("clicked")
            document.getElementById('display-success-popup').click();

            // this._router.navigate(['/']);
            // Swal.fire({
            //   icon: 'success',
            //   text: res.message,
            //   showConfirmButton: true,
            // }).then((res)=>{
            //   sessionStorage.removeItem('SubscriptionItems');
            //    sessionStorage.removeItem('iDontHaveAPrescription');
            //    this.getCartDetails();
            //    this._router.navigate(['/']);
            // })
          }
        })
      }
      else  if(this.paymentType==='razorpay'){
        //ONLINE PAYMENT
        document.getElementById('dismiss-payment-mode').click();
        let cartItem:any = [];
        if(this.isSubscriptionAdded){
       
          this.subscriptionItem.products.map((t:any)=>{
            let d = {
              "cartId":t.cartId,
              "subscription":t.subscriptionadded ? true : false,
              "interval":this.subscriptionItem.interval
            }
  
            cartItem.push(d);
          })
          
        }
        else{
          this.cartList.map((t:any)=>{
            let d = {
              "cartId":t.cartId,
              "subscription":false,
              "interval":""
            }
  
            cartItem.push(d);
          })
          
        }
       

        let input = {
          "paymentType":this.paymentType,
          "iDontHaveAPrescription":this.iDontHaveAPrescription,
          "cartItems":cartItem,
          "subscription":false,
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

  redirectToWishListPage() {
    this._router.navigate(['/short-list'])
  }

  // setTimer(){
  //   var inactivityTime = function () {
  //     var time;
  //     window.onload = resetTimer;
  //     // DOM Events
  //     document.onmousemove = resetTimer;
  //     document.onkeypress = resetTimer;
  
  //     function resetTimer() {
  //         clearTimeout(time);
  //         time = setTimeout('',3000)
  //     }
  // };
  
  // this._router.navigate(['/']);
  // }

  redirectToHome(){
    this._router.navigate(['/']);
  }


}
