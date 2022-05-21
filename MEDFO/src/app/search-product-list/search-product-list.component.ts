import { Component, OnInit } from '@angular/core';
import{ActivatedRoute, Router}from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../services/cart.service';
import { HeaderService } from '../services/header.service';
import { SharedService } from '../services/shared.service';
@Component({
  selector: 'app-search-product-list',
  templateUrl: './search-product-list.component.html',
  styleUrls: ['./search-product-list.component.css']
})
export class SearchProductListComponent implements OnInit {
searchKey:any
productId:any
productList:any
totalProduct:number
  public token: any = ''
  constructor(
    private Header_Service: HeaderService, 
    private router: ActivatedRoute, 
    private _router: Router, 
    private _cartService: CartService,
    private shared:SharedService,
    public _toasterService: ToastrService) { 
   this.router.queryParams.subscribe(params => {
   this.searchKey=params.key;
   console.log(this.searchKey);
   this.Header_Service.searchProduct(this.searchKey).subscribe((res: any) => {
   this.productList = res.data.result,
   this.totalProduct = this.productList.length
     this.token = localStorage.getItem('token');
     this.shared.sendMessage(this.searchKey);
  })
})
  }
  ngOnInit(): void {
    this.shared.sendMessage(this.searchKey);
  
  
  }
  productDetails(data:any) {
    this.Header_Service.mostSearchedProduct(data._id).subscribe((res: any) => {
      
 
    });
    this._router.navigate(['/product-detail', data.title, data._id, data.brand.title, data.brand.title])
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
        // "qty": 1,
        "image": item.image,
        "title": item.title,
        "discount": item.discount,
        "price": item.price,
        "spl_price": item.spl_price,
        "brand": item.brand.title,
        "uomValue": item.uom,
        "IsPrescriptionRequired": item.prescription,

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







      // console.log(this._cartService.assignCartItem(data, 1));

      // if(this._cartService.assignCartItem(data, 1)==false){

      // }else{
      // this._toasterService.info('Added to cart','',{
      //   timeOut :  10000,
      //   positionClass: 'toast-bottom-right',
      //   closeButton:true
      // })
      // }
      //sessionStorage.setItem('CartItem',JSON.stringify(array));
    }
  }


}
