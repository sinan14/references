import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FoliofitNutriChartsService {

  constructor(private http: HttpClient) { }

  public API_URL = environment.apiUrl;

  getAll(): Observable<any> {
    return this.http.get(`${this.API_URL}/foliofit/viewAllNutrichartCategories`);
  }

  delete(id): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/foliofit/deleteNutrichartCategory/${id}`);
  }

  update(data): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/foliofit/editNutrichartCategory`, data);
  }

  save(data): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/foliofit/addNutrichartCategory`, data);
  }

  getAllVitamins(): Observable<any> {
    return this.http.get(`${this.API_URL}/foliofit/get_nutrichart_vitamin`);
  }

  getAllNutritiousSources(): Observable<any> {
    return this.http.get(`${this.API_URL}/foliofit/get_nutrichart_category_based`);
  }

  saveFood(data): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/foliofit/addNutrichartFood`, data);
  }

  getAllFoodsFromCategoryId(categoryId): Observable<any> {
    return this.http.get(`${this.API_URL}/foliofit/viewAllNutrichartFoods/${categoryId}`);
  }

  deleteFood(id): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/foliofit/deleteNutrichartFood/${id}`);
  }

  updateFood(data): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/foliofit/editNutrichartFood`, data);
  }

}
