import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavService } from '../../service/nav.service';
import EmployeeService from "../../../services/employee.service";
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment.prod';
import * as $ from 'jquery';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public openNewNav: boolean = false;
  public isOpenMobile : boolean;
  public loggedEmployeeType:any;
  public loggedEmployeeID:any;
  public loggedEmployeeImage:any;
  public loggedEmployeeName:any;
  public API = environment.apiUrl;

  
    //NEW VARIABLES

    public permissions :any = [];
    public user :any = [];
    public currentPrivilages :any = [];
    public aciveTagFlag :boolean = true;
    public editFlag :boolean;
    public deleteFlag :boolean;
    public viewFlag :boolean;

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(public navServices: NavService,private _service:EmployeeService,
    private permissionService:PermissionService,
    private location: Location,) { 
    }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }
  openMobileNewNav(){
    this.openNewNav = !this.openNewNav;
  }
  logout(){
    this._service.logout();
  }


  ngOnInit() { 
    this.user = JSON.parse(sessionStorage.getItem('userData'));
    if(this.user.isAdmin === true){
      this.loggedEmployeeType = "Admin";
      this.loggedEmployeeID = "5432876";
      this.loggedEmployeeName = 'SuperAdmin';
      this.loggedEmployeeImage = "assets/images/dashboard/profile_img.png";

    }
    else  if(this.user.isStore === true){
      this.loggedEmployeeType = "Store";
      this.loggedEmployeeID = "678324";
      this.loggedEmployeeName = this.user.name;
      this.loggedEmployeeImage = "assets/images/dashboard/profile_img.png";

    }
    else{
      
      this.loggedEmployeeID = this.user.id;
      this.loggedEmployeeName = this.user.name;
      this.loggedEmployeeType = "Employee";
      if(this.user.photo === null){
        this.loggedEmployeeImage ='assets/images/avatars_img.png';
      }
      else{
      this.loggedEmployeeImage =`${this.API}/`+this.user.photo;
      }
    }
    if(this.user != ''){
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

    $(window).scroll(function() {    
      var scroll = $(window).scrollTop();    
      if (scroll >= 100) {
          $(".page-main-header").removeClass("addes").addClass("stik");

      }
      else{
        $(".page-main-header").removeClass("stik").addClass("addes");
      }
  });
//   $(window).scroll(function() {    
//     var scroll = $(window).scrollTop();

//      //>=, not <=
//     if (scroll >= 150) {
//         //clearHeader, not clearheader - caps H
//         $(".page-main-header").addClass("stik");
//     }
// }); 

}

  disableTab(value){
    let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  setPermission(value){
    let flag :boolean;
    if(this.user != ''){
      this.currentPrivilages = JSON.parse(sessionStorage.getItem('Permissions'))

      if(this.user.isAdmin === true){
        return true;
      }
      else{
        if(this.currentPrivilages != ''){
         let data = this.currentPrivilages.find((x:any)=>x.head === value);
          if(data){
            flag = true;
            return flag;
          }
          else{
            flag = false;
            return flag;
          }
        }
      
      }

    }
    
  }


}
