import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  public API = environment.apiUrl
  constructor(private http: HttpClient) { }

  get_subscriptions_count(){
    return this.http.get(`${this.API}/admin/get_subscription_details`);
  }

  get_subscriptions(data:any){
    return this.http.post(`${this.API}/admin/get_subscriptions`,data);
  }

  get_payment_awaited_subscriptions(data:any){
    return this.http.post(`${this.API}/admin/get_payment_awaited_subscriptions`,data);
  }

  get_converted_subscriptions(data:any){
    return this.http.post(`${this.API}/admin/get_converted_subscription_orders`,data);
  }

  get_active_subscriptions(data:any){
    return this.http.post(`${this.API}/admin/get_active_subscriptions`,data);
  }

  get_inactive_subscriptions(data:any){
    return this.http.post(`${this.API}/admin/get_inactive_subscriptions`,data);
  }

  send_payment_link(data){
    return this.http.post(`${this.API}/admin/sent_user_subscription_payment_link`,data);
  }

  add_remark(data){
    return this.http.post(`${this.API}/admin/update_subscription_remarks`,data);
  }

  update_user_subscription(data){
    return this.http.post(`${this.API}/admin/update_user_subscription`,data);
  }

  activeate_inactivate_subscription(data){
    return this.http.post(`${this.API}/admin/activate_and_deactivate_subscription`,data);
  }

  search_products(data){
    return this.http.post(`${this.API}/customer/search_dropdown_products`,data);
  }

  move_subscription_to_prescription_awaited(data){
    return this.http.post(`${this.API}/admin/move_subscription_to_prescription_awaited`,data);
  }

  move_subscription_to_review_pending(data){
    return this.http.post(`${this.API}/admin/move_subscription_to_review_pending`,data);
  }

  move_subscription_to_packing_pending(data){
    return this.http.post(`${this.API}/admin/move_subscription_to_packing_pending`,data);
  }

  get_discount_amount_of_coupon_code(data){
    return this.http.post(`${this.API}/admin/get_discount_amount_of_a_coupon`,data);
  }

}
