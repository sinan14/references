import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DeliveryChargeService {

  public API = environment.apiUrl

  public GET_DELIVERY_CHARGE = this.API + '/admin/get_delivery_charge_time'
  public EDIT_DELIVERY_CHARGE = this.API + '/admin/edit_delivery_charge_time'

  constructor(private http:HttpClient) { }

  
  

  get_delivery_charge(){
    return this.http.get(this.GET_DELIVERY_CHARGE)
  }
  edit_delivery_charge(data){
    return this.http.put(this.EDIT_DELIVERY_CHARGE,data)
  }


}
