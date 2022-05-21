import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MostSearchedService {

  public API = environment.apiUrl;

  public GET_MOST_SEARCHED_LIST = this.API +'/admin/list_most_searched_products'
  public SEARCH_MOST_SEARCHED_LIST = this.API +'/admin/search_most_searched_products'
  public ACTIVATE_DEACTIVATE_MOST_SEARCHED = this.API + '/admin/deactivate_inventory/'

  
  constructor(private http:HttpClient) { }


  get_MOST_SEARCHED_LIST(data){
    return this.http.post(this.GET_MOST_SEARCHED_LIST,data)
  }
  search_MOST_SEARCHED_LIST(data){
    return this.http.post(this.SEARCH_MOST_SEARCHED_LIST,data)
  }
  act_dct_MOST_SEARCHED(id, status) {
    return this.http.put(this.ACTIVATE_DEACTIVATE_MOST_SEARCHED + id, status)
  }

}
