import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class DeliveryBoyService {
  public _API = environment.apiUrl;

  public DELIVERY_BOY_STATUS_UPDATE =
    this._API + '/delivery/change_delivery_boy_active_status/';
  public DELIVERY_BOY_APPROVE =
    this._API + '/delivery/change_delivery_boy_approve_status/';

  public EDIT_DELIVERY_BOY = this._API + '/delivery/edit_delivery_boys/';
  public GET_STORE = this._API + '/delivery/get_active_store/';
  public GET_ACTIVE_PINCODE =
    this._API + '/delivery/get_active_pincode_by_store/';

  constructor(private _http: HttpClient) {}

  fetchPendingBoy() {
    return this._http.get(`${this._API}/delivery/get_pending_delivery_boys`);
  }
  fetchActiveBoy() {
    return this._http.get(`${this._API}/delivery/get_approved_delivery_boys`);
  }
  fetchBoyById(_id) {
    return this._http.get(
      `${this._API}/delivery/get_delivery_boy_details_by_id/${_id}`
    );
  }

  update_Delivery_Status(id) {
    return this._http.get(this.DELIVERY_BOY_STATUS_UPDATE + id);
  }

  approve_Delivery_Boy(data) {
    return this._http.post(this.DELIVERY_BOY_APPROVE, data);
  }

  edit_DELIVERY_BOY(body) {
    return this._http.post(this.EDIT_DELIVERY_BOY, body);
  }

  get_store() {
    return this._http.get(this.GET_STORE);
  }

  get_active_pincode(data) {
    return this._http.post(this.GET_ACTIVE_PINCODE, data);
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  // listPendingToAdmin(): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_pending_paid_to_admin_delivery_boys`;

  //   console.log(endPoint);
  //   return this._http.get(endPoint).pipe(catchError(this.handleError));
  // }

  // filterPendingToAdminDateWise(data): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_date_pending_paid_to_admin_delivery_boys`;

  //   console.log(endPoint);
  //   console.log(data);
  //   return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  // }

  // listPaidToAdmin(data): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_paid_to_admin_delivery_boys`;

  //   console.log(endPoint);
  //   console.log(data);
  //   return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  // }
  // filterPaidToAdminDateWise(data): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_date_paid_to_admin_delivery_boys`;

  //   console.log(endPoint);
  //   console.log(data);
  //   return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  // }

  // listPayableToDeliveryBoy(): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_pending_paid_to_delivery_boys`;

  //   console.log(endPoint);
  //   return this._http.get(endPoint).pipe(catchError(this.handleError));
  // }

  // filterPayableToDeliveryBoyDateWise(data): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_date_pending_paid_to_delivery_boys`;

  //   console.log(endPoint);
  //   console.log(data);
  //   return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  // }

  // listPaidToDeliveryBoy(): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_paid_to_delivery_boys`;

  //   console.log(endPoint);
  //   return this._http.get(endPoint).pipe(catchError(this.handleError));
  // }

  // filterPaidToDeliveryBoyDateWise(data): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_date_paid_to_delivery_boys`;

  //   console.log(endPoint);
  //   console.log(data);
  //   return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  // }

  //search

  // searchPaidToAdmin(data): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_search_paid_to_admin_delivery_boy`;
  //   console.log(endPoint);
  //   console.log(data);
  //   return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  // }
  // searchPaidToBoy(data): Observable<any> {
  //   const endPoint = `${this._API}/delivery/get_searched_paid_to_delivery_boys`;
  //   console.log(endPoint);
  //   console.log(data);
  //   return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  // }
  changePendingToAdminStatus(updatedStatus): Observable<any> {
    const endPoint = `${this._API}/delivery/change_pending_paid_to_admin_delivery_boy_status`;
    console.log(endPoint);
    return this._http
      .post(endPoint, updatedStatus)
      .pipe(catchError(this.handleError));
  }
  showPendingToAdminId(data): Observable<any> {
    const endPoint = `${this._API}/delivery/get_date_pending_paid_to_admin_delivery_boy`;
    console.log(endPoint);
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }

  showPaidToAdminById(data): Observable<any> {
    const endPoint = `${this._API}/delivery/get_date_paid_to_admin_delivery_boy`;
    console.log(endPoint);
    console.log(data);
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  showPayableToDeliveryBoyById(data): Observable<any> {
    const endPoint = `${this._API}/delivery/get_date_pending_paid_to_delivery_boy`;

    console.log(endPoint);
    console.log(data);
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  showPaidToDeliveryBoyById(data): Observable<any> {
    const endPoint = `${this._API}/delivery/get_date_paid_to_delivery_boy`;
    console.log(endPoint);
    console.log(data);
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  payToDeliveryBoy(updatedStatus): Observable<any> {
    const endPoint = `${this._API}/delivery/change_delivery_boy_pending_paid_status`;

    console.log(endPoint);
    return this._http
      .post(endPoint, updatedStatus)
      .pipe(catchError(this.handleError));
  }
  queryById(data) {
    const endPoint = `${this._API}/delivery/get_dated_delivery_boy_queries`;
    console.log(endPoint);
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  deleteQuery(id) {
    const endPoint = `${this._API}/delivery/delete_delivery_queries/${id}`;

    return this._http.delete(endPoint).pipe(catchError(this.handleError));
  }
  listQueries(data) {
    const endPoint = `${this._API}/delivery/get_dated_delivery_queries`;
    console.log(endPoint);
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  replayToQuery(data) {
    const endPoint = `${this._API}/delivery/reply_delivery_boy_queries`;
    console.log(endPoint);
    return this._http.post(endPoint, data).pipe(catchError(this.handleError));
  }
}
