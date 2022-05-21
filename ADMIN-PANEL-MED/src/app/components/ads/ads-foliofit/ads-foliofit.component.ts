import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FolioAdsService } from 'src/app/services/folio-ads.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ads-foliofit',
  templateUrl: './ads-foliofit.component.html',
  styleUrls: ['./ads-foliofit.component.scss']
})
export class AdsFoliofitComponent implements OnInit {

  public _api = environment.apiUrl;
  public closeResult: string;
  public value_array = [];
  public product_array: any = [];
  public colorValue: any;
  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;
  public product_type: any;
  public prod_cat_type_list: any;
  public uploadImage: any;
  public image_URL: any;
  public catName: any;
  public linkFlag: boolean = false;

  public listCategory: Array<{ text: string; value: number }> = [
    { text: "Category 1", value: 1 },
    { text: "Category 2", value: 2 },
    { text: "Category 3", value: 3 },
    { text: "Category 4", value: 4 },
  ];

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;
  public _Id: any;
  public _type: any;
  public attemptedSubmit: any;
  // public loading: boolean = false;
  public addLoading: boolean = false;

  //Containers
  public Slider1List: any = [];
  public Slider2List: any = [];
  public Slider3List: any = [];
  public Ad1List: any = [];
  public FitClubBannerList: any = [];
  public YogaBannerList: any = [];
  public YogaSliderList: any = [];
  public FitClubSliderList: any = [];
  public productList: any = [];
  public categoryList: any = [];
  public FCBannerDetails: any = [];
  public YogaBannerDetails: any = [];
  public mainCategoryList :any = [];
  public foliofitCategoryList :any = [];
  public yogaCategoryList :any = [];
  public nutriChartCategoryList :any = [];
  public nutriChartList :any = [];


  //FORM Variables
  public slider1Form: FormGroup;
  public slider2Form: FormGroup;
  public slider3Form: FormGroup;
  public ad1Form: FormGroup;
  public fitnessBannerForm: FormGroup;
  public fitnessSliderForm: FormGroup;
  public yogaBannerForm: FormGroup;
  public yogaSliderForm: FormGroup;
  public nutriChartForm:FormGroup;

  constructor(private modalService: NgbModal,
    private _route: Router,
    private intl: IntlService,
    private permissionService: PermissionService,
    private location: Location, private formBuilder: FormBuilder,
    private _foliofitService: FolioAdsService) { this.initForms(); }

  ngOnInit(): void {
    this.getSlider1Details();
    this.getSlider2Details();
    this.getSlider3Details();

    this.getMainCategoryDetails();

    this.getProductDetails();
    this.getCategoryDetails();
    this.getFoliofitCategories();
    this.getYogaCategories();
    this.getNutriChartCategories();

    this.get_Ad1_Fb_Yb_Details('ad1');
    // this.get_Ad1_Fb_Yb_Details('fitness_banner');
    // this.get_Ad1_Fb_Yb_Details('yoga_banner');
    this.getFCBannerDetails();

    this.get_FC_slider_Details();
    this.get_yoga_slider_Details();
    this.getFCBannerDetails();
    this.getYogaBannerDetails();
    this.get_Nutri_chart_Banner_details();

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
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

  initForms() {
    this.slider1Form = this.formBuilder.group({
      type: ['', Validators.required],
      redirectTo: ['',  Validators.required],
      image: [''],
      linkValue: ['']
    });

    this.slider2Form = this.formBuilder.group({
      type: ['', Validators.required],
      productType: ['', Validators.required],
      image: [''],
    });

    this.slider3Form = this.formBuilder.group({
      product: ['', Validators.required],
      image: [''],
    });

    this.ad1Form = this.formBuilder.group({
      type: ['',Validators.required],
      productType: ['',Validators.required],
      image: [''],
    });

    this.fitnessBannerForm = this.formBuilder.group({
      category: ['', Validators.required],
      image: [''],
    });

    this.fitnessSliderForm = this.formBuilder.group({
      type: ['', Validators.required],
      productType: ['', Validators.required],
      image: [''],
    });

    this.yogaBannerForm = this.formBuilder.group({
      category: ['', Validators.required],
      image: [''],
    });

    this.yogaSliderForm = this.formBuilder.group({
      type: ['', Validators.required],
      productType: ['', Validators.required],
      image: [''],
    });

    this.nutriChartForm = this.formBuilder.group({
      category: ['', Validators.required],
      image: [''],
    });
  }

  get af() {
    return this.slider1Form.controls;
  }

  get bf() {
    return this.slider2Form.controls;
  }

  get cf() {
    return this.slider3Form.controls;
  }

  get fitnessslider() {
    return this.fitnessSliderForm.controls;
  }

  get yogaslider() {
    return this.yogaSliderForm.controls;
  }

  get ad1form() {
    return this.ad1Form.controls;
  }

  get yogabanner() {
    return this.yogaBannerForm.controls;
  }

  open(content, Value: any, item: any, type: any) {
    this.image_URL = '';
    this.slider1Form.reset()
    this.linkFlag = false;
    this.attemptedSubmit = false
    this.addLoading = false
    if (Value === 'add') {
      this.slider1Form.reset()
      this.slider2Form.reset()
      this.slider3Form.reset();
      this.ad1Form.reset();
      this.fitnessBannerForm.reset();
      this.fitnessSliderForm.reset();
      this.yogaBannerForm.reset();
      this.yogaSliderForm.reset();

      this.value_array = []
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      this._Id = item._id
      this._type = type;
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });

      if (item.image) {
        this.image_URL = item.image
      }

      if (type === 'ad1') {
        this._foliofitService.Get_Ad_By_Id(item._id).subscribe((res: any) => {

          this.image_URL = res.data[0].image;
          if (item.type == 0) {
            this.product_array = this.productList;
            this.ad1Form.setValue({
              'type': res.data[0].type,
              'productType': res.data[0].typeId,
              'image':  res.data[0].image,
            })
          }
          else{
            this.product_array = this.categoryList;
            this.ad1Form.setValue({
              'type': res.data[0].type,
              'productType': res.data[0].typeId,
              'image':  res.data[0].image,
            })
          }

        })
      }

      else if (type === 'maincategory') {
        this._foliofitService.get_single_main_category_details(item._id).subscribe((res: any) => {
          this.image_URL = res.data.image;
          this._Id = res.data._id
        

        })
      }

      
      else if (type === 'fitness_banner') {

        this._foliofitService.Get_single_FC_Banner_Details(item._id).subscribe((res: any) => {
          this.image_URL = res.data.image; 
          this._Id = res.data._id;
          this.foliofitCategoryList = this.foliofitCategoryList;
          this.fitnessBannerForm.setValue({
            'category': res.data.categoryId,
            'image': this.image_URL,
          })
        })
      }


      else if (type === 'fitness_club_slider') {

        this._foliofitService.get_single_FC_Slider_Details(item._id).subscribe((res: any) => {
          this.image_URL = res.data[0].image; 
          this._Id = res.data[0]._id;
          if (item.type == 0) {
            this.product_array = this.productList;
            this.fitnessSliderForm.setValue({
                'type': res.data[0].type,
                'productType': res.data[0].typeId,
                'image':  res.data[0].image,
            })
          }
          else{
            this.product_array = this.categoryList;
            this.fitnessSliderForm.setValue({
              'type': res.data[0].type,
              'productType': res.data[0].typeId,
              'image':  res.data[0].image,
          })
          }
        })
      }

      else if (type === 'yoga_banner') {

        this._foliofitService.Get_Yoga_Banner_By_Id(item._id).subscribe((res: any) => {
          this.image_URL = res.data.image; 
          this.foliofitCategoryList = this.foliofitCategoryList;
          this.yogaBannerForm.setValue({
            'category': res.data.categoryId,
            'image': this.image_URL,
          })
        })
      }

     

      else if (type === 'yoga_slider') {

        this._foliofitService.get_single_Yoga_Slider_Details(item._id).subscribe((res: any) => {
          this.image_URL = res.data[0].image; 
          this._Id = res.data[0]._id;
          if (res.data[0].type == 0) {
            this.product_array = this.productList;
            this.yogaSliderForm.setValue({
                'type': res.data[0].type,
                'productType': res.data[0].typeId,
                'image':  res.data[0].image,
            })
          }
          else{
            this.product_array = this.categoryList;
            this.yogaSliderForm.setValue({
              'type': res.data[0].type,
              'productType': res.data[0].typeId,
              'image':  res.data[0].image,
          })
          }
        })
      }

      else if (type === 'nutri_chart') {

        this._foliofitService.Get_Nutri_Chart_Banner_By_Id(item._id).subscribe((res: any) => {
          this.image_URL = res.data.image; 
          this.foliofitCategoryList = this.foliofitCategoryList;
          this.nutriChartForm.setValue({
            'category': res.data.categoryId,
            'image': this.image_URL,
          })
        })
      }


      else if (type === 'slider1') {

        this._foliofitService.get_single_slider1_details(item._id).subscribe((res:any)=>{
          this._Id = res.data._id;
          this.image_URL = res.data.image;

          this._type = type;
          if (item.type == 'External') {
            this.linkFlag = true;
            this.slider1Form.patchValue({
              type: res.data.type,
              linkValue:  res.data.redirectTo,
            })
          } else {
            this.linkFlag = false;
            this.value_array = ['Fitness Club', 'Yoga', 'Diet Regime', 'Health Reminders', 'Nutri chart', 'BMI'];
            this.slider1Form.patchValue({
              type: res.data.type,
              redirectTo: res.data.redirectTo,
            })
          }


        })
      
      }

      else if (type === 'slider2') {

        this._foliofitService.get_single_slider2_details(item._id).subscribe((res:any)=>{
          this._Id = res.data[0]._id;
          this.image_URL = res.data[0].image;

          this._type = type;
          if (item.type == 0) {
            this.product_array = this.productList;
            this.slider2Form.patchValue({
              type: res.data[0].type,
              productType:  res.data[0].typeId,
            })
          } else {
            this.product_array = this.categoryList;
            this.slider2Form.patchValue({
              type: res.data[0].type,
              productType: res.data[0].typeId,
            })
          }


        })
      
      }

      else if (type === 'slider3') {

        this._foliofitService.get_single_slider3_details(item._id).subscribe((res:any)=>{
          this._Id = res.data[0]._id;
          this.image_URL = res.data[0].image;

          this.slider3Form.patchValue({
            image: res.data[0].image,
            product:  res.data[0].productId,
          })


        })
      
      }



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

  // Filter(value) {
  //   if (this.AddrssUpdateForm.get('type').value == '0') {
  //     if (value.length >= 1) {
  //       this.newdrop_list_array = this.drop1_cat_array.filter(
  //         (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
  //       );
  //     } else {
  //       this.getDropDown1_Cat();
  //       this.newdrop_list_array = this.drop1_cat_array;
  //     }
  //   }

  //   else {
  //     if (value.length >= 1) {
  //       this.newdrop_list_array = this.drop1_pdt_array.filter(
  //         (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
  //       );
  //     } else {
  //       this.getDropDown1_pdt();
  //       this.newdrop_list_array = this.drop1_pdt_array
  //     }
  //   }

  //   // this.newdrop_list_array = this.newdrop_list_array.filter((item) => {
  //   //   if(item.title == value) {
  //   //     console.log(item.title);
  //   //     // return item.title == value
  //   //   }

  //   // })
  //   // console.log(value);

  // }

  dropDownChange(value: any) {
    if (value === 'medimall') {
      this.value_array = ['Product', 'Category'];
    }
    else if (value === 'Foliofit') {
      this.linkFlag = false;
      this.value_array = ['Fitness Club', 'Yoga', 'Diet Regime', 'Health Reminders', 'Nutri chart', 'BMI'];
      this.product_array = [];
      this.slider1Form.controls['linkValue'].clearValidators();
      this.slider1Form.controls['linkValue'].updateValueAndValidity();
    }
    else if (value === 'medfeed') {
      this.value_array = ['Med Articles', 'Medquiz', 'Expert Advice', 'Health Tips', 'Live Updates', 'Home'];
      this.product_array = [];
      this.slider1Form.controls['linkValue'].clearValidators();
    }
    else if (value === 'External') {
      this.product_array = [];
      this.linkFlag = true;
      this.slider1Form.controls['linkValue'].reset();
      this.slider1Form.controls['linkValue'].setValidators(Validators.required);
      this.slider1Form.controls['linkValue'].updateValueAndValidity();
      this.slider1Form.controls['redirectTo'].clearValidators();
      this.slider1Form.controls['redirectTo'].updateValueAndValidity();
    }
  }

  dropDownProductChange(value: any) {
    if (value === '0') {
      /*  this.product_array = ['a','b','c']; */
      this.product_array = this.productList;
      this.slider2Form.get('productType').reset();
      this.ad1Form.get('productType').reset();
      this.fitnessSliderForm.get('productType').reset();
      this.yogaSliderForm.get('productType').reset();
    }
    else if (value === '1') {
      this.product_array = this.categoryList;
      this.slider2Form.get('productType').reset();
      this.ad1Form.get('productType').reset();
      this.fitnessSliderForm.get('productType').reset();
      this.yogaSliderForm.get('productType').reset();
    }
  }

  changeColorPickerValue(value) {
    this.colorValue = value;
  }

  onChange(event: any, width: any, height: any) {
    let setFlag: boolean = false;
    const reader = new FileReader();
    const file = event.target.files[0];


    reader.readAsDataURL(file);
    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      // console.log(e.path[0].naturalHeight);
      // console.log(e.path[0].naturalWidth);
      if (e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width)) {
        setFlag = true;
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;

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


  getMainCategoryDetails(){
    this._foliofitService.get_main_category_details().subscribe((res: any) => {
      this.mainCategoryList = res.data;
    })
  }


  getFoliofitCategories(){
    this._foliofitService.get_foliofit_categories().subscribe((res:any)=>{
      this.foliofitCategoryList = res.data;
    })
  }

  getYogaCategories(){
    this._foliofitService.get_yoga_categories().subscribe((res:any)=>{
      this.yogaCategoryList = res.data;
    })
  }

  getNutriChartCategories(){
    this._foliofitService.get_nutri_Chart_categories().subscribe((res:any)=>{
      this.nutriChartCategoryList = res.data;
    })
  }


  getSlider1Details() {

    this._foliofitService.get_slider1_details().subscribe((res: any) => {
      // console.log(res.data,"res dat");

      this.Slider1List = res.data;
    })

  }

  
  getSlider2Details() {
    this._foliofitService.get_slider2_details().subscribe((res: any) => {
      this.Slider2List = res.data;
    })
  }

  getSlider3Details() {
    this._foliofitService.get_slider3_details().subscribe((res: any) => {
      this.Slider3List = res.data; 
    })
  }

  get_Ad1_Fb_Yb_Details(type) {
    if (type === 'ad1') {
      this._foliofitService.get_Ad1_fb_yb_details(type).subscribe((res: any) => {
        this.Ad1List = res.data;
      })
    }
  }

  getFCBannerDetails() {
    this._foliofitService.Get_FC_Banner_Details().subscribe((res: any) => {
      this.FitClubBannerList = res.data;
    })
  }

  getYogaBannerDetails() {
    this._foliofitService.Get_Yoga_Banner_Details().subscribe((res: any) => {
      this.YogaBannerList = res.data;
    })
  }

  get_FC_slider_Details() {
    this._foliofitService.get_FC_Slider_Details().subscribe((res: any) => {
      this.FitClubSliderList = res.data;

    });
  }
  get_yoga_slider_Details() {
    this._foliofitService.get_Yoga_Slider_Details().subscribe((res: any) => {
      this.YogaSliderList = res.data;
    });
  }

  get_Nutri_chart_Banner_details(){
    this._foliofitService.Get_Nutri_Chart_Banner_Details().subscribe((res: any) => {
      this.nutriChartList = res.data;
    });
  }
  getProductDetails() {

      this._foliofitService.Get_Product_Details().subscribe((res: any) => {
        this.productList = res.data; 
      });
  }

  getCategoryDetails(){
    this._foliofitService.Get_Category_Details().subscribe((res: any) => {
      this.categoryList = res.data; 
    });
  }

  save(type) {
    this.attemptedSubmit = true;
    if (type === 'slider1') {
      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
      if (this.slider1Form.valid) {
        const formData = new FormData();
        this.addLoading = true;
        if (this.af.type.value == "External") {
          formData.append('redirectTo', this.af.linkValue.value); 
        } else {
          formData.append('redirectTo', this.af.redirectTo.value); 
        }
        formData.append('type', this.af.type.value); 
        formData.append('image', this.uploadImage); 

        this._foliofitService.Post_Slider1_Details(formData).subscribe((res: any) => {
          if (res.status === true) {
            Swal.fire({
              text: res.data,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.attemptedSubmit = false;
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getSlider1Details()
            this.uploadImage = undefined;
          }
          else {
            this.addLoading = false;
            Swal.fire({
              text: 'Invalid!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.slider1Form.reset();
            this.image_URL = '';
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
          }

        })
      }
    }
    else if (type === 'slider2') {
      this.attemptedSubmit = true;
      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
      if (this.slider2Form.invalid) {
        return;
      }
        const formData = new FormData();
        this.addLoading = true;
        formData.append('type', this.bf.type.value); 
        formData.append('typeId', this.bf.productType.value); 
        formData.append('image', this.uploadImage); 
        this._foliofitService.Post_Slider2_Details(formData).subscribe((res: any) => {
          if (res.status) {
            Swal.fire({
              text: res.data,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.attemptedSubmit = false;
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getSlider2Details()
            this.uploadImage = undefined;
          }
        })
    }


    else if (type === 'slider3') {
      this.attemptedSubmit = true;
      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
      if (this.slider3Form.invalid) {
        return;
      }
        const formData = new FormData();
        this.addLoading = true;
        formData.append('productId', this.cf.product.value); 
        formData.append('image', this.uploadImage); 
        this._foliofitService.Post_Slider3_Details(formData).subscribe((res: any) => {
          if (res.status) {
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.attemptedSubmit = false;
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getSlider3Details()
            this.uploadImage = undefined;
          }
        })
    }




    else if (type === 'fitness_club_slider') {

      this.attemptedSubmit = true;
      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
      if (this.fitnessSliderForm.invalid) {
        return;
      }
      const formData = new FormData();
      this.addLoading = true;
      formData.append('type', this.fitnessslider.type.value);
      formData.append('typeId', this.fitnessslider.productType.value); 
      formData.append('image', this.uploadImage);
      this._foliofitService.Post_FC_Slider_Details(formData).subscribe((res: any) => {
        if (res.status) {
          Swal.fire({
            text: 'Successfully Added',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.attemptedSubmit = false;
          this.modalService.dismissAll();
          this.get_FC_slider_Details()
          this.uploadImage = undefined;
        }
      })
    }

    else if (type === 'yoga_slider') {
      this.attemptedSubmit = true;

      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }

      if (this.yogaSliderForm.invalid ) {
        return;
      }
      const formData = new FormData();
      this.addLoading = true;
      formData.append('type', this.yogaslider.type.value); 
      formData.append('typeId', this.yogaslider.productType.value); 
      formData.append('image', this.uploadImage); 
      this._foliofitService.Post_Yoga_Slider_Details(formData).subscribe((res: any) => {
         if (res.status) {
          Swal.fire({
            text: 'Successfully Added',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.attemptedSubmit = false;
          this.modalService.dismissAll();
          this.get_yoga_slider_Details()
          this.uploadImage = undefined;
        }
      })
    }
  }

  delete(type, id: any) {

    if (type === 'Slider1Content') {
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
          this._foliofitService.Delete_Slider1(id).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.getSlider1Details();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
    

    if (type === 'Slider2Content') {
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
          this._foliofitService.Delete_Slider2(id).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.getSlider2Details();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }

    if (type === 'Slider3Content') {
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
          this._foliofitService.Delete_Slider3(id).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.getSlider3Details();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }

    else if (type === 'fitness_club_slider') {
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
          this._foliofitService.Delete_FC_Slider_Details(id).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.get_FC_slider_Details();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }


    else if (type === 'yoga_slider') {
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
          this._foliofitService.delete_Yoga_Slider_By_Id(id).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.get_yoga_slider_Details();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }



  }

  edit(type: any) {

    if (type === 'slider1') {


      this.attemptedSubmit = true;
      if(this.slider1Form.invalid){
        return;
      }

      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      } 
      
      else {
        const formData = new FormData();
        this.addLoading = true;
        if (this.uploadImage === undefined) {
          formData.append('redirectTo',this.af.type.value === 'Foliofit' ? this.af.redirectTo.value : this.af.linkValue.value); 
          formData.append('type', this.af.type.value);
          formData.append('sliderId', this._Id);

        } else {
          formData.append('type', this.af.type.value); 
          formData.append('redirectTo', this.af.type.value === 'Foliofit' ? this.af.redirectTo.value : this.af.linkValue.value); 
          formData.append('image', this.uploadImage); 
          formData.append('sliderId', this._Id);
        }
       
        
        this._foliofitService.update_slider1_details(formData).subscribe((res: any) => {
          if (res.status) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getSlider1Details()
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
          }
          
          else  {
            this.addLoading = false;
            Swal.fire({
              text: 'Invalid!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
          }
        })
      }
    }


    else if (type === 'slider2') {


      this.attemptedSubmit = true;
      if(this.slider2Form.invalid){
        return;
      }

      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      } 
      
      else {
        const formData = new FormData();
        this.addLoading = true;
        if (this.uploadImage === undefined) {
          formData.append('type',this.bf.type.value === 0 ? '0' : '1');
          formData.append('typeId',this.bf.productType.value);
          formData.append('sliderId',this._Id);

        } else {
          formData.append('type',this.bf.type.value); 
          formData.append('image',this.uploadImage); 
          formData.append('typeId',this.bf.productType.value);
          formData.append('sliderId',this._Id);
        }
       
        
        this._foliofitService.update_slider2_details(formData).subscribe((res: any) => {
          if (res.status) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getSlider2Details()
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
          }
          
          else  {
            this.addLoading = false;
            Swal.fire({
              text: 'Invalid!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
          }
        })
      }
    }


    else if (type === 'slider3') {


      this.attemptedSubmit = true;
      if(this.slider3Form.invalid){
        return;
      }

      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      } 
      
      else {
        const formData = new FormData();
        this.addLoading = true;
        if (this.uploadImage === undefined) {
          formData.append('productId',this.cf.product.value);
          formData.append('sliderId',this._Id);

        } else {
          formData.append('image',this.uploadImage); 
          formData.append('productId',this.cf.product.value);
          formData.append('sliderId',this._Id);
        }
       
        
        this._foliofitService.update_slider3_details(formData).subscribe((res: any) => {
          if (res.status) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getSlider3Details()
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
          }
          
          else  {
            this.addLoading = false;
            Swal.fire({
              text: 'Invalid!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
          }
        })
      }
    }

    else if (type === 'maincategory') {
      this.attemptedSubmit = true;
      if (this.image_URL != '') {
        //  this.loading = true;
        const formData = new FormData();
        this.addLoading = true;
        formData.append('image', this.uploadImage);
        formData.append('sliderId', this._Id);

        this._foliofitService.update_main_category_details(formData).subscribe((res: any) => {
          if (res.status) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getMainCategoryDetails()
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
          }
          else{
            this.addLoading = false;
            Swal.fire({
              text: 'Oops!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
          }
        })
      }
      else{
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
    }


    else if (type === 'ad1') {
      this.attemptedSubmit = true;
      if (this.ad1Form.valid) {
        //  this.loading = true;
        const formData = new FormData();
        this.addLoading = true;

        if(this.uploadImage != undefined){
          formData.append('type', this.ad1form.type.value); 
          formData.append('typeId', this.ad1form.productType.value); 
          formData.append('image', this.uploadImage); 
          formData.append('sliderId', this._Id);
        }
        else{
          formData.append('type', this.ad1form.type.value); 
          formData.append('typeId', this.ad1form.productType.value); 
          formData.append('sliderId', this._Id);
        }
        this._foliofitService.Edit_Ad(formData).subscribe((res: any) => {
          if (res.status) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.get_Ad1_Fb_Yb_Details('ad1');
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
          }
        })
      }
    }

    else if (type === 'fitness_banner') {
      this.attemptedSubmit = true;

      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
      if (this.fitnessBannerForm.valid) {
        //  this.loading = true;
        const formData = new FormData();
        this.addLoading = true;
        if(this.uploadImage != undefined){
          formData.append('categoryId', this.fitnessBannerForm.get('category').value); 
          formData.append('image', this.uploadImage);
          formData.append('bannerId', this._Id);
        }
        else{
          formData.append('categoryId', this.fitnessBannerForm.get('category').value); 
          formData.append('bannerId', this._Id);
        }
        this._foliofitService.Update_FC_Banner_Details(formData).subscribe((res: any) => {
          if (res.status) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getFCBannerDetails();
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
          }
        })
      }

    }


    else if (type === 'fitness_club_slider') {

      this.attemptedSubmit = true;
      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
      if (this.fitnessSliderForm.invalid) {
        return;
      }
      const formData = new FormData();
      this.addLoading = true;
      if(this.uploadImage != undefined){
        formData.append('type', this.fitnessslider.type.value);
        formData.append('typeId', this.fitnessslider.productType.value); 
        formData.append('image', this.uploadImage);
        formData.append('sliderId', this._Id);
      }
      else{
        formData.append('type', this.fitnessslider.type.value);
        formData.append('typeId', this.fitnessslider.productType.value); 
        formData.append('sliderId', this._Id);
      }
      this._foliofitService.Update_FC_Slider_Details(formData).subscribe((res: any) => {
        if (res.status) {
          Swal.fire({
            text: 'Successfully Updated',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.modalService.dismissAll();
          this.get_FC_slider_Details()
          this.uploadImage = undefined;
        }
      })
    }


    else if (type === 'yoga_banner') {

      this.attemptedSubmit = true;

      if (this.yogaBannerForm.valid) {
        //  this.loading = true;
        const formData = new FormData();
        this.addLoading = true;
        if(this.uploadImage != undefined){
          formData.append('categoryId', this.yogaBannerForm.get('category').value); 
          formData.append('image', this.uploadImage);
          formData.append('bannerId', this._Id);
        }
        else{
          formData.append('categoryId', this.yogaBannerForm.get('category').value); 
          formData.append('bannerId', this._Id);
        }
        this._foliofitService.Update_Yoga_Banner_By(formData).subscribe((res: any) => {
          console.log(res)
          if (res.status) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getYogaBannerDetails();
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
          }
          else{
            this.addLoading = false;
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
            Swal.fire({
              text: 'Opps!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
          }
        })
      }

    }


    else if (type === 'yoga_slider') {
      this.attemptedSubmit = true;
      if (this.image_URL === '') {
        Swal.fire({
          text: 'Please Add Image!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3085d6',
          imageHeight: 500,
        });
      }
      if (this.yogaSliderForm.invalid) {
        return;
      }
          const formData = new FormData();
          this.addLoading = true;
          if(this.uploadImage != undefined){
            formData.append('type', this.yogaSliderForm.get('type').value); 
            formData.append('typeId', this.yogaSliderForm.get('productType').value); 
            formData.append('image', this.uploadImage);
            formData.append('sliderId', this._Id);
          }
          else{
            formData.append('type', this.yogaSliderForm.get('type').value);
            formData.append('typeId', this.yogaSliderForm.get('productType').value); 
            formData.append('sliderId', this._Id);
          }
          this._foliofitService.Update_Yoga_Slider_By_Id(formData).subscribe((res: any) => {
            if (res.status) {
              Swal.fire({
                text: 'Successfully Updated',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 500,
              });
              this.addLoading = false;
              this.modalService.dismissAll();
              this.get_yoga_slider_Details()
              this.uploadImage = undefined;
            }
          })

    }


    else if (type === 'nutri_chart') {

      this.attemptedSubmit = true;

      if (this.nutriChartForm.valid) {
        //  this.loading = true;
        const formData = new FormData();
        this.addLoading = true;
        if(this.uploadImage != undefined){
          formData.append('categoryId', this.nutriChartForm.get('category').value); 
          formData.append('image', this.uploadImage);
          formData.append('bannerId', this._Id);
        }
        else{
          formData.append('categoryId', this.nutriChartForm.get('category').value); 
          formData.append('bannerId', this._Id);
        }
        this._foliofitService.Update_Nutri_Chart_Banner_By_Id(formData).subscribe((res: any) => {
          if (res.status) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.get_Nutri_chart_Banner_details();
            this.uploadImage = undefined;
            this.attemptedSubmit = false;
          }
        })
      }

    }


    
  }

  close(){
    this.modalService.dismissAll();
    this.addLoading = true;
    this.attemptedSubmit = false;
    this.slider1Form.reset();
    this.slider2Form.reset();
    this.slider3Form.reset();
    this.yogaSliderForm.reset();
    this.yogaBannerForm.reset();
    this.fitnessSliderForm.reset();
    this.fitnessBannerForm.reset();
  }

  handleFilterCategory(value){
    let list :any = [];
    if(this.slider2Form.get('type').value === '0'){
      if (value.length >= 1) {
        list = this.productList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = list;
      } 
      else  if (value.length >= 3) {
        list = this.productList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = list;
      } 
      else if(value === ''){
        this.getProductDetails();
        this.product_array = this.productList;
      }
      
      else {
        this.getProductDetails();
        this.product_array = this.productList;
      }
    }

    else{
      if (value.length >= 1) {
       list = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = list;
      } 
      else  if (value.length >= 3) {
        list = this.categoryList.filter(
           (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
         );
         this.product_array = list;
       } 
      else if(value === ''){
        this.getCategoryDetails();
        this.product_array = this.categoryList;
      }
      
      else {
        this.getCategoryDetails();
        this.product_array = this.categoryList;
      }
    }
  }

  handleFilterYogaSliderCategory(value){
    if(this.yogaSliderForm.get('type').value === '0'){
      if (value.length >= 1) {
        this.product_array = this.productList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } 
      else   if (value.length >= 3) {
        this.product_array = this.productList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } 

      else if(value ===''){
        this.getProductDetails();
        this.product_array = this.productList;
      }
      
      else {
        this.getProductDetails();
        this.product_array = this.productList;
      }

    }

    else{
      if (value.length >= 1) {
        this.product_array = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } 
      else if (value.length >= 3) {
        this.product_array = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } 


      else if(value === ''){
        this.getCategoryDetails();
        this.product_array = this.categoryList;
      }
      
      else {
        this.getCategoryDetails();
        this.product_array = this.categoryList;
      }
    }
  }

  handleFilterFitnessSliderCategory(value){
    if(this.fitnessSliderForm.get('type').value === '0'){
      if (value.length >= 1) {
        this.product_array = this.productList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } 
      else if (value.length >= 3) {
        this.product_array = this.productList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } 
      else if(value === ''){
        this.getProductDetails();
        this.product_array = this.productList;
      }
      
      else {
        this.getProductDetails();
        this.product_array = this.productList;
      }
      
    }

    else{
      if (value.length >= 1) {
        this.product_array = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } 
      else  if (value.length >= 3) {
        this.product_array = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } 


      else if(value === ''){
        this.getCategoryDetails();
        this.product_array = this.categoryList;
      }
      
      else {
        this.getCategoryDetails();
        this.product_array = this.categoryList;
      }
    }
  }


  handleFilterProduct(value){
    let list :any =[]
    if (value.length >= 1) {
      list= this.productList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.productList = list;
    } 
    else   if (value.length >= 3) {
      list= this.productList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.productList = list;
    } 
    else if(value === ''){
      this.getProductDetails();
      this.productList = this.productList;
    }
    else {
      this.getProductDetails();
      this.productList = this.productList;
    }
  }


  handleFilterCategoryList(value){
    let list :any =[]
    if (value.length >= 1) {
      list = this.categoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.categoryList = list;
    } 
    else if (value.length >= 3) {
      list = this.categoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.categoryList = list;
    } 
    else if(value === ''){
      this.getCategoryDetails();
      this.categoryList = this.categoryList;
    }
    else {
        this.getCategoryDetails();
      this.categoryList = this.categoryList;
    }
  }

  handleFilterFoliofitCategoryList(value){
    let list :any =[]
    if (value.length >= 1) {
      list = this.foliofitCategoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.foliofitCategoryList = list;
    }
    else if (value.length >= 3) {
      list = this.foliofitCategoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.foliofitCategoryList = list;
    }
    else if(value === ''){
      this.getFoliofitCategories();
      this.foliofitCategoryList = this.foliofitCategoryList;
    }
    else {
      this.getFoliofitCategories();
      this.foliofitCategoryList = this.foliofitCategoryList;
    }
  }


  
  handleFilterYogaCategoryList(value){
    let list :any =[]
    if (value.length >= 1) {
      list = this.yogaCategoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogaCategoryList = list;
    }
    else if (value.length >= 3) {
      list = this.yogaCategoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogaCategoryList = list;
    }
    else if(value === ''){
      this.getYogaCategories();
      this.yogaCategoryList = this.yogaCategoryList;
    }
    else {
      this.getYogaCategories();
      this.yogaCategoryList = this.yogaCategoryList;
    }
  }

  handleFilterNutriChartCategoryList(value){
    let list :any =[]
    if (value.length >= 1) {
      list = this.nutriChartCategoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.nutriChartCategoryList = list;
    }
    else  if (value.length >= 3) {
      list = this.nutriChartCategoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.nutriChartCategoryList = list;
    }
    else if(value === ''){
      this.getNutriChartCategories();
      this.nutriChartCategoryList = this.nutriChartCategoryList;
    }
    else {
      this.getNutriChartCategories();
      this.nutriChartCategoryList = this.nutriChartCategoryList;
    }
  }





}
