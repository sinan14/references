import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterSettingsCategoryService {

  public API = environment.apiUrl;
  constructor(private http: HttpClient) { }



  //category medicine

  get_all_medicine_category(){
    return this.http.get(`${this.API}/admin/get_category_medicine`);
  }

  get_active_medicine_category(){
    return this.http.get(`${this.API}/admin/get_active_category_medicine`);
  }


  get_medicine_category_by_id(id){
    return this.http.get(`${this.API}/admin/get_category_medicine_by_id/`+id);
  }

  add_medicine_category(data){
    return this.http.put(`${this.API}/admin/edit_category_medicine`,data);
  }


  update_medicine_category(data){
    return this.http.put(`${this.API}/admin/edit_category_medicine`,data);
  }

  delete_medicine_category(id){
    return this.http.delete(`${this.API}/admin/delete_category_medicine/`+id);
  }

  change_status_medicine_category(id,data){
    return this.http.put(`${this.API}/admin/change_status_category_medicine/`+id,data);
  }


  //sub category medicine

  
  get_all_sub_medicine_category_by_category(id){
    return this.http.get(`${this.API}/admin/get_sub_category_medicine_by_category_id/`+id);
  }

  get_active_sub_medicine_category(){
    return this.http.get(`${this.API}/admin/get_active_sub_category_medicine`);
  }

  get_sub_medicine_category_by_id(id){
    return this.http.get(`${this.API}/admin/get_sub_category_medicine_by_id/`+id);
  }

  add_sub_medicine_category(data){
    return this.http.post(`${this.API}/admin/add_sub_category_medicine`,data);
  }


  update_sub_medicine_category(data){
    return this.http.put(`${this.API}/admin/edit_sub_category_medicine`,data);
  }

  delete_sub_medicine_category(id){
    return this.http.delete(`${this.API}/admin/delete_sub_category_medicine/`+id);
  }

  change_status_sub_medicine_category(id,data){
    return this.http.put(`${this.API}/admin/change_status_sub_category_medicine/`+id,data);
  }

  //category healthcare

  get_all_healthcare_category(){
    return this.http.get(`${this.API}/admin/get_category_healthcare`);
  }

  get_active_healthcare_category(){
    return this.http.get(`${this.API}/admin/get_active_category_healthcare`);
  }


  get_healthcare_category_by_id(id){
    return this.http.get(`${this.API}/admin/get_category_healthcare_by_id/`+id);
  }

  add_healthcare_category(data){
    return this.http.post(`${this.API}/admin/add_category_healthcare`,data);
  }


  update_healthcare_category(data){
    return this.http.put(`${this.API}/admin/edit_category_healthcare`,data);
  }

  delete_healthcare_category(id){
    return this.http.delete(`${this.API}/admin/delete_category_healthcare/`+id);
  }

  change_status_healthcare_category(id,data){
    return this.http.put(`${this.API}/admin/change_status_category_healthcare/`+id,data);
  }


   //sub category healthcare

   get_all_sub_healthcare_category_by_categoryid(id){
    return this.http.get(`${this.API}/admin/get_sub_category_healthcare_by_category_id/`+id);
  }

  get_active_sub_healthcare_category(){
    return this.http.get(`${this.API}/admin/get_active_category_healthcare`);
  }


  get_sub_healthcare_category_by_id(id){
    return this.http.get(`${this.API}/admin/get_sub_category_healthcare_by_id/`+id);
  }

  add_sub_healthcare_category(data){
    return this.http.post(`${this.API}/admin/add_sub_category_healthcare`,data);
  }


  update_sub_healthcare_category(data){
    return this.http.put(`${this.API}/admin/edit_sub_category_healthcare`,data);
  }

  delete_sub_healthcare_category(id){
    return this.http.delete(`${this.API}/admin/delete_sub_category_healthcare/`+id);
  }

  change_sub_status_healthcare_category(id,data){
    return this.http.put(`${this.API}/admin/change_status_sub_category_healthcare/`+id,data);
  }

     //sub sub category healthcare

     get_all_sub_sub_healthcare_category_by_subcategoryid(id){
      return this.http.get(`${this.API}/admin/get_sub_sub_category_healthcare_by_category_id/`+id);
    }
  
    get_active_sub_sub_healthcare_category(){
      return this.http.get(`${this.API}/admin/get_active_category_healthcare`);
    }
  
  
    get_sub_sub_healthcare_category_by_id(id){
      return this.http.get(`${this.API}/admin/get_sub_sub_category_healthcare_by_id/`+id);
    }
  
    add_sub_sub_healthcare_category(data){
      return this.http.post(`${this.API}/admin/add_sub_sub_category_healthcare`,data);
    }
  
  
    update_sub_sub_healthcare_category(data){
      return this.http.put(`${this.API}/admin/edit_sub_sub_category_healthcare`,data);
    }
  
    delete_sub_sub_healthcare_category(id){
      return this.http.delete(`${this.API}/admin/delete_sub_sub_category_healthcare/`+id);
    }
  
    change_sub_sub_status_healthcare_category(id,data){
      return this.http.put(`${this.API}/admin/change_status_sub_sub_category_healthcare/`+id,data);
    }


}
