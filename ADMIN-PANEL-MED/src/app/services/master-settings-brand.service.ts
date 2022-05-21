import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MasterSettingsBrandService {

  public API = environment.apiUrl

  public GET_ALL_BRANDS = this.API + '/admin/get_master_brand'
  public EDIT_BRAND = this.API + '/admin/edit_master_brand'
  public ADD_BRAND = this.API + '/admin/add_master_brand'
  public DELETE_BRAND = this.API + '/admin/delete_master_brand/'
  public GET_BRANDS_BY_TYPE = this.API + '/admin/get_master_brand_by_type/'


  constructor(private http: HttpClient) { }

  get_ALL_BRANDS() {
    return this.http.get(this.GET_ALL_BRANDS)
  }

  edit_BRAND(data) {
    return this.http.put(this.EDIT_BRAND, data)
  }

  add_BRAND(data) {
    return this.http.post(this.ADD_BRAND, data)
  }

  delete_BRAND(id) {
    return this.http.delete(this.DELETE_BRAND + id)
  }

  get_BRANDS_BY_TYPE(type) {
    return this.http.get(this.GET_BRANDS_BY_TYPE + type)
  }

}
