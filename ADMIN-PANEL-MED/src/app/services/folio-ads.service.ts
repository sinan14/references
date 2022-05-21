import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class FolioAdsService {
  public _api=environment.apiUrl;

  // FolioFit Page API's


//Slider 1
public GET_SLIDER1_DETAILS=`${this._api}/ads/get_ads_foliofit_slider1`;
public GET_SINGLE_SLIDER1_DETAILS=`${this._api}/ads/get_ads_foliofit_slider1_by_id/`;
public POST_SLIDER1_DETAILS = `${this._api}/ads/add_ads_foliofit_slider1`;
public UPDATE_SLIDER1_DETAILS=`${this._api}/ads/edit_ads_foliofit_slider1`;
public DELETE_SLIDER1_DETAILS=`${this._api}/ads/delete_ads_foliofit_slider1/`;

  //Slider 2 API'S

public GET_SLIDER2_DETAILS=`${this._api}/ads/get_ads_foliofit_slider2`;
public GET_SINGLE_SLIDER2_DETAILS=`${this._api}/ads/get_ads_foliofit_slider2_by_id/`;
public POST_SLIDER2_DETAILS = `${this._api}/ads/add_ads_foliofit_slider2`;
public UPDATE_SLIDER2_DETAILS=`${this._api}/ads/edit_ads_foliofit_slider2`;
public DELETE_SLIDER2_DETAILS=`${this._api}/ads/delete_ads_foliofit_slider2/`;


 //Slider 3 API'S

 public GET_SLIDER3_DETAILS=`${this._api}/ads/get_ads_foliofit_slider3`;
 public GET_SINGLE_SLIDER3_DETAILS=`${this._api}/ads/get_ads_foliofit_slider3_by_id/`;
 public POST_SLIDER3_DETAILS = `${this._api}/ads/add_ads_foliofit_slider3`;
 public UPDATE_SLIDER3_DETAILS=`${this._api}/ads/edit_ads_foliofit_slider3`;
 public DELETE_SLIDER3_DETAILS=`${this._api}/ads/delete_ads_foliofit_slider3/`;


 //Main Category API

 public GET_MAIN_CATEGORY_DETAILS = `${this._api}/ads/get_ads_foliofit_main_category`;
 public GET_SINGLE_MAIN_CATEGORY_DETAILS = `${this._api}/ads/get_ads_foliofit_main_category_by_id/`;
 public UPDATE_MAIN_CATEGORY_DETAILS = `${this._api}/ads/edit_ads_foliofit_main_category`;
  


//Ff API
  public FF_UPDATE_SLIDER2_DETAILS=`${this._api}/ads/edit_ads_foliofit_slider2`;
  public FF_POST_SLIDER2_DETAILS=`${this._api}/ads/add_ads_foliofit_slider2`;
  public FF_DELETE_SLIDER2_DETAILS=`${this._api}/ads/delete_ads_foliofit_slider2/:id`;
  
 
  //AD 1,Fitness club Banner, Yogabanner API's
  public FF_GET_Ad1_FB_YB_DETAILS=`${this._api}/ads/get_ads_foliofit_`;

  //Fitness Club Slider
 public FF_GET_FC_SLIDER_DETAILS=`${this._api}/ads/get_ads_foliofit_fitness_club_slider`;

//YOGA SLIDER
public FF_GET_YOGA_SLIDER_DETAILS=`${this._api}/ads/get_ads_foliofit_yoga_slider`;

constructor(private http:HttpClient) { }

  //Slider 1 api call methods

  get_slider1_details(){
    return this.http.get(`${this.GET_SLIDER1_DETAILS}`);
  }

  get_single_slider1_details(id){
    return this.http.get(`${this.GET_SINGLE_SLIDER1_DETAILS}`+id);
  }

  Post_Slider1_Details(data){
    return this.http.post(`${this.POST_SLIDER1_DETAILS}`,data);
  }

  update_slider1_details(id){
    return this.http.put(`${this.UPDATE_SLIDER1_DETAILS}`,id);
  }

  Delete_Slider1(id){
    return this.http.delete(`${this.DELETE_SLIDER1_DETAILS}`+id);
  }



 //Slider 2 api call methods

 
  get_slider2_details(){
    return this.http.get(`${this.GET_SLIDER2_DETAILS}`);
  }

  get_single_slider2_details(id){
    return this.http.get(`${this.GET_SINGLE_SLIDER2_DETAILS}`+id);
  }

  Post_Slider2_Details(data){
    return this.http.post(`${this.POST_SLIDER2_DETAILS}`,data);
  }
  
  update_slider2_details(data){
    return this.http.put(`${this.UPDATE_SLIDER2_DETAILS}`,data);
  }

  
  Delete_Slider2(id){
    return this.http.delete(`${this.DELETE_SLIDER2_DETAILS}`+id);
  }



  
 //Slider 3 api call methods

 
 get_slider3_details(){
  return this.http.get(`${this.GET_SLIDER3_DETAILS}`);
}

get_single_slider3_details(id){
  return this.http.get(`${this.GET_SINGLE_SLIDER3_DETAILS}`+id);
}

Post_Slider3_Details(data){
  return this.http.post(`${this.POST_SLIDER3_DETAILS}`,data);
}

update_slider3_details(data){
  return this.http.put(`${this.UPDATE_SLIDER3_DETAILS}`,data);
}


Delete_Slider3(id){
  return this.http.delete(`${this.DELETE_SLIDER3_DETAILS}`+id);
}


//Main Category

get_main_category_details(){
  return this.http.get(`${this.GET_MAIN_CATEGORY_DETAILS}`);
}

get_single_main_category_details(id){
  return this.http.get(`${this.GET_SINGLE_MAIN_CATEGORY_DETAILS}`+id);
}

update_main_category_details(data){
  return this.http.put(`${this.UPDATE_MAIN_CATEGORY_DETAILS}`,data);
}



  //ad1

  get_Ad1_fb_yb_details(type){
    return this.http.get(`${this.FF_GET_Ad1_FB_YB_DETAILS}`+type);
  }

  
  Get_Ad_By_Id(id){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_ad1_by_id/`+id);
    }


    Edit_Ad(data){
      return this.http.put(`${this._api}/ads/edit_ads_foliofit_ad1`,data);
    }


  //Fitness club banner

  Get_FC_Banner_Details(){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_fitness_club_banner`);
  }

  Get_single_FC_Banner_Details(id){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_fitness_club_banner_by_id/`+id);
  }

  Post_FC_Banner_Details(data){
    return this.http.post(`${this._api}/ads/edit_ads_foliofit_fitness_club_banner`,data);
  }

  Update_FC_Banner_Details(data){
    return this.http.put(`${this._api}/ads/edit_ads_foliofit_fitness_club_banner`,data);
  }




  //Fitness Club Slider

  get_FC_Slider_Details(){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_fitness_club_slider`);
  }

  get_single_FC_Slider_Details(id){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_fitness_club_slider_by_id/`+id);
  }

  Post_FC_Slider_Details(data){
    return this.http.post(`${this._api}/ads/add_ads_foliofit_fitness_club_slider`,data);
  }

  Update_FC_Slider_Details(data){
    return this.http.put(`${this._api}/ads/edit_ads_foliofit_fitness_club_slider`,data);
  }

  Delete_FC_Slider_Details(id){
    return this.http.delete(`${this._api}/ads/delete_ads_foliofit_fitness_club_slider/`+id);
  }



  
 //Yoga Banner Slider
  Get_Yoga_Banner_Details(){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_yoga_banner`);
  }

  Get_Yoga_Banner_By_Id(id){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_yoga_banner_by_id/`+id);
  }

  Post_Yoga_Banner_By_Id(data){
    return this.http.post(`${this._api}/ads/add_ads_foliofit_yoga_banner`,data);
  }

  Update_Yoga_Banner_By(data){
    return this.http.put(`${this._api}/ads/edit_ads_foliofit_yoga_banner`,data);
  }

  delete_Yoga_Banner_By_Id(id){
    return this.http.delete(`${this._api}/ads/delete_ads_foliofit_yoga_banner/`+id);
  }





  //Yoga Slider Slider

  get_Yoga_Slider_Details(){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_yoga_slider`);
  }

  get_single_Yoga_Slider_Details(id){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_yoga_slider_by_id/`+id);
  }
  
  Post_Yoga_Slider_Details(data){
    return this.http.post(`${this._api}/ads/add_ads_foliofit_yoga_slider`,data);
  }

  Update_Yoga_Slider_By_Id(data){
    return this.http.put(`${this._api}/ads/edit_ads_foliofit_yoga_slider`,data);
  }

  delete_Yoga_Slider_By_Id(id){
    return this.http.delete(`${this._api}/ads/delete_ads_foliofit_yoga_slider/`+id);
  }



   //Nutri chart Banner 
   Get_Nutri_Chart_Banner_Details(){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_nutrichart_banner`);
  }

  Get_Nutri_Chart_Banner_By_Id(id){
    return this.http.get(`${this._api}/ads/get_ads_foliofit_nutrichart_banner_by_id/`+id);
  }

  Post_Nutri_Chart_Banner_By_Id(data){
    return this.http.post(`${this._api}/ads/add_ads_foliofit_nutrichart_banner`,data);
  }

  Update_Nutri_Chart_Banner_By_Id(data){
    return this.http.put(`${this._api}/ads/edit_ads_foliofit_nutrichart_banner`,data);
  }

  delete_Nutri_Chart_Banner_By_Id(id){
    return this.http.delete(`${this._api}/ads/delete_ads_foliofit_nutrichart_banner/`+id);
  }

 

 


    //product , category listing

    Get_Product_Details(){
      return this.http.get(`${this._api}/ads/get_all_active_products`);
     }
   
     Get_Category_Details(){
       return this.http.get(`${this._api}/ads/get_sub_catgory_healthcare`);
      }
    

    get_foliofit_categories(){
      return this.http.get(`${this._api}/foliofit/get_foliofit_fitness_categories`);
    }


    get_yoga_categories(){
      return this.http.get(`${this._api}/foliofit/get_foliofit_yoga_categories`);
    }

    
    get_nutri_Chart_categories(){
      return this.http.get(`${this._api}/foliofit/get_foliofit_nutrichart_categories`);
    }
}
