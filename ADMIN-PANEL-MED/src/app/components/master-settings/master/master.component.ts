import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/permission.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

  //NEW VARIABLES

  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;


  constructor(private permissionService:PermissionService,
    private router: Router,private location: Location,) { }

  ngOnInit(): void {
    console.log( this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

  }

  disableBox(value){
    let flag = this.permissionService.setBoxPrivilege(value,this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
 }

}
