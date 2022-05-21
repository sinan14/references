import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdsWebServiceService {

  public API = environment.apiUrl

  //sub dropdown
  public PDT_SUB_DRP = this.API + '/ads/get_all_active_products'
  public CAT_SUB_DRP = this.API + '/ads/get_sub_catgory_healthcare'


  //home 
  public ALL_HOME_SLIDERS = this.API + '/ads/get_all_web_home_sliders'
  public ADD_HOME_SLIDERS = this.API + '/ads/add_web_home_slider'
  public DELETE_HOME_SLIDERS = this.API + '/ads/delete_web_home_slider/'
  public EDIT_HOME_SLIDERS = this.API + '/ads/edit_web_home_slider/'



  //product banner
  public ALL_PDT_BANNER = this.API + '/ads/get_all_web_banners'
  public EDIT_PDT_BANNER = this.API + '/ads/edit_web_banner/'




  constructor(private http: HttpClient) { }

  //sub dropdown
  get_PDT_SUB_DRP() {
    return this.http.get(this.PDT_SUB_DRP)
  }

  get_CAT_SUB_DRP() {
    return this.http.get(this.CAT_SUB_DRP)
  }


  //home
  get_ALL_HOME_SLIDERS() {
    return this.http.get(this.ALL_HOME_SLIDERS)
  }

  add_HOME_SLIDERS(data) {
    return this.http.post(this.ADD_HOME_SLIDERS, data)
  }

  delete_HOME_SLIDERS(id) {
    return this.http.delete(this.DELETE_HOME_SLIDERS + id)
  }

  edit_HOME_SLIDERS(id, data) {
    return this.http.put(this.EDIT_HOME_SLIDERS + id, data)
  }




  //product banner
  get_ALL_PDT_BANNER() {
    return this.http.get(this.ALL_PDT_BANNER)
  }

  edit_PDT_BANNER(id, data) {
    return this.http.put(this.EDIT_PDT_BANNER + id, data)
  }

}
