import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MedcoinService {
  public _API = environment.baseUrl;
  constructor(private _http: HttpClient) {}
  get_user_medcoin_details(page) {
    return this._http
      .get(`${this._API}/user/get_med_coin_details/${page}`)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
