import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class HealthVaultService {
  public _API = environment.baseUrl;

  constructor(private _http: HttpClient) {}
  // http://143.110.240.107:8000/user/add_user_health_vault

  add_user_health_vault(details: any) {
    return this._http.post(`${this._API}/user/add_user_health_vault`, details);
  }
  edit_user_health_vault(details: any) {
    return this._http.post(`${this._API}/user/edit_user_health_vault`, details);
  }
  // get_user_name_by_user_id
  get_user_health_vault() {
    return this._http.get(`${this._API}/user/get_user_health_vault_by_user_id`);
  }
  // /get_user_health_vault_by_id/:id
  get_user_health_vault_by_id(id) {
    return this._http.get(`${this._API}/user/get_user_health_vault_by_id/${id}`);
  }

  get_user_name_by_user_id() {
    return this._http.get(`${this._API}/user/get_user_name_by_user_id`);
  }
  // delete_user_health_vault/:id
  delete_user_health_vault(hvId) {
    return this._http.delete(
      `${this._API}/user/delete_user_health_vault/${hvId}`
    );
  }
}
