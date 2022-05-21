import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CustomerRelationService {

  public API = environment.apiUrl

  public GET_CUSTOMER_DATABASE = this.API + '/customer/getCustomers'
  public ADD_NEW_CUSTOMER_DATABASE = this.API + '/customer/addCustomer'
  public GET_CUSTOMER_REMARK = this.API + '/customer/getCustomersRemarks/'
  public EDIT_CUSTOMER_REMARK = this.API + '/customer/updateCustomerRemarks/'
  public SEARCH_CUSTOMER_REMARK = this.API + '/customer/search-customer'

  //POP_UP_BANNER
  public POST_POP_UP_BANNER = this.API + '/customer/add-popup-banner/'

  //PUSH_NOTIFICATION
  public GET_CUSTOMER_BY_SEGMENT = this.API + '/admin/get_customers_by_segment/'
  public LIST_PAST_PUSH_NOTIFICATION = this.API + '/customer/list_past_scheduled_push_notification/'
  public LIST_SCHEDULED_PUSH_NOTIFICATION = this.API + '/customer/list_scheduled_push_notification/'
  public ADD_PUSH_NOTIFICATION = this.API + '/customer/add_push_notification/'
  public GET_PUSH_NOTIFICATION_BY_ID = this.API + '/customer/get_scheduled_push_notification_byId/'
  public UPDATE_PUSH_NOTIFICATION = this.API + '/customer/edit_push_notification/'


  


  constructor(private http: HttpClient) { }

  get_CUSTOMER_DATABASE(data) {
    return this.http.post(this.GET_CUSTOMER_DATABASE, data)
  }

  add_NEW_CUSTOMER(data) {
    return this.http.post(this.ADD_NEW_CUSTOMER_DATABASE, data)
  }

  get_CUSTOMER_REMARK(id) {
    return this.http.get(this.GET_CUSTOMER_REMARK + id)
  }

  edit_CUSTOMER_REMARK(id, data) {
    return this.http.post(this.EDIT_CUSTOMER_REMARK + id, data)
  }

  search_CUSTOMER(data){
    return this.http.post(this.SEARCH_CUSTOMER_REMARK, data)
  }


  //POP_UP_BANNER
  post_POP_UP_BANNER(data) {
    return this.http.post(this.POST_POP_UP_BANNER, data)
  }

  //PUSH_NOTIFICATION
  get_CUSTOMER_BY_SEGMENT(body) {
    return this.http.post(this.GET_CUSTOMER_BY_SEGMENT, body)
  }
  list_PAST_PUSH_NOTIFICATION() {
    return this.http.get(this.LIST_PAST_PUSH_NOTIFICATION)
  }
  list_SCHEDULED_PUSH_NOTIFICATION() {
    return this.http.get(this.LIST_SCHEDULED_PUSH_NOTIFICATION)
  }
  add_PUSH_NOTIFICATION(data) {
    return this.http.post(this.ADD_PUSH_NOTIFICATION, data)
  }
  get_PUSH_NOTIFICATION_BY_ID(id) {
    return this.http.get(this.GET_PUSH_NOTIFICATION_BY_ID + id)
  }
  update_PUSH_NOTIFICATION(id,data) {
    return this.http.post(this.UPDATE_PUSH_NOTIFICATION + id, data)
  }



  //categories,product of medimall
  get_categories() {
    return this.http.get(`${this.API}/ads/get_sub_catgory_healthcare`);
  }

  get_products() {
    return this.http.get(`${this.API}/ads/get_all_active_products`);
  }

  payMedcoin(value) {
    console.log(value)
    return this.http
      .post(`${this.API}/admin/pay_med_coin`, value)
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
