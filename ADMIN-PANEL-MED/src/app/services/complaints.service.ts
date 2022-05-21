import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

public API = environment.apiUrl

public GET_COMPLAINTS_BY_TYPE = this.API+'/customer/get_complaints_byType'
public GET_USER_SINGLE_COMPLAINT = this.API+'/customer/get_user_single_complaints/'
public UPDATE_COMPLAINT_STATUS = this.API+'/customer/update_complaint_status/'



  constructor(private http:HttpClient) { }


  get_COMPLAINTS_BY_TYPE(type){
    return this.http.post(this.GET_COMPLAINTS_BY_TYPE , type)
  }
  get_USER_SINGLE_COMPLAINT(id){
    return this.http.get(this.GET_USER_SINGLE_COMPLAINT + id)
  }
  updatet_COMPLAINT_STATUS(id,data){
    return this.http.post(this.UPDATE_COMPLAINT_STATUS + id,data)
  }


}
