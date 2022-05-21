import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { mediaDB } from 'src/app/shared/tables/media';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js';
import * as chartData from '../../../shared/data/chart';
import { total_views } from '../../../shared/data/chart';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FoliofitMasterNutriChartService } from 'src/app/services/foliofit-master-nutri-chart.service';
import Swal from 'sweetalert2';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-fitness-calorie-chart',
  templateUrl: './fitness-calorie-chart.component.html',
  styleUrls: ['./fitness-calorie-chart.component.scss']
})
export class FitnessCalorieChartComponent implements OnInit {

  backFlag: boolean = false;
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;
  public closeResult: string;
  selectedTab = '';
  public addLoading: boolean = false


  public listVitamins: Array<string> = ['Vitamin  A', 'Vitamin B', 'Vitamin C', 'Vitamin D'];

  public listCategoryBase: Array<string> = ['High Calorie Food', 'Low Calorie Food', 'High Protien Food'];

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;


  public CATEGORY_BASED_ARRAY: any = []
  public Category_Form: FormGroup

  public VITAMINS_ARRAY: any = []
  public Vitamins_Form: FormGroup

  public RECOMMENDED_ARRAY: any = []

  public img_url: any = ''
  public uploadImage: any
  public Item_Id: any = '';

  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _route: Router,
    private permissionService: PermissionService,
    private location: Location,
    private NUTRI_CHART_SERVICE: FoliofitMasterNutriChartService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }
    this.getCAT_BASED()
    this.getALL_VITAMINS()
    this.getALL_RECOMENDED()

    this.Category_Form = this.formBuilder.group({
      name: ['', Validators.required]
    })
    this.Vitamins_Form = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }


  getCAT_BASED() {
    this.NUTRI_CHART_SERVICE.getCAT_BASED().subscribe((res: any) => {
      console.log(res);
      this.CATEGORY_BASED_ARRAY = res.data
      console.log(this.CATEGORY_BASED_ARRAY, "cate array");

    })
  }

  getALL_VITAMINS() {
    this.NUTRI_CHART_SERVICE.getALL_VITAMINS().subscribe((res: any) => {
      console.log(res);
      this.VITAMINS_ARRAY = res.data
      console.log(this.VITAMINS_ARRAY, "vitamins array");

    })
  }

  getALL_RECOMENDED() {
    this.NUTRI_CHART_SERVICE.getALL_RECOMENDED().subscribe((res: any) => {
      console.log(res);
      this.RECOMMENDED_ARRAY = res.data
      console.log(this.RECOMMENDED_ARRAY, "recommended");
    })
  }

  delete(id, type) {
    console.log(id, "id for del");
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
        if (type == 'cate') {
          this.NUTRI_CHART_SERVICE.DeleteCAT_BASED(id).subscribe((res: any) => {
            console.log(res);
            this.pop(res)
            this.getCAT_BASED()
          })
        } else if (type == 'vitamins') {
          console.log(type, "del");
          this.NUTRI_CHART_SERVICE.Delete_VITAMINS(id).subscribe((res: any) => {
            console.log(res);
            this.pop(res)
            this.getALL_VITAMINS()
          })
        } else if (type == 'recommended') {
          console.log(type, "recccccccccccccc");
          let bdy =
          {
            "id": id
          }

          this.NUTRI_CHART_SERVICE.Delete_RECOMENDED(bdy).subscribe((res: any) => {
            console.log(res);
            this.pop(res)
            this.getALL_RECOMENDED()
          })

        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }



  Save(type) {
    console.log("inside save");
    if (this.img_url === '') {
      Swal.fire({
        text: 'Please Add Image!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });
    } else if (type == 'cate') {
      console.log(type);
      if (this.Category_Form.invalid) {
        Swal.fire({
          text: 'Please Check Name!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      } else {
        const formData = new FormData()
        this.addLoading = true
        formData.append('title', this.Category_Form.get('name').value)
        formData.append('image', this.uploadImage)
        this.NUTRI_CHART_SERVICE.AddCAT_BASED(formData).subscribe((res: any) => {
          console.log(res);
          this.pop(res)
          this.getCAT_BASED()
        })
      }
    } else if (type == 'vitamins') {
      console.log(type);
      if (this.Vitamins_Form.invalid) {
        Swal.fire({
          text: 'Please Check Name!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      } else {
        const formData = new FormData()
        this.addLoading = true
        formData.append('title', this.Vitamins_Form.get('name').value)
        formData.append('image', this.uploadImage)
        this.NUTRI_CHART_SERVICE.Add_VITAMINS(formData).subscribe((res: any) => {
          console.log(res);
          this.addLoading = false
          this.pop(res)
          this.getALL_VITAMINS()
        })
      }

    }
  }

  Update(type) {
    if (this.img_url === '') {
      Swal.fire({
        text: 'Please Add Image!!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3085d6',
        imageHeight: 500,
      });

    } else if (type == 'cate') {
      if (this.Category_Form.invalid) {
        Swal.fire({
          text: 'Please Check Name!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      }
      else {
        const formData = new FormData()
        this.addLoading = true
        if (this.uploadImage == undefined) {
          formData.append('categoryId', this.Item_Id);
          formData.append('title', this.Category_Form.get('name').value);
        } else {
          formData.append('categoryId', this.Item_Id);
          formData.append('title', this.Category_Form.get('name').value);
          formData.append('image', this.uploadImage);
        }
        this.NUTRI_CHART_SERVICE.EditCAT_BASED(formData).subscribe((res: any) => {
          console.log(res);
          this.addLoading = false
          this.pop(res)
          this.getCAT_BASED()
        })
      }
    } else if (type == 'vitamins') {
      console.log(type);
      if (this.Vitamins_Form.invalid) {
        Swal.fire({
          text: 'Please Check Name!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });

      }
      else {
        const formData = new FormData()
        this.addLoading = true
        if (this.uploadImage == undefined) {
          formData.append('vitaminId', this.Item_Id);
          formData.append('title', this.Vitamins_Form.get('name').value);
        } else {
          formData.append('vitaminId', this.Item_Id);
          formData.append('title', this.Vitamins_Form.get('name').value);
          formData.append('image', this.uploadImage);
        }
        this.NUTRI_CHART_SERVICE.Edit_VITAMINS(formData).subscribe((res: any) => {
          console.log(res);
          this.addLoading = false
          this.pop(res)
          this.getALL_VITAMINS()
        })
      }
    }

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

  tabChangeEvent(event) {
    console.log(event.nextId);
    //localStorage.setItem("TabID",event.nextId);
  }
  BackRedirectTo() {
    this._route.navigate(['/fitness-wellness'])
  }

  open(content, Value: any, i, type) {
    this.addLoading = false
    console.log(Value)
    if (Value === 'add') {
      this.Category_Form.reset()
      this.Vitamins_Form.reset()
      this.Item_Id = null
      this.img_url = ''
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      this.Item_Id = i._id
      this.img_url = i.image
      if (type == 'cate') {
        this.Category_Form.patchValue({
          name: i.title
        })
      } else if (type == 'vitamins') {
        this.Vitamins_Form.patchValue({
          name: i.title
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
  onChangeImage(event: any, width: any, height: any) {
    let setFlag: boolean = false;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);
    Img.onload = (e: any) => {
      if (e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width)) {
        setFlag = true;
        this.uploadImage = file;
        let content = reader.result as string;
        this.img_url = content;
      }
      else {
        setFlag = true;
        Swal.fire({
          text: 'Invalid Image Dimension - ' + width + 'x' + height,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
    }
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
    this.modalService.dismissAll();
    this.uploadImage = undefined;
    this.getCAT_BASED()
    this.getALL_VITAMINS()
    this.getALL_RECOMENDED()
    // this.get_yoga_vid()
    // this.get_Popular_yoga_vid()
  }

}
