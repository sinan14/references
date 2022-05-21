import { HttpClient } from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FoliofitMasterNutriChartService {

  public API = environment.apiUrl

  public GET_CATEGORY_BASED = this.API + '/foliofit/get_nutrichart_category_based'
  public DELETE_CATEGORY_BASED = this.API + '/foliofit/delete_nutrichart_category_based/'
  public ADD_CATEGORY_BASED = this.API + '/foliofit/add_nutrichart_category_based'
  public EDIT_CATEGORY_BASED = this.API + '/foliofit/edit_nutrichart_category_based'

  public GET_ALL_VITAMINS = this.API + '/foliofit/get_nutrichart_vitamin'
  public ADD_VITAMINS = this.API + '/foliofit/add_nutrichart_vitamin'
  public EDIT_VITAMINS = this.API + '/foliofit/edit_nutrichart_vitamin'
  public DELETE_VITAMINS = this.API + '/foliofit/delete_nutrichart_vitamin/'

  public GET_ALL_RECOMENDED = this.API + '/foliofit/get_nutrichart_recommended'
  public DELETE_RECOMENDED = this.API + '/foliofit/delete_nutrichart_recommended'

  
  
  constructor(private http: HttpClient) { }


  getCAT_BASED(){
    return this.http.get(this.GET_CATEGORY_BASED)
  }
  DeleteCAT_BASED(id){
    return this.http.delete(this.DELETE_CATEGORY_BASED + id)
  }
  AddCAT_BASED(data){
    return this.http.post(this.ADD_CATEGORY_BASED ,data)
  }
  EditCAT_BASED(data){
    return this.http.put(this.EDIT_CATEGORY_BASED ,data)
  }
  


  getALL_VITAMINS(){
    return this.http.get(this.GET_ALL_VITAMINS)
  }
  Add_VITAMINS(data){
    return this.http.post(this.ADD_VITAMINS ,data)
  }
  Edit_VITAMINS(data){
    return this.http.put(this.EDIT_VITAMINS ,data)
  }
  Delete_VITAMINS(id){
    return this.http.delete(this.DELETE_VITAMINS + id)
  }
  

  getALL_RECOMENDED(){
    return this.http.get(this.GET_ALL_RECOMENDED)
  }
  Delete_RECOMENDED(id){
    return this.http.post(this.DELETE_RECOMENDED , id)
  }


}
