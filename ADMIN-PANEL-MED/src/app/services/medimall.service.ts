import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MedimallService {
  public API = environment.apiUrl;
  public GET_SEARCH_PRODUCTS= this.API + '/customer/search_products';
  constructor(private http:HttpClient) { }

  
searchProduct(key:string,userid:string):Observable<any>{
   const httpHeader=new HttpHeaders({
       'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTBmNzU4NmZmZmQ0OTcxNjI5M2MxMCIsImlhdCI6MTYzNzgxNTQwNywiZXhwIjoxNjQwNDA3NDA3fQ.iMz7stq1D-Zz53IE5HTV1R3Hf_WoCrFBr8imIJ-CYhE'
    })
    return this.http.post(`${this.API}/customer/search_products`,{
      "keyword":key,
      "userId":userid,
      "page":1,
      "limit":10
  },{headers:httpHeader});

  
  }

  //cart api's

  get_cart_details(data){
    return this.http.post(`${this.API}/admin/get_user_cart`,data);
  }

  add_to_cart(data){
    return this.http.post(`${this.API}/admin/add_product_to_cart`,data);
  }

  update_cart(data){
    return this.http.post(`${this.API}/admin/update_cart_item`,data);
  }

  remove_from_cart(data){
    return this.http.post(`${this.API}/admin/remove_cart_item`,data);
  }

  apply_coupon_to_cart(data){
    return this.http.post(`${this.API}/admin/apply_coupon_to_the_cart`,data);
  }

  remove_coupon_from_cart(data){
    return this.http.post(`${this.API}/admin/remove_coupon_from_the_cart`,data);
  }

  update_medcoin(data){
    return this.http.post(`${this.API}/admin/edit_applied_med_coin`,data);
  }

  

  add_address(data){
    return this.http.post(`${this.API}/admin/add_user_address`,data);
  }


    
  upload_image(data){
    return this.http.post(`${this.API}/admin/upload_prescription_image`,data);
  }


  upload_prescription(data){
    return this.http.post(`${this.API}/admin/save_user_prescription`,data);
  }


  sendPaymentLink(data){
    return this.http.post(`${this.API}/admin/send_payment_link_make_new_order`,data);
  }

  convert_to_cod_order(data){
    return this.http.post(`${this.API}/admin/place_order`,data);
  }

}
