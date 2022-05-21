import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  public API = environment.baseUrl;
  constructor(private http: HttpClient) { }

  get_order_details_by_id(data:any){
    return this.http.post(`${this.API}/user/web-my-orders-details`,data);
  }

  get_my_orders() {
    return this.http.get(`${this.API}/user/web-my-orders`);
  }

  checkCancelOrder(data){
    return this.http.post(`${this.API}/user/get_cancel_eligible_product`,data);
  }

  Cancel_Order(data){
    return this.http.post(`${this.API}/user/cancel_order`,data);
  }

  Cancel_Reason(data){
    return this.http.post(`${this.API}/user/cancel_order`,data);
  }

  checkReturnOrder(data){
    return this.http.post(`${this.API}/user/get_return_eligible_product`,data);
  }

  checkReturnOrderRefundAmount(data){
    return this.http.post(`${this.API}/user/get_refundable_amount`,data);
  }

  Return_Product(data){
    return this.http.post(`${this.API}/user/return_product`,data);
  }

  Return_Reason(data){
    return this.http.post(`${this.API}/user/return_order_reason`,data);
  }

  view_invoice(data){
    return this.http.post(`${this.API}/user/create_order_invoice`,data);
  }



  /* Return Details */
  get_return_details(data){
    return this.http.post(`${this.API}/user/get_return_order_details`,data);
  }
  
}
