import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private _http: HttpClient) { }
  public _api = environment.baseUrl;
  checkLink(orderId: any) {
    console.log(orderId);
   let  data={
    "orderId":orderId
    }
  
    const endPoint = `${this._api}/user/send/check-link`;
    return this._http.post(endPoint, data);
  }
  checkout(orderId: any) {
    console.log(orderId);
   let  data={
    "orderId":orderId
}
   
    const endPoint = `${this._api}/user/account/list-address-web`;
    return this._http.post(endPoint, data);
  }
  adduser(data:any){
    const endPoint = `${this._api}/user/send/accept_package_web`;
    return this._http.put(endPoint, data);
  }
  addAddress(data:any){
    const endPoint = `${this._api}/user/account/add-user-address-web`;
    return this._http.post(endPoint, data);
  }

}
