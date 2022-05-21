import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdsMedimallService } from 'src/app/services/ads-medimall.service';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Component({
  selector: 'app-ads-medimall',
  templateUrl: './ads-medimall.component.html',
  styleUrls: ['./ads-medimall.component.scss']
})
export class AdsMedimallComponent implements OnInit {

  public closeResult: string;
  public value_array = [];
  public product_array = [];
  public colorValue: any;

  add_Modal_Flag: boolean = false;
  update_Modal_Flag: boolean = false;


  selectedTab: any = "slider1";
  selectedTabTitle: any = "Slider1";

  canAdd: boolean = false;
  editMode: boolean = false;
  editData: any = null;

  public form: FormGroup;

  image: any = null;
  imagePreview: any = null;

  imageValidationWidth: number = 0;
  imageValidationHeight: number = 0;
  loading: boolean = false;

  saving: boolean = false;
  updating: boolean = false;
  deleting: boolean = false;

  multiSelectData: Array<{ title: string; _id: string }>;
  allProductsOrCategories: any = [];

  additionalData:any;

  types: any = [
    { _id: "0", name: "Product" },
    { _id: "1", name: "Category" }
  ];
  selectedTypeId = '';

  items: any = [];
  selectedItem: any = null;

  products: any = [];
  productsToSelectBox: any = [];
  categories: any = [];

  //NEW VARIABLES

  public permissions: any = [];
  public user: any = [];
  public currentPrivilages: any = [];
  public aciveTagFlag: boolean = true;
  public editFlag: boolean;
  public deleteFlag: boolean;
  public viewFlag: boolean;


  constructor(private modalService: NgbModal,
    private _route: Router,
    private intl: IntlService,
    private permissionService: PermissionService,
    private location: Location,
    private formBuilder: FormBuilder,
    private adsMedimallService: AdsMedimallService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.onTabChange('slider1');
    this.user = JSON.parse(sessionStorage.getItem('userData'));
    if (this.user != '') {
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }
  }

  reloadTab() {
    this.items = [];
    this.loading = true;
    this.onTabChange(this.selectedTab);
  }

  onTabChange(nextId) {
    this.selectedTab = nextId;
    // console.log("Event",event);
    console.log("selected Tab Id", this.selectedTab);

    switch (this.selectedTab) {
      case "slider1":
        this.resetForm();
        this.selectedTabTitle = "Slider";
        this.updateImageValidationValues(1504, 674);
        this.loadSliders(this.selectedTab);
        break;

      case "top3icons":
        this.resetForm();
        this.selectedTabTitle = "Top 3 Icon";
        this.updateImageValidationValues(558, 230);
        this.loadImageOnlyAds(this.selectedTab)

        break;

      case "mainCategory":
        this.resetForm();
        this.selectedTabTitle = "Main Category";
        this.updateImageValidationValues(1196, 1044);
        this.loadMainCategories();

        break;

      case "topCategories":
        this.resetForm();
        this.selectedTabTitle = "Top Category";
        this.updateImageValidationValues(1228, 1228);
        this.loadAllCategories();
        this.loadTopCategories();

        break;

      case "slider2":
        this.resetForm();
        this.selectedTabTitle = "Slider 2";
        this.updateImageValidationValues(628, 232);
        this.loadSliders(this.selectedTab);

        break;

      case "slider3":
        this.resetForm();
        this.selectedTabTitle = "Slider 3";
        this.updateImageValidationValues(1082, 1082);
        this.loadSliders(this.selectedTab);

        break;

      case "slider4":
        this.resetForm();
        this.selectedTabTitle = "Slider 4";
        this.updateImageValidationValues(290, 147);
        this.loadSliders(this.selectedTab);

        break;

      case "topdeals":
        this.resetForm();
        this.selectedTabTitle = "Top Deals";
        this.updateImageValidationValues(0, 0);
        this.loadSliders(this.selectedTab);

        break;

      case "slider5":
        this.resetForm();
        this.selectedTabTitle = "Slider 5";
        this.updateImageValidationValues(670, 280);
        this.loadSliders(this.selectedTab);

        break;

      case "slider6":
        this.resetForm();
        this.selectedTabTitle = "Slider 6";
        this.updateImageValidationValues(2548, 1108);
        this.loadSliders(this.selectedTab);

        break;

      case "grooming":
        this.resetForm();
        this.selectedTabTitle = "Grooming & Essentials";
        this.getGrooming();
        this.loadAllCategories();
        this.loadAllProducts();

        break;

      case "slider7":
        this.resetForm();
        this.selectedTabTitle = "Slider 7";
        this.updateImageValidationValues(2548, 1108);
        this.loadSliders(this.selectedTab);

        break;

      case "6categories":
        this.resetForm();
        this.selectedTabTitle = "6 Categories";
        this.updateImageValidationValues(302, 340);
        this.loadImageOnlyAds(this.selectedTab)

        break;

      case "healthcare":
        this.resetForm();
        this.selectedTabTitle = "Health Care Banners";
        this.updateImageValidationValues(786, 330);
        this.loadImageOnlyAds(this.selectedTab)

        break;

      case "wishlist":
        this.resetForm();
        this.selectedTabTitle = "Whish List";
        this.updateImageValidationValues(1508, 630);
        this.loadWhishListAndRecentlyUploads(this.selectedTab);

        break;

      case "recentlyviewed":
        this.resetForm();
        this.selectedTabTitle = "Recently Viewed";
        this.updateImageValidationValues(789, 332);
        this.loadWhishListAndRecentlyUploads(this.selectedTab);

        break;

      default:
        break;
    }
    window.scroll({
      top: 100,
      left: 100,
      behavior: 'smooth'
    });
  }

  onChangeType(typeId) {
    this.allProductsOrCategories = [];
    this.multiSelectData = [];
    this.multiSelectData.push({ _id:"",title:"--- Select ---"});
    this.form.patchValue({
      typeElement: "",
    });

    if (typeId == 0) {
      this.loadAllProducts();
    } else if (typeId == 1) {
      this.loadAllCategories();
    }
  }

  loadAllProducts() {
    this.adsMedimallService.getAllProducts().pipe(
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
      })).subscribe(res => {
        this.allProductsOrCategories = res.data;
        this.products = res.data;
        this.multiSelectData = this.allProductsOrCategories;
        if (this.selectedItem) {
          this.form.patchValue({
            productId: "",
          });
          let selectedElement = this.allProductsOrCategories.filter(el => { return el._id == this.selectedItem.typeId})
          
          if (selectedElement.length) {
            this.form.patchValue({
              typeElement: this.selectedItem.typeId,
            });
          }
        }
      })
  }

  loadAllCategories() {
    this.adsMedimallService.getAllCategories().pipe(
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
      })).subscribe(res => {
        this.allProductsOrCategories = res.data;
        this.categories = res.data;
        this.multiSelectData = this.allProductsOrCategories;
        if (this.selectedItem) {
          let selectedElement = this.allProductsOrCategories.filter(el => { return el._id == this.selectedItem.typeId})
          if (selectedElement.length) {
            this.form.patchValue({
              typeElement: this.selectedItem.typeId,
            });
          }
        }
      })
  }


  loadSliders(sliderType: string) {
    this.loading = true


    this.adsMedimallService.getSliders(sliderType).pipe(
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loading = false
      })).subscribe(res => {
        this.items = res.data;
        this.loading = false
        console.log("ITEMS LOADED", this.items);

      })
  }

  loadMainCategories() {
    this.loading = true


    this.adsMedimallService.getMainCategories().pipe(
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loading = false
      })).subscribe(res => {
        this.items = res.data;
        this.loading = false
        console.log("M Cat ITEMS LOADED", this.items);

      })
  }

  loadTopCategories() {
    this.loading = true

    this.adsMedimallService.getTopCategories().pipe(
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loading = false
      })).subscribe(res => {
        this.items = res.data;
        this.loading = false;
        // console.log("M Cat ITEMS LOADED", this.items);
      })
  }

  getGrooming() {
    this.loading = true    

    this.adsMedimallService.getGrooming().pipe(
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loading = false
      })).subscribe(res => {
        this.items = res.data;
        this.loading = false
        console.log("M Cat ITEMS LOADED", this.items);

      })
  }


  loadImageOnlyAds(type: string) {
    this.loading = true
    this.updateValidation();


    this.adsMedimallService.getImageOnlyAds(type).pipe(
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loading = false
      })).subscribe(res => {
        let itemsTemp:any = [];
        itemsTemp = res.data;
        this.items = itemsTemp;
        console.log("ITEMS LOADED", this.items);
        if (this.selectedTab == "top3icons") {
          this.adsMedimallService.getImageOnlyAds('top3iconsprescription').pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.loading = false
            })).subscribe(res => {
              itemsTemp[2] = res.data[0]
              this.items = itemsTemp;
            })
        }
      })
  }

  loadWhishListAndRecentlyUploads(sliderType: string) {
    this.loading = true
    this.clearAllValidators();
    // this.form.controls['type'].setValidators(Validators.required);

    this.adsMedimallService.getWishlistAndRecent(sliderType).pipe(
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loading = false
      })).subscribe(res => {
        this.items = res.data;
        this.loading = false
        console.log("WR ITEMS LOADED", this.items);

      })
  }

  handleFilter(value) {
    // console.log("Filter EV : ",value);
    if (value.length >= 1) {
      this.multiSelectData = this.allProductsOrCategories.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.multiSelectData = this.allProductsOrCategories
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      image: [""],
      // type: ["", Validators.compose([Validators.required])],
      categoryId: ["", Validators.compose([])],
      productId: ["", Validators.compose([])],
      type: ["", Validators.compose([Validators.required])],
      typeElement: [null, Validators.compose([Validators.required])],
      offerText: ["", Validators.compose([Validators.maxLength(255)])],
      offerPercentage: ["", Validators.compose([Validators.maxLength(10)])],
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

    if (!this.image && this.selectedTab != 'grooming') {
      return false;
    }

    this.saving = true;
    this.adsOperation('save');
  }

  update() {
    this.generateFormData();
    const controls = this.form.controls;
    /** check form */
    console.log(this.form.invalid);
    console.log(this.form);
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return false;
    }
    

    this.updating = true;
    this.adsOperation('update');
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
        this.deleting = true;
        this.adsOperation('delete', id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }

  updateValidation() {
    this.clearAllValidators();
    console.log("validation Updating on progress");
    if (['slider1', 'slider2', 'slider3', 'slider4', 'slider5', 'slider6', 'slider7', 'topdeals','wishlist','recentlyviewed'].includes(this.selectedTab)) {
      this.form.controls['type'].setValidators(Validators.required);
      this.form.controls['typeElement'].setValidators(Validators.required);
    } else if (['top3icons', '6categories', 'healthcare'].includes(this.selectedTab)) {
      // this.form.controls['type'].setValidators(Validators.required);
      // this.form.controls['typeElement'].setValidators(Validators.required);
    } else if (['mainCategory'].includes(this.selectedTab)) {
      this.form.controls['offerText'].setValidators([Validators.required, Validators.maxLength(255)]);
    } else if (['grooming'].includes(this.selectedTab)) {
      this.form.controls['categoryId'].setValidators(Validators.required);
      this.form.controls['productId'].setValidators(Validators.required);
    } else if (['topCategories'].includes(this.selectedTab)) {
      this.form.controls['offerPercentage'].setValidators(Validators.required);
      this.form.controls['categoryId'].setValidators(Validators.required);
    }
  }

  adsOperation(operation: string, id: any = null) {
    console.log("entering adsOperation", operation, this.selectedTab);

    if (['slider1', 'slider2', 'slider3', 'slider4', 'slider5', 'slider6', 'slider7', 'topdeals'].includes(this.selectedTab)) {
      switch (operation) {
        case "save":
          let saveData = this.generateFormData();
          this.adsMedimallService.saveSliders(saveData, this.selectedTab).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.saving = false
            })).subscribe(res => {
              Swal.fire('', this.selectedTabTitle + ' Saved Successfully', 'success');
              this.modalService.dismissAll();
              this.reloadTab();
            })
          break;
        case "update":
          let updateDate = this.generateFormData();
          this.adsMedimallService.updateSlider(updateDate, this.selectedTab).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.updating = false
            })).subscribe(res => {
              Swal.fire('', this.selectedTabTitle + ' Updated Successfully', 'success');
              this.modalService.dismissAll();
              this.reloadTab();
            })
          break;
        case "delete":
          this.adsMedimallService.deleteSlider(id).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.updating = false
            })).subscribe(res => {
              Swal.fire({
                text: this.selectedTabTitle + ' Deleted Successfully',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 50,
              });
              this.reloadTab();
            })
          break;
      }
    }

    else if (['top3icons', '6categories', 'healthcare'].includes(this.selectedTab)) {
      switch (operation) {
        case "update":
          let updateDate = this.generateFormData();
          let tab = this.selectedItem == 'top3icons' && this.additionalData=='top3iconsprescription' ? 'top3iconsprescription' : this.selectedTab;
          this.adsMedimallService.updateImageOnlyAds(updateDate, tab).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.updating = false
            })).subscribe(res => {
              Swal.fire('', this.selectedTabTitle + ' Updated Successfully', 'success');
              this.modalService.dismissAll();
              this.reloadTab();
            })
          break;
      }
    }

    else if (['wishlist', 'recentlyviewed'].includes(this.selectedTab)) {
      switch (operation) {
        case "update":
          let updateDate = this.generateFormData();
          this.adsMedimallService.updateWishlistAndRecent(updateDate, this.selectedTab).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.updating = false
            })).subscribe(res => {
              Swal.fire('', this.selectedTabTitle + ' Updated Successfully', 'success');
              this.modalService.dismissAll();
              this.reloadTab();
            })
          break;
      }
    }

    else if (['mainCategory'].includes(this.selectedTab)) {
      switch (operation) {
        case "update":
          let updateDate = this.generateFormData();
          this.adsMedimallService.updateMainCategory(updateDate).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.updating = false
            })).subscribe(res => {
              Swal.fire('', this.selectedTabTitle + ' Updated Successfully', 'success');
              this.modalService.dismissAll();
              this.reloadTab();
            })
          break;
      }
    }


    else if (['topCategories'].includes(this.selectedTab)) {
      switch (operation) {
        case "update":
          let updateDate = this.generateFormData();
          this.adsMedimallService.updateTopCategory(updateDate).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.updating = false
            })).subscribe(res => {
              Swal.fire('', this.selectedTabTitle + ' Updated Successfully', 'success');
              this.modalService.dismissAll();
              this.reloadTab();
            })
          break;
      }
    }

    if (['grooming'].includes(this.selectedTab)) {
      switch (operation) {
        case "save":
          
          let saveData = this.generateFormData();
          // let existingItem = this.items.filter( item => { return item.typeId == 'typeId', this.form.get('typeElement').value })
          // if (existingItem.length) {
          //   Swal.fire('Oops!', this.selectedTabTitle + 'This ', 'warning');
          //   return false;
          // }
          this.adsMedimallService.saveGrooming(saveData).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.saving = false
            })).subscribe(res => {
              Swal.fire('', this.selectedTabTitle + ' Saved Successfully', 'success');
              this.modalService.dismissAll();
              this.reloadTab();
            })
          break;
        case "update":
          let updateDate = this.generateFormData();
          this.adsMedimallService.updateGrooming(updateDate).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.updating = false
            })).subscribe(res => {
              Swal.fire('', this.selectedTabTitle + ' Updated Successfully', 'success');
              this.modalService.dismissAll();
              this.reloadTab();
            })
          break;
        case "delete":
          this.adsMedimallService.deleteGrooming(id).pipe(
            catchError(err => {
              return throwError(err);
            }),
            finalize(() => {
              this.updating = false
            })).subscribe(res => {
              Swal.fire({
                text: this.selectedTabTitle + ' Deleted Successfully',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 50,
              });
              this.reloadTab();
            })
          break;
      }
    }
  }

  generateFormData() {
    const formData = new FormData();
    formData.append('image', this.image);
    formData.append('type', this.form.get('type').value);
    formData.append('typeId', this.form.get('typeElement').value);
    // formData.append('offerText', this.form.get('typeElement').value._id);
    // formData.append('offerPercentage', this.form.get('typeElement').value._id);
    formData.append('categoryId', this.form.get('categoryId').value);
    formData.append('productId', this.form.get('productId').value);
    formData.append('offerText', this.form.get('offerText').value);
    formData.append('offerPercentage', this.form.get('offerPercentage').value);

    if (this.editMode) {
      formData.append('sliderId', this.selectedItem._id);
      formData.append('groomingId', this.selectedItem._id);
      formData.append('mainCategoryId', this.selectedItem._id);
      formData.append('topCategoryId', this.selectedItem._id);
    }
    return formData;
  }

  changeImageValidationResolution(width: number, height: number) {
    this.imageValidationWidth = width;
    this.imageValidationHeight = height;
  }

  updateImageValidationValues(width: number, height: number) {
    this.imageValidationWidth = width;
    this.imageValidationHeight = height;
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

  open(content, Value: any, item = null,additionalData = null) {
    this.additionalData = additionalData;
    this.resetForm();
    this.selectedItem = item;

    if (Value === 'add') {
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;

      this.editMode = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if (Value === 'edit') {
      console.log("ITEM", item);

      this.editMode = true;
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;

      let typeElement: any = null
      if (item.type == 0) {
        this.loadAllProducts();
      } else if (item.type == 1) {
        this.loadAllCategories();
      }

      if (this.selectedTab == "grooming") {
          console.log("item.categoryId ",item.categoryId );
          this.onChangeCategory(item.categoryId);
          this.adsMedimallService.getGroomingByID(item._id).subscribe((res:any)=>{
            console.log(res.data);
          })
      }

     
      this.imagePreview = item.image;
      this.form.patchValue({
        type: item.type,
        // typeElement: item, // This section will update while loading all product or categories
        offerText: item.offerText,
        offerPercentage: item.offerPercentage,
        categoryId: item.categoryId,
        productId: item.productId
      });

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

  onImageChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type.indexOf('image') != 0) {
        Swal.fire('Oops!', "Please select a valid image file", 'warning');
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
          if ((width == this.imageValidationWidth && height == this.imageValidationHeight)) {
            this.imagePreview = img.src;
            this.image = file;
            console.log('Width and Height', width, height);
          } 

          else if ((this.imageValidationWidth==0 && this.imageValidationHeight==0)) {
            this.imagePreview = img.src;
            this.image = file;
            console.log('Width and Height', width, height);
          } 
          
          
          else {
            Swal.fire('Oops!', "Please select image with width of " + this.imageValidationWidth + "px and height " + this.imageValidationHeight + "px", 'warning');
            return false;
          }
        };
      };

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

  dropDownChange(value: any) {
    if (value === 'medimall') {
      this.value_array = ['Product', 'Category'];
    }
    else if (value === 'foliofit') {
      this.value_array = ['Fitness Club', 'Yoga', 'Diet Regieme', 'Health', 'Nutri Chart', 'BMI'];
      this.product_array = [];
    }
    else if (value === 'medfeed') {
      this.value_array = ['Med Articles', 'Medquiz', 'Expert Advice', 'Health Tips', 'Live Updates', 'Home'];
      this.product_array = [];
    }
    else if (value === 'external') {
      this.value_array = ['Link'];
      this.product_array = [];
    }
  }


  changeColorPickerValue(value) {
    console.log(value);
    this.colorValue = value;
  }

  resetForm() {
    this.form.reset();
    this.form.patchValue({
      type: "",
      typeElement: "", // This section will update while loading all product or categories
      offerText: "",
    });
    this.imagePreview = null;
    this.image = null;
    this.allProductsOrCategories = [];
    this.updateValidation();  
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  onChangeCategory(categoryId) {
    if (categoryId) {
      // this.productsToSelectBox = this.products.filter(el => {
      //   return el.categoryId == categoryId
      // })

      this.adsMedimallService.getAllProductsByCategoryID(categoryId).subscribe((res:any)=>{
        this.productsToSelectBox = res.data;
      })
    } else {
      this.productsToSelectBox = [];
    }
  }

  clearAllValidators(): void {
    this.form.controls['categoryId'].clearValidators();
    this.form.controls['productId'].clearValidators();
    this.form.controls['type'].clearValidators();
    this.form.controls['typeElement'].clearValidators();
    this.form.controls['offerText'].clearValidators();
    this.form.controls['offerPercentage'].clearValidators();
  }

}
