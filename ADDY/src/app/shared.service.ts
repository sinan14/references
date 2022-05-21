import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public orderId: any;
  public formData: any;
  constructor() { }
  get(key: any) {
    return localStorage.getItem(key);
  }

  clearStorage() {
    localStorage.clear();
  }

  removeItemStorage(key: string) {
    localStorage.removeItem(key);
  }

  set(key: string, value:any) {
    localStorage.setItem(key, value);
  }
  setData(key:any, value:any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
