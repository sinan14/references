import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoliofitFitnessClubService {

  public API = environment.apiUrl;
  constructor(private http: HttpClient) { }


  get_fitness_club_categories_by_type(type){
    return this.http.get(`${this.API}/foliofit/get_foliofit_fitness_club_byType/`+type);
  }

  
  get_fitness_club_videos_by_type(type){
    return this.http.get(`${this.API}/foliofit/get_foliofit_fitness_club_video_byMain/`+type);
  }

  get_all_videos(){
    return this.http.get(`${this.API}/foliofit/get_foliofit_fitness_club`);
  }

  get_popular_videos(){
    return this.http.get(`${this.API}/foliofit/get_popular_foliofit_fitness_club`);
  }

  get_fitness_categories(){
    return this.http.get(`${this.API}/foliofit/get_foliofit_fitness_categories`);
  }

  get_fitness_club_by_id(id){
    return this.http.get(`${this.API}/foliofit/get_foliofit_fitness_club_byId/`+id);
  }


  get_fitness_club_category_by_id(id){
    return this.http.get(`${this.API}/foliofit//get_fitnessClub_by_catId/`+id);
  }

  add_videos(data){
    return this.http.post(`${this.API}/foliofit/add_fitnessClub_video`,data);
  }


  update_videos(id,data){
    return this.http.put(`${this.API}/foliofit/edit_fitnessClub_video/`+id,data);
  }

  delete_videos(id){
    return this.http.delete(`${this.API}/foliofit/delete_foliofit_fitness_club/`+id);
  }

  search_all_videos(data){
    return this.http.post(`${this.API}/foliofit/search_foliofit_fitness_club`,data);
  }


  search_popular_videos(data){
    return this.http.post(`${this.API}/foliofit/search_foliofit_popular_fitness_club`,data);
  }





}
