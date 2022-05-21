import { Component, OnInit, AfterViewInit,ChangeDetectorRef, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router }  from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { HomeAdsService } from 'src/app/services/home-ads.service';
import { Location } from '@angular/common';
import { FormGroup,FormBuilder,Validators, FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-ads-home',
  templateUrl: './ads-home.component.html',
  styleUrls: ['./ads-home.component.scss']
})
export class AdsHomeComponent implements OnInit {


  public show: boolean = false;

  public addLoading :boolean = false;
  public attemptedSubmit :any;
  public closeResult: string;
  public value_array = [];
  public product_array = [];
  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;
  public linkFlag:boolean=false;
  public linkValue :any;
  public sliderID :any;
  public uploadForm:FormGroup;
  public link:any;
  public inventoryList :any = [];
  public categoryList : any =[];
  public subCategoryList : any =[];
  public selectFlag:boolean = false;
  public selectedValue :any;
  public dietPlanList :any = [];
  public categoryWiseProductList :any = [];
  public selectedTab :any;

  public healthTipCategory :any = [];
  public yogaCategory :any = [];
  public fitnessCategory :any = [];
  public yogavideos :any = [];
  public fitnessvideos :any = [];
  public prodCatFlag :boolean = false;
  public selectedCat :any;
  
  


  //NEW FORMS

  
  public topCategoryForm:FormGroup;
  public sliderForm:FormGroup;
  public spotLightForm:FormGroup;
  public cartEssentialForm:FormGroup;
  public trendingCategoryForm:FormGroup;
  public dietPlanForm:FormGroup;
  public slider5Form:FormGroup;
  public expertadviseForm:FormGroup;
  public subYogaFitnessForm :FormGroup;
  public mainYogaFitnessForm :FormGroup;
  public ad4Form :FormGroup;
  public ad7Form :FormGroup;

  //NEW VARIABLES


  public API = environment.apiUrl;
  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public uploadImage:any = '';
  public image_URL :any = '';
  public thumbnail_image_URL :any ='';
  public thumbnailuploadImage:any = '';
  public sliderType :any;
  public redirect_type :any;
  public product_type :any= '';
  public prod_cat_type_list :any;
  public CategoryID  :any;
  public SubCategoryID :any;
  public valueSelected :any;
  public couponCode :any;
  public isMedimall :boolean;
  public colorCode:any;
  public offerText :any;

  //array lists

  public topCategoryList :any = [];
  public mainCategoryList:any = [];
  public ad1List:any = [];
  public ad6List:any = [];
  public ad8List:any = [];

  public editAllTypeArrayList :any = [];
  
  public slider1List:any = [];
  public slider2List:any = [];
  public slider3List:any = [];
  public slider4List:any = [];
  public ad2List:any = [];
  public ad5List:any = [];

  public subYogaList :any = [];
  public subFitnessList :any = [];
  public expertAdviceList :any = [];


  public mainYogaList :any = [];
  public mainFitnessList :any = [];

  public ad3List :any = [];
  public ad4List :any = [];
  public ad7List :any = [];
  public slider5List :any = [];
  public trending_Cat_List :any = [];
  public play_Diet_List :any = [];
  public spot_light_List :any = [];
  public cart_essential_List :any = [];

  constructor(private modalService: NgbModal,
    private _route:Router,
    private intl: IntlService,
    private permissionService:PermissionService,
    private location: Location,
    private _adsService:HomeAdsService,
    private _formBuilder:FormBuilder,
    private __changeDetectorRef :ChangeDetectorRef,
    private viewScroller: ViewportScroller) { 

      this.selectedTab = '';

      this.uploadForm= this._formBuilder.group({
          image: [null],
      })
      this.topCategoryForm= this._formBuilder.group({
        top_image: ['',Validators.required],
      })

      this.sliderForm = this._formBuilder.group({
        redirect_type: ['',Validators.required],
        type: ['',Validators.required],
        typeid: [''],
        linkValue :['']
      })


      this.spotLightForm = this._formBuilder.group({
        type: ['',Validators.required],
        typeid: ['',Validators.required],
        colorCode: ['',Validators.required],
        offerText: ['',Validators.required],
        medimall :[false]
      })

      this.cartEssentialForm = this._formBuilder.group({
        categoryId: ['',Validators.required],
        //productId: ['',Validators.required],
      })


      this.trendingCategoryForm = this._formBuilder.group({
        categoryId: ['',Validators.required],
        colorCode: ['',Validators.required],
        offerText: ['',Validators.required]
      })


      this.dietPlanForm = this._formBuilder.group({
        dietplan: ['',Validators.required],
      })

      this.slider5Form = this._formBuilder.group({
        type: ['',Validators.required],
        typeid: ['',Validators.required],
      })

      this.subYogaFitnessForm = this._formBuilder.group({
        categoryid: ['',Validators.required],
        subcategoryid: ['',Validators.required],
      })

      
      this.mainYogaFitnessForm = this._formBuilder.group({
        categoryid: ['',Validators.required],
        subcategoryid: ['',Validators.required],
      })

      this.ad4Form = this._formBuilder.group({
        link: ['',Validators.compose([Validators.required,Validators.maxLength(255)])],
      })

      this.ad7Form = this._formBuilder.group({
        couponCode: ['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(15)])],
      })

    
    }

  ngOnInit(): void {

    
    
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }

    this.getInventroyDetails();
    this.getDietPlanDetails();
    this.getCategoryDetails();

    //case Top,Main,Ad1,Ad6,Ad8 
    this.getAllTopCategories();
    this.getAllMainCategories();
    this.getAllAd1();
    this.getAllAd6();
    this.getAllAd8();

    //case of slider 1,2,3,4 and ads 2,5 
    this.get_Slider_1234_ads_25_Details('slider1');
    this.get_Slider_1234_ads_25_Details('slider2');
    this.get_Slider_1234_ads_25_Details('slider3');
    this.get_Slider_1234_ads_25_Details('slider4');
    this.get_Slider_1234_ads_25_Details('ad2');
    this.get_Slider_1234_ads_25_Details('ad5');

    //case of subyoga,subfitness,expert advise
    this.get_sub_yoga_fitness_Details('subyoga');
    this.get_sub_yoga_fitness_Details('subfitness');
    //this.get_sub_yoga_fitness_Details('expertadvise');
    this.get_expert_advise_list();

    //case of main yoga,main fitness
    this.get_main_yoga_fitness('mainyoga');
    this.get_main_yoga_fitness('mainfitness');


    //case of ad3
    this.getAd3Details();
    //case of ad4
    this.getAd4Details();
    //case of ad7
    this.getAd7Details();
    //case of slider5
    this.getSlider5Details()
    //case of trending category
    this.get_trending_category_Details()
    //case of plan your diet
    this.get_plan_Diet_Details();
    //case of spot light
    this.get_spot_light_Details();
    //case of cart your essentials
    this.get_cart_essential_Details();

    //category listing
    this.getHealthTipCategory();
    this.getYogacategory();
    this.getFitnesscategory();

  // Select all links with hashes
    
    
//   $('#scroll').click(function() {
//     $('html,body').animate({
//         scrollTop: $('#test').css('top')
//     }, 800, function() {

//         $('html, body').animate({
//             scrollTop: 0
//         }, 800);

//     });
// });
   

  }

   // @HostListener Decorator
   @HostListener("window:scroll", [])
   onWindowScroll() {
     let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
     if (number > 600) { 
       this.show = true;
     } else {
       this.show = false;
     }
   }

  


  get top(){
    return this.topCategoryForm.controls;
  }

  get sliderform(){
    return this.sliderForm.controls;
  }

  tabChangeEvent(event){
    this.viewScroller.scrollToPosition([0, 0]);
    //alert(event.nextId);
    // console.log(event.nextId);
     //localStorage.setItem("TabID",event.nextId);
     
  }

//category lisitng 
  getHealthTipCategory(){
    this._adsService.get_health_tips_categories_expert_advise().subscribe((res:any)=>{
        this.healthTipCategory = res.data.category;
    })
  }
  getYogacategory(){
    this._adsService.get_yoga_categories().subscribe((res:any)=>{
      this.yogaCategory = res.data;
    })
  }

  getFitnesscategory(){
    this._adsService.get_fitness_categories().subscribe((res:any)=>{
      this.fitnessCategory = res.data;
  })
  }
  

  getInventroyDetails(){
    this._adsService.get_products().subscribe((res:any)=>{
      this.inventoryList = res.data;
      // this.inventoryList  = [
      //   { _id :'60ff7909c7cf094eb8ce6406',title : 'Facial Cream'},
      //   { _id :'6123120d3a8f93b670d87ff5',title : 'Body Spray'},
      //   { _id :'61246a144c795c1273c83e4b',title : 'Watch'},
      // ]
    })
  }

  getCategoryDetails(){
    this._adsService.get_categories().subscribe((res:any)=>{
      this.categoryList = res.data;
    })
  }

  

  getDietPlanDetails(){
    this._adsService.getDietPlanDetails().subscribe((res:any)=>{
      this.dietPlanList = res.data
    })
  }

  

  getAllTopCategories(){
    let type = 'topcategories';
    this._adsService.getAllCategories(type).subscribe((res:any)=>{
      this.topCategoryList = res.data;
    })
  }

  getAllMainCategories(){
    let type = 'maincategory';
    this._adsService.getAllCategories(type).subscribe((res:any)=>{
      this.mainCategoryList = res.data;
    })
  }


  getAllAd1(){
    let type = 'ad1';
    this._adsService.getAllCategories(type).subscribe((res:any)=>{
      this.ad1List = res.data;
    })
  }

  getAllAd6(){
    let type = 'ad6';
    this._adsService.getAllCategories(type).subscribe((res:any)=>{
      this.ad6List = res.data;
    })
  }

  getAllAd8(){
    let type = 'ad8';
    this._adsService.getAllCategories(type).subscribe((res:any)=>{
      this.ad8List = res.data;
    })
  }


  get_Slider_1234_ads_25_Details(type){
    if(type === 'slider1'){
      this._adsService.get_Slider_1234_Ads_25_Details(type).subscribe((res:any)=>{
        this.slider1List = res.data;
      })
    }
    else if(type === 'slider2'){
      this._adsService.get_Slider_1234_Ads_25_Details(type).subscribe((res:any)=>{
        this.slider2List = res.data;
      })
    }
    else if(type === 'slider3'){
      this._adsService.get_Slider_1234_Ads_25_Details(type).subscribe((res:any)=>{
        this.slider3List = res.data;
      })
    }
    else if(type === 'slider4'){
      this._adsService.get_Slider_1234_Ads_25_Details(type).subscribe((res:any)=>{
        this.slider4List = res.data;
      })
    }
    else if(type === 'ad2'){
      this._adsService.get_Slider_1234_Ads_25_Details(type).subscribe((res:any)=>{
        this.ad2List = res.data;
      })
    }
    else if(type === 'ad5'){
      this._adsService.get_Slider_1234_Ads_25_Details(type).subscribe((res:any)=>{
        this.ad5List = res.data;
      })
    }

  }


  get_sub_yoga_fitness_Details(type){
    if(type === 'subyoga'){
      this._adsService.get_sub_yoga_fitness_Details(type).subscribe((res:any)=>{
        this.subYogaList = res.data;
      })
    }
    else if(type === 'subfitness'){
      this._adsService.get_sub_yoga_fitness_Details(type).subscribe((res:any)=>{
        this.subFitnessList =res.data;
      })
    }
  }

  get_expert_advise_list(){
    this._adsService.get_expert_advise_details().subscribe((res:any)=>{
      this.expertAdviceList = res.data;
    })
  }


  get_main_yoga_fitness(type){
    if(type === 'mainyoga'){
      this._adsService.get_main_yoga_fitness_Details(type).subscribe((res:any)=>{
        this.mainYogaList = res.data;
      })
    }
    else if(type === 'mainfitness'){
      this._adsService.get_main_yoga_fitness_Details(type).subscribe((res:any)=>{
        this.mainFitnessList = res.data;
      })
    }
    
  }


  getAd3Details(){
    this._adsService.get_ad3_details().subscribe((res:any)=>{
      this.ad3List = res.data;
    })
  }

  getAd4Details(){
    this._adsService.get_ad4_details().subscribe((res:any)=>{
      this.ad4List = res.data;
    })
  }

  getAd7Details(){
    this._adsService.get_ad7_details().subscribe((res:any)=>{
      this.ad7List = res.data;
    })
  }


  getSlider5Details(){
    this._adsService.get_slider5_details().subscribe((res:any)=>{
      this.slider5List = res.data;
    })
  }

  get_trending_category_Details(){
    this._adsService.get_trending_category_details().subscribe((res:any)=>{
      this.trending_Cat_List = res.data;
    })
  }

  get_plan_Diet_Details(){
    this._adsService.get_plan_your_diet_details().subscribe((res:any)=>{
      this.play_Diet_List = res.data;
    })
  }


  get_spot_light_Details(){
    this._adsService.get_spot_light_details().subscribe((res:any)=>{
      this.spot_light_List = res.data;
    })
  }


  
  get_cart_essential_Details(){
    this._adsService.get_cart_essentials_details().subscribe((res:any)=>{
     this.cart_essential_List = res.data;
    })
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


  
  open(content,Value:any,id:any,type:any) {
    if(Value === 'add'){
      this.image_URL = '';
      this.thumbnail_image_URL = '';
      this.resetForms();
      this.addLoading = false;
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
      this.resetForms();
      this.addLoading = false;
      this.attemptedSubmit = false;
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;
      let data :any = [];

      if(type === "topcategories" || type === "maincategory" || type === "ad1" || type === "ad6" || type === "ad8"){
       this._adsService.get_single_all_categories(id).subscribe((res:any)=>{
          this.image_URL =  res.data[0].image;
          this.sliderID = res.data[0]._id;
        })
      }

      else if(type === 'slider1' || type === 'slider2' || type === 'slider3' || type === 'slider4' || type === 'ad2' || type === 'ad5'){

        this._adsService.get_Single_Slider_1234_Ads_25_Details(id).subscribe((res:any)=>{
          this.image_URL =  res.data[0].image;

          this.sliderID = res.data[0]._id;
          if(res.data[0].redirect_type === "Medimall"){
            this.value_array = ['product','category']
            if(res.data[0].type === 'product'){
              this.prodCatFlag = true;
              this.product_array = this.inventoryList;
              this.linkFlag = false;
              this.sliderform.redirect_type.setValue(res.data[0].redirect_type);
              this.sliderform.type.setValue(res.data[0].type);
              this.sliderform.typeid.setValue(res.data[0].typeId);
              this.sliderform.linkValue.setValue('');
            }
            else{
              this.product_array = this.categoryList;
              this.prodCatFlag = true;
              this.linkFlag = false;
              this.sliderform.redirect_type.setValue(res.data[0].redirect_type);
              this.sliderform.type.setValue(res.data[0].type);
              this.sliderform.typeid.setValue(res.data[0].typeId);
              this.sliderform.linkValue.setValue('');
            }
          }
          else if(res.data[0].redirect_type === 'External'){
            this.linkFlag = true;
            this.prodCatFlag = false;
            this.sliderform.redirect_type.setValue(res.data[0].redirect_type);
            this.sliderform.linkValue.setValue(res.data[0].type);
            this.sliderform.typeid.setValue('');
            this.sliderform.type.setValue('');
          }
          else{
            if(res.data[0].redirect_type === 'Foliofit'){
              this.value_array = ['Fitness Club','Yoga','Diet Regieme','Health','Nutri Chart','BMI'];   
              this.product_array = [];
              this.linkFlag = false;
              this.prodCatFlag = false;
              this.sliderform.redirect_type.setValue(res.data[0].redirect_type);
              this.sliderform.type.setValue(res.data[0].type);
              this.sliderform.linkValue.setValue('');
              this.sliderform.typeid.setValue('');
            }
            else{
              this.value_array = ['Med Articles','Medquiz','Expert Advice','Health Tips','Live Updates','HealthCare Videos'];
              this.linkFlag = false;
              this.prodCatFlag = false;
              this.sliderform.redirect_type.setValue(res.data[0].redirect_type);
              this.sliderform.type.setValue(res.data[0].type);
              this.sliderform.linkValue.setValue('');
              this.sliderform.typeid.setValue('');
            }
          }
        })

       
     
      }

      else if(type === 'subyoga'){

        this.subYogaFitnessForm.reset();
        //get single row by id
        this._adsService.get_single_sub_main_yoga_details(id).subscribe((res:any)=>{
              //get Dropdown categories
                this._adsService.get_yoga_videos_by_categoryId(res.data[0].categoryId).subscribe((d:any)=>{
                  this.yogavideos = d.data ;
                })


              this.sliderID = res.data[0]._id;
              this.subYogaFitnessForm.get('categoryid').setValue(res.data[0].categoryId);
              this.subYogaFitnessForm.get('subcategoryid').setValue(res.data[0].subCategoryId);
        })
        

      }

      else if(type === 'subfitness'){

        this.subYogaFitnessForm.reset();
            this._adsService.get_single_sub_main_fitness_details(id).subscribe((res:any)=>{

              this._adsService.get_fitness_videos_by_categoryId(res.data[0].categoryId).subscribe((p:any)=>{
                console.log(p)
                  this.fitnessvideos = p.data ;
              })

              this.sliderID = res.data[0]._id;
              this.subYogaFitnessForm.get('categoryid').setValue(res.data[0].categoryId);
              this.subYogaFitnessForm.get('subcategoryid').setValue(res.data[0].subCategoryId);

            });
      }

      else if(type === 'expertadvise'){
        this._adsService.get_single_sub_yoga_fitness_details(id).subscribe((res:any)=>{

          this._adsService.get_single_health_tips_categories_expert_advise(res.data[0].categoryId).subscribe((b:any)=>{
            this.yogavideos = b.data ;
            
          })


          this.sliderID = res.data[0]._id;
          this.subYogaFitnessForm.get('categoryid').setValue(res.data[0].categoryId);
          this.subYogaFitnessForm.get('subcategoryid').setValue(res.data[0].subCategoryId);

        });
      }

      else if(type === 'mainfitness'){

        this.subYogaFitnessForm.reset();
        this._adsService.get_single_sub_main_fitness_details(id).subscribe((res:any)=>{

          this._adsService.get_fitness_videos_by_categoryId(res.data[0].categoryId).subscribe((x:any)=>{
            this.fitnessvideos = x.data ;
          })
    
          this.sliderID = res.data[0]._id;

          this.subYogaFitnessForm.patchValue({
            categoryid :res.data[0].categoryId,
            subcategoryid:res.data[0].subCategoryId
          })
          // this.subYogaFitnessForm.get('categoryid').patchValue(res.data[0].categoryId);
          // this.subYogaFitnessForm.get('subcategoryid').patchValue(res.data[0].subCategoryId);
        })
      }

      else if(type === 'mainyoga'){

        this._adsService.get_single_sub_main_yoga_details(id).subscribe((res:any)=>{
          this._adsService.get_yoga_videos_by_categoryId(res.data[0].categoryId).subscribe((z:any)=>{
            this.yogavideos = z.data ;
          })

          this.sliderID = res.data[0]._id;
          this.mainYogaFitnessForm.patchValue({
            categoryid :res.data[0].categoryId,
            subcategoryid:res.data[0].subCategoryId
          })

       
          // this.mainYogaFitnessForm.get('categoryid').setValue(res.data[0].categoryId);
          // this.mainYogaFitnessForm.get('subcategoryid').setValue(res.data[0].subCategoryId);
        })
      }

     
      else if(type === 'ad3'){

        this._adsService.get_single_ad3_details(id).subscribe((res:any)=>{
          this.valueSelected = res.data[0].redirect_type;
          this.sliderID = res.data[0]._id;
          this.image_URL = res.data[0].image;
        });
        
      }

      else if(type === 'ad4'){
        this._adsService.get_single_ad4_details(id).subscribe((res:any)=>{

          this.ad4Form.get('link').setValue(res.data[0].link);
          this.sliderID = res.data[0]._id;
          this.image_URL = res.data[0].image;
        });
      }
      else if(type === 'ad7'){
        this._adsService.get_single_ad7_details(id).subscribe((res:any)=>{
          this.ad7Form.get('couponCode').setValue(res.data[0].couponCode);
          this.valueSelected = res.data[0].redirect_type;
          this.image_URL = res.data[0].image;
          this.sliderID =  res.data[0]._id;
        });
      
      }

      else if(type === 'slider5'){

        this._adsService.get_single_slider5_details(id).subscribe((res:any)=>{



          if(res.data[0].type === 0){
            this.product_array = this.inventoryList;
          }
          else{
            this.product_array = this.categoryList;
          }


          this.image_URL =  res.data[0].image;

          this.sliderID = res.data[0]._id;
          this.slider5Form.get('type').patchValue(res.data[0].type === 0 ? 'product' : 'category');
          this.slider5Form.get('typeid').patchValue(res.data[0].typeId);
        })
      

      }
      else if(type === 'trending_category'){
        data = this.trending_Cat_List.find((x)=> x._id === id);
        this.image_URL =  data.image;
        this.trendingCategoryForm.get('categoryId').setValue(data.categoryId);
        this.trendingCategoryForm.get('colorCode').setValue(data.offerBoxColor);
        this.trendingCategoryForm.get('offerText').setValue(data.offerBoxText);
        // this.cartEssentialForm.get('offerText').value(data.offerText);
        // this.cartEssentialForm.get('colorCode').value(data.offerBoxColor);
        this.sliderID = data._id;
      }
      else if(type === 'plan_your_diet'){
        data = this.play_Diet_List.find((x)=> x._id === id);

        this.dietPlanForm.get('dietplan').setValue(data.categoryId);
        this.sliderID = data._id;
        let input = {     
          'categoryId ':'',
          'dietId ':''
        }
        this.update_ad_slider_Trend_Plan_spot_Cart(type,input);
      }

      else if(type === 'spot_light'){

        this._adsService.get_single_spot_light_details(id).subscribe((res:any)=>{

          this.sliderID = res.data[0]._id;
          this.spotLightForm.get('medimall').setValue(res.data[0].isMedimall);
          if(res.data[0].type === 0){
            this.product_array = this.inventoryList;
            this.spotLightForm.get('type').setValue('product');
          }
          else{
            this.product_array = this.categoryList;
            this.spotLightForm.get('type').setValue('category');
          }
          this.spotLightForm.get('typeid').setValue(res.data[0].typeId);
          this.spotLightForm.get('offerText').setValue(res.data[0].offerText);
          this.spotLightForm.get('colorCode').setValue(res.data[0].colorCode);
          this.thumbnail_image_URL = res.data[0].thumbnail;
          this.image_URL = res.data[0].image;
        })

       
       
      }

      else if(type === 'cart_essentails'){


        this._adsService.get_single_cart_essentials_details(id).subscribe((res:any)=>{

          this._adsService.getCategoryWiseProductList(res.data[0].categoryId).subscribe((p:any)=>{
            this.categoryWiseProductList = p.data;
          })


          this.sliderID = res.data[0]._id;
            this.cartEssentialForm.get('categoryId').setValue(res.data[0].categoryId);
           // this.cartEssentialForm.get('productId').setValue(res.data[0].subCategoryId);
        })
       
      }


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

  dropDownChange(value:any){
      if(value === 'Medimall'){
        this.redirect_type = value;
        this.linkFlag = false;
        this.prodCatFlag = true;
        this.value_array = ['product','category'];
        this.sliderForm.get('typeid').reset();
        
        this.sliderForm.controls['type'].setValidators(Validators.required);
        this.sliderForm.controls['type'].updateValueAndValidity();
        this.sliderForm.controls['typeid'].setValidators(Validators.required);
        this.sliderForm.controls['typeid'].updateValueAndValidity();
        this.sliderForm.controls['linkValue'].clearValidators();
        this.sliderForm.controls['linkValue'].updateValueAndValidity();
        this.attemptedSubmit = false;
      }
      else if(value === 'Foliofit'){
        this.redirect_type = value;
        this.linkFlag = false;
        this.prodCatFlag = false;
        this.value_array = ['Fitness Club','Yoga','Diet Regime','Health Reminders','Nutri Chart','BMI'];
        this.product_array=[];
        this.sliderForm.controls['type'].reset();
        this.sliderForm.controls['typeid'].reset();
        this.sliderForm.controls['type'].setValidators(Validators.required);
        this.sliderForm.controls['type'].updateValueAndValidity();
        this.sliderForm.controls['typeid'].clearValidators();
        this.sliderForm.controls['typeid'].updateValueAndValidity();
        this.sliderForm.controls['linkValue'].clearValidators();
        this.sliderForm.controls['linkValue'].updateValueAndValidity();
        this.attemptedSubmit = false;
      }
      else if(value === 'Medfeed'){
        this.redirect_type = value;
        this.linkFlag = false;
        this.prodCatFlag = false;
        this.value_array = ['Med Articles','Medquiz','Expert Advice','Health Tips','Live Updates','HealthCare Videos'];
        this.product_array=[];
        this.sliderForm.controls['type'].reset();
        this.sliderForm.controls['typeid'].reset();
        this.sliderForm.controls['type'].setValidators(Validators.required);
        this.sliderForm.controls['type'].updateValueAndValidity();
        this.sliderForm.controls['typeid'].clearValidators();
        this.sliderForm.controls['typeid'].updateValueAndValidity();
        this.sliderForm.controls['linkValue'].clearValidators();
        this.sliderForm.controls['linkValue'].updateValueAndValidity();
        this.attemptedSubmit = false;
      }
      else if(value === 'External'){
        this.redirect_type = value;
        this.value_array = ['Link'];
        this.linkFlag = true;
        this.prodCatFlag = false;
        this.product_array=[];
        this.sliderForm.controls['linkValue'].reset();
        this.sliderForm.controls['linkValue'].setValidators(Validators.required);
        this.sliderForm.controls['linkValue'].updateValueAndValidity();
        this.sliderForm.controls['typeid'].clearValidators();
        this.sliderForm.controls['typeid'].updateValueAndValidity();
        this.sliderForm.controls['type'].clearValidators();
        this.sliderForm.controls['type'].updateValueAndValidity();
        this.attemptedSubmit = false;
      }
  }

  dropDownProductChange(value:any){
      if(value === 'product'){
        this.product_type = value;
        this.sliderForm.get('typeid').reset();
        this.product_array = this.inventoryList;
      }
      else if(value === 'category'){
        this.product_type = value;
        this.sliderForm.get('typeid').reset();
        //this.product_array = ['cat 1','cat 2','cat 3',];
        this.product_array = this.categoryList;
      }
      else{
      this.product_type = value;
      this.selectedValue = value;
      this.prod_cat_type_list = '';
      }
  }


  dropDownSlider5ProductChange(value:any){
    if(value === 'product'){
      this.product_type = value;
      this.slider5Form.get('typeid').reset();
      this.product_array = this.inventoryList;
    }
    else if(value === 'category'){
      this.product_type = value;
      this.slider5Form.get('typeid').reset();
      this.product_array = this.categoryList;
    }
    else{
    this.product_type = value;
    this.selectedValue = value;
    this.prod_cat_type_list = '';
    this.slider5Form.reset();
    }
}

  dropDownYogaProductChange(value:any){
    this.yogavideos = [];
        this._adsService.get_yoga_videos_by_categoryId(value).subscribe((res:any)=>{

          if(res.status){
            this.yogavideos = res.data ;
          }
          else{
             this.subYogaFitnessForm.get('subcategoryid').patchValue('',{onlySelf:true});
          }
          
        })
  }

  
  dropDownExpertAdviceProductChange(value:any){
      this.yogavideos = [];
        this._adsService.get_single_health_tips_categories_expert_advise(value).subscribe((res:any)=>{
          if(res.data.length != 0){
            this.yogavideos = res.data ;
          }
          else{
            this.subYogaFitnessForm.get('subcategoryid').patchValue('',{onlySelf:true});
          }
        })
  }

  
  dropDownFitnessProductChange(value:any){
        this.fitnessvideos = [];
        this._adsService.get_fitness_videos_by_categoryId(value).subscribe((res:any)=>{
          if(res.data.length != 0){
            this.fitnessvideos = res.data ;
          }
          else{
            this.subYogaFitnessForm.get('subcategoryid').patchValue('',{onlySelf:true});
          }
        })
  }

  dropDownDietPlanChange(value:any){
      this.dietPlanForm.get('dietplan').setValue(value);  
  }



  selectTypeChange(value:any){
    this.valueSelected = value;
  }

  productChange(value:any){
    this.prod_cat_type_list = value;
  }

  checkBoxChangeEvent(value:any){
    if(value === "On"){
      this.isMedimall = true;
    }
    else {
      this.isMedimall = false;
    }
  }

  changeColorCode(value:any){
    this.colorCode = value;
  }
  


  update_slider_1234_ad_25(data){
    this._adsService.update_Slider_1234_Ads_25_Details(data).subscribe((res)=>{
    })
  }


  update_main_yoga_fitness(type,data){
    this._adsService.update_main_yoga_fitness_Details(type,data).subscribe((res)=>{
    })
  }

  update_ad_slider_Trend_Plan_spot_Cart(type,data){
    if(type === 'ad3'){
      this._adsService.update_ad3_details(data).subscribe((res)=>{
      })
    }
    else if(type === 'ad4'){
      this._adsService.update_ad4_details(data).subscribe((res)=>{
      })
    }
    else if(type === 'ad7'){
      this._adsService.update_ad7_details(data).subscribe((res)=>{
      })
    }
    else if(type === 'slider5'){
      this._adsService.update_slider5_details(data).subscribe((res)=>{
      })
    }
  }

  setValidations(){
    if(this.sliderForm.get('redirect_type').value === "Medimall"){
      this.sliderForm.get('type').setValidators(Validators.required);
      this.sliderForm.get('type').updateValueAndValidity();  
      this.sliderForm.get('typeid').setValidators(Validators.required);
      this.sliderForm.get('typeid').updateValueAndValidity();  
      return;
    }

    else if(this.sliderForm.get('redirect_type').value === "External"){
      this.sliderForm.get('linkValue').setValidators(Validators.required);
      this.sliderForm.get('linkValue').updateValueAndValidity();  
      this.sliderForm.get('typeid').reset();
      return;
    }
    else {
      this.sliderForm.get('type').setValidators(Validators.required);
      this.sliderForm.get('type').updateValueAndValidity();  
      this.sliderForm.get('typeid').reset();
      this.sliderForm.get('linkValue').reset();
      return;
    }
  }



  save(type){
    // if(this.topCategoryForm.invalid){
    //   return;
    // }

    if(type === 'topcategories' || type === 'maincategory' || type === 'ad1' || type === 'ad6' || type === 'ad8'){
          if(this.uploadImage != ''){


          const formData = new FormData();
          this.addLoading = true;

            formData.append('sliderId',this.sliderID);
            formData.append('image',this.uploadImage);
          
            this._adsService.updateTopCategories(formData).subscribe((res:any)=>{
              if(res.status){
                Swal.fire({
                  text: 'Updated Successfully',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok',
                  confirmButtonColor:  '#3085d6',
                  imageHeight: 500,
                });
                
                this.addLoading = false;
                this.modalService.dismissAll();
                this.image_URL = '';
                this.getAllTopCategories();
                this.getAllMainCategories();
                this.getAllAd1();
                this.getAllAd6();
                this.getAllAd8();
              }
              else{
                
                this.addLoading = false;
              }
            })
          }
          else{
            this.addLoading = false;
            Swal.fire({
              text: 'Updated Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
          }
    }
    else if(type === 'slider1' || type === 'slider2' || type === 'slider3' || type === 'slider4'){

      if(this.sliderForm.invalid ){
        
        if(this.sliderForm.get('redirect_type').value === "Medimall"){
          this.sliderForm.controls['type'].setValidators(Validators.required);
          this.sliderForm.controls['type'].updateValueAndValidity();  
          this.sliderForm.controls['typeid'].setValidators(Validators.required);
          this.sliderForm.controls['typeid'].updateValueAndValidity();  
          this.sliderForm.controls['linkValue'].clearValidators();
          this.sliderForm.controls['linkValue'].updateValueAndValidity();  
          return;
        }
    
        else if(this.sliderForm.get('redirect_type').value === "External"){
          this.sliderForm.controls['linkValue'].setValidators(Validators.required);
          this.sliderForm.controls['linkValue'].updateValueAndValidity();  
          this.sliderForm.controls['type'].clearValidators();
          this.sliderForm.controls['type'].updateValueAndValidity();  
          this.sliderForm.controls['typeid'].clearValidators();
          this.sliderForm.controls['typeid'].updateValueAndValidity();  
          return;
        }
        else {
          this.sliderForm.controls['type'].setValidators(Validators.required);
          this.sliderForm.controls['type'].updateValueAndValidity(); 
          this.sliderForm.controls['linkValue'].clearValidators();
          this.sliderForm.controls['linkValue'].updateValueAndValidity(); 
          this.sliderForm.controls['typeid'].clearValidators();
          this.sliderForm.controls['typeid'].updateValueAndValidity();   
          return;
        }
      }
       
  
      const formData = new FormData();


        this.addLoading = true;
        if(this.uploadImage != undefined){
            if(this.redirect_type === "Medimall"){
              formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
              formData.append('type',this.sliderForm.get('type').value);
              formData.append('typeId',this.sliderForm.get('typeid').value);
              formData.append('image',this.uploadImage);
            }
  
            else if(this.redirect_type === "External"){
              formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
              formData.append('type',this.sliderForm.get('linkValue').value);
              formData.append('image',this.uploadImage);
            }
  
            else{
              formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
              formData.append('type',this.sliderForm.get('type').value);
              formData.append('image',this.uploadImage);
            }
        }
        else{
          if(this.redirect_type === "Medimall"){
            formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
            formData.append('type',this.sliderForm.get('type').value);
            formData.append('typeId',this.sliderForm.get('typeid').value);
          }
  
          else if(this.redirect_type === "External"){
            formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
            formData.append('type',this.sliderForm.get('linkValue').value);
          }
  
          else{
            formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
            formData.append('type',this.sliderForm.get('type').value);
          }
        }
  
        this._adsService.add_Slider_1234_Ads_25_Details(type,formData).subscribe((res:any)=>{
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
            this.get_Slider_1234_ads_25_Details(type);
            this.modalService.dismissAll();
            this.initValues();
          }
          else{
            Swal.fire({
              text:  res.data,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
          }
        })

    
    }

    else if(type === 'subyoga' || type === 'subfitness' || type === 'expertadvise'){

      if(this.subYogaFitnessForm.invalid){
        return;
      }
      this.addLoading = true;
      let data = {     
        'categoryId':this.subYogaFitnessForm.get('categoryid').value,
        'subCategoryId':this.subYogaFitnessForm.get('subcategoryid').value
    }
      this._adsService.add_sub_yoga_fitness_Details(type,data).subscribe((res:any)=>{
        if(res.status){
          Swal.fire({
            text: 'Successfully Added',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.modalService.dismissAll();
          this.subYogaFitnessForm.reset();
          this.get_sub_yoga_fitness_Details(type);
          this.get_expert_advise_list();
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text: 'Already Exist !!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }
      })

    }


    else if(type === 'mainyoga' || type === 'mainfitness' ){
      this.addLoading = true;
      let data = {     
        'categoryId':this.CategoryID,
        'subcategoryId':this.SubCategoryID
    }
      this._adsService.add_main_yoga_fitness_Details(type,data).subscribe((res:any)=>{
        if(res.status){
          Swal.fire({
            text:  'Successfully Updated',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.get_main_yoga_fitness(type);
          this.modalService.dismissAll();
          this.image_URL = '';
          this.addLoading = false;
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text: 'Already Exist !!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }
      })

    }
    

    else if(type === 'plan_your_diet'){
      this.addLoading = true;
      let data = {     
        'categoryId':this.CategoryID
    }
      this._adsService.add_plan_your_diet_details(data).subscribe((res:any)=>{
        if(res.status){
          Swal.fire({
            text:  type + ' Updated',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
        }
      })

    }
    else if(type === 'spot_light'){

      if(this.spotLightForm.invalid || this.image_URL === '' || this.thumbnail_image_URL === ''){
        return;
      }
      this.addLoading = true;
      const formData = new FormData();
      if(this.spotLightForm.get('medimall').value === true){
        formData.append('isMedimall',this.spotLightForm.get('medimall').value);
        formData.append('colorCode',this.colorCode);
        formData.append('offerText',this.spotLightForm.get('offerText').value);
        formData.append('type',this.spotLightForm.get('type').value ==='product' ? '0' : '1');
        formData.append('typeId',this.spotLightForm.get('typeid').value);
        formData.append('image',this.uploadImage);
        formData.append('thumbnail',this.thumbnailuploadImage);

      }
      else{
      formData.append('colorCode',this.colorCode);
      formData.append('offerText',this.spotLightForm.get('offerText').value);
      formData.append('type',this.spotLightForm.get('type').value ==='product' ? '0' : '1');
      formData.append('typeId',this.spotLightForm.get('typeid').value);
      formData.append('image',this.uploadImage);
      formData.append('thumbnail',this.thumbnailuploadImage);
      }
      this._adsService.add_spot_light_details(formData).subscribe((res:any)=>{
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
          this.spotLightForm.reset();
          this.modalService.dismissAll();
          this.get_spot_light_Details();
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text:  'Already Exist !!!!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }
      })

    }
    else if(type === 'cart_essentails'){

      if(this.cartEssentialForm.invalid){
        return;
      }

      this.addLoading = true;
      let input = {     
        'categoryId':this.cartEssentialForm.get('categoryId').value,
        //'subCategoryId':this.cartEssentialForm.get('productId').value
      }
      this._adsService.add_cart_essentials_details(input).subscribe((res:any)=>{
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
          this.get_cart_essential_Details();
          this.modalService.dismissAll();
        }
        else{
          //this.cartEssentialForm.get('productId').reset();
          this.addLoading = false;
          Swal.fire({
            text:  'Already Exist !!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }
      })

    }


    else if(type === 'slider5'){

      if(this.slider5Form.invalid || this.image_URL === ''){
        return;
      }

      this.addLoading = true;
      const formData = new FormData();
        formData.append('type',this.slider5Form.get('type').value ==='product' ? '0' : '1');
        formData.append('typeId',this.slider5Form.get('typeid').value);
        formData.append('image',this.uploadImage);

      this._adsService.add_slider5_details(formData).subscribe((res:any)=>{
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
          this.slider5Form.reset();
          this.modalService.dismissAll();
          this.getSlider5Details();
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text:  res.data,
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
  get u(){
    return this.uploadForm.controls;
  }

  onThumbnailChange(event:any,width:any,height:any){
    let setFlag :boolean = false;
      const reader = new FileReader();
      const file = event.target.files[0];


      reader.readAsDataURL(file); 
      const Img = new Image();
      Img.src = URL.createObjectURL(file);
    
      Img.onload = (e: any) => {
        if(e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width) ){
          setFlag = true;
          this.thumbnailuploadImage = file;
          let content = reader.result as string;
          this.thumbnail_image_URL = content;
         
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

  onChangeTrending(event:any,width:any,height:any){
    let setFlag :boolean = false;
      const reader = new FileReader();
      const file = event.target.files[0];


      reader.readAsDataURL(file); 
      const Img = new Image();
      Img.src = URL.createObjectURL(file);
    
      Img.onload = (e: any) => {
        this.uploadImage = file;
        let content = reader.result as string;
        this.image_URL = content;
        // if(e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width) ){
        //   setFlag = true;
        //   this.uploadImage = file;
        //   let content = reader.result as string;
        //   this.image_URL = content;
         
        // }
        // else{
        //   setFlag = true;
        //   Swal.fire({
        //           text: 'Invalid Image Dimension - '+ width +'x' + height,
        //           icon: 'warning',
        //           showCancelButton: false,
        //           confirmButtonText: 'Ok',
        //           confirmButtonColor:  '#3085d6',
        //           imageHeight: 500,
        //         });
        // }
      }

   
  }

  update(type:any){
    if(type === 'slider1' || type === 'slider2' || type === 'slider3' || type === 'slider4' || type === 'ad2' || type === 'ad5'){

      if(this.sliderForm.invalid ){
          return;
      }
    
     this.addLoading = true;
     const formData = new FormData();
      if(this.uploadImage != ''){
        if(this.sliderForm.get('redirect_type').value === 'Medimall'){
          formData.append('sliderId',this.sliderID);
          formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
          formData.append('type',this.sliderForm.get('type').value);
          formData.append('typeId',this.sliderForm.get('typeid').value);
          formData.append('image',this.uploadImage);
        }
        else if(this.sliderForm.get('redirect_type').value === 'External'){
          formData.append('sliderId',this.sliderID);
          formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
          formData.append('type',this.sliderForm.get('linkValue').value);
          formData.append('image',this.uploadImage);
        }
        else{
          formData.append('sliderId',this.sliderID);
          formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
          formData.append('type',this.sliderForm.get('type').value);
          formData.append('image',this.uploadImage);
        }
     
      }
      else{
        if(this.sliderForm.get('redirect_type').value === 'Medimall'){
          formData.append('sliderId',this.sliderID);
          formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
          formData.append('type',this.sliderForm.get('type').value);
          formData.append('typeId',this.sliderForm.get('typeid').value);
        }
        else if(this.sliderForm.get('redirect_type').value === 'External'){
          formData.append('sliderId',this.sliderID);
          formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
          formData.append('type',this.sliderForm.get('linkValue').value);
        }
        else{
          formData.append('sliderId',this.sliderID);
          formData.append('redirect_type',this.sliderForm.get('redirect_type').value);
          formData.append('type',this.sliderForm.get('type').value);
        }
      }

      this._adsService.update_Slider_1234_Ads_25_Details(formData).subscribe((res:any)=>{
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
          this.get_Slider_1234_ads_25_Details(type);
          this.modalService.dismissAll();
          this.sliderForm.reset();
          this.initValues();
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text: 'please provide all fields',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }
      })

    
    }

    else if(type === 'ad3'){

      if(this.image_URL != '' && this.valueSelected !=''){
      const formData = new FormData();
      this.addLoading = true;
      if(this.uploadImage != ''){

        formData.append('redirect_type',this.valueSelected);
        formData.append('sliderId',this.sliderID);
        formData.append('image',this.uploadImage);
      }
      else{
        
      formData.append('redirect_type',this.valueSelected);
      formData.append('sliderId',this.sliderID);
      }
        this._adsService.update_ad3_details(formData).subscribe((res:any)=>{
          if(res.status){
            Swal.fire({
              text: 'SuccessFully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.getAd3Details();
          }
        })
      }
      else{
        this.addLoading = false;
        Swal.fire({
          text: 'Please fill provided details',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
      }
    }


    
    else if(type === 'ad4'){

      if(this.ad4Form.invalid){
        return;
      }
      const formData = new FormData();
      this.addLoading = true;
      if(this.uploadImage != ''){
        formData.append('link',this.ad4Form.get('link').value);
        formData.append('sliderId',this.sliderID);
        formData.append('image',this.uploadImage);
      }
      else{
        formData.append('link',this.ad4Form.get('link').value);
        formData.append('sliderId',this.sliderID);
      }
      
        this._adsService.update_ad4_details(formData).subscribe((res:any)=>{
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
            this.modalService.dismissAll();
            this.image_URL = '';
            this.uploadImage = '';
            this.getAd4Details();
          }
        })
    }


    else if(type === 'ad7'){

      if(this.ad7Form.invalid){
        return;
      }
        const formData = new FormData();
        this.addLoading = true;
      if(this.uploadImage === ''){
        formData.append('couponCode','MED00045');
       // formData.append('couponCode',this.ad7Form.get('couponCode').value);
        formData.append('sliderId',this.sliderID);
      }
      else{
        formData.append('couponCode','MED00045');
      //.append('couponCode',this.ad7Form.get('couponCode').value);
      formData.append('sliderId',this.sliderID);
      formData.append('image',this.uploadImage);
      }
        this._adsService.update_ad7_details(formData).subscribe((res:any)=>{
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
            this.modalService.dismissAll();
            this.image_URL = '';
            this.uploadImage = '';
            this.getAd7Details();
          }
        })
    }



    else    if(type === 'spot_light'){
    
     
      if(type){

          if(this.spotLightForm.invalid || this.image_URL === '' || this.thumbnail_image_URL === ''){
            return;
          }

          this.addLoading = true;
          const formData = new FormData();
          if(this.uploadImage != '' && this.thumbnailuploadImage != ''){
              formData.append('isMedimall',this.spotLightForm.get('medimall').value);
              formData.append('type',this.spotLightForm.get('type').value === 'product' ? '0' : '1');
              formData.append('typeId',this.spotLightForm.get('typeid').value);
              formData.append('colorCode',this.spotLightForm.get('colorCode').value);
              formData.append('offerText',this.spotLightForm.get('offerText').value);
              formData.append('image',this.uploadImage);
              formData.append('thumbnail',this.thumbnailuploadImage);
              formData.append('spotlightId',this.sliderID);
          }
          else{
            
            formData.append('isMedimall',this.spotLightForm.get('medimall').value);
            formData.append('type',this.spotLightForm.get('type').value === 'product' ? '0' : '1');
            formData.append('typeId',this.spotLightForm.get('typeid').value);
            formData.append('colorCode',this.spotLightForm.get('colorCode').value);
            formData.append('offerText',this.spotLightForm.get('offerText').value);
            formData.append('spotlightId',this.sliderID);
          }
          this._adsService.update_spot_light_details(formData).subscribe((res:any)=>{
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
              this.get_spot_light_Details();
              this.modalService.dismissAll();
              this.initValues();
            }
            
          })
  
      }
      else{
        this.addLoading = false;
        Swal.fire({
                text:  "Please Fill Provided Details",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor:  '#3085d6',
                imageHeight: 500,
              });
      }
    
    }


    
    else    if(type === 'plan_your_diet'){
      if(this.dietPlanForm.invalid){
        return;
      }
     
      this.addLoading = true;
      let input ={
        'categoryId':this.dietPlanForm.get('dietplan').value,
        'dietId':this.sliderID
      }
          this._adsService.update_plan_your_diet_details(input).subscribe((res:any)=>{
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
              this.get_plan_Diet_Details();
              this.modalService.dismissAll();
              this.initValues();
            }
          })
  
    
    }

    else if(type === 'trending_category'){

      if(this.trendingCategoryForm.invalid){
        return;
      }
      const formData = new FormData();
      this.addLoading = true;
      if(this.uploadImage  != ""){
        formData.append('categoryId',this.trendingCategoryForm.get('categoryId').value);
        formData.append('offerBoxColor',this.trendingCategoryForm.get('colorCode').value);
        formData.append('offerBoxText',this.trendingCategoryForm.get('offerText').value);
        formData.append('image',this.uploadImage);
        formData.append('sliderId',this.sliderID);
      }
      else{
        formData.append('categoryId',this.trendingCategoryForm.get('categoryId').value);
        formData.append('offerBoxColor',this.trendingCategoryForm.get('colorCode').value);
        formData.append('offerBoxText',this.trendingCategoryForm.get('offerText').value);
        formData.append('sliderId',this.sliderID);
      }
      this._adsService.update_trending_category_details(formData).subscribe((res:any)=>{
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
          this.get_trending_category_Details();
          this.modalService.dismissAll();
          this.initValues();
        }
      })
    }

    else if(type === 'slider5'){
      if(this.slider5Form.invalid){
        return;
      }
      this.addLoading = true;
      const formData = new FormData();
      if(this.uploadImage  != ''){
        formData.append('type',this.slider5Form.get('type').value === 'product' ? '0' : '1' );
        formData.append('typeId',this.slider5Form.get('typeid').value);
        formData.append('image',this.uploadImage);
        formData.append('sliderId',this.sliderID);
      }
      else{
        formData.append('type',this.slider5Form.get('type').value === 'product' ? '0' : '1');
        formData.append('typeId',this.slider5Form.get('typeid').value);
        formData.append('sliderId',this.sliderID);
      }
      this._adsService.update_slider5_details(formData).subscribe((res:any)=>{
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
          this.getSlider5Details();
          this.modalService.dismissAll();
          this.initValues();
        }
      })
    }

    else if(type === 'subyoga'|| type === 'subfitness' || type === 'expertadvise'){

      if(this.subYogaFitnessForm.invalid){
        return;
      }
      this.addLoading = true;
      let data = {     
        'adsId':this.sliderID,
        'categoryId':this.subYogaFitnessForm.get('categoryid').value,
        'subCategoryId':this.subYogaFitnessForm.get('subcategoryid').value
      }
      this._adsService.update_sub_yoga_fitness_Details(data).subscribe((res:any)=>{
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
          this.modalService.dismissAll();
          this.get_sub_yoga_fitness_Details(type);
          this.get_expert_advise_list();
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text:  'Already Exist !!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }
      })

    }

    else if(type === 'mainyoga'){

      if(this.mainYogaFitnessForm.invalid){
        return;
      }
      this.addLoading = true;
      let data = {    
        'adsId':this.sliderID,
        'categoryId':this.mainYogaFitnessForm.get('categoryid').value,
        'subCategoryId':this.mainYogaFitnessForm.get('subcategoryid').value
      }
      this._adsService.update_main_yoga_fitness_Details(type,data).subscribe((res:any)=>{
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
          this.modalService.dismissAll();
          this.get_main_yoga_fitness(type);
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text:  'Already Exist !!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }
      })

    }

    
    else if( type === 'mainfitness'){

      if(this.subYogaFitnessForm.invalid){
        return;
      }
      this.addLoading = true;
      let data = {    
        'adsId':this.sliderID,
        'categoryId':this.subYogaFitnessForm.get('categoryid').value,
        'subCategoryId':this.subYogaFitnessForm.get('subcategoryid').value
      }
      this._adsService.update_main_yoga_fitness_Details(type,data).subscribe((res:any)=>{
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
          this.modalService.dismissAll();
          this.get_main_yoga_fitness(type);
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text:  'Already Exist !!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }
      })

    }

    else if(type === 'cart_essentails'){

      if(this.cartEssentialForm.invalid){
        return;
      }
      this.addLoading = true;
      let data = {     
        'cartId':this.sliderID,
        'categoryId':this.cartEssentialForm.get('categoryId').value,
        //'subCategoryId':this.cartEssentialForm.get('productId').value
      }
      this._adsService.update_cart_essentials_details(data).subscribe((res:any)=>{
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
          this.get_cart_essential_Details();
          this.modalService.dismissAll();
          this.cartEssentialForm.reset();
        }
        else{
          this.addLoading = false;
          Swal.fire({
            text:  'Already Exist !!',
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


  initValues(){
    this.redirect_type = '';
    this.product_type = '';
    this.prod_cat_type_list = '';
    this.image_URL = '';
    this.uploadImage = '';
    this.CategoryID  = '';
    this.sliderID = '';
    this.addLoading = false;
  }

  delete(type:any,id:any){
    if(type === 'slider1' || type === 'slider2' || type === 'slider3' || type === 'slider4' || type === 'ad2' || type === 'ad5'){

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
          this._adsService.delete_Slider_1234_Ads_25_Details(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.get_Slider_1234_ads_25_Details(type);
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  
      
       
    }

    else if(type === 'spot_light'){

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
          this._adsService.delete_spot_light_details(id).subscribe((res:any)=>{
            if(res !=''){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.get_spot_light_Details();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }

    
    else if(type === 'slider5'){

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
          this._adsService.delete_slider5_details(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.getSlider5Details();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }

    else if(type === 'subyoga'|| type === 'subfitness' || type === 'expertadvise'){

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
          this._adsService.delete_sub_yoga_fitness_Details(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.get_sub_yoga_fitness_Details(type);
                    this.get_expert_advise_list();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });

    }


    else if(type === 'cart_essentails'){
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
          this._adsService.delete_cart_essentials_details(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.get_cart_essential_Details();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }




  }

  close(){
    this.image_URL = '';
    this.thumbnail_image_URL = '';
    this.modalService.dismissAll();
    this.sliderForm.reset();
    this.slider5Form.reset();
    this.cartEssentialForm.reset();
    this.dietPlanForm.reset();
    this.spotLightForm.reset();
    this.topCategoryForm.reset();
    this.trendingCategoryForm.reset();
    this.subYogaFitnessForm.reset();
    this.attemptedSubmit = false;
    this.linkFlag = false;
    this.addLoading = false;
  }

  resetForms(){
    this.sliderForm.reset();
    this.slider5Form.reset();
    this.cartEssentialForm.reset();
    this.dietPlanForm.reset();
    this.spotLightForm.reset();
    this.topCategoryForm.reset();
    this.trendingCategoryForm.reset();
    this.subYogaFitnessForm.reset();
    this.ad4Form.reset();
    this.ad7Form.reset();
  }

  handleFilter(value){

    let listing :any =[];
    if(this.sliderForm.get('type').value === 'product'){
      if (value.length >= 1) {
        listing = this.inventoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      }
      else if(value ==='') {
        this.getInventroyDetails();
        this.product_array = this.inventoryList;
      }
      
      else {
        this.getInventroyDetails();
        this.product_array = this.inventoryList;
      }
    }

    else{
      if (value.length >= 1) {
        listing = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      } 
      else if(value ==='') {
        this.getCategoryDetails();
        this.product_array = this.categoryList
      }
      
      else {
        this.getCategoryDetails();
        this.product_array = this.categoryList
      }
    }
   
  }


  handleFilterSpotLight(value){

    let listing :any =[];
    if(this.spotLightForm.get('type').value === 'product'){
      if (value.length >= 1) {
        listing = this.inventoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      }
      else if(value ==='') {
        this.getInventroyDetails();
        this.product_array = this.inventoryList;
      }
      
      else {
        this.getInventroyDetails();
        this.product_array = this.inventoryList;
      }
    }

    else{
      if (value.length >= 1) {
        listing = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      } 
      else if(value ==='') {
        this.getCategoryDetails();
        this.product_array = this.categoryList
      }
      
      else {
        this.getCategoryDetails();
        this.product_array = this.categoryList
      }
    }
   
  }

  handleSlider5Filter(value){

    let listing :any =[];
    if(this.slider5Form.get('type').value === 'product'){
      if (value.length >= 1) {
        listing = this.inventoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      }
      else if (value.length >= 3) {
        listing = this.inventoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      }

      else if( value === ''){
        this.getInventroyDetails();
        this.product_array = this.inventoryList;
      }
      else {
        this.getInventroyDetails();
        this.product_array = this.inventoryList;
      }
    }

    else{
      if (value.length >= 1) {
        listing = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      }
      else   if (value.length >= 3) {
        listing = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.product_array = listing;
      }
      else if(value ===''){
        this.getCategoryDetails();
        this.product_array = this.categoryList
      }
       else {
        this.getCategoryDetails();
        this.product_array = this.categoryList
      }
    }
   
  }

  
  handleFilterSpotlight(value){

    if(this.spotLightForm.get('type').value === 'product'){
      if (value.length >= 3) {
        this.product_array = this.inventoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } else {
        this.getInventroyDetails();
        this.product_array = this.inventoryList;
      }
    }

    else{
      if (value.length >= 1) {
        this.product_array = this.categoryList.filter(
          (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } else {
        this.getCategoryDetails();
        this.product_array = this.categoryList
      }
    }
   
  }

  handleFilterCategory(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing= this.categoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.categoryList = listing;
    }
    else  if (value.length >= 3) {
      listing= this.categoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.categoryList = listing;
    }
    else {
      this.getCategoryDetails();
        this.categoryList = this.categoryList;
    }
  }

  handleFilterProduct(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.inventoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.inventoryList = listing;
    }
    else if (value.length >= 3) {
      listing = this.inventoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.inventoryList = listing;
    }
    else {
      this.getInventroyDetails();
        this.inventoryList = this.inventoryList
    }
  }


  handleValueCategory(value){
    this.selectedCat = value;
    //this.cartEssentialForm.get('productId').reset();
    this._adsService.getCategoryWiseProductList(value).subscribe((res:any)=>{
      this.categoryWiseProductList = res.data; 
    })
  }

  handleCategoryWiseFilterProduct(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.categoryWiseProductList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.categoryWiseProductList = listing;
    } else {
        this._adsService.getCategoryWiseProductList(this.selectedCat).subscribe((res:any)=>{
          this.categoryWiseProductList = res.data;
        })
    }
  }

  handleFilterHealthTip(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.healthTipCategory.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.healthTipCategory = listing;
    } 
    else if (value.length >= 3) {
      listing = this.healthTipCategory.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.healthTipCategory = listing;
    } 
    else if(value === ''){
      this.getHealthTipCategory();
        this.healthTipCategory = this.healthTipCategory
    }
    else {
      this.getHealthTipCategory();
        this.healthTipCategory = this.healthTipCategory
    }
  }

  handleFilterQuestions(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.yogavideos.filter(
        (s) => s.question.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogavideos = listing;
    } 
    else   if (value.length >= 3) {
      listing = this.yogavideos.filter(
        (s) => s.question.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogavideos = listing;
    } 
    else if(value === ''){
      this._adsService.get_single_health_tips_categories_expert_advise(this.subYogaFitnessForm.get('categoryid').value).subscribe((res:any)=>{
        this.yogavideos = res.data;
      });
    }
    else {
      this._adsService.get_single_health_tips_categories_expert_advise(this.subYogaFitnessForm.get('categoryid').value).subscribe((res:any)=>{
        this.yogavideos =  res.data;
      });
    }
  }

  handleFilterDietPlan(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.dietPlanList.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.dietPlanList = listing;
    } 

    else if (value.length >= 3) {
      listing = this.dietPlanList.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.dietPlanList = listing;
    } 
    else if(value === ''){
      this.getDietPlanDetails();
        this.dietPlanList = this.dietPlanList
    }
    else {
      this.getDietPlanDetails();
        this.dietPlanList = this.dietPlanList
    }
  }

  handleFilterYogaCategory(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.yogaCategory.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogaCategory = listing;
    } 

    else if (value.length >= 3) {
      listing = this.yogaCategory.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogaCategory = listing;
    } 
    else if(value === ''){
      this.getYogacategory();
        this.yogaCategory = this.yogaCategory
    }
    else {
      this.getYogacategory();
        this.yogaCategory = this.yogaCategory
    }
  }


  handleFilterYogaCategoryVideos(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.yogavideos.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogavideos = listing;
    } 
    else if (value.length >= 3) {
      listing = this.yogavideos.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.yogavideos = listing;
    } 

    else if(value === ''){
      this._adsService.get_yoga_videos_by_categoryId(this.mainYogaFitnessForm.get('categoryid').value).subscribe((res:any)=>{

        this.yogavideos = res.data ;
    });
    }

    else{
      this._adsService.get_yoga_videos_by_categoryId(this.mainYogaFitnessForm.get('categoryid').value).subscribe((res:any)=>{

        this.yogavideos = res.data ;
    });
    }
   
  }

  handleFilterFitnessCategory(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.fitnessCategory.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.fitnessCategory = listing;
    } 

    else if (value.length >= 3) {
      listing = this.fitnessCategory.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.fitnessCategory = listing;
    } 
    else if(value === ''){
      this.getFitnesscategory();
        this.fitnessCategory = this.fitnessCategory
    }
    else {
      this.getFitnesscategory();
        this.fitnessCategory = this.fitnessCategory
    }
  }

  handleFilterFitnessCategoryVideos(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.fitnessvideos.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.fitnessvideos = listing;
    } 
    else if (value.length >= 3) {
      listing = this.fitnessvideos.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.fitnessvideos = listing;
    } 

    else if(value === ''){
      this._adsService.get_fitness_videos_by_categoryId(this.subYogaFitnessForm.get('categoryid').value).subscribe((res:any)=>{
        
          this.fitnessvideos = res.data ;
        });
    }

    else{
      this._adsService.get_fitness_videos_by_categoryId(this.subYogaFitnessForm.get('categoryid').value).subscribe((res:any)=>{
        
        this.fitnessvideos = res.data ;
      });
    }
  }

}
