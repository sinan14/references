import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { NgbModal, ModalDismissReasons ,NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js';
import * as chartData from '../../../shared/data/chart';
import { total_views} from '../../../shared/data/chart';
import { ActivatedRoute, Router, ParamMap }  from '@angular/router';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FoliofitMasterFitnessclubService } from 'src/app/services/foliofit-master-fitnessclub.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-fitness-club',
  templateUrl: './fitness-club.component.html',
  styleUrls: ['./fitness-club.component.scss']
})
export class FitnessClubComponent implements OnInit {

 
  public value: any = [];

  backFlag :boolean = false;
  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;
  public closeResult: string;
  


  //NEW VARIABLES

  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;

  public mainCategoryList :any = [];
  public homeWorkoutList :any = [];
  public weeklyWorkoutList :any = [];
  public fullBodyWorkoutList :any = [];
  public commenceHealthList :any = [];
  public foliofitHomeList :any = [];
  public addLoading :boolean = false;
  public attemptedSubmit :boolean = false;
  public image_URL :any = '';
  public bannerImage_URL :any = '';
  public uploadBannerImage :any = '';
  public uploadImage :any = '';
  public ID :any ;
  public videoList :any = [];
  public listCategory :any = [];
  public AllCategoryList :any = [];
  public allVideoListing :any = [];


  public mainCategoryForm :FormGroup;
  public foliofitHomeForm :FormGroup;


  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _route : Router,public activatedRoute: ActivatedRoute,
    private permissionService:PermissionService,
    private location: Location,
    private _foliofitMasterFitnessClub :FoliofitMasterFitnessclubService,
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

    selectedTab = '';
    ngOnInit(): void {

      this.user = JSON.parse(sessionStorage.getItem('userData'));

      if(this.user != ''){
        this.permissionService.canActivate(this.location.path().split('/').pop())
      }

    
      let tabselected =  localStorage.getItem("TabID");
      if(tabselected!=''){
        if(tabselected  == 'tab-selectbyid3'){
          this.selectedTab = 'tab-selectbyid3';
        }
        else if(tabselected  == 'tab-selectbyid5'){
          this.selectedTab = 'tab-selectbyid5';
        }
      }
      else{
        localStorage.clear();
        this.selectedTab = '';
      }


      this.getMainCategoryList();
      this.getHomeWorkoutList();
      this.getWeeklyWorkoutList();
      this.getFullBodyWorkoutList();
      this.getCommenceHealthList();
      this.getfoliofitHomeList();

      this.getAllVideos();
      this.getfoliofitCategories();
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
  getfoliofitCategories(){
    this._foliofitMasterFitnessClub.get_all_fitness_categories().subscribe((res:any)=>{
      this.listCategory = res.data;
      this.AllCategoryList = res.data;
    })
  }


  getAllVideos(){
    this._foliofitMasterFitnessClub.get_all_fitness_videos().subscribe((res:any)=>{
      this.videoList = res.data;
      this.allVideoListing = res.data;
    })
  }

  getMainCategoryList(){
    this._foliofitMasterFitnessClub.get_main_category_list().subscribe((res:any)=>{
        this.mainCategoryList = res.data;
    })
  }

  getHomeWorkoutList(){
    this._foliofitMasterFitnessClub.get_home_workouts_list().subscribe((res:any)=>{
        this.homeWorkoutList = res.data;
    })
  }
  getWeeklyWorkoutList(){
    this._foliofitMasterFitnessClub.get_weekly_workouts_list().subscribe((res:any)=>{
        this.weeklyWorkoutList = res.data;
    })
  }

  getFullBodyWorkoutList(){
    this._foliofitMasterFitnessClub.get_full_body_workouts_list().subscribe((res:any)=>{
        this.fullBodyWorkoutList = res.data;
    })
  }

  getCommenceHealthList(){
    this._foliofitMasterFitnessClub.get_health_journey_list().subscribe((res:any)=>{
        this.commenceHealthList = res.data;
    })
  }

  getfoliofitHomeList(){
    this._foliofitMasterFitnessClub.get_foliofit_home_list().subscribe((res:any)=>{
        this.foliofitHomeList = res.data;
    })
  }

  

    redirectToDietPlan(){
      this.selectedTab = 'tab-selectbyid3';
        this._route.navigate(['/fitness-wellness/diet-plan']);
        localStorage.setItem("TabID",'tab-selectbyid3')
    }

    redirectToCalorieChart(){
      this._route.navigate(['/fitness-wellness/calorie-chart'])
      localStorage.setItem("TabID",'tab-selectbyid5')
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
        this.image_URL = '';
        this.bannerImage_URL = '';
        this.foliofitHomeForm.reset();
        this.mainCategoryForm.reset();
        this.attemptedSubmit = false;
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
          this._foliofitMasterFitnessClub.get_single_main_category_list(id).subscribe((res:any)=>{
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

        else  if(type === 'main_categoryone'){
          this._foliofitMasterFitnessClub.get_single_main_category_list(id).subscribe((res:any)=>{
            console.log(res.data);
            this.ID = res.data._id;
            this.image_URL = res.data.icon;
            console.log(res.data.benefits.toString());
            this.mainCategoryForm.patchValue({
              title:res.data.title,
              subtitle:res.data.subTitle,
              benefits:res.data.benefits.toString(),
              videos:res.data.videos,
            })
          })
        }

        else if(type === 'home_workouts'){
          this._foliofitMasterFitnessClub.get_single_home_workouts_list(id).subscribe((res:any)=>{
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
          this._foliofitMasterFitnessClub.get_single_weekly_workouts_list(id).subscribe((res:any)=>{
            console.log(res.data);
            this.ID = res.data._id;
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

        else if(type === 'full_body_workout'){
          this._foliofitMasterFitnessClub.get_single_full_body_workouts_list(id).subscribe((res:any)=>{
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

        else if(type === 'commence_health'){
          this._foliofitMasterFitnessClub.get_single_health_journey_list(id).subscribe((res:any)=>{
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
          this._foliofitMasterFitnessClub.get_foliofit_home_list().subscribe((res:any)=>{
            console.log(res.data);
            this.foliofitHomeForm.patchValue({
              categoryid:res.data[0]._id
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
      if(type === 'home_workouts'){

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

          this._foliofitMasterFitnessClub.add_home_workouts_list(formData).subscribe((res:any)=>{
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
              this.getHomeWorkoutList();
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

          formData.append('banner',this.uploadBannerImage);

          this.mainCategoryForm.get('videos').value.forEach((element,index) => {
            formData.append('videos['+index+']',element);
          });

          this._foliofitMasterFitnessClub.add_weekly_workouts_list(formData).subscribe((res:any)=>{
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
              this.resetValues();
              this.getWeeklyWorkoutList();
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


      else if(type === 'full_body_workout'){

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

          this._foliofitMasterFitnessClub.add_full_body_workouts_list(formData).subscribe((res:any)=>{
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
              this.getFullBodyWorkoutList();
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


      else if(type === 'commence_health'){

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

          this._foliofitMasterFitnessClub.add_health_journey_list(formData).subscribe((res:any)=>{
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
              this.getCommenceHealthList();
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
          formData.append('id',this.ID);
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
          formData.append('id',this.ID);
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
        else if(this.uploadBannerImage !=''){
          formData.append('id',this.ID);
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
            formData.append('id',this.ID);
            formData.append('title',this.mainCategoryForm.get('title').value);
            formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
            benefits_array.forEach((element,index) => {
              formData.append('benefits['+index+']',element);
            });
  
            this.mainCategoryForm.get('videos').value.forEach((element,index) => {
              formData.append('videos['+index+']',element);
            });
        }

   

        this._foliofitMasterFitnessClub.update_main_category_list(formData).subscribe((res:any)=>{
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
            this.resetValues();
            this.addLoading = false;
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

      else if(type === 'main_categoryone'){

        
        this.addLoading = true;
        const formData = new FormData();
        if(this.uploadImage != ''){
          formData.append('id',this.ID);
          formData.append('title',this.mainCategoryForm.get('title').value);
          formData.append('icon',this.uploadImage);
        }
        else{
          formData.append('id',this.ID);
          formData.append('title',this.mainCategoryForm.get('title').value);
        }

        this._foliofitMasterFitnessClub.update_main_category_list(formData).subscribe((res:any)=>{
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
            this.resetValues();
            this.addLoading = false;
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

      else  if(type === 'home_workouts'){
        if(this.mainCategoryForm.invalid){
          return;
        }
        let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')

        this.addLoading = true;
        const formData = new FormData();
        if(this.uploadImage != '' && this.uploadBannerImage !=''){
          formData.append('id',this.ID);
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
          formData.append('id',this.ID);
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
          formData.append('id',this.ID);
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
            formData.append('id',this.ID);
            formData.append('title',this.mainCategoryForm.get('title').value);
            formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
            benefits_array.forEach((element,index) => {
              formData.append('benefits['+index+']',element);
            });
  
            this.mainCategoryForm.get('videos').value.forEach((element,index) => {
              formData.append('videos['+index+']',element);
            });
        }

        this._foliofitMasterFitnessClub.update_home_workouts_list(formData).subscribe((res:any)=>{
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
            this.getHomeWorkoutList();
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
        if( this.uploadBannerImage !=''){
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
            formData.append('title',this.mainCategoryForm.get('title').value);
            formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
            benefits_array.forEach((element,index) => {
              formData.append('benefits['+index+']',element);
            });
  
            this.mainCategoryForm.get('videos').value.forEach((element,index) => {
              formData.append('videos['+index+']',element);
            });
        }

        this._foliofitMasterFitnessClub.update_weekly_workouts_list(this.ID,formData).subscribe((res:any)=>{
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

      else if(type === 'full_body_workout'){
        if(this.mainCategoryForm.invalid){
          return;
        }
        let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')

        this.addLoading = true;
        const formData = new FormData();
        if(this.uploadImage != '' && this.uploadBannerImage !=''){
          formData.append('id',this.ID);
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
          formData.append('id',this.ID);
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
        else    if( this.uploadBannerImage !=''){
          formData.append('id',this.ID);
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
            formData.append('id',this.ID);
            formData.append('title',this.mainCategoryForm.get('title').value);
            formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
            benefits_array.forEach((element,index) => {
              formData.append('benefits['+index+']',element);
            });
  
            this.mainCategoryForm.get('videos').value.forEach((element,index) => {
              formData.append('videos['+index+']',element);
            });
        }

        this._foliofitMasterFitnessClub.update_full_body_workouts_list(formData).subscribe((res:any)=>{
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
            this.getFullBodyWorkoutList();
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


      else if(type === 'commence_health'){
        if(this.mainCategoryForm.invalid){
          return;
        }
        let benefits_array = this.mainCategoryForm.get('benefits').value.split(',')

        this.addLoading = true;
        const formData = new FormData();
        if(this.uploadImage != '' && this.uploadBannerImage !=''){
          formData.append('id',this.ID);
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
          formData.append('id',this.ID);
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
          formData.append('id',this.ID);
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
            formData.append('id',this.ID);
            formData.append('title',this.mainCategoryForm.get('title').value);
            formData.append('subTitle',this.mainCategoryForm.get('subtitle').value);
            benefits_array.forEach((element,index) => {
              formData.append('benefits['+index+']',element);
            });
  
            this.mainCategoryForm.get('videos').value.forEach((element,index) => {
              formData.append('videos['+index+']',element);
            });
        }

        this._foliofitMasterFitnessClub.update_health_journey_list(formData).subscribe((res:any)=>{
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
            this.getCommenceHealthList();
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
          category : this.foliofitHomeForm.get('categoryid').value
        }
         

        this._foliofitMasterFitnessClub.update_foliofit_home_list(input).subscribe((res:any)=>{
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
            this.modalService.dismissAll();
            this.foliofitHomeForm.reset();
            this.resetValues();
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


    delete(type:any,id:any){
      if(type === 'home_workouts'){
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
            this._foliofitMasterFitnessClub.delete_home_workouts_list(id).subscribe((res:any)=>{
              if(res.status){
                Swal.fire({
                        text:'Successfully Deleted',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'Ok',
                        confirmButtonColor:  '#3085d6',
                        imageHeight: 500,
                      });
                      this.getHomeWorkoutList();
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
            this._foliofitMasterFitnessClub.delete_weekly_workouts_list(id).subscribe((res:any)=>{
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

      else  if(type === 'full_body_workout'){
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
            this._foliofitMasterFitnessClub.delete_full_body_workouts_list(id).subscribe((res:any)=>{
              if(res.status){
                Swal.fire({
                        text:'Successfully Deleted',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'Ok',
                        confirmButtonColor:  '#3085d6',
                        imageHeight: 500,
                      });
                      this.getFullBodyWorkoutList();
              }
            })
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
    
        
      }

      else  if(type === 'commence_health'){
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
            this._foliofitMasterFitnessClub.delete_health_journey_list(id).subscribe((res:any)=>{
              if(res.status){
                Swal.fire({
                        text:'Successfully Deleted',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'Ok',
                        confirmButtonColor:  '#3085d6',
                        imageHeight: 500,
                      });
                      this.getCommenceHealthList();
              }
            })
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
    
        
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

  onChangeFn(event:any){
    const reader = new FileReader();
    const file = event.target.files[0];


    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      // console.log(e.path[0].naturalHeight);
      // console.log(e.path[0].naturalWidth);
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;

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

    handleFilterVideos(value){
      let listing :any =[];
      if (value.length >= 1) {
        listing = this.allVideoListing.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.videoList = listing;
      }
      else if(value.length >= 3) {
        listing = this.allVideoListing.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.videoList = listing;
      }
      else if(value === '') {
        this._foliofitMasterFitnessClub.get_all_fitness_videos().subscribe((res:any)=>{
          this.videoList = res.data;
        })
      }
      else {
        this._foliofitMasterFitnessClub.get_all_fitness_videos().subscribe((res:any)=>{
          this.videoList = res.data;
        })
      }
    }

    handleFilterCategory(value){
      let listing :any =[];
      if (value.length <= 1) {
        listing = this.AllCategoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.listCategory = listing;
      }
      else if(value.length >=3) {
        listing = this.AllCategoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.listCategory = listing;
      }
      else if(value === '') {
        this.getfoliofitCategories();
        this.listCategory = this.AllCategoryList;
      }
      
      else {
        this.getfoliofitCategories();
        this.listCategory = this.AllCategoryList;
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
