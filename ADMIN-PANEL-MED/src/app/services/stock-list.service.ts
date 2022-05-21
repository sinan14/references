import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StockListService {

  public API = environment.apiUrl

  public GET_INVENTORY_CATEGORY = this.API + '/admin/inventory_category_listing/'

  public GET_INVENTORY_VARIENTS = this.API + '/admin/get_inventory_varients'
  public GET_OUT_OF_STOCK_INVENTORY_VARIENTS = this.API + '/admin/get_out_of_stock_inventory_varients'
  public GET_LOW_STOCK_INVENTORY_VARIENTS = this.API + '/admin/get_low_stock_inventory_varients'
  public UPDATE_STOCK_INVENTORY_VARIENTS = this.API + '/admin/update_inventory_varient/'
  public SEARCH_LIST = this.API + '/admin/search_stock_listing' //SEARCH ALL
  public SEARCH_LOW_STOCK = this.API + '/admin/search_low_stock_listing'  //SEARCH LOW_STOCK
  public SEARCH_OUT_STOCK = this.API + '/admin/search_out_of_stock_listing'  //SEARCH OUT_STOCK


  //store login  stock updation


  public UPDATE_STORE_LOGIN_STOCK_INVENTORY_VARIENTS = this.API + '/admin/store_product_updation';

  public GET_STORE_INVENTORY_VARIANTS = this.API + '/admin/get_store_inventory_varients';

  public GET_STORE_OUT_OF_STOCK_INVENTORY_VARIANTS = this.API + '/admin/get_store_out_of_stock_varients';

  public GET_STORE_LOW_STOCK_INVENTORY_VARIANTS = this.API + '/admin/get_store_low_stock_varients';

  public STORE_SEARCH_LIST = this.API + '/admin/search_store_stock_listing';
  public STORE_OUT_OF_SEARCH_LIST = this.API + '/admin/search_store_out_of_stock_listing';
  public STORE_LOW_STOCK_SEARCH_LIST = this.API + '/admin/search_store_low_stock_listing';


  constructor(private http: HttpClient) { }


  get_INVENTORY_VARIENTS(body) {
    return this.http.post(this.GET_INVENTORY_VARIENTS, body)
  }

  get_INVENTORY_CATEGORY(type) {
    return this.http.get(this.GET_INVENTORY_CATEGORY + type)
  }

  get_OUT_OF_STOCK_INVENTORY_VARIENTS(body) {
    return this.http.post(this.GET_OUT_OF_STOCK_INVENTORY_VARIENTS, body)
  }

  get_LOW_STOCK_INVENTORY_VARIENTS(body) {
    return this.http.post(this.GET_LOW_STOCK_INVENTORY_VARIENTS, body)
  }

  update_LOW_STOCK_INVENTORY_VARIENTS(id, body) {
    return this.http.put(this.UPDATE_STOCK_INVENTORY_VARIENTS + id, body)
  }

  search_STOCK_LIST(body) { //ALL SEARCH
    return this.http.post(this.SEARCH_LIST, body)
  }

  search_LOW_STOCK(body) { //LOW STOCK SEARCH
    return this.http.post(this.SEARCH_LOW_STOCK, body)
  }

  search_OUT_STOCK(body) { //OUT OF STOCK SEARCH
    return this.http.post(this.SEARCH_OUT_STOCK, body)
  }


  //Store login stock updation

  update_Store_login_stock_inventory_invarients(body) {
    return this.http.post(this.UPDATE_STORE_LOGIN_STOCK_INVENTORY_VARIENTS, body)
  }

  get_our_store_product_listing(data) {
    return this.http.post(this.GET_STORE_INVENTORY_VARIANTS, data)
  }

  get_store_out_of_stock(data) {
    return this.http.post(this.GET_STORE_OUT_OF_STOCK_INVENTORY_VARIANTS, data)
  }

  get_store_low_stock(data) {
    return this.http.post(this.GET_STORE_LOW_STOCK_INVENTORY_VARIANTS, data)
  }

  search_all_store_inventory(body) {
    return this.http.post(this.STORE_SEARCH_LIST, body)
  }

  search_out_of_stock_store_inventory(body) {
    return this.http.post(this.STORE_OUT_OF_SEARCH_LIST, body)
  }

  search_low_stock_store_inventory(body) {
    return this.http.post(this.STORE_LOW_STOCK_SEARCH_LIST, body)
  }

}
