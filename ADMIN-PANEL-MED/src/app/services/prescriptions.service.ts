import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionsService {
  public API: string = environment.apiUrl;
  constructor(private _http: HttpClient, private _router: Router) {}
  goToCustomerDetails(id) {
    //console.log(id);
    this._router.navigate([`/customer-details/cust/${id}`]);
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  searchPrescription(data): Observable<any> {
    const endPoint = `${this.API}/customer/search_all_customer_prescrition`;
    //console.log(endPoint);
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  fetchPrescription(data): Observable<any> {
    const endPoint = `${this.API}/customer/get_all_customer_prescrition`;
    //console.log(endPoint);
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  deletePrescription(id): Observable<any> {
    const endPoint = `${this.API}/customer/delete_customer_prescrition_by_id/${id}`;
    //console.log(endPoint);
    return this._http.delete(endPoint).pipe(catchError(this.handleError));
  }
}
