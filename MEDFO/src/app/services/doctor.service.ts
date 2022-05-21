


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  public _API = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  addDoctorDetails(details: any) {
    return this._http.post(`${this._API}/doctor/add_doctor_details`, details);
  }
}
