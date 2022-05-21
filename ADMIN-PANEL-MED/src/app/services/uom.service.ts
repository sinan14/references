import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UomService {
  public _API = environment.apiUrl;
  // public _API = 'localhost:8000'

  constructor(private _http: HttpClient) {}
  uoms: any = [];
  enabledUoms: any = [];

  fetchUoms() {
    return this._http.get(`${this._API}/admin/get_master_uom`);
  }

  fetchActiveUoms() {
    return this._http.get(`${this._API}/admin/get_active_master_uom`);
  }

  fetchUomById(uomId) {
    return this._http.get(`${this._API}/admin/get_master_uom_by_id/${uomId}`);
  }
  createUom(newUom) {
    return this._http.post(`${this._API}/admin/add_master_uom`, newUom);
  }
  updateUom(updatedUom) {
    return this._http.put(`${this._API}/admin/edit_master_uom`, updatedUom);
  }

  deleteUomById(uomId) {
    return this._http.delete(`${this._API}/admin/delete_master_uom/${uomId}`);
  }
  removeUomById(uomId, uom) {
    return this._http.put(`${this._API}/admin/remove_master_uom/${uomId}`, uom);
  }
}
