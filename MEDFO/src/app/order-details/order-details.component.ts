import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { HealthVaultService } from '../services/health-vault.service';
import { LandingService } from 'src/app/services/landing.service';
import { Title, Meta } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from 'src/app/services/orders.service';
import { environment } from 'src/environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NewCartService } from 'src/app/services/new-cart.service';
import Swal from 'sweetalert2';
import { ClipboardService } from 'ngx-clipboard';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserDashboardService } from 'src/app/services/user-dashboard.service';
 import  jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as  jspdf from 'jspdf';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  @ViewChild('invoice') invoice :ElementRef
  public order_id :any = '';
  public addressDetails :any = '';
  public order_detail :any = [];
  public cartDetails :any = '';
  public note :any = '';
  public reasonArray :any ='';
  public ConfirmChecked :boolean = false;
  public attemptSubmitted :boolean = false;
  public cancelledOrderDetails :any =[];
  public eligibleForCancel :boolean = false;
  public cancelRefundAmount  = 0.00;
  public orderPaymentType :any = '';
  public returnCheckBoxOne :boolean = false;
  public returnCheckBoxTwo :boolean = false;
  
  public returnOrderDetails :any =[];
  public eligibleForReturn :boolean = false;
  public returnedProductSelected :any = [];
  public returnNote :any = '';
  public returnReason :any ='';
  public returnReasonID :any ='';
  public returnRefundAmount  = 0.00;
  public memberDiscount :any = '';

  public payment_Method_Type :any = 'bank';

  public personal_info: any;
  public visibleFlag :boolean = false

  public bankForm :FormGroup;
  public attemptedSubmit :boolean = false;

  constructor(public _orderService: OrdersService,
    public activatedRoute: ActivatedRoute,
    private _newcartService: NewCartService,
    // private modalService: NgbModal,
    private _fb: FormBuilder,
    private _clipboardService: ClipboardService,
    private _router: Router,
    private Health_Vault_Service: HealthVaultService,
    public _landingService: LandingService,
    private titleService: Title,
    private metaService: Meta,
    public _toasterService :ToastrService,
    public _userDashboardService: UserDashboardService) { 

      this.bankForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        accountno: new FormControl('', [Validators.required, Validators.minLength(9) , Validators.maxLength(18)]),
        re_accountno: new FormControl('', [Validators.required, Validators.maxLength(14)]),
        ifsc_code: new FormControl('', [Validators.required , Validators.maxLength(255),Validators.minLength(11),Validators.pattern('^[A-Z]{4}[0][A-Z0-9]{6}$')]),
        bank_name: new FormControl('', [Validators.required , Validators.maxLength(255)]),
        branch_name: new FormControl('', [Validators.required , Validators.maxLength(255)]),
        account_type: new FormControl('', [Validators.required]),
      });

    }

  ngOnInit(): void {

    
    
    this.activatedRoute.paramMap.subscribe(params => {
      this.order_id = params.get('order_id');
      this.get_order_details();
      this.checkEligibleForCancelOrder();
      this.checkEligibleForReturnOrder();


      this.getPersonalDetails();
    });
  }
  
//   //Account Number Validation
//   validateAccountNumberConfirmation(group: FormGroup): any{
//     let valid = true;
//     if (this.bankForm.controls.accountno != this.bankForm.controls.re_accountno) {
//         valid = false;
//         this.bankForm.controls.re_accountno.setErrors({validatePasswordConfirmation: true});
//     }
//     return valid;
// }



  getPersonalDetails() {
    this._userDashboardService.getPersonalInfo().subscribe(
      (res: any) => {
        if (res.error == false) {
          this.personal_info = res.data;
          console.log(this.personal_info);
        } else {
          console.log('onh no error');
        }
      },
      (error: any) => {
        console.log('oh no error occure from server');
        console.log(error);
      }
    );
  }

  geCancelRefundAmount(){

    let list:any = [];
    list = this.cancelledOrderDetails.map((p:any,index)=>{
        return  p.variantId;
    })
    let input = {
      orderId : this.order_id,
      products : list
    }
    this._orderService.checkReturnOrderRefundAmount(input).subscribe((res:any)=>{
      if(!res.error){
        this.cancelRefundAmount = res.data.refundableAmount;
      }
    })
  }

  checkEligibleForCancelOrder(){
    let input ={
      id : this.order_id
    }  
     this._orderService.checkCancelOrder(input).subscribe((res:any)=>{
      if(!res.error){
        //this.eligibleForCancel = res.data.eligibleForCancel;
        this.cancelledOrderDetails = res.data.result.products;
        this.geCancelRefundAmount();
        if(this.eligibleForCancel){
          let list:any = [];
          list = this.cancelledOrderDetails.map((p:any,index)=>{
              return  p.variantId;
          })
         
        }

    
      }
    })

    //alert(this.eligibleForCancel);
  }


  checkEligibleForReturnOrder(){
    this.returnOrderDetails = [];
    let input ={
      id : this.order_id
    }  
     this._orderService.checkReturnOrder(input).subscribe((res:any)=>{
      if(!res.error){
       // this.eligibleForReturn = res.data.eligibleForReturn;
        this.returnOrderDetails = res.data.result.products;
       
      }
    })

    //alert(this.eligibleForCancel);
  }


  chnageDateFormat(date:any){
    var myDate = new Date();
    var nextDay = new Date(date);


    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(nextDay, 'EE dd : yyyy  '+ ' ' +'       h : mm a');
   
    return end;
  }

  chnageSecondDateFormat(date:any){
    var myDate = new Date();
    var nextDay = new Date(date);


    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(nextDay, 'MMM , dd  yyyy  h : mm a');
   
    return end;
  }


  get_order_details(){
    let input ={
      id: this.order_id
    }
    this._orderService.get_order_details_by_id(input).subscribe((res:any)=>{
      console.log(res);
      this.eligibleForCancel = res.data.result.eligibleForCancel ?  res.data.result.eligibleForCancel : false;
      this.eligibleForReturn = res.data.result.eligibleForReturn ?  res.data.result.eligibleForReturn : false;
      this.addressDetails = res.data.result.address;
      this.order_detail = res.data.result;
      this.cartDetails = res.data.result.cartDetails;
      this.orderPaymentType =  res.data.result.paymentType;
    })
  }

 

  selectReason(reason:any){
    //alert(reason);
    this.reasonArray = reason;
  }

  IConfirmChecked(event:any){
      if(event.target.checked){
        this.ConfirmChecked = true;
      }
      else{
        this.ConfirmChecked = false;
      }
  }

  cancelOrder(){
    if(!this.ConfirmChecked || this.reasonArray=='' || this.note==''){
      return;
    }

    if(!this.ConfirmChecked){
      return;
    }

    if(this.reasonArray==''){
      return;
    }

    if(this.note==''){
      return;
    }

    
    document.getElementById('cancel-reason-popup').click();
    if(this.orderPaymentType != 'cod'){
      document.getElementById('display-cancel-success-popup').click();
      this.cancelReason();
    }
    else{
      this.cancelReason();
      this.cancelOrderID_For_COD();
    }
    // this.cancelOrderID();
 
  }
  cancelOrderID_For_COD(){
    let input ={
      id : this.order_id,
      refundMethod:'',
    } 
    this._orderService.Cancel_Order(input).subscribe((res:any)=>{
      console.log(res)
      if(!res.error){
        Swal.fire({
          icon: 'success',
          title: res.message,
          }).then(()=>{
            this._router.navigate(['/dashboard-order-details/order-list']);
          });
      }
      else{
        Swal.fire({
          icon: 'warning',
          title: res.message,
          });
      }
    });
  }

  cancelOrderID(){
    let input ={
      id : this.order_id,
      refundMethod:this.payment_Method_Type,
    } 
    this._orderService.Cancel_Order(input).subscribe((res:any)=>{
      console.log(res)
      if(!res.error){
        Swal.fire({
          icon: 'success',
          title: res.message,
          }).then(()=>{
            document.getElementById('dismiss-refund-mode-popup').click();
            this._router.navigate(['/dashboard-order-details/order-list']);
          });
      }
      else{
        Swal.fire({
          icon: 'warning',
          title: res.message,
          });
      }
    });
  }

  confirmCancelOrder(){
    this.cancelOrderID();
  }

  cancelReason(){
    let input ={
      id : this.order_id,
      reason :this.reasonArray,
      notes: this.note
    }
    this._orderService.Cancel_Reason(input).subscribe((res:any)=>{
      console.log(res)
      // if(!res.error){
      //   Swal.fire({
      //     icon: 'success',
      //     title: res.message,
      //     }).then(()=>{
      //       this._router.navigate(['/dashboard-order-details/order-list']);
      //     });
      // }
      // else{
      //   Swal.fire({
      //     icon: 'warning',
      //     title: res.message,
      //     });
      // }
    });
  }

  //Return Order

  selectReturnReason(reason:any){
    //alert(reason);
    this.returnReason = reason;
  }

  retunr_CheckBoxOne(event:any){
    this.returnCheckBoxOne = event.target.checked;
  }

  retunr_CheckBoxTwo(event:any){
    this.returnCheckBoxTwo = event.target.checked;
  }

  returnRadioButtonChecked(event:any , index:any){
    if(event.target.checked){
      this.returnedProductSelected.push(index);
      let list:any = [];
      list = this.returnedProductSelected.map((p:any,index)=>{
          return  p.variantId;
      })
      let input = {
        orderId : this.order_id,
        products : list
      }
      this.returnRefundAmount = 0;
      this._orderService.checkReturnOrderRefundAmount(input).subscribe((res:any)=>{
        console.log(res)
        if(!res.error){
          this.returnRefundAmount = res.data.refundableAmount;
          this.memberDiscount = res.data.memberDiscount;
        }
      })

    }
    else{
        this.returnRefundAmount = 0;
        let data :any = [];
        data = this.returnedProductSelected.filter((res:any)=>res.product_id != index.product_id);
        
        this.returnedProductSelected = data;

        let list:any = [];
        list = this.returnedProductSelected.map((p:any,index)=>{
            return  p.variantId;
        })
        let input = {
          orderId : this.order_id,
          products : list
        }
        this._orderService.checkReturnOrderRefundAmount(input).subscribe((res:any)=>{
          console.log(res)
          if(!res.error){
            this.returnRefundAmount = res.data.refundableAmount;
          }
        })

    }
  }

  pickUpAddress(){

    if(this.returnedProductSelected.length==0 && !this.returnCheckBoxOne && !this.returnCheckBoxTwo){
      Swal.fire({
        title: 'Please fill provided fields !!!',
        icon: 'warning',
      })
      return;
    }


    if(this.returnedProductSelected.length==0){
      Swal.fire({
        title: 'Please choose any one product!!',
        icon: 'warning',
      })
      return;
    }

    if(!this.returnCheckBoxOne || !this.returnCheckBoxTwo){
      Swal.fire({
        title: 'Please confirm these check box!!',
        icon: 'warning',
      })
      return;
    }

    else{
      this.attemptSubmitted = false;
      document.getElementById('dismiss-refund-return-popup').click();
    }
  }


  returnPickup(){
    if(!this.ConfirmChecked || this.returnReason=='' || this.returnNote==''){
      //alert("noo");
      return;
    }

    this.sentreturnReason();
  }

 

  sentreturnReason(){
    let input ={
      id : this.order_id,
      reason :this.returnReason,
      notes: this.returnNote
    }
    this._orderService.Return_Reason(input).subscribe((res:any)=>{
      console.log(res)
      this.returnReasonID = res.data._id;
      document.getElementById('dismiss-refund-return').click();
      // if(!res.error){
      //   Swal.fire({
      //     icon: 'success',
      //     title: res.message,
      //     });
      // }
      // else{
      //   Swal.fire({
      //     icon: 'warning',
      //     title: res.message,
      //     });
      // }
    });
  }

 

  //payment type
  paymentMethodSelected(type){
    this.payment_Method_Type = type;
  }

  confirmReturnOrder(){
    if(this.payment_Method_Type===''){
      return;
    }

    else{
      this.returnProduct();
      document.getElementById('dismiss-refund-mode-popup').click();
    }
  }

  //return produtc popup
  returnProduct(){
    let list:any = [];
    list = this.returnedProductSelected.map((p:any,index)=>{
        return  {
          product_id : p.product_id,
          varientId : p.variantId,
          quantity: p.quantity    
        }
    })

    let input = {
      id : this.order_id,
      products : list,
      address: this.order_detail.address._id,
      paymentMethod:this.payment_Method_Type,
      refundableAmount : this.returnRefundAmount,
      returnId : this.returnReasonID
    }
   
  
    this._orderService.Return_Product(input).subscribe((res:any)=>{
      console.log(res)
      if(!res.error){

        if(this.payment_Method_Type==='medcoin'){
          document.getElementById('dismiss-refund-mode-popups-return').click();
          Swal.fire({
            icon: 'success',
            title: 'Product return request submitted successfully',
            }).then(()=>{
              this._router.navigate(['/dashboard-order-details/order-list']);
          });
        }
        else{
          document.getElementById('dismiss-refund-mode-popups-return').click();
          Swal.fire({
            icon: 'success',
            title: 'Product return request submitted successfully',
            text: 'Your refund will be initiate to your bank a/c within 5 - 6 working days'
            }).then(()=>{
              this._router.navigate(['/dashboard-order-details/order-list']);
          });
        }
       
      }
      else{
        Swal.fire({
          icon: 'warning',
          title: res.message,
          });
      }
    });
  }


  printInvoice(){
    var printContents = document.getElementById('invoice').innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    window.focus();
    window.location.reload();
    // var divToPrint = document.getElementById("invoice");
    // let newWin = window.open();
    // newWin.window.focus();
    // newWin.document.write(divToPrint.outerHTML);
    // newWin.print();
    // newWin.close();
  }

  eligibleCancel(){
    if(!this.eligibleForCancel){
      Swal.fire({
        icon: 'warning',
        title: 'Cancel time period expired !!!',
      })
    }
  }

  userCancelCLicked(){
    if(this.order_detail.orderStatus ==='cancelled'){
      Swal.fire({
        icon: 'warning',
        title: 'This order has been already cancelled !!!',
      })
    }
  }

  notEligibleReturnCLick(status,id){
    if(status !='returned' && status !='applied for return' && status !='return approved' && status !='return picked up' && status !='return confirmed'){
      Swal.fire({
        icon: 'warning',
        title: 'Return not possible !!!',
      })
    }
    else if(status =='returned' || status =='applied for return' 
    || status =='pickup pending'  
    || status =='approved' || status =='declined' || status =='collected' 
    || status =='submitted' || status =='quality check' || status =='completed' ||
     status =='return approved' || status =='return picked up' || status =='return confirmed'){
      this._router.navigate(['/return-detail/'+id])
    }
    
  }


  generatePDF() {
    //Generaet PDF CODE
    // var element = document.getElementById('invoice');

    // var opt = {
    //   margin:       1,
    //   filename:     'invoice.pdf',
    //   image:        { type: 'jpeg', quality: 0.98 },
    //   html2canvas:  { scale: 2  },
    //   jsPDF:        { unit: 'in', format: 'letter', orientation: 'l' }
    // };

    // html2pdf(element, opt);

    let input = {
      orderId : this.order_id
    }

    this._orderService.view_invoice(input).subscribe((res:any)=>{
      console.log(res);
      if(!res.error){
        window.open(res.data.pdfFile,'_target')
      }
    })
  }


  redirectRetunrDetailPage(status,id){
    this._router.navigate(['/return-detail/'+id])
  }


  //return confirm in case of bank choose

  confirmReturnOrderBank(){
    if(this.payment_Method_Type===''){
      return;
    }

    else{
      document.getElementById('dismiss-refund-mode-popups-return').click();
      document.getElementById('dismiss-refund-mode-popup').click();
    }
  }

  //return produtc popup
  returnProductBank(){
    let list:any = [];
    list = this.returnedProductSelected.map((p:any,index)=>{
        return  {
          product_id : p.product_id,
          varientId : p.variantId,
          quantity: p.quantity    
        }
    })

    let input = {
      id : this.order_id,
      products : list,
      address: this.order_detail.address._id,
      paymentMethod:this.payment_Method_Type,
      refundableAmount : this.returnRefundAmount,
      returnId : this.returnReasonID,

      customerName: this.bankForm.get('name').value,
      accountNumber: this.bankForm.get('accountno').value,
      reAccountNumber: this.bankForm.get('re_accountno').value,
      ifsc: this.bankForm.get('ifsc_code').value,
      bankName: this.bankForm.get('bank_name').value,
      branch: this.bankForm.get('branch_name').value,
      accountType: this.bankForm.get('account_type').value,
    }
    
    console.log(input)
  
    this._orderService.Return_Product(input).subscribe((res:any)=>{
      console.log(res)
      if(!res.error){
        document.getElementById('dismiss-refund-mode-popups-return').click();
        document.getElementById('dismiss_bank_detail_popup').click();
        Swal.fire({
          icon: 'success',
          title: 'Product return request submitted successfully',
          text: 'Your refund will be initiate to your bank a/c within 5 - 6 working days'
          }).then(()=>{
            this._router.navigate(['/dashboard-order-details/order-list']);
        });
       
      }
      else{
        Swal.fire({
          icon: 'warning',
          title: res.message,
          });
      }
    });
  }


  submitBankDetails(){
    if(this.bankForm.invalid){
      return;
    }

    this.returnProductBank();
  }



  checkIFSCCode(e){
    // let val=  e;
    // let regExp = "^[A-Z]{4}[0][A-Z0-9]{6}$";
    // let  isvalid = false;

    // if (val.length() > 0) {
    //     isvalid = val.matches(regExp);
    // }
    // return isvalid;
  }
}


