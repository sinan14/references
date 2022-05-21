import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/permission.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-master-page-tab',
  templateUrl: './master-page-tab.component.html',
  styleUrls: ['./master-page-tab.component.scss']
})
export class MasterPageTabComponent implements OnInit {


  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  constructor(
    private _route: Router,
    private permissionService: PermissionService,
    private location: Location,) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

  }

  disableBox(value) {
    let flag = this.permissionService.setBoxCategoryPrivilege(value, this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

}
