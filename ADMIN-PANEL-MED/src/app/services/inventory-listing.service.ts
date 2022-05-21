import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class InventoryListingService {

  public API = environment.apiUrl

  public LIST_INVENTORY_PRODUCTS = this.API + '/admin/list_inventory_products/'
  public ACTIVATE_DEACTIVATE_INVENTORY_PRODUCTS = this.API + '/admin/deactivate_inventory/'
  public INVENTORY_CATEGORY_LISTING = this.API + '/admin/inventory_category_listing/'
  public LIST_INVENTORY_PRODUCTS_BY_CAT = this.API + '/admin/list_inventory_products_ByCategory'

  public SEARCH_INVENTORY_LIST = this.API + '/admin/search_inventory_listing'


  constructor(private http: HttpClient) { }


  get_LIST_INVENTORY_PRODUCTS(body) {
    return this.http.post(this.LIST_INVENTORY_PRODUCTS , body)
  }

  act_dct_INVENTORY_PRODUCTS(id, status) {
    return this.http.put(this.ACTIVATE_DEACTIVATE_INVENTORY_PRODUCTS + id, status)
  }

  get_INVENTORY_CATEGORY_LISTING(type) {
    return this.http.get(this.INVENTORY_CATEGORY_LISTING + type)
  }

  get_LIST_INVENTORY_PRODUCTS_BY_CAT(body) {
    return this.http.post(this.LIST_INVENTORY_PRODUCTS_BY_CAT , body)
  }

  search_INVENTORY_LIST(body) {
    return this.http.post(this.SEARCH_INVENTORY_LIST , body)
  }
  
}
