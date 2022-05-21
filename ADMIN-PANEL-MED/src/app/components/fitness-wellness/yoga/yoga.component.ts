import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { NgbModal, ModalDismissReasons ,NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js';
import * as chartData from '../../../shared/data/chart';
import { total_views} from '../../../shared/data/chart';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FoliofitMasterYogaService } from 'src/app/services/foliofit-master-yoga.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-yoga',
  templateUrl: './yoga.component.html',
  styleUrls: ['./yoga.component.scss']
})
export class YogaComponent implements OnInit {
  
 
  
  public value: any = [];


  backFlag :boolean = false;
  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;
  public closeResult: string;
  selectedTab = '';

    //NEW VARIABLES

    public permissions :any = [];
    public user :any = [];
    public currentPrivilages :any = [];
    public aciveTagFlag :boolean = true;
    public editFlag :boolean;
    public deleteFlag :boolean;
    public viewFlag :boolean;


    public mainCategoryList :any = [];
    public healthyList :any = [];
    public weeklyWorkoutList :any = [];
    public recommendList :any = [];
    public foliofitHomeList :any = [];
    public yogaVideoList :any = [];
    public AllyogaVideoList :any = [];
    
    public addLoading :boolean = false;
    public attemptedSubmit :boolean = false;
    public image_URL :any = '';
    public bannerImage_URL :any = '';
    public uploadBannerImage :any = '';
    public uploadImage :any = '';
    public ID :any ;
    public videoList :any = [];
    public listCategory :any = [];
    public AllListCategory :any = [];
    
      
    public mainCategoryForm :FormGroup;
    public foliofitHomeForm :FormGroup;

  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _route : Router,
    private permissionService:PermissionService,
    private location: Location,
    private _foliofitMasterYoga:FoliofitMasterYogaService,
    private _formBuilder :FormBuilder) { 

      this.mainCategoryForm = this._formBuilder.group({
        title: ['',Validators.required],
        subtitle : ['',Validators.required],
        benefits : ['',Validators.required],
        videos : ['',Validators.required],
      });

      this.foliofitHomeForm = this._formBuilder.group({
        categoryid: ['',Validators.required],
      });

    }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.getyogaCategories();
    this.getYogaVideos();

    
    this.getMainCategoryList();
    this.getStartHealthyList();
    this.getWeeklyWorkoutList();
    this.getRecommendList();
    this.getfoliofitHomeList();
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


  getYogaVideos(){
    this._foliofitMasterYoga.get_all_yoga_videos().subscribe((res:any)=>{
      this.yogaVideoList = res.data;
      this.AllyogaVideoList = res.data;
    })
  }


  getyogaCategories(){
    this._foliofitMasterYoga.get_all_yoga_categories().subscribe((res:any)=>{
      this.listCategory = res.data;
      this.AllListCategory = res.data;
    })
  }

  getMainCategoryList(){
    this._foliofitMasterYoga.get_main_category_list().subscribe((res:any)=>{
        this.mainCategoryList = res.data;
    })
  }

  getStartHealthyList(){
    this._foliofitMasterYoga.get_start_healthy_list().subscribe((res:any)=>{
        this.healthyList = res.data;
    })
  }
  getWeeklyWorkoutList(){
    this._foliofitMasterYoga.get_weekly_workouts_list().subscribe((res:any)=>{
        this.weeklyWorkoutList = res.data;
    })
  }

  getRecommendList(){
    this._foliofitMasterYoga.get_recommend_list().subscribe((res:any)=>{
        this.recommendList = res.data;
    })
  }

  getfoliofitHomeList(){
    this._foliofitMasterYoga.get_foliofit_home_list().subscribe((res:any)=>{
        this.foliofitHomeList = res.data;
    })
  }
  tabChangeEvent(event){
    console.log(event.nextId);
    //localStorage.setItem("TabID",event.nextId);
  }
  BackRedirectTo(){
    this._route.navigate(['/fitness-wellness'])
  }

  open(content,Value:any,id:any,type:any) {
    console.log(Value)
    if(Value === 'add'){
      this.attemptedSubmit = false;
      this.image_URL = '';
      this.bannerImage_URL = '';
      this.mainCategoryForm.reset();
      this.foliofitHomeForm.reset();
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if(Value === 'edit'){


      if(type === 'main_category'){
        this._foliofitMasterYoga.get_single_main_category_list(id).subscribe((res:any)=>{
          console.log(res.data);
          this.ID = res.data._id;
          this.image_URL = res.data.icon;
          this.bannerImage_URL = res.data.banner;
          console.log(res.data.benefits.toString());
          this.mainCategoryForm.patchValue({
            title:res.data.title,
            subtitle:res.data.subTitle,
            benefits:res.data.benefits.toString(),
            videos:res.data.videos,
          })
        })
      }

      else if(type === 'start_healthy'){
        this._foliofitMasterYoga.get_single_start_healthy_list(id).subscribe((res:any)=>{
          console.log(res.data);
          this.ID = res.data._id;
          this.image_URL = res.data.icon;
          this.bannerImage_URL = res.data.banner;
          console.log(res.data.benefits.toString());
          this.mainCategoryForm.patchValue({
            title:res.data.title,
            subtitle:res.data.subTitle,
            benefits:res.data.benefits.toString(),
            videos:res.data.videos,
          })
        })
      }

      else if(type === 'weekly_workouts'){
        this._foliofitMasterYoga.get_single_weekly_workouts_list(id).subscribe((res:any)=>{
          console.log(res.data);
          this.ID = res.data._id;
          this.bannerImage_URL = res.data.image;
          console.log(res.data.benefits.toString());
          this.mainCategoryForm.patchValue({
            title:res.data.title,
            subtitle:res.data.subTitle,
            benefits:res.data.benefits.toString(),
            videos:res.data.videos,
          })
        })
      }

      else if(type === 'recommend'){
        this._foliofitMasterYoga.get_single_recommend_list(id).subscribe((res:any)=>{
          console.log(res.data);
          this.ID = res.data._id;
          this.image_URL = res.data.icon;
          this.bannerImage_URL = res.data.banner;
          console.log(res.data.benefits.toString());
          this.mainCategoryForm.patchValue({
            title:res.data.title,
            subtitle:res.data.subTitle,
            benefits:res.data.benefits.toString(),
            videos:res.data.videos,
          })
        })
      }

      else if(type === 'foliofit_home'){
        this._foliofitMasterYoga.get_foliofit_home_list().subscribe((res:any)=>{
          console.log(res.data);
          this.ID = res.data[0]._id;
          this.foliofitHomeForm.patchValue({
            categoryid:res.data[0].categoryId,
          })
        })
      }



      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }


    else if(Value === ''){
      this.update_Modal_Flag = false;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  save(type:any) {
    if(type === 'start_healthy'){

      if(this.mainCategoryForm.invalid){
        return;
      }

      if(this.image_URL ==='' || this.bannerImage_URL === ''){
        return;
      }
      const formData = new FormData();

        let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')
        this.addLoading = true;
        
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);

        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });

        formData.append('icon',this.uploadImage);
        formData.append('banner',this.uploadBannerImage);

        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });

        this._foliofitMasterYoga.add_start_healthy_list(formData).subscribe((res:any)=>{
          console.log(res);
          if(res.status){
            Swal.fire({
              text:  'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.getStartHealthyList();
            this.resetValues();
            this.modalService.dismissAll();
            this.mainCategoryForm.reset();
          }
          else{
            this.addLoading = false;
            this.resetValues();
            Swal.fire({
              text: res.data,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
          }

        })

    }
      else if(type === 'weekly_workouts'){

      if(this.mainCategoryForm.invalid){
        return;
      }
      if(this.bannerImage_URL === ''){
        return;
      }
      const formData = new FormData();

        let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')
        this.addLoading = true;
        
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);

        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });

        formData.append('image',this.uploadBannerImage);

        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });

        this._foliofitMasterYoga.add_weekly_workouts_list(formData).subscribe((res:any)=>{
          console.log(res);
          if(res.status){
            Swal.fire({
              text:  'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.getWeeklyWorkoutList();
            this.resetValues();
            this.modalService.dismissAll();
            this.mainCategoryForm.reset();
          }
          else{
            this.addLoading = false;
            this.resetValues();
            Swal.fire({
              text: res.data,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
          }

        })

    }

    else  if(type === 'recommend'){

      if(this.mainCategoryForm.invalid){
        return;
      }
      if(this.image_URL ==='' || this.bannerImage_URL === ''){
        return;
      }
      const formData = new FormData();

        let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')
        this.addLoading = true;
        
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);

        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });

        formData.append('icon',this.uploadImage);
        formData.append('banner',this.uploadBannerImage);

        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });

        this._foliofitMasterYoga.add_recommend_list(formData).subscribe((res:any)=>{
          console.log(res);
          if(res.status){
            Swal.fire({
              text:  'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.getRecommendList();
            this.resetValues();
            this.modalService.dismissAll();
            this.mainCategoryForm.reset();
          }
          else{
            this.addLoading = false;
            this.resetValues();
            Swal.fire({
              text: res.data,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
          }

        })

    }
  }


  update(type:any){
    if(type === 'main_category'){
      if(this.mainCategoryForm.invalid){
        return;
      }
      let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')

      this.addLoading = true;
      const formData = new FormData();
      if(this.uploadImage != '' && this.uploadBannerImage !=''){
        formData.append('yogaId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('icon',this.uploadImage);
        formData.append('banner',this.uploadBannerImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else  if(this.uploadImage != ''){
        formData.append('yogaId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('icon',this.uploadImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else  if(this.uploadBannerImage !=''){
        formData.append('yogaId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('banner',this.uploadBannerImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else{
          formData.append('yogaId',this.ID);
          formData.append('title',this.mainCategoryForm.get('title').value);
          formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
          benefits_array.forEach((element,index) => {
            formData.append('benefits['+index+']',element);
          });

          this.mainCategoryForm.get('videos').value.forEach((element,index) => {
            formData.append('videos['+index+']',element);
          });
      }

      this._foliofitMasterYoga.update_main_category_list(formData).subscribe((res:any)=>{
        console.log(res);
        if(res.status){
          Swal.fire({
            text:  'Updated Successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.getMainCategoryList();
          this.resetValues();
          this.modalService.dismissAll();
          this.mainCategoryForm.reset();
        }
        else{
          this.addLoading = false;
          this.resetValues();
          Swal.fire({
            text: res.data,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }

      })
    }


    else  if(type === 'start_healthy'){
      if(this.mainCategoryForm.invalid){
        return;
      }
      let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')

      this.addLoading = true;
      const formData = new FormData();
      if(this.uploadImage != '' && this.uploadBannerImage !=''){
        formData.append('yogaId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('icon',this.uploadImage);
        formData.append('banner',this.uploadBannerImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else  if(this.uploadImage != ''){
        formData.append('yogaId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('icon',this.uploadImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else  if( this.uploadBannerImage !=''){
        formData.append('yogaId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('banner',this.uploadBannerImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else{
          formData.append('yogaId',this.ID);
          formData.append('title',this.mainCategoryForm.get('title').value);
          formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
          benefits_array.forEach((element,index) => {
            formData.append('benefits['+index+']',element);
          });

          this.mainCategoryForm.get('videos').value.forEach((element,index) => {
            formData.append('videos['+index+']',element);
          });
      }

      this._foliofitMasterYoga.update_start_healthy_list(formData).subscribe((res:any)=>{
        console.log(res);
        if(res.status){
          Swal.fire({
            text:  'Updated Successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.getStartHealthyList();
          this.resetValues();
          this.modalService.dismissAll();
          this.mainCategoryForm.reset();
        }
        else{
          this.addLoading = false;
          this.resetValues();
          Swal.fire({
            text: res.data,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }

      })
    }

    else  if(type === 'weekly_workouts'){
      if(this.mainCategoryForm.invalid){
        return;
      }
      let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')

      this.addLoading = true;
      const formData = new FormData();
      if(this.uploadBannerImage !=''){
        formData.append('weeklyId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('image',this.uploadBannerImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else{
          formData.append('weeklyId',this.ID);
          formData.append('title',this.mainCategoryForm.get('title').value);
          formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
          benefits_array.forEach((element,index) => {
            formData.append('benefits['+index+']',element);
          });

          this.mainCategoryForm.get('videos').value.forEach((element,index) => {
            formData.append('videos['+index+']',element);
          });
      }

      this._foliofitMasterYoga.update_weekly_workouts_list(formData).subscribe((res:any)=>{
        console.log(res);
        if(res.status){
          Swal.fire({
            text:  'Updated Successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.getWeeklyWorkoutList();
          this.resetValues();
          this.modalService.dismissAll();
          this.mainCategoryForm.reset();
        }
        else{
          this.addLoading = false;
          this.resetValues();
          Swal.fire({
            text: res.data,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }

      })
    }

    else  if(type === 'recommend'){
      if(this.mainCategoryForm.invalid){
        return;
      }
      let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')

      this.addLoading = true;
      const formData = new FormData();
      if(this.uploadImage != '' && this.uploadBannerImage !=''){
        formData.append('yogaId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('icon',this.uploadImage);
        formData.append('banner',this.uploadBannerImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else if(this.uploadImage != ''){
        formData.append('yogaId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('icon',this.uploadImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else if( this.uploadBannerImage !=''){
        formData.append('yogaId',this.ID);
        formData.append('title',this.mainCategoryForm.get('title').value);
        formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
        benefits_array.forEach((element,index) => {
          formData.append('benefits['+index+']',element);
        });
        formData.append('banner',this.uploadBannerImage);
        this.mainCategoryForm.get('videos').value.forEach((element,index) => {
          formData.append('videos['+index+']',element);
        });
      }
      else{
          formData.append('yogaId',this.ID);
          formData.append('title',this.mainCategoryForm.get('title').value);
          formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
          benefits_array.forEach((element,index) => {
            formData.append('benefits['+index+']',element);
          });

          this.mainCategoryForm.get('videos').value.forEach((element,index) => {
            formData.append('videos['+index+']',element);
          });
      }

      this._foliofitMasterYoga.update_recommend_list(formData).subscribe((res:any)=>{
        console.log(res);
        if(res.status){
          Swal.fire({
            text:  'Updated Successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.getRecommendList();
          this.resetValues();
          this.modalService.dismissAll();
          this.mainCategoryForm.reset();
        }
        else{
          this.addLoading = false;
          this.resetValues();
          Swal.fire({
            text: res.data,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }

      })
    }

    else  if(type === 'foliofit_home'){
      if(this.foliofitHomeForm.invalid){
        return;
      }

      this.addLoading = true;
     
      let input = {
        categoryId : this.foliofitHomeForm.get('categoryid').value,
        homeId : this.ID
      }
       

      this._foliofitMasterYoga.update_foliofit_home_list(input).subscribe((res:any)=>{
        console.log(res);
        if(res.status){
          Swal.fire({
            text:  'Updated Successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.getfoliofitHomeList();
          this.resetValues();
          this.modalService.dismissAll();
          this.foliofitHomeForm.reset();
        }
        else{
          this.addLoading = false;
          this.resetValues();
          Swal.fire({
            text: res.data,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }

      })

    }


  }


  onChange(event:any,width:any,height:any){
    let setFlag :boolean = false;
      const reader = new FileReader();
      const file = event.target.files[0];


      reader.readAsDataURL(file); 
      const Img = new Image();
      Img.src = URL.createObjectURL(file);
    
      Img.onload = (e: any) => {
        if(e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width) ){
          setFlag = true;
          this.uploadImage = file;
          let content = reader.result as string;
          this.image_URL = content;
         
        }
        else{
          setFlag = true;
          Swal.fire({
                  text: 'Invalid Image Dimension - '+ width +'x' + height,
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor:  '#3085d6',
                  imageHeight: 500,
                });
        }
      }

   
  }

  delete(type:any,id:any){
    if(type === 'start_healthy'){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, keep it',
        confirmButtonColor:  '#d33',
        cancelButtonColor:'#3085d6',
        imageHeight: 50,
      }).then((result) => {
        if (result.value) {
          this._foliofitMasterYoga.delete_start_healthy_list(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.getStartHealthyList();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  
      
    }

    else  if(type === 'weekly_workouts'){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, keep it',
        confirmButtonColor:  '#d33',
        cancelButtonColor:'#3085d6',
        imageHeight: 50,
      }).then((result) => {
        if (result.value) {
          this._foliofitMasterYoga.delete_weekly_workouts_list(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.getWeeklyWorkoutList();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }

    
    else  if(type === 'recommend'){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, keep it',
        confirmButtonColor:  '#d33',
        cancelButtonColor:'#3085d6',
        imageHeight: 50,
      }).then((result) => {
        if (result.value) {
          this._foliofitMasterYoga.delete_recommend_list(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.getRecommendList();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }

  }

  onBannerChange(event:any,width:any,height:any){
    let setFlag :boolean = false;
      const reader = new FileReader();
      const file = event.target.files[0];


      reader.readAsDataURL(file); 
      const Img = new Image();
      Img.src = URL.createObjectURL(file);
    
      Img.onload = (e: any) => {
        if(e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width) ){
          setFlag = true;
          this.uploadBannerImage = file;
          let content = reader.result as string;
          this.bannerImage_URL = content;
         
        }
        else{
          setFlag = true;
          Swal.fire({
                  text: 'Invalid Image Dimension - '+ width +'x' + height,
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor:  '#3085d6',
                  imageHeight: 500,
                });
        }
      }

   
  }

  close(){
    this.modalService.dismissAll();
    this.attemptedSubmit = false;
    this.image_URL = '';
    this.bannerImage_URL = '';
    this.uploadImage = '';
    this.uploadBannerImage = '';
    this.addLoading = false;
    this.mainCategoryForm.reset();
    this.foliofitHomeForm.reset();

  }


  handleFilterYoga(value){
    let listing :any =[];
    if (value.length >= 1) {
      listing = this.AllyogaVideoList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogaVideoList = listing;
    }
    else if (value.length >= 3) {
      listing = this.AllyogaVideoList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogaVideoList = listing;
    }
    else if(value ==='') {
      this.getYogaVideos();
      this.yogaVideoList = this.AllyogaVideoList;
    }
    
    else {
      this.getYogaVideos();
      this.yogaVideoList = this.AllyogaVideoList;
    }
  }


  handleFilterCategory(value){
    let listing :any =[];
    if (value.length >= 1) {
      listing = this.AllListCategory.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.listCategory = listing;
    }
    else  if (value.length >= 3) {
      listing = this.AllListCategory.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.listCategory = listing;
    }
    else if(value ==='') {
      this.getyogaCategories();
      this.listCategory = this.AllListCategory;
    }
    
    else {
      this.getyogaCategories();
      this.listCategory = this.AllListCategory;
    }
  }

  resetValues(){
    this.image_URL = '';
    this.bannerImage_URL = '';
    this.uploadImage = '';
    this.uploadBannerImage = '';
    this.addLoading = false;
    this.attemptedSubmit = false;
  }



}
