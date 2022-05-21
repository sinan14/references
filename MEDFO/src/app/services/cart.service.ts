import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public selectedHealthData: any = '';
  public livecartData: any = []; //Cart data to all pages
  public updateFlag: boolean = false;
  public localCart: any = [];
  public userdata;
  public cartCount;
  public cartCountOnly;
  public cartTotalAmount: any = 0;
  public API = environment.baseUrl;

  //Check_Cart_Item
  public Cart: any = []
  public Item_Found_Flag: boolean = false


  constructor(private http: HttpClient) {
    this.userdata = JSON.parse(sessionStorage.getItem('userDetails'));

  }


  //without login

  get_cart_info_without_login(){
    return this.http.get(`${this.API}/user/get_cart_info`);
  }

  get_Cart_Details() {
    return this.http.get(`${this.API}/user/web/get_med_cart`);
  }

  get_Cart_Count() {
    return this.http.get(`${this.API}/user/web/get_cart_count`);
    // this.http.get(`${this.API}/user/web/get_cart_count`).subscribe((res:any)=>{
    //   this.cartCount = res.data.cartItemsCount;
    //   //this.cartCount = res.data[0].medCart.products.length;
    // });
  }

  get_Cart_Count_Only() {
    this.http.get(`${this.API}/user/web/get_cart_count`).subscribe((res: any) => {
      console.log(res, "cart count only res");

      this.cartCountOnly = res.data.cartItemsCount;
      //this.cartCount = res.data[0].medCart.products.length;
    });
  }


  add_To_Cart(data: any) {
    return this.http.post(`${this.API}/user/add_prod_cart`, data);
  }

  update_Cart_Item(data: any) {
    return this.http.patch(`${this.API}/user/update_cart_item`, data);
  }


  remove_From_Cart(id) {
    return this.http.delete(`${this.API}/user/remove_cart_item/` + id);
  }


  apply_coupon_to_cart(data: any) {
    return this.http.post(`${this.API}/user/apply_coupon_to_cart`, data);
  }

  remove_coupon_from_cart(data: any) {
    return this.http.post(`${this.API}/user/remove_coupon_from_the_cart`, data);
  }

  get_available_coupon_codes() {
    return this.http.get(`${this.API}/user/get_coupons`);
  }

  add_medimall_foundation_donation(data) {
    return this.http.post(`${this.API}/user/edit_donation_amount`, data);
  }

  add_medimall_medcoin_amount(data) {
    return this.http.post(`${this.API}/user/edit_applied_med_coin_count`, data);
  }

  place_order(data) {
    return this.http.post(`${this.API}/user/place_order`, data);
  }



  upload_image(data) {
    return this.http.post(`${this.API}/user/upload_prescription_image`, data);
  }

//prescription
  get_prescription() {
    return this.http.get(`${this.API}/user/get_user_prescriptions`);
  }

  update_prescription(id,data) {
    return this.http.post(`${this.API}/user/update_prescriptions/`+id, data);
  }

  add_prescription(data) {
    return this.http.post(`${this.API}/user/add_prescriptions`, data);
  }

  //set Local Cart


  assignCartItem(product, qty) {
    let currectCart: any = [];
    if (localStorage.getItem('CartItem')) {

      this.localCart = JSON.parse(localStorage.getItem('CartItem'));
      console.log(this.localCart);
      if (this.localCart != [] && this.localCart != '') {
        let list: any = [];
        list = this.localCart.filter((i: any) => i.product_id === product.product_id);
        console.log(list)
        if (list.length != 0) {
          if (list[0].product_id === product.product_id) {
            // list[0].quantity = list[0].quantity + qty;
            // this.setProductToLocal('true', this.localCart, qty);
            // this.getLocalCart();
          }
        }
        else {
          this.setProductToLocal('false', product, qty);
          this.getLocalCart();
        }



      }
      else {
        let data = {
          "product_id": product.product_id,
          "variantId": product.varient_id,
          "quantity": qty,
          "image": product.image,
          "productName": product.title,
          "discountInPercentage": product.discount,
          "price": product.price,
          "specialPrice": product.spl_price,
          "brandName": product.brand,
          "uom": product.uom,
          "uomValue": product.uomValue,
          "IsPrescriptionRequired": product.prescription
        }
        this.localCart.push(data);
        localStorage.setItem('CartItem', JSON.stringify(this.localCart));
        this.getLocalCart();
      }
    }
    else {
      let data = {
        "product_id": product.product_id,
        "variantId": product.varient_id,
        "quantity": qty,
        "image": product.image,
        "productName": product.title,
        "discountInPercentage": product.discount,
        "price": product.price,
        "specialPrice": product.spl_price,
        "brandName": product.brand,
        "uom": product.uom,
        "uomValue": product.uomValue,
        "IsPrescriptionRequired": product.prescription
      }
      this.localCart.push(data);
      localStorage.setItem('CartItem', JSON.stringify(this.localCart));
      this.getLocalCart();
    }

  }

  Check_Cart_Item(id) {

    this.Item_Found_Flag = false
    if (localStorage.getItem('CartItem')) {

      this.Cart = JSON.parse(localStorage.getItem('CartItem'));
      console.log(this.Cart);


      this.Cart.forEach((item) => {
        console.log(id, item.product_id, "both ids");

        if (item.product_id == id) {
          this.Item_Found_Flag = true
          console.log("same");

        }
        // else if (item.product_id != id){
        //   this.Item_Found_Flag = false
        //   console.log("diff");

        // } 
      })
    }
  }

  setProductToLocal(flag: any, product: any, qty) {
    if (flag) {

      switch (flag) {

        case 'true': localStorage.setItem('CartItem', JSON.stringify(product)); break;
        case 'false': let data = {
          "product_id": product.product_id,
          "variantId": product.varient_id,
          "quantity": qty,
          "image": product.image,
          "productName": product.title,
          "discountInPercentage": product.discount,
          "price": product.price,
          "specialPrice": product.spl_price,
          "brandName": product.brand,
          "uom": product.uom,
          "uomValue": product.uomValue,
          "IsPrescriptionRequired": product.prescription
        }
          this.localCart.push(data);
          localStorage.setItem('CartItem', JSON.stringify(this.localCart)); break;
      }
    }
  }

  getLocalCart() {
    if (localStorage.getItem('CartItem')) {
      let cart = JSON.parse(localStorage.getItem('CartItem'));
      this.localCart = cart;
      this.getCartLength(this.localCart);
      this.cartCount = this.localCart.length;
      console.log(this.localCart);
    }
    else {
      this.localCart = [];
      this.cartCount = this.localCart.length;
      this.getCartLength(this.localCart);
    }
  }

  removeLocalCart(prodID) {
    this.localCart = JSON.parse(localStorage.getItem('CartItem'));
    console.log(this.localCart);
    if (this.localCart != '') {
      let data: any = [];
      data = this.localCart.filter((x: any) => x.product_id != prodID);
      console.log(data);
      this.localCart = data;
      this.getCartLength(this.localCart);
      localStorage.setItem('CartItem', JSON.stringify(this.localCart));
    }
  }


  getCartLength(data) {
    this.cartCount = data.length;
  }

  setCartAMountDetails(cart, type) {
    this.cartTotalAmount = 0;
    if (type === 'add') {
      if (cart.length > 0) {
        cart.forEach(element => {

          // let discountAmount = (element.discount/100) * element.specialPrice;
          this.cartTotalAmount = this.cartTotalAmount + (element.specialPrice * element.quantity);
        });
      }
      else {
        this.cartTotalAmount = 0;
      }
    }
    else if (type === 'remove') {
      console.log(this.cartTotalAmount);
      this.cartTotalAmount = this.cartTotalAmount - cart.specialPrice;
    }

  }


  updateQuantity(data, qty) {
    this.localCart = JSON.parse(localStorage.getItem('CartItem'));
    console.log(this.localCart);
    if (this.localCart != '') {
      this.localCart.forEach(element => {
        if (element.product_id === data.product_id) {
          element.quantity = element.quantity + qty;
          console.log(element);
          localStorage.setItem('CartItem', JSON.stringify(this.localCart));
        }
      });
    }
  }


  //set Local cart to db
  addLocalCartToApi(cart) {
    let cartArray: any = [];
    cart.map((res: any) => {
      let data = {
        "product_id": res.product_id,
        "variantId": res.variantId,
        "quantity": res.quantity
      }
      this.http.post(`${this.API}/user/add_prod_cart`, data).subscribe((res: any) => {
        console.log(res)
      })
      ///this.add_To_Cart(data);
    })
    localStorage.removeItem('CartItem');
  }

  checkLocalCart() {
    let flg: boolean = false;
    this.localCart = JSON.parse(localStorage.getItem('CartItem'));
    this.localCart.length > 0 ? flg = true : flg = false;
    console.log(this.localCart);
    if (this.localCart != [] && this.localCart != '') {
      this.addLocalCartToApi(this.localCart);
    }
    else {
      localStorage.setItem('CartItem', '');
    }
  }


  setLiveCartData() {
    this.http.get(`${this.API}/user/get_medicart`).subscribe((res: any) => {
      this.livecartData = res.data[0].medCart.products;
    })
  }





}
