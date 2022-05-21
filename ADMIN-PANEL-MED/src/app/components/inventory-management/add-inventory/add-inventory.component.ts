import { Component, OnInit,ViewChild, Output , ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { GroupResult, groupBy } from "@progress/kendo-data-query";
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { AddInventoryService } from 'src/app/services/add-inventory.service';
import { SharedServiceService } from 'src/app/shared-service.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectEvent,RemoveEvent, FileRestrictions } from "@progress/kendo-angular-upload";
import { ViewportScroller } from '@angular/common';
import { isConstructorDeclaration } from 'typescript';
import { TreeViewFilterSettings } from "@progress/kendo-angular-treeview";
import { EditorComponent } from '@progress/kendo-angular-editor';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpProgressEvent,
//   HttpEventType,
//   HttpResponse,
// } from "@angular/common/http";

// import { Observable, of, concat } from "rxjs";
// import { delay } from "rxjs/operators";


@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.scss']
})

export class AddInventoryComponent implements OnInit {
  @ViewChild('myfile') myfile: ElementRef;
  @Output() @ViewChild('editor') public editor: EditorComponent;


  public expandMatches = true;

  public pasteCleanupSettings = {
    attrs: {
      fontFamily: {
        default: "fontArchivo",
      },
      fontSize: {
        default: "30px",
      },
      textAlign: {
        default: "center",
      },
    },
    convertMsLists: false,
    removeHtmlComments: true,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: false,
    // removeMsStyles: false,
    removeInvalidHTML: false,
  };



  public filterSettings: TreeViewFilterSettings = {
    ignoreCase: false,
    operator: "startswith",
  };

  public imagePreviews: any = [];
  public VideoPreviews: any = [];
  public ImageRestrictions: FileRestrictions = {
    allowedExtensions: [".jpg", ".png",".jpeg"],
  };


  public VideoRestrictions: FileRestrictions = {
    allowedExtensions: [".mp4", ".x-m4v"],
  };

  public subCategories :any  =[];
 


  uploadSaveUrl = "saveUrl"; // should represent an actual API endpoint
  uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint


  

  public closeResult: string;
  public listType: Array<string> = ['Normal', 'Combo or buy n get n'];


      //NEW VARIABLES

      public permissions :any = [];
      public user :any = [];
      public currentPrivilages :any = [];
      public aciveTagFlag :boolean = true;
      public editFlag :boolean;
      public deleteFlag :boolean;
      public viewFlag :boolean;

    public medimallID :any ;
    public basicinfoForm :FormGroup;
    public productinfoForm :FormGroup;
    public substitutionForm :FormGroup;
    public categoryList :any = [];
    public AllcategoryList :any = [];
    public policyList :any = [];
    public AllpolicyList :any = [];
    public brandList :any = [];
    public AllbrandList :any = [];
    public UOMList :any = [];
    public AllUOMList :any = [];
    public UOMValueList :any = [];
    public AllUOMValueList :any = [];
    public AllProductList :any = [];
    public productList :any = [];
    public attemptedSubmit:boolean = false;
    selectedTab :any;
    public addLoading :boolean = false;
    public disableFlag :boolean = false;
    public videoLoading :boolean = false;
    public imageLoading :boolean = false;
    public img:boolean = false;
    public UOMID :any ;
    public minDate :any ;

    public product_editFlag :boolean = false;
    public value = ``;
    public dataItems: any[] = [];

    public edit_id:any = null;

    public formArray = [{
      _id : "",
      uom : "",
      sku : "",
      skuList : "",
      skuOrHsnNo : "",
      price : "",
      specialPrice : "",
      volume : "",
      expiryDate : "",
      stock : "",
      image : [],
      imagePreview : [],
      imageLoading : "",
      video : "",
      videoLoading : ""
    }];

    public formOption = {
      _id : "",
      uom : "",
      sku : "",
      skuList : "",
      skuOrHsnNo : "",
      price : "",
      specialPrice : "",
      volume : "",
      expiryDate : "",
      stock : "",
      image : [],
      imagePreview : [],
      imageLoading : "",
      video : "",
      videoLoading : ""
    };
    public textvalue = [0];
    public selectedBrandValues :any = [];


  constructor( private _router: Router,
    private modalService: NgbModal,
    private permissionService:PermissionService,
    private location: Location,
    private _addInvetoryService:AddInventoryService,
    public formBuilder:FormBuilder,
    private viewScroller: ViewportScroller,
    private activated_router:ActivatedRoute,
    private _sharedService:SharedServiceService) { 


      this.basicinfoForm =  this.formBuilder.group({
        categories: ['',Validators.required],
        brand: ['',Validators.required],
        policy: ['',Validators.required],
        productname: ['',Validators.required],
        prescription: [true],
        stockalert: ['',Validators.required],
        statuscount: ['',Validators.required],

      })

      this.productinfoForm = this.formBuilder.group({
        description: [''],
        warning: [''],
        direction_of_use: [''],
        side_effects: [''],
        content: [''],
        metatitle: [''],
        moreinfo: [''],
        metadescription: [''],
      })

      this.substitutionForm = this.formBuilder.group({
        tags: ['',Validators.required],
        relatedproducts: [''],
        substitution: [''],
        //pricing: ['',Validators.required],
      })
    }

    // public config1: DropzoneConfigInterface = {
    //   clickable: true,
    //   maxFiles: 1,
    //   autoReset: null,
    //   errorReset: null,
    //   cancelReset: null
    // };


  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }
    
    this.minDate = this._sharedService.disablePastDate();
    this.selectedTab = 'tab1';
    
    this.activated_router.paramMap.subscribe(res=>{
      this.edit_id = res.get('id')
      console.log(this.edit_id,"id");
      if(this.edit_id != null){
        this.product_editFlag = true;
        this._addInvetoryService.get_inventory_by_id(this.edit_id).subscribe((res:any)=>{
          console.log(res.data);
          this.setEditData(res.data);
        })
      }
      else{
        this.product_editFlag = false;
        this.getInventoryID();
      }
      
    })

    // this.user = JSON.parse(sessionStorage.getItem('userData'));

    // if(this.user != ''){
    //   this.permissionService.canActivate(this.location.path().split('/').pop())
    // }

    this.getCategoryList();
    this.getPolicyList();
    this.getBrandList();
    this.getUOMList();
    this.getInventoryList();


    if ($(window).width() < 992) {
      $('.dropdown-menu a').click(function(e){
        if($(this).attr('href') == '#')
          e.preventDefault();
        if($(this).next('.submenu').length){
          $(this).next('.submenu').toggle();
        }
        $('.dropdown').on('hide.bs.dropdown', function () {
          $(this).find('.submenu').hide();
        })
      });
    }

  }


  setEditData(data){

    
    this.getCategoryList();
    this.getPolicyList();
    this.getBrandList();
    this.getUOMList();

    this._addInvetoryService.get_all_product_listing('medicine').subscribe((res:any) => {
      this.AllProductList = res.data;
      this.productList = res.data.filter((x:any)=> x._id != data._id)
    })

    this._addInvetoryService.get_all_brands().subscribe((res:any)=>{
      this.brandList = res.data;
      this.AllbrandList = res.data;
  })

    this.medimallID = data.productId;
    this.value = data.moreInfo === "undefined" ?  '' : data.moreInfo;
    this.dataItems = data.categories;
    this.basicinfoForm.patchValue({
      brand:  data.brand[0],
      policy:  data.policy[0],
      categories: data.categories,
      productname: data.name,
      prescription:data.prescription,
      stockalert: data.stockAlert,
      statuscount: data.statusLimit,

    })

    this.productinfoForm.patchValue({
      description: data.description === "undefined" ?  '' : data.description,
      warning: data.warning === "undefined" ?  '' : data.warning ,
      direction_of_use: data.directionsOfUse === "undefined" ?  '' : data.directionsOfUse,
      side_effects: data.sideEffects === "undefined" ?  '' : data.sideEffects,
      content: data.content === "undefined" ?  '' : data.content,
      metatitle: data.metaTitles === "undefined" ?  '' : data.metaTitles ,
      metadescription: data.metaDescription === "undefined" ?  '' : data.metaDescription,
      moreinfo: data.moreInfo === "undefined" ?  '' : data.moreInfo,
      //pricing: ['',Validators.required],
    })

    this.substitutionForm.patchValue({
      tags: data.tags.toString(),
      relatedproducts: data.relatedProducts === null ? [] :  data.relatedProducts,
      substitution: data.substitutions === null ? [] : data.substitutions,
      //pricing: ['',Validators.required],
    })


    this.formArray = data.pricing;
    console.log(this.formArray);

    for(let i = 0;i<this.formArray.length;i++){
      this.imagePreviews = this.formArray[i].image;
      this.formArray[i].imagePreview = this.formArray[i].image;
      this._addInvetoryService.get_all_UOM_value_by_uom_id(this.formArray[i].uom).subscribe((res:any)=>{
        console.log(res.data);
        this.UOMValueList = res.data;
        this.formArray[i].skuList = res.data;
        this.formArray[i].sku = this.formArray[i].sku;
      })
    }
      
   


  }

  public itemDisabled(dataItem: any, index: number) {

    return dataItem._id; // disable the 2nd root item
  }

  tabChangeEvent(event){
    // console.log(event.nextId);
     //localStorage.setItem("TabID",event.nextId);
     if(event.nextId === 'tab2'){
       if(this.basicinfoForm.invalid){
        this.attemptedSubmit = false;
         this.selectedTab = event.activeId;
         return;
       }
     }
     else  if(event.nextId === 'tab3'){
      if(this.productinfoForm.invalid){
        this.attemptedSubmit = false;
        this.selectedTab = event.activeId;
        return;
      }
    }
    else  if(event.nextId === 'tab4'){
      if(this.substitutionForm.invalid){
        this.attemptedSubmit = false;
        this.selectedTab = event.activeId;
        return;
      }
    }
    else{
      this.selectedTab = event.nextId;
      this.attemptedSubmit = false;
    }
   }

  nextTab(tabRef:any,type:any,t){
    if(type === 'basicinfo'){
      this.viewScroller.scrollToPosition([0, 0]);
      if(this.basicinfoForm.invalid){
        this.attemptedSubmit = true;
          return;
      }
      else{
        t.select(tabRef); 
        this.attemptedSubmit = false;
      }
    }

    else  if(type === 'productdescription'){
      this.viewScroller.scrollToPosition([0, 0]);
      if(this.productinfoForm.invalid){
        this.attemptedSubmit = true;
          return;
      }
      else{
        t.select(tabRef); 
        this.attemptedSubmit = false;
      }
    }

    else  if(type === 'substitution'){
      this.viewScroller.scrollToPosition([0, 0]);
      if(this.substitutionForm.invalid){
        this.attemptedSubmit = true;
          return;
      }
      else{
        t.select(tabRef); 
        this.attemptedSubmit = false;
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
  getInventoryList(){
    let type = 'medicine';
    this._addInvetoryService.get_all_product_listing(type).subscribe((res:any) => {
        this.AllProductList = res.data;
        this.productList = res.data;
    })
  }


  getInventoryID(){
    let type = 'medicine';
    this._addInvetoryService.get_product_id_count(type).subscribe((res:any) => {
      console.log(res)
      if(res.data){
        this.medimallID = 'MED-01-00'+ res.data.count;
      }
    })
  }
 

  getCategoryList(){
    let type = 'medicine';
    this._addInvetoryService.get_all_category_listing(type).subscribe((res:any)=>{
        this.categoryList = res.data.categories;
        this.AllcategoryList = res.data.categories;
    })
  }

  getPolicyList(){
    this._addInvetoryService.get_all_policy().subscribe((res:any)=>{
        this.policyList = res.data;
        this.AllpolicyList = res.data;
    })
  }

  getBrandList(){
    this._addInvetoryService.get_all_brands().subscribe((res:any)=>{
        this.brandList = res.data;
        this.AllbrandList = res.data;
    })
  }

  getUOMList(){
    this._addInvetoryService.get_all_UOM().subscribe((res:any)=>{
        this.UOMList = res.data;
        this.AllUOMList = res.data;
    })
  }

  
 

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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



  public onUploadInit(args: any): void { }

  public onUploadError(args: any): void { }

  public onUploadSuccess(args: any): void { }


  preview(){
    this._router.navigate(['/inventory/add-new-product'])
  }


  addForm(){
    this.formArray.push({
      _id : "",
      uom : "",
      sku : "",
      skuList : "",
      skuOrHsnNo : "",
      price : "",
      specialPrice : "",
      volume : "",
      expiryDate : "",
      stock : "",
      image : [],
      imagePreview : [],
      imageLoading : "",
      video : "",
      videoLoading : ""
    });
    console.log(this.formArray)
  }
  removeForm(id){
    this.formArray.splice(id, 1);
  }

  trackByFn(index: any) {
    return index;
  }




  save(pricingForm :any = null,tabRef){
    if(this.basicinfoForm.invalid){
      this.viewScroller.scrollToPosition([0, 0]);
      this.attemptedSubmit = false;
      tabRef.select('tab1'); 
      return;
    }
    else  if(this.productinfoForm.invalid){
      this.viewScroller.scrollToPosition([0, 0]);
      this.attemptedSubmit = false;
      tabRef.select('tab2'); 
      return;
    }
    else  if(this.substitutionForm.invalid){
      this.viewScroller.scrollToPosition([0, 0]);
      this.attemptedSubmit = false;
      tabRef.select('tab3'); 
      return;
    }
    else  if(!pricingForm.valid){
      this.viewScroller.scrollToPosition([0, 0]);
      this.attemptedSubmit = false;
      tabRef.select('tab4'); 
      return;
    }

    
    for(let i=0;i<this.formArray.length;i++){
      if(!pricingForm.valid || this.formArray[i].uom === '' || this.formArray[i].sku === '' ||
      this.formArray[i].skuOrHsnNo === ''|| this.formArray[i].price === '' ||
      this.formArray[i].specialPrice === '' || this.formArray[i].volume === '' ||
      this.formArray[i].expiryDate === '' || this.formArray[i].stock === '' || this.formArray[i].image.length === 0)
      return false;
    }

    // if(this.imagePreviews.length === 0){
    //   return false;
    // }

    const formData = new FormData();
    this.addLoading = true;

    
    let tags_array = this.substitutionForm.get('tags').value.split(',')

    // let index =  this.formArray.findIndex((x:any,key:any) => x.image == key.image);
    // if (index > -1) {
    //    this.formArray.splice(index, 1);
    // }
    let finalData :any;
    finalData = this.formArray.map(i =>{
      return {
        "uom" : i.uom,
        "sku" : i.sku,
        "skuOrHsnNo" : i.skuOrHsnNo,
        "price" : i.price,
        "specialPrice" : i.specialPrice,
        "volume" : i.volume,
        "expiryDate" : i.expiryDate,
        "stock" : i.stock,
        "image" : i.image,
        "video" : i.video,
      }
    })
    console.log(finalData);

    let arr = [];
    this.basicinfoForm.get('categories').value.forEach((element:any) => {
      arr.push(element._id)
    });
    let input ;
    

    formData.append('type','medicine');
    formData.append('productId',this.medimallID);

    arr.forEach((element,index) => {
      formData.append('categories['+index+']',element);
    });


    formData.append('brand',this.basicinfoForm.get('brand').value);
    formData.append('policy',this.basicinfoForm.get('policy').value);
    formData.append('name',this.basicinfoForm.get('productname').value);
    formData.append('prescription',this.basicinfoForm.get('prescription').value);
    formData.append('stockAlert',this.basicinfoForm.get('stockalert').value);
    formData.append('statusLimit',this.basicinfoForm.get('statuscount').value);

    if(this.productinfoForm.get('description').value !=''){
      formData.append('description',this.productinfoForm.get('description').value);
    }

    if(this.productinfoForm.get('warning').value !=''){
      formData.append('warning',this.productinfoForm.get('warning').value);
    }

    if(this.productinfoForm.get('direction_of_use').value !=''){
      formData.append('directionsOfUse',this.productinfoForm.get('direction_of_use').value);
    }

    if(this.productinfoForm.get('side_effects').value !=''){
      formData.append('sideEffects',this.productinfoForm.get('side_effects').value);
    }

    if(this.productinfoForm.get('content').value !=''){
      formData.append('content',this.productinfoForm.get('content').value);
    }

    if(this.productinfoForm.get('metatitle').value !=''){
      formData.append('metaTitles',this.productinfoForm.get('metatitle').value);
    }

    if(this.productinfoForm.get('moreinfo').value !=''){
      formData.append('moreInfo',this.productinfoForm.get('moreinfo').value);
    }

    if(this.productinfoForm.get('metadescription').value !=''){
      formData.append('metaDescription',this.productinfoForm.get('metadescription').value);
    }
   
    tags_array.forEach((element,index) => {
      formData.append('tags['+index+']',element);
    });

    if(  this.substitutionForm.get('relatedproducts').value !=''){
      this.substitutionForm.get('relatedproducts').value.forEach((element,index) => {
        formData.append('relatedProducts['+index+']',element);
      });
    }

    if(this.substitutionForm.get('substitution').value !=''){
      this.substitutionForm.get('substitution').value.forEach((element,index) => {
        formData.append('substitutions['+index+']',element);
      });
    }

    formData.append('pricing',JSON.stringify(finalData));

    // finalData.forEach((element,index) => {
    //   formData.append('pricing['+index+'][uom]',element.uom);
    //   formData.append('pricing['+index+'][sku]',element.sku);
    //   formData.append('pricing['+index+'][skuOrHsnNo]',element.skuOrHsnNo);
    //   formData.append('pricing['+index+'][price]',element.price);
    //   formData.append('pricing['+index+'][specialPrice]',element.specialPrice);
    //   formData.append('pricing['+index+'][volume]',element.volume);
    //   formData.append('pricing['+index+'][expiryDate]',element.expiryDate);
    //   formData.append('pricing['+index+'][stock]',element.stock);
      
     
    //   formData.append('pricing['+index+'][image]',element.image[index]);

    //   formData.append('pricing['+index+'][video]',element.video);
    // });

 // element.image.forEach((ele,ind) => {
      //   formData.append('pricing['+index+'][image['+ind+']',ele);
      // });

    this._addInvetoryService.add_inventory_product(formData).subscribe((res:any)=>{
      console.log(res);
        if(res.status){
          this.addLoading = false;
          Swal.fire({
            text: 'Successfully Added',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
          });
          this._router.navigate(['/inventory/inventory-list/medicine']);
        }
        else{
          this.addLoading = false;
            Swal.fire({
              text: res.data,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
        }
    });


  }


  update(pricingForm :any = null,tabRef){
    if(this.basicinfoForm.invalid){
      this.viewScroller.scrollToPosition([0, 0]);
      this.attemptedSubmit = false;
      tabRef.select('tab1'); 
      return;
    }
    else  if(this.productinfoForm.invalid){
      this.viewScroller.scrollToPosition([0, 0]);
      this.attemptedSubmit = false;
      tabRef.select('tab2'); 
      return;
    }
    else  if(this.substitutionForm.invalid){
      this.viewScroller.scrollToPosition([0, 0]);
      this.attemptedSubmit = false;
      tabRef.select('tab3'); 
      return;
    }
    else  if(!pricingForm.valid){
      this.viewScroller.scrollToPosition([0, 0]);
      this.attemptedSubmit = false;
      tabRef.select('tab4'); 
      return;
    }

    for(let i=0;i<this.formArray.length;i++){
      if(!pricingForm.valid || this.formArray[i].uom === '' || this.formArray[i].sku === '' ||
      this.formArray[i].skuOrHsnNo === ''|| this.formArray[i].price === '' ||
      this.formArray[i].specialPrice === '' || this.formArray[i].volume === '' ||
      this.formArray[i].expiryDate === '' || this.formArray[i].stock === '' || this.formArray[i].image.length === 0)
      return false;
    }

    // if(this.imagePreviews.length === 0){
    //   return false;
    // }

    const formData = new FormData();
    this.addLoading = true;

    let finalData :any;
    finalData = this.formArray.map(i =>{
      return {
        "_id":i._id,
        "uom" : i.uom,
        "sku" : i.sku,
        "skuOrHsnNo" : i.skuOrHsnNo,
        "price" : i.price,
        "specialPrice" : i.specialPrice,
        "volume" : i.volume,
        "expiryDate" : i.expiryDate,
        "stock" : i.stock,
        "image" : i.image,
        "video" : i.video,
      }
    })
    console.log(finalData);

    
    let tags_array = this.substitutionForm.get('tags').value.split(',')

    // let index =  this.formArray.findIndex((x:any,key:any) => x.image == key.image);
    // if (index > -1) {
    //    this.formArray.splice(index, 1);
    // }
    let arr :any= [];
    this.basicinfoForm.get('categories').value.forEach((element:any) => {
      arr.push(element._id)
    });
    console.log(this.formArray);
    let input ;
    

    
    formData.append('type','medicine');
    formData.append('productId',this.medimallID);

    arr.forEach((element,index) => {
      formData.append('categories['+index+']',element);
    });


    formData.append('brand',this.basicinfoForm.get('brand').value);
    formData.append('policy',this.basicinfoForm.get('policy').value);
    formData.append('name',this.basicinfoForm.get('productname').value);
    formData.append('prescription',this.basicinfoForm.get('prescription').value);
    formData.append('stockAlert',this.basicinfoForm.get('stockalert').value);
    formData.append('statusLimit',this.basicinfoForm.get('statuscount').value);

    formData.append('description',this.productinfoForm.get('description').value);

      formData.append('warning',this.productinfoForm.get('warning').value);
    formData.append('directionsOfUse',this.productinfoForm.get('direction_of_use').value);

      formData.append('sideEffects',this.productinfoForm.get('side_effects').value);

    formData.append('content',this.productinfoForm.get('content').value);
    formData.append('metaTitles',this.productinfoForm.get('metatitle').value);
    formData.append('moreInfo',this.productinfoForm.get('moreinfo').value);
   
    formData.append('metaDescription',this.productinfoForm.get('metadescription').value);
    tags_array.forEach((element,index) => {
      formData.append('tags['+index+']',element);
    });

      this.substitutionForm.get('relatedproducts').value.forEach((element,index) => {
        formData.append('relatedProducts['+index+']',element);
      });

      this.substitutionForm.get('substitution').value.forEach((element,index) => {
        formData.append('substitutions['+index+']',element);
      });

      
    formData.append('pricing',JSON.stringify(finalData));

    // finalData.forEach((element,index) => {
    //   formData.append('pricing['+index+'][uom]',element.uom);
    //   formData.append('pricing['+index+'][sku]',element.sku);
    //   formData.append('pricing['+index+'][skuOrHsnNo]',element.skuOrHsnNo);
    //   formData.append('pricing['+index+'][price]',element.price);
    //   formData.append('pricing['+index+'][specialPrice]',element.specialPrice);
    //   formData.append('pricing['+index+'][volume]',element.volume);
    //   formData.append('pricing['+index+'][expiryDate]',element.expiryDate);
    //   formData.append('pricing['+index+'][stock]',element.stock);
    //   formData.append('pricing['+index+'][image]',element.image);
    //   formData.append('pricing['+index+'][video]',element.video);
    // });



    console.log(input);
    this._addInvetoryService.update_inventory_product(formData,this.edit_id).subscribe((res:any)=>{
      console.log(res);
        if(res.status){
          this.addLoading = false;
          Swal.fire({
            text: 'Successfully Updated',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
          });
          this._router.navigate(['/inventory/inventory-list/medicine']);
        }
        else{
          this.addLoading = false;
            Swal.fire({
              text: res.data,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
        }
    });


  }
  

  changeUOM(id:any,i){
    this.UOMID = id;
    this.formArray[i].uom = id;
    this._addInvetoryService.get_all_UOM_value_by_uom_id(id).subscribe((res:any)=>{
      this.formArray[i].skuList = res.data;
      this.formArray[i].sku = '';
      console.log(this.formArray);
    })
  }

  setUOMValue(val,i){
    this.formArray[i].sku = val;
  }

  public selectEventHandler(e: SelectEvent,i:any): void {
    const that = this;

    e.files.forEach((file) => {

      if (!file.validationErrors) {
        const reader = new FileReader();

        reader.onload = function (ev) {
          const image = {
            src: ev.target["result"],
            uid: file.uid,
          };

          //that.imagePreviews.unshift(image);

        };

        reader.readAsDataURL(file.rawFile);
      }

      const formData = new FormData();
      formData.append('image', file.rawFile);
      console.log(this.formArray);
      this._addInvetoryService.upload_image(formData).subscribe((res:any) => {
        console.log(res);
        if(res.status){
          this.formArray[i].image[i] = res.data.image_path;
          that.imagePreviews.unshift(res.data.image_path);
        }
        else{
          this.formArray[i].image[i] = '';
        }
       
      });
    });
  }

  public removeEventHandler(e: RemoveEvent,i:any,img:any): void {

    const index = this.imagePreviews.findIndex(
      (item) => item.uid === e.files[0].uid
    );

    if (index >= 0) {
      console.log(this.imagePreviews)
      this.formArray.forEach(element => {
        if(element.image[i] === i){
          let input = {
            "image_path" : i
          }
          this._addInvetoryService.delete_image(input).subscribe((res:any) => {
            console.log(res);
            if(res.status){
              this.formArray[i].image[i] = res.data.image_path;
              Swal.fire({
                text: 'Successfully Removed',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor:  '#3085d6',
                imageHeight: 50,
              });
              this.imagePreviews.splice(index, 1);
            }
            else{
              this.formArray[i].image[i] = '';
            }
           
          });
        }
      });;
    }
  }


  
  public selectVideoEventHandler(e: SelectEvent,i:any): void {
    const that = this;
    if(e.files[0].extension != '.mp4'){
      Swal.fire({
        text: 'Invalid Video Type !!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 50,
      });
      return;
    }
    else{
      e.files.forEach((file) => {

        if (!file.validationErrors) {
          const reader = new FileReader();
  
          reader.onload = function (ev) {
            const video = {
              src: ev.target["result"],
              uid: file.uid,
            };
  
            that.VideoPreviews.unshift(video);
  
          };
  
          reader.readAsDataURL(file.rawFile);
        }
  
        const formData = new FormData();
        formData.append('video', file.rawFile);
        console.log(this.formArray);
        this.videoLoading = true;
        this._addInvetoryService.upload_video(formData).subscribe((res:any) => {
          console.log(res);
          if(res.status){
            this.formArray[i].video = res.data.video_path;
            Swal.fire({
              text: res.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.videoLoading = false;
            this.disableFlag = true;
          }
          else{
            this.videoLoading = false;
            this.formArray[i].video = '';
            this.disableFlag = false;
          }
         
        });
      });
    }
  }

  public removeVideoEventHandler(e: RemoveEvent,i:any): void {

    const index = this.VideoPreviews.findIndex(
      (item) => item.uid === e.files[0].uid
    );

    if (index >= 0) {
      this.VideoPreviews.splice(index, 1);
      this.formArray.forEach(element => {
        if(element.video === i.video){
          this.formArray[i].video = '';
        }
      });;
    }
  }

 

  onKeyUpSpecialPrice(val:any,i){
      if(val > this.formArray[i].price){
        this.formArray[i].specialPrice = '';
        Swal.fire({
          text: 'Do not exceed Price Value !!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 50,
        });
      }
   }


  public image_URL :any = '';

  onChange(event:any,i,width,height){
    let setFlag :boolean = false;
      const reader = new FileReader();
      const file = event.target.files[0];


      reader.readAsDataURL(file); 
      const Img = new Image();
      Img.src = URL.createObjectURL(file);
      
      Img.onload = (e: any) => {
        if(e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width) ){
          setFlag = true;
         // this.uploadImage = file;
          let content = reader.result as string;
          this.image_URL = content;
          const formData = new FormData();
          formData.append('image', file);
          //this.imageLoading = true;
              this.formArray[i].imageLoading = 'true';
          this._addInvetoryService.upload_image(formData).subscribe((res:any) => {
            console.log(res);
            if(res.status){
              //this.imagePreviews.unshift(res.data.image_path);
              this.formArray[i].image.push(res.data.image_path)
              this.formArray[i].imagePreview = this.formArray[i].image;
              //this.imageLoading = false;
              this.formArray[i].imageLoading = 'false';
            }
            else{
              this.formArray[i].image[i] = res.data.image_path;
              //this.imageLoading = false;
              this.formArray[i].imageLoading = 'false';
            }
          });
         
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

  onChangeVideo(event,i){
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type.indexOf('video') != 0) {
        Swal.fire('Oops!', "Please select a valid video file", 'warning');
        return false;
      }
   
      const formData = new FormData();
      formData.append('video', file);
      console.log(this.formArray);
     // this.videoLoading = true;
      this.formArray[i].videoLoading = 'true';
      this._addInvetoryService.upload_video(formData).subscribe((res:any) => {
        console.log(res);
        if(res.status){
          this.formArray[i].video = res.data.video_path;
          Swal.fire({
            text: res.message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
          });
          this.formArray[i].videoLoading = 'false';
          this.disableFlag = true;
        }
        else{
          this.formArray[i].videoLoading = 'false';
          this.formArray[i].video = '';
          this.disableFlag = false;
        }
       
      });

    }

  }

  removeImage(img:any,Imageindex:any,index){

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

          let input = {
            "image_path" : img
          }
    
          this._addInvetoryService.delete_image(input).subscribe((res:any) => {
            console.log(res);
            if(res.status){
              Swal.fire({
                text: 'Successfully Removed',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor:  '#3085d6',
                imageHeight: 50,
              });
              //this.imagePreviews.splice(Imageindex,1);
            this.formArray[index].image.splice(Imageindex,1);
            this.formArray[index].imagePreview = this.formArray[index].image;
              console.log("Array ===",this.formArray);
              //console.log("Image Preview===",this.imagePreviews)
            }
           
          });
        
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });

  }

  removeVideo(video,index){
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

        let input = {
          "video_id" : video
        }
  
        this._addInvetoryService.delete_video(input).subscribe((res:any) => {
          console.log(res);
          if(res.status){
            Swal.fire({
              text: 'Successfully Removed',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            //this.imagePreviews.splice(Imageindex,1);
          this.formArray[index].video = '';
          this.myfile.nativeElement.value = '';
            console.log("Array ===",this.formArray);
            //console.log("Image Preview===",this.imagePreviews)
          }
         
        });
      
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }

  filterProducts(value:any){
    if (value.length >= 1) {
      this.productList = this.AllProductList.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } 

    else if(value ===''){
      this.productList = this.AllProductList
    }
    else {
      this.productList = this.AllProductList
    }
  }

  handleFilterCategories(value){
    if (value.length >= 1) {
      this.categoryList = this.AllcategoryList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } 
    else if(value ===''){
      this.categoryList = this.AllcategoryList
    }
    else {
      this.categoryList = this.AllcategoryList
    }
  }


  handleFilterBrand(value){
    if (value.length >= 1) {
      this.brandList = this.AllbrandList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } 
    else if(value ===''){
      this.brandList = this.AllbrandList
    }
    else {
      this.brandList = this.AllbrandList
    }
  }

  handleFilterPolicy(value){
    if (value.length >= 1) {
      this.policyList = this.AllpolicyList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } 
    else if(value ===''){
      this.policyList = this.AllpolicyList
    }
    else {
      this.policyList = this.AllpolicyList
    }
  }

  
  handleFilterUOM(value){
    if (value.length >= 1) {
      this.UOMList = this.AllUOMList.filter(
        (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } 
    else if(value ===''){
      this.UOMList = this.AllUOMList
    }
    else {
      this.UOMList = this.AllUOMList
    }
  }

  handleFilterUOMValue(value){
    if (value.length >= 1) {
      this.UOMValueList = this.AllUOMValueList.filter(
        (s) => s.uomValue.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } 
    else if(value ===''){
      this._addInvetoryService.get_all_UOM_value_by_uom_id(this.UOMID).subscribe((res:any)=>{
        this.UOMValueList = res.data;
      })
    }
    else {
      this._addInvetoryService.get_all_UOM_value_by_uom_id(this.UOMID).subscribe((res:any)=>{
        this.UOMValueList = res.data;
      })
    }
  }

  public handleFilter(value: string): void {
  }


  filterCategories(value:any){
    let subcategory :any = [];
    let list :any =[];
    if (value.length >= 1) {
      this.categoryList = this.AllcategoryList.filter((s) =>
        s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } 
    else if(value ===''){
      this.categoryList = this.AllcategoryList
    }
    else {
      this.categoryList = this.AllcategoryList
    }
  }

 

}

//Upload Imgae or video section
// @Injectable()
// export class UploadInterceptor implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     if (req.url === 'saveUrl') {
//       const events: Observable<HttpEvent<any>>[] = [0, 30, 60, 100].map((x) => of(<HttpProgressEvent>{
//         type: HttpEventType.UploadProgress,
//         loaded: x,
//         total: 100
//       }).pipe(delay(1000)));

//       const success = of(new HttpResponse({ status: 200 })).pipe(delay(1000));
//       events.push(success);

//       return concat(...events);
//     }

//     if (req.url === 'removeUrl') {
//         return of(new HttpResponse({ status: 200 }));
//     }

//     return next.handle(req);
//   }


// }
