import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LandingService } from 'src/app/services/landing.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import Swal from 'sweetalert2';
// import Player from '@vimeo/player';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from 'src/app/services/cart.service';
import { ClipboardService } from 'ngx-clipboard';
import { Location, ViewportScroller } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-inner-page',
  templateUrl: './product-inner-page.component.html',
  styleUrls: ['./product-inner-page.component.css']
})
export class ProductInnerPageComponent implements OnInit, AfterViewInit {

  public myThumbnail: any = '../../../assets/img/product_details/delivery.png';
  public myFullresImage: any = '../../../assets/img/product_details/return.png';

  public oldPrice: any;
  public oldSplPrice: any;
  public attemptedSubmit: boolean = false;
  public deliverAvailableFlag: boolean = false;
  public addToCartBtn_Flag: boolean = true;
  public addToCartQty_Flag: boolean = false;
  public quantity: any = 1;
  public token: any;
  public URL: any;
  public productID: any;
  public productDetail: any = [];
  public pricingArray: any = [];
  public imageList: any = [];
  public pricingFlag: boolean = false;
  public pincodeValue: any = '';
  public pincodeDetails: any = [];
  public selectedUOM_ID: any = '';
  public likeFlag: boolean = false;
  public carrousalImageList: any = [];
  public variantId: any = '';
public Cart_Id:any = ''


  relatedProductscustomOptions: OwlOptions = {
    items: 3,
    loop: true,
    autoplay: false,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 4
      },
      400: {
        items: 4
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: false
  }


  listCarouselOption: OwlOptions = {
    loop: true,
    autoplay: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    rewind: true,
    dotsEach: true,
    // navText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 3
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1200: {
        items: 4
      }
    },
    nav: false
  }


  categoriesToBagcustomOptions: OwlOptions = {
    loop: true,
    autoplay: false,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }
  public root; any;
  public container: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public _landingService: LandingService,
    public _sanitizer: DomSanitizer,
    public _cartService: CartService,
    public _router: Router,
    private _clipboardService: ClipboardService,
    private _location: Location,
    private titleService: Title,
    public _toasterService: ToastrService,
    private metaService: Meta, rootNode: ElementRef) {
    this.root = rootNode;
  }

  ngOnInit(): void {

    $(document).ready(function () {
      $(".bar span").hide();
      $("#bar-five").animate(
        {
          width: "75%",
        },
        1000
      );
      $("#bar-four").animate(
        {
          width: "35%",
        },
        1000
      );
      $("#bar-three").animate(
        {
          width: "20%",
        },
        1000
      );
      $("#bar-two").animate(
        {
          width: "15%",
        },
        1000
      );
      $("#bar-one").animate(
        {
          width: "30%",
        },
        1000
      );

      setTimeout(function () {
        $(".bar span").fadeIn("slow");
      }, 1000);
    });


    this.token = localStorage.getItem('token');
    this.activatedRoute.paramMap.subscribe(params => {
      this.productID = ''
      this.productID = params.get('prod_id');
      let data = {
        'id': this.productID
      }
      this.imageList = [];
      this.carrousalImageList = [];
      if (this.token === null) {

        this._cartService.getLocalCart()


        this._landingService.getProductsList_by_ID(data).subscribe((res: any) => {
          console.log(res, "not logged in.................");


          this._cartService.localCart.forEach((itm) => {
            if (res.data.products._id == itm.product_id) {
              console.log(itm, "itm.product_iditm.product_iditm.product_iditm.product_id");
              this.quantity = 1
              this.quantity = itm.quantity
              this.addToCartBtn_Flag = false
            }
            else {
              //   console.log("no itm.product_id no itm.product_idno itm.product_idno itm.product_id");
              // this.addToCartBtn_Flag = true
            }
          })






          console.log(res.data.products);

          this.titleService.setTitle(res.data.products.metaTitles);
          this.metaService.addTag(
            { name: 'description', content: res.data.products.metaDescription },
          );

          this.productDetail = res.data.products;

          this.pincodeDetails.returnPolicy = this.productDetail.policyReturn;
          this.pincodeDetails.deliveryTime = this.productDetail.delveryTime;
          this.pincodeDetails.cashOnDelivery = this.productDetail.cashOnDelivery;
          this.likeFlag = false;
          this.pricingFlag = true;
          this.pricingArray = res.data.products.pricing[0];
          // if(this.pricingArray.is_fav===0){
          //   this.likeFlag  = false;
          // }
          // else{
          //   this.likeFlag = true;
          // }





          // console.log(this._cartService.localCart);
          // this.quantity = res.data.products.pricing[0].quantity;
          // if (res.data.products.pricing[0].is_cart == 0) {
          //   console.log("is_cart", res.data.products.pricing[0].is_cart);
          //   console.log(this.addToCartBtn_Flag);

          //   this.addToCartBtn_Flag = true
          // } else {
          //   console.log("is_cart", res.data.products.pricing[0].is_cart);
          //   console.log(this.addToCartBtn_Flag);

          //   this.addToCartBtn_Flag = false
          // }





          this.oldPrice = this.pricingArray.price;
          this.oldSplPrice = this.pricingArray.spl_price;

          this.selectedUOM_ID = res.data.products.pricing[0]._id;

          res.data.products.pricing[0].imageArray.map((i, index) => {
            if (res.data.products.pricing[0].stockStatus === 'Out of stock') {
              this.addToCartBtn_Flag = false;
              this.addToCartQty_Flag = false;
            }
            let input = {
              'id': index,
              'isImage': this.pricingArray.imageArray[0].isImage,
              'image': this.pricingArray.imageArray[0].url,
              'thumbnail': '../../../assets/img/black_play_button_img.jpg',
              'stockStatus': res.data.products.pricing[0].stockStatus
            }

            this.imageList.push(input);


            if (i.isImage === 1) {
              // let tt = this._sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/'+ i.url +'?h=6e8a309fa0');


              let input = {
                'id': index,
                'isImage': i.isImage,
                'video': 'https://player.vimeo.com/video/' + i.url + '?h=6e8a309fa0',
                'thumbnail': '../../../assets/img/black_play_button_img.jpg',
                'stockStatus': res.data.products.pricing[0].stockStatus
              }
              // this.imageList.push(input)
              this.carrousalImageList.push(input);

            }
            else {

              let input = {
                'id': index,
                'isImage': i.isImage,
                'image': i.url,
                'stockStatus': res.data.products.pricing[0].stockStatus
              }

              //this.imageList.push(input)
              this.carrousalImageList.push(input);
            }

          })

          console.log(this.imageList);
          this.variantId = this.imageList[0].id;

        })



      }
      else {
        this._landingService.getProductDetials_for_loginnedUsers(data).subscribe((res: any) => {
          console.log(res, "reseseeseeses");

          console.log(res.data.products);


          this.titleService.setTitle(res.data.products.metaTitles);
          this.metaService.addTag(
            { name: 'description', content: res.data.products.metaDescription },
          );


          this.productDetail = res.data.products;

          this.pincodeDetails.returnPolicy = this.productDetail.policyReturn;
          this.pincodeDetails.deliveryTime = this.productDetail.delveryTime;
          this.pincodeDetails.cashOnDelivery = this.productDetail.cashOnDelivery;

          this.pricingFlag = true;
          this.pricingArray = res.data.products.pricing[0];
          this.quantity = res.data.products.pricing[0].quantity;
          this.Cart_Id = res.data.products.pricing[0].cartId;

          if (this.pricingArray.is_fav === 0) {
            this.likeFlag = false;
          }
          else {
            this.likeFlag = true;
          }

          if (res.data.products.pricing[0].is_cart == 0) {
            console.log("is_cart", res.data.products.pricing[0].is_cart);
            console.log(this.addToCartBtn_Flag);

            this.addToCartBtn_Flag = true
          } else {
            console.log("is_cart", res.data.products.pricing[0].is_cart);
            console.log(this.addToCartBtn_Flag);

            this.addToCartBtn_Flag = false
          }

          this.oldPrice = this.pricingArray.price;
          this.oldSplPrice = this.pricingArray.spl_price;

          this.selectedUOM_ID = res.data.products.pricing[0]._id;
          if (this.pricingArray.is_fav != 0) {
            this.likeFlag = true;
          }

          res.data.products.pricing[0].imageArray.map((i, index) => {

            let input = {
              'id': index,
              'isImage': this.pricingArray.imageArray[0].isImage,
              'image': this.pricingArray.imageArray[0].url,
              'thumbnail': 'assets/img/black_play_button_img.jpg',
              'stockStatus': res.data.products.pricing[0].stockStatus
            }

            this.imageList.push(input);


            if (i.isImage === 1) {
              //let tt = this._sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/'+ i.url +'?h=6e8a309fa0');
              let input = {
                'id': index,
                'isImage': i.isImage,
                'video': 'https://player.vimeo.com/video/' + i.url + '?h=6e8a309fa0',
                'thumbnail': 'assets/img/black_play_button_img.jpg',
                'stockStatus': res.data.products.pricing[0].stockStatus
              }
              this.imageList.push(input)
              this.carrousalImageList.push(input);
              // this._landingService.getVideoURL(i.url).subscribe((p:any)=>{
              //   console.log(p);
              //   console.log(p.link);

              //   sessionStorage.removeItem('token')
              // })

            }
            else {

              let input = {
                'id': index,
                'isImage': i.isImage,
                'image': i.url,
                'stockStatus': res.data.products.pricing[0].stockStatus
              }

              this.imageList.push(input)
              this.carrousalImageList.push(input);
            }

          })

          console.log(this.carrousalImageList);
          this.variantId = this.imageList[0].id;

        })
      }

    });
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      //@ts-ignore
      $('#similar').owlCarousel({
        items: 5,
        loop: false,
        pullDrag: false,
        dots: false,
        autoplay: false,
        margin: 0,
        mouseDrag: false,
        rewind: false,
        touchDrag: false,
        nav: false,
        responsive: {
          0: {
            items: 1,
            loop: false,
            autoplay: false,
            mouseDrag: false,
            pullDrag: false,
            touchDrag: false,
          },
          600: {
            items: 3,
            loop: false,
            mouseDrag: false,
            pullDrag: false,
            touchDrag: false,
          },
          1000: {
            items: 5,
            loop: false, nav: false,
            autoplay: false,
            mouseDrag: false,
            pullDrag: false,
            touchDrag: false,
          },
        },
      });

    });
  }

  getSafeURL(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  setPricing(pricing) {
    this.selectedUOM_ID = pricing._id;
    this.pricingFlag = true;
    pricing.discount = Math.round(parseInt(pricing.discount));
    this.pricingArray = pricing;



    if (pricing.stockStatus === 'Out of stock') {
      this.addToCartBtn_Flag = false;
      this.addToCartQty_Flag = false;
    }
    else {
      this.addToCartBtn_Flag = true;
      this.addToCartQty_Flag = false;

    }

    if (this.token != null) {
      if (pricing.is_fav != 0) {
        this.likeFlag = true;
      }
      else {
        this.likeFlag = false;
      }
    }
    else {
      this.likeFlag = false;
    }

    this.imageList = [];
    this.carrousalImageList = [];
    this.variantId = 0;
    let data = pricing.imageArray.map((i, index) => {

      if (i.isImage === 1) {
        // let tt = this._sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/'+ i.url +'?h=6e8a309fa0');
        let input = {
          'id': index,
          'isImage': i.isImage,
          'video': 'https://player.vimeo.com/video/' + i.url + '?h=6e8a309fa0',
          'thumbnail': 'assets/img/black_play_button_img.jpg',
          'stockStatus': pricing.stockStatus
        }
        this.imageList.push(input)
        this.carrousalImageList.push(input);

      }
      else {

        let input = {
          'id': index,
          'isImage': i.isImage,
          'image': i.url,
          'stockStatus': pricing.stockStatus
        }

        this.imageList.push(input);
        this.carrousalImageList.push(input);
      }
    })

    console.log(this.imageList);


    console.log(this.pricingArray)
  }

  checkPincode() {
    if (this.pincodeValue != '') {
      // alert(this.pincodeValue)
      let input = {
        'variantId': this.pricingArray._id,
        'pincode': this.pincodeValue
      }
      this._landingService.checkPincode(input).subscribe((res: any) => {
        console.log(res);
        if (res.message == 'Delivery Not Available') {
          this.deliverAvailableFlag = true;
          this.attemptedSubmit = false;
          this.pricingArray.spl_price = this.oldSplPrice;
          this.pricingArray.price = this.oldPrice;

        }
        else {
          if (res.data.isThisDataNeedToBeUpdated) {
            this.attemptedSubmit = false;
            this.deliverAvailableFlag = false;
            this.pincodeDetails = res.data;
            //update Special price and price in case of sub store products
            this.pricingArray.spl_price = res.data.special_price;
            this.pricingArray.price = res.data.price;
            this.pincodeDetails.returnPolicy = this.pincodeDetails.returnPolicy;

          }
          else {
            this.pincodeDetails.deliveryTime = this.pincodeDetails.deliveryTime;
            this.pincodeDetails.cashOnDelivery = this.pincodeDetails.cashOnDelivery;
            this.pincodeDetails.returnPolicy = this.pincodeDetails.returnPolicy;

            this.pricingArray.spl_price = this.oldSplPrice;
            this.pricingArray.price = this.oldPrice;
            //this.ngOnInit();

            this.deliverAvailableFlag = false;
            this.attemptedSubmit = false;
          }
        }

      })
    }
    else {
      this.pincodeValue = '';
      this.attemptedSubmit = false;
      this.deliverAvailableFlag = false;
    }

  }


  clickToShared(type) {
    if (localStorage.getItem('token')) {
      if (type === 'fb') {
        window.open('https://www.facebook.com/medimall.co.in', '_blank');
      }
      else if (type === 'insta') {
        window.open('https://www.instagram.com/medimall.co.in/', '_blank');
      }
      else if (type === 'tw') {
        window.open('https://www.facebook.com/medimall.co.in', '_blank');
      }
      else if (type === 'whp') {
        window.open('https://www.facebook.com/medimall.co.in', '_blank');
      }
      let input = {
        'productId': this.productID
      }
      this._landingService.addProductShare(input).subscribe((res: any) => {
        if (res) {

        }
      })
    }
    else {
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

  clickToLike() {
    if (localStorage.getItem('token')) {
      let input = {
        'varientId': this.pricingArray._id,
        'productId': this.productID,
      }
      this._landingService.updateFavourite(input).subscribe((res: any) => {
        if (res.status) {
          this.likeFlag = true;
          Swal.fire({
            text: res.message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 1000,
          });
          this.ngOnInit();
        }
        else {
          this.likeFlag = false;
          Swal.fire({
            text: res.message,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 1000,
          });
          this.ngOnInit();
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

  selectImage(slider) {
    this.variantId = slider.id;
    this.imageList = [];
    if (slider.isImage == 0) {
      this.imageList.push(slider);
    }
    else if (slider.isImage == 1) {
      let tt = this._sanitizer.bypassSecurityTrustResourceUrl(slider.video);
      let data = {
        'id': slider.index,
        'isImage': slider.isImage,
        'video': tt,
        'thumbnail': slider.thumbnail,
        'stockStatus': slider.stockStatus
      }
      this.imageList.push(data);
    }
  }

  addToCart(count) {
    let data = {
      "product_id": this.productID,
      "variantId": this.pricingArray._id,
      "quantity": count
    }
    this._cartService.add_To_Cart(data).subscribe((res: any) => {
      console.log(res);
      
    })
  }




  addToCartBtnClicked(item) {
    this.addToCartQty_Flag = true;
    this.addToCartBtn_Flag = false;
    this.quantity = 1
    console.log( this.Cart_Id, "CID 1");
    this.Add_To_Cart(this.productID, this.pricingArray._id, item, 1)

  }

  increment(item) {
    console.log(item);
    console.log(this.pricingArray);
    console.log( this.Cart_Id, "CID");

    if (this.quantity > 0) {
      this.quantity++;
      this.addToCartBtn_Flag = false;
      console.log(this.quantity, "incre qty");
      // console.log(this.pricingArray.cartId, this.productID, this.quantity);
      if (this.token != null) {
        this.Update_To_Cart(this.Cart_Id, this.productID, this.quantity)
      } else {
        this.Update_To_Cart(this.pricingArray.cartId, this.productID, 1)

      }
    }
  }

  decrement(item) {
    console.log(item);
    console.log( this.Cart_Id, "CID DECRE");
    console.log(this.pricingArray,this.Cart_Id);

    if (this.quantity > 1) {
      this.quantity--;
      this.addToCartBtn_Flag = false;
      // this.Update_To_Cart(this.pricingArray.cartId, this.productID, -1)

      if (this.token != null) {
        this.Update_To_Cart(this.Cart_Id, this.productID, this.quantity)
      } else {
        this.Update_To_Cart(this.pricingArray.cartId, this.productID, -1)

      }

    }
    else {
      this.addToCartBtn_Flag = true;
      this.addToCartQty_Flag = false;
    }



    // let input = {
    //   "cartId": item.cartId,
    //   "quantity": item.quantity
    // }

    // this._cartService.update_Cart_Item(input).subscribe((res: any) => {
    //   console.log(res);
    //   this._cartService.get_Cart_Count_Only()
    //   if (!res.error) {
    //     this._toasterService.info(res.message,'',{
    //       timeOut :  10000,
    //       positionClass: 'toast-bottom-right',
    //       closeButton:true
    //     })
    //     this.ngOnInit();
    //   }
    //   else{
    //     Swal.fire({
    //       icon: 'warning',
    //       text: res.message,
    //       showConfirmButton: true,
    //     });
    //     this.ngOnInit();
    //   }
    // })

  }

  Update_To_Cart(cart_id, pdtId, qty) {

    console.log(cart_id, pdtId, qty, "pased itm");


    if (this.token != null) {
      let data = {
        "cartId": cart_id,
        "quantity": qty
      }

      this._cartService.update_Cart_Item(data).subscribe((res: any) => {
        console.log(res);
        this._toasterService.info(res.message, '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true
        })
        this.ngOnInit();
        this._cartService.get_Cart_Count_Only()
        // item.inCart = true
      })
    }
    else {

      let data = {
        "product_id": pdtId
      }

      this._cartService.updateQuantity(data, qty)
      this._toasterService.info('Cart item updated sucessfully.', '', {
        timeOut: 10000,
        positionClass: 'toast-bottom-right',
        closeButton: true
      })
      //sessionStorage.setItem('CartItem',JSON.stringify(array));
      this._cartService.get_Cart_Count_Only()
    }
  }




  Add_To_Cart(productID, variantId, item, qty) {
    console.log(item,qty);

    if (this.token != null) {
      let data = {
        "product_id": productID,
        "variantId": variantId,
        "quantity": qty
      }
      this._cartService.add_To_Cart(data).subscribe((res: any) => {
        console.log(res);
        this._toasterService.info(res.message, '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true
        })
        // item.inCart = true
        // console.log(this.quantity,"res qty checking");
        this.ngOnInit();
        this._cartService.get_Cart_Count_Only()
      })
    }
    else {

      let data = {
        "product_id": productID,
        "varient_id": variantId,
        "brand": item.brand,
        "title": item.title,
        "price": item.pricing[0].price,
        "discount": item.pricing[0].discount,
        "spl_price": item.pricing[0].spl_price,
        "uomValue": item.pricing[0].uomValue,
        "uom": item.pricing[0].uom,
        "image": item.pricing[0].imageArray[0].url,


        // "qty": 1,
        "IsPrescriptionRequired": item.prescription,

      }

      // this._cartService.assignCartItem(data, 1)


      this._cartService.Check_Cart_Item(productID)

      if (this._cartService.Item_Found_Flag == true) {
        this._toasterService.info('Product already exist in your cart.', '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true
        })
      } else if (this._cartService.Item_Found_Flag == false) {
        this._cartService.assignCartItem(data, 1)
        this._toasterService.info('Added to cart', '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true
        })
      }
      this._cartService.get_Cart_Count_Only()
      //sessionStorage.setItem('CartItem',JSON.stringify(array));
    }
  }





  clickToProductDetail(id) {
    this.imageList = [];
    this.carrousalImageList = [];
    let data = {
      'id': id
    }
    this._landingService.getProductsList_by_ID(data).subscribe((res: any) => {
      console.log(res.data.products);
      this._router.navigate(['/product-detail/', res.data.products.title, res.data.products._id, res.data.products.brand, res.data.products.metaTitles])
    });
  }

  clickToCopyBoardShared() {
    let path = window.location.href;
    this._clipboardService.copyFromContent(path);
    Swal.fire({
      text: 'Product Link Copied',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      imageHeight: 1000,
    });
  }

  AfterViewInit() {
    this.container = $(this.root.nativeElement).find('#zoom_03');
    this.container.elevateZoom({
      zoomType: "inner",
      cursor: "crosshair",
      zoomWindowFadeIn: 500,
      zoomWindowFadeOut: 750
    });


  }
}
