import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class Ad1ProfileService {
  
  
  public API = environment.apiUrl;

  public GET_DropDown1_Cat = `${this.API}/foliofit/getProCategory`;
  public GET_DropDown1_pdtORcat = `${this.API}/foliofit/getProduct`;

  public GET_AD1_DETAILS = `${this.API}/ads/getAd1MedFill`;
  public UPDATE_AD1_IMAGE = `${this.API}/ads/editAd1MedFill`;
  public GET_MEDPRIDE_DETAILS = `${this.API}/ads/getMedPride`;
  public UPDATE_MEDPRIDE_IMAGE = `${this.API}/ads/editMedPride`;
  public GET_REFER_EARN_DETAILS = `${this.API}/ads/getReferEarn`;
  public UPDATE_REFER_EARN_IMAGE = `${this.API}/ads/editReferEarn`;
  public GET_ADDR_DETAILS = `${this.API}/ads/getAdsAddress`;
  public UPDATE_ADDR_IMAGE = `${this.API}/ads/editAdsAddress`;

  constructor(private http: HttpClient) { }

  //A11 API's
  getAd1() {
    return this.http.get(`${this.GET_AD1_DETAILS}`);
  }

  update_Ad1_Medfill_Image(data) {
    return this.http.put(`${this.UPDATE_AD1_IMAGE}`, data);
  }

  getMedPride() {
    return this.http.get(`${this.GET_MEDPRIDE_DETAILS}`);
  }

  update_MedPride_Image(data) {
    return this.http.put(`${this.UPDATE_MEDPRIDE_IMAGE}`, data);
  }

  getRefer_Earn() {
    return this.http.get(`${this.GET_REFER_EARN_DETAILS}`);
  }

  update_ReferEarn_Image(data) {
    return this.http.put(`${this.UPDATE_REFER_EARN_IMAGE}`, data);
  }

  getAddrs() {
    return this.http.get(`${this.GET_ADDR_DETAILS}`);
  }

  update_Addr_Image(data) {
    return this.http.put(`${this.UPDATE_ADDR_IMAGE}`, data);
  }

  getDropDown1_Cat() {
    return this.http.get(`${this.GET_DropDown1_Cat}`)
  }

  getDropDown1_pdt() {
    return this.http.get(`${this.GET_DropDown1_pdtORcat}`)
  }
  
}
