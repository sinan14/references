import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  public API = environment.baseUrl;
  constructor(private http: HttpClient) { }


  //sepparate prescription for home page and order page
  get_prescription() {
    return this.http.get(`${this.API}/user/get_user_prescription_admin`);
  }

  
  delete_prescription(data) {
    return this.http.delete(`${this.API}/user/delete_user_prescription_admin`, data);
  }

  upload_image(data) {
    return this.http.post(`${this.API}/user/upload_prescription_image`, data);
  }

  add_prescription(data){
    return this.http.post(`${this.API}/user/add_user_prescription_admin`, data);
  }

}
