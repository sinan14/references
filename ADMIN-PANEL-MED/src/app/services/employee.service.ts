import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment.prod';
import Employee from '../models/employee.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap,catchError } from 'rxjs/operators';
import { User,StoreUser } from '../../app/components/auth/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export default class EmployeeService {
  user = new BehaviorSubject<User>(null);
  storeuser = new BehaviorSubject<StoreUser>(null);

  public API = environment.apiUrl;
  public EMPLOYEE_API = `${this.API}/users/employees`;
  public EMPLOYEE_TYPES_API = `${this.API}/admin/view_employee_types`;
  public EMPLOYEE_SAVE_API = `${this.API}/admin/add-employee`;
  public EMPLOYEE_UPDATE_API = `${this.API}/admin/edit_employ/`
  
  public PERMISSIONS_API = `${this.API}/admin/view-employee-permissions`;
  public PERMISSION_CHECKING_API = `${this.API}/admin/employee_permissions`;


  public employee: Employee = new Employee();
  constructor(private http: HttpClient,private router:Router) {}

  getAll(): Observable<Array<Employee>> {
    return this.http.get<Array<Employee>>(this.EMPLOYEE_API);
  }

  getAllEmployeeTypes(): Observable<Array<Employee>> {
    return this.http.get<Array<Employee>>(this.EMPLOYEE_TYPES_API);
  }

  get(employeeId){
    return this.http.get<Array<Employee>>(`${this.API}/admin/view-employee-details/${employeeId}`);
  }

  login(email,password) {
    let userdata = {
      email: email,
      password: password
    };
    const user = userdata;
    //return this.http.get(`${this.EMPLOYEE_API}/${id}`);
    
    // let result: Observable<Employee>;
    
    //   result = this.http.post<Employee>(`${this.API}/users/login`, userdata);
    // //}
    // return result;
    return this.http
    .post<any>(`${this.API}/admin/login`,userdata)
    .pipe(
      tap(resData => {
        if(resData.isAdmin === true){
          this.handleAuthentication(email,password,'','','',resData.isAdmin,false,resData.token)
        }
        else if(resData.isStore === true){

          //set store login permission
          let permission = [
            {
              "name":"Add Inventory",
              "head":"inventory",
              "subOf":"none",
              "view":false,
              "edit":false,
              "all":false
            },
            // {
            // "name":"Inventory List",
            // "head":"inventory",
            // "subOf":"none",
            // "view":false,
            // "edit":false,
            // "all":false
            // },
            {
              "name":"Stock",
              "head":"inventory",
              "subOf":"All",
              "view":true,
              "edit":true,
              "all":true
            },
            {
              "name":"Stock",
              "head":"inventory",
              "subOf":"Out Of Stock",
              "view":true,
              "edit":true,
              "all":true
            },
            {
              "name":"Stock",
              "head":"inventory",
              "subOf":"Low Stock",
              "view":true,
              "edit":true,
              "all":true
            },
            // {
            //   "name":"Medicine",
            //   "head":"inventory",
            //   "subOf":"Inventory List",
            //   "view":true,
            //   "edit":false,
            //   "all":false
            // },
            {
              "name":"Medicine",
              "head":"inventory",
              "subOf":"Stock",
              "view":true,
              "edit":true,
              "all":true
            },
            // {
            //   "name":"Health Care",
            //   "head":"inventory",
            //   "subOf":"Inventory List",
            //   "view":true,
            //   "edit":false,
            //   "all":false
            // },
            {
              "name":"Health Care",
              "head":"inventory",
              "subOf":"Stock",
              "view":true,
              "edit":true,
              "all":true
            },
            {
              "name":"Orders",
              "head":"orders",
              "subOf":"none",
              "view":true,
              "edit":false,
              "all":false
            },
        ]
          sessionStorage.setItem("Permissions",JSON.stringify(permission));
          this.handleAuthentication(email,password,resData.name,'','',false,resData.isStore,resData.token)
        }
        else{
          let data = resData.data;
         sessionStorage.setItem("Permissions",JSON.stringify(data.permissions));
          this.handleAuthentication(email,password,data.name,data.employee_id,data.employee_photo,resData.isAdmin,false,resData.token)
        }
      })
    );
  }
 
  getPermissions(){
    return this.http.get(`${this.PERMISSION_CHECKING_API}`);
  }
  getPermissionsOfEmployee(employeeId: any){
    return this.http.get(`${this.PERMISSIONS_API}/${employeeId}`);
  }
  
  save(data): Observable<Employee> {
    let result: Observable<Employee>;
      result = this.http.post<Employee>(this.EMPLOYEE_SAVE_API, data);
    return result;
  }

  update(data,employeeId): Observable<Employee> {
    let result: Observable<Employee>;
      result = this.http.put<Employee>(this.EMPLOYEE_UPDATE_API+employeeId, data);
    return result;
  }

  remove(id: number) {
    return this.http.delete(`${this.EMPLOYEE_API}/${id.toString()}`);
  }


  private handleAuthentication( email: string, password: string,name :string,id:string,photo:string, isAdmin :boolean, isStore :boolean,token: string){
    const user = new User(email,password,name,id,photo,isAdmin,isStore,token);
    this.user.next(user);
    //Write Auto logout codes here
    sessionStorage.setItem('userData',JSON.stringify(user));
    localStorage.setItem('userData',JSON.stringify(user));
  }

  //For Store user

  private handleStoreAuthentication( email: string, password: string,name :string,id:string,photo:string, isStore :boolean,token: string){
    const user = new StoreUser(email,password,name,id,photo,isStore,token);
    this.storeuser.next(user);
    //Write Auto logout codes here
    sessionStorage.setItem('userData',JSON.stringify(user));
    localStorage.setItem('userData',JSON.stringify(user));
  }

  
  autoLogin(){
    // console.log("Getting auto login");
    const userData: {
      //id: string;
      username: string;
      password:string;
      name:string;
      id:string;
      photo:string;
      isAdmin:boolean;
      isStore:boolean;
      _token: string;
      // refreshTocken : string;
      // expiresIn? : string;
    } = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
      return null;
    }
    const loadedUser :any = new User(
      userData.username,
      userData.password,
      userData.id,
      userData.photo,
      userData.name,
      userData.isAdmin,
      userData.isStore,
      userData._token,
      );
      if (loadedUser._token) {
        this.user.next(loadedUser);
      // const expirationDuration =
      //   new Date(userData._tokenExpirationDate).getTime() -
      //   new Date().getTime();
      // this.autoLogout(expirationDuration);
    }
  }

    
  autoStoreLogin(){
    // console.log("Getting auto login");
    const userData: {
      //id: string;
      username: string;
      password:string;
      name:string;
      id:string;
      photo:string;
      isStore:boolean;
      _token: string;
      // refreshTocken : string;
      // expiresIn? : string;
    } = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
      return null;
    }
    const loadedUser :any = new StoreUser(
      userData.username,
      userData.password,
      userData.id,
      userData.photo,
      userData.name,
      userData.isStore,
      userData._token,
      );
      if (loadedUser._token) {
        this.user.next(loadedUser);
      // const expirationDuration =
      //   new Date(userData._tokenExpirationDate).getTime() -
      //   new Date().getTime();
      // this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.storeuser.next(null);
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('Permissions');
    this.router.navigate(['/auth/login']);
    sessionStorage.clear();
    localStorage.clear();
    // if (this.tokenExpirationTimer) {
    //   clearTimeout(this.tokenExpirationTimer);
    // }
    // this.tokenExpirationTimer = null;
  }


}
