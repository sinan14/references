import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreHomeService } from 'src/app/services/store-home.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  public product: any;
  public seller_id: any;
  public varientId: any;
  public productId: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    public _homeService: StoreHomeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // if (!this._homeService.localCurrency) {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.productId = id;
      const sellerId = params['sellerId'];
      this.seller_id = sellerId;
      this.getActiveProductsById({
        id,
        sellerId,
      });
    });
    // }
  }

  getActiveProductsById(data: any) {
    // data = { id:'', sellerId: '' };
    this._homeService.getProductsById(data).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status) {
          this.product = res.data.products[0];
          console.log(this.product);
          const fromRate =
            this._homeService.currencyRates[res.data.products[0].countryCode];
          const toRate =
            this._homeService.currencyRates[this._homeService.localCurrency];
          this.product.convertedPrice = Math.trunc(
            (toRate / fromRate) * this.product.basicSellingPrice
          );
          if (this.product.isVariant == false) {
            this.product.match = {
              images: this.product.images,
              colorArray: [],
              convertedPrice: this.product.convertedPrice,
            };
            this.product.uniqueVariantObjects = [];
            console.log(this.product);
          }

          if (this.product.isVariant == true) {
            let uomValues: any = [];
            let colorArray: any = [];
            let colorObjects: any = {};
            this.product.variants.forEach((item: any, index: number) => {
              item.convertedPrice = Math.trunc(
                (toRate / fromRate) * item.sellingPrice
              );
            });

            const uniqueVariantObjects: any = this.product.variants.filter(
              (v: any, i: any, a: any) =>
                a.findIndex((t: any) => t.uomValue === v.uomValue) === i
            );
            this.product.uniqueVariantObjects = [...uniqueVariantObjects];
            uniqueVariantObjects.forEach((o: any) => {
              uomValues.push(o.uomValue);
            });

            uomValues.forEach((uomValue: any) => {
              colorObjects[uomValue] = this.product.variants.filter(
                (variant: any) => variant.uomValue == uomValue
              );
              colorArray = [];
              colorObjects[uomValue].forEach((item: any) => {
                if (item.colorCode != undefined) {
                  colorArray.push({
                    colorCode: item.colorCode,
                    colorName: item.colorName,
                  });
                }
                colorObjects[uomValue][0].colorArray = [...colorArray];
              });
            });

            uomValues.forEach((uomValue: any) => {
              colorObjects[uomValue].forEach((item: any, i: number) => {
                if (i > 0) {
                  colorObjects[uomValue][i].colorArray =
                    colorObjects[uomValue][0].colorArray;
                }
              });
            });
            this.product.uomValues = [...uomValues];
            this.product.colorObjects = { ...colorObjects };
            const match = this.product.variants.filter(
              (v: any) => v.isDefaultVariant === true
            );
            this.product.match = match[0];
            console.log(this.product);
            console.log(this.product.match);
          }

          $(document).on('click', '#myBtnContainer button', function () {
            $('.size button').removeClass('active');
            $(this).addClass('active');
          });
          $(document).on('click', '#myBtnContainer1 button', function () {
            $('.size button').removeClass('active');
            $(this).addClass('active');
          });
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  addCart() {
    if (this.varientId) {
      var data = {
        sellerId: this.seller_id,
        productId: this.productId,
        variantId: this.varientId,
        quantity: 1,
      };
    } else {
      var data = {
        sellerId: this.seller_id,
        productId: this.productId,
        variantId: this.product.match._id,
        quantity: 1,
      };
    }

    this._homeService.addtoCart(data).subscribe((res: any) => {
      console.log(res, 'addtoCartaddtoCart');
      if (res) {
        let data = {
          productId: res.data.productId,
          variantId: this.product.match._id,
          quantity: 1,
          cartId: res.data.cartId,
          sellerId: this.seller_id,
        };
        localStorage.setItem('cartData', JSON.stringify(data));
        this.router.navigate(['/shopping']);
      }
    });
  }
  fetchSelectedVariant(_id: any, uomValue: any) {
    const match = this.product.variants.filter((v: any) => v._id === _id);
    this.product.match = match[0];
    console.log(this.product.match, 'this.product//////////');
    this.varientId = this.product.match._id;
  }
  fetchSelectedColor(colorName: any, colorCode: any) {
    console.log(colorCode, colorName);
    const uomValue = this.product.match.uomValue;
    const match = this.product.variants.filter(
      (v: any) => v.uomValue === uomValue && v.colorName === colorName
    );
    this.product.match = match[0];
    console.log(this.product.match);
  }
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay: true,
    nav: false,
    autoplayHoverPause: true,
    animateOut: 'slideOutUp',
    animateIn: 'slideInUp',
    navSpeed: 4000,
    navText: ['Previous', 'Next'],
    items: 1,
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
  };
}
