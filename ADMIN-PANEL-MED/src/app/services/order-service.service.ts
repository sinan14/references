import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  public API = environment.apiUrl;

  //GET DOCTOR DETAILS
  public GET_DOCTOR_DETAILS = this.API + '/admin/get_doctor_details/'

  //PRESCRIPTION AWAITED
  public GET_PRESCRIPTION_AWAITED = this.API + '/admin/get_prescription_awaited_orders/'
  public REJECT_PRESCRIPTION = this.API + '/admin/reject_Prescription_awaited_order/'
  public UPDATE_REMARK = this.API + '/admin/update_remarks/'
  public CREATE_PRESCRIPTION = this.API + '/admin/create_prescription'
  public SEARCH_PRODUCTS = this.API + '/customer/search_dropdown_products'

  //Payment_Awaiteed_Tab
  public GET_PAYMENT_AWAITED_ORDER = this.API + '/admin/get_payment_awaited_orders'
  public SEND_PAYMENT_LINK = this.API + '/admin/send_payment_link_to_user'
  public VERIFY_PAYMENT_AWAITED_ORDER = this.API + '/admin/verify_payment_awaited_order'
  public MOVE_ORDER_TO_REVIEW_PENDING_ORDER = this.API + '/admin/move_order_to_review_pending_order'
  public REFUND_PAYABLE_MEDCOIN = this.API + '/admin/refund_payable_med_coin'
  public REFUND_PAYABLE_RAZORPAY = this.API + '/admin/refund_payable_razorpay'


  
  

  //Review_Pending
  public GET_REVIEW_PENDING = this.API + '/admin/get_review_pending_orders'
  public ACPT_REJECT_ORDER = this.API + '/admin/accept_or_reject_review_pending_order'


  

  //Packing_Pending
  public GET_PACKING_PENDING = this.API + '/admin/get_packing_pending_orders'

  //Pickup_Pending
  //manual pickup
  public GET_Pickup_Pending_Manual = this.API + '/admin/get_pickup_pending_orders'

//Transit
  //manual pickup
  public GET_Transit_Manual = this.API + '/admin/get_transit_orders'

//Delivered
  //manual pickup
  public GET_Delivered_Manual = this.API + '/admin/get_delivered_orders'


  // RETURN MANAGEMENT
  public GET_RETURN_REQUEST = this.API + '/admin/get_return_requests'
  public DIRECT_Approve_Refund_Order = this.API + '/admin/direct_approve_return_order'
  public GET_RETURN_PICKUP = this.API + '/admin/get_return_pickup'
  public GET_QUALITY_CHECK = this.API + '/admin/get_quality_check'
  public GET_REFUND_APPROVE_DECLINE = this.API + '/admin/get_approved_declined_return'

  // APPROVE_REJECT_ORDER IN QUALITYCHECK TAB
  public APPROVE_REJECT_ORDER = this.API + '/admin/approve_reject_return_order'
  
   //Move_To_QualityCheck From RETURN PICKUP
  public MOVE_TO_QUALITY_CHECK = this.API + '/admin/to_quality_check'
  
  

  //VIEW_BTN_POP_UP
  public GET_HEALTH_DATA_BY_ORDER_ID = this.API + '/admin/get_health_data_by_user_id'




  //Order_Id_POP_UP
  public GET_ORDER_INVOICE_BY_ORDER_ID = this.API + '/admin/get_order_invoice_by_order_id'
  public GET_DELIVERY_BOYS_BY_ORDER_ID = this.API + '/admin/get_delivery_boys_by_order_id'
  public ASSIGN_DELIVERY_BOY = this.API + '/admin/assign_deliver_boy_to_order'
  public CHANGE_DELIVERY_BOY = this.API + '/admin/update_deliver_boy_to_order'
  public CHANGE_DELIVERY_RETURN_BOY = this.API + '/admin/assign_return_to_deliveryBoy'

  public GET_RETURN_INVOICE_BY_ORDER_ID = this.API + '/admin/get_return_invoice_by_orderId'

  
  


  constructor(private http: HttpClient) { }

  //GET DOCTOR DETAILS
  get_DOCTOR_DETAILS(){
    return this.http.get(this.GET_DOCTOR_DETAILS)
  }

  //PRESCRIPTION AWAITED
  get_PRESCRIPTION_AWAITED(page, body) {
    return this.http.post(this.GET_PRESCRIPTION_AWAITED + page, body)
  }

  post_REJECT_PRESCRIPTION(data) {
    return this.http.post(this.REJECT_PRESCRIPTION, data)
  }

  update_REMARK(data) {
    return this.http.post(this.UPDATE_REMARK, data)
  }

  create_PRESCRIPTION(data) {
    return this.http.post(this.CREATE_PRESCRIPTION, data)
  }

  search_PRODUCTS(data) {
    return this.http.post(this.SEARCH_PRODUCTS, data)
  }


  //Payment_Awaited_Tab
  get_PAYMENT_AWAITED(data) {
    return this.http.post(this.GET_PAYMENT_AWAITED_ORDER, data)
  }

  send_PAYMENT_LINK(data) {
    return this.http.post(this.SEND_PAYMENT_LINK, data)
  }

  verify_PAYMENT_AWAITED_ORDER(data) {
    return this.http.post(this.VERIFY_PAYMENT_AWAITED_ORDER, data)
  }

  Move_To_Review_Pending(data){
    return this.http.post(this.MOVE_ORDER_TO_REVIEW_PENDING_ORDER, data)
  }

  Refund_Medcoin(data){
    return this.http.post(this.REFUND_PAYABLE_MEDCOIN, data)
  }

  Refund_Razorpay(data){
    return this.http.post(this.REFUND_PAYABLE_RAZORPAY, data)
  }

  //REVIEW PENDING
  get_REVIEW_PENDING(data) {
    return this.http.post(this.GET_REVIEW_PENDING, data)
  }

  acpt_reject_ORDER(data) {
    return this.http.post(this.ACPT_REJECT_ORDER, data)
  }

  //VIEW_BTN_POP_UP
  get_Health_Data(data){
    return this.http.post(this.GET_HEALTH_DATA_BY_ORDER_ID, data)
  }


  //Packing_Pending
  get_Packing_Pending(data) {
    return this.http.post(this.GET_PACKING_PENDING, data)
  }

  // Pickup_Pending
  get_Pickup_Pending_Manual(data){
    return this.http.post(this.GET_Pickup_Pending_Manual, data)
  }

  //Transit
  get_Transit_Manual(data){
    return this.http.post(this.GET_Transit_Manual, data)
  }

  // Delivered
  get_Delivered_Manual(data){
    return this.http.post(this.GET_Delivered_Manual, data)
  }
  

  // RETURN MANAGEMENT
  //Return request
  get_RETURN_REQUEST(data){
    return this.http.post(this.GET_RETURN_REQUEST, data)
  }
  // Direct_Approve_Refund_Order frm return request
  Direct_Approve_Refund_Order(data){
    return this.http.post(this.DIRECT_Approve_Refund_Order, data)
  }
//Return pickup
get_RETURN_PICKUP(data){
  return this.http.post(this.GET_RETURN_PICKUP, data)
}
//Quality check
get_QUALITY_CHECK(data){
  return this.http.post(this.GET_QUALITY_CHECK, data)
}
Approve_Reject_ReturnOrder(data){
  return this.http.post(this.APPROVE_REJECT_ORDER,data)
}
Move_To_QualityCheck(data){
  return this.http.post(this.MOVE_TO_QUALITY_CHECK,data)
}
//Refund approval , declined
get_REFUND_APPROVE_DECLINE(data){
  return this.http.post(this.GET_REFUND_APPROVE_DECLINE, data)
}


  //Order_Id_POP_UP
  get_ORDER_INVOICE_BY_ORDER_ID(data) {
    return this.http.post(this.GET_ORDER_INVOICE_BY_ORDER_ID, data)
  }

  get_RETURN_INVOICE_BY_ORDER_ID(data){
    return this.http.post(this.GET_RETURN_INVOICE_BY_ORDER_ID, data)
  }

  get_DELIVERY_BOYS_BY_ORDER_ID(data) {
    return this.http.post(this.GET_DELIVERY_BOYS_BY_ORDER_ID, data)
  }

  Assign_Delivery_Boy(data) {
    return this.http.post(this.ASSIGN_DELIVERY_BOY, data)
  }

  Change_Delivery_Boy(data) {
    return this.http.post(this.CHANGE_DELIVERY_BOY, data)
  }

  Assign_Delivery_Boy_Return(data){
    return this.http.post(this.CHANGE_DELIVERY_RETURN_BOY, data)
  }

}

