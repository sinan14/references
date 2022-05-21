import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ReferAndEarnService {
  public _API = environment.baseUrl;
  constructor(private _http: HttpClient) {}
  
}
