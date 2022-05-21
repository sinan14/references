import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdsMedimallService {

  constructor(private http: HttpClient) { }

  public API_URL = environment.apiUrl;

  getSliders(sliderType:string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_ads_medimall_slider/${sliderType}`);
  }

  getMainCategories(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_ads_medimall_main_category`);
  }

  getGrooming(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_ads_medimall_grooming`);
  }

  getGroomingByID(id): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_ads_medimall_grooming/`+id);
  }
  
  getTopCategories(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_ads_medimall_top_categories`);
  }

  getImageOnlyAds(type:string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_ads_medimall_topIcon_6Cat_Healthcare/${type}`);
  }

  getWishlistAndRecent(sliderType:string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_ads_medimall_wish_recent/${sliderType}`);
  }
  
  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_all_active_products`);
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_sub_catgory_healthcare`);
  }

  getAllProductsByCategoryID(id): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ads/get_all_active_products_by_category_id/`+id);
  }


  saveSliders(data,sliderType:string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/ads/add_ads_medimall_slider/${sliderType}`, data);
  }

  saveGrooming(data): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/ads/add_ads_medimall_grooming`, data);
  }

  updateSlider(data,sliderType:string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/ads/edit_ads_medimall_slider`, data);
  }

  updateGrooming(data): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/ads/edit_ads_medimall_grooming`, data);
  }

  updateMainCategory(data): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/ads/edit_ads_medimall_main_category`, data);
  }

  updateTopCategory(data): Observable<any> { 
    return this.http.put<any>(`${this.API_URL}/ads/edit_ads_medimall_top_categories`, data);
  }

  updateImageOnlyAds(data,sliderType:string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/ads/edit_ads_medimall_topIcon_6Cat_Healthcare`, data);
  }

  updateWishlistAndRecent(data,sliderType:string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/ads/edit_ads_medimall_wish_recent`, data);
  }

  deleteSlider(id): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/ads/delete_ads_medimall_slider/${id}`);
  }

  deleteGrooming(id): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/ads/delete_ads_medimall_grooming/${id}`);
  }



}
