import { Component, OnInit } from '@angular/core';
import { RecentlyPurchasedService } from '../services/recently_purchased.service';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recently-purchased',
  templateUrl: './recently-purchased.component.html',
  styleUrls: ['./recently-purchased.component.css'],
})
export class RecentlyPurchasedComponent implements OnInit {
  constructor(
    private _recentlyService: RecentlyPurchasedService,
    private _cartService: CartService,
    private _router: Router
  ) {}

  public purchasedItems: any = {
    isEmpty: false,
    result: [],
  };
  public wishListCount = 0;
  ngOnInit(): void {
    this.fetchPurchasedItems();
    this.getWishListCount();
  }

  getWishListCount() {
    this._cartService.get_Cart_Count().subscribe((res: any) => {
      console.log(res);
      this.wishListCount = res.data.wishListCount;
    });
  }

  //db methods
  fetchPurchasedItems() {
    this._recentlyService.fetchRecentlyPurchased().subscribe(
      (res: any) => {
        if (res.error == false) {
          this.purchasedItems.result = res.data.result;

          if (res.data.result.length == 0) {
            this.purchasedItems.isEmpty = true;
          } else {
            this.purchasedItems.isEmpty = false;

            const month = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ];

            this.purchasedItems.result = this.purchasedItems.result.reduce(
              (acc, e) => {
                const found = acc.find((x) => e.product_id === x.product_id);
                found ? (found.quantity += e.quantity) : acc.push(e);
                return acc;
              },
              []
            );

            this.purchasedItems.result.forEach((item) => {
              const d = new Date(item.purchasedOn);
              item.newDate = `${d.getDate()} ${
                month[d.getMonth()]
              } ${d.getFullYear()}`;
            });
          }
          console.log(this.purchasedItems);
        } else {
          console.log('something wrong');
        }
      },
      (err: any) => {
        console.log(err.error);
      }
    );
  }
  reOrder(product) {
    console.log(product);
    let data = {
      product_id: product.product_id,
      variantId: product.variantId,
      quantity: 1,
    };
    this._cartService.add_To_Cart(data).subscribe((res: any) => {
      if (!res.error) {
        Swal.fire({
          icon: 'success',
          title: res.message,
        }).then(() => this._router.navigate(['/cart']));
      } else {
        this._router.navigate(['/cart']);
      }
    });
  }

  redirectToWishListPage() {
    this._router.navigate(['/short-list']);
  }
  // product-detail/:prod_name/:prod_id/:prod_category/:prod_brand
  goToInnerPage(pdt) {
    console.log(pdt);

    this._router.navigate([
      `/product-detail/${pdt.productName}/${pdt.product_id}/${pdt.type}/${pdt.brandName}`,
    ]);
  }
}
