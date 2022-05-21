import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

const  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTYyNTg1N2NiYTMyM2Y4NTk1YzExMCIsImlhdCI6MTYzNTkzMzIyNiwiZXhwIjoxNjM4NTI1MjI2fQ.QjM9KsCxd-z38j3EJM3tpm3wsvaZDkk_fE9RudvwP9M'

@Injectable({
  providedIn: 'root'
})
export class LandingService {

 

  public API = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`${this.API}/user/get_web_home_page`);
  }
  

  //For Guest Users
  getProductsList_by_ID(data:any){
    return this.http.post(`${this.API}/user/get_web_product_details`,data);
  }


  //For Login Users
  getProductDetials_for_loginnedUsers(data:any){
    return this.http.post(`${this.API}/user/get_product_details`,data);
  }
  getVideoURL(id:any){
    sessionStorage.setItem('token','5349f786dbbba1201d0f85424433dc00');
    const httpHeader=new HttpHeaders({
      'Authorization':'Bearer 5349f786dbbba1201d0f85424433dc00'
          })
    return this.http.get('https://api.vimeo.com/videos/'+id );
  }


  checkPincode(data:any){
    const httpHeader=new HttpHeaders({
      'Authorization':`Bearer ${token}`
          })
    return this.http.post(`${this.API}/user/pincode_check`,data, { headers: httpHeader });
  }

  addProductShare(data:any){
    return this.http.post(`${this.API}/user/add_product_share`,data);
  }

  updateFavourite(data:any){
    return this.http.post(`${this.API}/user/update_favorites`,data);
  }

}
