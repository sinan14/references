import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { HeaderService } from 'src/app/services/header.service';
import { UserDashboardService } from 'src/app/services/user-dashboard.service';
import Swal from 'sweetalert2';
import { ClipboardService } from 'ngx-clipboard';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
// import { ExternalLibraryService } from '../order-review/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { PremiumMembershipService } from '../services/premium-membership.service';
import { DomSanitizer } from '@angular/platform-browser';

//declare var Razorpay: any;
@Component({
  selector: 'app-med-prime-membership',
  templateUrl: './med-prime-membership.component.html',
  styleUrls: ['./med-prime-membership.component.css'],
})
export class MedPrimeMembershipComponent implements OnInit {
  public razorPayKey = environment.razorPayKey;
  response;
  razorpayResponse;
  showModal = false;

  myBenefits: any = false;

  public viewTerms: boolean = false;
  public userName: any;
  public userImage: any;
  public subscriptionID: any = '';
  public paymentType: any = '';
  public premiumList: any = [];
  public bannersList: any = [];
  public termsConditions: any = '';
  public personal_info: any;

  public couponForm: FormGroup;
  public availableCoupon: any = [];
  public attemptedSubmit: boolean = false;
  public Selected_Coupon: any;
  public premiumUser: boolean = false;
  public couponCode: any;

  public showContent: boolean = false;
  public type: any;

  public showTerms: boolean = false;
  public typeTerms: any;

  constructor(
    private _paymentService: PaymentService,
    private Header_Service: HeaderService,
    public _router: Router,
    private _clipboardService: ClipboardService,
    private cd: ChangeDetectorRef,
    // private razorpayService: ExternalLibraryService,
    public _userDashboardService: UserDashboardService,
    private fb: FormBuilder,
    private _cartService: CartService,
    private _premiumService: PremiumMembershipService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // this.razorpayService
    //   .lazyLoadLibrary('"https://checkout.razorpay.com/v1/checkout.js')
    //   .subscribe();

    // const items = document.querySelectorAll('.accordion a');

    // function toggleAccordion() {
    //   this.classList.toggle('active');
    //   this.nextElementSibling.classList.toggle('active');
    // }

    // items.forEach((item) => item.addEventListener('click', toggleAccordion));

    this.getPremiumDetails();
    //this.get_User_details();
    this.getPersonalDetails();

    this.couponForm = this.fb.group({
      coupon: ['', Validators.required],
      percentage: [''],
      id: ['', Validators.required],
    });
  }

  expand(num: any) {
    if (num === 'p1') {
      this.type = num;
      this.showContent = !this.showContent;
    } else if (num === 'p2') {
      this.type = num;
      this.showContent = !this.showContent;
    } else if (num === 'p3') {
      this.type = num;
      this.showContent = !this.showContent;
    } else if (num === 'p4') {
      this.type = num;
      this.showContent = !this.showContent;
    } else if (num === 'p5') {
      this.type = num;
      this.showContent = !this.showContent;
    } else if (num === 'p6') {
      this.type = num;
      this.showContent = !this.showContent;
    } else if (num === 'p7') {
      this.type = num;
      this.showContent = !this.showContent;
    } else if (num === 'p8') {
      this.type = num;
      this.showContent = !this.showContent;
    } else if (num === 'p9') {
      this.type = num;
      this.showContent = !this.showContent;
    }
  }

  termsConditionClicked(type) {
    this.showTerms = !this.showTerms;
    this.typeTerms = type;
  }
  viewTermsCondition() {
    this.viewTerms = !this.viewTerms;
  }

  getPersonalDetails() {
    this._userDashboardService.getPersonalInfo().subscribe(
      (res: any) => {
        if (res.error == false) {
          this.personal_info = res.data;
          //console.log(this.personal_info);
        } else {
          //console.log('onh no error');
        }
      },
      (error: any) => {
        //console.log('oh no error occure from server');
        //console.log(error);
      }
    );
  }

  // get_User_details() {
  //   this.Header_Service.get_User_details().subscribe((res: any) => {
  //     //console.log(res.data);
  //     sessionStorage.setItem('userDetails', JSON.stringify(res.data));
  //     this.userName = res.data.userName;
  //     this.userImage = res.data.userImage;
  //   });
  // }

  getPremiumDetails() {
    this._paymentService.fetchPremiumBenefitDetails().subscribe((res: any) => {
      //console.log(res);
      this.premiumUser = res.data.premiumUser;

      if (this.premiumUser) {
        this.fetchUserPremiumDetails();
      }
      this.premiumList = res.data.premium_packages;
      this.bannersList = res.data.banners;
      this.termsConditions = res.data.termsAndConditions.description;
      this.availableCoupon = res.data.scratchableAndUpComingCoupons;
      //console.log(this.termsConditions);

      //check whether coupon applied or not
      if (
        Object.keys(res.data.userAppliedCoupon).length === 0 &&
        res.data.userAppliedCoupon.constructor === Object
      ) {
        this.couponCode = '';
      } else {
        this.couponCode = res.data.userAppliedCoupon;
      }
    });
  }

  RAZORPAY_OPTIONS = {
    key: 'rzp_test_TkVZ67cMhp3tjH',
    subscription_id: this.subscriptionID,
    name: 'Acme Corp',
    amount: '',
    description: 'Test Transaction',
    image: 'https://example.com/your_logo',
    callback_url: 'https://eneqd3r9zrjok.x.pipedream.net/',
    handler: function (response, error) {
      //console.log(response);
      //console.log(error);
    },
    prefill: {
      name: 'Gaurav Kumar',
      email: 'gaurav.kumar@example.com',
      contact: '9999999999',
    },
    notes: {
      address: 'Razorpay Corporate Office',
    },
    theme: {
      color: '#3399cc',
    },
    // "external": {
    //   "wallet":['paytm']
    // }
  };
  @HostListener('window:payment.success', ['$event'])
  public proceed(amnt: any, premiumtype) {
    this.RAZORPAY_OPTIONS.name =
      this.personal_info.name + ' ' + this.personal_info.surname;
    this.RAZORPAY_OPTIONS.image = this.userImage;
    this.RAZORPAY_OPTIONS.description = premiumtype + ' Membership';
    this.RAZORPAY_OPTIONS.prefill.name = this.personal_info.name;
    this.RAZORPAY_OPTIONS.prefill.email = this.personal_info.email;
    this.RAZORPAY_OPTIONS.prefill.contact = this.personal_info.phone;
    this.RAZORPAY_OPTIONS.subscription_id = this.subscriptionID;
    this.RAZORPAY_OPTIONS.amount = amnt + '.00';

    // binding this object to both success and dismiss handler
    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

    // this.showPopup();

    let razorpay = new this._paymentService.nativeWindow.Razorpay(
      this.RAZORPAY_OPTIONS
    );

    razorpay.open();

    // razorpay.on('payment.success',(response)=>{
    //   //console.log(response);
    // });
  }

  public razorPaySuccessHandler(response) {
    //console.log(response);
    //console.log(response.razorpay_signature);
    if (response) {
      this.checkout(response);
      // this.razorpayResponse = `Razorpay Response`;
      // this.showModal = true;
      // this.cd.detectChanges()
      // document.getElementById('razorpay-response').style.display = 'block';
    }
  }

  checkout(data) {
    let input = {
      paymentId: data.razorpay_payment_id,
      razorPaySignature: data.razorpay_signature,
      subscriptionId: this.subscriptionID,
    };

    //console.log(input);

    this._paymentService
      .verify_subscription_payment(input)
      .subscribe((res: any) => {
        //console.log(res);
        if (!res.error) {
          Swal.fire({
            icon: 'success',
            title: res.message,
          }).then(() => {
            window.location.reload();
            this.getPremiumDetails();
          });
        }
      });
  }

  chooseMembership(value: any, index: any) {
    if (value === 'GOLD') {
      let input = {
        planName: 'GOLD',
        couponId: this.couponForm.get('id').value
          ? this.couponForm.get('id').value
          : null,
      };

      this._paymentService.purchase_membership(input).subscribe((res: any) => {
        //console.log(res);
        if (!res.error) {
          this.subscriptionID = res.data.subscriptionId;
          this.paymentType = res.data.paymentGateway;
          if (index.discountPrice) {
            this.proceed(index.discountPrice, index.name);
          } else {
            this.proceed(index.specialPrice, index.name);
          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: res.message,
          });
        }
      });
    } else if (value === 'PLATINUM') {
      let input = {
        planName: 'PLATINUM',
        couponId: this.couponForm.get('id').value
          ? this.couponForm.get('id').value
          : null,
      };

      this._paymentService.purchase_membership(input).subscribe((res: any) => {
        //console.log(res);
        if (!res.error) {
          this.subscriptionID = res.data.subscriptionId;
          this.paymentType = res.data.paymentGateway;
          if (!index.discountPrice) {
            this.proceed(index.specialPrice, index.name);
          } else {
            this.proceed(index.discountPrice, index.name);
          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: res.message,
          });
        }
      });
    }
  }

  //COUPON CODE FUNCTIONS

  selectCoupon(i) {
    this.Selected_Coupon = i;
    this.couponForm.patchValue({
      coupon: i.code,
      percentage: 120,
      id: i._id,
    });
  }

  copyToClipBoard(code) {
    this._clipboardService.copyFromContent(code);
  }

  isValidnewCoupon(controlName: any) {
    return (
      (this.couponForm.get(controlName)!.invalid &&
        this.couponForm.get(controlName)!.touched) ||
      (this.attemptedSubmit && this.couponForm.get(controlName).invalid)
    );
  }

  applyCoupon() {
    //console.log(this.Selected_Coupon, 'APPLY CODE FUNCTION');
    let input = {
      couponId: this.couponForm.get('id').value,
    };

    this._paymentService.add_premium_coupons(input).subscribe((res: any) => {
      //console.log(res);
      if (!res.error) {
        res.data.validPremiumCard.forEach((element) => {
          if (element.error) {
            Swal.fire({
              icon: 'warning',
              title: element.message,
            });
          } else {
            this.premiumList = res.data.validPremiumCard;
            //console.log(this.premiumList);
            Swal.fire({
              icon: 'success',
              title: 'Applied Successfully',
            }).then((res) => {
              this._paymentService
                .fetchPremiumBenefitDetails()
                .subscribe((res: any) => {
                  //console.log(res);
                  //check whether coupon applied or not
                  if (
                    Object.keys(res.data.userAppliedCoupon).length === 0 &&
                    res.data.userAppliedCoupon.constructor === Object
                  ) {
                    this.couponCode = '';
                  } else {
                    this.couponCode = res.data.userAppliedCoupon;
                  }
                });

              document.getElementById('dismiss-coupon-form').click();
            });
          }
        });
      } else {
        this.couponForm.get('coupon').setValue('');
        // this.premiumList = res.data.validPremiumCard;
        //console.log(this.premiumList);
        Swal.fire({
          icon: 'warning',
          title: 'Invalid coupon code!!!',
        });
      }
    });
  }

  removeCoupon() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Applied coupon will be removed !!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        let input = {
          couponId: this.couponCode.couponId,
        };

        this._paymentService
          .remove_premium_coupons(input)
          .subscribe((res: any) => {
            //console.log(res);
            if (!res.error) {
              Swal.fire({
                icon: 'success',
                title: res.message,
              }).then(() => {
                window.location.reload();
              });
              // res.data.validPremiumCard.forEach((element) => {
              //   if (element.error) {
              //     Swal.fire({
              //       icon: 'success',
              //       title: element.message,
              //     });
              //     this.couponForm.get('coupon').setValue('');
              //     this.getPremiumDetails();
              //   } else {
              //     this.premiumList = res.data.validPremiumCard;
              //     //console.log(this.premiumList);
              //     Swal.fire({
              //       icon: 'success',
              //       title: 'Removed Successfully',
              //     }).then((res) => {
              //       this.couponForm.get('coupon').setValue('');
              //       this.getPremiumDetails();
              //       document.getElementById('dismiss-coupon-form').click();
              //     });
              //   }
              // });
            } else {
              this.couponForm.get('coupon').setValue('');
              this.getPremiumDetails();
              // this.premiumList = res.data.validPremiumCard;
              //console.log(this.premiumList);
              Swal.fire({
                icon: 'warning',
                title: res.message,
              });
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        document.getElementById('dismiss-coupon-form').click();
      }
    });

    //console.log(this.Selected_Coupon, 'APPLY CODE FUNCTION');
  }

  fetchUserPremiumDetails() {
    this._premiumService.get_user_membership_benefits().subscribe(
      (res: any) => {
        //console.log(res);
        if (res.status == true) {
          this.myBenefits = JSON.parse(JSON.stringify(res.data));
          this.myBenefits.freeDeliveryUsed =
            this.myBenefits.allottedFreeDelivery - this.myBenefits.freeDelivery;

          this.myBenefits.fakeArray = Array(
            this.myBenefits.allottedFreeDelivery
          ).fill(1);
          // .map((x, i) => i + 1); /*[1,2,3,4,5]*/
        } else {
        }
      },
      (error: any) => {
        //console.log('error.error');
      }
    );
  }
}
