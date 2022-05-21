import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class AdMedfeedService {

  public _api=environment.apiUrl;

  public GET_MEDFEED_SLIDER_1=`${this._api}/ads/get_ads_medfeed_slider1`;

  public GET_MEDFEED_MAINCATEGORY_EXPERTADVICE=`${this._api}/ads/get_ads_medfeed_main_expert/`;

  public GET_MEDFEED_QUIZ=`${this._api}/ads/get_ads_medfeed_quiz`;

  constructor(private http:HttpClient) { }

  Get_Medfeed_Slider_1(){
  return this.http.get(`${this._api}/ads/get_ads_medfeed_slider1`);
 }

  Get_Medfeed_MC_EA(type){
    return this.http.get(`${this._api}/ads/get_ads_medfeed_main_expert/`+type);
  }

  Get_Medfeed_Quiz(){
    return this.http.get(`${this._api}/ads/get_ads_medfeed_quiz`);
  }

 Add_Slider1(data){
   return this.http.post(`${this._api}/ads/add_ads_medfeed_slider1`,data);
 }

  Delete_Slider1(id){
    return this.http.delete(`${this._api}/ads/delete_ads_medfeed_slider1/`+id)
  }
  Get_MC_EA_Details_by_Id(id){
    return this.http.get(`${this._api}/ads/get_ads_medfeed_main_expert_by_id/`+id);
}
  Edit_Medfeed_MC_EA(type,data){
    return this.http.put(`${this._api}/ads/edit_ads_medfeed_main_expert/`+type,data)
  }

  Get_Slider_By_Id(id){
    return this.http.get(`${this._api}/ads/get_ads_medfeed_slider1_by_id/`+id);
  }

  Get_Quiz_by_Id(id){
    return this.http.get(`${this._api}/ads/get_ads_medfeed_quiz_by_id/`+id);
  }

  Add_Quiz(data){
    return this.http.post(`${this._api}/ads/add_ads_medfeed_quiz`,data);
  }

  Edit_Slider1(data){
    return this.http.put(`${this._api}/ads/edit_ads_medfeed_slider1`,data);
  }
  Edit_Quiz(data){
    return this.http.put(`${this._api}/ads/edit_ads_medfeed_quiz`,data);
  }
  Delete_Quiz(id){
    return this.http.delete(`${this._api}/ads/delete_ads_medfeed_quiz/`+id)
  }
  Edit_QuizOne(data){
    return this.http.put(`${this._api}/ads/edit_ads_medfeed_quiz_one`,data);
  }
  Get_QuizOne(){
    return this.http.get(`${this._api}/ads/get_ads_medfeed_quiz_one`);
  }
}

