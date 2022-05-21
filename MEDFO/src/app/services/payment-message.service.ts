import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PaymentMessageService {

  public API = environment.baseUrl;
  
  public POST_VERIFY_PAYMENT = this.API + '/admin/verify_payment_by_payment_link_id'
  constructor(private http: HttpClient) { }
  verifyPayment(id:any){
    const httpHeader=new HttpHeaders({
      'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTBmNzU4NmZmZmQ0OTcxNjI5M2MxMCIsImlhdCI6MTYzOTk1NzAxMywiZXhwIjoxNjQyNTQ5MDEzfQ.u6GOBlHxztKITEKS0mHrcrlGC-zaUFr9rou8oiKC35Q'
    
     })
   return this.http.post(this.POST_VERIFY_PAYMENT,{paymentLinkRazorPayId:id},{headers:httpHeader});
 }
}
