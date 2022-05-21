import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentMessageService } from '../services/payment-message.service';

@Component({
  selector: 'app-payment-message',
  templateUrl: './payment-message.component.html',
  styleUrls: ['./payment-message.component.css']
})
export class PaymentMessageComponent implements OnInit {
paymentId:any
message:any
  constructor(
    private router: ActivatedRoute,
    private verify:PaymentMessageService
  ) {
 
    this.router.queryParams.subscribe(params => {
      console.log(params)
      this.paymentId=params.razorpay_payment_link_id;
      console.log(this.paymentId)
    })
       
    this.verify.verifyPayment(this.paymentId).subscribe(res=>{
      console.log(Object.values(res)[1])
this.message=Object.values(res)[1];
    })
  
  }
  ngOnInit(): void {
 
 
  }

}
