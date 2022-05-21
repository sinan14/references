import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment.prod';
import Privilege from '../models/privilege.model';

@Injectable({
  providedIn: 'root'
})
export default class PrivilegeService {
  public API = environment.apiUrl;
  public PRIVILEGES_API = `${this.API}/admin/view_privilege_groups`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<Privilege>> {
    return this.http.get<Array<Privilege>>(this.PRIVILEGES_API);
  }

  get(id: string) {
    return this.http.get(`${this.PRIVILEGES_API}/${id}`);
  }

  save(privilage): Observable<Privilege> {
    //alert(environment.apiUrl);

    let result: Observable<Privilege>;
    /*if (department._id) {
      result = this.http.put<Department>(
        `${this.SUGARLEVELS_API}/${department._id}`,
        department
      );
    } else { */
      //alert(this.PRIVILEGES_API+"/add_department");
      result = this.http.post<Privilege>(this.PRIVILEGES_API, Privilege);
    //}
    return result;
  }

  remove(id: number) {
    return this.http.delete(`${this.PRIVILEGES_API}/${id.toString()}`);
  }
}
