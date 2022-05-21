import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js';
import * as chartData from '../../../shared/data/chart';
import { total_views } from '../../../shared/data/chart';
import { ActivatedRoute, Router } from '@angular/router'
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FoliofitDietRegimeService } from 'src/app/services/foliofit-diet-regime.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diet-plan',
  templateUrl: './diet-plan.component.html',
  styleUrls: ['./diet-plan.component.scss']
})
export class DietPlanComponent implements OnInit {


  public formMorningArray = [];
  public formAfterNoonArray = [];
  public formEveningArray = [];
  public formNightArray = [];

  // profit_colorScheme = {
  //   domain: ['#ffffff', '#0088ff', '#ffffff', '#0088ff', '#ffffff', '#0088ff', '#ffffff']
  // };
  // calculator_colorScheme = {
  //   domain: ['#ffffff', '#02d2bd', '#ffffff', '#02d2bd', '#ffffff', '#02d2bd', '#ffffff']
  // };
  // total_views: any[];
  // profit_view: any[] = [194, 100];
  // legend: boolean = true;
  // legendPosition: string = 'top';
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;



  public closeResult: string;
  public accountForm: FormGroup;
  public permissionForm: FormGroup;

  public form = {
    day: "",
    title: "",
    morningMeals: [{ meal: "", description: "", image: '' }],
    afterNoonMeals: [{ meal: "", description: "", image: '' }],
    eveningMeals: [{ meal: "", description: "", image: '' }],
    nightMeals: [{ meal: "", description: "", image: '' }],
  }


  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  public submitted: boolean = false;

  public editMode: boolean = false;
  public dietId: any = null;
  public dietDays: any = null;
  public selectedDietDay: any = [];

  public image: File;
  public imagePreview: string;

  public loading: boolean = false;
  public imageLoading: boolean = false;
  public saving: boolean = false;
  public updating: boolean = false;





  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _route: Router,
    public activatedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private location: Location,
    private foliofitDietRegimeService: FoliofitDietRegimeService) {
    // this.media = mediaDB.data;
    // Object.assign(this, { total_views })
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.dietId = params.get('id');
      this.loadDietDays();
    });
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

  }

  loadDietDays() {
    this.loading = true;
    this.foliofitDietRegimeService.getAllDays(this.dietId).subscribe(res => {
      this.loading = false;
      this.dietDays = res.data;
    }, error => {
      this.loading = false;
    });
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

  delete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      imageHeight: 50,
    }).then((result) => {
      if (result.value) {
        this.foliofitDietRegimeService.deleteDay(id).subscribe((res) => {
          this.loadDietDays();
          Swal.fire({
            text: 'Deleted Successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 50,
          });
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  open(content, Value: any, item: any = null) {
    console.log("ITem", item);

    this.resetForm();
    this.selectedDietDay = item;

    this.MealsSubmitted = false;
    this.ImageSubmitted = false;
    this.editMode = Value === 'edit' ? true : false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    if (Value === 'edit') {

      this.editMode = true;
      this.imagePreview = item.image
      this.form = {
        day: item.day,
        title: item.title,
        morningMeals: item.morning.map(meal => {
          return {
            meal: meal.describeMeal,
            description: meal.subText,
            image: meal.image,
          }
        }),

        afterNoonMeals: item.afterNoon.map(meal => {
          return {
            meal: meal.describeMeal,
            description: meal.subText,
            image: meal.image,
          }
        }),

        eveningMeals: item.evening.map(meal => {
          return {
            meal: meal.describeMeal,
            description: meal.subText,
            image: meal.image,
          }
        }),

        nightMeals: item.night.map(meal => {
          return {
            meal: meal.describeMeal,
            description: meal.subText,
            image: meal.image,
          }
        }),
      }

    }

  }


  open__(content, Value: any, item: any = null) {
    console.log(Value)
    this.resetForm();
    if (Value === 'add') {
      this.editMode = false;
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }


    else if (Value === '') {
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

  BackRedirectTo() {
    this._route.navigate(['/fitness-wellness'])
    localStorage.setItem("TabID", "tab-selectbyid3");
  }

  addMeals(mealType) {
    let formElement = { meal: "", description: "", image: null };
    switch (mealType) {
      case 'morning':
        this.form.morningMeals.push(formElement);
        break;
      case 'afterNoon':
        this.form.afterNoonMeals.push(formElement);
        break;
      case 'evening':
        this.form.eveningMeals.push(formElement);
        break;
      case 'night':
        this.form.nightMeals.push(formElement);
        break;
    }
  }

  removeMeals(mealType, id) {
    switch (mealType) {
      case 'morning':
        this.form.morningMeals.splice(id, 1);
        break;
      case 'afterNoon':
        this.form.afterNoonMeals.splice(id, 1);
        break;
      case 'evening':
        this.form.eveningMeals.splice(id, 1);
        break;
      case 'night':
        this.form.nightMeals.splice(id, 1);
        break;
    }
  }

  onImageChange(event: any, type: string, mealType: string = null, i: number = null) {
    let acceptingWidth = 306;
    let acceptingHeight = 227;
    if (type == 'banner') {
      acceptingWidth = 282;
      acceptingHeight = 295;
    } else {
      //306x227

    }
    this.imageLoading = true;
    this.MealsSubmitted = false;
    this.ImageSubmitted = false;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type.indexOf('image') != 0) {
        Swal.fire('Oops!', "Please image select a valid image file", 'warning');
        return false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;
          if (width == acceptingWidth && height == acceptingHeight) {
            if (type == 'meal') {
              // switch (mealType) {
              //   case 'morning': this.form.morningMeals[i].image = 'loading'; this.saving = false;break;
              //   case 'afterNoon': this.form.afterNoonMeals[i].image = 'loading';this.saving = false; break;
              //   case 'evening': this.form.eveningMeals[i].image = 'loading';this.saving = false; break;
              //   case 'night': this.form.nightMeals[i].image = 'loading'; this.saving = false;break;
              // }

              const formData = new FormData();
              formData.append('image', file);
              this.foliofitDietRegimeService.uploadImage(formData).subscribe(res => {
                switch (mealType) {
                  case 'morning': this.form.morningMeals[i].image = res.data.image_path; this.imageLoading = false;break;
                  case 'afterNoon': this.form.afterNoonMeals[i].image = res.data.image_path;this.imageLoading = false; break;
                  case 'evening': this.form.eveningMeals[i].image = res.data.image_path; this.imageLoading = false;break;
                  case 'night': this.form.nightMeals[i].image = res.data.image_path;this.imageLoading = false; break;
                }
              }, error => {
                switch (mealType) {
                  case 'morning': this.form.morningMeals[i].image = null;this.imageLoading = false; break;
                  case 'afterNoon': this.form.afterNoonMeals[i].image = null; this.imageLoading = false;break;
                  case 'evening': this.form.eveningMeals[i].image = null; this.imageLoading = false;break;
                  case 'night': this.form.nightMeals[i].image = null;this.imageLoading = false; break;
                }

              });
              
            } else {
              this.imagePreview = img.src;
              this.image = file;
              this.imageLoading = false;
            }
          } else {
            this.imageLoading = false;
            Swal.fire('Oops!', "Please select image with width of " + acceptingWidth + "px and height " + acceptingHeight + "px", 'warning');
            return false;
          }
        };
      };
    }
  }

  generateFormData() {
    console.log(" this.image", this.image);

    const formData = new FormData();
    if (this.editMode) {
      formData.append('dayId', this.selectedDietDay._id);
    }
    formData.append('dietPlan', this.dietId);
    formData.append('day', this.form.day);
    formData.append('image', this.image);
    formData.append('title', this.form.title);

    this.form.morningMeals.forEach((morningMeal, i) => {
      if(morningMeal.meal !='' || morningMeal.description != '' || morningMeal.image !=''){
        let data: any = `{"describeMeal":"${morningMeal.meal}","subText":"${morningMeal.description}","image":"${morningMeal.image}"}`;
        formData.append('morning[' + i + ']', data);
      }
    });

    this.form.afterNoonMeals.forEach((afterNoonMeal, i) => {
      if(afterNoonMeal.meal !='' || afterNoonMeal.description != '' || afterNoonMeal.image !=''){
        let data: any = `{"describeMeal":"${afterNoonMeal.meal}","subText":"${afterNoonMeal.description}","image": "${afterNoonMeal.image}"}`;
        formData.append('afterNoon[' + i + ']', data);
      }
    });

    this.form.eveningMeals.forEach((eveningMeal, i) => {
      if(eveningMeal.meal !='' || eveningMeal.description != '' || eveningMeal.image !=''){
        let data: any = `{"describeMeal":"${eveningMeal.meal}","subText": "${eveningMeal.description}","image": "${eveningMeal.image}"}`;
        formData.append('evening[' + i + ']', data);
      }
    });

    this.form.nightMeals.forEach((nightMeal, i) => {
      if(nightMeal.meal !='' || nightMeal.description != '' || nightMeal.image !=''){
        let data: any = `{"describeMeal":"${nightMeal.meal}","subText": "${nightMeal.description}","image": "${nightMeal.image}"}`;
        formData.append('night[' + i + ']', data);
      }
    });
    return formData;
  }
  MealsSubmitted :boolean = true;
  ImageSubmitted :boolean = false;
  inputData(val:any,i:any,type:any){
    if(val!=''){
      if(type==="morning"){
        if(this.form.morningMeals[i].image ===''){
          this.ImageSubmitted = true;
          this.MealsSubmitted = false;
        }
       if(this.form.morningMeals[i].meal ===''){
          this.submitted = false;
          this.MealsSubmitted = false;
        }
         if(this.form.morningMeals[i].description ===''){
          this.submitted = false;
          this.MealsSubmitted = false;
        }
      }
      else if(type ==='afternoon'){
        if(this.form.afterNoonMeals[i].image ===''){
          this.ImageSubmitted = true;
        }
      }
      
      else if(type === 'evening'){
        if(this.form.eveningMeals[i].image ===''){
          this.ImageSubmitted = true;
        }
      }
      else if(type === 'night'){
        if(this.form.nightMeals[i].image ===''){
          this.ImageSubmitted = true;
        }
      }
     

    }
    else{
      this.submitted = false;
      this.MealsSubmitted = true;
      return false;
    }
  }

  inputDataa(v,i,type){
    if(type="morning"){
      if(this.form.morningMeals[i].image ===''){
        this.ImageSubmitted = true;
      }
      else if(this.form.morningMeals[i].meal ===''){
        this.submitted = true;
        this.MealsSubmitted = true;
      }
      else if(this.form.morningMeals[i].description ===''){
        this.submitted = true;
      }
    }
    else  if(type="afternoon"){
      if(this.form.afterNoonMeals[i].image ===''){
        this.ImageSubmitted = true;
      }
      else if(this.form.afterNoonMeals[i].meal ===''){
        this.submitted = true;
      }
      else if(this.form.afterNoonMeals[i].description ===''){
        this.submitted = true;
      }
    }

    else  if(type="evening"){
      if(this.form.eveningMeals[i].image ===''){
        this.ImageSubmitted = true;
      }
      else if(this.form.eveningMeals[i].meal ===''){
        this.submitted = true;
      }
      else if(this.form.eveningMeals[i].description ===''){
        this.submitted = true;
      }
    }

    else  if(type="night"){
      if(this.form.nightMeals[i].image ===''){
        this.ImageSubmitted = true;
      }
      else if(this.form.nightMeals[i].meal ===''){
        this.submitted = true;
      }
      else if(this.form.nightMeals[i].description ===''){
        this.submitted = true;
      }
    }

  }

  public mFlag :boolean = false;
  public ANFlag :boolean = false;
  public EvngFlag :boolean = false;
  public NightFlag :boolean = false;
  save(valid:boolean) {
    console.log("VALID",valid);

    

    for(let i=0;i<this.form.morningMeals.length;i++){
      if(this.form.morningMeals[i].meal != '' &&  this.form.morningMeals[i].description != '' &&  this.form.morningMeals[i].image != ''){
        this.submitted = false;
      }
      else{
        this.MealsSubmitted = true;
        this.ImageSubmitted = true;
        return false;
      }
    
    }

    for(let i=0;i<this.form.afterNoonMeals.length;i++){
      if(this.form.afterNoonMeals[i].meal != '' && this.form.afterNoonMeals[i].description != '' &&  this.form.afterNoonMeals[i].image != ''){
        this.submitted = false;
      }
    }

    for(let i=0;i<this.form.eveningMeals.length;i++){
      if(this.form.eveningMeals[i].meal != '' &&  this.form.eveningMeals[i].description != '' &&  this.form.eveningMeals[i].image != ''){
        this.submitted = false;
      }
    }

    for(let i=0;i<this.form.nightMeals.length;i++){
      if(this.form.nightMeals[i].meal != '' &&  this.form.nightMeals[i].description != '' &&  this.form.nightMeals[i].image != ''){
        this.submitted = false;
      }
    }
    
    // for(let i=0;i<this.form.morningMeals.length;i++){
    //   if(validForm.form.value.morning_0 != '' || validForm.form.value.morning_description_0 !='' || validForm.form.value.morning_image_0 != ''){
    //     validForm= new FormControl({
    //       afternoon_meal_i : [''],
    //       afternoon_description_i : [''],
    //     })
    //     validForm.form.controls.afternoon_meal_0.errors.required = false;
    //     validForm.form.controls.afternoon_description_0.errors.required = false;

        
    //     validForm.form.controls.evening_meal_0.errors.required = false;
    //     validForm.form.controls.evening_description_0.errors.required = false;

    //   }
    // }

    

      if ( this.imagePreview === null) {
        this.submitted = false;
        this.MealsSubmitted= true;
        this.ImageSubmitted = true;
        return false;
      }
    this.submitted = true;
    this.saving = true;
    let data = this.generateFormData();
    this.foliofitDietRegimeService.saveDay(data).subscribe(res => {
      this.saving = false;
      if (res.status) {
        Swal.fire('', 'Diet Plan Successfully Saved', 'success');
        this.modalService.dismissAll();
        this.loadDietDays();
      } else {
        Swal.fire('Oops!', res.data, 'warning');
      }
    });
  }

  formImagesValidation(){
    let valid = true;
    this.form.morningMeals.forEach( item => {
      valid = item.image ? valid : false;
    });
    this.form.afterNoonMeals.forEach( item => {
      valid = item.image ? valid : false;
    });
    this.form.eveningMeals.forEach( item => {
      valid = item.image ? valid : false;
    });
    this.form.eveningMeals.forEach( item => {
      valid = item.image ? valid : false;
    });
  }

  update(valid:boolean) { 
    if (!valid) {
    return false;
  }
  

  for(let i=0;i<this.form.morningMeals.length;i++){
    if(this.form.morningMeals[i].meal != '' || this.form.morningMeals[i].description != '' || this.form.morningMeals[i].image != ''){
      this.submitted = false;
    }
    else{
      this.submitted = false;
      this.MealsSubmitted = true;
      return false;
    }
  
  }

  for(let i=0;i<this.form.afterNoonMeals.length;i++){
    if(this.form.afterNoonMeals[i].meal != '' || this.form.afterNoonMeals[i].description != '' || this.form.afterNoonMeals[i].image != ''){
      this.submitted = false;
    }
    else{
      
      this.submitted = true;
    }
  }

  for(let i=0;i<this.form.eveningMeals.length;i++){
    if(this.form.eveningMeals[i].meal != '' || this.form.eveningMeals[i].description != '' || this.form.eveningMeals[i].image != ''){
      this.submitted = false;
    }
    else{
      
      this.submitted = true;
    }
  }

  for(let i=0;i<this.form.nightMeals.length;i++){
    if(this.form.nightMeals[i].meal != '' || this.form.nightMeals[i].description != '' || this.form.nightMeals[i].image != ''){
      this.submitted = false;
    }
    else{
      
      this.submitted = true;
    }
  }
    this.submitted = true;
    this.generateFormData();
    
    /** check form */
    // if (this.form.invalid) {
    //   Object.keys(controls).forEach(controlName =>
    //     controls[controlName].markAsTouched()
    //   );
    //   return false;
    // }

    this.updating = true;
  
    let formData = this.generateFormData();
    this.foliofitDietRegimeService.updateDay(formData).subscribe(res => {
      this.updating = false;
      if (res.status) {
        Swal.fire('', 'Successfully Updated', 'success');
        this.loadDietDays();
        this.modalService.dismissAll();
      } else {
        Swal.fire('Oops!', res.message, 'warning');
      }
    }, error => {
      this.updating = false;

    });
  }

  resetForm() {
    this.submitted = false;
    this.form = {
      day: "",
      title: "",
      morningMeals: [{ meal: "", description: "", image: '' }],
      afterNoonMeals: [{ meal: "", description: "", image: '' }],
      eveningMeals: [{ meal: "", description: "", image: '' }],
      nightMeals: [{ meal: "", description: "", image: '' }],
    }
    this.image = null;
    this.imagePreview = null;

  }

  trackByFn(index: any) {
    return index;
  }

}
