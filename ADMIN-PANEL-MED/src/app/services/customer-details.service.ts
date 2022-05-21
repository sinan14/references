import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CustomerDetailsService {
  public API = environment.apiUrl;

  public GET_USER_DETAILS = this.API + '/customer/get_user_details';
  public GET_USER_COMPLAINTS_BY_ID =
    this.API + '/customer/get_user_complaints/';
  public GET_DEPT_COMPLAINTS =
    this.API + '/customer/get_department_complaints/';
  public GET_CUSTOMER_SINGLE_COMPLAINTS =
    this.API + '/customer/get_single_complaints/';
  public GET_ALL_DEPARTMENTS = this.API + '/admin/view_all_departments/';
  public ADD_USER_COMPLAINT = this.API + '/customer/add_user_complaint/';
  public ADD_NOTES = this.API + '/customer/add-customer-notes/';
  public GET_CUSTOMER_DETAIL = this.API + '/customer/getCustomerDetails';

  admin_get_med_coin_details(values): Observable<any> {
    return this.http
      .post(`${this.API}/admin/get_med_coin_details/${values.page}`, {
        customerId: values.customerId,
      })
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  constructor(private http: HttpClient) {}

  get_User_Details(data) {
    return this.http.post(this.GET_USER_DETAILS, data);
  }
  get_USER_COMPLAINTS_BY_ID(id) {
    return this.http.get(this.GET_USER_COMPLAINTS_BY_ID + id);
  }
  get_DEPT_COMPLAINTS() {
    return this.http.get(this.GET_DEPT_COMPLAINTS);
  }
  get_CUSTOMER_SINGLE_COMPLAINTS(id) {
    return this.http.get(this.GET_CUSTOMER_SINGLE_COMPLAINTS + id);
  }
  get_All_DEPARTMENTS() {
    return this.http.get(this.GET_ALL_DEPARTMENTS);
  }
  add_USER_COMPLAINT(body) {
    return this.http.post(this.ADD_USER_COMPLAINT, body);
  }
  add_Note(data) {
    return this.http.post(this.ADD_NOTES, data);
  }
  get_customer_Details(userId) {
    const httpHeader = new HttpHeaders({
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTBmNzU4NmZmZmQ0OTcxNjI5M2MxMCIsImlhdCI6MTYzNzgxNTQwNywiZXhwIjoxNjQwNDA3NDA3fQ.iMz7stq1D-Zz53IE5HTV1R3Hf_WoCrFBr8imIJ-CYhE',
    });
    return this.http.post(
      this.GET_CUSTOMER_DETAIL,
      { id: userId },
      { headers: httpHeader }
    );
  }

  get_customer_premium_membeship_details(customer_id): Observable<any> {
    const endPoint = `${this.API}/customer/get_customer_premium_membeship_details/${customer_id}`;
    //console.log(endPoint)

    return this.http.get(endPoint).pipe(catchError(this.handleError));
  }
  fetchCustomerOrders(data): Observable<any> {
    const endPoint = `${this.API}/customer/getCustomerOrders`;
    //console.log(endPoint)
    return this.http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  searchCustomerOrders(data): Observable<any> {
    const endPoint = `${this.API}/customer/searchCustomerOrders`;
    return this.http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  fetchCustomerSubscription(mongoId): Observable<any> {
    const endPoint = `${this.API}/customer/getCustomerSubscription`;
    //console.log(endPoint)
    return this.http.post(endPoint, mongoId).pipe(catchError(this.handleError));
  }
  getOrderDetails(id) {
    const endPoint = `${this.API}/customer/get_customer_order_details/${id}`;
    return this.http.get(endPoint).pipe(catchError(this.handleError));
  }

  addOrderToSubscription(data): Observable<any> {
    const endPoint = `${this.API}/admin/add_order_to_subscription`;

    return this.http.post(endPoint, data).pipe(catchError(this.handleError));
  }

  getRefundableAmount(data): Observable<any> {
    const endPoint = `${this.API}/admin/get_refundable_amount`;
    return this.http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  returnOrder(data): Observable<any> {
    const endPoint = `${this.API}/admin/return_order`;
    return this.http.post(endPoint, data).pipe(catchError(this.handleError));
  }

  cancelOrder(data): Observable<any> {
    const endPoint = `${this.API}/admin/cancel_order`;

    return this.http.post(endPoint, data).pipe(catchError(this.handleError));
  }
}
