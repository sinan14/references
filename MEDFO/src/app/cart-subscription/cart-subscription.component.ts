import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NewCartService } from 'src/app/services/new-cart.service';
import Swal from 'sweetalert2';
import { ClipboardService } from 'ngx-clipboard';
import { LandingService } from 'src/app/services/landing.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HealthVaultService } from '../services/health-vault.service';
import { ThrowStmt } from '@angular/compiler';
import { Title, Meta } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cart-subscription',
  templateUrl: './cart-subscription.component.html',
  styleUrls: ['./cart-subscription.component.css']
})
export class CartSubscriptionComponent implements OnInit {


  public containGuidFlag  :boolean = false;
  public healthdataClicked ; boolean = false;
  public imageLoading :boolean = false;
  public containFlag :boolean = false;
  public nextDeliveryDate :any = '';
  public secondDeliveryDate :any = '';
  public intervalForm: FormGroup;
  public prescriptionChoosed: boolean = false;
  public prescriptionUploadedFlag: boolean = false;
  public totalPrescriptionCount = 0;
  public prescriptionEnable: boolean;
  public wishListCount = 0;
  public likeFlag: boolean = false;
  public API = environment.baseUrl;
  public cartList: any = [];
  public cartDetails: any = [];
  public handPickList: any = [];
  public bannerImage: any;
  public customerAddress: any;
  public deliveryDetails: any;
  public availableCoupon: any = [];

  public quantity: any = 1;
  public guestUserData: any = [];
  public medimallFoundationFlag: boolean = true;
  public token: any;

  couponForm: FormGroup;
  public couponCode: any = '';
  public attemptedSubmit: boolean = false;


  add_Modal_Flag: boolean;
  update_Modal_Flag: boolean;
  errorInAddress: boolean;
  public userAddresses: any;
  public userAddress: any;

  public prescriptionImageURLArray: any = [];
  public prescriptionImageFileArray: any = [];
  public prescriptionHealthDataURLArray: any = [];

  public prescription_id: any = '';

  public Health_Vault_Array: any = []
  public Health_Data_Image: any = null
  public Health_Data_Alert_Flag: boolean = false
  public Ts_Click: boolean = false
  public prescriptionData: any = '';
  public prescriptionFlag: boolean = true;
  public prescriptionProvidedFlag: boolean;








  phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  indianPinRegex: any = '';
  closeResult: string;

  constructor(public _cartService: CartService,
    private _newcartService: NewCartService,
    private _clipboardService: ClipboardService,
    public _landingService: LandingService,
    public _router: Router,
    private Health_Vault_Service: HealthVaultService,
    private titleService: Title,
    private metaService: Meta,
    public _toasterService: ToastrService,
    public _formBuilder: FormBuilder,
    // private modalService: NgbModal,
    private _fb: FormBuilder,) {
    this.couponForm = this._fb.group({
      coupon: ['', Validators.required],
      percentage: [''],
    })

    this.intervalForm = this._formBuilder.group({
      interval: ['30', Validators.required],
    })
  }

  ngOnInit(): void {

    
    const items = document.querySelectorAll(".accordion a");

    function toggleAccordion() {
      this.classList.toggle('active');
      this.nextElementSibling.classList.toggle('active');
    }

    items.forEach(item => item.addEventListener('click', toggleAccordion));


    this.titleService.setTitle('Cart');
    this.token = localStorage.getItem('token');
    let guestToken = localStorage.getItem('guestToken');
    if (this.token != null) {
      this.getCartDetails();
      this.get_All_prescriptions();
      this.getWishListCount();
      this._cartService.get_Cart_Count_Only();
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
        this.generateNextDeliveryDate();
      }
   
    }





   


  }

  generateNextDeliveryDate(){
    var myDate = new Date(this.cartDetails.deliveryDate);
    var nextDay = new Date(this.cartDetails.deliveryDate);
    nextDay.setDate(myDate.getDate()+parseInt(this.intervalForm.get('interval').value));


    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(nextDay, 'MMM dd, yyyy ');
   
    this.nextDeliveryDate = end;

    //2nd delivery date

    var myDate = new Date(nextDay);
    var nextDay = new Date(myDate);
    nextDay.setDate(myDate.getDate()+parseInt(this.intervalForm.get('interval').value));


    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(nextDay, 'MMM dd, yyyy ');
   
    this.secondDeliveryDate = end;
    //alert(this.nextDeliveryDate +' '+this.secondDeliveryDate);

  }


  get_All_prescriptions() {
    this._cartService.get_prescription().subscribe((res: any) => {

      if (Object.keys(res.data.result).length === 0 && res.data.result.constructor === Object) {
        this.prescription_id = '';
        this.prescriptionImageURLArray = [];
      }
      else{
        console.log(res, "lkzlskdjsdfhjdnbilhndfbfbdfgdfgdfgdfg");
        this.prescription_id = res.data.result._id;
        if (res.data.result.prescription.length > 0) {
          this.prescriptionImageURLArray = res.data.result.prescription;
        }
      }
    })
  }

  redirectToWishListPage() {
    this._router.navigate(['/short-list'])
  }

  getcartinfo_without_login() {
    this._cartService.get_cart_info_without_login().subscribe((res: any) => {
      console.log(res);
      this.bannerImage = res.data.subscriptionAd.image;
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
        this.cartList = res.data[1].subscriptionCart.products;
        this.bannerImage = res.data[1].subscriptionCart.subscriptionAd.image;
        this.cartDetails = res.data[1].subscriptionCart.cartDetails;
        this.deliveryDetails = res.data[1].subscriptionCart.deliveryDetails;
        this.prescriptionEnable = res.data[1].subscriptionCart.prescriptionEnable;
        this.availableCoupon = res.data[1].subscriptionCart.availableCoupons;
        console.log(this.availableCoupon);
        this.generateNextDeliveryDate();
        //check chether address id available or not
        if (Object.keys(res.data[1].subscriptionCart.address).length === 0 && res.data[1].subscriptionCart.address.constructor === Object) {
          this.customerAddress = '';
          console.log(this.customerAddress);
        }
        else {
          this.customerAddress = res.data[1].subscriptionCart.address;
          //this.userAddresses.push(res.data[0].medCart.address)
        }

        if (Object.keys(res.data[1].subscriptionCart.userAppliedCoupon).length === 0 && res.data[1].subscriptionCart.userAppliedCoupon.constructor === Object) {
          this.couponCode = ''
        }
        else {
          this.couponCode = res.data[1].subscriptionCart.userAppliedCoupon
        }


        this.prescriptionProvidedFlag = this.cartDetails.isPrescriptionProvided;
        this.totalPrescriptionCount = this.cartDetails.totalCountOfProductsThatRequirePrescription;
        if(this.totalPrescriptionCount==0){
          this.prescriptionFlag = false;
        }
        this.handPickList = res.data[1].subscriptionCart.handPicks;
      }
    })
  }

  removeFromCart(id, productid, array) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#3085d6',
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


  decrement(cart) {
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
            this._toasterService.info(res.message, '', {
              timeOut: 10000,
              positionClass: 'toast-bottom-right',
              closeButton: true
            })
            this.ngOnInit();
          }
          else {
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

        this._cartService.updateQuantity(cart, cart.quantity);
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
          this._toasterService.info(res.message, '', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right',
            closeButton: true
          })
          this.ngOnInit();
        }
        else {
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
      this._cartService.updateQuantity(cart, cart.quantity)
      this._cartService.setCartAMountDetails(this.cartList, 'add');
      this.cartDetails.totalAmountToBePaid = this._cartService.cartTotalAmount;
      this.cartDetails.totalCartValue = this._cartService.cartTotalAmount;
      this.cartDetails.totalRealCartValue = this._cartService.cartTotalAmount;
    }
  }

  copyToClipBoard(code) {
    this._clipboardService.copyFromContent(code);
  }

  selectCoupon(i) {
    this.couponForm.patchValue({
      coupon: i.code,
      percentage: 120
    });
  }

  applyCoupon() {
    if (this.couponForm.invalid) {
      return;
    }
    let input = {
      "couponCode": this.couponForm.get('coupon').value,
      "couponType": "subscription"
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

  removeCoupon(id) {
    this.couponForm.patchValue({
      coupon: ''
    });
    let data = {
      "couponId": id
    }
    this._cartService.remove_coupon_from_cart(data).subscribe((res: any) => {
      console.log(res)
      if (!res.error) {
        this.getCartDetails();
        this.couponCode = '';
        this.attemptedSubmit = false;
        Swal.fire({
          icon: 'success',
          text: res.message,
          showConfirmButton: true,
        });
      }
      else {
        this.getCartDetails();
        Swal.fire({
          icon: 'success',
          text: res.message,
          showConfirmButton: true,
        });
        this.cartDetails.couponAppliedDiscount = '';
        this.couponCode = '';
        this.attemptedSubmit = false;
      }
    })
  }


  isValidnewCoupon(controlName: any) {
    return (
      (this.couponForm.get(controlName)!.invalid &&
        this.couponForm.get(controlName)!.touched) ||
      (this.attemptedSubmit && this.couponForm.get(controlName).invalid)
    );
  }

  clickToLike(variantID, productId) {
    if (localStorage.getItem('token')) {
      let input = {
        'varientId': variantID,
        'productId': productId,
      }
      this._landingService.updateFavourite(input).subscribe((res: any) => {
        console.log(res);
        if (!res.error) {
          Swal.fire({
            icon: 'success',
            title: res.message,
            showConfirmButton: true,
          });
          this.getWishListCount();
          this.getCartDetails();
        }
        else {
          Swal.fire({
            icon: 'warning',
            title: res.message,
            showConfirmButton: true,
          });
        }
      })
    }
    else {
      this.likeFlag = false;
      Swal.fire({
        text: 'You are not loggined',
        titleText: 'Please Login',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 1000,
      });
    }

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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#3085d6',
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
              document.getElementById('popup-select-address').click();
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
            title: 'successfully selected',
          }).then(() => {
            this.getUserAddress();
            this.ngOnInit();
            document.getElementById('dismiss-select-address').click();
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
    // this.update_Modal_Flag = true;
    this.navigateToAddForm(number);
  }
  navigateToAddForm(num) {
    if (!this.update_Modal_Flag) {
      this.newAddressForm.reset();
      document.getElementById('dismiss-select-address').click();
      document.getElementById('popup-add-address').click();
    } else {
      this.patchAddForm(num);
      document.getElementById('dismiss-select-address').click();
      document.getElementById('popup-add-address').click();

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






  Get_Health_Vault_Data() {

    this.get_All_prescriptions();
    this.healthdataClicked = !this.healthdataClicked;
    // document.getElementById('dismiss-upload-prescription').click()
   
    this.Health_Vault_Service.get_user_health_vault().subscribe((res: any) => {
      console.log(res, "health vault data");
      this.Health_Data_Alert_Flag = false
      this.Health_Vault_Array = []
      this.Health_Vault_Array = res.data;
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
      

    })

  }

  Select_Health_Data(event: any, item) {
    if (event.target.checked) {
      console.log(item);
      // this.Health_Data_Image = null
      // this.Health_Data_Alert_Flag = false
      //this.Health_Data_Image = item.prescription
      this.prescriptionHealthDataURLArray.push(item.prescription)
      this.prescriptionImageURLArray.push(item.prescription)
      console.log(this.prescriptionHealthDataURLArray)
      // this.uploadForm.patchValue({
      //   "healthdata": this.Health_Data_Image,
      // })
    }
    else {
      let data: any = [];
     // data = this.prescriptionHealthDataURLArray.filter((res: any) => res != item.prescription);
      data = this.prescriptionImageURLArray.filter((res: any) => res != item.prescription);

      console.log(data);
      this.prescriptionImageURLArray = data;
    }

  }

 

  Upload_Priscription_Form_Close() {
    if (this.Ts_Click == false) {
      // this.uploadForm.reset()
      //this.Health_Data_Image = null
    }
  }

  onChangeUploadPrescription(event: any) {

      const reader = new FileReader();
      const file = event.target.files[0];
      const formdata = new FormData

      reader.readAsDataURL(file);
      const Img = new Image();
      Img.src = URL.createObjectURL(file);
      this.imageLoading = true;

      Img.onload = (e: any) => {
        let content = reader.result as string;
        let presPath = content;

        formdata.append('prescription', file)
        this._cartService.upload_image(formdata).subscribe((res: any) => {
          console.log(res, "img change res eredefsdf");
          this.prescriptionImageURLArray.push(res.data.images[0]);
          console.log(this.prescriptionImageURLArray)
          this.imageLoading = false;
        })

        // this.prescriptionImageFileArray.push(file);
        console.log(this.prescriptionImageURLArray)
        // console.log(this.prescriptionImageFileArray)
        this.prescriptionData = file;
        this.prescriptionUploadedFlag = false;
        this.Health_Data_Image = '';
      };
  }


  removePrescription(index) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {

        let data: any = [];
        data = this.prescriptionImageURLArray.filter((res: any) => res != index);
        this.prescriptionImageURLArray = data;
        console.log(data, "updated array");
        let input = {
          prescription: this.prescriptionImageURLArray
        }
        this._cartService.update_prescription(this.prescription_id, input).subscribe((res: any) => {
          console.log(res);
          if (!res.error) {
            this.getCartDetails();
            this.get_All_prescriptions();
            Swal.fire({
              icon: 'success',
              title: res.message,
            });
            document.getElementById('dismiss-upload-prescription').click()
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });



  }

  uploadPrescription() {


    if (this.prescriptionData != '' && this.prescriptionFlag) {
      const formData = new FormData();

      formData.append('prescription', this.prescriptionData);
      this._cartService.add_prescription(formData).subscribe((res: any) => {
        console.log(res);
        if (!res.error) {
          this.getCartDetails();
          Swal.fire({
            icon: 'success',
            title: res.message,
          });
          document.getElementById('dismiss-upload-prescription').click()
        }
        else {
          this.prescriptionData = '';
          Swal.fire({
            icon: 'warning',
            title: res.message,
          });
          document.getElementById('dismiss-upload-prescription').click()
        }
      })
    }

    else if (this.prescriptionData === '' && this.prescriptionFlag) {
      // this.prescriptionFlag = false;
      this.prescriptionData = '';
      this.prescriptionUploadedFlag = true;
    }
    else {
      if (!this.prescriptionFlag) {
        this.prescriptionFlag = false;
        document.getElementById('dismiss-upload-prescription').click()
      }
    }
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

  data: any
  finalSubmit() {
    if (this.intervalForm.invalid) {
      Swal.fire({
        icon: 'warning',
        text: "Please choose interval",
        showConfirmButton: true,
      });
      return;
    } else {
     
        if (this.prescriptionImageURLArray.length != 0) {
          this.data = {
            prescription: this.prescriptionImageURLArray
          }
        } else if (this.prescriptionHealthDataURLArray.length != 0) {
          this.data = {
            prescription: this.prescriptionHealthDataURLArray
          }
        }
        console.log(this.data,"passing data 123");

        if (this.prescription_id) {
          this._cartService.update_prescription(this.prescription_id, this.data).subscribe((res: any) => {
            console.log(res);
            this.prescriptionImageURLArray = []
            this.prescriptionHealthDataURLArray = []
          })

        } else {
          // if (this.prescriptionImageURLArray.length != 0) {
          //   this.data = {
          //     prescription: this.prescriptionImageURLArray
          //   }
          // } else if (this.prescriptionHealthDataURLArray.length != 0) {
          //   this.data = {
          //     prescription: this.prescriptionHealthDataURLArray
          //   }
          // }
          this._cartService.add_prescription(this.data).subscribe((res: any) => {
            console.log(res);
            this.prescriptionImageURLArray = []
            this.prescriptionHealthDataURLArray = []
          })
        }
      }





    sessionStorage.setItem('interval',this.intervalForm.get('interval').value);
    sessionStorage.setItem('iDontHaveAPrescription',JSON.stringify(!this.prescriptionFlag));
    if (this.totalPrescriptionCount != 0) {
      if (this.prescriptionProvidedFlag) {
          console.log(this.prescriptionFlag);

          document.getElementById('dismiss-sumbit-popup').click()
  
          if (this.cartDetails.isThisCartIsEligibleForPurchase && this.customerAddress != '' && this.deliveryDetails.isThisProductDeliverable) {
            this._router.navigate(['/review-subscription']);
          }
          else {
            if (!this.cartDetails.isThisCartIsEligibleForPurchase) {
              this.checking('deliveryeligible');//checking Delivery
            }
            else if (this.customerAddress == '') {
              this.checking('address'); //checking eligible delivery
            }
            else if (!this.deliveryDetails.isThisProductDeliverable) {
              this.checking('pincode'); //checking address
  
            }
          }
      

      }
      else {
        console.log(this.prescriptionFlag);
        if(this.prescriptionFlag && this.prescriptionImageURLArray.length==0){
          //document.getElementById('dismiss-sumbit-popup').click()
          Swal.fire({
            icon: 'warning',
            title: 'Please upload prescription',
          });
        }
        else{
          document.getElementById('dismiss-sumbit-popup').click()
          this._router.navigate(['/review-subscription']);
        }
       
      }
    }
    else {
      document.getElementById('dismiss-sumbit-popup').click()
      console.log(this.prescriptionFlag);

      if (this.cartDetails.isThisCartIsEligibleForPurchase && this.customerAddress != '' && this.deliveryDetails.isThisProductDeliverable) {
        this._router.navigate(['/review-subscription']);
      }
      else {
        if (!this.cartDetails.isThisCartIsEligibleForPurchase) {
          this.checking('deliveryeligible');//checking Delivery
        }
        else if (this.customerAddress == '') {
          this.checking('address'); //checking eligible delivery
        }
        else if (!this.deliveryDetails.isThisProductDeliverable) {
          this.checking('pincode'); //checking address

        }

      }


    }
  }
  //checking before submission

  checking(type) {
    switch (type) {
      case 'deliveryeligible':
        if (this.cartDetails.isThisCartIsEligibleForPurchase) { //checking Cart is eligible for purchase
          // this._router.navigate(['/add-subscription']);
           this._router.navigate(['/review-subscription']);
        }
        else {
          Swal.fire({
            icon: 'warning',
            title: 'Your total cart value is less than minimum purchase amount !!!!',
            text: '(Minimum purchase amount is Rs.'+this.cartDetails.minimumPurchaseAmount+')'
          });
        } break;

      case 'address':

        if (this.customerAddress != '') {
          this._router.navigate(['/review-subscription']);
        }
        else {
          Swal.fire({
            icon: 'warning',
            title: 'Please provide address !!',
          });
        }
        break;

      case 'pincode':

        if (this.deliveryDetails.isThisProductDeliverable) { //checking Delivery 
           this._router.navigate(['/review-subscription']);
        }
        else {
          Swal.fire({
            icon: 'warning',
            title: this.deliveryDetails.message,
          });
        }
        break;
    }
  }

  currLat;

  currLng;
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {

        this.currLat = position.coords.latitude;
        this.currLng = position.coords.longitude;
        console.log(this.currLat, 'Lat');
        console.log(this.currLng, 'Long');
      });
    }
    else {
      alert("Geolocation is not supported by this browser.");
    }
  }


  Continue_Btn_Pop() {
    //  this.intervalForm.patchValue({
    //   interval:''
    //  })
    // this.prescriptionImageURLArray = []
    // this.prescriptionImageFileArray=[]

    // this.Health_Data_Image = false;
    // this.prescriptionUploadedFlag = false
    // this.prescriptionFlag = true;
    // this.prescriptionChoosed = false;
  }



  changeInterval(event: any, interval: any) {
    console.log(interval, "interval 123");

    if (event.target.checked) {
      this.intervalForm.patchValue({
        interval: interval
      })
      this.generateNextDeliveryDate();

    }
  }

  ChangePrescriptionSelected(event) {
    console.log(event);

    if (event.target.value == 'I have a Prescription') {
      this.prescriptionFlag = true;
      this.prescriptionChoosed = true;
    }
    else {
      this.prescriptionFlag = false;
      this.prescriptionChoosed = false;
      this.prescriptionUploadedFlag = false
    }
  }

  prescriptionContainClick(){
    this.containFlag = !this.containFlag;
  }



  //Cart empty prescription upload

  Health_Data_Continue_Click() {
    console.log(this.prescriptionImageURLArray)

    if(this.Health_Vault_Array.length==0){
      this.attemptedSubmit = false;
      document.getElementById('dismiss-select-health-data').click()
      return;
    }

      let data = {
        prescription: this.prescriptionImageURLArray
      }
      if (this.prescription_id) {
        this._cartService.update_prescription(this.prescription_id, data).subscribe((res: any) => {
          console.log(res);
          if (!res.error) {
            Swal.fire({
              icon: 'success',
              title: 'Health data update successfully',
            });
            document.getElementById('dismiss-select-health-data').click()
          }
        })
  
      } else {
        this._cartService.add_prescription(data).subscribe((res: any) => {
          console.log(res);
          if (!res.error) {
            Swal.fire({
              icon: 'success',
              title: 'Health data added successfully',
            });
            document.getElementById('dismiss-select-health-data').click()
          }
        })
      }

   


  }
  prescriptionGuidClick(){
    this.containGuidFlag = !this.containGuidFlag;
  }

  uploadPrescriptionWithCartEmpyy(){
    console.log(this.prescriptionImageURLArray)

    if(this.prescriptionImageURLArray.length==0){
      this.attemptedSubmit = false;
      Swal.fire({
        icon: 'warning',
        title: 'Please upload prescription'
      });
      return;
    }

    let data = {
      prescription: this.prescriptionImageURLArray
    }

    this._cartService.update_prescription(this.prescription_id, data).subscribe((res: any) => {
      console.log(res);
      if (!res.error) {
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
        document.getElementById('dismiss-uploademptycart-prescription').click()
      }
    })

  }

  get_health_data(){

    if(this.token){
      this.get_All_prescriptions();
      this.healthdataClicked = !this.healthdataClicked;
      // document.getElementById('dismiss-upload-prescription').click()
     
      this.Health_Vault_Service.get_user_health_vault().subscribe((res: any) => {
        console.log(res, "health vault data");
        this.Health_Data_Alert_Flag = false
        this.Health_Vault_Array = []
        this.Health_Vault_Array = res.data;
       
          this.prescriptionImageURLArray.forEach((pres :any,ind:any) => {
            this.Health_Vault_Array.forEach((element :any,index:any) => {
              if(pres === element.prescription){
                  element.checkedFlag = true;
              }
            });
          });
        
  
      })
    }
 
  }


}
