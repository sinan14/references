import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  public _API = environment.apiUrl;

  constructor(private _http: HttpClient) {}


  fetchPendingDoctors() {
    return this._http.get(`${this._API}/doctor/get_pending_doctors`);
  }
  fetchVerifiedDoctors() {
    return this._http.get(`${this._API}/doctor/get_verified_doctors`);
  }
  fetchDoctor(_id) {

    return this._http.get(
      `${this._API}/doctor/get_doctor_details_by_id/${_id}`
    );
  }
  fetchApprovedDoctors() {
    return this._http.get(`${this._API}/doctor/get_approved_doctors`);
  }
  fetchRejectedDoctors() {
    return this._http.get(`${this._API}/doctor/get_rejected_doctors`);
  }
  verifyDoctor(data) {
    return this._http.post(
      `${this._API}/doctor/change_doctor_verification_status`,
      data
    );
  }
  approveOrReject(data) {
    return this._http.post(
      `${this._API}/doctor/change_doctor_approve_status`,
      data
    );
  }

  postDate(date) {
    return this._http.post(`${this._API}/doctor/get_doctor_details_by_date`, date);
  }

  //  name,email,mobile        /doctor/get_verified_doctors
  //       /doctor/get_doctor_details_by_id/:id
  //     /doctor/change_doctor_verification_status
}
