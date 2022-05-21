import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HomeAdsService {


  public API = environment.apiUrl;

  //HOME PAGE API'S 
  public GET_INVENTORY_DETAILS  = `${this.API}/foliofit/getProduct`;
  public GET_CATEGORIES_INVENTORY_DETAILS  = `${this.API}/ads/get_sub_catgory_healthcare`;
  public GET_CATEGORY_WISE_PRODUCT_DETAILS = `${this.API}/foliofit/get_product_by_category_id/`;
  public GET_DIET_PLAN_DETAILS  = `${this.API}/foliofit/list_diet_plans`;


  
  //topcategories,main,ad1,ad6,ad8
  public HOME_GET_TOP_CATEGORIES = `${this.API}/ads/get_ads_home_topCat_mainCat_ad1_ad6_ad8/`;
  public HOME_GET_SINGLE_TOP_CATEGORIES =  `${this.API}/ads/get_ads_home_topCat_mainCat_ad1_ad6_ad8_byId/`;
  public HOME_ADD_TOP_CATEGORIES = `${this.API}/ads/add_ads_home_topCat_mainCat_ad1_ad6_ad8/`;
  public HOME_UPDATE_TOP_CATEGORIES =  `${this.API}/ads/edit_ads_home_topCat_mainCat_ad1_ad6_ad8`;

  //slider 1,2,3,4,5 and ads2,5
  public  HOME_ADD_SLIDER_ADS_DETAILS = `${this.API}/ads/add_ads_home_slider_1234_ad_25/`;
  public HOME_GET_SINGLE_SLIDER_ADS_DETAILS = `${this.API}/ads/get_ads_home_slider_1234_ad_25_byId/`;
  public HOME_GET_SLIDER_ADS_DETAILS =  `${this.API}/ads/get_ads_home_slider_1234_ad_25/`;
  public HOME_UPDATE_SLIDER_ADS_DETAILS =  `${this.API}/ads/edit_ads_home_slider_1234_ad_25`;
  public HOME_DELETE_SLIDER_ADS_DETAILS =  `${this.API}/ads/delete_ads_home_slider_1234_ad_25/`;

  //sub yoga,sub fitness,expert advise
  public HOME_GET_SUB_YOGA_FITNESS_DETAILS =  `${this.API}/ads/get_ads_home_sub_yoga_fitness_expert/`;
  public HOME_GET_SINGLE_SUB_YOGA_FITNESS_DETAILS =  `${this.API}/ads/get_ads_home_yoga_by_id/`;
  public HOME_ADD_SUB_YOGA_FITNESS_DETAILS =  `${this.API}/ads/add_ads_home_sub_yoga_fitness_expert/`;
  public HOME_UPDATE_SUB_YOGA_FITNESS_DETAILS =  `${this.API}/ads/edit_ads_home_sub_yoga_fitness_expert`;
  public HOME_DELETE_SUB_YOGA_FITNESS_DETAILS =  `${this.API}/ads/delete_ads_home_sub_yoga_fitness_expert/`;

  //single sub fitness by id
  public HOME_GET_SINGLE_SUB_FITNESS_DETAILS =  `${this.API}/ads/get_ads_home_fitness_by_id/`;
  

  //expert adivse

  public HOME_GET_EXPERT_ADVISE_DETAILS = `${this.API}/ads/get_ads_home_expertAdvise_replied_qusetions_details`;


  //main yoga,main fitness
  public  HOME_ADD_MAIN_YOGA_FITNESS_DETAILS = `${this.API}/ads/edit_ads_home_main_yoga_fitness/`;
  public HOME_GET_MAIN_YOGA_FITNESS_DETAILS =  `${this.API}/ads/get_ads_home_main_yoga_fitness/`;
  public HOME_UPDATE_MAIN_YOGA_FITNESS_DETAILS =  `${this.API}/ads/edit_ads_home_main_yoga_fitness/`;

  //sing by id main yoga,main fitness
  public HOME_GET_SINGLE_MAIN_FITNESS_DETAILS =  `${this.API}/ads/get_ads_home_fitness_by_id/`;
  public HOME_GET_SINGLE_MAIN_YOGA_FITNESS_DETAILS =  `${this.API}/ads/get_ads_home_main_yoga_fitness_by_id/`;


  public GET_SINGLE_SUB_MAIN_YOGA_DETAILS  = `${this.API}/ads/get_ads_home_yoga_by_id/`;
  public GET_SINGLE_SUB_MAIN_FITNESS_DETAILS  = `${this.API}/ads/get_ads_home_fitness_by_id/`;

  //Ad3
  public HOME_GET_AD3_DETAILS =  `${this.API}/ads/get_ads_home_ad3`;
  public HOME_GET_SINGLE_AD3_DETAILS = `${this.API}/ads/get_ads_home_ad3_byId/`;
  public HOME_UPDATE_AD3_DETAILS =  `${this.API}/ads/edit_ads_home_ad3`;


  //ad4
  public HOME_GET_AD4_DETAILS =  `${this.API}/ads/get_ads_home_ad4`;
  public HOME_GET_SINGLE_AD4_DETAILS = `${this.API}/ads/get_ads_home_ad4_byId/`;
  public HOME_ADD_AD4_DETAILS =  `${this.API}/ads/edit_ads_home_ad4`;
  public HOME_UPDATE_AD4_DETAILS =  `${this.API}/ads/edit_ads_home_ad4`;

  
  //ad7
  public HOME_GET_AD7_DETAILS =  `${this.API}/ads/get_ads_home_ad7`;
  public HOME_GET_SINGLE_AD7_DETAILS = `${this.API}/ads/get_ads_home_ad7_byId/`;
  public HOME_ADD_AD7_DETAILS =  `${this.API}/ads/edit_ads_home_ad7`;
  public HOME_UPDATE_AD7_DETAILS =  `${this.API}/ads/edit_ads_home_ad7`;


  //slider5
  public HOME_GET_SLIDER5_DETAILS =  `${this.API}/ads/get_ads_home_slider5`;
  public HOME_GET_SINGLE_SLIDER5_DETAILS =  `${this.API}/ads/get_ads_home_slider5_byId/`;
  public HOME_ADD_SLIDER5_DETAILS =  `${this.API}/ads/add_ads_home_slider5`;
  public HOME_UPDATE_SLIDER5_DETAILS =  `${this.API}/ads/edit_ads_home_slider5`;
  public HOME_DELETE_SLIDER5_DETAILS =  `${this.API}/ads/delete_ads_home_slider5/`;


  //Trending Category
  public HOME_GET_TRENDING_CATEGORY_DETAILS =  `${this.API}/ads/get_ads_home_trending_category`;
  public HOME_ADD_TRENDING_CATEGORY_DETAILS =  `${this.API}/ads/add_ads_home_trending_category`;
  public HOME_UPDATE_TRENDING_CATEGORY_DETAILS =  `${this.API}/ads/edit_ads_home_trending_category`;
  public HOME_DELETE_TRENDING_CATEGORY_DETAILS =  `${this.API}/ads/delete_ads_home_trending_category/`;


  //Plan your Diet
  public HOME_GET_PLAN_YOUR_DIET_DETAILS =  `${this.API}/ads/get_ads_home_plan_your_diet`;
  public HOME_ADD_PLAN_YOUR_DIET_DETAILS =  `${this.API}/ads/add_ads_home_plan_your_diet`;
  public HOME_UPDATE_PLAN_YOUR_DIET_DETAILS =  `${this.API}/ads/edit_ads_home_plan_your_diet`;
  public HOME_DELETE_PLAN_YOUR_DIET_DETAILS =  `${this.API}/ads/delete_ads_home_plan_your_diet/`;


  //Spot Light
  public HOME_GET_SPOT_LIGHT_DETAILS =  `${this.API}/ads/get_ads_home_spotlight`;
  public HOME_GET_SINGLE_SPOT_LIGHT_DETAILS =  `${this.API}/ads/get_ads_home_spotlight_byId/`;
  public HOME_ADD_SPOT_LIGHT_DETAILS =  `${this.API}/ads/add_ads_home_spotlight`;
  public HOME_UPDATE_SPOT_LIGHT_DETAILS =  `${this.API}/ads/edit_ads_home_spotlight`;
  public HOME_DELETE_SPOT_LIGHT_DETAILS =  `${this.API}/ads/delete_ads_home_spotlight/`;


  //Cart your med essentials
  public HOME_GET_CART_ESSENTIALS_DETAILS =  `${this.API}/ads/get_ads_home_cart`;
  public HOME_GET_SINGLE_CART_ESSENTIALS_DETAILS =  `${this.API}/ads/get_ads_home_cart_byId/`;
  public HOME_ADD_CART_ESSENTIALS_DETAILS =  `${this.API}/ads/add_ads_home_cart`;
  public HOME_UPDATE_CART_ESSENTIALS_DETAILS =  `${this.API}/ads/edit_ads_home_cart`;
  public HOME_DELETE_CART_ESSENTIALS_DETAILS =  `${this.API}/ads/delete_ads_home_cart/`;


  //Cetegories by id sub yoga,sub fitness,expert advise

  public GET_HELATH_TIP_CATEGORY_EXPERT_ADVISE = `${this.API}/admin/getAllHealthExpertCategories`;
  public GET_HELATH_TIP_BY_CATEGORY_ID_EXPERT_ADVISE = `${this.API}/ads/get_ads_home_expertAdvise_replied_qusetions/`;


  public HOME_GET_YOGA_CATEGORIES = `${this.API}/ads/get_ads_home_yoga_categories`;
  public HOME_GET_YOGA_VEDIO_BY_CATEGORY_ID = `${this.API}/foliofit/get_foliofit_yoga_video_by_category/`;

  public HOME_GET_FITNESS_CATEGORIES = `${this.API}/ads/get_ads_home_fitness_categories`;
  public HOME_GET_FITNESS_BY_CATEGORY_ID = `${this.API}/foliofit/get_fitnessClub_by_catId/`;
  


  
  constructor(private http: HttpClient) { }


  getInventoryDetails(){
    return this.http.get(`${this.GET_INVENTORY_DETAILS}`);
  }

  getCategoryWiseProductList(id){
    return this.http.get(`${this.GET_CATEGORY_WISE_PRODUCT_DETAILS}`+id);
    
  }


  getCategoryListing(){
    return this.http.get(`${this.GET_CATEGORIES_INVENTORY_DETAILS}`);
  }

  getDietPlanDetails(){
    return this.http.get(`${this.GET_DIET_PLAN_DETAILS}`);
  }

  //HOME PAGE API CALL
  getAllCategories(type){
    return this.http.get(`${this.HOME_GET_TOP_CATEGORIES}`+type);
  }

  get_single_all_categories(id){
    return this.http.get(`${this.HOME_GET_SINGLE_TOP_CATEGORIES}`+id);
  }

  addTopCategories(type,data){
    return this.http.get(`${this.HOME_ADD_TOP_CATEGORIES}`+type,data);
  }

  updateTopCategories(data){
    return this.http.put(`${this.HOME_UPDATE_TOP_CATEGORIES}`,data);
  }


  //slider 1,2,3,4 and ads 2,5 
  get_Slider_1234_Ads_25_Details(type){
    return this.http.get(`${this.HOME_GET_SLIDER_ADS_DETAILS}`+type);
  }

  get_Single_Slider_1234_Ads_25_Details(id){
    return this.http.get(`${this.HOME_GET_SINGLE_SLIDER_ADS_DETAILS}`+id);
  }

  add_Slider_1234_Ads_25_Details(type,data){
    return this.http.post(`${this.HOME_ADD_SLIDER_ADS_DETAILS}`+type,data);
  }

  delete_Slider_1234_Ads_25_Details(id){
    return this.http.delete(`${this.HOME_DELETE_SLIDER_ADS_DETAILS}`+id);
  }

  update_Slider_1234_Ads_25_Details(data){
    return this.http.put(`${this.HOME_UPDATE_SLIDER_ADS_DETAILS}`,data);
  }

  

  
  //Sub yoga,sub fitness,expertadvice
  get_sub_yoga_fitness_Details(type){
    return this.http.get(`${this.HOME_GET_SUB_YOGA_FITNESS_DETAILS}`+type);
  }

  get_single_sub_yoga_fitness_details(id){
      return this.http.get(`${this.HOME_GET_SINGLE_SUB_YOGA_FITNESS_DETAILS}`+id);
  }

  
  get_single_sub_fitness_details(id){
    return this.http.get(`${this.HOME_GET_SINGLE_SUB_FITNESS_DETAILS}`+id);
  }


  
  add_sub_yoga_fitness_Details(type,data){
    return this.http.post(`${this.HOME_ADD_SUB_YOGA_FITNESS_DETAILS}`+type,data);
  }

  update_sub_yoga_fitness_Details(data){
    return this.http.put(`${this.HOME_UPDATE_SUB_YOGA_FITNESS_DETAILS}`,data);
  }

  delete_sub_yoga_fitness_Details(id){
    return this.http.delete(`${this.HOME_DELETE_SUB_YOGA_FITNESS_DETAILS}`+id);
  }

  get_expert_advise_details(){
    return this.http.get(`${this.HOME_GET_EXPERT_ADVISE_DETAILS}`);
  }



  //Mai yoga,Main fitness
  get_main_yoga_fitness_Details(type){
    return this.http.get(`${this.HOME_GET_MAIN_YOGA_FITNESS_DETAILS}`+type);
  }


  get_single_sub_main_yoga_details(id){
    return this.http.get(`${this.GET_SINGLE_SUB_MAIN_YOGA_DETAILS}`+id);
    
  }

  get_single_sub_main_fitness_details(id){
    return this.http.get(`${this.GET_SINGLE_SUB_MAIN_FITNESS_DETAILS}`+id);
    
  }


  add_main_yoga_fitness_Details(type,data){
    return this.http.post(`${this.HOME_ADD_MAIN_YOGA_FITNESS_DETAILS}`+type,data);
  }

  update_main_yoga_fitness_Details(type,data){
    return this.http.put(`${this.HOME_UPDATE_MAIN_YOGA_FITNESS_DETAILS}`+type,data);
  }


  //Ad3 
  get_ad3_details(){
    return this.http.get(`${this.HOME_GET_AD3_DETAILS}`);
  }

  get_single_ad3_details(id){
    return this.http.get(`${this.HOME_GET_SINGLE_AD3_DETAILS}`+id);
  }

  update_ad3_details(data){
    return this.http.put(`${this.HOME_UPDATE_AD3_DETAILS}`,data);
  }


    //Ad4
    get_ad4_details(){
      return this.http.get(`${this.HOME_GET_AD4_DETAILS}`);
    }

    get_single_ad4_details(id){
      return this.http.get(`${this.HOME_GET_SINGLE_AD4_DETAILS}`+id);
    }

    add_ad4_details(data){
      return this.http.post(`${this.HOME_ADD_AD4_DETAILS}`,data);
    }

  
    update_ad4_details(data){
      return this.http.put(`${this.HOME_UPDATE_AD4_DETAILS}`,data);
    }


    //Ad7
    get_ad7_details(){
      return this.http.get(`${this.HOME_GET_AD7_DETAILS}`);
    }


    get_single_ad7_details(id){
      return this.http.get(`${this.HOME_GET_SINGLE_AD7_DETAILS}`+id);
    }
    
  
    add_ad7_details(data){
      return this.http.post(`${this.HOME_ADD_AD7_DETAILS}`,data);
    }
  
    
    update_ad7_details(data){
      return this.http.put(`${this.HOME_UPDATE_AD7_DETAILS}`,data);
    }

    
    //slider5
    get_slider5_details(){
      return this.http.get(`${this.HOME_GET_SLIDER5_DETAILS}`);
    }

    get_single_slider5_details(id){
      return this.http.get(`${this.HOME_GET_SINGLE_SLIDER5_DETAILS}`+id);
    }
  
    add_slider5_details(data){
      return this.http.post(`${this.HOME_ADD_SLIDER5_DETAILS}`,data);
    }
  
    
    update_slider5_details(data){
      return this.http.put(`${this.HOME_UPDATE_SLIDER5_DETAILS}`,data);
    }


    delete_slider5_details(id){
      return this.http.delete(`${this.HOME_DELETE_SLIDER5_DETAILS}`+id);
    }

    
    //Trending Category
    get_trending_category_details(){
      return this.http.get(`${this.HOME_GET_TRENDING_CATEGORY_DETAILS}`);
    }
  
    add_trending_category_details(data){
      return this.http.post(`${this.HOME_ADD_TRENDING_CATEGORY_DETAILS}`,data);
    }
  
    
    update_trending_category_details(data){
      return this.http.put(`${this.HOME_UPDATE_TRENDING_CATEGORY_DETAILS}`,data);
    }


    delete_trending_category_details(id){
      return this.http.delete(`${this.HOME_DELETE_TRENDING_CATEGORY_DETAILS}`+id);
    }

    //plan your diet
    get_plan_your_diet_details(){
      return this.http.get(`${this.HOME_GET_PLAN_YOUR_DIET_DETAILS}`);
    }
  
    add_plan_your_diet_details(data){
      return this.http.post(`${this.HOME_ADD_PLAN_YOUR_DIET_DETAILS}`,data);
    }
  
    
    update_plan_your_diet_details(data){
      return this.http.put(`${this.HOME_UPDATE_PLAN_YOUR_DIET_DETAILS}`,data);
    }


    delete_plan_your_diet_details(id){
      return this.http.delete(`${this.HOME_DELETE_PLAN_YOUR_DIET_DETAILS}`+id);
    }



    //Spot Light
    get_spot_light_details(){
      return this.http.get(`${this.HOME_GET_SPOT_LIGHT_DETAILS}`);
    }

    get_single_spot_light_details(id){
      return this.http.get(`${this.HOME_GET_SINGLE_SPOT_LIGHT_DETAILS}`+id);
    }

    
  
    add_spot_light_details(data){
      return this.http.post(`${this.HOME_ADD_SPOT_LIGHT_DETAILS}`,data);
    }
  
    
    update_spot_light_details(data){
      return this.http.put(`${this.HOME_UPDATE_SPOT_LIGHT_DETAILS}`,data);
    }


    delete_spot_light_details(id){
      return this.http.delete(`${this.HOME_DELETE_SPOT_LIGHT_DETAILS}`+id);
    }





    //Cart your med essentials
    get_cart_essentials_details(){
      return this.http.get(`${this.HOME_GET_CART_ESSENTIALS_DETAILS}`);
    }

    get_single_cart_essentials_details(id){
      return this.http.get(`${this.HOME_GET_SINGLE_CART_ESSENTIALS_DETAILS}`+id);
    }
  
    add_cart_essentials_details(data){
      return this.http.post(`${this.HOME_ADD_CART_ESSENTIALS_DETAILS}`,data);
    }
  
    
    update_cart_essentials_details(data){
      return this.http.put(`${this.HOME_UPDATE_CART_ESSENTIALS_DETAILS}`,data);
    }


    delete_cart_essentials_details(id){
      return this.http.delete(`${this.HOME_DELETE_CART_ESSENTIALS_DETAILS}`+id);
    }



    //Categories listing by id API's

    get_health_tips_categories_expert_advise(){
      return this.http.get(`${this.GET_HELATH_TIP_CATEGORY_EXPERT_ADVISE}`);
    }

    get_single_health_tips_categories_expert_advise(id){
      return this.http.get(`${this.GET_HELATH_TIP_BY_CATEGORY_ID_EXPERT_ADVISE}`+id);
    }

    get_yoga_categories(){
      return this.http.get(`${this.HOME_GET_YOGA_CATEGORIES}`);
    }

    get_fitness_categories(){
      return this.http.get(`${this.HOME_GET_FITNESS_CATEGORIES}`);
    }


    get_yoga_videos_by_categoryId(id){
      return this.http.get(`${this.HOME_GET_YOGA_VEDIO_BY_CATEGORY_ID}`+id);
    }

    
    get_fitness_videos_by_categoryId(id){
      return this.http.get(`${this.HOME_GET_FITNESS_BY_CATEGORY_ID}`+id);
    }


    //categories,product 

    get_categories(){
      return this.http.get(`${this.API}/ads/get_sub_catgory_healthcare`);
    }

    get_products(){
      return this.http.get(`${this.API}/ads/get_all_active_products`);
    }

  

}
