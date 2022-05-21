import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PromoServiceService {

  public API = environment.apiUrl

  //create promo component
  public ADD_PROMO_CODE = this.API + '/admin/add_promo_code'
  public GET_PROMO_CODE_BY_ID = this.API + '/admin/get_promo_code_byId/'
  public EDIT_PROMO_CODE = this.API + '/admin/edit_promo_code/'


  //promo-listcomponent
  public GET_PROMO_CODE_BY_TYPE = this.API + '/admin/get_promo_code/'
  public GET_ACTIVATED_DEACTIVATED_PROMO_CODE_BY_TYPE = this.API + '/admin/get_active_or_deactivate/'
  public GET_EXPIRED_PROMO_CODE = this.API + '/admin/get_expired_promo_code'
  public ACTIVATE_DEACTIVATE_PROMO_CODE = this.API + '/admin/deactivate_promo_code/'
  public DELETE_PROMO_CODE = this.API + '/admin/delete_promo_code/'


  //referal promo component
  public ADD_REFERAL_POLICY = this.API + '/admin/add_referal_policy'
  public GET_PAST_REFERAL_POLICY_LIST = this.API + '/admin/list_referal_policy'
  public GET_USER_DETAILS_BY_ID = this.API + '/admin/list_referal_policy_statement'
  public SEARCH_USER_BY_NAME = this.API + '/admin/search_referal_statement'

  

  constructor(private http: HttpClient) { }

  //create promo component
  add_PROMO_CODE(data) {
    return this.http.post(this.ADD_PROMO_CODE, data)
  }

  get_PROMO_CODE_BY_ID(id) {
    return this.http.get(this.GET_PROMO_CODE_BY_ID + id)
  }

  edit_PROMO_CODE(id, data) {
    return this.http.put(this.EDIT_PROMO_CODE + id, data)
  }



  //promo-listcomponent
  get_PROMO_CODE_BY_TYPE(type) {//(all)
    return this.http.get(this.GET_PROMO_CODE_BY_TYPE + type)
  }

  get_ACTIVE_DEACTIVE_PROMO(type) {//(activated/deavtivated)
    return this.http.get(this.GET_ACTIVATED_DEACTIVATED_PROMO_CODE_BY_TYPE + type)
  }

  get_EXPIRED_PROMO() {//(expired)
    return this.http.get(this.GET_EXPIRED_PROMO_CODE)
  }

  activate_deactivate_PROMO_CODE(id, status) {
    return this.http.post(this.ACTIVATE_DEACTIVATE_PROMO_CODE + id, status)
  }

  delete_PROMO_CODE(id) {
    return this.http.delete(this.DELETE_PROMO_CODE + id)
  }



  //referal promo component
  Create_REFERAL_POLICY(data) {
    return this.http.post(this.ADD_REFERAL_POLICY, data)
  }

  get_PAST_REFERAL_POLICY_LIST(data) {
    return this.http.post(this.GET_PAST_REFERAL_POLICY_LIST, data)
  }

  get_USER_DETAILS_BY_ID(data){
    return this.http.post(this.GET_USER_DETAILS_BY_ID, data)
  }

  search_USER_BY_NAME(data){
    return this.http.post(this.SEARCH_USER_BY_NAME, data)
  }

  fetchPromocodes(data): Observable<any> {
    const endPoint = `${this.API}/admin/get-promoCode-statement`;
    //console.log(endPoint)
    return this.http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  searchPromocodes(data): Observable<any> {
    const endPoint = `${this.API}/admin/search-promoCode-statement`;
    return this.http.post(endPoint, data).pipe(catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
