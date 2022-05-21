import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ShortListService {

  public API = environment.baseUrl

  public GET_FAVORITES = this.API + '/user/get_favourite'
  public UPDATE_FAVORITES = this.API + '/user/update_favorites'

  // public GET_CART_ITEMS = this.API + '/user/get_medicart'


  constructor(private http:HttpClient) { }

  get_FAVORITES(){
    return this.http.post(this.GET_FAVORITES,'')
  }

  update_FAVORITES(body){
    return this.http.post(this.UPDATE_FAVORITES,body)
  }

  // get_CART_ITEMS(){
  //   return this.http.get(this.GET_CART_ITEMS)
  // }


}
