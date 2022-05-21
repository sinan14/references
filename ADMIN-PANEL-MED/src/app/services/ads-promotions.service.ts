import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdsPromotionsService {

  public API = environment.apiUrl;

  public GET_PARTNER_PROMO_DETAILS = `${this.API}/ads/getPartnerPromotion`;
  public GET_PROMO_DETAILS = `${this.API}/ads/getPromotion`;

  public UPDATE_PARTNER_PROMO_DETAILS = `${this.API}/ads/editPartnerPromotion`;
  public UPDATE_PROMO_DETAILS = `${this.API}/ads/editPromotion`;

  public PARTNER_PROMO_DELETE = `${this.API}/ads/deletePartnerPromotion/`;
  public PROMO_DELETE = `${this.API}/ads//deletePromotion/`;

  constructor(private http:HttpClient) { }

  getPartnerPromo(){
    return this.http.get(`${this.GET_PARTNER_PROMO_DETAILS}`)
  }
  getPromo(){
    return this.http.get(`${this.GET_PROMO_DETAILS}`)
  }


  Update_Partner_Promo(data){
    return this.http.put(`${this.UPDATE_PARTNER_PROMO_DETAILS}`,data)
  }
  Update_Promo(data){
    return this.http.put(`${this.UPDATE_PROMO_DETAILS}`,data)
  }


  delete_PartnerPromo(id){
    return this.http.delete(`${this.PARTNER_PROMO_DELETE}`+id);
  }
  delete_Promo(id){
    return this.http.delete(`${this.PROMO_DELETE}`+id);
  }



}
