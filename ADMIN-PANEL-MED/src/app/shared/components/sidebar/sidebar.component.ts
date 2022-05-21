import { Component, Input, ViewEncapsulation ,OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavService, Menu } from '../../service/nav.service';
import EmployeeService from 'src/app/services/employee.service';
import DepartmentService from 'src/app/services/department.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  public menuItems: Menu[];
  public url: any;
  public fileurl: any;
  public currentPrivilages :any = [];

  constructor(private router: Router, 
    public navServices: NavService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,) {

    this.navServices.items.subscribe(menuItems => {
      this.menuItems = menuItems
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          menuItems.filter(items => {
            if (items.path === event.url)
              this.setNavActive(items)
            if (!items.children) return false
            items.children.filter(subItems => {
              if (subItems.path === event.url)
                this.setNavActive(subItems)
              if (!subItems.children) return false
              subItems.children.filter(subSubItems => {
                if (subSubItems.path === event.url)
                  this.setNavActive(subSubItems)
              })
            })
          })
        }
      })
    })
  }
  public hasPermission:boolean;
  public isAdmin :boolean ;
  public isUser :boolean ;
  public user :any = [];
  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('userData'));
    if(this.user != ''){
      //this.getPermissions();
     // this.getEmployeePermissions();
    }
  }

  
 
  // getPermissions(){
  //   this.employeeService.getPermissions().subscribe((res:any)=>{
  //     let data = res.data.permissions;
  //     sessionStorage.setItem("Permissions",JSON.stringify(data));
     
  //   })
  // }

  getEmployeePermissions(){
    this.departmentService.getEmployeePermissions().subscribe((res:any)=>{
      
      let data = res.data.permissions;
      this.currentPrivilages = data;
      sessionStorage.setItem("Permissions",JSON.stringify(data));
    });
  }


  setPermission(value){
    let flag :boolean;
    if(this.user != ''){

      if(this.user.isAdmin === true){
        return true;
      }

      else if(this.user.isStore === true){
        this.currentPrivilages =  JSON.parse(sessionStorage.getItem("Permissions"));
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
      else{
        this.currentPrivilages =  JSON.parse(sessionStorage.getItem("Permissions"));
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

    else{
      alert("Invalid");
    }
   
  }
  // switch(value){
  //   case 'dashboard' : {
     
  //   }
  //   case 'master-settings' :  {
  //     if(element.head === value){
  //       flag = true;
  //       return flag;
  //     }
  //     else{
  //       flag = false;
  //       return flag;
  //     }
  //   }
  //   case 'delivery-boys' :  {
  //     if(element.head === value){
  //       flag = true;
  //       return flag;
  //     }
  //     else{
  //       flag = false;
  //       return flag;
  //     }
  //   }
  //   case 'suggested-product' :  {
  //     if(element.head === value){
  //       flag = true;
  //       return flag;
  //     }
  //     else{
  //       flag = false;
  //       return flag;
  //     }
  //   }
  //   case 'Customer Relation' : flag = true;return flag;
  //   case 'promo' : flag = true;return flag;
  //   case 'orders' : flag = true;return flag;
  //   case 'inventory' : flag = true;return flag;
  //   case 'ads' : flag = true;return flag;
  //   case 'FolioFit' : flag = true;return flag;
  //   case 'Medfeed' : flag = true;return flag;
  //   case 'premium' : flag = true;return flag;
  //   case 'subscriptions' : flag = true;return flag;
  //   case 'medcoin' : flag = true;return flag;
  //   case 'user-management' : flag = true;return flag;
  //   case 'medimall-report' : flag = true;return flag;
  //   case '#' : flag = true;return flag;
  //   case 'complaints' : flag = true;return flag;
  //   case 'POS' : flag = true;return flag;
  //   default : flag = true;
  // }


  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem != item)
        menuItem.active = false
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true
            submenuItems.active = true
          }
        })
      }
    })
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item))
          a.active = false
        if (!a.children) return false
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false
          }
        })
      });
    }
    item.active = !item.active
  }

  //Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

}
