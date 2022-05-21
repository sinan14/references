import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PermissionService } from 'src/app/permission.service';
import { FoliofitServiceService } from 'src/app/services/foliofi-testi,bmi,health.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bmi-tab',
  templateUrl: './bmi-tab.component.html',
  styleUrls: ['./bmi-tab.component.scss']
})
export class BmiTabComponent implements OnInit {

  public min: Date = new Date();
  public value: Date = new Date();


  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  selectedTab = '';

  public bmidata: any = []
  public bmiarray: any = []
  public bmi_dt_array: any = []


  public bmiForm: FormGroup;
  public temp: any; 

  public strt_dt = new Date().toISOString().split('T')[0];
  public end_dt = new Date().toISOString().split('T')[0];


  constructor(
    private _route: Router,
    private permissionService: PermissionService,
    private location: Location,
    private FFS: FoliofitServiceService,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    // if (this.user != '') {
    //   this.permissionService.canActivate(this.location.path().split('/').pop())
    // }

    let tabselected = localStorage.getItem("TabID");
    if (tabselected != '') {
      if (tabselected == 'tab-selectbyid3') {
        this.selectedTab = 'tab-selectbyid3';
      }
      else if (tabselected == 'tab-selectbyid5') {
        this.selectedTab = 'tab-selectbyid5';
      }
    }
    else {
      localStorage.clear();
      this.selectedTab = '';
    }

    this.bmiForm = this.fb.group({
      "endDate": ['', Validators.required],
      "startDate": ['', Validators.required]
    })

    this.GetBMI()
  }

  GetBMI() {
    this.FFS.GetBMI().subscribe((res: any) => {
      console.log(res);

      this.bmidata = res.data
      // this.bmiarray.forEach((itm, i) => {
      //   let data = {
      //     "slno": i + 1,
      //     "name": itm.userId.name,
      //     "phone": itm.userId.phone,
      //     "bmi": itm.bmi
      //   }
      //   this.bmidata.push(data)
      //   console.log(this.bmidata);

      // });
    })
  }

  getStartdate(event: any) {
    this.temp = event.target.value;
    this.bmiForm.patchValue({
      endDate: ''
    })
    // let today = new Date(event.target.value).toJSON('en-US');
    // this.startDate = today;
  }

  date_change() {

    var e = this.bmiForm.get('endDate').value
    var s = this.bmiForm.get('startDate').value

    var end = e + 'T11:59:59Z'
    var start = new Date(s);
    var a = start.toISOString();
    
    console.log(a, "start");
    console.log(end, "end");
    
    let dt = {
      "startDate": a,
      "endDate": end,
    }
    console.log(dt);
    this.FFS.PostBMI_dt(dt).subscribe((res: any) => {
      console.log(res);
      this.bmidata = res.data
      // console.log(this.bmi_dt_array);
      // this.bmiarray = []
      // this.bmi_dt_array.forEach((itm, i) => {
      //   let data = {
      //     "slno": i + 1,
      //     "name": itm.userId.name,
      //     "phone": itm.userId.phone,
      //     "bmi": itm.bmi
      //   }

      //   this.bmiarray.push(data)
      //   // this.bmidata = []
      //   this.bmidata = this.bmiarray
      //   // this.bmidata.push(data)
      //   console.log(this.bmidata);

      // });
    }), (err) => {
      console.log(err);

    }
  }

  clear() {
    this.bmiForm.reset()
    this.temp = ''
    this.GetBMI()
  }

  disableBox(value) {
    let flag = this.permissionService.setBoxCategoryPrivilege(value, this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  disableTab(value) {
    let flag = this.permissionService.setPrivilages(value, this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  tabChangeEvent(event) {
    console.log(event.nextId);
    //localStorage.setItem("TabID",event.nextId);
  }

}
