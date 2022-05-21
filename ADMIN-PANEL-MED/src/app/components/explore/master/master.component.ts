import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MedArticleCategoryService } from 'src/app/services/med-article-category.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss'],
})
export class MasterComponent implements OnInit {
  public API = environment.apiUrl;

  //common variables
  public closeResult: string;
  public dataItem: any;
  public value_array = [];
  public product_array = [];
  public colorValue: any;
  add_Modal_Flag: boolean = false;
  listCategory: any = [];
  public attemptedSubmit: any;
  public selectedTab: any;
  public parentCategoryID: any;
  public selectedValuesArticle: any = ['Main Category'];

  //kendo table
  public gridView: GridDataResult;
  public skip = 0;

  //new variables(Article Category)
  public listArticleCategoryDetails: any = [];
  public listAllArticleCategory: any = ['Main Category'];
  public uploadImage: any;
  public image_URL: any = '';
  public articleCategoryForm: FormGroup;
  public single_article_category: any = [];
  public checkBoxSelectedValue: boolean = false;
  public categoryID: any;
  public checkboxEnableFlag: boolean = false;
  public medArticleImageWidth: any;
  public medArticleImageHeight: any;

  //new variables Healthare videos category
  public articleHealthCategoryForm: FormGroup;

  //new variables Medfeed Home Page
  public listMedfeedHomePageArticleList;
  any = [];
  public medfeedForm: FormGroup;

  //new varuables Live Update
  public liveupdateForm: FormGroup;
  public liveUpdateList: any = [];
  public selectedValues: any = [];
  public LiveUpdateCategoryName: any;

  //new variable Healthcare videos
  public listMedfeedHomeHealthCareList: any = [];
  public listHealthCarevideosDetails: any = [];
  public listAllHealthCareCategory: any = [];

  //new variables Helath care medfeed home
  public medfeedHealthForm: FormGroup;

  //new variable Healthtips
  public healthTipsList: any = [];
  public healthTipForm: FormGroup;

  //new variable HealthExpert
  public healthExpertList: any = [];
  public healthExpertForm: FormGroup;


  
  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public addFlag :boolean;

  @ViewChild('tabs')
  private tabs: NgbTabset;

  constructor(
    private _router: Router,
    private modalService: NgbModal,
    private _medArticleService: MedArticleCategoryService,
    public formBuilder: FormBuilder,
    private permissionService:PermissionService,
    private location: Location,
  ) {
    this.initForms();
  }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.selectedTab = 'med_article';

    this.getAllArticleCategories();
    this.getArticleCategoryList();
    this.getMedfeedHomePageDetails();
    this.getLiveUpdatesDetails();
    this.getAllhealthCareVideos();
    this.getArticleCategoryList();
    this.getMedfeedHomeHealthCareDetails();
    this.getHelathtipsDetails();
    this.getHelathExpertDetails();
    this.get_HealthCareCategoryList();
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


  //Tab changes Event

  onTabChange(event) {
    if (event.activeId === 'med_article') {
      //Med Artcile Section
      this.getAllArticleCategories();
      this.getArticleCategoryList();
      this.getMedfeedHomePageDetails();
    } else if (event.activeId === 'healthcare_videos') {
      //Med Artcile Section
      this.getAllhealthCareVideos();
      this.getArticleCategoryList();
      this.getMedfeedHomeHealthCareDetails();
    }
  }

  onInnerTabChange(event) {
    // alert(event.target.value);
  }

  initForms() {
    this.articleCategoryForm = this.formBuilder.group({
      parent: ['', Validators.required],
      categoryname: ['', Validators.required],
      image: [''],
      homepage: [true],
    });

    this.articleHealthCategoryForm = this.formBuilder.group({
      parent: ['', Validators.required],
      categoryname: ['', Validators.required],
      image: [''],
      homepage: [true],
    });

    this.medfeedForm = this.formBuilder.group({
      parent: ['', Validators.required],
      categoryname: ['', Validators.required],
      image: [''],
      homepage: [true],
    });

    this.medfeedHealthForm = this.formBuilder.group({
      parent: ['', Validators.required],
      categoryname: ['', Validators.required],
      image: [''],
      homepage: [true],
    });

    this.liveupdateForm = this.formBuilder.group({
      categoryname: ['', Validators.required],
      image: [''],
    });

    this.healthTipForm = this.formBuilder.group({
      categoryname: ['', Validators.required],
    });

    this.healthExpertForm = this.formBuilder.group({
      categoryname: ['', Validators.required],
    });
  }

  get f() {
    return this.articleCategoryForm.controls;
  }

  get medhome() {
    return this.medfeedForm.controls;
  }

  get articleHealth() {
    return this.articleHealthCategoryForm.controls;
  }

  get medhome_health() {
    return this.medfeedHealthForm.controls;
  }

  get healthtip() {
    return this.healthTipForm.controls;
  }

  get healthexpert() {
    return this.healthExpertForm.controls;
  }

  get live() {
    return this.liveupdateForm.controls;
  }

  //Med article
  getAllArticleCategories() {
    this._medArticleService
      .getArticleCategoriesDetails()
      .subscribe((res: any) => {
        console.log(res);
        this.listArticleCategoryDetails = res.data.reverse();
      });
  }

  getMedfeedHomePageDetails() {
    this._medArticleService
      .get_medfeed_home_page_articles()
      .subscribe((res: any) => {
        console.log(res);
        this.listMedfeedHomePageArticleList = res.data.reverse();
      });
  }

  getArticleCategoryList() {
    this._medArticleService.getArticleCategory().subscribe((res: any) => {
      console.log(res);
      this.listAllArticleCategory = res.data;
    });
  }

  getLiveUpdatesDetails() {
    this._medArticleService.get_live_updates_details().subscribe((res: any) => {
      this.liveUpdateList = res.data.liveUpdate.reverse();
      console.log(this.liveUpdateList);
      // let list :any = [];
      // list = this.listAllArticleCategory.find((x)=>x._id === this.liveUpdateList[0].category);
      this.LiveUpdateCategoryName = this.liveUpdateList[0].category.name;
    });
  }

  //Healthcare videos

  get_HealthCareCategoryList() {
    this._medArticleService
      .getHealthCareCategoriesDetails()
      .subscribe((res: any) => {
        console.log(res);
        this.listAllHealthCareCategory = res.data;
      });
  }

  getAllhealthCareVideos() {
    this._medArticleService
      .get_healthcare_videos_Details()
      .subscribe((res: any) => {
        console.log(res);
        this.listHealthCarevideosDetails = res.data.reverse();
      });
  }

  getMedfeedHomeHealthCareDetails() {
    this._medArticleService
      .get_medfeed_home_page_healthcare()
      .subscribe((res: any) => {
        console.log(res);
        this.listMedfeedHomeHealthCareList = res.data.reverse();
      });
  }

  //Health Tips

  getHelathtipsDetails() {
    this._medArticleService.get_health_tips_Details().subscribe((res: any) => {
      console.log(res);
      this.healthTipsList = res.data.health_category.reverse();
    });
  }

  //Health Expert

  getHelathExpertDetails() {
    this._medArticleService
      .get_health_expert_Details()
      .subscribe((res: any) => {
        console.log(res);
        this.healthExpertList = res.data.category.reverse();
      });
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

  open(content, Value: any, id: any, type: any) {
    if (Value === 'add') {
      this.add_Modal_Flag = true;
      this.initForms();
      this.image_URL = '';
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (Value === 'edit') {
      this.add_Modal_Flag = false;

      if (type === 'article_category') {
        let data: any = [];
        this._medArticleService
          .get_single_article_ctegory(id)
          .subscribe((res: any) => {
            console.log(res.data);
            console.log(res.data.parent.name);
            if (res.data.parent.name === 'main') {
              this.medArticleImageWidth = 219;
              this.medArticleImageHeight = 198;
              this.checkboxEnableFlag = false;
            } else {
              this.medArticleImageWidth = 200;
              this.medArticleImageHeight = 200;
              this.checkboxEnableFlag = true;
            }

            this.parentCategoryID = res.data.parent._id;
            this.categoryID = res.data['_id'];
            this.image_URL = res.data['image'];
            this.checkBoxSelectedValue = res.data['homepage'];
            this.f.parent.setValue(
              res.data.parent._id ? res.data.parent._id : 'main'
            );
            this.f.categoryname.setValue(res.data['name']);
            this.f.homepage.setValue(res.data['homepage']);
          });
      } else if (type === 'all_helathcare_videos') {
        let data: any = [];
        this._medArticleService
          .get_single_healthcare_videos_ctegory(id)
          .subscribe((res: any) => {
            console.log(res.data);
            if (res.data.parent === 'main') {
              this.checkboxEnableFlag = false;
              this.articleHealth.parent.setValue(res.data.parent);
            } else {
              this.checkboxEnableFlag = true;
              this.parentCategoryID = res.data.parent;
            }
            this.categoryID = res.data['_id'];
            this.image_URL = res.data['image'];
            this.checkBoxSelectedValue = res.data['homepage'];
            console.log(res.data.parent.name);
            this.articleHealth.parent.setValue(
              res.data.parent ? res.data.parent : 'main'
            );
            this.articleHealth.categoryname.setValue(res.data['name']);
            this.articleHealth.homepage.setValue(res.data['homepage']);
          });
      } else if (type === 'medfeed_homepage') {
        let data: any = [];
        this._medArticleService
          .get_single_article_ctegory(id)
          .subscribe((res: any) => {
            console.log(res.data);
            if (res.data.parent.name === 'main') {
              this.medArticleImageWidth = 219;
              this.medArticleImageHeight = 198;
              this.checkboxEnableFlag = res.data['homepage'];
            } else {
              this.medArticleImageWidth = 200;
              this.medArticleImageHeight = 200;
              this.checkboxEnableFlag = res.data['homepage'];
            }
            this.parentCategoryID = res.data.parent._id;
            this.categoryID = res.data._id;
            this.image_URL = res.data['image'];
            this.checkBoxSelectedValue = res.data['homepage'];
            this.medhome.parent.setValue(
              res.data.parent._id ? res.data.parent._id : 'main'
            );
            this.medhome.categoryname.setValue(res.data['name']);
            this.medhome.homepage.setValue(res.data['homepage']);
          });
      } else if (type === 'live_updates') {
        let data: any = [];
        let list: any = [];
        data = this.liveUpdateList.find((res: any) => res._id === id);
        console.log(data);
        this.image_URL = data.image;
        this.selectedValues = data.category;
        console.log(this.selectedValues);
        // this.liveupdateForm.setValue({
        //   'categoryname':data.category.name,
        //   'image':data.image,
        // });
      } else if (type === 'medfeedhome_healthcare') {
        let data: any = [];
        this._medArticleService
          .get_single_healthcare_videos_ctegory(id)
          .subscribe((res: any) => {
            console.log(res.data);
            if (res.data.parent.name === 'main') {
              this.checkboxEnableFlag = true;
            } else {
              this.checkboxEnableFlag = false;
            }
            this.parentCategoryID = res.data.parent;
            this.categoryID = res.data._id;
            res.data['image'] = res.data['image'];
            this.image_URL = res.data['image'];
            this.checkBoxSelectedValue = res.data['homepage'];
            this.medhome_health.parent.setValue(
              res.data.parent ? res.data.parent : 'main'
            );
            this.medhome_health.categoryname.setValue(res.data['name']);
            this.medhome_health.homepage.setValue(res.data['homepage']);
          });
      } else if (type === 'healthtips') {
        let data: any = [];
        this._medArticleService
          .get_single_health_tips_category(id)
          .subscribe((res: any) => {
            console.log(res.data);
            console.log(res.data['name']);
            this.categoryID = res.data['_id'];
            if (res) {
              this.healthTipForm.setValue({
                categoryname: [res.data['name']],
              });
            }
          });
      } else if (type === 'healthexpert') {
        let data: any = [];
        this._medArticleService
          .get_single_health_expert_category(id)
          .subscribe((res: any) => {
            console.log(res.data);
            console.log(res.data['name']);
            this.categoryID = res.data['_id'];
            if (res) {
              this.healthExpertForm.setValue({
                categoryname: [res.data['name']],
              });
            }
          });
      }

      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (Value === '') {
      this.add_Modal_Flag = false;
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
  }

  //HealthCareVedio Tab

  public subCategoryImageFlag: boolean = false;
  public listSubCategoryLit: Array<string> = [
    'FaceWash',
    'ToothPaste',
    'Panjaka Kasthuri',
    'Face Mask',
  ];

  public HealthCareVediosData = [
    {
      category: 'Bath Cream Lotion',
      parent: 'Bath & Body Care',
      image:
        "<img src='assets/images/electronics/product/facewash.png' class='imgTable'>",
    },
    {
      category: 'Bady Spray',
      parent: 'Does Perfumes',
      image:
        "<img src='assets/images/electronics/product/facewash.png' class='imgTable'>",
    },
    {
      category: 'Books Magazine ',
      parent: 'Stationary',
      image:
        "<img src='assets/images/electronics/product/facewash.png' class='imgTable'>",
    },
    {
      category: 'Breakfast & Cereals',
      parent: 'Grocery',
      image:
        "<img src='assets/images/electronics/product/facewash.png' class='imgTable'>",
    },
  ];

  //Med Article Section

  checkBoxEventArticleChange(event: any, type) {
    console.log(event);
    if (type === 'article_category') {
      this.f.homepage.setValue(event);
      console.log(this.f.homepage.value);
    } else if (type === 'medfeed_homepage') {
      this.medhome.homepage.setValue(event);
    } else if (type === 'all_helathcare_videos') {
      this.articleHealth.homepage.setValue(event);
    } else if (type === 'medfeedhome_healthcare') {
      this.medhome_health.homepage.setValue(event);
    }
  }
  selectParentCategory(value: any, type) {
    if (type === 'article_category') {
      if (value === 'main') {
        this.image_URL = '';
        this.add_Modal_Flag = true;
        this.f.parent.setValue('main');
        this.f.homepage.setValue(false);
        this.checkboxEnableFlag = false;
        this.medArticleImageWidth = '219';
        this.medArticleImageHeight = '198';
      } else {
        this.image_URL = '';
        this.add_Modal_Flag = true;
        this.f.parent.setValue(value);
        this.parentCategoryID = value;
        this.checkboxEnableFlag = true;
        this.medArticleImageWidth = '200';
        this.medArticleImageHeight = '200';
      }
    } else if (type === 'medfeed_homepage') {
      if (value === 'main') {
        this.image_URL = '';
        this.add_Modal_Flag = true;
        this.medhome.parent.setValue('main');
        this.medhome.homepage.setValue(false);
        this.checkboxEnableFlag = false;
        this.medArticleImageWidth = '219';
        this.medArticleImageHeight = '198';
      } else {
        this.image_URL = '';
        this.add_Modal_Flag = true;
        this.medhome.parent.setValue(value);
        this.parentCategoryID = value;
        this.checkboxEnableFlag = true;
        this.medArticleImageWidth = '200';
        this.medArticleImageHeight = '200';
      }
    } else if (type === 'all_helathcare_videos') {
      if (value === 'main') {
        this.image_URL = '';
        this.add_Modal_Flag = true;
        this.articleHealth.parent.setValue('main');
        this.checkboxEnableFlag = false;
        this.articleHealth.homepage.setValue(false);
        this.medArticleImageWidth = '219';
        this.medArticleImageHeight = '198';
      } else {
        this.image_URL = '';
        this.add_Modal_Flag = true;
        this.articleHealth.parent.setValue(value);
        this.checkboxEnableFlag = true;
        this.parentCategoryID = value;
        this.medArticleImageWidth = '200';
        this.medArticleImageHeight = '200';
      }
    } else if (type === 'medfeed_homepage') {
      if (value === 'main') {
        this.image_URL = '';
        this.add_Modal_Flag = true;
        this.medhome_health.parent.setValue('main');
        this.medhome_health.homepage.setValue(false);
        this.checkboxEnableFlag = false;
        this.medArticleImageWidth = '219';
        this.medArticleImageHeight = '198';
      } else {
        this.image_URL = '';
        this.add_Modal_Flag = true;
        this.medhome_health.parent.setValue(value);
        this.parentCategoryID = value;
        this.checkboxEnableFlag = true;
        this.medArticleImageWidth = '200';
        this.medArticleImageHeight = '200';
      }
    }
  }

  onSubmit(type: any) {
    if (type === 'article_category') {
      if (this.articleCategoryForm.invalid && this.image_URL === '') {
        return;
      }
      const formData = new FormData();
      formData.append('name', this.f.categoryname.value);
      formData.append('parent', this.f.parent.value);
      formData.append('homepage', this.f.homepage.value);
      formData.append('image', this.uploadImage);

      this._medArticleService
        .add_article_Category(formData)
        .subscribe((res: any) => {
          console.log(res);
          if (res.status === true) {
            this.ngOnInit();
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.resetForms();
            this.modalService.dismissAll();
          } else if (res.status === false) {
            Swal.fire({
              text: 'Already Exist!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.articleCategoryForm.reset();
            this.image_URL = '';
          }
        });
    } else if (type === 'all_helathcare_videos') {
      if (this.articleHealthCategoryForm.invalid && this.image_URL === '') {
        return;
      }
      const formData = new FormData();
      formData.append('name', this.articleHealth.categoryname.value);
      formData.append('parent', this.articleHealth.parent.value);
      formData.append('homepage', this.articleHealth.homepage.value);
      formData.append('image', this.uploadImage);

      this._medArticleService
        .add_healthcare_videos_Category(formData)
        .subscribe((res: any) => {
          console.log(res);
          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.ngOnInit();
            this.resetForms();
            this.getMedfeedHomeHealthCareDetails();
            this.modalService.dismissAll();
          } else if (res.status === false) {
            Swal.fire({
              text: 'Already Exist!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.articleHealthCategoryForm.reset();
            this.image_URL = '';
          }
        });
    } else if (type === 'healthtips') {
      if (this.healthTipForm.invalid) {
        return;
      }
      const formData = new FormData();
      formData.append('name', this.healthtip.categoryname.value);
      let input = {
        name: this.healthtip.categoryname.value,
      };
      this._medArticleService
        .add_health_tips_Category(input)
        .subscribe((res: any) => {
          console.log(res);
          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.getHelathtipsDetails();
            this.healthTipForm.reset();
            this.attemptedSubmit = false;
            this.modalService.dismissAll();
          } else if (res.status === false) {
            Swal.fire({
              text: 'Already Exist!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.healthTipForm.reset();
            this.image_URL = '';
          }
        });
    } else if (type === 'healthexpert') {
      if (this.healthExpertForm.invalid) {
        return;
      }
      let input = {
        name: this.healthexpert.categoryname.value,
      };
      this._medArticleService
        .add_health_expert_Category(input)
        .subscribe((res: any) => {
          console.log(res);
          if (res.status === true) {
            Swal.fire({
              text: 'Successfully Added',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.getHelathExpertDetails();
            this.healthExpertForm.reset();
            this.attemptedSubmit = false;
            this.modalService.dismissAll();
          } else if (res.status === false) {
            Swal.fire({
              text: 'Already Exist!!!',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.healthExpertForm.reset();
            this.image_URL = '';
          }
        });
    }
  }

  update(type: any) {
    if (type === 'article_category') {
      if (this.articleCategoryForm.invalid || this.image_URL === '') {
        return;
      }
      const formData = new FormData();
      if (this.uploadImage != undefined) {
        if (this.f.parent.value === 'main') {
          formData.append('name', this.f.categoryname.value);
          formData.append('parent', this.f.parent.value);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.f.homepage.value);
          formData.append('image', this.uploadImage);
        } else {
          formData.append('name', this.f.categoryname.value);
          formData.append('parent', this.parentCategoryID);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.f.homepage.value);
          formData.append('image', this.uploadImage);
        }
      } else {
        if (this.f.parent.value === 'main') {
          formData.append('name', this.f.categoryname.value);
          formData.append('parent', this.f.parent.value);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.f.homepage.value);
          formData.append('image', null);
        } else {
          formData.append('name', this.f.categoryname.value);
          formData.append('parent', this.parentCategoryID);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.f.homepage.value);
          formData.append('image', null);
        }
      }

      this._medArticleService
        .update_article_Category(formData)
        .subscribe((res: any) => {
          console.log(res);
          if (res) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.ngOnInit();
            this.modalService.dismissAll();
          }
        });
    } else if (type === 'medfeed_homepage') {
      if (this.medfeedForm.invalid || this.image_URL === '') {
        return;
      }
      const formData = new FormData();
      if (this.uploadImage != undefined) {
        if (this.medhome.parent.value === 'main') {
          formData.append('name', this.medhome.categoryname.value);
          formData.append('parent', this.medhome.parent.value);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.medhome.homepage.value);
          formData.append('image', this.uploadImage);
        } else {
          formData.append('name', this.medhome.categoryname.value);
          formData.append('parent', this.parentCategoryID);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.medhome.homepage.value);
          formData.append('image', this.uploadImage);
        }
      } else {
        if (this.medhome.parent.value === 'main') {
          formData.append('name', this.medhome.categoryname.value);
          formData.append('parent', this.medhome.parent.value);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.medhome.homepage.value);
          formData.append('image', null);
        } else {
          formData.append('name', this.medhome.categoryname.value);
          formData.append('parent', this.parentCategoryID);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.medhome.homepage.value);
          formData.append('image', null);
        }
      }

      this._medArticleService
        .update_article_Category(formData)
        .subscribe((res: any) => {
          console.log(res);
          if (res) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.ngOnInit();
            this.modalService.dismissAll();
          }
        });
    } else if (type === 'live_updates') {
      if (this.liveupdateForm.invalid || this.image_URL === '') {
        return;
      }
      const formData = new FormData();
      if (this.uploadImage != undefined) {
        formData.append('category', this.categoryID);
        formData.append('image', this.uploadImage);
      } else {
        formData.append('category', this.categoryID);
        formData.append('image', null);
      }

      this._medArticleService
        .add_live_updates_details(formData)
        .subscribe((res: any) => {
          console.log(res);
          if (res) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.getLiveUpdatesDetails();
            this.modalService.dismissAll();
          }
        });
    } else if (type === 'all_helathcare_videos') {
      if (this.articleHealthCategoryForm.invalid || this.image_URL === '') {
        return;
      }
      const formData = new FormData();
      if (this.uploadImage != undefined) {
        if (this.articleHealth.parent.value === 'main') {
          formData.append('name', this.articleHealth.categoryname.value);
          formData.append('parent', this.articleHealth.parent.value);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.articleHealth.homepage.value);
          formData.append('image', this.uploadImage);
        } else {
          formData.append('name', this.articleHealth.categoryname.value);
          formData.append('parent', this.parentCategoryID);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.articleHealth.homepage.value);
          formData.append('image', this.uploadImage);
        }
      } else {
        if (this.articleHealth.parent.value === 'main') {
          formData.append('name', this.articleHealth.categoryname.value);
          formData.append('parent', this.articleHealth.parent.value);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.articleHealth.homepage.value);
          formData.append('image', null);
        } else {
          formData.append('name', this.articleHealth.categoryname.value);
          formData.append('parent', this.parentCategoryID);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.articleHealth.homepage.value);
          formData.append('image', null);
        }
      }

      this._medArticleService
        .update_healthcare_videos_Category(formData)
        .subscribe((res: any) => {
          console.log(res);
          if (res) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.getAllhealthCareVideos();
            this.modalService.dismissAll();
          }
        });
    } else if (type === 'medfeedhome_healthcare') {
      if (this.medfeedHealthForm.invalid || this.image_URL === '') {
        return;
      }
      const formData = new FormData();
      if (this.uploadImage != undefined) {
        if (this.medhome_health.parent.value === 'main') {
          formData.append('name', this.medhome_health.categoryname.value);
          formData.append('parent', this.medhome_health.parent.value);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.medhome_health.homepage.value);
          formData.append('image', this.uploadImage);
        } else {
          formData.append('name', this.medhome_health.categoryname.value);
          formData.append('parent', this.parentCategoryID);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.medhome_health.homepage.value);
          formData.append('image', this.uploadImage);
        }
      } else {
        if (this.medhome_health.parent.value === 'main') {
          formData.append('name', this.medhome_health.categoryname.value);
          formData.append('parent', this.medhome_health.parent.value);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.medhome_health.homepage.value);
          formData.append('image', null);
        } else {
          formData.append('name', this.medhome_health.categoryname.value);
          formData.append('parent', this.parentCategoryID);
          formData.append('categoryId', this.categoryID);
          formData.append('homepage', this.medhome_health.homepage.value);
          formData.append('image', null);
        }
      }

      this._medArticleService
        .update_healthcare_videos_Category(formData)
        .subscribe((res: any) => {
          console.log(res);
          if (res) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.ngOnInit();
            this.modalService.dismissAll();
          }
        });
    } else if (type === 'healthtips') {
      if (this.healthTipForm.invalid) {
        return;
      }
      const formData = new FormData();
      formData.append('name', this.healthTipForm.value.categoryname);
      let input = {
        categoryId: this.categoryID,
        name: this.healthTipForm.value.categoryname,
      };
      this._medArticleService
        .update_health_tips_Category(input)
        .subscribe((res: any) => {
          console.log(res);
          if (res) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.getHelathtipsDetails();
            this.modalService.dismissAll();
          }
        });
    } else if (type === 'healthexpert') {
      if (this.healthExpertForm.invalid) {
        return;
      }
      let input = {
        categoryId: this.categoryID,
        name: this.healthexpert.categoryname.value,
      };
      this._medArticleService
        .update_health_expert_Category(input)
        .subscribe((res: any) => {
          console.log(res);
          if (res) {
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              imageHeight: 500,
            });
            this.getHelathExpertDetails();
            this.modalService.dismissAll();
          }
        });
    }
  }

  delete(type: any, id) {
    if (type === 'article_category') {
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
          this._medArticleService
            .delete_article_Category(id)
            .subscribe((res: any) => {
              console.log(res);
              if (res && res.status === true) {
                Swal.fire({
                  text: ' Article Category Deleted',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  imageHeight: 50,
                });
                this.getAllArticleCategories();
                this.ngOnInit();
              } else {
                Swal.fire({
                  text: 'Can`t Delete this Category',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  imageHeight: 50,
                });
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } else if (type === 'all_helathcare_videos') {
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
          this._medArticleService
            .delete_healthcare_videos_Category(id)
            .subscribe((res: any) => {
              console.log(res);
              if (res && res.status === true) {
                Swal.fire({
                  text: ' Article Category Deleted',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  imageHeight: 50,
                });
                this.ngOnInit();
                this.getAllhealthCareVideos();
              } else {
                Swal.fire({
                  text: 'Can`t Delete this Category',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  imageHeight: 50,
                });
                this.ngOnInit();
                this.getAllhealthCareVideos();
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } else if (type === 'healthtips') {
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
          this._medArticleService
            .delete_health_tips_Category(id)
            .subscribe((res: any) => {
              console.log(res);
              if (res && res.status === true) {
                Swal.fire({
                  text: ' Health Tip Category Deleted',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  imageHeight: 50,
                });
                this.ngOnInit();
                this.getHelathtipsDetails();
              } else {
                Swal.fire({
                  text: 'Can`t Delete this Category',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  imageHeight: 50,
                });
                this.ngOnInit();
                this.getHelathtipsDetails();
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } else if (type === 'healthexpert') {
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
          this._medArticleService
            .delete_health_expert_Category(id)
            .subscribe((res) => {
              console.log(res);
              Swal.fire({
                text: ' Health Expert Category Deleted',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                imageHeight: 50,
              });
              this.ngOnInit();
              this.getHelathExpertDetails();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
  }

  //Image Upload
  onChange(event: any, width: any, height: any) {
    let setFlag: boolean = false;
    if (this.f.parent.value === 'main') {
      width = 219;
      height = 198;
    } else if (this.f.parent.value != 'main') {
      width = 200;
      height = 200;
    }

    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);

    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      if (
        e.path[0].naturalHeight === parseInt(height) &&
        e.path[0].naturalWidth === parseInt(width)
      ) {
        setFlag = true;
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;
      } else {
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
    };
  }

  onChangeImage(event: any, width: any, height: any) {
    let setFlag: boolean = false;

    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);

    const Img = new Image();
    Img.src = URL.createObjectURL(file);

    Img.onload = (e: any) => {
      if (
        e.path[0].naturalHeight === parseInt(height) &&
        e.path[0].naturalWidth === parseInt(width)
      ) {
        setFlag = true;
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;
      } else {
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
    };
  }

  handleChange(value: any) {
    let data: any = [];

    this.selectedValues = value;
    this.categoryID = this.selectedValues._id;
    console.log(this.selectedValues);
    //let this.privilege=this.privileges[index];
    //this.privlgs.push({"privilage":this.privileges[index][0]});
    //this.createJSON(this.privlgs);
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.getAllArticleCategories();
  }

  close() {
    this.image_URL = '';
    this.checkboxEnableFlag = false;
    this.initForms();
    this.resetForms();
  }

  resetForms() {
    this.checkboxEnableFlag = false;
    this.articleCategoryForm.reset();
    this.medfeedForm.reset();
    this.articleHealthCategoryForm.reset();
    this.medfeedHealthForm.reset();
    this.liveupdateForm.reset();
    this.healthExpertForm.reset();
    this.healthTipForm.reset();
    this.attemptedSubmit = false;
    this.modalService.dismissAll();
  }
}
