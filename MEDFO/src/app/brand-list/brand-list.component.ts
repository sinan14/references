import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BrandListService } from '../services/brand-list.service';
import { CartService } from '../services/cart.service';
import { ProductListService } from '../services/product-list.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  productList: any
  banner: any
  bannerId: any
  bannerId1: any
  bannerCatId: any
  bannerType: any
  bannerName:any
  bannerBrand:any
  bannerMetatitle:any
  brandName: any
  bannerSubId:any
  stockAvailable: any
  public token: any = ''

  constructor(private brand: BrandListService,public _toasterService: ToastrService, private route: ActivatedRoute, public _router: Router, public pro: ProductListService, private _cartService: CartService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    const id = this.route.snapshot.paramMap;
    const brandId = id.get("brandId")
    console.log(brandId)
    this.brand.getProductFromBrand(brandId).subscribe((res: any) => {
      this.productList = res.data.productDetails.products,
        console.log(this.productList)
      this.banner = res.data.banner[0].image,
     this.bannerBrand=res.data.banner[0].brand,
     this.bannerName=res.data.banner[0].typeName,
     this.bannerMetatitle=res.data.banner[0].metaTitles,
        this.bannerCatId = res.data.banner[0].categoryId,
        this.bannerSubId=res.data.banner[0]._id
        console.log("banner id" + this.bannerCatId)

      this.bannerId = res.data.banner[0].redirection_id,
        this.bannerType = res.data.banner[0].redirection_type,
        this.brandName = res.data.productDetails.products[0].brandName,
        this.productList = res.data.productDetails.products
      console.log(this.brandName)





    });

  }
  bannerClick() {
    if (this.bannerType == "product") {
      this._router.navigate(['/product-detail/' + this.bannerName,this.bannerId,this.bannerBrand,this.bannerMetatitle]);
    }
    else if (this.bannerType == "category") {
 
      this._router.navigate(['/product-list/' + this.bannerCatId,this.bannerSubId])
      /* const categoryItem=categoryArray.map((item:any)=>item._id);
       this.bannerId1=categoryItem.find((item:any)=>item==this.bannerId)
       (console.log(this.bannerId))
       //this.pro.productList(this.bannerId1).subscribe();
       this._router.navigate(['/product-list/' + mainCat])*/




    }
  }

  Add_To_Cart(productID, variantId, item) {
    console.log(item);

    if (this.token != null) {
      let data = {
        "product_id": productID,
        "variantId": variantId,
        "quantity": 1
      }
      this._cartService.add_To_Cart(data).subscribe((res: any) => {
        console.log(res);
        this._toasterService.info(res.message, '', {
          timeOut: 10000,
          positionClass: 'toast-bottom-right',
          closeButton: true
        })
        // item.inCart = true
        this._cartService.get_Cart_Count_Only()
      })
    }
    else {



      let data = {
        "product_id": productID,
        "varient_id": variantId,
        "brand": item.brandName,
        "title": item.title,
        "price": item.price,
        "discount": item.discount,
        "spl_price": item.spl_price,
        "uomValue": item.uom,
        "uom": item.uom,
        "image": item.image,
        // "qty": 1,
        "IsPrescriptionRequired": item.prescription,
      }


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






      // this._cartService.assignCartItem(data, 1)
      //sessionStorage.setItem('CartItem',JSON.stringify(array));
    }
  }

  productDetails(data) {
    // let id='61719db09081670e5c4232f3';
    //  let p = encodeURIComponent("xyz manwal")
    //  console.log(data.title.replace(' ','/'));
    this._router.navigate(['/product-detail', data.title, data._id, data.brandName, data.metaTitles])
  }
}