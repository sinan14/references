import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdsCartService {

  public API = environment.apiUrl;

  public GET_DropDown1_pdtORcat = `${this.API}/ads/get_all_active_products`;
  // public GET_DropDown2_pdtORcatSub = `${this.API}/foliofit/get_product_by_category_id/`;

  public GET_DropDown1_Cat = `${this.API}/ads/get_sub_catgory_healthcare`;
  public GET_DropDown2_CatSub = `${this.API}/ads/get_all_active_products_by_category_id/`;
  
  public GET_HANDPICK_DETAILS = `${this.API}/ads/get_ads_cart_handpick`;
  public GET_AD1_Subs_OrdrRev2_DETAILS = `${this.API}/ads/getAd1SubscriptionOrderReview2`;
  public GET_ORDER_REV_1_DETAILS = `${this.API}/ads/getOrderReview`;
  public GET_ORDER_MED_3Icon_DETAILS = `${this.API}/ads/getOrderMedicine3Icon`;
  public GET_HOW_TO_ORDER_MED_DETAILS = `${this.API}/ads/get_ads_cart_howToOrderMedicine`;
  public GET_ORDER_MED_Slider_DETAILS = `${this.API}/ads/getOrderMedicineSlider`;

  

  public UPDATE_HANDPICK = `${this.API}/ads/edit_ads_cart_handpick`;
  public UPDATE_AD1_Subs_OrdrRev2 = `${this.API}/ads/editAd1SubscriptionOrderReview2`;
  public UPDATE_OrdrRev1 = `${this.API}/ads/editOrderReview`;
  public UPDATE_Order_Med_3Icn = `${this.API}/ads/editOrderMedicine3Icon`;
  public UPDATE_HowToOrder = `${this.API}/ads/edit_ads_cart_howToOrderMedicine`;
  public UPDATE_Order_Med_Slider = `${this.API}/ads/editOrderMedicineSlider`;
  
  
  public HANDPICK_DELETE = `${this.API}/ads/delete_ads_cart_handpick/`;
  public Order_Med_Slider_DELETE = `${this.API}/ads/deleteOrderMedicineSlider/`;

  
  constructor(private http: HttpClient) { }

  //A11 API's

  getDropDown1_Cat() {
    return this.http.get(`${this.GET_DropDown1_Cat}`)
  }
  getDropDown2_CatSub(id) {
    return this.http.get(`${this.GET_DropDown2_CatSub}`+id)
    // return this.http.get(`${this.GET_DropDown2}`+id)
  }

  getDropDown1_pdt() {
    return this.http.get(`${this.GET_DropDown1_pdtORcat}`)
  }
  // getDropDown2_pdtORcatSub(id) {
  //   return this.http.get(`${this.GET_DropDown2_pdtORcatSub}`+id)
  //   // return this.http.get(`${this.GET_DropDown2}`+id)
  // }


  // getDropDown1_Pdt() {
  //   return this.http.get('http://143.110.240.107:8000/foliofit/get_product_by_category_id/:categoryId')
  // }
  // getDropDown2_PdtSub(id) {
  //   return this.http.get('//143.110.240.107:8000/foliofit/get_product_by_category_id/'+id)
  //   // return this.http.get(`${this.GET_DropDown2}`+id)
  // }
  
  getHandPick() {
    return this.http.get(`${this.GET_HANDPICK_DETAILS}`)
  }
  getAd1_Subs_OrdrRev2(){
    return this.http.get(`${this.GET_AD1_Subs_OrdrRev2_DETAILS}`)
  }
  getOrderRev1(){
    return this.http.get(`${this.GET_ORDER_REV_1_DETAILS}`)
  }
  getOrderMed_3Icon(){
    return this.http.get(`${this.GET_ORDER_MED_3Icon_DETAILS}`)
  }
  getHowToOrderMed(){
    return this.http.get(`${this.GET_HOW_TO_ORDER_MED_DETAILS}`)
  }
  getOrderMed_Slider(){
    return this.http.get(`${this.GET_ORDER_MED_Slider_DETAILS}`)
  }


  update_HandPick(data) {
    return this.http.put(`${this.UPDATE_HANDPICK}`,data)
  }
  update_Ad1_Subs_OrdrRev2(data){
    return this.http.put(`${this.UPDATE_AD1_Subs_OrdrRev2}`, data);
  }
  update_OrderRev1(data){
    return this.http.put(`${this.UPDATE_OrdrRev1}`, data);
  }
  update_Order_Med_3Icn(data){
    return this.http.put(`${this.UPDATE_Order_Med_3Icn}`, data);
  }
  update_HowToOrder(data){
    return this.http.put(`${this.UPDATE_HowToOrder}`, data);
  }
  update_Order_Med_Slider(data){
    return this.http.put(`${this.UPDATE_Order_Med_Slider}`, data);
  }

  
  delete_HandPick(id){
    return this.http.delete(`${this.HANDPICK_DELETE}`+id);
  }
  delete_Order_Med_Slider(id){
    return this.http.delete(`${this.Order_Med_Slider_DELETE}`+id);
  }


}
