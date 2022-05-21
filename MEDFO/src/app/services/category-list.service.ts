import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoryListService {

  public API = environment.baseUrl

  public GET_WEB_CATEGORIES = this.API + '/user/get_web_categories'


  constructor(private http: HttpClient) { }

  get_web_categories() {
    return this.http.get(this.GET_WEB_CATEGORIES)
  }


}
