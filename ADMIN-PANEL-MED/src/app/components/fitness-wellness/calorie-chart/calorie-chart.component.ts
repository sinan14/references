import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js';
import * as chartData from '../../../shared/data/chart';
import { total_views } from '../../../shared/data/chart';
import { ActivatedRoute, Router } from '@angular/router'
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FoliofitNutriChartsService } from 'src/app/services/foliofit-nutri-charts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calorie-chart',
  templateUrl: './calorie-chart.component.html',
  styleUrls: ['./calorie-chart.component.scss']
})
export class CalorieChartComponent implements OnInit {


  public listVitamins: Array<string> = ['Vitamin  A', 'Vitamin B', 'Vitamin C', 'Vitamin D'];

  public listCategoryBase: Array<string> = ['High Calorie Food', 'Low Calorie Food', 'High Protien Food'];



  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;



  public closeResult: string;
  public accountForm: FormGroup;
  public permissionForm: FormGroup;

  public media = []

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;

  public editMode: boolean = false;

  public form: FormGroup;
  public image: File = null;
  public imagePreview: string = null;
  public bannerImage: File = null;
  public bannerImagePreview: string = null;

  public loading: boolean = false;
  public saving: boolean = false;
  public updating: boolean = false;

  public nutriChartCategoryId: any;
  public foods: any = [];
  public selectedFood: any = [];
  public foodId: any = null;

  public vitamins: any = [];
  public multiSelectDisplayVitamins: any = [];
  public nutritiousSources: any = [];
  public multiSelectDisplayNutritiousSources: any = [];
  public niceToAvoids: any = [];
  public multiSelectDisplayNiceToAvoids: any = [];
  public selectedValues :any = [];


  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _route: Router,
    private permissionService: PermissionService,
    public activatedRoute: ActivatedRoute,
    private foliofitNutrichartService: FoliofitNutriChartsService,
    private location: Location
  ) {
    this.initForm(); }

  ngOnInit(): void {
    this.initForm();
    this.loadAllLists();
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.activatedRoute.paramMap.subscribe(params => {
      this.nutriChartCategoryId = params.get('id');
      this.loadFoods();
    });

  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      bannerImage: [''],
      image: [''],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(2000)])],
      vitamins: [''],
      nutritiousSources: [''],
      niceToAvoids: [''],
      veg: [false, Validators.compose([Validators.required, Validators.maxLength(255)])],
      recommended: [false],
    });
  }


  loadFoods() {
    this.loading = true;
    this.foliofitNutrichartService.getAllFoodsFromCategoryId(this.nutriChartCategoryId).subscribe(res => {
      this.loading = false;
      this.foods = res.data;
    }, error => {
      this.loading = false;
    });
  }

  loadAllLists() {
    this.foliofitNutrichartService.getAllVitamins().subscribe(res => {
      this.vitamins = res.data;
    }, error => {
    });

    this.foliofitNutrichartService.getAllNutritiousSources().subscribe(res => {
      this.nutritiousSources = res.data;
    }, error => {
    });
  }

  update() {
    this.generateFormData();
    const controls = this.form.controls;
    /** check form */
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return false;
    }

    this.updating = true;
    console.log("Form Values", this.form.value);
    let formData = this.generateFormData();
    this.foliofitNutrichartService.updateFood(formData).subscribe(res => {
      Swal.fire('', 'Nutri Chart Successfully Updated', 'success');
      this.loadFoods();
      this.modalService.dismissAll();
      this.updating = false;
    }, error => {
      this.updating = false;

    });
  }

  save() {
    
    const controls = this.form.controls;
    /** check form */
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return false;
    }
    if (!this.image) {
      return false;
    }
    this.generateFormData();
    this.saving = true;
    console.log("Form Values", this.form.value);
    let formData = this.generateFormData();
    this.foliofitNutrichartService.saveFood(formData).subscribe(res => {
      this.saving = false;
      console.log(res.data)
      if(res.status){
        Swal.fire('', 'Meal Successfully Saved', 'success');
        this.modalService.dismissAll();
        this.loadFoods();
      }else{
        Swal.fire('Oops!', res.data, 'warning');
      }
    }, error => {
      this.saving = false;
    });
  }

  generateFormData() {
    const formData = new FormData();
    formData.append('image', this.image);
    formData.append('title', this.form.get('name').value);
    formData.append('category', this.nutriChartCategoryId);
    formData.append('banner', this.bannerImage);
    formData.append('description', this.form.get('description').value);

    if(this.form.get('vitamins').value!= ''){
      this.form.get('vitamins').value.forEach(vitaminId => {
        formData.append('vitamins', vitaminId);
      });
    }

    if(this.form.get('nutritiousSources').value!= ''){
      this.form.get('nutritiousSources').value.forEach(nutritiousSourceId => {
        formData.append('categoriesBased', nutritiousSourceId);
      });
    }


    if(this.form.get('niceToAvoids').value != ''){
      this.form.get('niceToAvoids').value.forEach(niceToAvoidId => {
        formData.append('niceToAvoid', niceToAvoidId);
      });
    }

    formData.append('veg', this.form.get('veg').value);
    formData.append('recommended', this.form.get('recommended').value);

    if (this.editMode) {
      formData.append('foodId', this.selectedFood._id);
    }

    return formData;
  }


  resetForm() {
    this.form.reset();
    this.imagePreview = null;
    this.image = null;
    this.bannerImagePreview = null;
    this.bannerImage = null;

    this.multiSelectDisplayVitamins = this.vitamins;
    this.multiSelectDisplayNutritiousSources = this.nutritiousSources;
    this.multiSelectDisplayNiceToAvoids = this.niceToAvoids;
  }

  onImageChange(event: any, type: string) {
    let acceptingWidth = 308;
    let acceptingHeight = 285;
    if (type == "banner") {
      acceptingWidth = 882;
      acceptingHeight = 1878;
    }

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
            if (type == "banner") {
              this.bannerImagePreview = img.src;
              this.bannerImage = file;
            } else {
              this.imagePreview = img.src;
              this.image = file;
            }
          } else {
            Swal.fire('Oops!', "Please select image with width of " + acceptingWidth + "px and height " + acceptingHeight + "px", 'warning');
            return false;
          }
        };
      };
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
        this.foliofitNutrichartService.deleteFood(id).subscribe((res) => {
          this.loadFoods();
          Swal.fire({
            text: 'Food Deleted Successfully',
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



  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }


  open(content, Value: any, item: any = null) {
    //this.resetForm();
    this.initForm();
    //reset Values
    this.form.get('veg').setValue(null);
    this.imagePreview = null;
    this.image = null;
    this.bannerImagePreview = null;
    this.bannerImage = null;
    this.multiSelectDisplayVitamins = this.vitamins;
    this.multiSelectDisplayNutritiousSources = this.nutritiousSources;
    this.multiSelectDisplayNiceToAvoids = this.niceToAvoids;


    this.selectedFood = item;

    this.editMode = Value === 'edit' ? true : false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    if (Value === 'edit') {
      console.log(item);
      
      this.niceToAvoids = item.categoriesBased.map(onCNutritiousSourceId => {
        // console.log("EV MP", onCNutritiousSourceId);

        let result = this.nutritiousSources.filter(nutritiousSource => { return nutritiousSource._id == onCNutritiousSourceId })
        return result.length ? result[0] : [];
      })

      this.multiSelectDisplayNiceToAvoids = this.niceToAvoids

      this.form.patchValue({
        name: item.title,
        description: item.description,
        vitamins: item.vitamins,
        nutritiousSources: item.categoriesBased,
        niceToAvoids: item.niceToAvoid,
        veg: item.veg ? 'true' : 'false',
        recommended: item.recommended,
      });

      this.editMode = true;

      this.imagePreview = item.image;
      this.bannerImagePreview = item.banner;

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
    localStorage.setItem("TabID", "tab-selectbyid5");
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

  handleVitaminsFilter(value) {
    // console.log("Filter EV : ",value);
    if (value.length >= 1) {
      this.multiSelectDisplayVitamins = this.vitamins.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.multiSelectDisplayVitamins = this.vitamins
    }
  }

  handleNutritiousSourcesFilter(value) {
    // console.log("Filter EV : ",value);
    if (value.length >= 1) {
      this.multiSelectDisplayNutritiousSources = this.nutritiousSources.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.multiSelectDisplayNutritiousSources = this.nutritiousSources
    }
  }

  handleNiceToAvoidsFilter(value) {
    // console.log("Filter EV : ",value);
    if (value.length >= 1) {
      this.multiSelectDisplayNiceToAvoids = this.niceToAvoids.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.multiSelectDisplayNiceToAvoids = this.niceToAvoids
    }
  }

  onCNutritiousSource(event) {
    this.form.patchValue({
      niceToAvoids: "",
    });
    console.log("onCNutritiousSource", event);
    this.niceToAvoids = event.map(onCNutritiousSourceId => {
      console.log("EV MP", onCNutritiousSourceId);

      let result = this.nutritiousSources.filter(nutritiousSource => { return nutritiousSource._id == onCNutritiousSourceId })
      return result.length ? result[0] : [];
    })
    this.multiSelectDisplayNiceToAvoids = this.niceToAvoids;
    console.log("this.niceToAvoids", this.niceToAvoids);

  }



}
