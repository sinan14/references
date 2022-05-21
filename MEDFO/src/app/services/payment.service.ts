import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'


function _window() : any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  
  get nativeWindow() : any {
    return _window();
 }
 
  public API = environment.baseUrl;

  public Get_MedPride_Coupons = this.API + '/user/get_medpride'

  constructor(private http: HttpClient) { }

  purchase_membership(data:any){
    return this.http.post(`${this.API}/user/purchase_membership`,data);
  }

  verify_subscription_payment(data:any){
    return this.http.post(`${this.API}/user/verify_subscription_payment_RazorPay`,data);
  }

  fetchPremiumBenefitDetails() {
    return this.http.get(`${this.API}/user/get_medpride`);
  }
  //premium coupon details
  get_purchase_coupons(){
    return this.http.get(`${this.API}/user/get_premium_coupons`);

  }

  add_premium_coupons(data){
    return this.http.post(`${this.API}/user/apply_premium_coupons`,data);
  }
  remove_premium_coupons(data){
    return this.http.post(`${this.API}/user/remove__premium_coupons`,data);
  }
//purchase order

  purchase_order(data){
    return this.http.post(`${this.API}/user/place_order`,data);
  }

  verify_razorpay_payment(data){
    return this.http.post(`${this.API}/user/verify_razor_pay_payment`,data);
  }


}
