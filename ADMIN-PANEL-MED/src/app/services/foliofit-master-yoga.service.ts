import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoliofitMasterYogaService {

  public API = environment.apiUrl;
  constructor(private http: HttpClient) { }

  //fitness Categories

  get_all_yoga_categories(){
    return this.http.get(`${this.API}/foliofit/get_foliofit_yoga_categories`);
  }

  get_all_yoga_videos(){
    return this.http.get(`${this.API}/foliofit/get_all_paginated_foliofit_yoga_video`);
  }


  //Main Category
  get_main_category_list(){
    return this.http.get(`${this.API}/foliofit/get_all_foliofit_master_yoga_main_category`);
  }

  get_single_main_category_list(id){
    return this.http.get(`${this.API}/foliofit/get_foliofit_master_yoga_main_category/`+id);
  }

  update_main_category_list(data){
    return this.http.put(`${this.API}/foliofit/edit_foliofit_master_yoga_main_category`,data);
  }


  //start your healthy 
  get_start_healthy_list(){
    return this.http.get(`${this.API}/foliofit/get_all_foliofit_master_yoga_healthy`);
  }

  get_single_start_healthy_list(id){
    return this.http.get(`${this.API}/foliofit/get_foliofit_master_yoga_healthy/`+id);
  }

  add_start_healthy_list(data){
    return this.http.post(`${this.API}/foliofit/add_foliofit_master_yoga_healthy`,data);
  }

  update_start_healthy_list(data){
    return this.http.put(`${this.API}/foliofit/edit_foliofit_master_yoga_healthy`,data);
  }

  delete_start_healthy_list(id){
    return this.http.delete(`${this.API}/foliofit/delete_foliofit_master_yoga_healthy/`+id);
  }


   //Weekly Workouts
   get_weekly_workouts_list(){
    return this.http.get(`${this.API}/foliofit/get_all_foliofit_master_yoga_weekly`);
  }

  get_single_weekly_workouts_list(id){
    return this.http.get(`${this.API}/foliofit/get_foliofit_master_yoga_weekly/`+id);
  }

  add_weekly_workouts_list(data){
    return this.http.post(`${this.API}/foliofit/add_foliofit_master_yoga_weekly`,data);
  }

  update_weekly_workouts_list(data){
    return this.http.put(`${this.API}/foliofit/edit_foliofit_master_yoga_weekly`,data);
  }

  delete_weekly_workouts_list(id){
    return this.http.delete(`${this.API}/foliofit/delete_foliofit_master_yoga_weekly/`+id);
  }


    //Recommende
    get_recommend_list(){
      return this.http.get(`${this.API}/foliofit/get_all_foliofit_master_yoga_recommend`);
    }
  
    get_single_recommend_list(id){
      return this.http.get(`${this.API}/foliofit/get_foliofit_master_yoga_recommend/`+id);
    }
  
    add_recommend_list(data){
      return this.http.post(`${this.API}/foliofit/add_foliofit_master_yoga_recommend`,data);
    }
  
    update_recommend_list(data){
      return this.http.put(`${this.API}/foliofit/edit_foliofit_master_yoga_recommend`,data);
    }
  
    delete_recommend_list(id){
      return this.http.delete(`${this.API}/foliofit/delete_foliofit_master_yoga_recommend/`+id);
    }



     //Foliofit Home Page
  get_foliofit_home_list(){
    return this.http.get(`${this.API}/foliofit/get_all_foliofit_master_yoga_home`);
  }


  add_foliofit_home_list(data){
    return this.http.post(`${this.API}/foliofit/edit_foliofit_master_yoga_home`,data);
  }

  update_foliofit_home_list(data){
    return this.http.put(`${this.API}/foliofit/edit_foliofit_master_yoga_home`,data);
  }

 

}
