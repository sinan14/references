import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
 import Swal from 'sweetalert2';
// import Player from '@vimeo/player';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from 'src/app/services/cart.service';
import { ClipboardService } from 'ngx-clipboard';
import { Location, ViewportScroller } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.css']
})
export class AddSubscriptionComponent implements OnInit {
  

  public intervalDay :any = '30';
  public nextDeliveryDate :any = '';
  public subscriptionItem :any = [];

  public cartFor :any = '';
  public cartList :any = [];
  public cartDetails :any = [];
  public token :any ;
  public totalPrescriptionCount :any = 0;
  public medimallFoundationValue :any = 10;
  public customerAddress :any;
  public orderReview :any = [];
  public intervalForm :FormGroup;
  public attemptedSubmit: boolean = false;
  public wishListCount = 0;
  public subscriptionArray :any = [];
  public checkBoxUsed :boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public _sanitizer : DomSanitizer,
    public _cartService:CartService,
    public _router : Router,
    private _clipboardService: ClipboardService,
    private _location :Location,
    public _toasterService :ToastrService,
    public _formBuilder:FormBuilder) { 
      this.intervalForm = this._formBuilder.group({
        interval :['30',Validators.required],
      })

    }

  ngOnInit(): void {
   // sessionStorage.removeItem('SubscriptionItems')
   if (sessionStorage.getItem('SubscriptionItems')) {

    this.subscriptionItem = JSON.parse(sessionStorage.getItem('SubscriptionItems')); 
    console.log(this.subscriptionItem.products)
    if(!this.subscriptionItem){
      this.getCartDetails();
      this._cartService.get_Cart_Count_Only();
      this.intervalForm = this._formBuilder.group({
        interval :['30',Validators.required],
      })
    }

    else{
      this.cartList = this.subscriptionItem.products.filter((res:any)=>res.outOfStock!=true);;
      this.intervalDay = this.subscriptionItem.interval;
      this.cartDetails.deliveryDate = this.subscriptionItem.firstdeliverydate;
      this.nextDeliveryDate = sessionStorage.getItem('NextDeliveryDate')
      this.intervalForm = this._formBuilder.group({
        interval :[this.intervalDay,Validators.required],
      })
    }
  }

  else{
    this.getCartDetails();
      this._cartService.get_Cart_Count_Only();
      this.intervalForm = this._formBuilder.group({
        interval :['30',Validators.required],
      })
  }

    
    this.getWishListCount();
    this.token = sessionStorage.getItem('token');
    // if(this.token != null){
    //   this.getCartDetails();
    //   this._cartService.get_Cart_Count_Only()
    //  // this.getAvailableCoupon();
    // }

   
    this.intervalForm.valueChanges.subscribe(x => {
      console.log('form value changed')
      this.intervalDay = this.intervalForm.get("interval").value;
      this.generateNextDeliveryDate();
  })


  }

  generateNextDeliveryDate(){
    var myDate = new Date(this.cartDetails.deliveryDate);
    var nextDay = new Date(this.cartDetails.deliveryDate);
    nextDay.setDate(myDate.getDate()+parseInt(this.intervalDay));


    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(nextDay, 'dd MMM yyyy ');
   
    this.nextDeliveryDate = end;

  }

  getWishListCount() {
    this._cartService.get_Cart_Count().subscribe((res: any) => {
      console.log(res);
      this.wishListCount = res.data.wishListCount;
    })
  }

  getCartDetails(){
    this._cartService.get_Cart_Details().subscribe((res:any)=>{
      console.log(res);
      if(res.data.length>0){
        this._cartService.cartCount = res.data[0].medCart.products;
        this.cartList = res.data[0].medCart.products.filter((res:any)=>res.outOfStock!=true);;

       
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
        this.cartDetails.totalAmountToBePaid = res.data[0].medCart.cartDetails.totalAmountToBePaid;
        this.cartDetails.totalCartValue = res.data[0].medCart.cartDetails.totalCartValue;
        this.cartDetails.totalRealCartValue = this.cartDetails.totalCartValue;
        this.orderReview = res.data[0].medCart.orderReview[0];
        this.totalPrescriptionCount = this.cartDetails.totalCountOfProductsThatRequirePrescription
        this._cartService.get_Cart_Count();
        this.generateNextDeliveryDate();
      }
    })
  }



  decrement(cart) {
    if (cart.quantity > 1) {
      cart.quantity--;
      if (this.token != null) {
        let input = {
          "cartId": cart.cartId,
          "quantity": cart.quantity
        }

        this._cartService.update_Cart_Item(input).subscribe((res: any) => {
          console.log(res);
          this._cartService.get_Cart_Count_Only()
          if (!res.error) {
            this._toasterService.info(res.message,'',{
              timeOut :  10000,
              positionClass: 'toast-bottom-right',
              closeButton:true
            })
            this.ngOnInit();
          }
          else{
            Swal.fire({
              icon: 'warning',
              text: res.message,
              showConfirmButton: true,
            });
          }
        })
      }
      else {

        this._cartService.updateQuantity(cart, cart.quantity);
        this._cartService.setCartAMountDetails(this.cartList, 'add');
        this.cartDetails.totalAmountToBePaid = this._cartService.cartTotalAmount;
        this.cartDetails.totalCartValue = this._cartService.cartTotalAmount;
        this.cartDetails.totalRealCartValue = this._cartService.cartTotalAmount;
      }
    }
  }

  increment(cart) {
    cart.quantity++;
    //this._cartService.updateQuantity(cart,cart.quantity)
    if (this.token != null) {
      let input = {
        "cartId": cart.cartId,
        "quantity": cart.quantity
      }
      this._cartService.update_Cart_Item(input).subscribe((res: any) => {
        console.log(res);
        this._cartService.get_Cart_Count_Only()
        if (!res.error) {
         this._toasterService.info(res.message,'',{
          timeOut :  10000,
          positionClass: 'toast-bottom-right',
          closeButton:true
        })
          this.ngOnInit();
        }
        else{
          Swal.fire({
            icon: 'warning',
            text: res.message,
            showConfirmButton: true,
          });
        }
      })
    }
    else {
      this._cartService.updateQuantity(cart, cart.quantity)
      this._cartService.setCartAMountDetails(this.cartList, 'add');
      this.cartDetails.totalAmountToBePaid = this._cartService.cartTotalAmount;
      this.cartDetails.totalCartValue = this._cartService.cartTotalAmount;
      this.cartDetails.totalRealCartValue = this._cartService.cartTotalAmount;
    }
  }

  addSubscriptionCheckBox(event:any,index){
    if(event.target.checked){
      this.checkBoxUsed = true;
      index.subscriptionadded = true;
      // this.subscriptionArray.push(index);
      // console.log(this.subscriptionArray);
    }
    else{
      index.subscriptionadded = false;
      console.log(index);
    }
  }

  changeInterval(event:any, interval:any){
    alert(event.target.checked)
    if(event.target.checked){
      this.intervalDay = interval;
      this.generateNextDeliveryDate();
      this.intervalForm.patchValue({
        interval : interval
      })
    }
  }

  confirmSubscription(){
    if(this.intervalForm.invalid){
      return;
    }

    // if(!this.checkBoxUsed){
    //   return;
    // }
    let count = 0;
    this.cartList.forEach(element => {
      if(element.subscriptionadded===true){
        count++
      }
     
    });

    if(count>0){
      let data = {
        'products':this.cartList,
        'interval':this.intervalForm.get('interval').value,
        'firstdeliverydate':this.cartDetails.deliveryDate
      }
  
      console.log(data);
      sessionStorage.setItem('SubscriptionItems',JSON.stringify(data));
      sessionStorage.setItem('NextDeliveryDate',this.nextDeliveryDate);
      Swal.fire({
        icon: 'success',
        title: 'Subscription Added Successfully',
      }).then((res)=>{
        this._router.navigate(['/order-review'])
      });
    }
    else{
      sessionStorage.removeItem('SubscriptionItems');
      sessionStorage.setItem('NextDeliveryDate',this.nextDeliveryDate);
      Swal.fire({
        icon: 'success',
        title: 'Subscription Updated Successfully',
      }).then((res)=>{
        this._router.navigate(['/order-review'])
      });
    }
   
  }

  redirectToWishListPage() {
    this._router.navigate(['/short-list'])
  }

}
