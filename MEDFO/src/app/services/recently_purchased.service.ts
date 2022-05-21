import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class RecentlyPurchasedService {
  public _api: string = environment.baseUrl;
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  constructor(private _http: HttpClient) {}
  fetchRecentlyPurchased(): Observable<any> {
    const endPoint = `${this._api}/user/recently_purchased`;
    return this._http.get(endPoint).pipe(catchError(this.handleError));
  }
}
