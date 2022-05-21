import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdsSeasonalOffersService {

  public API = environment.apiUrl;


  
  public GET_INVENTORY_DETAILS  = `${this.API}/ads/get_all_active_products`;
  public GET_CATEGORIES_INVENTORY_DETAILS  = `${this.API}/ads/get_sub_catgory_healthcare`;
  public GET_CATEGORY_WISE_PRODUCT_DETAILS = `${this.API}/ads/get_all_active_products_by_category_id/`;

  //Set your deal
  public GET_SET_YOUR_DEALS_DETAILS  = `${this.API}/ads/getSetYourDeal`;
  public GET_SINGLE_SET_YOUR_DEALS_DETAILS  = `${this.API}/ads/getSetYourDeal/`;
  public UPDATE_SET_YOUR_DEALS_DETAILS  = `${this.API}/ads/editSetYourDeal`;
  public DELETE_SET_YOUR_DEALS_DETAILS  = `${this.API}/ads/deleteSetYourDeal/`;


  //set your deal sub (inner page)

  
  public GET_SET_YOUR_DEALS_SUB_DETAILS  = `${this.API}/ads/getSetYourDealSub`;
  public GET_SINGLE_SET_YOUR_DEALS_SUB_DETAILS  = `${this.API}/ads/getSetYourDealSub/`;
  public UPDATE_SET_YOUR_DEALS_SUB_DETAILS  = `${this.API}/ads/editSetYourDealSub`;
  public DELETE_SET_YOUR_DEALS_SUB_DETAILS  = `${this.API}/ads/deleteSetYourDealSub/`;



  
  //Set your Offers
  public GET_SET_YOUR_OFFERS_DETAILS  = `${this.API}/ads/getSetNewOffer`;
  public GET_SINGLE_SET_YOUR__OFFERS_DETAILS  = `${this.API}/ads/getSetNewOffer/`;
  public UPDATE_SET_YOUR_OFFERS_DETAILS  = `${this.API}/ads/editSetNewOffer`;
  public DELETE_SET_YOUR_OFFERS_DETAILS  = `${this.API}/ads/deleteSetNewOffer/`;


  //set your Offers sub (inner page)

  
  public GET_SET_YOUR_OFFERS_SUB_DETAILS  = `${this.API}/ads/getSetNewOffersub`;
  public GET_SINGLE_SET_YOUR_OFFERS_SUB_DETAILS  = `${this.API}/ads/getSetNewOffersub/`;
  public GET_SINGLE_SET_YOUR_OFFERS_SUB_CATEGORIES  = `${this.API}/ads/getCatSetNewOffersub/`;
  public UPDATE_SET_YOUR_OFFERS_SUB_DETAILS  = `${this.API}/ads/editSetNewOffersub`;
  public DELETE_SET_YOUR_OFFERS_SUB_DETAILS  = `${this.API}/ads/deleteSetNewOffersub/`;


  //Editores choice,Vocal Local, Energize your workout
  public GET_EDITOR_VOCAL_ENERGIZE_DETAILS = `${this.API}/ads/getAdseditorsChoiceVocalLocalEnergizeYourWorkout`;
  public GET_SINGLE_EDITOR_VOCAL_ENERGIZE_DETAILS = `${this.API}/ads/getAdseditorsChoiceVocalLocalEnergizeYourWorkout/`;
  public ADD_EDITOR_VOCAL_ENERGIZE_DETAILS = `${this.API}/ads/editAdseditorsChoiceVocalLocalEnergizeYourWorkout`;
  public UPDATE_EDITOR_VOCAL_ENERGIZE_DETAILS = `${this.API}/ads/editAdseditorsChoiceVocalLocalEnergizeYourWorkout`;
  public DELETE_EDITOR_VOCAL_ENERGIZE_DETAILS = `${this.API}/ads/deleteAdseditorsChoiceVocalLocalEnergizeYourWorkout/`;

  //New Offers
  public GET_SET_NEW_OFFERS_DETAILS  = `${this.API}/ads/getSetNewOffer`;
  public GET_SINGLE_SET_NEW_OFFERS_DETAILS  = `${this.API}/ads/getSetNewOffer/`;
  public ADD_SET_NEW_OFFERS_DETAILS  = `${this.API}/ads/editSetNewOffer`;
  public UPDATE_SET_NEW_OFFERS_DETAILS  = `${this.API}/ads/editSetNewOffer`;
  public DELETE_SET_NEW_OFFERS_DETAILS  = `${this.API}/ads/deleteSetNewOffer/`;


  
  //New Offers sub (inner page)
  public GET_SET_NEW_OFFERS_SUB_DETAILS  = `${this.API}/ads/getSetNewOffersub`;
  public GET_CATEGORY_SET_NEW_OFFERS_SUB_DETAILS  = `${this.API}/ads/getCatSetNewOffersub/`;
  public GET_SINGLE_SET_NEW_OFFERS_SUB_DETAILS  = `${this.API}/ads/getSetNewOffersub/`;
  public UPDATE_SET_NEW_OFFERS_SUB_DETAILS  = `${this.API}/ads/editSetNewOffersub`;
  public DELETE_SET_NEW_OFFERS_SUB_DETAILS  = `${this.API}/ads/deleteSetNewOffersub/`;


  //immunity booster
  public GET_IMMUNITY_BOOSTER_DETAILS  = `${this.API}/ads/getImmunityBooster`;
  public GET_SINGLE_IMMUNITY_BOOSTER_DETAILS  = `${this.API}/ads/getSingleImmunityBooster/`;
  public UPDATE_IMMUNITY_BOOSTER_DETAILS  = `${this.API}/ads/editImmunityBooster`;
  public DELETE_IMMUNITY_BOOSTER_DETAILS  = `${this.API}/ads/deleteImmunityBooster/`;

  
  //Top categories
  public GET_TOP_CATEGORIES_DETAILS  = `${this.API}/ads/getTopCategories`;
  public GET_SINGLE_TOP_CATEGORIES_DETAILS  = `${this.API}/ads/getSingleTopCategories/`;
  public UPDATE_TOP_CATEGORIES_DETAILS  = `${this.API}/ads/editTopCategories`;
  public DELETE_TOP_CATEGORIES_DETAILS  = `${this.API}/ads/deleteTopCategories/`;

  
  //Budget Store
  public GET_BUDGET_STORE_DETAILS  = `${this.API}/ads/getBudgetStore`;
  public GET_SINGLE_BUDGET_STORE_DETAILS  = `${this.API}/ads/getSingleBudgetStore/`;
  public ADD_BUDGET_STORE_DETAILS  = `${this.API}/ads/editBudgetStore`;
  public UPDATE_BUDGET_STORE_DETAILS  = `${this.API}/ads/editBudgetStore`;
  public DELETE_BUDGET_STORE_DETAILS  = `${this.API}/ads/deleteBudgetStore/`;


  constructor(private http: HttpClient) { }


  getInventoryDetails(){
    return this.http.get(`${this.GET_INVENTORY_DETAILS}`);
  }


  getCategoryListing(){
    return this.http.get(`${this.GET_CATEGORIES_INVENTORY_DETAILS}`);
  }

  getCategoryWiseProductList(id){
    return this.http.get(`${this.GET_CATEGORY_WISE_PRODUCT_DETAILS}`+id);
    
  }

//Set your new deals
  get_set_your_deals_details(){
    return this.http.get(`${this.GET_SET_YOUR_DEALS_DETAILS}`);
  }

  get_single_set_your_deals_details(id){
    return this.http.get(`${this.GET_SINGLE_SET_YOUR_DEALS_DETAILS}`+id);
  }

  update_set_your_deals_details(data){
    return this.http.put(`${this.UPDATE_SET_YOUR_DEALS_DETAILS}`,data);
  }

  delete_set_your_deals_details(id){
    return this.http.delete(`${this.DELETE_SET_YOUR_DEALS_DETAILS}`+id);
  }


  
//Set your new deals sub (inner page)
get_set_your_deals_sub_details(){
  return this.http.get(`${this.GET_SET_YOUR_DEALS_SUB_DETAILS}`);
}

get_single_set_your_deals_sub_details(id){
  return this.http.get(`${this.GET_SINGLE_SET_YOUR_DEALS_SUB_DETAILS}`+id);
}

update_set_your_deals_sub_details(data){
  return this.http.put(`${this.UPDATE_SET_YOUR_DEALS_SUB_DETAILS}`,data);
}

delete_set_your_deals_sub_details(id){
  return this.http.delete(`${this.DELETE_SET_YOUR_DEALS_SUB_DETAILS}`+id);
}



//Set your new offers
get_set_your_offers_details(){
  return this.http.get(`${this.GET_SET_YOUR_OFFERS_DETAILS}`);
}

get_single_set_your_offers_details(id){
  return this.http.get(`${this.GET_SINGLE_SET_YOUR__OFFERS_DETAILS}`+id);
}

update_set_your_offers_details(data){
  return this.http.put(`${this.UPDATE_SET_YOUR_OFFERS_DETAILS}`,data);
}

delete_set_your_offers_details(id){
  return this.http.delete(`${this.DELETE_SET_YOUR_OFFERS_DETAILS}`+id);
}



//Set your new offers sub (inner page)
get_set_your_offers_sub_details(){
  return this.http.get(`${this.GET_SET_YOUR_OFFERS_SUB_DETAILS}`);
}

get_single_set_your_offers_sub_details(id){
  return this.http.get(`${this.GET_SINGLE_SET_YOUR_OFFERS_SUB_DETAILS}`+id);
}

get_single_set_your_offers_sub_categories(id){
  return this.http.get(`${this.GET_SINGLE_SET_YOUR_OFFERS_SUB_CATEGORIES}`+id);
  }

update_set_your_offers_sub_details(data){
  return this.http.put(`${this.UPDATE_SET_YOUR_OFFERS_SUB_DETAILS}`,data);
}

delete_set_your_offers_sub_details(id){
  return this.http.delete(`${this.DELETE_SET_YOUR_OFFERS_SUB_DETAILS}`+id);
}




   //Editores choice,Vocal Local, Energize your workout

   get_editor_vocal_energize_details(){
    return this.http.get(`${this.GET_EDITOR_VOCAL_ENERGIZE_DETAILS}`);
  }

  get_single_editor_vocal_energize_details(id){
    return this.http.get(`${this.GET_SINGLE_EDITOR_VOCAL_ENERGIZE_DETAILS}`+id);
  }

  update_editor_vocal_energize_details(data){
    return this.http.put(`${this.UPDATE_EDITOR_VOCAL_ENERGIZE_DETAILS}`,data);
  }

  delete_editor_vocal_energize_details(id){
    return this.http.delete(`${this.DELETE_EDITOR_VOCAL_ENERGIZE_DETAILS}`+id);
  }

   //New Offers
   get_new_offers_details(){
    return this.http.get(`${this.GET_SET_NEW_OFFERS_DETAILS}`);
  }

  get_single_new_offers_details(id){
    return this.http.get(`${this.GET_SINGLE_SET_NEW_OFFERS_DETAILS}`+id);
  }

  update_new_offers_details(data){
    return this.http.put(`${this.UPDATE_SET_NEW_OFFERS_DETAILS}`,data);
  }

  delete_new_offers_details(id){
    return this.http.delete(`${this.DELETE_SET_NEW_OFFERS_DETAILS}`+id);
  }


    //New Offers Sub (inner page)
    get_new_offers_sub_details(){
      return this.http.get(`${this.GET_SET_NEW_OFFERS_SUB_DETAILS}`);
    }

    get_category_new_offers_sub_details(){
      return this.http.get(`${this.GET_CATEGORY_SET_NEW_OFFERS_SUB_DETAILS}`);
    }
  
    get_single_new_offers_sub_details(id){
      return this.http.get(`${this.GET_SINGLE_SET_NEW_OFFERS_SUB_DETAILS}`+id);
    }
  
    update_new_offers_sub_details(data){
      return this.http.put(`${this.UPDATE_SET_NEW_OFFERS_SUB_DETAILS}`,data);
    }
  
    delete_new_offers_sub_details(id){
      return this.http.delete(`${this.DELETE_SET_NEW_OFFERS_SUB_DETAILS}`+id);
    }


    //Immunity Booster
   get_immunity_booster_details(){
    return this.http.get(`${this.GET_IMMUNITY_BOOSTER_DETAILS}`);
  }

  get_single_immunity_booster_details(id){
    return this.http.get(`${this.GET_SINGLE_IMMUNITY_BOOSTER_DETAILS}`+id);
  }

  update_immunity_booster_details(data){
    return this.http.put(`${this.UPDATE_IMMUNITY_BOOSTER_DETAILS}`,data);
  }

  delete_immunity_booster_details(id){
    return this.http.delete(`${this.DELETE_IMMUNITY_BOOSTER_DETAILS}`+id);
  }

    //Top categories
    get_top_categories_details(){
      return this.http.get(`${this.GET_TOP_CATEGORIES_DETAILS}`);
    }
  
    get_single_top_categories_details(id){
      return this.http.get(`${this.GET_SINGLE_TOP_CATEGORIES_DETAILS}`+id);
    }

  
    update_top_categories_details(data){
      return this.http.put(`${this.UPDATE_TOP_CATEGORIES_DETAILS}`,data);
    }
  
    delete_top_categories_details(id){
      return this.http.delete(`${this.DELETE_TOP_CATEGORIES_DETAILS}`+id);
    }

     //Budget Store
     get_budget_store_details(){
      return this.http.get(`${this.GET_BUDGET_STORE_DETAILS}`);
    }
  
    get_single_budget_store_details(id){
      return this.http.get(`${this.GET_SINGLE_BUDGET_STORE_DETAILS}`+id);
    }
  
    update_budget_store_details(data){
      return this.http.put(`${this.UPDATE_BUDGET_STORE_DETAILS}`,data);
    }
  
    delete_budget_store_details(id){
      return this.http.delete(`${this.DELETE_BUDGET_STORE_DETAILS}`+id);
    }




}
