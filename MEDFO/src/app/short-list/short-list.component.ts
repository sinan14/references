import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../services/cart.service';
import { ShortListService } from '../services/short-list.service';

@Component({
  selector: 'app-short-list',
  templateUrl: './short-list.component.html',
  styleUrls: ['./short-list.component.css']
})
export class ShortListComponent implements OnInit {

  constructor(
    private SHORTLIST_SERVICE: ShortListService,
    private router: Router,
    public _toasterService: ToastrService,
    private _cartService: CartService) { }


  public Wish_List: any = []
  public Recently_Viewed: any = []
  public token: any = ''

  public bannerType: any
  public bannerId: any
  public Product_Id: any


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    // console.log(this.token, "token");

          
          if (this.token != null) { 
            this.get_Favorites() 
            this._cartService.get_Cart_Count_Only()}
    else { this.router.navigate(['']) }
  }

  get_Favorites() {
    // let body = {
    //   "page": ''
    // }
    // body
    this._cartService.setLiveCartData()

    this.SHORTLIST_SERVICE.get_FAVORITES().subscribe((res: any) => {
      console.log(res);
      this.Wish_List = []
      this.Recently_Viewed = []

      this.Wish_List = res.data.wishlist.products
      this.Recently_Viewed = res.data.recently_viewed.prodcuts

      console.log(this.Recently_Viewed, "view");
      console.log(this.Wish_List, "wish");
      console.log(this._cartService.livecartData, "live they say");

    })
  }


  addToCart(productID, variantId, item, inCart) {
    // console.log(inCart,"boolean");

    if (inCart === 1) {

      this.router.navigate(['/cart'])

    } else if (inCart === 0) {

      if (this.token != null) {
        let data = {
          "product_id": productID,
          "variantId": variantId,
          "quantity": 1
        }
        this._cartService.add_To_Cart(data).subscribe((res: any) => {
          console.log(res);
          item.inCart = true
          this._toasterService.info(res.message, '', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right',
            closeButton: true
          })
          this.get_Favorites()
          this._cartService.get_Cart_Count_Only()
        })
      }
      else {
        // this._cartService.assignCartItem(item, 1)



        let data = {
          "product_id": productID,
          "varient_id": variantId,
          // "qty": 1,
          "image": item.image,
          "title": item.title,
          "discount": item.discount,
          "price": item.price,
          "spl_price": item.spl_price,
          "brand": item.brand.title,
          "uomValue": item.uom,
          "prescription": item.prescription,
  
          "uom": item.uom,
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














        //sessionStorage.setItem('CartItem',JSON.stringify(array));
      }

    }
  }


  imgClick(data,type) {
    // console.log(data);
    if(type == 'wish'){
      this.router.navigate(['/product-detail', data.title, data._id, data.brand, data.brand])
    }else if(type == 'recent'){
      this.router.navigate(['/product-detail', data.product, data.product_id, data.brand_name, data.brand_name])
    }
  }


  Fav_Icon_Click(varient_id, pdt_id) {
    let body = {
      varientId: varient_id,
      productId: pdt_id
    }
    this.SHORTLIST_SERVICE.update_FAVORITES(body).subscribe((res: any) => {
      console.log(res);
      if (this.token != null) { this.get_Favorites()
        this._cartService.get_Cart_Count_Only() }
    })
  }

  goToCart() {

  }

}
