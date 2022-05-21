import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddInventoryService {

  public API = environment.apiUrl;
  constructor(private http: HttpClient) { }



  //product api's

  get_product_id_count(type){
    return this.http.get(`${this.API}/admin/get_productIdCode/`+type);
  }

  get_all_product_listing(type){
    return this.http.get(`${this.API}/admin/list_inventory_dropdown/`+type);
  }

  get_all_category_listing(type){
    return this.http.get(`${this.API}/admin/inventory_category_listing/`+type);
  }

  get_all_policy(){
    return this.http.get(`${this.API}/admin/get_active_master_policy`);
  }

  get_all_brands(){
    return this.http.get(`${this.API}/admin/get_master_brand`);
  }

  get_all_UOM(){
    return this.http.get(`${this.API}/admin/get_active_master_uom`);
  }

  get_all_UOM_value_by_uom_id(id){
    return this.http.get(`${this.API}/admin/get_active_master_uom_value_by_uom_id/`+id);
  }

  get_inventory_by_id(id){
    return this.http.get(`${this.API}/admin/get_inventory_byId/`+id);
  }

  add_inventory_product(data){
    return this.http.post(`${this.API}/admin/add_inventory_product`,data);
  }

  update_inventory_product(data,id){
    return this.http.put(`${this.API}/admin/edit_inventory_product/`+id,data);
  }

  
  upload_image(data){
    return this.http.post(`${this.API}/admin/upload_image`,data);
  }

  upload_video(data){
    return this.http.post(`${this.API}/admin/upload_video`,data);
  }

  delete_image(data){
    return this.http.post(`${this.API}/admin/delete_inventory_image`,data);
  }

  delete_video(data){
    return this.http.post(`${this.API}/admin/delete_inventory_video`,data);
  }

  update_medicine_category(data){
    return this.http.put(`${this.API}/admin/edit_category_medicine`,data);
  }

  delete_medicine_category(id){
    return this.http.delete(`${this.API}/admin/delete_category_medicine/`+id);
  }
}
