import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreHomeService } from 'src/app/services/store-home.service';

@Component({
  selector: 'app-shopping-web-view',
  templateUrl: './shopping-web-view.component.html',
  styleUrls: ['./shopping-web-view.component.css'],
})
export class ShoppingWebViewComponent implements OnInit {
  cashOnDelivery: boolean = false;
  onlinePayment: boolean = false;
  cartData;
  cartDiv: boolean = false;
  quantity: number = 0;

  productList: any;
  total: number = 0;
  Gtotal: number = 0;
  gTotal: number;
  payment;
  paymentValue: boolean = false;
  deliveryFee: boolean = false;
  deliveryFeeamount;
  constructor(private router: Router, public _homeService: StoreHomeService) {
    this.cartData = JSON.parse(localStorage.getItem('cartData') || '{}');
    this.payment = JSON.parse(localStorage.getItem('payment') || '{}');
  }
  goToPreviousPage() {}

  ngOnInit(): void {
    if (this.payment.cashOnDelivery) {
      this.cashOnDelivery = true;
      this.onlinePayment = false;
    } else if (this.payment.onlinePayment) {
      this.onlinePayment = true;
      this.cashOnDelivery = false;
    } else if (this.payment.onlinePayment && this.payment.cashOnDelivery) {
      this.onlinePayment = true;
      this.cashOnDelivery = true;
    } else {
      this.onlinePayment = false;
      this.cashOnDelivery = false;
    }
    if (this.payment.priceIncludeDeliveryFee) {
      this.deliveryFee = true;
    } else {
      this.deliveryFee = false;
    }
  }
  deletecart(cart, index) {
    console.log(cart, index, 'deleted item');
    this._homeService.deletCart(cart.cartId).subscribe((res: any) => {
      console.log(res, 'addtoCartaddtoCart');
      if (res) {
        console.log('deleted');
        this.getcartItems();
      }
    });
  }
  ngAfterViewInit() {
    console.log('fffffffffff');

    this.getcartItems();
  }
  getcartItems() {
    // let result={
    //   "cartId":this.cartData.cartId,
    //   "quantity":this.cartData.cartId
    // }
    console.log(this.cartData, 'this.cartData.sellerId');

    this._homeService
      .getcartItems(this.cartData.sellerId)
      .subscribe((res: any) => {
        const toRate =
          this._homeService.currencyRates[this._homeService.localCurrency];
        console.log(res, 'addtoCartaddtoCart');
        // this.gTotal=res.data.cartDetails.itemTotal;
        const fromRate =
          this._homeService.currencyRates[res.data.products[0].countryCode];

        if (res.data.products.length > 0) {
          this.cartDiv = true;
          // this.productList= res.data.products;

          //  this.isDeliveryVerification= this.productList[0].isDeliveryVerification

          console.log(this.productList, 'llllllllllllllllllllllll');
          //  for (var i = 0; i < this.productList.length; i++) {
          //   var element = this.productList[i];
          //   console.log(parseInt(this.productList[i].total),"pr");

          //  }
          let data = res.data.products.map((item) => {
            let fromRate = this._homeService.currencyRates[item.countryCode];

            item.convertedPrice = Math.trunc(
              (toRate / fromRate) * parseInt(item.total)
            );

            return item;
          });
          this.productList = data;
          console.log(this.productList);

          // this.Gtotal= this.total + this.deliveryFee
        } else {
          console.log('cart empty');
          this.cartDiv = false;
        }
      });
  }
  convinience() {
    this.router.navigate(['/convenience']);
  }
  removeQuantity(ev, i) {
    if (ev.quantity >= 1) {
      ev.quantity = ev.quantity - 1;
      console.log(ev.quantity);
      this.productList[i].quantity = ev.quantity;
      this.updateQuantity(this.productList[i].cartId, ev.quantity);
    }
  }
  modelChangeFn(ev) {
    console.log('kkkkkkkkkkkkkkkkk');
  }
  addQuantity(ev, i) {
    console.log(ev, 'ddddddddddddd');

    ev.quantity = ev.quantity + 1;
    console.log(ev.quantity);
    this.productList[i].quantity = ev.quantity;
    this.updateQuantity(this.productList[i].cartId, ev.quantity);
    // let data = (this.productList).map(item => {
    //  item.quantity=ev.quantity;
    //   return item;
    // });
    // this.productList=data;

    //this.productList.quantity=this.quantity + 1;
  }
  updateQuantity(cartId, quantity) {
    console.log('aaaaaaaaaaaaaaa', this.productList);
    let result = {
      cartId: cartId,
      quantity: quantity,
    };
    this._homeService.addQuantity(result).subscribe((res: any) => {
      console.log(res, 'addtoCartaddtoCart');
      if (res) {
        this.getcartItems();
      }
    });
  }
}
