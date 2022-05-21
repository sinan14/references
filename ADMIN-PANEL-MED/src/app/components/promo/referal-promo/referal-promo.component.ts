import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromoServiceService } from 'src/app/services/promo-service.service';
import Swal from 'sweetalert2';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-referal-promo',
  templateUrl: './referal-promo.component.html',
  styleUrls: ['./referal-promo.component.scss']
})
export class ReferalPromoComponent implements OnInit {


  public Referal_Form: FormGroup
  public submitted: boolean = false
  public Benefit: any
  public today = new Date().toISOString().split('T')[0];
  public temp_dt: any
  public addLoading: boolean = false
  public Past_Referal_Policies_Array: any = []

  public hasPrevPage: boolean = false
  public hasNextPage: boolean = true
  public total_items: any
  public total_page: any
  public current_page: any



  
  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public addFlag :boolean;

  constructor(
    private fb: FormBuilder,
    private Promo_Service: PromoServiceService,
    private permissionService:PermissionService,
    private location: Location,) { }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }



    this.submitted = false
    this.addLoading = false


    this.Referal_Form = this.fb.group({
      new_user: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      old_user: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      from_dt: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
      benefit: ['immediate', [Validators.required]]
    })
    this.Benefit = 'immediate'
    console.log(this.Benefit);

  }


  disableTab(value){
    if(this.user.isAdmin === true){
      let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
    else   if(this.user.isStore === true){
      let flag = this.permissionService.setPrivilages(value,this.user.isStore);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
    else{
      let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
      this.editFlag = this.permissionService.editFlag;
      this.deleteFlag = this.permissionService.deleteFlag;
      this.viewFlag = this.permissionService.viewFlag;
      return flag;
    }
  }

  //CREATE_REFERAL_POLICY FUNCTIONS

  Create_Referal() {
    console.log("Save click");
    console.log(this.Referal_Form.value);
    console.log(this.Benefit);
    this.Referal_Form.patchValue({
      benefit: this.Benefit
    })
    this.submitted = true
    if (this.Referal_Form.valid) {
      let body = {
        to: this.Referal_Form.get('to_date').value,
        from: this.Referal_Form.get('from_dt').value,
        newUser: this.Referal_Form.get('new_user').value,
        referalUser: this.Referal_Form.get('old_user').value,
        benefit: this.Referal_Form.get('benefit').value,
      }
      this.addLoading = true
      console.log(body);
      this.Promo_Service.Create_REFERAL_POLICY(body).subscribe((res: any) => {
        console.log(res);
        this.pop(res)
      })
    }
  }


  Benefit_Click(val) {
    this.Benefit = val
    this.Referal_Form.patchValue({
      benefit: this.Benefit
    })
    console.log(this.Benefit);
  }


  Date_Change() {
    this.Date_Change_To()
    this.Referal_Form.patchValue({
      to_date: ''
    })
  }


  Date_Change_To() {
    console.log("date check");
    console.log(this.Referal_Form.get('from_dt').value);
    this.temp_dt = this.Referal_Form.get('from_dt').value
    console.log(this.temp_dt);
  }


  //PAST_REFERAL_POLICY FUNCTIONS
  get_PAST_REFERAL_POLICY_LIST(pg, limit) {

    let body = {
      page: pg,
      limit: limit
    }

    this.Promo_Service.get_PAST_REFERAL_POLICY_LIST(body).subscribe((res: any) => {
      console.log(res);
      this.hasPrevPage = res.data.hasPrevPage
      this.hasNextPage = res.data.hasNextPage
      this.total_items = res.data.total_items
      this.total_page = res.data.total_page
      this.current_page = res.data.current_page

      this.Past_Referal_Policies_Array = []
      this.Past_Referal_Policies_Array = res.data.finalResult

    })

  }


  // Get_User_Details(id){
   
  //   // this.router.navigate(['/referal-promo-details/'+id])
  // }





  Tab_Change(event) {
    this.submitted = false
    this.Referal_Form.reset()
    this.Benefit = 'immediate'
    this.addLoading = false
    console.log(event.nextId);

    if (event.nextId == 'past_referal_policies') {

      this.get_PAST_REFERAL_POLICY_LIST(1, 10)


    } else if (event.nextId == 'create_referal_policy') {

    }
    // else if(event.nextId=='referal_user_details'){

    // }
  }




  pop(res: any) {
    if (res.status === true) {
      Swal.fire({
        text: res.data,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
      this.Referal_Form.reset()
      console.log(this.Referal_Form.value);

      this.Benefit = 'immediate'
    } else {
      Swal.fire({
        text: res.data,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      })
    }
    this.addLoading = false;
    this.submitted = false;
  }















}
