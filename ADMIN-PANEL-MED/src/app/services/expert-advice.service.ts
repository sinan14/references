import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ExpertAdviceService {

  public api=environment.apiUrl;

  public MF_LIST_QUESTION=`${this.api}/admin/listquestions/`;

  public GET_ALL_CATEGORIES=`${this.api}/admin/getAllHealthExpertCategories`;

  public VIEW_HEALTH_EXPERT_CATEGORY=`${this.api}/admin/viewHealthExpertCategory/`;

  public GET_CATEGORY_QUESTIONS_BY_ID=`${this.api}/admin/listCategoryQuestions/`;

  public POST_REPLY_BY_ID =`${this.api}/admin/postreply/`;

  public UPDATE_REPLY_BY_ID  =`${this.api}/admin/updatepostreply/`;

  public DELETE_QUESTION_BY_ID=`${this.api}/admin/deletequestion/`;

  public GET_QUESTION_BY_ID =`${this.api}/admin/getquestions/`;

  constructor(private http:HttpClient) { }

  get_List_Questions(type){
    return this.http.get(`${this.MF_LIST_QUESTION}`+type);
  }

  get_All_Categories(){
    return this.http.get(this.GET_ALL_CATEGORIES);
  }

  get_Pending_Questions(type){
    return this.http.get(`${this.MF_LIST_QUESTION}`+type);
  }

  get_Health_Expert_Category(id){
    return this.http.get(`${this.VIEW_HEALTH_EXPERT_CATEGORY}`+id);
  }

  get_Category_Questions_By_Id(id){
    return this.http.get(`${this.api}/admin/listCategoryQuestions/`+id);
  }

  Post_Reply(id,data){
    return this.http.post(`${this.api}/admin/postreply/`+id,data);
  }

  Update_Reply(id,data){
    return this.http.put(`${this.UPDATE_REPLY_BY_ID}`+id,data)
  }

  Delete_Question(id){
    return this.http.delete(`${this.DELETE_QUESTION_BY_ID}`+id);
  }

  Get_Questions_By_Id(id){
    return this.http.get(`${this.GET_QUESTION_BY_ID}`+id);
  }
}
