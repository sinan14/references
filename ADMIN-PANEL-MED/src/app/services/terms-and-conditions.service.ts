import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class TermsAndConditionsService {
  public _API = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  fetchTerms(type) {
    return this._http.get(
      `${this._API}/admin/get_terms_and_condition/${type}`
    );
  }
  updateTerms(type, value) {
    return this._http.put(
      `${this._API}/admin/updateTermsAndCondition/${type}`,
      value
    );
  }
}
