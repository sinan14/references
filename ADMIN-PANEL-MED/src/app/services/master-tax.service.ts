import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class MasterTaxService {
  taxes: any = [];

  public _API = environment.apiUrl;
  // public _API = 'localhost:8000'

  constructor(private _http: HttpClient) {}
  fetchTaxes() {
    return this._http.get(`${this._API}/admin/get_master_tax`)
    
  }
  fetchTaxById(tax_id) {
    return this._http.get(`${this._API}/admin/get_master_tax_by_id/${tax_id}`);
  }
  createTax(newTax) {
    return this._http.post(`${this._API}/admin/add_master_tax`, newTax);
  }
  updateTax(updatedTax) {
    return this._http.put(`${this._API}/admin/edit_master_tax`, updatedTax);
  }

  deleteTaxById(tax_id) {
    return this._http.delete(`${this._API}/admin/delete_master_tax/${tax_id}`);
  }
  removeTaxById(tax_id, tax) {
    return this._http.put(
      `${this._API}/admin/remove_master_tax/${tax_id}`,
      tax
    );
  }
}
