import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
// import { catchError, tap } from 'rxjs/operators';
// import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreHomeService {
  constructor(private _http: HttpClient) {}
  public deliveryAddressId: any;
  private _api = environment.baseUrl;
  private sellerId: any = '61cea413d2191ae5e5846435';
  public localCurrency: any = false;
  public currencyRates: any = {};
  // public currencyApi: string = 'https://api.exchangerate-api.com/v4/latest/USD';

  getCurrencyCode() {
    fetch('https://ipapi.co/currency')
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        // console.log('DATA PARSED...currency');
        this.localCurrency = data;
      })
      .catch((e) => {
        console.log('OH NO! ERROR!', e);
      });
  }
  getCurrencyRates() {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((currency) => {
        return currency.json();
      })
      .then((exchangeRates) => {
        console.log(exchangeRates);
        this.currencyRates = exchangeRates.rates;
      })
      .catch((e) => {
        console.log('OH NO! ERROR!', e);
      });
  }

  // getIp() {
  //   this._http.get<any>('https://geolocation-db.com/json/').pipe(
  //     catchError((err) => {
  //       return throwError(err);
  //     }),
  //     tap((response) => {
  //       //console.log(response)
  //       //console.log(response.IPv4);
  //     })
  //   );
  // }
  // public getIPAddress() {
  //   return this._http.get('http://api.ipify.org/?format=json');
  // }
  getProductCategoriesBySellerId(sellerId: any) {
    //console.log(sellerId);
    const endPoint = `${this._api}/seller/get-seller-product-category-bySellerId/${sellerId}`;
    return this._http.get(endPoint);
  }
  // post requests

  getProductsBySellerId(data: any) {
    // data = { page: '', limit: '', sellerId: '' };
    //console.log(data);
    const endPoint = `${this._api}/seller/get-all-active-products-bySellerId`;
    return this._http.post(endPoint, data);
  }
  getProductsByCategoryId(data: any) {
    // data = { page: '', limit: '', sellerId: '' ,categoryId: ''};
    //console.log(data);
    const endPoint = `${this._api}/seller/get-all-active-products-bySellerCategoryId`;
    return this._http.post(endPoint, data);
  }

  getProductsById(data: any) {
    // data = { page: '', limit: '', sellerId: '' };
    //console.log(data);
    const endPoint = `${this._api}/seller/get-active-product-byId`;
    return this._http.post(endPoint, data);
  }

  fetchSellerDetails() {
    const endPoint = `${this._api}/seller/get-seller-details-web-bySellerId`;
    return this._http.post(endPoint, { sellerId: this.sellerId });
  }
  getUomAndUomValuesForFiltering(sellerId: any) {
    const endPoint = `${this._api}/seller/get-filter-methods-bySellerId`;
    return this._http.post(endPoint, { sellerId });
  }
  filterProducts(data: any) {
    // data = { page: '', limit: '', sellerId: '' };
    // uomValue: new FormArray([]),
    // color: new FormArray([]),
    // page: [1, Validators.required],
    // limit: [10, Validators.required],
    // sellerId: [null, Validators.required],
    // searchBy: [''],
    // sortBy: [''],
    // minPrice: ['', [Validators.min(0)]],
    // maxPrice: ['', [Validators.min(0)]],
    console.log(data);

    if (data.uomValue && data.uomValue.length === 0) {
      delete data.uomValue;
    }
    if (data.color && data.color.length === 0) {
      delete data.color;
    }
    if (data.searchBy == null || data.searchBy === '') {
      delete data.searchBy;
    }
    if (data.sortBy == null || data.sortBy === '') {
      delete data.sortBy;
    }
    if (data.minPrice === '' || data.minPrice == null) {
      data.minPrice = 0;
    }
    if (data.maxPrice === '' || data.maxPrice == null) {
      delete data.maxPrice;
    }

    console.log(data);
    const endPoint = `${this._api}/seller/filter-active-product-bySellerId`;
    return this._http.post(endPoint, data);
  }
  addtoCart(data) {
    const endPoint = `${this._api}/user/product/add-product-to-cart`;
    return this._http.post(endPoint, data);
  }
  addQuantity(data) {
    const endPoint = `${this._api}/user/product/update-cart-item`;
    return this._http.put(endPoint, data);
  }
  getcartItems(sellerId) {
    const endPoint = `${this._api}/user/product/get-cart-products/${sellerId}`;
    return this._http.get(endPoint);
  }
  deletCart(id) {
    const endPoint = `${this._api}/user/product/delete-cart-item/${id}`;
    return this._http.delete(endPoint);
  }
  distance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
}
