import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {

  public API = environment.apiUrl;

  public GET_DASHBOARD_DETAILS = this.API + '/admin/get_dashboard_details'


  constructor(private http: HttpClient) { }

  // GET_DASHBOARD_DETAILS
  get_Dashboard_details(){
return this.http.get(this.GET_DASHBOARD_DETAILS)
  }

}
