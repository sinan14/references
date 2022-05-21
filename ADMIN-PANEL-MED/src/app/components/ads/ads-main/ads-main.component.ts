import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ads-main',
  templateUrl: './ads-main.component.html',
  styleUrls: ['./ads-main.component.scss']
})
export class AdsMainComponent implements OnInit {


    //NEW VARIABLES

    public permissions :any = [];
    public user :any = [];
    public currentPrivilages :any = [];
    public aciveTagFlag :boolean = true;
    public editFlag :boolean;
    public deleteFlag :boolean;
    public viewFlag :boolean;


  constructor(
    private permissionService:PermissionService,
    private location: Location,) { }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

  }

  disableTab(value){
    let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

}
