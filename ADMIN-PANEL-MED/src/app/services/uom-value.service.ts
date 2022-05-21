import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UomValueService {
  public _API = environment.apiUrl;
  // public _API = 'localhost:8000'
  uomValues: any = [];

  constructor(private _http: HttpClient) {}
  fetchUomValues() {
    return this._http.get(`${this._API}/admin/get_master_uom_value`)
    
  }

  fetchUomValueById(uomValueId) {
    return this._http.get(
      `${this._API}/admin/get_master_uom_value_by_id/${uomValueId}`
    );
  }

  createUomValue(newUomValue) {
    return this._http.post(
      `${this._API}/admin/add_master_uom_value`,
      newUomValue
    );
  }
  updateUomValue(updatedUomValue) {
    return this._http.put(
      `${this._API}/admin/edit_master_uom_value`,
      updatedUomValue
    );
  }

  deleteUomValueById(uomValueId) {
    return this._http.delete(
      `${this._API}/admin/delete_master_uom_value/${uomValueId}`
    );
  }
  removeUomValueById(uomValueId, uom) {
    return this._http.put(
      `${this._API}/admin/remove_master_uom_value/${uomValueId}`,
      uom
    );
  }
}
