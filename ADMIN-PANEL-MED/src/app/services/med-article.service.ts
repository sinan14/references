import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MedArticleService {

  public API = environment.apiUrl;
  //common
  
  //Med Article
  public GET_ARTICLE_BY_CATEGORY_DETAILS  = `${this.API}/medfeed/viewArticlesByCategory/`;

  public GET_ARTICLE_CATEGORIES_DETAILS  = `${this.API}/admin/get_all_sub_article_categories`;
  public GET_SUB_ARTICLES_CATEGORIES_LIST = `${this.API}/admin/get_all_sub_article_categories`;

  public GET_SINGLE_SUB_ARTICLES_CATEGORIES_LIST = `${this.API}/admin/get_sub_article_categories/`;

  public GET_MAIN_ARTICLES_CATEGORIES_LIST =  `${this.API}/admin/get_main_article_categories`

  //article API's
  public GET_ARTICLE_DETAILS = `${this.API}/medfeed/viewAllArticles`;
  public GET_SINGLE_ARTICLE_CATEGORIES = `${this.API}/medfeed/viewArticle/`
  public ADD_ARTICLE_DETAILS = `${this.API}/medfeed/addArticle`;
  public UPDATE_ARTICLE_DETAILS = `${this.API}/medfeed/editArticle`;
  public DELETE_ARTICLE_DETAILS = `${this.API}/medfeed/deleteArticle/`;
  public SEARCH_ARTICLE_DETAILS = `${this.API}/medfeed/searchArticleAdmin`;


  public VIEW_ARTICLE_BY_SUB_CATEGORY = `${this.API}/medfeed/viewArticlesBySubcategory`;

  public GET_INVETORY_LIST = `${this.API}/admin/list_inventory`;
  public GET_ARTICLE_LIST = `${this.API}/medfeed/list_articles`;


  //get List API's

  public GET_MOST_VIEWED_DETAILS = `${this.API}/medfeed/viewMostViewedArticles`;
  public GET_MOST_SHARED_DETAILS = `${this.API}/medfeed/viewMostSharedArticles`;
  public GET_NEWEST_DETAILS = `${this.API}/medfeed/viewNewestArticles`;
  public GET_TRENDING_DETAILS = `${this.API}/medfeed/viewTrendingArticles`;
  public GET_HOME_PAGE_MAIN_DETAILS = `${this.API}/medfeed/viewhomepageMainArticles`;
  public GET_HOME_PAGE_SUB_DETAILS = `${this.API}/medfeed/viewhomepageSubArticles`;
 

  constructor(private http: HttpClient) { }


  get_article_by_category(id){
    return this.http.get(`${this.GET_ARTICLE_BY_CATEGORY_DETAILS}`+id);
    
  }
  getArticleCategoriesDetails(){
    return this.http.get(`${this.GET_ARTICLE_CATEGORIES_DETAILS}`);
  }

  get_Sub_Article_Categories_list(){
    return this.http.get(`${this.GET_SUB_ARTICLES_CATEGORIES_LIST}`);
  }

  get_single_sub_article_category(id){
    return this.http.get(`${this.GET_SINGLE_SUB_ARTICLES_CATEGORIES_LIST}`+id);
  }

  get_Main_Article_Categories(){
    return this.http.get(`${this.GET_MAIN_ARTICLES_CATEGORIES_LIST}`);
  }

  get_all_article_details(){
    return this.http.get(`${this.GET_ARTICLE_DETAILS}`);
  }

  get_single_article_details(id){
    return this.http.get(`${this.GET_SINGLE_ARTICLE_CATEGORIES}`+id);
    
  }

  get_article_by_subcategory(data){
    return this.http.post(`${this.VIEW_ARTICLE_BY_SUB_CATEGORY}`,data);
    
  }


  search_article_detaisl(data){
    return this.http.post(`${this.SEARCH_ARTICLE_DETAILS}`,data);
    
  }

  add_article_details(data){
    return this.http.post(`${this.ADD_ARTICLE_DETAILS}`,data);
  }


  delete_article_details(id){
    return this.http.delete(`${this.DELETE_ARTICLE_DETAILS}`+id);
  }


  edit_article_details(data){
    return this.http.put(`${this.UPDATE_ARTICLE_DETAILS}`,data);
  }

  get_Inventory_List(){
    return this.http.get(`${this.GET_INVETORY_LIST}`)
  }

  get_Article_List(){
    return this.http.get(`${this.GET_ARTICLE_LIST}`)
  }

  //Get Listing
  get_most_viewed_details(){
    return this.http.get(`${this.GET_MOST_VIEWED_DETAILS}`);
  }

  
  get_most_shared_details(){
    return this.http.get(`${this.GET_MOST_SHARED_DETAILS}`);
  }

  get_newest_details(){
    return this.http.get(`${this.GET_NEWEST_DETAILS}`);
  }
  
  
  get_trending_details(){
    return this.http.get(`${this.GET_TRENDING_DETAILS}`);
  }

  
  get_home_page_main_details(){
    return this.http.get(`${this.GET_HOME_PAGE_MAIN_DETAILS}`);
  }

  
  get_home_page_sub_details(){
    return this.http.get(`${this.GET_HOME_PAGE_SUB_DETAILS}`);
  }
  
  
  



}
