import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthCareVideoService {

  constructor(private http: HttpClient, private router: Router) { }


  public API_URL = environment.apiUrl;

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/admin/get_healthcareVideo_main_categories`);
  }

  getVideosByMainCategory(id): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/admin/get_healthCareVideos_by_mainCat/`+id);
  }

  getSubCategories(categoryId: any = null): Observable<any> {
    if (categoryId) {
      return this.http.get<any>(`${this.API_URL}/admin/get_healthcareVideo_sub_categories/${categoryId}`);
    } else {
      return this.http.get<any>(`${this.API_URL}/admin/get_healthcareVideo_sub_categories`);
    }
  }

  getVideos(subCategoryId:any = null,data:any =null): Observable<any> {

    const params = new HttpParams().append('page', '2').append('limit' , '10');

    if (subCategoryId) {
      return this.http.get(`${this.API_URL}/admin/get_healthCareVideos_by_id/${subCategoryId}`,{params});
    } else {
      return this.http.get(`${this.API_URL}/admin/get_all_healthCareVideo`);
    }
  }

  save(data): Observable<any> {
    let result: Observable<any>;
      result = this.http.post<any>(`${this.API_URL}/healthcare/addHealthCareVideo`, data);
    return result;
  }

  searchEntries(query): Observable<any> {
    let result: Observable<any>;
      result = this.http.post<any>(`${this.API_URL}/admin/searchHealthcareVideo/`, { keyword : query});
    return result;
  }

  update(id,data): Observable<any> {
    console.log(id,data);
    
    let result: Observable<any>;
      result = this.http.put<any>(`${this.API_URL}/healthcare/editHealthCareVideo/${id}`, data);
    return result;
  }

  delete(id): Observable<any> {
    let result: Observable<any>;
      result = this.http.delete<any>(`${this.API_URL}/healthcare/delete_HealthCareVideo/${id}`);
    return result;
  }



  search(terms: Observable<any>) {
    return terms.pipe(debounceTime(800),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term))
    )
  }


  getAllVideosList(){
    return this.http.get(`${this.API_URL}/admin/get_all_healthCareVideo`);
  }
}
