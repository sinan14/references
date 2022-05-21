import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MostBuyedService {

  public API = environment.apiUrl

  public GET_MOST_BUYED_LIST = this.API + '/admin/list_most_buyed_products'
  public SEARCH_MOST_BUYED_LIST = this.API + '/admin/search_most_buyed_products'
  public ACTIVATE_DEACTIVATE_MOST_BUYED = this.API + '/admin/deactivate_inventory'

  constructor(private http: HttpClient) { }

  //MOST BUYED LIST
  get_MOST_BUYED_LIST(data) {
    return this.http.post(this.GET_MOST_BUYED_LIST, data)
  }

  search_MOST_BUYED_LIST(data) {
    return this.http.post(this.SEARCH_MOST_BUYED_LIST, data)
  }

  act_dct_MOST_BUYED(id, status) {
    return this.http.put(this.ACTIVATE_DEACTIVATE_MOST_BUYED + id, status)
  }


}
