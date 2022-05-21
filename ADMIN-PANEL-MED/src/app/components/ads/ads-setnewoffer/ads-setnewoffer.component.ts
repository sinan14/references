import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router ,ActivatedRoute}  from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { AdsSeasonalOffersService } from 'src/app/services/ads-seasonal-offers.service';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ads-setnewoffer',
  templateUrl: './ads-setnewoffer.component.html',
  styleUrls: ['./ads-setnewoffer.component.scss']
})
export class AdsSetnewofferComponent implements OnInit {

  public newArray = [
    {
      "DealName":'Hot Deals For You',
    }
  ];


  public closeResult: string;
  public value_array = [];
  public product_array = [];
  public colorValue :any;
  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;
  public selectedCat :any;

   //NEW VARIABLES

   public permissions :any = [];
   public user :any = [];
   public currentPrivilages :any = [];
   public aciveTagFlag :boolean = true;
   public editFlag :boolean;
   public deleteFlag :boolean;
   public viewFlag :boolean;

   
   public ID :any;
   public offerID :any;
   public offerName :any;
   public offerList ;any = [];
   public setOfferForm :FormGroup;
   public attemptedSubmit :boolean = false; 
   public addLoading :boolean = false; 
   public categoryList :any = [];
   public inventoryList :any = [];
   


  public listItems: Array<string> = ['FaceWash', 'ToothPaste', 'Panjaka Kasthuri','Face Mask'];
  public listProduct: Array<string> = ['FaceWash', 'ToothPaste', 'Panjaka Kasthuri','Face Mask','Virgin Oil','Protein drink','Peanut Butter'];
  public value: any = ['FaceWash'];


  constructor(private modalService: NgbModal,
    private _route:Router,
    private intl: IntlService,
    private permissionService:PermissionService,
    private location: Location,
    private activatedRoute :ActivatedRoute,
    private _adsSeasonalService:AdsSeasonalOffersService,
    private _formBuilder:FormBuilder,) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.offerID = params.get('offerID');
      if(this.offerID != ''){
        this.getYourOffersDetails(this.offerID);
        this._adsSeasonalService.get_single_set_your_offers_details(this.offerID).subscribe((p:any)=>{
          this.offerName = p.data.name;
        })
      }
    });

    
    this.setOfferForm = this._formBuilder.group({
      categoryid :['',Validators.required],
      subcategoryid :['',Validators.required]
    })


    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }  


    this.getCategoryDetails();
  }

  
  disableTab(value){
    let flag = this.permissionService.setPrivilages(value,this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  getCategoryDetails(){
    this._adsSeasonalService.getCategoryListing().subscribe((res:any)=>{
      this.categoryList = res.data;
    })
  }

  getYourOffersDetails(id:any){
    console.log(id);
    this._adsSeasonalService.get_single_set_your_offers_sub_categories(id).subscribe((res:any)=>{
        this.offerList = res.data;
        console.log(this.offerList);
    })
  }


  
  open(content,Value:any,id:any) {
    console.log(Value)
    if(Value === 'add'){
      this.setOfferForm.reset();
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

      this.ID = id;
      this._adsSeasonalService.get_single_set_your_offers_sub_details(id).subscribe((res:any)=>{
        console.log(res);

        this._adsSeasonalService.getCategoryWiseProductList(res.data[0].categoryId).subscribe((p:any)=>{
          this.inventoryList = p.data;
        })

        this.setOfferForm.get('categoryid').setValue(res.data[0].categoryId);
        this.setOfferForm.get('subcategoryid').setValue(res.data[0].ProductId);
      })


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
  
  dropDownChange(value:any){
    if(value === 'medimall'){
      this.value_array = ['Product','Category'];
    }
    else if(value === 'foliofit'){
      this.value_array = ['Fitness Club','Yoga','Diet Regieme','Health','Nutri Chart','BMI'];
      this.product_array=[];
    }
    else if(value === 'medfeed'){
      this.value_array = ['Med Articles','Medquiz','Expert Advice','Health Tips','Live Updates','Home'];
      this.product_array=[];
    }
    else if(value === 'external'){
      this.value_array = ['Link'];
      this.product_array=[];
    }
}

dropDownProductChange(value:any){
  console.log(value)
    if(value === 'Product'){
      this.product_array = ['a','b','c'];
    }
    else if(value === 'Category'){
      this.product_array = ['cat 1','cat 2','cat 3',];
    }
}


// handleFilter(value) {
//   if (value.length >= 3) {
//     let data = this.listItems.filter(
//       (s) => s.toLowerCase().indexOf(value.toLowerCase()) !== -1
//     );
//     this.listItems = data;
//   } 
// }

    onFileChanged(event) {
      let selectedFile = event.target.files[0]
      console.log(selectedFile)
      let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
          let file = event.target.files[0];
          reader.readAsDataURL(file);
          reader.onload = () => {
            let url = reader.result; 
            //console.log(url)
          };
        }
    }

    public itemDisabled(itemArgs: { dataItem: string; index: number }) {
      return itemArgs.index === 2; // disable the 3rd item
    }


    
  addForm(){
    this.newArray.push({"DealName":""});
  }
  removeForm(id){
    this.newArray.splice(id, 1);
  }

  trackByFn(index: any) {
    return index;
  }

  
  BackRedirectTo(){
    this._route.navigate(['/ads/ads-seasonaloffers']);
    localStorage.setItem("TabID","tab-selectbyid3");
  }

  save(){
      if(this.setOfferForm.invalid){
        return;
      }

      let input = {
        'CatId':this.offerID,
        'categoryId':this.setOfferForm.get('categoryid').value,
        'ProductId':this.setOfferForm.get('subcategoryid').value,
      }
      console.log(input)

      this._adsSeasonalService.update_set_your_offers_sub_details(input).subscribe((res:any)=>{
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
          this.setOfferForm.reset();
          this.getYourOffersDetails(this.offerID);
          this.modalService.dismissAll();
        }
        else{
          this.addLoading = false;
          this.setOfferForm.get('subcategoryid').reset();
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

  update(){
    if(this.setOfferForm.invalid){
      return;
    }

    let input = {
      'CatId':this.offerID,
      'sliderId':this.ID,
      'categoryId':this.setOfferForm.get('categoryid').value,
      'ProductId':this.setOfferForm.get('subcategoryid').value,
    }

    this._adsSeasonalService.update_set_your_offers_sub_details(input).subscribe((res:any)=>{
      console.log(res);
      if(res.status){
        Swal.fire({
          text:  'Successfully Updated',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 500,
        });
        this.addLoading = false;
        this.getYourOffersDetails(this.offerID);
        this.modalService.dismissAll();
      }
      else{
        this.addLoading = false;
        this.setOfferForm.get('subcategoryid').reset();
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

  delete(id){
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
        this._adsSeasonalService.delete_set_your_offers_sub_details(id).subscribe((res:any)=>{
          if(res.status){
            Swal.fire({
                    text:'Successfully Deleted',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor:  '#3085d6',
                    imageHeight: 500,
                  });
                  this.getYourOffersDetails(this.offerID);
                  this.modalService.dismissAll();
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }

  
  categoryChange(id){
    this.selectedCat = id;
    this._adsSeasonalService.getCategoryWiseProductList(id).subscribe((res:any)=>{
      this.inventoryList = res.data;
      this.setOfferForm.get('subcategoryid').reset();
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

  close(){
    this.modalService.dismissAll();
    this.attemptedSubmit = false;
    this.addLoading = false;

  }


}
