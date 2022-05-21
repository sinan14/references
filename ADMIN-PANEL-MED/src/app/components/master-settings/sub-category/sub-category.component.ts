import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { MasterSettingsCategoryService } from 'src/app/services/master-settings-category.service';
import { FormGroup,FormBuilder , Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  
  //kendo table
  public gridView: GridDataResult;
  public skip = 0;



  public closeResult: string;
 //NEW VARIABLES

 public permissions :any = [];
 public user :any = [];
 public currentPrivilages :any = [];
 public aciveTagFlag :boolean = true;
 public editFlag :boolean;
 public deleteFlag :boolean;
 public viewFlag :boolean;

 
 public categoryID :any ;
 public categoryName :any ;
 public ID :any ;
 public subHealthcareCategoryList :any = [];
 public subCatgeoryForm:FormGroup;
 public attemptedSubmit :boolean = false;
 public addLoading :boolean = false;
 public image_URL :any = '';
 public bannerImage_URL :any = '';
 public uploadImage :any = '';
 public uploadBannerImage :any = '';
  
  constructor( private _router: Router,
    private modalService: NgbModal,
    private _route:Router, private permissionService:PermissionService,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private _masterCategoryService : MasterSettingsCategoryService,
    public formBuilder:FormBuilder) {
      this.subCatgeoryForm = this.formBuilder.group({
        subcategoryname: ['',Validators.required]
      })
  
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.categoryID = params.get('healthSubCatgeoryID');
      this._masterCategoryService.get_healthcare_category_by_id(this.categoryID).subscribe((res:any)=>{
        this.categoryName = res.data[0].title;
      })
    });

    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

    this.getSubCategoryHealthCare();
  }

  disableTab(value){
    let flag = this.permissionService.setBoxPrivilege(value,this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  getSubCategoryHealthCare(){
    this._masterCategoryService.get_all_sub_healthcare_category_by_categoryid(this.categoryID).subscribe((res:any)=>{
      this.subHealthcareCategoryList = res.data.reverse();
    })
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.getSubCategoryHealthCare();
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


  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;

  open(content,Value:any,id:any) {
    if(Value === 'add'){
      this.resetValues();
      this.add_Modal_Flag = true;
      this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if(Value === 'edit'){
      this.update_Modal_Flag = true;
      this.add_Modal_Flag = false;


      this._masterCategoryService.get_sub_healthcare_category_by_id(id).subscribe((res:any)=>{

        this.image_URL = res.data[0].image;
        this.bannerImage_URL = res.data[0].banner;
        this.ID = res.data[0]._id;
          this.subCatgeoryForm.patchValue({
            subcategoryname : res.data[0].title
          })
      })
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
  

  BackRedirectTo(){
    this._router.navigate(['/master-settings/category'])
  }

  onChangeImage(event:any,width:any,height:any){
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

  onChangeBannerImage(event:any,width:any,height:any){
    let setFlag :boolean = false;

      const reader = new FileReader();
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      const Img = new Image();
      Img.src = URL.createObjectURL(file);

      Img.onload = (e: any) => {
        if(e.path[0].naturalHeight === parseInt(height) && e.path[0].naturalWidth === parseInt(width) ){
          setFlag = true;
          this.uploadBannerImage = file;
          let content = reader.result as string;
          this.bannerImage_URL = content;
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

  save(){
    if(this.subCatgeoryForm.invalid){
      return;
    }

    if(this.image_URL === '' || this.bannerImage_URL ===''){
      return;
    }

    this.addLoading = true;
    const formData = new FormData();
    formData.append('title',this.subCatgeoryForm.get('subcategoryname').value);
    formData.append('image',this.uploadImage);
    formData.append('banner',this.uploadBannerImage);
    formData.append('categoryId',this.categoryID);
    this._masterCategoryService.add_sub_healthcare_category(formData).subscribe((res:any)=>{
      console.log(res);
      if(res.status){
        this.ngOnInit();
        Swal.fire({
          text:  'Successfully Added',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 500,
        });
        this.addLoading = false;
        this.resetValues();
        this.getSubCategoryHealthCare();
        this.modalService.dismissAll();
      }
      else {
        Swal.fire({
          text:  'Already Exist!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 500,
        });
        this.addLoading = false;
        this.getSubCategoryHealthCare();
        this.subCatgeoryForm.get('subcategoryname').reset();
      }
    })

  }

  update(){
    if(this.subCatgeoryForm.invalid){
      return;
    }

    if(this.image_URL === '' || this.bannerImage_URL ===''){
      return;
    }

    this.addLoading = true;
    const formData = new FormData();

    if(this.uploadImage !='' && this.uploadBannerImage != ''){
      formData.append('title',this.subCatgeoryForm.get('subcategoryname').value);
      formData.append('image',this.uploadImage);
      formData.append('banner',this.uploadBannerImage);
      formData.append('categoryId',this.categoryID);
      formData.append('subCategoryId',this.ID);
    }
    else  if(this.uploadImage !=''){
      formData.append('title',this.subCatgeoryForm.get('subcategoryname').value);
      formData.append('image',this.uploadImage);
      formData.append('categoryId',this.categoryID);
      formData.append('subCategoryId',this.ID);
    }
    else if( this.uploadBannerImage != ''){
      formData.append('title',this.subCatgeoryForm.get('subcategoryname').value);
      formData.append('banner',this.uploadBannerImage);
      formData.append('categoryId',this.categoryID);
      formData.append('subCategoryId',this.ID);
    }
    else{
      formData.append('title',this.subCatgeoryForm.get('subcategoryname').value);
      formData.append('categoryId',this.categoryID);
      formData.append('subCategoryId',this.ID);
    }
    this._masterCategoryService.update_sub_healthcare_category(formData).subscribe((res:any)=>{
      console.log(res);
      if(res.status){
        this.ngOnInit();
        Swal.fire({
          text:  'Successfully Updated',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 500,
        });
        this.addLoading = false;
        this.resetValues();
        this.getSubCategoryHealthCare();
        this.modalService.dismissAll();
      }
      else {
        this.addLoading = false;
        Swal.fire({
          text:  res.data,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 500,
        });
        //this.subCatgeoryForm.get('subcategoryname').reset();
      }
    })


  }

  delete(id:any){
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
        this._masterCategoryService.delete_sub_healthcare_category(id).subscribe((res:any)=>{
          console.log(res);
          if(res && res.status === true){
            Swal.fire({
              text: 'Successfully Deleted',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
            this.getSubCategoryHealthCare();
            this.skip = 0;
          }
          else{
            Swal.fire({
              text: 'Can`t Delete this Category',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 50,
            });
          }
        
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

    
  statusChange(event:any,id:any){

    let input = {
      status : event.target.checked ? false : true
    }
    this._masterCategoryService.change_sub_status_healthcare_category(id,input).subscribe((res:any)=>{
      console.log(res);
      if(res.status){
        Swal.fire({
          text: 'Status Changed Successfully',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 500,
        });
        this.getSubCategoryHealthCare();
      }
    })
}

  resetValues(){
    this.image_URL = '';
    this.bannerImage_URL = '';
    this.subCatgeoryForm.reset();
    this.addLoading = false;
    this.attemptedSubmit = false;
    this.uploadImage = '';
    this.uploadBannerImage = '';
  }

  redirectToSubCategory(id:any){
    this._router.navigate(['/master-settings/sub-sub-category/'+id])
  }

}
