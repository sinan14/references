import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from 'src/app/permission.service';
import { FoliofitDietRegimeService } from 'src/app/services/foliofit-diet-regime.service';
import { FoliofitNutriChartsService } from 'src/app/services/foliofit-nutri-charts.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nutri-chart-tab',
  templateUrl: './nutri-chart-tab.component.html',
  styleUrls: ['./nutri-chart-tab.component.scss']
})
export class NutriChartTabComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _route: Router,
    private permissionService: PermissionService,
    private foliofitDietRegimeService: FoliofitNutriChartsService,
    private location: Location,
  ) { }



  public permissions: any = [];
  public deleteFlag: boolean = true;
  public editFlag: boolean = true;
  public viewFlag: boolean = true;
  public user: any = [];
  public currentPrivilages: any = [];
  //  public aciveTagFlag: boolean = true;

  public editMode: boolean = false;
  public nutriChartCategories: any = [];
  public selectedNutriChartCategory: any = [];

  public form: FormGroup;
  public image: File;
  public imagePreview: string;

  public loading: boolean = false;
  public saving: boolean = false;
  public updating: boolean = false;

  public closeResult: string;

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.initForm();
    this.loadNutriCharts();
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

  initForm() {
    this.form = this.formBuilder.group({
      image: [""],
      title: ["", Validators.compose([Validators.required, Validators.maxLength(255)])],
    });
  }


  loadNutriCharts() {
    this.loading = true;
    this.foliofitDietRegimeService.getAll().subscribe(res => {
      this.loading = false;
      this.nutriChartCategories = res.data;
    }, error => {
      this.loading = false;
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
    this.foliofitDietRegimeService.update(formData).subscribe(res => {
      this.updating = false;
      if (res.status) {
        Swal.fire('', 'Nutri Chart Successfully Updated', 'success');
        this.loadNutriCharts();
        this.modalService.dismissAll();
      } else {
        Swal.fire('Oops!', res.data, 'warning');
      }
    }, error => {
      this.updating = false;

    });
  }

  save() {
    this.generateFormData();
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
    this.saving = true;
    console.log("Form Values", this.form.value);
    let formData = this.generateFormData();
    this.foliofitDietRegimeService.save(formData).subscribe(res => {
      this.saving = false;
      if (res.status) {
        Swal.fire('', 'Nutri Chart Successfully Saved', 'success');
        this.modalService.dismissAll();
        this.loadNutriCharts();
      } else {
        Swal.fire('Oops!', res.data, 'warning');
      }
    }, error => {
      this.saving = false;
    });
  }

  generateFormData() {
    const formData = new FormData();
    formData.append('image', this.image);
    formData.append('title', this.form.get('title').value);
    if (this.editMode) {
      formData.append('categoryId', this.selectedNutriChartCategory._id);
    }
    return formData;
  }


  resetForm() {
    this.form.reset();
    this.imagePreview = null;
    this.image = null;
  }

  onImageChange(event: any) {
    let acceptingWidth = 460;
    let acceptingHeight = 366;
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
            this.imagePreview = img.src;
            this.image = file;
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
        this.foliofitDietRegimeService.delete(id).subscribe((res) => {
          this.loadNutriCharts();
          Swal.fire({
            text: 'Nutri Chart Deleted Successfully',
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

  open(content, Value: any, item: any) {
    this.resetForm();
    this.selectedNutriChartCategory = item;

    this.editMode = Value === 'edit' ? true : false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    if (Value === 'edit') {

      this.editMode = true;

      this.imagePreview = item.image;
      this.form.patchValue({
        title: item.title,
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

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  redirectToCalorieChart(id) {
    // this._route.navigate(['/fitness-wellness/diet-plan',id]);
    this._route.navigate(['/fitness-wellness/calorie-chart', id])
    // localStorage.setItem("TabID", 'tab-selectbyid5')

  }

}
