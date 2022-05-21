import { Component, OnInit , ViewContainerRef,ViewChild,  Pipe, PipeTransform} from '@angular/core';
import { NgbModal, ModalDismissReasons ,NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import { Router }  from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import * as $ from 'jquery';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { FormGroup,FormBuilder,Validators, Form } from '@angular/forms';
import { AdsSeasonalOffersService } from 'src/app/services/ads-seasonal-offers.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { SharedServiceService } from 'src/app/shared-service.service';
import { MultiSelectComponent } from "@progress/kendo-angular-dropdowns";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-ads-seasonal-offers',
  templateUrl: './ads-seasonal-offers.component.html',
  styleUrls: ['./ads-seasonal-offers.component.scss']
})
export class AdsSeasonalOffersComponent implements OnInit {

  
  @ViewChild("multiselect") public multiselect: MultiSelectComponent;

  public closeResult: string;
  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;
  public attemptedSubmit :boolean = false;
  public minDate:any;
  public todayDate:any;
  public minTime :any;
  public todayTime :any;
  public selectedCat :any;
  public hasError :boolean = false;


    //NEW VARIABLES

    public permissions :any = [];
    public user :any = [];
    public currentPrivilages :any = [];
    public aciveTagFlag :boolean = true;
    public editFlag :boolean;
    public deleteFlag :boolean;
    public viewFlag :boolean;
    public addLoading :boolean = false;

    public editorChoiceList :any = [];
    public vocalLocalList :any = [];
    public energizeWorkoutList :any =[];
    public inventoryList :any = [];
    public categoryList :any = [];
    public immunityBoosterList :any = [];
    public topCategoriesList :any = [];
    public budgetStoreList :any = [];

    public setYourDealList :any = [];
    public setNewOffersList :any = [];


    public sliderId :any;
    public image_URL :any = '';
    public uploadImage :any = '';
    public editor_Vocal_EnergizeForm :FormGroup;
    public immunityBoosterForm :FormGroup;
    public topCategoriesForm :FormGroup;
    public budgetStoreForm :FormGroup;
    public setDealForm :FormGroup;
    public setNewOfferForm :FormGroup;


  constructor(private modalService: NgbModal,
    private _route:Router,
    private intl: IntlService,
    private permissionService:PermissionService,
    private location: Location,  
    private _formBuilder:FormBuilder,
    private _adsSeasonalService:AdsSeasonalOffersService,
    private shared_Service:SharedServiceService,) { }

    private tabSet: ViewContainerRef;

    @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
      this.tabSet = content;
    };

    ngAfterViewInit() {
      localStorage.clear();
      //console.log(this.tabSet.activeTab);
    }


    selectedTab = '';
  ngOnInit(): void {

    
    this.todayDate = this.shared_Service.disablePastDate();

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }


    this.editor_Vocal_EnergizeForm = this._formBuilder.group({
      categoryid :['',Validators.required],
      subcategoryid :['',Validators.required]
    })

    this.immunityBoosterForm = this._formBuilder.group({
      categoryid :['',Validators.required],
      subcategoryid :['',Validators.required]
    })

    this.topCategoriesForm = this._formBuilder.group({
      categoryid :['',Validators.required],
      subcategoryid :['',Validators.required]
    })

    this.budgetStoreForm = this._formBuilder.group({
      categoryid :['',Validators.required],
      price :['',Validators.required]
    })

    this.setDealForm = this._formBuilder.group({
      dealname :['',Validators.required],
      startingdate :['',Validators.required],
      endingdate :['',Validators.required],
      startingtime :['',Validators.required],
      endingtime :['',Validators.required],
      limit :['',Validators.compose([Validators.required]) ],
    })


    this.setNewOfferForm = this._formBuilder.group({
      offername :['',Validators.required],
    })




    let tabselected =  localStorage.getItem("TabID");
    if(tabselected!=''){
      if(tabselected  == 'tab-selectbyid3'){
        this.selectedTab = 'tab-selectbyid3';
        this.getSetNewOffersDetails();
      }
    }
    else{
      localStorage.clear();
      this.selectedTab = '';
    }

    this.get_editors_vocal_energize_details();
    this.getimmunityBoosterDetails();
    this.getTopCategoriesDetails();
    this.getBudgetStoreDetails();
    this.getCategoryDetails();
    this.getSetYourDealsDetails();
    this.getSetNewOffersDetails();
   

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


  getCategoryDetails(){
    this._adsSeasonalService.getCategoryListing().subscribe((res:any)=>{
      this.categoryList = res.data;
    })
  }

  getimmunityBoosterDetails(){
    this._adsSeasonalService.get_immunity_booster_details().subscribe((res:any)=>{
      this.immunityBoosterList = res.data;
    })
  }

  getTopCategoriesDetails(){
    this._adsSeasonalService.get_top_categories_details().subscribe((res:any)=>{
      this.topCategoriesList = res.data;
    })
  }

  getBudgetStoreDetails(){
    this._adsSeasonalService.get_budget_store_details().subscribe((res:any)=>{
      this.budgetStoreList = res.data;
    })
  }



  get_editors_vocal_energize_details(){
    this._adsSeasonalService.get_editor_vocal_energize_details().subscribe((res:any)=>{
      this.editorChoiceList = res.data.filter((item) => {
        return item.sliderType === "editors_choice"
      })

      this.vocalLocalList = res.data.filter((item) => {
        return item.sliderType === "vocal_local"
      })

      
      this.energizeWorkoutList = res.data.filter((item) => {
        return item.sliderType === "energize_workout"
      })

    })
  }

  getSetYourDealsDetails(){
    this._adsSeasonalService.get_set_your_deals_details().subscribe((res:any)=>{
      this.setYourDealList = res.data;
    })
  }

  getSetNewOffersDetails(){
    this._adsSeasonalService.get_set_your_offers_details().subscribe((res:any)=>{
      this.setNewOffersList = res.data;
    })
  }



  
  open(content,Value:any,id:any,type:any) {
    if(Value === 'add'){
      this.resetForms();
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if(Value === 'edit'){
      this.uploadImage = '';
      if(type === 'editors_choice' || type === 'vocal_local' || type === 'energize_workout'){
          this._adsSeasonalService.get_single_editor_vocal_energize_details(id).subscribe((res:any)=>{
           
            this._adsSeasonalService.getCategoryWiseProductList(res.data[0].categoryId).subscribe((p:any)=>{
              this.inventoryList = p.data;
            })

            this.image_URL = res.data[0].image;
            this.sliderId = res.data[0]._id;
            this.editor_Vocal_EnergizeForm.get('categoryid').setValue(res.data[0].categoryId);
            this.editor_Vocal_EnergizeForm.get('subcategoryid').setValue(res.data[0].ProductId);
          })
      }

      else if(type === 'immunity_booster'){
        this._adsSeasonalService.get_single_immunity_booster_details(id).subscribe((res:any)=>{

          this._adsSeasonalService.getCategoryWiseProductList(res.data.categoryId).subscribe((p:any)=>{
            this.inventoryList = p.data;
          })

          this.sliderId = res.data._id;
          this.immunityBoosterForm.get('categoryid').setValue(res.data.categoryId);
          this.immunityBoosterForm.get('subcategoryid').setValue(res.data.ProductId);
        })
      }

      else if(type === 'top_categories'){
        this._adsSeasonalService.get_single_top_categories_details(id).subscribe((res:any)=>{

          this._adsSeasonalService.getCategoryWiseProductList(res.data[0].categoryId).subscribe((p:any)=>{
            this.inventoryList = p.data;
          })
          this.image_URL = res.data[0].image;
          this.sliderId = res.data[0]._id;
          this.topCategoriesForm.get('categoryid').setValue(res.data[0].categoryId);
          this.topCategoriesForm.get('subcategoryid').setValue(res.data[0].ProductId);
        })
      }


      else if(type === 'budget_store'){
        this._adsSeasonalService.get_single_budget_store_details(id).subscribe((res:any)=>{
         
          this._adsSeasonalService.getCategoryWiseProductList(res.data[0].categoryId).subscribe((p:any)=>{
            this.inventoryList = p.data;
          })

          this.image_URL = res.data[0].image;
          this.sliderId = res.data[0]._id;
          this.budgetStoreForm.get('categoryid').setValue(res.data[0].categoryId);
          this.budgetStoreForm.get('price').setValue(res.data[0].priceUnder);
        })
      }

      else if(type === 'set_deal'){
        this._adsSeasonalService.get_single_set_your_deals_details(id).subscribe((res:any)=>{

          this.sliderId = res.data._id;
          this.setDealForm.get('dealname').setValue(res.data.name);
          this.setDealForm.get('startingdate').setValue(res.data.starting_date);
          this.setDealForm.get('endingdate').setValue(res.data.ending_date);
          this.setDealForm.get('startingtime').setValue(res.data.starting_time);
          this.setDealForm.get('endingtime').setValue(res.data.ending_time);
          this.setDealForm.get('limit').setValue(res.data.purchase_limit);
        })
      }

      else if(type === 'set_new_offer'){
        this._adsSeasonalService.get_single_set_your_offers_details(id).subscribe((res:any)=>{
          
          this.sliderId = res.data._id;
          this.setNewOfferForm.get('offername').setValue(res.data.name);
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
  

    public itemDisabled(itemArgs: { dataItem: string; index: number }) {
      return itemArgs.index === 2; // disable the 3rd item
    }



  redirectToOffers(id){
    if(this.editFlag){
      this.selectedTab = 'tab-selectbyid3';
      this._route.navigate(['/ads/ads-setnewoffer', id]);
      localStorage.setItem("TabID",'tab-selectbyid3')
    }
  }

  setDeal(id){
    if(this.editFlag){
      this._route.navigate(['/ads/ads-setyourdeal', id])
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


  save(type:any){
       if(type === 'editors_choice' || type === 'vocal_local' || type === 'energize_workout'){
        if(this.editor_Vocal_EnergizeForm.invalid){
          return;
        }
        
        const formData = new FormData();
        this.addLoading = true;
        if(this.uploadImage != undefined){
          formData.append('sliderType',type);
          formData.append('categoryId',this.editor_Vocal_EnergizeForm.get('categoryid').value);
          formData.append('ProductId',this.editor_Vocal_EnergizeForm.get('subcategoryid').value);
          formData.append('image',this.uploadImage);
        }
        
          this._adsSeasonalService.update_editor_vocal_energize_details(formData).subscribe((res:any)=>{
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
              this.image_URL = '';
              this.get_editors_vocal_energize_details();
            }
          })
        
      }

      else if(type === 'immunity_booster'){
        if(this.immunityBoosterForm.invalid){
          return;
        }
        
        const formData = new FormData();
        this.addLoading = true;
        if(this.uploadImage != undefined){
          formData.append('sliderType',type);
          formData.append('categoryId',this.immunityBoosterForm.get('categoryid').value);
          formData.append('ProductId',this.immunityBoosterForm.get('subcategoryid').value);
        }
        
          this._adsSeasonalService.update_immunity_booster_details(formData).subscribe((res:any)=>{
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
              this.image_URL = '';
              this.getimmunityBoosterDetails();
            }
            else{
              this.addLoading = false;
              this.immunityBoosterForm.get('subcategoryid').reset();
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


      else if(type === 'top_categories'){
        if(this.topCategoriesForm.invalid || this.image_URL === ''){
          return;
        }
        
        const formData = new FormData();
        this.addLoading = true;
        if(this.uploadImage != ''){
          formData.append('image',this.uploadImage);
          formData.append('categoryId',this.topCategoriesForm.get('categoryid').value);
          this.topCategoriesForm.get('subcategoryid').value.forEach((element,index) => {
            formData.append('ProductId['+index+']',element);
          });
        }
        
          this._adsSeasonalService.update_top_categories_details(formData).subscribe((res:any)=>{
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
              this.image_URL = '';
              this.getTopCategoriesDetails();
            }
            else{
              this.addLoading = false;
              this.topCategoriesForm.get('subcategoryid').reset();
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


      else if(type === 'budget_store'){
        if(this.budgetStoreForm.invalid || this.image_URL === ''){
          return;
        }
        
        const formData = new FormData();
        this.addLoading = true;
        if(this.uploadImage != ''){
          formData.append('image',this.uploadImage);
          formData.append('priceUnder',this.budgetStoreForm.get('price').value);
          formData.append('categoryId',this.budgetStoreForm.get('categoryid').value);
          // this.budgetStoreForm.get('categoryid').value.forEach((element,index) => {
          //   formData.append('categoryId['+index+']',element);
          // });
        }
        
          this._adsSeasonalService.update_budget_store_details(formData).subscribe((res:any)=>{
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
              this.image_URL = '';
              this.getBudgetStoreDetails();
            }
            else{
              this.addLoading = false;
              this.budgetStoreForm.get('subcategoryid').reset();
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


      else if(type === 'set_deal'){


        if(this.setDealForm.invalid){
          return;
        }


        let startdate = new Date(this.setDealForm.get('startingdate').value).toJSON('en-US');
        let enddate = new Date(this.setDealForm.get('endingdate').value).toJSON('en-US');

        var start = new Date(this.setDealForm.get('startingdate').value)
        var datePipe = new DatePipe('en-US');
        var value = datePipe.transform(start, 'yyyy-MM-dd hh:mm:ssZ');
        console.log(value, 'start');

        // var start = new Date(this.setDealForm.get('endingdate').value)
        // var datePipe = new DatePipe('en-US');
        // var end = datePipe.transform(start, 'yyyy-MM-dd hh:mm:ssZZZZZ');
        // console.log(end, 'end');

       


        this.addLoading = true;
        let input = {
          'name' : this.setDealForm.get('dealname').value,
          'starting_date' :this.setDealForm.get('startingdate').value + 'T' +this.setDealForm.get('startingtime').value +':00Z',
          'ending_date' : this.setDealForm.get('endingdate').value  + 'T' +this.setDealForm.get('endingtime').value +':00Z',
          'starting_time' : this.setDealForm.get('startingtime').value ,
          'ending_time' : this.setDealForm.get('endingtime').value ,
          'purchase_limit' : this.setDealForm.get('limit').value
        }
        
       console.log(input)


        this._adsSeasonalService.update_set_your_deals_details(input).subscribe((res:any)=>{
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
            this.setDealForm.reset();
            this.getSetYourDealsDetails();
          }
          else if (res.message === 'date'){
            this.addLoading = false;
            this.setDealForm.get('startingdate').reset();
            this.setDealForm.get('endingdate').reset();
            Swal.fire({
              text: res.data,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
          }
          else if (res.message === 'name'){
            this.addLoading = false;
            this.setDealForm.get('dealname').reset();
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

      else if(type === 'set_new_offer'){
        if(this.setNewOfferForm.invalid){
          return;
        }

        this.addLoading = true;
        let input = {
          'name' : this.setNewOfferForm.get('offername').value,
        }
        

        this._adsSeasonalService.update_set_your_offers_details(input).subscribe((res:any)=>{
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
            this.setNewOfferForm.reset();
            this.getSetNewOffersDetails();
          }
          else{
            this.addLoading = false;
            this.setNewOfferForm.get('offername').reset();
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

  }


  update(type:any){
    if(type === 'editors_choice' || type === 'vocal_local' || type === 'energize_workout'){
      if(this.editor_Vocal_EnergizeForm.invalid){
        return;
      }
      
      const formData = new FormData();
      this.addLoading = true;
      if(this.uploadImage != ''){
        formData.append('sliderType',type);
        formData.append('sliderId',this.sliderId);
        formData.append('categoryId',this.editor_Vocal_EnergizeForm.get('categoryid').value);
        formData.append('ProductId',this.editor_Vocal_EnergizeForm.get('subcategoryid').value);
        formData.append('image',this.uploadImage);
      }
      else{
        formData.append('sliderType',type);
        formData.append('sliderId',this.sliderId);
        formData.append('categoryId',this.editor_Vocal_EnergizeForm.get('categoryid').value);
        formData.append('ProductId',this.editor_Vocal_EnergizeForm.get('subcategoryid').value);
      }
      
        this._adsSeasonalService.update_editor_vocal_energize_details(formData).subscribe((res:any)=>{
          if(res.status){
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.image_URL = '';
            this.get_editors_vocal_energize_details();
          }
        })
      

    }


    else if(type === 'immunity_booster'){
      if(this.immunityBoosterForm.invalid){
        return;
      }
      
      const formData = new FormData();
      this.addLoading = true;
        formData.append('sliderId',this.sliderId);
        formData.append('categoryId',this.immunityBoosterForm.get('categoryid').value);
        formData.append('ProductId',this.immunityBoosterForm.get('subcategoryid').value);

        this._adsSeasonalService.update_immunity_booster_details(formData).subscribe((res:any)=>{
          if(res.status){
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.image_URL = '';
            this.getimmunityBoosterDetails();
          }
          else{
            this.addLoading = false;
            this.immunityBoosterForm.get('subcategoryid').reset();
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


    else if(type === 'top_categories'){
      if(this.topCategoriesForm.invalid || this.image_URL === ''){
        return;
      }
      
      const formData = new FormData();
      this.addLoading = true;
      if(this.uploadImage != ''){
        formData.append('sliderId',this.sliderId);
        formData.append('image',this.uploadImage);
        formData.append('categoryId',this.topCategoriesForm.get('categoryid').value);
        this.topCategoriesForm.get('subcategoryid').value.forEach((element,index) => {
          formData.append('ProductId['+index+']',element);
        });
      }
      else{
        formData.append('sliderId',this.sliderId);
        formData.append('categoryId',this.topCategoriesForm.get('categoryid').value);
        this.topCategoriesForm.get('subcategoryid').value.forEach((element,index) => {
          formData.append('ProductId['+index+']',element);
        });
      }
      
        this._adsSeasonalService.update_top_categories_details(formData).subscribe((res:any)=>{
          if(res.status){
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.image_URL = '';
            this.getTopCategoriesDetails();
          }
        })
    }

    else if(type === 'budget_store'){
      if(this.budgetStoreForm.invalid || this.image_URL === ''){
        return;
      }
      
      const formData = new FormData();
      this.addLoading = true;
      if(this.uploadImage != ''){
        formData.append('sliderId',this.sliderId);
        formData.append('image',this.uploadImage);
        formData.append('priceUnder',this.budgetStoreForm.get('price').value);
        formData.append('categoryId',this.budgetStoreForm.get('categoryid').value);
        // this.budgetStoreForm.get('categoryid').value.forEach((element,index) => {
        //   formData.append('categoryId['+index+']',element);
        // });
      }
      else{
        formData.append('sliderId',this.sliderId);
        formData.append('priceUnder',this.budgetStoreForm.get('price').value);
        formData.append('categoryId',this.budgetStoreForm.get('categoryid').value);
        // this.budgetStoreForm.get('categoryid').value.forEach((element,index) => {
        //   formData.append('categoryId['+index+']',element);
        // });
      }
      
        this._adsSeasonalService.update_budget_store_details(formData).subscribe((res:any)=>{
          if(res.status){
            Swal.fire({
              text: 'Successfully Updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.addLoading = false;
            this.modalService.dismissAll();
            this.image_URL = '';
            this.getBudgetStoreDetails();
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

    else if(type === 'set_deal'){
      if(this.setDealForm.invalid){
        return;
      }

      
      let startdate = new Date(this.setDealForm.get('startingdate').value).toJSON('en-US');
      let enddate = new Date(this.setDealForm.get('endingdate').value).toJSON('en-US');

      this.addLoading = true;
      let input = {
        'sliderId' : this.sliderId,
        'name' : this.setDealForm.get('dealname').value,
        'starting_date' :this.setDealForm.get('startingdate').value + 'T' +this.setDealForm.get('startingtime').value +':00Z',
        'ending_date' : this.setDealForm.get('endingdate').value  + 'T' +this.setDealForm.get('endingtime').value +':00Z',
        'starting_time' : this.setDealForm.get('startingtime').value,
        'ending_time' : this.setDealForm.get('endingtime').value,
        'purchase_limit' : this.setDealForm.get('limit').value
      }
      

      this._adsSeasonalService.update_set_your_deals_details(input).subscribe((res:any)=>{
        if(res.status){
          Swal.fire({
            text: 'Successfully Updated',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.modalService.dismissAll();
          this.setDealForm.reset();
          this.getSetYourDealsDetails();
        }
        else if (res.message === 'date'){
          this.addLoading = false;
          this.setDealForm.get('startingdate').reset();
          this.setDealForm.get('endingdate').reset();
          Swal.fire({
            text: res.data,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
        }
        else if (res.message === 'name'){
          this.addLoading = false;
          this.setDealForm.get('dealname').reset();
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

    else if(type === 'set_new_offer'){
      if(this.setNewOfferForm.invalid){
        return;
      }

      this.addLoading = true;
      let input = {
        'sliderId' : this.sliderId,
        'name' : this.setNewOfferForm.get('offername').value,
      }
      

      this._adsSeasonalService.update_set_your_offers_details(input).subscribe((res:any)=>{
        if(res.status){
          Swal.fire({
            text: 'Successfully Updated',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.modalService.dismissAll();
          this.setNewOfferForm.reset();
          this.getSetNewOffersDetails();
        }
      })

    }




  }

  delete(type:any,id:any){
    if(type === 'editors_choice' || type === 'vocal_local' || type === 'energize_workout'){

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
          this._adsSeasonalService.delete_editor_vocal_energize_details(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.get_editors_vocal_energize_details();
                    this.modalService.dismissAll();
                    this.image_URL = '';
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  
       
    }
    else if(type === 'set_deal'){

      
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
          this._adsSeasonalService.delete_set_your_deals_details(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.getSetYourDealsDetails();
                    this.modalService.dismissAll();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });


    }


    else if(type === 'set_new_offer'){

      
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
          this._adsSeasonalService.delete_set_your_offers_details(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.getSetNewOffersDetails();
                    this.modalService.dismissAll();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });


    }


    else if(type === 'immunity_booster'){

      
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
          this._adsSeasonalService.delete_immunity_booster_details(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.getimmunityBoosterDetails();
                    this.modalService.dismissAll();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });


    }

    else if(type === 'budget_store'){

      
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
          this._adsSeasonalService.delete_budget_store_details(id).subscribe((res:any)=>{
            if(res.status){
              Swal.fire({
                      text:'Successfully Deleted',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'Ok',
                      confirmButtonColor:  '#3085d6',
                      imageHeight: 500,
                    });
                    this.getBudgetStoreDetails();
                    this.modalService.dismissAll();
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });


    }



  }

  close(){
    this.modalService.dismissAll();
    this.editor_Vocal_EnergizeForm.reset();
    this.setDealForm.reset();
    this.setNewOfferForm.reset();
    this.immunityBoosterForm.reset();
    this.topCategoriesForm.reset();
    this.budgetStoreForm.reset();
    this.attemptedSubmit = false;
    this.uploadImage = '';
    this.addLoading = false;
    this.image_URL = '';
  }


  resetForms(){
    this.editor_Vocal_EnergizeForm.reset();
    this.setDealForm.reset();
    this.setNewOfferForm.reset();
    this.immunityBoosterForm.reset();
    this.topCategoriesForm.reset();
    this.budgetStoreForm.reset();
    this.attemptedSubmit = false;
    this.uploadImage = '';
    this.addLoading = false;
    this.image_URL = '';
  }
  
  handleFilterProduct(value){
    if (value.length >= 1) {
      this.inventoryList = this.inventoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
    }
  }

    
  handleFilterCatgory(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.categoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.categoryList = listing;
    } 
    else   if (value.length >= 3) {
      listing = this.categoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.categoryList = listing;
    } 
    else if (value === '') {
      this.getCategoryDetails();
      this.categoryList = this.categoryList;
    } else {
        this.getCategoryDetails();
        this.categoryList = this.categoryList;
        this.multiselect.toggle(false);
    }
  }

  StartingDateChange(val){
    
    // var nextDate = new Date(val)
    // nextDate.setDate(nextDate.getDate() + 1);
    // var datePipe = new DatePipe('en-US');
    // var end = datePipe.transform(nextDate, 'yyyy-MM-dd');
    this.minDate = val;
  }

  StartingTimeChange(val){
    this.minTime = val;
  }

  categoryChange(val){
    this.selectedCat = val;
    this._adsSeasonalService.getCategoryWiseProductList(val).subscribe((res:any)=>{
      this.inventoryList = res.data;
      this.editor_Vocal_EnergizeForm.get('subcategoryid').reset();
      this.immunityBoosterForm.get('subcategoryid').reset();
      this.budgetStoreForm.get('subcategoryid').reset();
    })
  }

  handleFilterCategory(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing= this.categoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.categoryList = listing;
    } else {
      this.getCategoryDetails();
        this.categoryList = this.categoryList;
    }
  }

  handleCategoryWiseFilterProduct(value){
    let listing :any = [];
    if (value.length >= 1) {
      listing = this.inventoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.inventoryList = listing;
    } else {
        this._adsSeasonalService.getCategoryWiseProductList(this.selectedCat).subscribe((res:any)=>{
          this.inventoryList = res.data;
        })
    }
  }


  alphaNumberOnly (e) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      this.hasError = true;
        return true;
    }

    this.hasError = false;
    e.preventDefault();
    return false;
  }



}
