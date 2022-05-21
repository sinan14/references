import { Component, OnInit, ViewEncapsulation, ViewChild  } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { SharedServiceService } from '../../../shared-service.service'
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-total-subscriptions',
  templateUrl: './total-subscriptions.component.html',
  styleUrls: ['./total-subscriptions.component.scss']
})
export class TotalSubscriptionsComponent implements OnInit {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;


  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if ((element.nodeName === 'TD' || element.nodeName === 'TH')
            && element.offsetWidth < element.scrollWidth) {
        this.tooltipDir.toggle(element);
    } else {
        this.tooltipDir.hide();
    }
}

  
  public closeResult: string;
  public accountForm: FormGroup;
  public permissionForm: FormGroup;

  public media = []

  public medicineFlag :boolean = false;


  public formArray = [{
    slno : "",
    prodId:"",
    hsn : "",
    sku : "",
    items : "",
    uom : "",
    productDropdownList : [],
    uomDropdownList : [],
    quantity : "1",
    price : "",
    specialPrice : "",
    amount : "",
    total : 0,
    type : "",
  }];

  public userDetails : any ;
  public subscriptionList :any = [];
  public subscriptionID :any = '';
  public remarks :any = '';
  public attemptSubmitted :boolean = false;
  public single_subscriptionList :any = [];
  public productList :any = [];
  public CurrentPage: any
  public PageSize: any
  public TotalRecords: any

  public current_page: any;
  public total_page: any;
  public hasNextPage: boolean
  public hasPrevPage: boolean
  public pagingCounter: 1
  public totalPages: any;

  
  public current_page1: any;
  public total_page1: any;
  public hasNextPage1: boolean
  public hasPrevPage1: boolean
  public pagingCounter1: 1
  public totalPages1: any;

  
  public current_page2: any;
  public total_page2: any;
  public hasNextPage2: boolean
  public hasPrevPage2: boolean
  public pagingCounter2: 1
  public totalPages2: any;

  
  public current_page3: any;
  public total_page3: any;
  public hasNextPage3: boolean
  public hasPrevPage3: boolean
  public pagingCounter3: 1
  public totalPages3: any;

  public current_page4: any;
  public total_page4: any;
  public hasNextPage4: boolean
  public hasPrevPage4: boolean
  public pagingCounter4: 1
  public totalPages4: any;

  
  public productDropdownList :any = [];
  public uomDropdownList :any = [];

  public awaitedPaymentList :any  = [];
  public inactiveSubscriptionList :any  = [];
  public activeSubscriptionList :any  = [];
  public convertedOrderSubscriptionList :any  = [];
  public finalAmount: any = 0;
  public medcoinValue :any = 0;
  public couponCode :any = '';
  public couponValue :any = 0;
  public medicine_Count = 0;
  public healthcare_Count = 0;
  public active_subscription_count = 0;
  public inactive_subscription_count = 0;

  public selectedTab :any = '';

  public maxMedcoinUse : any = 0 ;
  public minFreeDeliveryAmount :any = 0;
  public minPurchaseAmount :any = 0;
  
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _Shared_Service:SharedServiceService,
    private _subscriptionService : SubscriptionsService) {
    this.media = mediaDB.data;
  }

  ngOnInit(): void {

    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.formArray.push({ 
    slno : "",
    prodId:"",
    hsn : "",
    sku : "",
    items : "",
    uom : "",
    productDropdownList : [],
    uomDropdownList : [],
    quantity : "1",
    price : "",
    specialPrice : "",
    amount : "",
    total : 0,
    type : "",});

    let input ={
      page :1
    }

    this.get_subscription_count();
    this.getSubscriptionList(input);
    this.getAwaitedPaymentList(input);
    this.getinactiveSubscriptionsList(input);
    this.getactiveSubscriptionsList(input);
    this.getConvertedOrderSubscriptionsList(input)

    this.getProductList();
  }

  autoselectedTab(type){
    if(type === 'active'){
      this.selectedTab = 'tab4';
    }
    else if(type === 'inactive'){
      this.selectedTab = 'tab5';
    }
  }

  get_subscription_count(){
    this._subscriptionService.get_subscriptions_count().subscribe((res:any)=>{
      if(!res.error){
        this.active_subscription_count = res.data.activeSubscriptions;
        this.inactive_subscription_count = res.data.inactiveSubscriptions;
      }
    })
  }

  getSubscriptionList(input:any){
   
    this._subscriptionService.get_subscriptions(input).subscribe((res:any)=>{
      console.log(res)
      this.subscriptionList = res.data.subscriptions;

    
      this.current_page = res.data.pageDetails.currentPage
      this.total_page = res.data.pageDetails.totalPages
      this.hasNextPage = res.data.pageDetails.hasNextPage
      this.hasPrevPage = res.data.pageDetails.hasPrevPage

      this.maxMedcoinUse = res.data.masterPreference.maxMedcoinUse;
      this.minFreeDeliveryAmount = res.data.masterPreference.minFreeDeliveryAmount;
      this.minPurchaseAmount = res.data.masterPreference.minPurchaseAmount;
    })
  }

  getAwaitedPaymentList(input:any){
   
    this._subscriptionService.get_payment_awaited_subscriptions(input).subscribe((res:any)=>{
      this.awaitedPaymentList = res.data.subscriptions;

      this.current_page1 = res.data.pageDetails.currentPage
      this.total_page1 = res.data.pageDetails.totalPages
      this.hasNextPage1 = res.data.pageDetails.hasNextPage
      this.hasPrevPage1 = res.data.pageDetails.hasPrevPage
    })
  }

  getConvertedOrderSubscriptionsList(input:any){
   
    this._subscriptionService.get_converted_subscriptions(input).subscribe((res:any)=>{
      this.convertedOrderSubscriptionList = res.data.subscriptions;

      this.current_page2 = res.data.pageDetails.currentPage
      this.total_page2 = res.data.pageDetails.totalPages
      this.hasNextPage2 = res.data.pageDetails.hasNextPage
      this.hasPrevPage2 = res.data.pageDetails.hasPrevPage
    })
  }


  getactiveSubscriptionsList(input:any){
   
    this._subscriptionService.get_active_subscriptions(input).subscribe((res:any)=>{
      this.activeSubscriptionList = res.data.subscriptions;


      this.current_page3 = res.data.pageDetails.currentPage
      this.total_page3 = res.data.pageDetails.totalPages
      this.hasNextPage3 = res.data.pageDetails.hasNextPage
      this.hasPrevPage3 = res.data.pageDetails.hasPrevPage

     
    })
  }

  
  getinactiveSubscriptionsList(input:any){
   
    this._subscriptionService.get_inactive_subscriptions(input).subscribe((res:any)=>{
      this.inactiveSubscriptionList = res.data.subscriptions;

      this.current_page4 = res.data.pageDetails.currentPage
      this.total_page4 = res.data.pageDetails.totalPages
      this.hasNextPage4 = res.data.pageDetails.hasNextPage
      this.hasPrevPage4 = res.data.pageDetails.hasPrevPage
    })
  }

  
 

  getProductList(){
    let input = {
      keyword: '',
      page: 1,
      limit: 100
    }
    this._subscriptionService.search_products(input).subscribe((res:any)=>{
      //this.productDropdownList = res.data.result
    })
  }

 
  onPageChange(pageNO,tab) {
    let data ={
      page :pageNO
    }
    if(tab ==='tab1'){
      this.getSubscriptionList(data)
    }
    else if(tab ==='tab2'){
      this.getAwaitedPaymentList(data)
    }
    else if(tab ==='tab3'){
      this.getConvertedOrderSubscriptionsList(data)
    }
    else if(tab ==='tab4'){
      this.getactiveSubscriptionsList(data)
    }
    else if(tab ==='tab5'){
      this.getinactiveSubscriptionsList(data)
    }
  }

  Search_Medicine(value,i) {
    console.log(value);
    let body = {
      allProducts:true,
      keyword: value,
      page: 1,
      limit: 100
    }
    this._subscriptionService.search_products(body).subscribe((res: any) => {
      this.productDropdownList = res.data.result;

      let list :any =[];
      list = res.data.result.forEach((pres :any,ind:any) => {
        this.formArray.forEach((element :any,index:any) => {
          if(pres.product_id != element.prodid){
            return pres;
          }
        });
      });

      console.log(list);
      
      this.formArray[i].productDropdownList = this.productDropdownList;
      // this.form
    })
  }

  
  open(content,data:any) {
    if(data){
      this.productDropdownList = [];
      this.single_subscriptionList = data;
      this.formArray =  this.single_subscriptionList.products.map((prod:any,index)=>{
        
        this.couponCode =  this.single_subscriptionList.couponCode!=null ? this.single_subscriptionList.couponCode : '';
        this.medcoinValue = this.single_subscriptionList.medCoinCount===0 || this.single_subscriptionList.medCoinCount===null ? 0 :  this.single_subscriptionList.medCoinCount;
        if(prod.type=== 'healthcare'){
          this.healthcare_Count++;
        }
        else{
          this.medicine_Count++;
        }
        this.finalAmount =  this.single_subscriptionList.amount;
        let t ={
          uomValue : prod.uomValue,
          variantId : prod.variantId,
          specialPrice : prod.specialPrice,
          skuOrHsnNo : prod.skuOrHsnNo,
        }
        this.uomDropdownList.push(t);

        let p ={
          productName : prod.productName,
          product_id : prod.product_id,
        }
        this.productDropdownList.push(p);

        return {
          slno : index+1,
          prodid : prod.product_id,
          hsn : prod.skuOrHsnNo,
          sku : prod.uomValue,
          items : prod.product_id,
          uom : prod.variantId,
          productDropdownList : this.productDropdownList,
          uomDropdownList : this.uomDropdownList,
          quantity : prod.quantity,
          price :prod.price,
          specialPrice :prod.specialPrice,
          amount : prod.specialPrice,
          total :prod.specialPrice * prod.quantity,
          type : prod.type
        }

      })
    }
  
   
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  selectProductDropdown(event:any , index, data){
    //alert(event)
    let  flag :boolean = false;

    this.productDropdownList.filter((prod:any)=>{
      if(prod.product_id === event){
        console.log(prod);
        this.formArray[index].uomDropdownList = prod.variants;
        this.formArray[index].uom = '';
      }
    })

    // this.formArray.filter((t:any)=> {
    //   if(t.prodid === event){
    //     flag = true;
       
    //     this.formArray[index].productDropdownList = [];
    //     this.formArray[index].items = '';
    //     console.log(this.formArray)
    //     return;
    //   }
    // })


    

    // if(flag ===false){
    //   this.productDropdownList.filter((prod:any)=>{
    //     if(prod.product_id === event){
    //       console.log(prod);
    //       this.formArray[index].uomDropdownList = prod.variants;
    //       this.formArray[index].uom = '';
    //     }
    //   })
    // }
    // else{
    //   this.formArray[index].productDropdownList = [];
    //   this.formArray[index].items = '';
    //   console.log(this.formArray)
    //   Swal.fire({
    //     text: 'Prodcut already added',
    //     icon: 'warning',
    //     showCancelButton: false,
    //     confirmButtonText: 'Ok',
    //     confirmButtonColor:  '#3085d6',
    //     imageHeight: 50,
    //   });
    // }
    
  }

  selectUOMValue(event:any,index,i){
    console.log(index)
    this.formArray[i].uom = '';
    let  flag :boolean = false;

     this.formArray.filter((t:any)=> {
      if(t.uom === event.target.value){
        flag = true;
       
        //this.formArray[i].uomDropdownList = [];
        this.formArray[i].uom = '';
        console.log(this.formArray)
        return;
      }
    })

      if(flag ===false){
          index.uomDropdownList.filter((t:any)=>{
            if(t.variantId === event.target.value){
              this.formArray[i].uom = t.variantId;
              this.formArray[i].amount = t.specialPrice;
              this.formArray[i].hsn = t.skuOrHsnNo;
              this.formArray[i].total = parseInt(this.formArray[i].amount) * parseInt(this.formArray[i].quantity);
            }
          })
      
          let total = 0;
          for(let k=0;k< this.formArray.length;k++){
            total  = total + this.formArray[k].total;
          }
          this.single_subscriptionList.amount = total;
          this.finalAmount = this.single_subscriptionList.amount;
      }
      else{
        //this.formArray[i].uomDropdownList = [];
        this.formArray[i].uom = '';
        console.log(this.formArray)
        Swal.fire({
          text: 'Prodcut already added',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
      }


   
  }

  changeQuantity(event:any,index,i){

    if(event.target.value>0){
      let total = 0;
      this.formArray[i].total = index.amount * event.target.value;
      for(let k=0;k< this.formArray.length;k++){
        total  = total + this.formArray[k].total;
      }
      this.single_subscriptionList.amount = total;
      // this.single_subscriptionList.amount += index.amount * event.target.value;
      this.finalAmount = this.single_subscriptionList.amount;
    }
    else{
      this.formArray[i].quantity = '1';
      Swal.fire({
        text: 'Quantity should be greater than 0!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 50,
      });
    }
  }

  openList(content ,list:any) {
    this.productList = list;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  openRemarks(content ,id:any,remarks:any) {
    this.subscriptionID = id;
    this.remarks = remarks ? remarks : '';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      this.remarks = '';
      return `with: ${reason}`;
    }
  }

  addForm(){

    
    let body = {
      allProducts:true,
      keyword: '',
      page: 1,
      limit: 100
    }

    this._subscriptionService.search_products(body).subscribe((res: any) => {
      this.productDropdownList = res.data.result;

      let list :any =[];
      list = res.data.result.forEach((pres :any,ind:any) => {
        this.formArray.forEach((element :any,index:any) => {
          if(pres.product_id != element.prodid){
            return pres;
          }
        });
      });

      
      // this.form

      this.formArray.push({ 
        slno : "",
        prodId:"",
        hsn : "",
        sku : "",
        items : "",
        uom : "",
        productDropdownList : res.data.result,
        uomDropdownList : [],
        quantity : "1",
        price : "",
        specialPrice : "",
        amount : "",
        total : 0,
        type : "",});

    })

    
  }
  removeForm(id){
    this.formArray.splice(id, 1);
    let total = 0;
    for(let k=0;k< this.formArray.length;k++){
      total  = total + this.formArray[k].total;
    }
    this.single_subscriptionList.amount = total;
    // this.single_subscriptionList.amount += index.amount * event.target.value;
    this.finalAmount = this.single_subscriptionList.amount;
  }

  trackByFn(index: any) {
    return index;
  }
  

  getmaskPhoneNumber(number:string){
    let num = this._Shared_Service.numberMasking(number);
    return num;
  }



  saveRemarks(){
    if(this.remarks ==''){
      Swal.fire({
        text: 'Please add your remarks',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 50,
      });
      return;
    }
    let input = {
      "subscriptionId":this.subscriptionID,
      "remarks":this.remarks
    }

    this._subscriptionService.add_remark(input).subscribe((res:any)=>{
      console.log(res);
      if(!res.error){
        Swal.fire({
          text: res.message,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
        this.ngOnInit();
        this.modalService.dismissAll();
      }
    })
  }

  inActiveSubscription(id:any){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor:  '#3085d6',
      cancelButtonColor:'#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {

        let input ={
          "subscriptionId":id
        }
    
        this._subscriptionService.activeate_inactivate_subscription(input).subscribe((res:any)=>{
          if(!res.error){
            Swal.fire({
              text: res.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.ngOnInit();
            this.modalService.dismissAll();
          }
        })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


   
  }

  covert_cod_to_online_payment(id:any){

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change the payment mode?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor:  '#3085d6',
      cancelButtonColor:'#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {

        let input ={
          "subscriptionId":id
        }
    
        this._subscriptionService.send_payment_link(input).subscribe((res:any)=>{
          if(!res.error){
            Swal.fire({
              text: 'Payment mode converted successfully',
              titleText: 'Payment link sended successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.ngOnInit();
            this.modalService.dismissAll();
          }
          else{
            Swal.fire({
              text: res.message,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
          }
        })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


  
  }

  sendPaymentLink(id:any){

    Swal.fire({
      title: 'Are you sure?',
      text: 'Payment link is send to this customer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor:  '#3085d6',
      cancelButtonColor:'#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {

        let input ={
          "subscriptionId":id
        }
    
        this._subscriptionService.send_payment_link(input).subscribe((res:any)=>{
          if(!res.error){
            Swal.fire({
              text: 'Payment link sended successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.ngOnInit();
            this.modalService.dismissAll();
          }
          else{
            Swal.fire({
              text: res.message,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
          }
        })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


  
  }

  confirmSubscription(){

    if(this.formArray.length===0){
      Swal.fire({
        text: 'Please add atleast one product',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 50,
      });
    }

    else{
      let productlist:any = [];
      productlist = this.formArray.map((res:any)=>{
        return {
          product_id : res.items,
          variantId : res.uom,
          quantity : res.quantity
        }
      })
  
      let input = {
        userId :  this.single_subscriptionList.userId,
        subscriptionId : this.single_subscriptionList.subscriptionId,
        products : productlist,
        couponCode: this.couponCode==='' ? null : this.couponCode,
        medCoinCount: this.medcoinValue,
      }
  
      this._subscriptionService.update_user_subscription(input).subscribe((res:any)=>{
        if(!res.error){
          Swal.fire({
            text: res.message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
          });
          this.ngOnInit();
          this.modalService.dismissAll();
        }
        else{
          Swal.fire({
            text: res.message,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
          });
        }
      })
    }
   

  }


  move_to_prescription_awaited(id){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor:  '#3085d6',
      cancelButtonColor:'#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {

        let input ={
          "subscriptionId":id
        }
    
        this._subscriptionService.move_subscription_to_prescription_awaited(input).subscribe((res:any)=>{
          console.log(res)
          if(!res.error){
            Swal.fire({
              text: 'Payment mode converted successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.ngOnInit();
            this.modalService.dismissAll();
          }
          else{
            Swal.fire({
              text: res.message,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

   
  }


  move_to_review_pending(id){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor:  '#3085d6',
      cancelButtonColor:'#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {

        let input ={
          "subscriptionId":id
        }
    
        this._subscriptionService.move_subscription_to_review_pending(input).subscribe((res:any)=>{
          if(!res.error){
            Swal.fire({
              text: res.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.ngOnInit();
          }
          else{
            Swal.fire({
              text: res.message,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


  
  }


  move_to_packing_pending(id){


    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor:  '#3085d6',
      cancelButtonColor:'#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {

        let input ={
          "subscriptionId":id
        }
    
        this._subscriptionService.move_subscription_to_packing_pending(input).subscribe((res:any)=>{
          if(!res.error){
            Swal.fire({
              text: res.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.ngOnInit();
          }
          else{
            Swal.fire({
              text: res.message,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


   
  }


  changeMedcoinValue(event:any){
    this.medcoinValue = event.target.value;
  }
  applyMedcoinValue(){
    if(this.medcoinValue!=0){
      if(this.medcoinValue<this.maxMedcoinUse){
        this.finalAmount -= parseInt(this.medcoinValue) ;
      }
      else{
        Swal.fire({
          text:  'Maximum medcoin value is '+ this.maxMedcoinUse,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
      }
    }
    else{
      Swal.fire({
        text:  'Please add a medcoin value',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 50,
      });
    }
   
    
  }

  removeMedcoinValue(){
    if(this.single_subscriptionList.medCoinCount!=null){
      this.finalAmount -= parseInt(this.medcoinValue) ;
      this.medcoinValue = 0;
    }
    else{
      this.finalAmount = this.single_subscriptionList.amount;
      this.medcoinValue = 0;
    }
  }


  changePromocodeValue(event:any){
    this.couponCode = event.target.value;
  }


  applyPromocode(){
    let input = {
      couponCode : this.couponCode
    }

    this._subscriptionService.get_discount_amount_of_coupon_code(input).subscribe((res:any)=>{
      console.log(res);
      if(!res.error){

        let flag1,flag2, flag3 ,flag4, flag5, flag6 : boolean = false;
        let couponType = res.data.coupon.category;
          //Purchase amount

          if(this.single_subscriptionList.amount>res.data.coupon.purchaseAmount){
            flag1 = true;
          }
          else{
            Swal.fire({
              text: 'Minimum purchase amount is '+res.data.coupon.purchaseAmount,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
          }
          // check Maximum user used
          if(res.data.coupon.totalTimesUsed <= res.data.coupon.maximumUser){
            flag2 = true;
          }
          else{
            Swal.fire({
              text: 'Not applicable',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
          }

          //type checking
          // if(res.data.coupon.type==="Medimall"){
          //   flag3 = true;
          // }
          // else{
          //   Swal.fire({
          //     text: 'Not applicable',
          //     icon: 'warning',
          //     showCancelButton: false,
          //     confirmButtonText: 'Ok',
          //     confirmButtonColor:  '#3085d6',
          //     imageHeight: 50,
          //   });
          // }


          //healthcare or medicine count checking

          if(res.data.coupon.category === 'healthcare'){
            if(this.healthcare_Count>0){
              flag4 = true;
            }
            else{
              Swal.fire({
                text: 'Not applicable',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor:  '#3085d6',
                imageHeight: 50,
              });
            }
          }
          else{
            if(this.medicine_Count>0){
              flag4 = true;
            }
            else{
              Swal.fire({
                text: 'Not applicable',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor:  '#3085d6',
                imageHeight: 50,
              });
            }
          }

      


          // this.calculateCouponAmount(res.data.coupon.maximumAmount, res.data.coupon.percentage,couponType)
          if(flag1 == true && flag2 === true  && flag4 == true){
              this.calculateCouponAmount(res.data.coupon.maximumAmount, res.data.coupon.percentage,couponType)
          }
       
      }
      else{
        this.couponCode = '';
        Swal.fire({
          text: res.message,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
      }
    })
  }

  removePromocode(){

    if(this.single_subscriptionList.couponCode!=null){
      this.couponCode = '';
      this.finalAmount -= this.couponValue
      this.couponValue = 0;
    }
    else{
      this.couponCode = '';
      this.finalAmount  = this.single_subscriptionList.amount;
      this.couponValue = 0;
    }
  }

  calculateCouponAmount(maximum_amount,percentage,couponType){
    let percentage_amount :any;
    let totalAmount  = 0;
    let discountAmount  = 0;

    this.formArray.map((res:any,index:any)=>{
      if(couponType === res.type){
        totalAmount +=  ( (parseInt(this.formArray[index].specialPrice)  * parseInt(this.formArray[index].quantity) ) *  (10/100) );
      }
    })


    if(totalAmount<maximum_amount){
      this.couponValue = totalAmount;
      this.finalAmount -= this.couponValue;
    }
    else{
      this.couponValue = maximum_amount;
      this.finalAmount -= this.couponValue;
    }

  }
}
