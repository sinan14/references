import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MasterStoreCreationService {

  public API = environment.apiUrl

  public LIST_ALL_STORE = this.API + '/admin/list_store'
  public STORE_DROPDOWN = this.API + '/admin/store_dropdown'
  public GET_DATA_by_ID = this.API + '/admin/find_store/'
  public DEACTIVATE_STORE = this.API + '/admin/deactivate_store/'
  public EDIT_STORE = this.API + '/admin/edit_store/'
  public ADD_STORE = this.API + '/admin/add_store'

  

  //PINCODE DATAS
  public GET_SERVICEABLE_PINCODE_by_ID = this.API + '/admin/get_serviceable_pincodes/'
  public EDIT_SERVICE_PINCODE = this.API + '/admin/edit_pincode/'
  public DEACTIVATE_SERVICE_PINCODE = this.API + '/admin/deactivate_pincode/'
  public ADD_SERVICE_PINCODE = this.API + '/admin/add_pincode/'
  public DELETE_SERVICE_PINCODE = this.API + '/admin/delete_pincode/'

  

  constructor(private http: HttpClient) { }

  get_ALL_STORE() {
    return this.http.get(this.LIST_ALL_STORE)
  }
  get_STORE_DROPDOWN() {
    return this.http.get(this.STORE_DROPDOWN)
  }
  get_DATA_by_ID(id) {
    return this.http.get(this.GET_DATA_by_ID + id)
  }
  deactivate_STORE(id, data) {
    return this.http.put(this.DEACTIVATE_STORE + id, data)
  }
  edit_STORE(id, data) {
    return this.http.put(this.EDIT_STORE + id, data)
  }
  add_STORE(data) {
    return this.http.post(this.ADD_STORE , data)
  }


  
  //PINCODE FUNCTIONS
  get_SERVICEABLE_PINCODE(id) {
    return this.http.get(this.GET_SERVICEABLE_PINCODE_by_ID + id)
  }
  edit_SERVICE_PINCODE(id, data) {
    return this.http.put(this.EDIT_SERVICE_PINCODE + id, data)
  }
  deactivate_SERVICE_PINCODE(id, data) {
    return this.http.put(this.DEACTIVATE_SERVICE_PINCODE + id, data)
  }
  add_SERVICE_PINCODE(str_id, data) {
    return this.http.post(this.ADD_SERVICE_PINCODE + str_id, data)
  }
  delete_SERVICE_PINCODE(id,code) {
    return this.http.delete(this.DELETE_SERVICE_PINCODE + id,code)
  }

}
