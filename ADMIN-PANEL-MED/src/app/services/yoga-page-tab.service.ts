import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class YogaPageTabService {

  public API = environment.apiUrl;

  public Get_Yoga_Videos = this.API + '/foliofit/get_all_paginated_foliofit_yoga_video'
  public Update_Yoga_Videos = this.API + '/foliofit/edit_foliofit_yoga_video/'

  
  public Get_Categories = this.API + '/foliofit/get_categories_foliofit_yoga_video'

  public Add_Yoga_Videos = this.API + '/foliofit/add_foliofit_yoga_video'
  public Delete_Yoga_Videos = this.API + '/foliofit/delete_foliofit_yoga_video/'

  // public Search_Yoga_Videos = this.API + '/foliofit/search_foliofit_popular_yoga'

  public Get_Popular_Yoga_Videos = this.API + '/foliofit/get_popular_foliofit_yoga'

  public Search_All_Videos = this.API + '/foliofit/search_foliofit_yoga_video'

  public Get_Sub_Categories_Type = this.API + '/foliofit/get_foliofit_yoga_byType/'

  public Get_Yoga_Videos_By_SubCat = this.API + '/foliofit/get_foliofit_yoga_video_by_category/'

  public Get_Yoga_Videos_By_MainCat = this.API + '/foliofit/get_foliofit_yoga_video_byMain/'


  

  constructor(private http: HttpClient) { }

  get_yoga_vid() {
    return this.http.get(this.Get_Yoga_Videos)
  }
  get_Popular_yoga_vid() {
    return this.http.get(this.Get_Popular_Yoga_Videos)
  }

  get_categories() {
    return this.http.get(this.Get_Categories)
  }
  
  get_categories_type(type) {
    return this.http.get(this.Get_Sub_Categories_Type + type)
  }

  add_yoga_vids(data) {
    return this.http.post(this.Add_Yoga_Videos, data)
  }
  update_yoga_vids(id,data) {
    return this.http.put(this.Update_Yoga_Videos + id,data)
  }

  delete_yoga_vids(id) {
    return this.http.delete(this.Delete_Yoga_Videos + id)
  }

  // search_yoga_vids(data) {
  //   return this.http.post(this.Search_Yoga_Videos, data);
  // }

  search_all_videos(input){
    return this.http.post(this.Search_All_Videos, input);
  }
 
  get_yoga_vid_by_Subcat(cat_id) {
    return this.http.get(this.Get_Yoga_Videos_By_SubCat + cat_id)
  }
  
  get_yoga_vid_by_Maincat(type) {
    return this.http.get(this.Get_Yoga_Videos_By_MainCat + type)
  }


}
