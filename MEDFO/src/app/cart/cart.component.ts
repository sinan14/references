import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NewCartService } from 'src/app/services/new-cart.service';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { Router } from '@angular/router';
import { HealthVaultService } from '../services/health-vault.service';
import { LandingService } from 'src/app/services/landing.service';
import { Title, Meta } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject, Observable} from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  title = 'Cart'

  //Camera Settings
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  public cameraFlag :boolean = false; 
  public showWebcam = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  public errors: WebcamInitError[] = [];

  public imageLoading :boolean = false;
  public containGuidFlag :boolean = false;
  public containFlag :boolean = false;
  public prescriptionCartList :any = [];
  public prescriptionEnable :boolean;
  public prescription_id:any;
  public prescriptionHealthDataURLArray :any = [];
  public prescriptionImageURLArray :any = [];
  public prescriptionImageFileArray :any = [];

  public prescriptionImageURL:any = '';
  public wishListCount = 0;
  public prescriptionProvidedFlag :boolean ;
  public prescription_upload_flag: boolean = true;
  public totalPrescriptionCount: any = 0;
  public couponCode: any = '';
  public availableCoupon: any = [];
  public quantity: any = 1;
  public guestUserData: any = [];
  public medimallFoundationFlag: boolean = true;
  public medimallFoundationValue: any = 10;
  public medcoinAmountValue: any = 0;
  public medcoinAmountFlag: boolean = true;
  public token: any;
  public Health_Vault_Array: any = []
  public Health_Data_Image: any = null
  public Health_Data_Alert_Flag: boolean = false
  public Ts_Click: boolean = false
  public healthdataClicked ; boolean = false;

  public Prescription_Radio: any = 'I have a Prescription'
  public Prescription_Radio_Flag: boolean = false

  public Upload_Image: any = ''

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ["", ""],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items:4
      },
      940: {
        items: 6
      }
    },
    nav: false
  }

  public attemptedSubmit: boolean = false;;
  couponForm: FormGroup;
  uploadForm: FormGroup;


  add_Modal_Flag: boolean;
  update_Modal_Flag: boolean;
  errorInAddress: boolean;
  public userAddresses: any;
  public userAddress: any;
  charityCheckBoxFlag :boolean;


  phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  indianPinRegex: any = '';
  closeResult: string;

  public API = environment.baseUrl;
  public cartList: any = [];
  public cartDetails: any = [];
  public handPickList: any = [];
  public bannerImage: any;
  public customerAddress: any;
  public deliveryDetails: any;
  constructor(public _cartService: CartService,
    private _newcartService: NewCartService,
    // private modalService: NgbModal,
    private _fb: FormBuilder,
    private _clipboardService: ClipboardService,
    private _router: Router,
    private Health_Vault_Service: HealthVaultService,
    public _landingService: LandingService,
    private titleService: Title,
    private metaService: Meta,
    public _toasterService :ToastrService) {

    this.couponForm = this._fb.group({
      coupon: ['', Validators.required],
      percentage: [''],
    })

    this.uploadForm = this._fb.group({
      prescriptionFlag: ['I have a Prescription', Validators.required],
      camera: [''],
      gallery: [''],
      healthdata: [''],
    })

  }

  ngOnInit(): void {  

    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
  
    sessionStorage.removeItem('SubscriptionItems') //to remove all added medfill subscription
    //sessionStorage.removeItem('iDontHaveAPrescription');

    const items = document.querySelectorAll(".accordion a");
                
    function toggleAccordion(){
      this.classList.toggle('active');
      this.nextElementSibling.classList.toggle('active');
    }

    items.forEach(item => item.addEventListener('click', toggleAccordion));

   
    this.get_All_prescriptions();

    this.titleService.setTitle('Cart') ;

    this.getWishListCount();
    this.add_Modal_Flag = false;
    this.update_Modal_Flag = false;

    //this.getUserAddress();


    this.token = localStorage.getItem('token');
    let guestToken = localStorage.getItem('guestToken');
    if (this.token != null) {
      this.getCartDetails();
      this._cartService.get_Cart_Count_Only()
      // this.getAvailableCoupon();
    }
    else if (guestToken != '') {
      this._cartService.getLocalCart();
      this.getcartinfo_without_login();
      if(localStorage.getItem('CartItem')){
        this.cartList = JSON.parse(localStorage.getItem('CartItem'));
        this._cartService.setCartAMountDetails(this.cartList, 'add');
        this.cartDetails.totalAmountToBePaid = this._cartService.cartTotalAmount;
        this.cartDetails.totalCartValue = this._cartService.cartTotalAmount;
        this.cartDetails.totalRealCartValue = this._cartService.cartTotalAmount;
        //localStorage.setItem('CartTotalAmount',this.cartDetails.totalAmountToBePaid);
        console.log(this.cartDetails.totalAmountToBePaid)
      }
    }

  
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");
  
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more"; 
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less"; 
      moreText.style.display = "inline";
    }

   
  }

  getcartinfo_without_login(){
    this._cartService.get_cart_info_without_login().subscribe((res:any)=>{
      console.log(res);
      this.bannerImage = res.data.banner.image;
      this.handPickList = res.data.handPicks;
    })
  }

  get_All_prescriptions(){
    this._cartService.get_prescription().subscribe((res: any) => {
      console.log(res);
      if (Object.keys(res.data.result).length === 0 && res.data.result.constructor === Object) {
        this.prescription_id = '';
        this.prescriptionImageURLArray = [];
        //this.prescription_upload_flag = false;
      }
      else{
        this.prescription_id = res.data.result._id;
        if(res.data.result.prescription.length>0){
          this.prescriptionImageURLArray = res.data.result.prescription;
          //this.prescription_upload_flag = true;
        }
      }
      
    })
  }

  getWishListCount() {
    this._cartService.get_Cart_Count().subscribe((res: any) => {
      console.log(res);
      this.wishListCount = res.data.wishListCount;
    })
  }

  getCartDetails() {
    this._cartService.get_Cart_Details().subscribe((res: any) => {
      console.log(res);
      if (res.data.length > 0) {
        this._cartService.cartCount = res.data[0].medCart.products;
        this.cartList = res.data[0].medCart.products;
        this.prescriptionEnable = res.data[0].medCart.prescriptionEnable;

        this._cartService.livecartData = this.cartList;

        this.customerAddress = res.data[0].medCart.address;
        //check chether address id available or not
        if (Object.keys(res.data[0].medCart.address).length === 0 && res.data[0].medCart.address.constructor === Object) {
          this.customerAddress = '';
          console.log(this.customerAddress);
        }
        else {
          this.customerAddress = res.data[0].medCart.address;
          //this.userAddresses.push(res.data[0].medCart.address)
        }

        //check whether coupon applied or not
        if (Object.keys(res.data[0].medCart.userAppliedCoupon).length === 0 && res.data[0].medCart.userAppliedCoupon.constructor === Object) {
          this.medcoinAmountFlag = true;
          this.medcoinAmountValue = res.data[0].medCart.cartDetails.medCoinRedeemed;
        }
        else {
          this.medcoinAmountFlag = true;
          this.medcoinAmountValue = res.data[0].medCart.cartDetails.medCoinRedeemed;
          //this.userAddresses.push(res.data[0].medCart.address)
        }

        if (Object.keys(res.data[0].medCart.userAppliedCoupon).length === 0 && res.data[0].medCart.userAppliedCoupon.constructor === Object) {
          this.couponCode = ''
        }
        else{
          this.couponCode = res.data[0].medCart.userAppliedCoupon
        }

        this.bannerImage = res.data[0].medCart.banner.image;
        this.availableCoupon = res.data[0].medCart.availableCoupons;
        this.cartDetails = res.data[0].medCart.cartDetails;
        this.deliveryDetails = res.data[0].medCart.deliveryDetails;
        this.handPickList = res.data[0].medCart.handPicks;
        this.cartDetails.totalAmountToBePaid = res.data[0].medCart.cartDetails.totalAmountToBePaid;
        this.cartDetails.totalCartValue = res.data[0].medCart.cartDetails.totalCartValue;
        if (res.data[0].medCart.cartDetails.donationAmount != 0) {
          this.medimallFoundationFlag = true;
          this.charityCheckBoxFlag = true;
          this.medimallFoundationValue = res.data[0].medCart.cartDetails.donationAmount;
        }
        else {
          this.medimallFoundationFlag = true;
          this.charityCheckBoxFlag = false;
          this.medimallFoundationValue = res.data[0].medCart.cartDetails.donationAmount;
        }

        this.prescriptionProvidedFlag = this.cartDetails.isPrescriptionProvided;
        this.cartDetails.totalRealCartValue = this.cartDetails.totalCartValue;
        this.totalPrescriptionCount = this.cartDetails.totalCountOfProductsThatRequirePrescription
        if(this.totalPrescriptionCount!=0){
          this.cartList.forEach(element => {
            if(element.IsPrescriptionRequired){
              //this.prescriptionCartList = [];
              this.prescriptionCartList.push(element);
            }
          });
        }
        this._cartService.get_Cart_Count();
      }
    })
  }

  getAvailableCoupon() {
    this._cartService.get_available_coupon_codes().subscribe((res: any) => {
      console.log(res);
      this.availableCoupon = res.data.scratchableCoupons;
    })
  }





  newAddressForm: FormGroup = this._fb.group({
    id: [''],
    name: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern(this.phoneReg)]],
    pincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
    house: ['', [Validators.required]],
    landmark: ['', [Validators.required]],
    street: ['', [Validators.required]],
    type: ['', [Validators.required]],
    state: ['', Validators.required],
  });

  getUserAddress() {
    //we need to give some code to get user _id
    this._newcartService.getAddress().subscribe(
      (res: any) => {
        console.log(res);
       //this.customerAddress = res.data.address;
        this.userAddresses = res.data.address;

        if (res.error == false) {
        } else {
          console.log('some error occured');
        }
      },
      (err: any) => { }
    );
  }

  deleteUserAddress(num) {


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
        
        const id = this.userAddresses[num]._id;
        this._newcartService.deleteUserAddress(id).subscribe(
          (res: any) => {
            console.log(res);
            if (res.error == false) {
              Swal.fire({
                icon: 'success',
                title: 'Deleted Successfully',
              });
              this.getUserAddress();
              this.getCartDetails();
            } else {
              console.log('some error occured');
            }
          },
          (err: any) => {
            console.log(err);
          }
        );


      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


    
  }
  onSubmitAddress() {
    console.log(this.newAddressForm.value);
    console.log(this.newAddressForm);

    if (this.update_Modal_Flag == true) {
      this.updateAddress();
    } else {
      this.addNewUserAddress();
    }
  }

  addNewUserAddress() {
    console.log(this.newAddressForm.value);
    console.log(this.newAddressForm);
    if (this.newAddressForm.invalid) {
      this.errorInAddress = true;
      return;
    } else {
      this._newcartService.addUserAddress(this.newAddressForm.value).subscribe(
        (res: any) => {
          console.log(res);
          if (res.error == false) {
            Swal.fire({
              title: 'Address added successfully',
              icon: 'success',
            }).then(() => {
              document.getElementById('dismiss-add-address').click();
              //  document.getElementById('popup-select-address').click();
              this.newAddressForm.reset();
              this.getUserAddress();
              this.getCartDetails();
            });
          } else {
            console.log('some error occured');
          }
        },
        (err: any) => {
          console.log('some server occured');
        }
      );
    }
  }
  updateAddress() {
    if (this.newAddressForm.invalid) {
      this.errorInAddress = true;
      return;
    } else {
      this._newcartService.editUserAddress(this.newAddressForm.value).subscribe(
        (res: any) => {
          console.log(res);
          if (res.error == false) {
            Swal.fire({
              title: 'Address updated successfully',
              icon: 'success',
            }).then(() => {
              document.getElementById('dismiss-add-address').click();
              // document.getElementById('popup-select-address').click();
              this.getUserAddress();
              this.getCartDetails();

              this.update_Modal_Flag = false;
              this.newAddressForm.reset();
            });
          } else {
            console.log('some error occured');
          }
        },
        (err: any) => {
          console.log('some server occured');
        }
      );
    }
  }

  changeAddressStatus(i) {
    console.log(i);
    const id = this.userAddresses[i]._id;

    this._newcartService.changeAddresStatusById(id).subscribe(
      (res: any) => {
        console.log(res);

        if (res.error == false) {
          Swal.fire({
            icon: 'success',
            title: 'Successfully selected',
          }).then(() => {
            document.getElementById('dismiss-select-address').click();
            this.getUserAddress();
            this.ngOnInit();
          });
        } else {
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  isValidnewUserAddress(controlName: any) {
    return (
      (this.newAddressForm.get(controlName)!.invalid &&
        this.newAddressForm.get(controlName)!.touched) ||
      (this.errorInAddress && this.newAddressForm.get(controlName).invalid)
    );
  }
  closeAddressForm() {
    this.newAddressForm.reset();
  }
  closeSelectAddress() {
    this.getCartDetails();
    document.getElementById('dismiss-select-address').click();
  }
  editUserAddress(number) {
    this.update_Modal_Flag=true;
    this.navigateToAddForm(number);
  }
  navigateToAddForm(num) {
    if (this.update_Modal_Flag == false) {
      document.getElementById('dismiss-select-address').click();

      document.getElementById('popup-add-address').click();
      this.newAddressForm.reset();
    } else {
      document.getElementById('dismiss-select-address').click();
      document.getElementById('popup-add-address').click();

      this.patchAddForm(num);
    }
  }
  patchAddForm(i) {
    this.newAddressForm.patchValue({
      id: this.userAddresses[i]._id,
      name: this.userAddresses[i].name,
      mobile: this.userAddresses[i].mobile,
      pincode: this.userAddresses[i].pincode,
      house: this.userAddresses[i].house,
      landmark: this.userAddresses[i].landmark,
      street: this.userAddresses[i].street,
      type: this.userAddresses[i].type,
      state: this.userAddresses[i].state,
    });
  }
  states: string[] = [
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




  addToCart(count, variantID, productID) {
    if (this.token! = null) {
      let data = {
        "product_id": productID,
        "variantId": variantID,
        "quantity": count
      }
      this._cartService.add_To_Cart(data).subscribe((res: any) => {
        console.log(res);
        this._cartService.get_Cart_Count_Only()
      })
    }
  }


  removeFromCart(id, productid, array) {
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
        
        if (this.token != null) {
          this._cartService.remove_From_Cart(id).subscribe((res: any) => {
            console.log(res);
            this._cartService.get_Cart_Count_Only()
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
            this.ngOnInit();
          },
            error => {
              console.error('There was an error!', error.message);
            })
        }
        else {
          //remove from local cart
          this._cartService.removeLocalCart(productid);
          this.ngOnInit();
        }


      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

   
  }

  //Medimall Foundation Value

  checkBoxChangeCharityValue(event:any){
    if(event.target.checked){
        let input = {
          "donationAmount": 10
        }
        this._cartService.add_medimall_foundation_donation(input).subscribe((res: any) => {
          console.log(res);
          if(!res.error){
            this.medimallFoundationFlag = true;
            this.charityCheckBoxFlag = true;
            Swal.fire({
              icon: 'success',
              text: res.message,
              showConfirmButton: true,
            });
            this.getCartDetails();
          }
          else{
            Swal.fire({
              icon: 'warning',
              text: res.message,
              showConfirmButton: true,
            });
          }
        })
    }

    else{
      let input = {
        "donationAmount": 0
      }
      this._cartService.add_medimall_foundation_donation(input).subscribe((res: any) => {
        console.log(res);
        if(!res.error){
          Swal.fire({
            icon: 'success',
            text: res.message,
            showConfirmButton: true,
          });
          this.getCartDetails();
          this.medimallFoundationFlag = false;
          this.charityCheckBoxFlag = false;
        }
        else{
          Swal.fire({
            icon: 'warning',
            text: res.message,
            showConfirmButton: true,
          });
        }
      })
    }
  }
  removeMedimallFoundationValue() {
    this.medimallFoundationFlag = false;
    let input = {
      "donationAmount": 0
    }
    this._cartService.add_medimall_foundation_donation(input).subscribe((res: any) => {
      console.log(res); 
      if(!res.error){
        Swal.fire({
          icon: 'success',
          text: res.message,
          showConfirmButton: true,
        });
        this.getCartDetails();
        this.medimallFoundationFlag = false;
      }
      else{
        Swal.fire({
          icon: 'warning',
          text: res.message,
          showConfirmButton: true,
        });
      }
    })
    //this.cartDetails.totalRealCartValue -= this.medimallFoundationValue;
  }

  changeMedimallFoundationValue(event: any) {
    this.medimallFoundationValue = event.target.value;
    let input = {
      "donationAmount": this.medimallFoundationValue
    }
    this._cartService.add_medimall_foundation_donation(input).subscribe((res: any) => {
      console.log(res);
      if(!res.error){
        // Swal.fire({
        //   icon: 'success',
        //   text: res.message,
        //   showConfirmButton: true,
        // });
        this.getCartDetails();
      }
      else{
        Swal.fire({
          icon: 'warning',
          text: res.message,
          showConfirmButton: true,
        });
        this.medimallFoundationValue = '';
      }
    })
    // this.cartDetails.totalRealCartValue += parseInt(this.medimallFoundationValue); 
  }

  //Medcoin Updation
  changeMedimallMedcoinValue(event: any) {
    this.medcoinAmountValue = event.target.value;

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
         
          let data = {
            "couponId":this.couponCode.couponId
          }
          this._cartService.remove_coupon_from_cart(data).subscribe((res:any)=>{
            console.log(res)
            this.getCartDetails();

            let input = {
              "medCoinCount": this.medcoinAmountValue
            }
            this._cartService.add_medimall_medcoin_amount(input).subscribe((res: any) => {
              console.log(res);
              if(!res.error){
                // Swal.fire({
                //   icon: 'success',
                //   text: res.message,
                //   showConfirmButton: true,
                // });
                this.getCartDetails();
              }
              else{
                Swal.fire({
                  icon: 'warning',
                  text: res.message,
                  showConfirmButton: true,
                });
                this.ngOnInit();
                this.medcoinAmountValue = '';
              }
            })

            
          })


       
      
  
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          document.getElementById('dismiss-coupon-form').click();
          this.ngOnInit();
        }
      });
    }

    else{
      let input = {
        "medCoinCount": this.medcoinAmountValue
      }
      this._cartService.add_medimall_medcoin_amount(input).subscribe((res: any) => {
        console.log(res);
        if(!res.error){
          // Swal.fire({
          //   icon: 'success',
          //   text: res.message,
          //   showConfirmButton: true,
          // });
          this.getCartDetails();
        }
        else{
          Swal.fire({
            icon: 'warning',
            text: res.message,
            showConfirmButton: true,
          });
          this.medcoinAmountValue = '';
        }
      })
    }
   


   
  }

  removeMedimallMedcoinValue() {
    this.medcoinAmountValue = 0;
    this.medcoinAmountFlag = false;
    let input = {
      "medCoinCount": this.medcoinAmountValue
    }
    this._cartService.add_medimall_medcoin_amount(input).subscribe((res: any) => {
      console.log(res);
       if(!res.error){
        Swal.fire({
          icon: 'success',
          text: res.message,
          showConfirmButton: true,
        });
        this.getCartDetails();
      }
      else{
        Swal.fire({
          icon: 'warning',
          text: res.message,
          showConfirmButton: true,
        });
      }
    })
  }

  decrement(cart) {
    console.log(cart);
    
    if (cart.quantity > 1) {
      cart.quantity--;
      if (this.token != null) {
        let input = {
          "cartId": cart.cartId,
          "quantity": cart.quantity
        }

        this._cartService.update_Cart_Item(input).subscribe((res: any) => {
          console.log(res);
          this._cartService.get_Cart_Count_Only()
          if (!res.error) {
            this._toasterService.info(res.message,'',{
              timeOut :  10000,
              positionClass: 'toast-bottom-right',
              closeButton:true
            })
            this.ngOnInit();
          }
          else{
            Swal.fire({
              icon: 'warning',
              text: res.message,
              showConfirmButton: true,
            });
            this.ngOnInit();
          }
        })
      }
      else {

        this._cartService.updateQuantity(cart, -1);
        this._toasterService.info('Cart item updated sucessfully.', '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true
        })
        this._cartService.setCartAMountDetails(this.cartList, 'add');
        this.cartDetails.totalAmountToBePaid = this._cartService.cartTotalAmount;
        this.cartDetails.totalCartValue = this._cartService.cartTotalAmount;
        this.cartDetails.totalRealCartValue = this._cartService.cartTotalAmount;
      }
    }
  }

  increment(cart) {
    cart.quantity++;
    //this._cartService.updateQuantity(cart,cart.quantity)
    if (this.token != null) {
      let input = {
        "cartId": cart.cartId,
        "quantity": cart.quantity
      }
      this._cartService.update_Cart_Item(input).subscribe((res: any) => {
        console.log(res);
        this._cartService.get_Cart_Count_Only()
        if (!res.error) {
         this._toasterService.info(res.message,'',{
          timeOut :  10000,
          positionClass: 'toast-bottom-right',
          closeButton:true
        })
          this.ngOnInit();
        }
        else{
          Swal.fire({
            icon: 'warning',
            text: res.message,
            showConfirmButton: true,
          });
          this.ngOnInit();
        }
      })
    }
    else {
      this._cartService.updateQuantity(cart, 1)
      this._toasterService.info('Cart item updated sucessfully.', '', {
        timeOut: 10000,
        positionClass: 'toast-bottom-right',
        closeButton: true
      })
      this._cartService.setCartAMountDetails(this.cartList, 'add');
      this.cartDetails.totalAmountToBePaid = this._cartService.cartTotalAmount;
      this.cartDetails.totalCartValue = this._cartService.cartTotalAmount;
      this.cartDetails.totalRealCartValue = this._cartService.cartTotalAmount;
    }
  }

  selectCoupon(i) {
    this.couponForm.patchValue({
      coupon: i.code,
      percentage: 120
    });
  }

  copyToClipBoard(code) {
    this._clipboardService.copyFromContent(code);
  }

  applyCoupon() {


    if (this.couponForm.invalid) {
      return;
    }
    // alert(this.couponForm.get('coupon').value);

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


          let ip = {
            "medCoinCount": 0
          }
          this._cartService.add_medimall_medcoin_amount(ip).subscribe((res: any) => {
            console.log(res);
            this.getCartDetails();

            let input = {
              "couponCode": this.couponForm.get('coupon').value,
              "couponType": "medimall"
            }
            this._cartService.apply_coupon_to_cart(input).subscribe((res: any) => {
              console.log(res);
              if (res.error === false) {
                document.getElementById('dismiss-coupon-form').click();
                Swal.fire({
                  icon: 'success',
                  text: res.message,
                  showConfirmButton: true,
                });
                this.couponCode = this.couponForm.get('coupon').value;
                this.getCartDetails();
              }
              else {
                document.getElementById('dismiss-coupon-form').click();
                this.attemptedSubmit = false;
        
                Swal.fire({
                  icon: 'warning',
                  text: res.message,
        
                  showConfirmButton: true,
                });
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
        "couponCode": this.couponForm.get('coupon').value,
        "couponType": "medimall"
      }
      this._cartService.apply_coupon_to_cart(input).subscribe((res: any) => {
        console.log(res);
        if (res.error === false) {
          document.getElementById('dismiss-coupon-form').click();
          Swal.fire({
            icon: 'success',
            text: res.message,
            showConfirmButton: true,
          });
          this.couponCode = this.couponForm.get('coupon').value;
          this.getCartDetails();
        }
        else {
          document.getElementById('dismiss-coupon-form').click();
          this.attemptedSubmit = false;
  
          Swal.fire({
            icon: 'warning',
            text: res.message,
  
            showConfirmButton: true,
          });
        }
      })
    }
   
  }

  removeCoupon(id) {
    this.couponForm.patchValue({
      coupon: ''
    });
    let data = {
      "couponId":id
    }
    this._cartService.remove_coupon_from_cart(data).subscribe((res:any)=>{
      console.log(res)
      if(!res.error){
        Swal.fire({
          icon: 'success',
          text: res.message,
          showConfirmButton: true,
        });
        this.cartDetails.couponAppliedDiscount = '';
        this.couponCode = '';
        this.attemptedSubmit = false;
      }
      else{
        Swal.fire({
          icon: 'success',
          text: res.message,
          showConfirmButton: true,
        });
        this.cartDetails.couponAppliedDiscount = '';
        this.couponCode = '';
        this.attemptedSubmit = false;
      }
      this.getCartDetails();
    })
  }

  isUploadPrescription(event: any) {
    this.Health_Data_Alert_Flag = false
    this.Prescription_Radio_Flag = false
    this.Prescription_Radio = ''
    this.Prescription_Radio = event.target.value
    if (event.target.value == 'I have a Prescription') { this.prescription_upload_flag = true }
    else { this.prescription_upload_flag = false }
    // this.prescription_upload_flag = event.target.checked;

  }


  continueWithCart() {

    this.Health_Vault_Array = [];
    this.Upload_Priscription_Form_Close()
    //this.uploadForm.reset()
   // this.prescription_upload_flag = false
    this.Health_Data_Image = null
    this.Upload_Image = null
    console.log(this.cartList);
    console.log(this.cartDetails);

    if(this.totalPrescriptionCount==0){
      this.prescription_upload_flag = false;
      sessionStorage.setItem('iDontHaveAPrescription',JSON.stringify(!this.prescription_upload_flag));
      this.finalSubmit();
    }
   
    //this.finalSubmit();
  }

  isValidnewCoupon(controlName: any) {
    return (
      (this.couponForm.get(controlName)!.invalid &&
        this.couponForm.get(controlName)!.touched) ||
      (this.attemptedSubmit && this.couponForm.get(controlName).invalid)
    );
  }

  Get_Health_Vault_Data() {

    this.healthdataClicked = !this.healthdataClicked;
    if (this.prescription_upload_flag == true) {
      this.Upload_Image = null
      this.uploadForm.patchValue({
        "gallery": ''
      })
      // document.getElementById('dismiss-upload-prescription').click()
      this.Health_Vault_Service.get_user_health_vault().subscribe((res: any) => {
        console.log(res, "health vault data");
        if(res.data){
          this.Health_Data_Alert_Flag = false
          this.Health_Vault_Array = []
          this.Health_Vault_Array = res.data

            
          if(this.Health_Vault_Array.length==0){
            Swal.fire({
              icon: 'warning',
              title: 'No health data found',
            });
          }
          else{
            this.prescriptionImageURLArray.forEach((pres :any,ind:any) => {
              this.Health_Vault_Array.forEach((element :any,index:any) => {
                if(pres === element.prescription){
                    element.checkedFlag = true;
                }
              });
            });
          }
           
        }
        else{
          this.Health_Data_Alert_Flag = false
          this.Health_Vault_Array = [];
          Swal.fire({
            icon: 'warning',
            title: 'No Health data found',
          });
        }
      })
    }

  }

  Select_Health_Data(event,item) {
    if(event.target.checked){
      console.log(item);
      this.Health_Data_Image = null
      this.Health_Data_Alert_Flag = false
      //this.Health_Data_Image = item.prescription

      let data :any = [];
      data = this.prescriptionImageURLArray.filter((i:any)=>i === item.prescription);
        if(data.length>0){
          alert("already added");
        }
        else{
         // this.prescriptionHealthDataURLArray.push(item.prescription)
          this.prescriptionImageURLArray.push(item.prescription)
          console.log(this.prescriptionImageURLArray);
        }
      //this.healthdataClicked = false;

    }
    else{
      let data:any = [];
      //data = this.prescriptionHealthDataURLArray.filter((res:any)=>res !=item.prescription);
      data = this.prescriptionImageURLArray.filter((res:any)=>res !=item.prescription);

      console.log(data);

      this.prescriptionImageURLArray = data;
    }
  }

  // Health_Data_Continue_Click() {
  //   if (this.Health_Data_Image == null) {
  //     this.Health_Data_Alert_Flag = true
  //     this.Ts_Click = false
  //   } else if (this.Health_Data_Image != null) {
  //     this.Health_Data_Alert_Flag = false
  //     document.getElementById('dismiss-select-health-data').click()
  //     document.getElementById('popup-upload-prescription').click()
  //     this.Ts_Click = true
  //   }
  // }

  Upload_Priscription_Form_Close() {
    if (this.Ts_Click == false) {
     // this.uploadForm.reset()
      this.Upload_Image = null
      this.Health_Data_Image = null
    }
  }

  Continue_Prescription_Click() {
    console.log(this.Upload_Image, "click")


  
    if (this.prescriptionImageURLArray.length != 0) {

          if (this.Prescription_Radio=='I have a Prescription') {

            this.Prescription_Radio_Flag = false
            if (this.prescriptionImageURLArray.length==0) {
              this.Health_Data_Alert_Flag = true
              this.Ts_Click = false
            }
            
            else if (this.prescriptionImageURLArray.length != 0) {
              if(this.prescription_id){
                let input={
                  prescription : this.prescriptionImageURLArray
                }
                this._cartService.update_prescription(this.prescription_id,input).subscribe((res:any)=>{
                  console.log(res);
                      if(!res.error){
                        document.getElementById('dismiss-upload-prescription').click()
                        sessionStorage.setItem('iDontHaveAPrescription',JSON.stringify(!this.prescription_upload_flag));
                        this._router.navigate(['/order-review']);
                      }
                });
              }
              else{
                  let input={
                    prescription : this.prescriptionImageURLArray
                  }
                  this._cartService.add_prescription(input).subscribe((res:any)=>{
                    console.log(res);
                        if(!res.error){
                          document.getElementById('dismiss-upload-prescription').click()
                          sessionStorage.setItem('iDontHaveAPrescription',JSON.stringify(!this.prescription_upload_flag));
                          this.finalSubmit();
                        }
                  });
              }
              

            }




          }
          else if (this.Prescription_Radio == "I don't have a Prescription") {
            console.log("No Prescription");
            this.Prescription_Radio_Flag = false

            document.getElementById('dismiss-upload-prescription').click();
            sessionStorage.setItem('iDontHaveAPrescription',JSON.stringify(!this.prescription_upload_flag));
            this.finalSubmit();
          } else{
            console.log("Nothing Selected");
            this.Prescription_Radio_Flag = true
          }
    }

    else{

      if(this.prescription_upload_flag){
        Swal.fire({
          icon: 'warning',
          title: 'Please upload prescription',
        });
        this.Prescription_Radio_Flag = true
      }
      else{
        document.getElementById('dismiss-upload-prescription').click();
        sessionStorage.setItem('iDontHaveAPrescription',JSON.stringify(!this.prescription_upload_flag));
        this.finalSubmit();
      }
     
    }


  }



//Prescription add
  uploadPrescritpion(event: any, type: any) {
    this.Health_Data_Alert_Flag = false
    this.Prescription_Radio_Flag = false
    //this.prescription_upload_flag = false
    this.Health_Data_Image = null
    // if (type === 'camera') {
    //   alert("choose another");
    // }
    // else if (type === 'gallery') {
    // alert("choose gallery");
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    this.imageLoading = true;

    Img.onload = (e: any) => {
      let content = reader.result as string;
      let presPath = content;
      this.prescriptionImageURL = content;
      this.Upload_Image = file;


      const formData = new FormData();
      formData.append('prescription',this.Upload_Image);
      
      this._cartService.upload_image(formData).subscribe((res:any)=>{
        console.log(res);
            if(!res.error){
              this.prescriptionImageURLArray.push(res.data.images[0]);
             // this.getCartDetails();
              this.imageLoading = false;
              this.Prescription_Radio == 'I have a Prescription'
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
    // console.log(this.Upload_Image,"Change ")

    // }
    // else if (type === 'healthdata') {
    //   console.log('healthdata');

    //   // this._router.navigate(['/dashboard-order-details/health-vault'])
    //   // document.getElementById('dismiss-upload-prescription').click()
    //   // alert("choose healthdata");
    // }
  }
//Prescription  remove
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
        console.log(data,"updated array");
        let input={
          prescription : this.prescriptionImageURLArray
        }
        this._cartService.update_prescription(this.prescription_id,input).subscribe((res:any)=>{
          console.log(res);
              if(!res.error){
                this.getCartDetails();
                this.get_All_prescriptions();
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

  redirectToProductDetail(id) {
    let data = {
      'id': id
    }
    this._landingService.getProductsList_by_ID(data).subscribe((res: any) => {
      console.log(res.data.products);
      this._router.navigate(['/product-detail/', res.data.products.title, res.data.products._id, res.data.products.brand, res.data.products.metaTitles])
    });
  }


  redirectToWishListPage() {
    this._router.navigate(['/short-list'])
  }


//Final cart Submit
  finalSubmit(){

    if(this.totalPrescriptionCount!=0){
      if(this.prescriptionProvidedFlag){

        if(this.cartDetails.isThisCartIsEligibleForPurchase && this.customerAddress!='' && this.deliveryDetails.isThisProductDeliverable && this.cartDetails.isThisCartIsEligibleForPurchase){
          this._router.navigate(['/order-review']);
        }
        else{
          if(!this.cartDetails.isThisCartIsEligibleForPurchase){
            this.checking('deliveryeligible');//checking Delivery
          }
          else if(this.customerAddress==''){  
            this.checking('address'); //checking eligible delivery
          }
          else if(!this.deliveryDetails.isThisProductDeliverable){
            this.checking('pincode'); //checking address

          }
        }
        
      

      }
      // else{
      //     //alert("worked")
      //     Swal.fire({
      //       icon: 'warning',
      //       title: 'Please Upload Prescription',
      //     });
      // }
    }
    else{

      if(this.cartDetails.isThisCartIsEligibleForPurchase && this.customerAddress!='' && this.deliveryDetails.isThisProductDeliverable){
        this._router.navigate(['/order-review']);
      }
      else{
        if(!this.cartDetails.isThisCartIsEligibleForPurchase){
          this.checking('deliveryeligible');//checking Delivery
        }
        else if(this.customerAddress==''){  
          this.checking('address'); //checking eligible delivery
        }
        else if(!this.deliveryDetails.isThisProductDeliverable){
          this.checking('pincode'); //checking address

        }

    }


    }
}


  //checking before submission

  checking(type){
    switch(type){
      case 'deliveryeligible':   
              if(this.cartDetails.isThisCartIsEligibleForPurchase){ //checking Cart is eligible for purchase
                this._router.navigate(['/order-review']);
              }
              else{
                Swal.fire({
                  icon: 'warning',
                  title: 'Your total cart value is less than minimum purchase amount !!! ',
                  text: '(Minimum purchase amount is Rs.'+this.cartDetails.minimumPurchaseAmount+')'
                });
                }break;

      case 'address' : 
      
              if(this.customerAddress!=''){
                this._router.navigate(['/order-review']);
              }
              else{
                Swal.fire({
                  icon: 'warning',
                  title: 'Please provide address !!',
                });
              }
              break;

      case 'pincode': 
      
              if(this.deliveryDetails.isThisProductDeliverable){ //checking Delivery 
                this._router.navigate(['/order-review']);
              }
              else{  
                  Swal.fire({
                  icon: 'warning',
                  title: this.deliveryDetails.message,
                  });
              }
              break;
    }
  }

  Continue_Winthout_Prescription_Click(){
    document.getElementById('dismiss-upload-prescription').click();
    sessionStorage.setItem('iDontHaveAPrescription',JSON.stringify(!this.prescription_upload_flag));
    this._router.navigate(['/order-review']);
  }

  continueWithLocalCart(){
    Swal.fire({
      icon: 'warning',
      text: 'Please login to purchase',
      showConfirmButton: true,
    });
  }

  triggerSnapshot(): void {
    this.trigger.next();
   }
   handleImage(webcamImage: any): void {
    console.log('received webcam image', webcamImage);
    this.webcamImage = webcamImage;

    const arr = this.webcamImage.imageAsDataUrl.split(",");
    console.log(arr);
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    console.log(u8arr);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file: File = new File([u8arr],'newImage', { type: webcamImage._mimeType })
    console.log(file);
   
    const formData = new FormData();
      formData.append('prescription',file);
      
      this._cartService.upload_image(formData).subscribe((res:any)=>{
        console.log(res);
            if(!res.error){
              this.prescriptionImageURLArray.push(res.data.images[0]);
              this.getCartDetails();
              this.showWebcam = false;
            }
            else{
              Swal.fire({
              icon: 'warning',
              title: res.message,
              });
            }
          })
   }
  
   public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
   }



  openCamera(){
    // this.cameraFlag = true;
    // alert(this.cameraFlag);
    this.showWebcam = !this.showWebcam;
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }


  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }


  prescriptionContainClick(){
    this.containFlag = !this.containFlag;
  }

  
  prescriptionGuidClick(){
    this.containGuidFlag = !this.containGuidFlag;
  }


}
