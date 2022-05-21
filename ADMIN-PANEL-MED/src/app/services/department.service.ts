import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment.prod';
import Department from '../models/department.model';
import Privilege from 'src/app/models/privilege.model';

@Injectable({
  providedIn: 'root'
})
export default class DepartmentService {
  public API = environment.apiUrl;

  // DEPARTMENT API

  public GET_DEPARTMENTS_API = `${this.API}/admin/view_all_departments`;
  public GET_SINGLE_DEPARTMENTS_API = `${this.API}/admin/view_department/`;
  public ADD_DEPARTMENTS_API = `${this.API}/admin/add_department`;
  public DELETE_DEPARTMENT_API = `${this.API}/admin/delete_department/`;
  public UPDATE_DEPARTMENT_API = `${this.API}/admin/edit_department/`;

  //EMPLOYEE API
  public GET_EMPLOYEE_DEPARTMENTS = `${this.API}/admin/viewEmployeesInDepartment/`;
  public DELETE_EMPLOYEE_API = `${this.API}/admin/delete_employee_by_id/`;
  public SEARCH_EMPLOYEE_API = `${this.API}/admin/employee_search`;
  public GET_EMPLOYEE_PERMISSIONS = `${this.API}/admin/employee_permissions`;
  

  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<Department>> {
    return this.http.get<Array<Department>>(this.GET_DEPARTMENTS_API);
  }

  // getEmployees(id: string) {
  //   return this.http.get(`${this.GET_SINGLE_DEPARTMENTS_API}/${id}`);
  // }

  getPrivileges(id: string) {
    return this.http.get(`${this.GET_DEPARTMENTS_API}/${id}/privileges`);
  }
  getSingleDepartment(id) {
    return this.http.get(`${this.GET_SINGLE_DEPARTMENTS_API}`+id);
  }

  postDepartment(department): Observable<Department> {
    //alert(environment.apiUrl);

    let result: Observable<Department>;
    /*if (department._id) {
      result = this.http.put<Department>(
        `${this.SUGARLEVELS_API}/${department._id}`,
        department
      );
    } else { */
     // alert(this.DEPARTMENTS_API+"/add_department");
      result = this.http.post<Department>(this.ADD_DEPARTMENTS_API, department);
    //}
    return result;
  }

  deleteDepartment(id) {
    return this.http.delete(`${this.DELETE_DEPARTMENT_API}`+id);
  }

  updateDepartment(data,id){
    return this.http.put(`${this.UPDATE_DEPARTMENT_API}`+id,data);
  }

  getEmployeeListByDeptID(id){
    return this.http.get(`${this.GET_EMPLOYEE_DEPARTMENTS}`+id);
  }


  deleteEmployee(id){
    return this.http.delete(`${this.DELETE_EMPLOYEE_API}`+id);

  }

  searchEmployee(data){
    return this.http.post(this.SEARCH_EMPLOYEE_API,data);
  }

  getEmployeePermissions(){
      return this.http.get(this.GET_EMPLOYEE_PERMISSIONS);
  }
  
}
