import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class NewCartService {
  public _API = environment.baseUrl;

  constructor(private _http: HttpClient) {}
  addUserAddress(details: any) {
    return this._http.post(`${this._API}/user/add_user_address`, details);
  }

  editUserAddress(details: any) {
    return this._http.post(`${this._API}/user/edit_user_address`, details);
  }
  getAddress() {
    return this._http.get(`${this._API}/user/get_user_address`);
  }
  // getAddressById(id: any) {
  //   return this._http.get(`${this._API}/user/get_user_address_by_id/${id}`);
  // }
  changeAddresStatusById(id: any) {
    return this._http.put(
      `${this._API}/user/change_user_address_status/${id}`,
      id
    );
  }
  deleteUserAddress(id: any) {
    return this._http.delete(`${this._API}/user/delete_user_address/${id}`);
  }
}
