import { Injectable } from '@angular/core';
import EmployeeService from 'src/app/services/employee.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];

  public addFlag :boolean;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;

  constructor( private employeeService: EmployeeService,
    private router: Router,
    private location: Location,) {
    this.getPermissions();
   }

   
  getPermissions(){
    this.employeeService.getPermissions().subscribe((res:any)=>{
      let data = res.data.permissions;
      if(data.isAdmin === true){
        return true;
      }
      else{
        return false;
      }
     
    })
  }



  canActivate(path){
    this.currentPrivilages = JSON.parse(sessionStorage.getItem('Permissions'));
        console.log(this.currentPrivilages);
      //   this.currentPrivilages.forEach(element => {
      //     if(element.head === path){
      //         this.permissions.push(element);
      //     }
      // })
      // console.log(this.permissions);
  }

//In case of tab list
  setPrivilages(value,isAdmin){
    let data :any = [];
    if(this.currentPrivilages != [] && isAdmin === false){
      data = this.currentPrivilages.find((x:any)=>x.subOf === value );
      if(data != undefined){
        if(data.name != ''){
          if(data.all === true){  
            this.addFlag = true;
            this.editFlag = true;
            this.deleteFlag = true;
            this.viewFlag = true;
            return true
          }
          else  if(data.edit === true){
            this.addFlag = false;
            this.editFlag = true;
            this.deleteFlag = false;
            this.viewFlag = false;
            return true
          }
          else if(data.view  === true){
            this.addFlag = false;
            this.editFlag = false;
            this.deleteFlag = false;
            this.viewFlag = true;
            return true
          }
          else{
            this.addFlag = data.edit;
            this.editFlag = data.edit;
            this.deleteFlag = data.edit;
            this.viewFlag = data.view;
            return true;
          }
        }
      }
      else{
        data = this.currentPrivilages.find((x:any)=>x.name === value );
        if(data != undefined){
          if(data.all === true){
            this.addFlag = true;
            this.editFlag = true;
            this.deleteFlag = true;
            this.viewFlag = true;
            return true
          }
          else  if(data.edit === true){
            this.addFlag = false;
            this.editFlag = true;
            this.deleteFlag = false;
            this.viewFlag = false;
            return true
          }
          else if(data.view  === true){
            this.addFlag = false;
            this.editFlag = false;
            this.deleteFlag = false;
            this.viewFlag = true;
            return true
          }
          else{
            this.addFlag = data.edit;
            this.editFlag = data.edit;
            this.deleteFlag = data.edit;
            this.viewFlag = data.view;
            return true;
          }
         }
         else{
           return false;
         }
      }
    }
    else{
      if(isAdmin === true){
        this.addFlag = true;
        this.editFlag = true;
        this.deleteFlag = true;
        this.viewFlag = true;
        
        return true;
      }
     
    }
  }


  //In case of box listing

  setBoxPrivilege(value,isAdmin){
    let data :any = [];
    if(this.currentPrivilages != [] && isAdmin === false){
      data = this.currentPrivilages.find((x:any)=>x.subOf === value );
      if(data != undefined){
        if(data.name != ''){
          if(data.all === true){
            this.addFlag = true;
            this.editFlag = true;
            this.deleteFlag = true;
            this.viewFlag = true;
            return true
          }
          else  if(data.edit === true){
            this.addFlag = false;
            this.editFlag = true;
            this.deleteFlag = false;
            this.viewFlag = false;
            return true
          }
          else if(data.view  === true){
            this.addFlag = false;
            this.editFlag = false;
            this.deleteFlag = false;
            this.viewFlag = true;
            return true
          }
          else{
            this.addFlag = data.edit;
            this.editFlag = data.edit;
            this.deleteFlag = data.edit;
            this.viewFlag = data.view;
            return false;
          }
        }
      }
      else{
        data = this.currentPrivilages.find((x:any)=>x.name === value );
        if(data != undefined){
          if(data.all === true){
            this.addFlag = true;
            this.editFlag = true;
            this.deleteFlag = true;
            this.viewFlag = true;
            return true
          }
          else  if(data.edit === true){
            this.addFlag = false;
            this.editFlag = true;
            this.deleteFlag = false;
            this.viewFlag = false;
            return true
          }
          else if(data.view  === true){
            this.addFlag = false;
            this.editFlag = false;
            this.deleteFlag = false;
            this.viewFlag = true;
            return true
          }
          else{
            this.addFlag = data.edit;
            this.editFlag = data.edit;
            this.deleteFlag = data.edit;
            this.viewFlag = data.view;
            return false;
          }
         }
         else{
           return false;
         }
      }
    }
    else{
      if(isAdmin === true){
        this.addFlag = true;
        this.editFlag = true;
        this.deleteFlag = true;
        this.viewFlag = true;
        
        return true;
      }
    }
  }


   //In case of tab Category listing

   setBoxCategoryPrivilege(value,isAdmin){
    let data :any = [];
    if(this.currentPrivilages != [] && isAdmin === false){
      data = this.currentPrivilages.find((x:any)=>x.name === value );
      if(data != undefined){
        if(data.name != ''){
          if(data.all === true){
            this.addFlag = true;
            this.editFlag = true;
            this.deleteFlag = true;
            this.viewFlag = true;
            return true
          }
          else  if(data.edit === true){
            this.addFlag = false;
            this.editFlag = true;
            this.deleteFlag = false;
            this.viewFlag = false;
            return true
          }
          else if(data.view  === true){
            this.addFlag = false;
            this.editFlag = false;
            this.deleteFlag = false;
            this.viewFlag = true;
            return true
          }
          else{
            this.addFlag = data.edit;
            this.editFlag = data.edit;
            this.deleteFlag = data.edit;
            this.viewFlag = data.view;
            return false;
          }
        }
        else{
          return true;
        }
      }
      else{
        data = this.currentPrivilages.find((x:any)=>x.name === value );
        if(data != undefined){
          if(data.all === true){
            this.addFlag = true;
            this.editFlag = true;
            this.deleteFlag = true;
            this.viewFlag = true;
            return true
          }
          else  if(data.edit === true){
            this.addFlag = false;
            this.editFlag = true;
            this.deleteFlag = false;
            this.viewFlag = false;
            return true
          }
          else if(data.view  === true){
            this.addFlag = false;
            this.editFlag = false;
            this.deleteFlag = false;
            this.viewFlag = true;
            return true
          }
          else{
            this.addFlag = data.edit;
            this.editFlag = data.edit;
            this.deleteFlag = data.edit;
            this.viewFlag = data.view;
            return false;
          }
         }
         
         else{
           return false;
         }
      }
    }
    else{
     if(isAdmin === true){
        this.addFlag = true;
        this.editFlag = true;
        this.deleteFlag = true;
        this.viewFlag = true;
        
        return true;
      }
    }
  }

  //in the case of store

  setBoxPrivilegesStore(value,isAdmin){
    let data :any = [];
    if(this.currentPrivilages != []){
      data = this.currentPrivilages.find((x:any)=>x.subOf === value );
      if(data != undefined){
        if(data.name != ''){
          if(data.all === true){
            this.addFlag = true;
            this.editFlag = true;
            this.deleteFlag = true;
            this.viewFlag = true;
            return true
          }
          else  if(data.edit === true){
            this.addFlag = false;
            this.editFlag = true;
            this.deleteFlag = false;
            this.viewFlag = false;
            return true
          }
          else if(data.view  === true){
            this.addFlag = false;
            this.editFlag = false;
            this.deleteFlag = false;
            this.viewFlag = true;
            return true
          }
          else{
            this.addFlag = data.edit;
            this.editFlag = data.edit;
            this.deleteFlag = data.edit;
            this.viewFlag = data.view;
            return false;
          }
        }
      }
      else{
        data = this.currentPrivilages.find((x:any)=>x.name === value );
        if(data != undefined){
          if(data.all === true){
            this.addFlag = true;
            this.editFlag = true;
            this.deleteFlag = true;
            this.viewFlag = true;
            return true
          }
          else  if(data.edit === true){
            this.addFlag = false;
            this.editFlag = true;
            this.deleteFlag = false;
            this.viewFlag = false;
            return true
          }
          else if(data.view  === true){
            this.addFlag = false;
            this.editFlag = false;
            this.deleteFlag = false;
            this.viewFlag = true;
            return true
          }
          else{
            this.addFlag = data.edit;
            this.editFlag = data.edit;
            this.deleteFlag = data.edit;
            this.viewFlag = data.view;
            return false;
          }
         }
         else{
           return false;
         }
      }
    }
    else{
      if(isAdmin === true){
        this.addFlag = true;
        this.editFlag = true;
        this.deleteFlag = true;
        this.viewFlag = true;
        
        return true;
      }
    }
  }


}
