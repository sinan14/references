import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PremiumService {
  public _API = environment.apiUrl;

  constructor(private _http: HttpClient, private _router: Router) {}

  fetchPremiumBenefitDetails() {
    return this._http.get(`${this._API}/admin/edit_premium`);
  }
  updatePremiumBenefitDetais(values) {
    return this._http.put(
      `${this._API}/admin/update_premium/${values._id}`,
      values
    );
  }
  //data table part
  //here you need change route
  fetchPremiumSpecial() {
    return this._http.get(`${this._API}/admin/special-view_premium`);
  }
  updatePremiumSpecial(values) {
    return this._http.put(
      `${this._API}/admin/special_update_premium/${values._id}`,
      values
    );
  }
  fetchAllactiveMember(type, pg) {
    const httpHeader = new HttpHeaders({
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTBmNzU4NmZmZmQ0OTcxNjI5M2MxMCIsImlhdCI6MTYzNzgxNDgwMCwiZXhwIjoxNjQwNDA2ODAwfQ.cZffY1mgSnmg3scKMJXRgbmiWqnfPNqubVZgl0gS3xs',
    });
    return this._http.post(
      `${this._API}/admin/med_total_premium_members/` + type,
      { pageNo: pg, limit: 10 },
      { headers: httpHeader }
    );
  }
  searchPremium(type, pg, key) {
    const httpHeader = new HttpHeaders({
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTBmNzU4NmZmZmQ0OTcxNjI5M2MxMCIsImlhdCI6MTYzOTExMDMwOCwiZXhwIjoxNjQxNzAyMzA4fQ.-PMP1KKH7WCwUK3Lo25b2MLbtPiZAgOD9N4be1CCfQg',
    });
    return this._http.post(
      `${this._API}/admin/search_med_total_premium_members/` + type,
      { pageNo: pg, limit: 10, searchBy: key },
      { headers: httpHeader }
    );
  }
  premiumDetails() {
    this._router.navigate(['/premium/premium-list']);
    setTimeout(function () {
    document.getElementById('activeTab').click();
    }, 200);
  }
}
