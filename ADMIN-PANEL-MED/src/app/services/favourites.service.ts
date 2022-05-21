import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  public API = environment.apiUrl;

  public GET_FAVOURITES_TABLE = this.API + '/admin/get_all_favourites'
  public ACTIVATE_DEACTIVATE_FAVOURITES = this.API + '/admin/deactivate_inventory/'
  public SEARCH_FAVOURITES = this.API + '/admin/search_favourite_products'

  
  constructor(private http: HttpClient) { }


  get_FAVOURITES_TABLE(body){
    return this.http.post(this.GET_FAVOURITES_TABLE,body)
  }

  act_dct_FAVOURITES(id, status) {
    return this.http.put(this.ACTIVATE_DEACTIVATE_FAVOURITES + id, status)
  }

  search_FAVOURITES(data){
    return this.http.post(this.SEARCH_FAVOURITES , data)
  }

}
