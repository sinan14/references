import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SuggestedProductService {

  public API = environment.apiUrl

  public GET_SUGGESTED_PRODUCTS = this.API + '/admin/get_suggested_products'
  public ADD_SUGGESTED_PRODUCTS = this.API + '/admin/approve_suggested_product'
  public DATE_SUGGESTED_PRODUCTS = this.API + '/admin/get_date_suggested_products'


  
  

  constructor(private http:HttpClient) { }

  get_suggested_products(body){
    return this.http.post(this.GET_SUGGESTED_PRODUCTS,body)
  }

  add_suggested_products(data){
    return this.http.post(this.ADD_SUGGESTED_PRODUCTS,data)
  }

  get_date_suggested_products(body){
    return this.http.post(this.DATE_SUGGESTED_PRODUCTS,body)
  }

}
