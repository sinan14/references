import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FoliofitDietRegimeService {

  constructor(private http: HttpClient) { }

  public API_URL = environment.apiUrl;

  getAll(): Observable<any> {
    return this.http.get(`${this.API_URL}/foliofit/viewAllDietPlans`);
  }

  delete(id): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/foliofit/deleteDietPlan/${id}`);
  }

  update(data): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/foliofit/editDietPlan`, data);
  }

  save(data): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/foliofit/addDietPlan`, data);
  }

  getAllDays(dietPlanId): Observable<any> {
    return this.http.get(`${this.API_URL}/foliofit/viewDaysByDiet/${dietPlanId}`);
  }

  deleteDay(id): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/foliofit/deleteDay/${id}`);
  }

  // Diet Plan Services

  uploadImage(data): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/foliofit/upload_image`, data);
  }

  saveDay(data): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/foliofit/addDay`, data);
  }

  updateDay(data): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/foliofit/editDay`, data);
  }

}
