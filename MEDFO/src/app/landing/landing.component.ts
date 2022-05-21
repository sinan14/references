import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LandingService } from 'src/app/services/landing.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from 'src/app/services/cart.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { ToastrService } from 'ngx-toastr';
import { OrderMedicineService } from '../services/order-medicine.service';
// import Player from '@vimeo/player';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { HealthVaultService } from '../services/health-vault.service';
import { ClipboardService } from 'ngx-clipboard';
import {
  FormControl,
  FormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, AfterViewInit {
  setOptions() {
    this.optionsTestimonial = {
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      dots: false,
      autoplay: true,
      nav: false,
      autoplayHoverPause: true,
      animateOut: 'slideOutUp',
      animateIn: 'slideInUp',
      loop: true,
      margin: 1,
      responsive: {
        0: {
          items: 2,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 6,
        },
      },
    };
  }
  optionsTestimonial: any;

  public containGuidFlag: boolean = false;
  phoneValidForm: FormGroup;
  public attemptSubmitted: boolean = false;
  public hasError: boolean = false;

  public vimeoVideoHOwTo: any;
  public token: any;
  public timeEnd: any;
  public categoriesToBag: any = [];
  public customers: any = [];
  public featuredBrands: any = [];
  public mainSlider: any = [];
  public offers: any = [];
  public popularProducts: any = [];
  public shopConcern: any = [];
  public slider: any = [];
  public medArticles: any = [];
  public hotDeals: any = [];
  public hotDealsProducts: any = [];
  public test: any;
  public end: any;
  public hour: any = '';
  public min: any;
  public medicineName: any;
  public orderMedicineVideoLink: any = '';
  public likeFlag: boolean = false;
  public healthdataClicked: boolean = false;

  public endingTime: any = '';

  topCategories: any = [];
  topBrands: any = [];
  topSellingProducts: any = [];
  mostSearchedHealthCareProducts: any = [];
  mostSearchedBrands: any = [];
  mostViewedArticles: any = [];

  //Prescription Variables
  public prescriptionImageURLArray: any = [];
  public prescription_id: any;
  public Health_Vault_Array: any = [];
  public imageLoading: boolean = false;

  //carrousal options

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };

  // shopConcerncustomOptions: OwlOptions = {
  //   loop: false,
  //   autoplay: true,
  //   autoplayHoverPause: true,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   pullDrag: true,
  //   dots: false,
  //   navSpeed: 700,
  //   navText: [
  //     "<i class='fa fa-angle-left'></i>",
  //     "<i class='fa fa-angle-right'></i>",
  //   ],
  //   responsive: {
  //     0: {
  //       items: 4,
  //     },
  //     400: {
  //       items: 4,
  //     },
  //     740: {
  //       items: 4,
  //     },
  //     940: {
  //       items: 9,
  //     },
  //   },
  //   nav: false,
  // };

  // categoriesToBagcustomOptions: OwlOptions = {
  //   loop: false,
  //   mouseDrag: true,
  //   autoplay: true,
  //   dots: false,
  //   navSpeed: 700,
  //   navText: [
  //     "<i class='fa fa-angle-left'></i>",
  //     "<i class='fa fa-angle-right'></i>",
  //   ],
  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     400: {
  //       items: 1,
  //     },
  //     740: {
  //       items: 2,
  //     },
  //     940: {
  //       items: 9,
  //     },
  //   },
  //   nav: false,
  // };

  hotDealscustomOptions: OwlOptions = {
    items: 6,
    loop: false,
    dots: false,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 6,
      },
    },
    nav: true,
  };

  slidercustomOptions: OwlOptions = {
    loop: false,
    autoplay: true,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 2,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };

  // offerscustomOptions: OwlOptions = {
  //   loop: false,
  //   autoplay: true,
  //   autoplayHoverPause: true,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   pullDrag: true,
  //   dots: false,

  //   navText: [
  //     "<i class='fa fa-angle-left'></i>",
  //     "<i class='fa fa-angle-right'></i>",
  //   ],
  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     400: {
  //       items: 1,
  //     },
  //     740: {
  //       items: 2,
  //     },
  //     940: {
  //       items: 3,
  //     },
  //   },
  //   nav: false,
  // };
  featurecustomOptions: OwlOptions = {
    loop: false,
    autoplay: true,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 8,
      },
      400: {
        items: 8,
      },
      740: {
        items: 2,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };

  healthcustomOptions: OwlOptions = {
    loop: false,
    autoplay: true,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 3,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };

  // blogcustomOptions: OwlOptions = {
  //   loop: false,
  //   autoplay: true,
  //   autoplayHoverPause: true,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   pullDrag: true,
  //   dots: false,
  //   navSpeed: 700,
  //   navText: [
  //     "<i class='fa fa-angle-left'></i>",
  //     "<i class='fa fa-angle-right'></i>",
  //   ],
  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     400: {
  //       items: 1,
  //     },
  //     740: {
  //       items: 2,
  //     },
  //     940: {
  //       items: 6,
  //     },
  //   },
  //   nav: false,
  // };

  megaBagcustomOptions: OwlOptions = {
    loop: true,
    autoplay: false,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 1000,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 2,
      },
      940: {
        items: 3,
      },
    },
    nav: false,
  };

  constructor(
    private _landingService: LandingService,
    public _location: Location,
    public _router: Router,
    public _cartService: CartService,
    public _prescriptionService: PrescriptionService,
    public _toasterService: ToastrService,
    public orderMedi: OrderMedicineService,
    public _sanitizer: DomSanitizer,
    private Health_Vault_Service: HealthVaultService,
    private _clipboardService: ClipboardService
  ) {
    this.token = localStorage.getItem('token');

    this.phoneValidForm = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    });

    //cart Count
    if (this.token != null) {
      this._cartService.get_Cart_Count();
    } else {
      this._cartService.getLocalCart();
    }
  }

  ngOnInit(): void {
    $('.scroll-top').on('click', function (e) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: 4 }, 1200);
    });

    this.setOptions();
    //localStorage.setItem('CartItem','')
    this.token = localStorage.getItem('token');
    this.getAllDetails();
    this.textAnimation();
    this.get_All_prescriptions();

    $(window).scroll(function () {
      //Checking if each items to animate are
      //visible in the viewport
      $('h2[data-max]').each(function () {
        inVisible($(this));
      });
    });

    function inVisible(element) {
      //Checking if the element is
      //visible in the viewport
      var WindowTop = $(window).scrollTop();
      var WindowBottom = WindowTop + $(window).height();
      var ElementTop = element.offset().top;
      var ElementBottom = ElementTop + element.height();
      //animating the element if it is
      //visible in the viewport
      if (ElementBottom <= WindowBottom && ElementTop >= WindowTop)
        animate(element);
    }

    function animate(element) {
      //Animating the element if not animated before
      if (!element.hasClass('ms-animated')) {
        var maxval = element.data('max');
        var html = element.html();
        element.addClass('ms-animated');
        $({
          countNum: element.html(),
        }).animate(
          {
            countNum: maxval,
          },
          {
            //duration 5 seconds
            duration: 5000,
            easing: 'linear',
            step: function () {
              element.html(Math.floor(this.countNum) + html);
            },
            complete: function () {
              element.html(this.countNum + html);
            },
          }
        );
      }
    }
  }

  alphaNumberOnly(e) {
    // Accept only alpha numerics, not special characters
    var regex = new RegExp('^[0-9 ]+$');
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      this.hasError = true;
      return true;
    }

    this.hasError = false;
    e.preventDefault();
    return false;
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      //@ts-ignore
      $('#blogs').owlCarousel({
        items: 1,
        loop: false,
        pullDrag: true,
        mouseDrag: true,
        dots: true,
        autoplay: true,
        margin: 0,
      });
    });

    $(document).ready(function () {
      //@ts-ignore
      $('#sliders-ones').owlCarousel({
        loop: false,
        pullDrag: true,
        dots: false,
        autoplay: true,
        margin: 0,
        mouseDrag: true,
        touchDrag: true,
        nav: true,
        responsive: {
          0: {
            items: 2,
            loop: false,
          },
          600: {
            items: 2,
            loop: false,
          },
          1000: {
            items: 8,
            loop: false,
            nav: false,
          },
        },
      });
    });

    $(document).ready(function () {
      //@ts-ignore
      $('#hotdeal').owlCarousel({
        loop: false,
        dots: false,
        autoplay: true,
        pullDrag: true,
        mouseDrag: true,
        margin: 0,
        nav: true,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          1000: {
            items: 5,
          },
        },
      });
    });

    $(document).ready(function () {
      //@ts-ignore
      $('#try').owlCarousel({
        items: 1,
        autoplaySpeed: 15000,
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: true,
        margin: 25,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
      });
    });

    $(document).ready(function () {
      //@ts-ignore
      $('#try1').owlCarousel({
        items: 1,
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: true,
        margin: 50,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
      });
    });

    this.iphoneSlide();
  }

  getAllDetails() {
    this._landingService.getAll().subscribe((res: any) => {
      //console.log('helllllllllllllllll');
      //console.log(res);

      //this.setEndingTime(res.data.hotDeals[0].details.ending_date)
      if (res.data.hotDeals.length > 0) {
        this.end = res.data.hotDeals[0].details.ending_time
          ? res.data.hotDeals[0].details.ending_time
          : '';
        this.test = this.end.split(':');
        //console.log(this.test[0] + this.test[1]);
      }

      if (res.data.hotDeals.length > 0) {
        this.hotDealsProducts = res.data.hotDeals[0].products
          ? res.data.hotDeals[0].products
          : [];
        //console.log(this.hotDealsProducts);
      }
      this.categoriesToBag = res.data.categoriesToBag;
      this.customers = res.data.customers;
      const limit = 3;
      if (this.customers.length < limit && this.customers.length > 0) {
        //@ts-ignore
        this.customers.forEach((item) => {
          this.customers.push(item);
          //console.log(this.customers);
          if (this.customers.length > limit) {
            //console.log('limit exceeded');
            return true;
          }
        });
      }
      this.featuredBrands = res.data.featuredBrands;
      this.mainSlider = res.data.mainSlider.reverse();
      this.offers = res.data.offers;
      this.popularProducts = res.data.popularProducts;
      this.shopConcern = res.data.shopConcern;
      this.slider = res.data.slider;
      this.medArticles = res.data.medArticles;

      this.topCategories = res.data.topCategories ? res.data.topCategories : [];
      this.topBrands = res.data.topBrands ? res.data.topBrands : [];
      this.topSellingProducts = res.data.mostBuyedProducts
        ? res.data.mostBuyedProducts
        : [];
      this.mostSearchedHealthCareProducts = res.data.mostSearchedProducts
        ? res.data.mostSearchedProducts
        : [];
      this.mostSearchedBrands = res.data.mostSearchedBrands
        ? res.data.mostSearchedBrands
        : [];
      this.mostViewedArticles = res.data.mostViewedArticles
        ? res.data.mostViewedArticles
        : [];

      this.catSlide();
      this.shopBySlide();
      this.testimonialSlide();
      this.medArticleSlide();
      this.offersFromPayment();
      // this.orderMedicineVideoLink = res.data.orderMedicine[0].video;
      this.vimeoVideo(res.data.orderMedicine[0].video);
      if (res.data.hotDeals.length > 0) {
        this.hotDeals = res.data.hotDeals[0].details
          ? res.data.hotDeals[0].details
          : [];
      }

      this.hotDealsForYou();
      this.subSliders();

      var p = new Date(res.data.hotDeals[0].details.ending_date).toISOString();
      var t = new Date(p).getTime();

      var start = new Date(p);
      var datePipe = new DatePipe('en-US');
      var end = datePipe.transform(start, 'MMM dd, yyyy h:mm:ss a', 'UTC');
      //console.log(end, 'end');

      var countDownDate = new Date(end).getTime();
      // Set the date we're counting down to
      //var countDownDate = new Date('Jan 5, 2022 15:37:25').getTime();
      // Update the count down every 1 second
      var x = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // if(days>0 && hours>12){
        //   hours = hours + 12;
        // }
        this.hour = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
        //alert(this.endingTime)
        if (hours != null && minutes != null && seconds != null) {
          // Output the result in an element with id="demo"
          document.getElementById('demo').innerHTML =
            '<div class="hours">' +
            days +
            'd </div>' +
            '<div class="colon">:</div>' +
            '<div class="hours">' +
            hours +
            'h </div>' +
            '<div class="colon">:</div>' +
            '<div class="hours">' +
            minutes +
            'm </div>' +
            '<div class="colon">:</div>' +
            '<div class="hours">' +
            seconds +
            's </div>';
        }

        // document.getElementById("timing").innerHTML  = "<div>" + this.hour + "</div>";
        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval(x);
          document.getElementById('demo').innerHTML = 'EXPIRED';
        }
      });
    });
  }

  setEndingTime(time: any) {
    alert(this.hotDeals);
    var p = new Date(time).toISOString().split('T')[0];
    let dt: any = p + 'T' + time + ':00';
    //console.log(dt);
    var t = new Date(p).getTime();

    var start = new Date(dt);
    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(start, 'MM dd, yyyy hh:mm:ss', 'en-US');
    //console.log(end, 'end');

    var countDownDate = new Date(end).getTime();
    // Set the date we're counting down to
    //var countDownDate = new Date('Jan 5, 2022 15:37:25').getTime();
    // Update the count down every 1 second
    var x = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime();
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // if(days>0 && hours>12){
      //   hours = hours + 12;
      // }
      this.endingTime =
        days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    });
  }

  pleaseLoginPopup() {
    Swal.fire({
      text: 'Please login !!!',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      imageHeight: 1000,
    });
  }

  redirectBlog() {
    this._router.navigate(['/blog']);
  }

  redirectionTo(type: any, prod: any) {
    if (type === 'product') {
      let data = {
        id: prod.redirection_id,
      };
      this._landingService.getProductsList_by_ID(data).subscribe((res: any) => {
        //console.log(res.data.products);
        this._router.navigate([
          '/product-detail/',
          res.data.products.title,
          res.data.products._id,
          res.data.products.brand,
          res.data.products.metaTitles,
        ]);
      });
    } else if (type === 'category') {
      this._router.navigate([
        '/product-list/',
        prod.categoryId,
        prod.redirection_id,
        '',
      ]);
    }
  }

  redirectSlider(type: any, input: any) {
    if (type === 'product') {
      let data = {
        id: input.typeId,
      };
      this._landingService.getProductsList_by_ID(data).subscribe((res: any) => {
        //console.log(res.data.products);
        this._router.navigate([
          '/product-detail/',
          res.data.products.title,
          res.data.products._id,
          res.data.products.brand,
          res.data.products.metaTitles,
        ]);
      });
    } else if (type === 'category') {
      this._router.navigate([
        '/product-list/',
        input.categoryId,
        input.typeId,
        '',
      ]);
    }
  }

  openTermsConditions(terms: any) {
    // alert(terms)
    Swal.fire({
      text: terms,
      showConfirmButton: false,
      showCancelButton: false,
      width: 400,
      heightAuto: false,
      showCloseButton: true,
    });
  }

  addToCart(productID, variantId, index) {
    if (this.token != null) {
      let data = {
        product_id: productID,
        variantId: variantId,
        quantity: 1,
      };
      this._cartService.add_To_Cart(data).subscribe((res: any) => {
        //console.log(res);
        this._toasterService.info(res.message, '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
        this._cartService.get_Cart_Count_Only();
      });
    } else {
      this._cartService.Check_Cart_Item(productID);

      if (this._cartService.Item_Found_Flag == true) {
        this._toasterService.info('Product already exist in your cart.', '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
      } else if (this._cartService.Item_Found_Flag == false) {
        this._cartService.assignCartItem(index, 1);
        this._toasterService.info('Added to cart', '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
      }

      this._cartService.get_Cart_Count_Only();

      //  this._cartService.assignCartItem(index,1)
      //   //sessionStorage.setItem('CartItem',JSON.stringify(array));
      //   this._toasterService.info('Added to cart','',{
      //     timeOut :  10000,
      //     positionClass: 'toast-bottom-right',
      //     closeButton:true
      //   })
      //this.ngOnInit();
    }
  }

  clickToLike(varientId: any, prodId: any) {
    if (this.token) {
      let input = {
        varientId: varientId,
        productId: prodId,
      };
      this._landingService.updateFavourite(input).subscribe((res: any) => {
        if (res.status) {
          this.likeFlag = true;
          this._toasterService.success(res.message, '', {
            timeOut: 1000,
            positionClass: 'toast-bottom-right',
            closeButton: true,
          });
          this._landingService.getAll().subscribe((res: any) => {
            this.popularProducts = res.data.popularProducts;
          });
          // Swal.fire({
          //   text: res.message,
          //   icon: 'success',
          //   showCancelButton: false,
          //   confirmButtonText: 'Ok',
          //   confirmButtonColor: '#3085d6',
          //   imageHeight: 1000,
          // });
        } else {
          this.likeFlag = false;
          this._toasterService.info(res.message, '', {
            timeOut: 1000,
            positionClass: 'toast-bottom-right',
            closeButton: true,
          });
          // Swal.fire({
          //   text: res.message,
          //   icon: 'warning',
          //   showCancelButton: false,
          //   confirmButtonText: 'Ok',
          //   confirmButtonColor: '#3085d6',
          //   imageHeight: 1000,
          // });
          this._landingService.getAll().subscribe((res: any) => {
            this.popularProducts = res.data.popularProducts;
          });
        }
      });
    } else {
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

  get_All_prescriptions() {
    this._prescriptionService.get_prescription().subscribe((res: any) => {
      //console.log(res);
    });
  }

  //Prescription add
  uploadPrescritpion(event: any, type: any) {
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
      formData.append('prescription', file);

      this._prescriptionService.upload_image(formData).subscribe((res: any) => {
        //console.log(res);
        if (!res.error) {
          this.prescriptionImageURLArray.push(res.data.images[0]);
          this.imageLoading = false;
        } else {
          this.imageLoading = false;
          Swal.fire({
            icon: 'warning',
            title: res.message,
          });
        }
      });
    };
    // //console.log(this.Upload_Image,"Change ")

    // }
    // else if (type === 'healthdata') {
    //   //console.log('healthdata');

    //   // this._router.navigate(['/dashboard-order-details/health-vault'])
    //   // document.getElementById('dismiss-upload-prescription').click()
    //   // alert("choose healthdata");
    // }
  }
  //Prescription  remove
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
        data = this.prescriptionImageURLArray.filter(
          (res: any) => res != index
        );
        this.prescriptionImageURLArray = data;
        //console.log(this.prescriptionImageURLArray, 'updated array11');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  Get_Health_Vault_Data() {
    this.healthdataClicked = !this.healthdataClicked;
    // document.getElementById('dismiss-upload-prescription').click()
    this.Health_Vault_Service.get_user_health_vault().subscribe((res: any) => {
      //console.log(res, 'health vault data');
      this.Health_Vault_Array = [];
      this.Health_Vault_Array = res.data;

      if (this.Health_Vault_Array.length == 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No health data found',
        });
      }
      if (this.prescriptionImageURLArray.length != 0) {
        this.prescriptionImageURLArray.forEach((pres: any, ind: any) => {
          this.Health_Vault_Array.forEach((element: any, index: any) => {
            if (pres === element.prescription) {
              element.checkedFlag = true;
            }
          });
        });
      }
    });
  }

  Select_Health_Data(event, item) {
    if (event.target.checked) {
      //console.log(item);
      //this.Health_Data_Image = item.prescription
      this.prescriptionImageURLArray.push(item.prescription);
      //console.log(this.prescriptionImageURLArray);
    } else {
      let data: any = [];
      data = this.prescriptionImageURLArray.filter(
        (res: any) => res != item.prescription
      );

      this.prescriptionImageURLArray = data;
      //console.log(data);
    }
  }

  Continue_Prescription_Click() {
    if (this.prescriptionImageURLArray.length == 0) {
      this.prescriptionImageURLArray = [];
      this.Health_Vault_Array = [];
      Swal.fire({
        icon: 'warning',
        title: 'Please upload prescription',
      });
      return;
    }

    const formData = new FormData();
    let input = {
      prescription: this.prescriptionImageURLArray,
    };
    this._prescriptionService.add_prescription(input).subscribe((res: any) => {
      //console.log(res);
      if (!res.error) {
        this.prescriptionImageURLArray = [];
        this.Health_Vault_Array = [];
        document.getElementById('dismiss-upload-prescription').click();
        this.get_All_prescriptions();
        Swal.fire({
          icon: 'success',
          title: res.message,
        });
      }
    });
  }

  clickToCopyBoardShared(id: any) {
    let path = window.location.href + 'blog-detail/' + id;
    this._clipboardService.copyFromContent(path);
    Swal.fire({
      text: 'Article Link Copied',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      imageHeight: 1000,
    });
  }
  //Get the Link Section
  getTheLink() {
    if (this.phoneValidForm.invalid) {
      return;
    }
  }

  //Design Scripts
  iphoneSlide() {
    $(document).ready(function () {
      initSlider();

      function initSlider() {
        //@ts-ignore
        $('#iphoneSlide').owlCarousel({
          items: 1,
          dots: false,
          loop: true,
          autoplay: true,
          nav: true,
          onInitialized: startProgressBar,
          onTranslate: resetProgressBar,
          onTranslated: startProgressBar,
        });
      }

      function startProgressBar() {
        // apply keyframe animation
        $('.slide-progress').css({
          width: '100%',
          transition: 'width 5000ms',
        });
      }

      function resetProgressBar() {
        $('.slide-progress').css({
          width: 0,
          transition: 'width 0s',
        });
      }
    });
  }
  orderMedicine() {
    this.orderMedi.getActiveMedicine().subscribe((res) => {
      this.medicineName = res.data;
      //console.log(this.medicineName);
    });
  }
  orderMedicineRoute() {
    document.getElementById('dismiss-refund1').click();
    this._router.navigate(['/order']);
  }

  testimonialSlide() {
    // //console.log(this.optionsTestimonial);
    // const data = this.optionsTestimonial;
    $(document).ready(function () {
      //@ts-ignore
      $('#ourHappy').owlCarousel({
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        autoplay: true,
        margin: 25,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 3,
          },
          600: {
            items: 3,
          },
          768: {
            items: 5,
          },
          1000: {
            items: 6,
          },
        },
      });
    });
  }

  catSlide() {
    $(document).ready(function () {
      //@ts-ignore
      $('#catbag').owlCarousel({
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: false,
        margin: 25,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 4,
          },
          600: {
            items: 3,
          },
          768: {
            items: 5,
          },
          1000: {
            items: 6,
          },
        },
      });
      //</script>
    });
  }
  shopBySlide() {
    $(document).ready(function () {
      //@ts-ignore
      $('#shopBy').owlCarousel({
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: true,
        margin: 2,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 6,
          },
          600: {
            items: 5,
          },
          768: {
            items: 8,
          },
          1000: {
            items: 10,
          },
        },
      });
    });
  }
  medArticleSlide() {
    $(document).ready(function () {
      //@ts-ignore
      $('#medArticle').owlCarousel({
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: false,
        margin: 1,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 4,
          },
        },
      });
    });
  }

  hotDealsForYou() {
    $(document).ready(function () {
      //@ts-ignore
      $('#hotDealsForYou').owlCarousel({
        loop: true,
        freeDrag: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: true,
        margin: 1,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 2,
          },
          600: {
            items: 4,
          },
          1000: {
            items: 6,
          },
        },
      });
    });
  }

  subSliders() {
    $(document).ready(function () {
      //@ts-ignore
      $('#subSlider').owlCarousel({
        loop: true,
        freeDrag: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: false,
        margin: 1,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 3,
          },
        },
      });
    });

    //lengthwise

    $(document).ready(function () {
      //@ts-ignore
      $('#subSliderLengthWise').owlCarousel({
        loop: false,
        freeDrag: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: false,
        margin: 1,
        nav: false,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 3,
          },
        },
      });
    });
  }

  textAnimation() {
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');

    const textArray = ['Member'];
    const typingDelay = 200;
    const erasingDelay = 100;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains('typing'))
          cursorSpan.classList.add('typing');
        typedTextSpan.textContent +=
          textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        cursorSpan.classList.remove('typing');
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        if (!cursorSpan.classList.contains('typing'))
          cursorSpan.classList.add('typing');
        typedTextSpan.textContent = textArray[textArrayIndex].substring(
          0,
          charIndex - 1
        );
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        cursorSpan.classList.remove('typing');
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }

    document.addEventListener('DOMContentLoaded', function () {
      // On DOM Load initiate the effect
      if (textArray.length) setTimeout(type, newTextDelay + 250);
    });
  }
  vimeoVideo(vid: any) {
    // this.vimeoVideoHOwTo ='https://player.vimeo.com/video/' + vid.url + '?h=6e8a309fa0';
    this.vimeoVideoHOwTo = this._sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${vid}?h=6e8a309fa0`
    );
    //console.log(this.vimeoVideoHOwTo);
  }
  offersFromPayment() {
    $(document).ready(function () {
      //@ts-ignore
      $('#paymentOffers').owlCarousel({
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: false,
        margin: 15,
        nav: true,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 3,
          },
        },
      });
    });

    //length wise

    $(document).ready(function () {
      //@ts-ignore
      $('#paymentOffersLengthWise').owlCarousel({
        loop: false,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        autoplay: false,
        margin: 15,
        nav: true,
        autoplayHoverPause: true,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 3,
          },
        },
      });
    });
  }

  redirectToInner(type, index) {
    if (type === 'categories') {
      this._router.navigate(['/product-list/' + index._id, '', '']);
    } else if (type === 'brand') {
      this._router.navigate(['/brand/' + index._id]);
    } else if (type === 'sellingprod') {
      this._router.navigate([
        '/product-detail/' + index.title,
        index.product_id,
        index.brand,
        '',
      ]);
    } else if (type === 'mostsearchprod') {
      this._router.navigate([
        '/product-detail/' + index.title,
        index.product_id,
        index.brand,
        '',
      ]);
    } else if (type === 'mostbrands') {
      this._router.navigate(['/brand/' + index._id]);
    } else if (type === 'mostArticle') {
      this._router.navigate(['/blog-detail/' + index._id]);
    }
  }

  prescriptionGuidClick() {
    this.containGuidFlag = !this.containGuidFlag;
  }
}

// <section class="ps-section--topcategory">
//           <h3 class="headings">Categories to Bag</h3>
//           <div class="ps-section__carousel" id="sliders-ones">
//             <owl-carousel-o [options]="categoriesToBagcustomOptions">
//               <ng-container
//                 class="owl-carousel"
//                 *ngFor="let slide of categoriesToBag"
//               >
//                 <ng-template
//                   carouselSlide
//                   [id]="slide._id"
//                   class="ps-section__product"
//                 >
//                   <div class="ps-product ps-product--standard personal">
//                     <div class="ps-product__thumbnail corona">
//                       <a
//                         class="ps-product__image"
//                         routerLink="/product-list/{{ slide.categoryId }}"
//                       >
//                         <img src="{{ slide.image }}" alt="alt" />
//                       </a>
//                       <div class="ps-product__badge"></div>
//                       <div
//                         style="background-image: url('assets/img/png/red2.png')"
//                         class="ps-product__percent"
//                         *ngIf="slide.offerPercentage"
//                       >
//                         {{ slide.offerPercentage }} % OFF
//                       </div>
//                     </div>
//                     <!-- <div class="ps-product__content">
//                       <div class="orange">
//                         <h5
//                           style="
//                             background-image: url('assets/img/png/labels.png');
//                           "
//                           class="ps-product__title topfive"
//                         >
//                           <a
//                             routerLink="/product-list/{{ slide.categoryId }}"
//                             style="color: #fbfbfb"
//                             >{{ slide.categoryName }}</a
//                           >
//                         </h5>
//                       </div>
//                     </div> -->
//                   </div>
//                 </ng-template>
//               </ng-container>
//             </owl-carousel-o>
//           </div>
//         </section>
