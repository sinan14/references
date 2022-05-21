import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MedArticleCategoryService {

  public API = environment.apiUrl;
  //common
  
  public GET_ARTICLE_CATEGORY_LIST =  `${this.API}/admin/get_main_article_categories`;
  //Med Article
  public GET_ARTICLE_CATEGORIES_DETAILS  = `${this.API}/admin/get_article_categories`;
  public GET_SINGLE_ARTICLE_CATEGORIES_DETAILS  = `${this.API}/admin/viewArticleCategory/`;
  public ADD_ARTICLE_CATEGORY_DETAILS  = `${this.API}/admin/addArticleCategory`;
  public UPDATE_ARTICLE_CATEGORY_DETAILS  = `${this.API}/admin/editArticleCategory`;
  public DELETE_ARTICLE_CATEGORY_DETAILS =`${this.API}/admin/deleteArticleCategory/`;

  //Medfeed Home Page(MedArticle)
  
  public GET_HOME_PAGE_ARTICLES_DETAILS  = `${this.API}/admin/getHomePageArticleCategories`;


  //Live Updates

  public ADD_LIVE_UPDATE_DETAILS  = `${this.API}/admin/addLiveUpdate`;
  public GET_LIVE_UPDATE_DETAILS  = `${this.API}/admin/getLiveUpdate`;
  


  //health care videos
  public GET_HEALTHCARE_VIDEOS_CATEGORY = `${this.API}/admin/get_healthcareVideo_main_categories`
  public GET_HEALTHCARE_VIDEOS_DETAILS  = `${this.API}/admin/get_healthcareVideo_categories`;
  public GET_SINGLE_HEALTHCARE_VIDEOS_DETAILS  = `${this.API}/admin/view_healthcareVideo_category/`;
  public ADD_HEALTHCARE_VIDEOS_DETAILS  = `${this.API}/admin/add_healthcareVideo_category`;
  public UPDATE_HEALTHCARE_VIDEOS_DETAILS  = `${this.API}/admin/edit_healthcareVideo_category`;
  public DELETE_HEALTHCARE_VIDEOS_DETAILS =`${this.API}/admin/delete_healthcareVideo_category/`;
  //Medfeed Home Page(Health Care video)
  public GET_HOME_PAGE_HEALTHCARE_VIDEOS_DETAILS  = `${this.API}/admin/get_homepageHealthCareVideo_categories`;


  //HealthTips
  public GET_HEALTH_TIPS_DETAILS = `${this.API}/admin/get_healthTip_categories`;
  public GET_SINGLE_HEALTH_TIPS_DETAILS  = `${this.API}/admin/view_healthTip_category/`;
  public ADD_HEALTH_TIPS_DETAILS = `${this.API}/admin/add_healthTip_category`;
  public UPDATE_HEALTH_TIPS_DETAILS = `${this.API}/admin/edit_healthTip_category`;
  public DELETE_HEALTH_TIPS_DETAILS = `${this.API}/admin/deleteHealthTipsCategory/`;


  //healthExpert

  public GET_HEALTH_EXPERT_DETAILS = `${this.API}/admin/getAllHealthExpertCategories`;
  public GET_SINGLE_HEALTH_EXPERT_DETAILS  = `${this.API}/admin/viewHealthExpertCategory/`;
  public ADD_HEALTH_EXPERT_DETAILS = `${this.API}/admin/addHealthExpertCategory`;
  public UPDATE_HEALTH_EXPERT_DETAILS = `${this.API}/admin/editHealthExpertCategory`;
  public DELETE_HEALTH_EXPERT_DETAILS = `${this.API}/admin/deleteHealthExpertCategory/`;
  
  
  

  constructor(private http: HttpClient) { }

  //Med Article API's
  getArticleCategoriesDetails(){
    return this.http.get(`${this.GET_ARTICLE_CATEGORIES_DETAILS}`);
  }

  getArticleCategory(){
    return this.http.get(`${this.GET_ARTICLE_CATEGORY_LIST}`);
  }

  get_single_article_ctegory(id){
    return this.http.get(`${this. GET_SINGLE_ARTICLE_CATEGORIES_DETAILS}`+id);
  }

  add_article_Category(data){
    return this.http.post(`${this.ADD_ARTICLE_CATEGORY_DETAILS}`,data);
  }

  update_article_Category(data){
    return this.http.put(`${this.UPDATE_ARTICLE_CATEGORY_DETAILS}`,data);
  }
  
  delete_article_Category(id){
    return this.http.delete(`${this.DELETE_ARTICLE_CATEGORY_DETAILS}`+id);
  }
  //MEedfeed Home Page(Med Artcle)

  get_medfeed_home_page_articles(){
    return this.http.get(`${this.GET_HOME_PAGE_ARTICLES_DETAILS}`);
  }


  //Live Updates
  
  add_live_updates_details(data){
    return this.http.post(`${this.ADD_LIVE_UPDATE_DETAILS}`,data);
  }

  get_live_updates_details(){
    return this.http.get(`${this.GET_LIVE_UPDATE_DETAILS}`);
  }
  

//----------------------------------------------------------------------------------

  //Health Care Videos

  getHealthCareCategoriesDetails(){
    return this.http.get(`${this.GET_HEALTHCARE_VIDEOS_CATEGORY}`);
  }

  get_healthcare_videos_Details(){
    return this.http.get(`${this.GET_HEALTHCARE_VIDEOS_DETAILS}`);
  }


  get_single_healthcare_videos_ctegory(id){
    return this.http.get(`${this. GET_SINGLE_HEALTHCARE_VIDEOS_DETAILS}`+id);
  }

  add_healthcare_videos_Category(data){
    return this.http.post(`${this.ADD_HEALTHCARE_VIDEOS_DETAILS}`,data);
  }

  update_healthcare_videos_Category(data){
    return this.http.put(`${this.UPDATE_HEALTHCARE_VIDEOS_DETAILS}`,data);
  }
  
  delete_healthcare_videos_Category(id){
    return this.http.delete(`${this.DELETE_HEALTHCARE_VIDEOS_DETAILS}`+id);
  }
  //MEedfeed Home Page(Health Care Videos)

  get_medfeed_home_page_healthcare(){
    return this.http.get(`${this.GET_HOME_PAGE_HEALTHCARE_VIDEOS_DETAILS}`);
  }


  //Health Tips
  get_health_tips_Details(){
    return this.http.get(`${this.GET_HEALTH_TIPS_DETAILS}`);
  }


  get_single_health_tips_category(id){
    return this.http.get(`${this. GET_SINGLE_HEALTH_TIPS_DETAILS}`+id);
  }

  add_health_tips_Category(data){
    return this.http.post(`${this.ADD_HEALTH_TIPS_DETAILS}`,data);
  }

  update_health_tips_Category(data){
    return this.http.put(`${this.UPDATE_HEALTH_TIPS_DETAILS}`,data);
  }
  
  delete_health_tips_Category(id){
    return this.http.delete(`${this.DELETE_HEALTH_TIPS_DETAILS}`+id);
  }



   //Health Expert
   get_health_expert_Details(){
    return this.http.get(`${this.GET_HEALTH_EXPERT_DETAILS}`);
  }


  get_single_health_expert_category(id){
    return this.http.get(`${this. GET_SINGLE_HEALTH_EXPERT_DETAILS}`+id);
  }

  add_health_expert_Category(data){
    return this.http.post(`${this.ADD_HEALTH_EXPERT_DETAILS}`,data);
  }

  update_health_expert_Category(data){
    return this.http.put(`${this.UPDATE_HEALTH_EXPERT_DETAILS}`,data);
  }
  
  delete_health_expert_Category(id){
    return this.http.delete(`${this.DELETE_HEALTH_EXPERT_DETAILS}`+id);
  }

  
  



}
