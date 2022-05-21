import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedfillSubscriptionService {

  public API = environment.baseUrl;

  constructor(private http: HttpClient) { }

  get_subscription_list() {
    return this.http.get(`${this.API}/user/get_subscription_list`);
  }

  active_inactive_subscription(data:any){
    return this.http.post(`${this.API}/user/activate_or_inactivate_subscription`,data);
  }

  upload_image(data) {
    return this.http.post(`${this.API}/user/upload_prescription_image`, data);
  }

  add_prescription(data) {
    return this.http.post(`${this.API}/user/update_subscription_prescription`, data);
  }

}
