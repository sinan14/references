import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BASEURL = 'http://143.110.240.107:8000/user/';
  constructor() { }
}
