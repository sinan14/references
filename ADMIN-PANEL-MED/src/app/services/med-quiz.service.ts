import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment.prod';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedQuizService {
  public API = environment.apiUrl;

  //API LIST

  ADD_QUIZ_DETAILS = `${this.API}/medfeed/quizes`;
  GET_PREVIOUS_QUIZ_WINNERS =   `${this.API}/medfeed/getPreviousQuizWinners`;
  DECLARE_QUIZ_WINNER = `${this.API}/medfeed/declare_winner`;
  GET_SINGLE_QUIZ_WINNERS_LIST = `${this.API}/medfeed/getWinnersList/`;

  GET_LIVE_QUIZ_DETAILS = `${this.API}/medfeed/getLiveQuizzes`;

  DISABLE_QUIZ_DETAILS = `${this.API}/medfeed/enable_disable_quiz/`;

  GET_SINGLE_QUIZ_DETAILS = `${this.API}/medfeed/viewQuiz/`;

  UPDATE_QUIZ_DETAILS = `${this.API}/medfeed/edit_quiz/`;

  constructor(private http: HttpClient) { }



  add_quiz_details(data){
    return this.http.post(`${this.ADD_QUIZ_DETAILS}`,data);
  }

  get_previous_quiz_winners_list(){
    return this.http.get(`${this.GET_PREVIOUS_QUIZ_WINNERS}`);
  }

  delcare_quiz_winner(data){
    return this.http.post(`${this.DECLARE_QUIZ_WINNER}`,data);
  }

  get_single_quiz_winners_list(id){
    return this.http.get(`${this.GET_SINGLE_QUIZ_WINNERS_LIST}`+id);
  }


  get_Live_Quiz_Winners_List(){
    return this.http.get(`${this.GET_LIVE_QUIZ_DETAILS}`);
    
  }

  get_single_quiz_details(id){
    return this.http.get(`${this.GET_SINGLE_QUIZ_DETAILS}`+id);
  }

  edit_quiz_details(id,data){
    return this.http.put(`${this.UPDATE_QUIZ_DETAILS}`+id,data);
  }


  disable_quiz_details(id){
    return this.http.get(`${this.DISABLE_QUIZ_DETAILS}`+id);
  }

}
