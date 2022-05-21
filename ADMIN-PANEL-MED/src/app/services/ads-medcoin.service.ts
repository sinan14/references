import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdsMedcoinService {

  public API = environment.apiUrl;

  public GET_DATA = `${this.API}/ads/getMedCoinAd1Ad2HowItWorks`; 


  // public GET_AD1 = `${this.API}/ads/getMedCoinAd1Ad2HowItWorks/ad1`; 
  // public GET_AD2 = `${this.API}/ads/getMedCoinAd1Ad2HowItWorks/ad2`;  
  // public GET_DISCLAIMER = `${this.API}/ads/getMedCoinAd1Ad2HowItWorks/desclaimer`; 
  // public GET_HowItWrk = `${this.API}/ads/getMedCoinAd1Ad2HowItWorks/howItWorks`;  


  public UPDATE_DATA = `${this.API}/ads/editMedCoinAd1Ad2HowItWorks`;


  // public UPDATE_AD1 = `${this.API}/ads/getMedCoinAd1Ad2HowItWorks/ad1`;
  // public UPDATE_AD2 = `${this.API}/ads/getMedCoinAd1Ad2HowItWorks/ad2`;
  // public UPDATE_DISCLAIMER = `${this.API}/ads/getMedCoinAd1Ad2HowItWorks/howItWorks`;  //api to change due to err
  // public UPDATE_HowItWrk = `${this.API}/ads/getMedCoinAd1Ad2HowItWorks/howItWorks`;
   

  
  constructor(private http: HttpClient) { }

  //A11 API's
  getDATA() {
    return this.http.get(`${this.GET_DATA}`)
  }
  // getAD1() {
  //   return this.http.get(`${this.GET_AD1}`)
  // }
  // getAD2() {
  //   return this.http.get(`${this.GET_AD2}`)
  // }
  // getDISCLAIMER() {
  //   return this.http.get(`${this.GET_DISCLAIMER}`)
  // }
  // getHowItWrk() {
  //   return this.http.get(`${this.GET_HowItWrk}`)
  // }
 

  Update_Data(data){
    return this.http.put(`${this.UPDATE_DATA}`,data)
  }


  // Update_AD1(data){
  //   return this.http.put(`${this.UPDATE_AD1}`,data)
  // }
  // Update_AD2(data){
  //   return this.http.put(`${this.UPDATE_AD2}`,data)
  // }
  // Update_DISCLAIMER(data){
  //   return this.http.put(`${this.UPDATE_DISCLAIMER}`,data)
  // }
  // Update_HowItWrk(data){
  //   return this.http.put(`${this.UPDATE_HowItWrk}`,data)
  // }


}
