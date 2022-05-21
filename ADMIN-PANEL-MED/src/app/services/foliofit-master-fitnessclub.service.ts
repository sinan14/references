import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoliofitMasterFitnessclubService {

  public API = environment.apiUrl;
  constructor(private http: HttpClient) { }

  //fitness Categories

  get_all_fitness_categories(){
    return this.http.get(`${this.API}/foliofit/get_foliofit_fitness_categories`);
  }

  get_all_fitness_videos(){
    return this.http.get(`${this.API}/foliofit/get_foliofit_fitness_club`);
  }


  //Main Category
  get_main_category_list(){
    return this.http.get(`${this.API}/foliofit/get_all_foliofit_master_fitnessclub_main_categories`);
  }

  get_single_main_category_list(id){
    return this.http.get(`${this.API}/foliofit/get_foliofit_master_fitnessclub_main_category/`+id);
  }

  update_main_category_list(data){
    return this.http.put(`${this.API}/foliofit/edit_foliofit_master_fitnessclub_main_category`,data);
  }


  //Home Workouts
  get_home_workouts_list(){
    return this.http.get(`${this.API}/foliofit/get_all_foliofit_master_fitnessclub_home_workouts`);
  }

  get_single_home_workouts_list(id){
    return this.http.get(`${this.API}/foliofit/get_foliofit_master_fitnessclub_home_workouts/`+id);
  }

  add_home_workouts_list(data){
    return this.http.post(`${this.API}/foliofit/add_foliofit_master_fitnessclub_home_workouts`,data);
  }

  update_home_workouts_list(data){
    return this.http.put(`${this.API}/foliofit/edit_foliofit_master_fitnessclub_home_workouts`,data);
  }

  delete_home_workouts_list(id){
    return this.http.delete(`${this.API}/foliofit/delete_foliofit_master_fitnessclub_home_workouts/`+id);
  }


   //Weekly Workouts
   get_weekly_workouts_list(){
    return this.http.get(`${this.API}/foliofit/get_foliofit_master_weekly_workouts`);
  }

  get_single_weekly_workouts_list(id){
    return this.http.get(`${this.API}/foliofit/get_foliofit_master_weeklyworkout_by_id/`+id);
  }

  add_weekly_workouts_list(data){
    return this.http.post(`${this.API}/foliofit/add_foliofit_master_weekly_workout`,data);
  }

  update_weekly_workouts_list(id,data){
    return this.http.put(`${this.API}/foliofit/edit_foliofit_master_weekly_workout/`+id,data);
  }

  delete_weekly_workouts_list(id){
    return this.http.delete(`${this.API}/foliofit/delete_foliofit_master_weekly_workout/`+id);
  }


    //Full Body Workouts
    get_full_body_workouts_list(){
      return this.http.get(`${this.API}/foliofit/get_all_foliofit_master_fitnessclub_full_body_workouts`);
    }
  
    get_single_full_body_workouts_list(id){
      return this.http.get(`${this.API}/foliofit/get_foliofit_master_fitnessclub_full_body_workouts/`+id);
    }
  
    add_full_body_workouts_list(data){
      return this.http.post(`${this.API}/foliofit/add_foliofit_master_fitnessclub_full_body_workouts`,data);
    }
  
    update_full_body_workouts_list(data){
      return this.http.put(`${this.API}/foliofit/edit_foliofit_master_fitnessclub_full_body_workouts`,data);
    }
  
    delete_full_body_workouts_list(id){
      return this.http.delete(`${this.API}/foliofit/delete_foliofit_master_fitnessclub_full_body_workouts/`+id);
    }


    //Commence your  health journey
    get_health_journey_list(){
      return this.http.get(`${this.API}/foliofit/get_all_foliofit_master_fitnessclub_healthy_journey`);
    }
  
    get_single_health_journey_list(id){
      return this.http.get(`${this.API}/foliofit/get_foliofit_master_fitnessclub_healthy_journey/`+id);
    }
  
    add_health_journey_list(data){
      return this.http.post(`${this.API}/foliofit/add_foliofit_master_fitnessclub_healthy_journey`,data);
    }
  
    update_health_journey_list(data){
      return this.http.put(`${this.API}/foliofit/edit_foliofit_master_fitnessclub_healthy_journey`,data);
    }
  
    delete_health_journey_list(id){
      return this.http.delete(`${this.API}/foliofit/delete_foliofit_master_fitnessclub_healthy_journey/`+id);
    }



     //Foliofit Home Page
  get_foliofit_home_list(){
    return this.http.get(`${this.API}/foliofit/get_foliofit_home`);
  }

  get_single_foliofit_home_list(id){
    return this.http.get(`${this.API}/foliofit/get_foliofit_home/`+id);
  }

  add_foliofit_home_list(data){
    return this.http.post(`${this.API}/foliofit/add_foliofit_home`,data);
  }

  update_foliofit_home_list(data){
    return this.http.post(`${this.API}/foliofit/add_foliofit_home`,data);
  }

 

}
