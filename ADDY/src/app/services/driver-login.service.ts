import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DriverLoginService {

  constructor(private http:HttpClient) { }
  public _api = environment.baseUrl;
  login(codeid:any,mobileNumber:string){
    const endPoint = `${this._api}/seller/driver-login`;
    return this.http.post(endPoint, {code:codeid,mobile:mobileNumber});
  }
  login_validity(order_id:any){
    const endPoint = `${this._api}/seller/driver-check-link`;
    return this.http.post(endPoint, {orderId:order_id});
  }
  order_details(order_id:string){
    const httpHeader=new HttpHeaders({
      'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjYxZDJkMDhkNDUzMGYxZmYzMmNkNjI1MSJ9LCJpYXQiOjE2NDEyMDYwNTMsImV4cCI6MTY0Mzc5ODA1M30.w6ymLT8dFujs2P2Tr960X00w0yRiYnmUurvy4SscQtM'
    })
    const endPoint = `${this._api}/seller/driver-order-details`;
    return this.http.post(endPoint,
       {orderId:order_id},{headers:httpHeader});
  }
  deliver_fee(order_id:string,fee:any){
   
    const endPoint = `${this._api}/seller/driver-estimated-deliveryfee`;
    return this.http.post(endPoint,
       {orderId:order_id,estimatedDeliveryFee:fee});
  }
  status_update(order_id:string,status:string){

    const endPoint = `${this._api}/seller/driver-status-update`;
    return this.http.post(endPoint,
       {orderId:order_id,status:status});

  }
  driver_status_list(order_id:string){
    const endPoint = `${this._api}/seller/driver-status-list/`+order_id;
    return this.http.get(endPoint);

  }
  
}
