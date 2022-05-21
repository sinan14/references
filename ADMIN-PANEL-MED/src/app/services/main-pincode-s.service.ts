import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MainPincodeSService {

  public API = environment.apiUrl

  public GET_ALL_PINCODES = this.API + '/admin/get_master_serviceable_pincodes'
  public ADD_PINCODE = this.API + '/admin/add_master_pincode/'
  public EDIT_PINCODE = this.API + '/admin/edit_pincode/'
  public DELETE_PINCODE = this.API + '/admin/delete_pincode/'
  public DEACTIVATE_SERVICE_PINCODE = this.API + '/admin/deactivate_pincode/'


 

  constructor(private http:HttpClient) { }

  get_ALL_PINCODE() {
     return this.http.get(this.GET_ALL_PINCODES)
  }
  edit_PINCODE(id, data) {
    return this.http.put(this.EDIT_PINCODE + id, data)
  }
  deactivate_PINCODE(id, data) {
    return this.http.put(this.DEACTIVATE_SERVICE_PINCODE + id, data)
  }
  add_PINCODE(data) {
    return this.http.post(this.ADD_PINCODE , data)
  }
  delete_PINCODE(id,code) {
    return this.http.delete(this.DELETE_PINCODE + id,code)
  }




}
