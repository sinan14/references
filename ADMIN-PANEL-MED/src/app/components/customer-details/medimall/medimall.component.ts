import { Component, OnInit ,Input} from '@angular/core';
import { productDB } from 'src/app/shared/tables/product-list';
import { ListViewDataResult, PageChangeEvent } from '@progress/kendo-angular-listview';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MedimallService } from '../../../services/medimall.service';
import Swal from 'sweetalert2';
import { FormGroup,FormBuilder,Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medimall',
  templateUrl: './medimall.component.html',
  styleUrls: ['./medimall.component.scss']
})
export class MedimallComponent implements OnInit {
  productList:any
  productPricing:any
  productListName:any
  productItem:any
  productItemImage:any
  productItemVariantId:any
  productItemQuantity:any
  productPrice:any
  productImage:any;
  public indexId:any;

  public addressFlag : boolean = false;
  public attemptedSubmit :any;
  public addressForm:FormGroup;

  public userId :any = '';
  public prescriptionImageURLArray :any = [];
  public imageLoading :boolean = false;


  //Cart Varibales

  public cartList :any = [];
  public cartDetails :any = [];
  public addressDetails :any = '';
  public appliedCoupon :any = '';
  public medcoinAmountValue :any = '';
  public couponValue :any = '';
  public variantId :any = '';

  public couponCode :any = '';

  @Input() public product: {
    product_title: string;
    tag: string;
    price: number;
 
  };


  states: any = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Orissa',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];



  phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  
  public product_list = [];
  constructor(private _router: Router,
    private modalService: NgbModal,
    private medi:MedimallService,
    public _activateRouter  :ActivatedRoute,
    private _formBuilder:FormBuilder,) { 

      this.addressForm = this._formBuilder.group({
        name: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.pattern(this.phoneReg)]],
        pincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
        house: ['', [Validators.required]],
        landmark: ['', [Validators.required]],
        street: ['', [Validators.required]],
        type: ['home', [Validators.required]],
        state: ['', Validators.required],
      })
    
    //this.product_list = productDB.product;
    
  }

  ngOnInit(): void {
    

    this._activateRouter.paramMap.subscribe((res: any) => {
      this.userId = res.get('cust_id');
      console.log(this.userId)
    });

    this.get_cart_details();

  }

  addAddress(){
    this.addressFlag = !this.addressFlag;
  }


  get_cart_details(){
    let input = {
      userId : this.userId
    }

    this.medi.get_cart_details(input).subscribe((res:any)=>{
      if(!res.error){
        console.log(res);
        this.cartList = res.data[0].medCart.products;
        this.cartDetails = res.data[0].medCart.cartDetails;


        this.medcoinAmountValue = res.data[0].medCart.cartDetails.medCoinRedeemed;

        if (Object.keys(res.data[0].medCart.address).length === 0 && res.data[0].medCart.address.constructor === Object) {
          this.addressDetails = '';
        }
        else {
          this.addressDetails = res.data[0].medCart.address;
        }

         //check whether coupon applied or not
         if (Object.keys(res.data[0].medCart.userAppliedCoupon).length === 0 && res.data[0].medCart.userAppliedCoupon.constructor === Object) {
          this.appliedCoupon = '';
        }
        else {
          this.appliedCoupon = res.data[0].medCart.userAppliedCoupon;
          this.couponCode = res.data[0].medCart.userAppliedCoupon.code;
        }

      }
    })
  }


  public closeResult: string;
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;

  open(content,Value:any) {
    if(Value === 'add'){
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if(Value === 'edit'){
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }


    else if(Value === ''){
      this.update_Modal_Flag = false;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    
  }
  


 
  public handleFilterChange(query: string): void {
    
    //console.log(query)
  
    const normalizedQuery = query.toLowerCase();
    const filterExpession = (item:any) =>
      item.product_title.toLowerCase().indexOf(normalizedQuery) !== -1 ||
      item.tag.toLowerCase().indexOf(normalizedQuery) !== -1;

    let data = this.product_list.filter(filterExpession);
    this.product_list  = data;
  }
  Searching(e){
    if(e.key=='Enter'){
      let searchWord=e.target.value
      this.medi.searchProduct(searchWord,this.userId).subscribe(res=>{
      this.productList=res.data.result;
      this.productPrice=res.data.result.pricing
      this.productItem=this.productList.map(items=>items.pricing[0].specialPrice)
     console.log(this.productList)
     this.productItemImage=this.productList.map(items=>items.pricing[0].image)
     this.productItemVariantId=this.productList.map(items=>items.pricing[0].variantId)
     this.productItemQuantity =this.productList.map(items=>items.pricing[0].quantity)
   
      })
    }
    
  }
  skuClick(event,data:any,index:number){
    let i = event.target.value ;
    //console.log(JSON.stringify(index))
      if(i==0){
        this.productList[index].pricing[0].specialPrice=this.productItem[index];
        this.productList[index].pricing[0].price=this.productItem[index]
        this.productList[index].pricing[0].image=this.productItemImage[index]
        this.productList[index].pricing[0].variantId=this.productItemVariantId[index];
        this.productList[index].pricing[0].quantity=this.productItemQuantity[index];
      }   
    
      this.productList[index].pricing[0].specialPrice=data.pricing[i].specialPrice;
      this.productList[index].pricing[0].quantity=data.pricing[i].quantity;
      this.productList[index].pricing[0].image=data.pricing[i].image;
      this.productList[index].pricing[0].price=data.pricing[i].price;
      this.productList[index].pricing[0].variantId=data.pricing[i].variantId;
  }


  //cart 

  add_to_Cart(prodId,varId,qty){

    this.variantId = varId;
    let input ={
      "userId": this.userId,
      "product_id": prodId,
      "variantId": varId,
      "quantity": qty
    } 


    this.medi.add_to_cart(input).subscribe((res:any)=>{
      if(!res.error){
        Swal.fire({
          text: res.message,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        }).then(()=>{
          this.get_cart_details();
        });
      }
      else{
        Swal.fire({
          text: res.message,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        })
      }
    })

  }

  updateQuantity(event,prodId,VarId,cartId){
    if(cartId===null){
      this.add_to_Cart(prodId,VarId,parseInt(event.target.value));
    }
    else{
      let input ={
        "userId": this.userId,
        "cartId": cartId,
        "quantity": event.target.value
      }
  
      console.log(input)
      this.medi.update_cart(input).subscribe((res:any)=>{
        if(!res.error){
          Swal.fire({
            text: res.message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 500,
          }).then(()=>{
            this.get_cart_details();
          });
        }
      })
    }
  }


  update_Cart(event,cartId){
    let input ={
      "userId": this.userId,
      "cartId": cartId,
      "quantity": event.target.value
    }

    console.log(input)
    this.medi.update_cart(input).subscribe((res:any)=>{
      if(!res.error){
        Swal.fire({
          text: res.message,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        }).then(()=>{
          this.get_cart_details();
        });
      }
    })

  }

  remove_from_cart(id){
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
          let input = {
            "userId": this.userId,
           "cartId": id
        }
          this.medi.remove_from_cart(input).subscribe((res: any) => {
            console.log(res);
            Swal.fire({
              title: '<h4 class="suc">Product Removed</h4>',
              icon: 'success',
    
              showCloseButton: true,
              // showCancelButton: true,
              // focusConfirm: false,
              confirmButtonText: 'ok',
              confirmButtonColor: '#00aaff',
              confirmButtonAriaLabel: 'Thumbs up, great!',
              // cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
              // cancelButtonAriaLabel: 'Thumbs down',
            })
            this.get_cart_details();
          },
            error => {
              console.error('There was an error!', error.message);
            })


      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  changeCouponValue(event){
    this.couponCode = event.target.value;
  }


  applyCoupon(){
    if(this.medcoinAmountValue!=0){
      Swal.fire({
        title: 'Are you sure?',
        text: 'Applied medcoin will be removed after applying this !!!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, keep it',
        confirmButtonColor:  '#3085d6',
        cancelButtonColor:'#3085d6',
        imageHeight: 50,
      }).then((result) => {
        if (result.value) {


          let pt = {
            "userId":this.userId,
            "medCoinCount":0
          }
          this.medi.update_medcoin(pt).subscribe((res:any)=>{
              let input = {
                "userId": this.userId,
                "couponCode": this.couponCode,
                "couponType":"medimall"
              }
              this.medi.apply_coupon_to_cart(input).subscribe((res: any) => {
                console.log(res);
                this.get_cart_details();
                this.couponCode='';
              })
          })

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          document.getElementById('dismiss-coupon-form').click();
        }
      });
  
    }
    else{
        
      let input = {
        "userId": this.userId,
        "couponCode": this.couponCode,
        "couponType":"medimall"
      }
      this.medi.apply_coupon_to_cart(input).subscribe((res: any) => {
        console.log(res);
        Swal.fire({
          text: res.message,
          icon: 'success',
          showCloseButton: true,
          confirmButtonText: 'ok',
          confirmButtonColor: '#00aaff',
          confirmButtonAriaLabel: 'Thumbs up, great!',
        }).then(()=>{
          this.get_cart_details();
        })
      })
    }
  }

  removeCoupon(){
    let input = {
      "userId": this.userId,
      "couponId": this.appliedCoupon.couponId
    }

    this.medi.remove_coupon_from_cart(input).subscribe((res:any)=>{
      console.log(res);
      if(!res.error){
        Swal.fire({
          text: res.message,
          icon: 'success',
          showCloseButton: true,
          confirmButtonText: 'ok',
          confirmButtonColor: '#00aaff',
          confirmButtonAriaLabel: 'Thumbs up, great!',
        }).then(()=>{
          this.get_cart_details();
          this.couponCode = '';
        })
      }
    })
  }


  updateMedcoin(event){

    if(this.couponCode!=''){
      Swal.fire({
        title: 'Are you sure?',
        text: 'Applied coupon will be removed after applying this !!!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, keep it',
        confirmButtonColor:  '#3085d6',
        cancelButtonColor:'#3085d6',
        imageHeight: 50,
      }).then((result) => {
        if (result.value) {


          let input = {
            "userId": this.userId,
            "couponId": this.appliedCoupon.couponId
          }
          this.medi.remove_coupon_from_cart(input).subscribe((p: any) => {
              console.log(p)
                let input = {
                  "userId":this.userId,
                  "medCoinCount":event.target.value
                }
                this.medi.update_medcoin(input).subscribe((res:any)=>{
                  if(!res.error){
                    Swal.fire({
                      text: res.message,
                      icon: 'success',
                      showCloseButton: true,
                      confirmButtonText: 'ok',
                      confirmButtonColor: '#00aaff',
                      confirmButtonAriaLabel: 'Thumbs up, great!',
                    }).then(()=>{
                      this.get_cart_details();
                    })
                  }
                  else{
                    if(!res.error){
                      Swal.fire({
                        text: res.message,
                        icon: 'warning',
                        showCloseButton: true,
                        confirmButtonText: 'ok',
                        confirmButtonColor: '#00aaff',
                        confirmButtonAriaLabel: 'Thumbs up, great!',
                      }).then(()=>{
                        this.get_cart_details();
                      })
                    }
                  }
                })
          })

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          document.getElementById('dismiss-coupon-form').click();
        }
      });
  
    }
    else{
        
      let input = {
        "userId":this.userId,
        "medCoinCount":event.target.value
      }
      this.medi.update_medcoin(input).subscribe((res:any)=>{
        if(!res.error){
          Swal.fire({
            text: res.message,
            icon: 'success',
            showCloseButton: true,
            confirmButtonText: 'ok',
            confirmButtonColor: '#00aaff',
            confirmButtonAriaLabel: 'Thumbs up, great!',
          }).then(()=>{
            this.get_cart_details();
          })
        }
        else{
          if(!res.error){
            Swal.fire({
              text: res.message,
              icon: 'warning',
              showCloseButton: true,
              confirmButtonText: 'ok',
              confirmButtonColor: '#00aaff',
              confirmButtonAriaLabel: 'Thumbs up, great!',
            }).then(()=>{
              this.get_cart_details();
            })
          }
        }
      })
    }

   
  }

  saveAddress(){
    if(this.addressForm.invalid){
      return;
    }

    console.log(this.addressForm.value);

    let data = {
        "userId": this.userId,
        "house": this.addressForm.get('house').value,
        "landmark": this.addressForm.get('landmark').value,
        "mobile": this.addressForm.get('mobile').value,
        "name": this.addressForm.get('name').value,
        "pincode": this.addressForm.get('pincode').value,
        "state": this.addressForm.get('state').value,
        "street": this.addressForm.get('street').value,
        "type": this.addressForm.get('type').value,
    }

    this.medi.add_address(data).subscribe((res:any)=>{
      if(!res.error){
        Swal.fire({
          text: res.message,
          icon: 'success',
          showCloseButton: true,
          confirmButtonText: 'ok',
          confirmButtonColor: '#00aaff',
          confirmButtonAriaLabel: 'Thumbs up, great!',
        }).then(()=>{
          this.get_cart_details();
          this.addressFlag = false;
          this.addressForm.reset();
        })
      }
    })
  }

  uploadPrescription(event:any){
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    this.imageLoading = true;

    Img.onload = (e: any) => {
      let content = reader.result as string;
      let presPath = content;


      const formData = new FormData();
      formData.append('prescription',file);
      
      this.medi.upload_image(formData).subscribe((res:any)=>{
        console.log(res);
            if(!res.error){
              this.prescriptionImageURLArray.push(res.data.images[0]);
              this.imageLoading = false;
              console.log(this.prescriptionImageURLArray)
            }
            else{
              this.imageLoading = false;
              Swal.fire({
              icon: 'warning',
              title: res.message,
              });
            }
          })

    };
  }

  savePrescription(){
    console.log(this.prescriptionImageURLArray);

    let data ={
      userId : this.userId,
      prescription : this.prescriptionImageURLArray
    }

    this.medi.upload_prescription(data).subscribe((res:any)=>{
      if(!res.error){
        Swal.fire({
          icon: 'success',
          title: res.message,
        }).then(()=>{
          this.modalService.dismissAll();
          this.prescriptionImageURLArray= [];
        });
      }
      else{
        Swal.fire({
          icon: 'warning',
          title: res.message,
        });
      }
    })
  }

  removePrescription(index){
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

        let data:any = [];
        data = this.prescriptionImageURLArray.filter((res:any)=>res != index);
        this.prescriptionImageURLArray = data;
        let input={
          prescription : this.prescriptionImageURLArray
        }
        this.medi.upload_prescription(input).subscribe((res:any)=>{
          console.log(res);
              if(!res.error){
                this.get_cart_details();
                Swal.fire({
                  icon: 'success',
                  title: res.message,
                });
                // document.getElementById('dismiss-upload-prescription').click()
              }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


  }



  convertToCodeOrder(){
    let input ={
      userId : this.userId
    }

    this.medi.convert_to_cod_order(input).subscribe((res:any)=>{
      if(!res.error){
        Swal.fire({
          icon: 'success',
          text: res.message,
        });
      }
      else{
        Swal.fire({
          icon: 'warning',
          text: res.message,
        });
      }
    })
  }

  sendPaymentLink(){
    let input ={
      userId : this.userId
    }

    this.medi.sendPaymentLink(input).subscribe((res:any)=>{
      if(!res.error){
        Swal.fire({
          icon: 'success',
          text: res.message,
        });
      }
      else{
        Swal.fire({
          icon: 'warning',
          text: res.message,
        });
      }
    })
  }
 
}
