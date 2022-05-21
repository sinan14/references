import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MSPreferenceService {

    public _API = environment.apiUrl;
    // public _API = 'localhost:8000'
  
    constructor(private _http: HttpClient) {}
    preferences: any = [];
  
  
    fetchpreferences() {
      return this._http.get(`${this._API}/admin/get_master_preference`);
    }
    updatepreference(updatedpreference) {
      return this._http.put(`${this._API}/admin/edit_master_preference`, updatedpreference);
    }
  
  

  

    createpreference(newpreference) {
      return this._http.put(`${this._API}/admin/add_master_preference`, newpreference);
    }

    deletepreferenceById(preferenceId) {
      return this._http.delete(`${this._API}/admin/delete_master_preference/${preferenceId}`);
    }

  }

  
  