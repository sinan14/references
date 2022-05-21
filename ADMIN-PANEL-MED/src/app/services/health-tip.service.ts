import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/switchMap';

@Injectable({
  providedIn: 'root'
})
export class HealthTipService {

  constructor(private http: HttpClient) { }

  public API_URL = environment.apiUrl;

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/admin/get_healthTip_categories`);
  }


  getAll(data: any = null): Observable<any> {
    if (data) {
      let categoryArray: any = [];
      categoryArray.push(data);
      let data2 = { "categories": categoryArray }
      return this.http.post(`${this.API_URL}/medfeed/viewHealthTipsByCategory`, data2);
    } else {
      return this.http.get(`${this.API_URL}/medfeed/viewAllHealthTips`);
    }
  }

  getCounts(): Observable<any> {
    return this.http.get(`${this.API_URL}/medfeed/getHealthTipTabCount`);
  }

  getMostViewed(categoryId: any = null): Observable<any> {
    if (categoryId) {
      return this.http.get(`${this.API_URL}/medfeed/viewMostViewedHealthTips/${categoryId}`);
    } else {
      return this.http.get(`${this.API_URL}/medfeed/viewMostViewedHealthTips`);
    }
  }

  getMostShared(categoryId: any = null): Observable<any> {
    if (categoryId) {
      return this.http.get(`${this.API_URL}/medfeed/viewMostSharedHealthTips/${categoryId}`);
    } else {
      return this.http.get(`${this.API_URL}/medfeed/viewMostSharedHealthTips`);
    }
  }

  getNewest(categoryId = null): Observable<any> {
    if (categoryId) {
      return this.http.get(`${this.API_URL}/medfeed/viewNewestHealthTips/${categoryId}`);
    } else {
      return this.http.get(`${this.API_URL}/medfeed/viewNewestHealthTips`);
    }
  }

  getTrending(categoryId = null): Observable<any> {
    if (categoryId) {
      return this.http.get(`${this.API_URL}/medfeed/viewTrendingHealthTips/${categoryId}`);
    } else {
      return this.http.get(`${this.API_URL}/medfeed/viewTrendingHealthTips`);
    }
  }

  get(id: any): Observable<any> {
    return this.http.get(`${this.API_URL}/medfeed/getHealthTip/${id}`);
  }


  save(data): Observable<any> {
    let result: Observable<any>;
    result = this.http.post<any>(`${this.API_URL}/medfeed/addHealthTip`, data);
    return result;
  }

  delete(id): Observable<any> {
    let result: Observable<any>;
    result = this.http.delete<any>(`${this.API_URL}/medfeed/deleteHealthTip/${id}`);
    return result;
  }

  update(id, data): Observable<any> {
    console.log(id, data);

    let result: Observable<any>;
    result = this.http.put<any>(`${this.API_URL}/medfeed/editHealthTip/${id}`, data);
    return result;
  }

  searchEntries(query): Observable<any> {
    let result: Observable<any>;
    result = this.http.post<any>(`${this.API_URL}/medfeed/searchHealthTipsByAdmin`, { keyword: query });
    return result;
  }

  search(terms: Observable<any>) {
    return terms.pipe(debounceTime(800),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term))
    )
  }



}
