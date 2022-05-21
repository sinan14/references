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
  selector: 'app-sub-sub-category',
  templateUrl: './sub-sub-category.component.html',
  styleUrls: ['./sub-sub-category.component.scss']
})
export class SubSubCategoryComponent implements OnInit {

  
  //kendo table
  public gridView: GridDataResult;
  public skip = 0;
  public subcategory_data = [
    {
      category:"Sub Sub Category 1",
      image: "assets/images/electronics/product/medical-mask.png",
  },
  {
    category:"Sub Sub Category 2",
    image: "assets/images/electronics/product/facewash.png",
  }, 
  {
    category:"Sub Sub Category 3",
    image: "assets/images/electronics/product/facewash.png",
  },
 
  ];

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
  public subcategoryID :any ;
  public subcategoryName :any ;
  public ID :any ;
  public subsubHealthcareCategoryList :any = [];
  public subsubCatgeoryForm:FormGroup;
  public attemptedSubmit :boolean = false;
  public addLoading :boolean = false;
  public image_URL :any = '';
  public uploadImage :any = '';

  constructor( private _router: Router,
    private modalService: NgbModal,
    private _route:Router, private permissionService:PermissionService,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private _masterCategoryService : MasterSettingsCategoryService,
    public formBuilder:FormBuilder) {
      this.subsubCatgeoryForm = this.formBuilder.group({
        subsubcategoryname: ['',Validators.required]
      })
  }


  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.subcategoryID = params.get('healthSubSubCatgeoryID');
      this._masterCategoryService.get_sub_healthcare_category_by_id(this.subcategoryID).subscribe((res:any)=>{
        this.subcategoryName = res.data[0].title;

        
      this._masterCategoryService.get_healthcare_category_by_id(res.data[0].categoryId).subscribe((p:any)=>{
        this.categoryID = p.data[0]._id;
        this.categoryName = p.data[0].title;
      })
      })
    
    });


    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

    this.getSuSubCategoryDetails();
  }

  disableTab(value){
    let flag = this.permissionService.setBoxPrivilege(value,this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  getSuSubCategoryDetails(){
    this._masterCategoryService.get_all_sub_sub_healthcare_category_by_subcategoryid(this.subcategoryID).subscribe((res:any)=>{
      this.subsubHealthcareCategoryList = res.data.reverse();
    })
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


      this._masterCategoryService.get_sub_sub_healthcare_category_by_id(id).subscribe((res:any)=>{
        this.ID = res.data[0]._id;
        this.image_URL = res.data[0].image;
        this.subsubCatgeoryForm.patchValue({
          subsubcategoryname : res.data[0].title
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
    this._router.navigate(['/master-settings/sub-category/'+this.categoryID])
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

  save(){
      if(this.subsubCatgeoryForm.invalid){
        return;
      }

      if(this.image_URL === ''){
        return;
      }

      this.addLoading = true;
      const formData = new FormData();
      formData.append('title',this.subsubCatgeoryForm.get('subsubcategoryname').value);
      formData.append('image',this.uploadImage);
      formData.append('subCategoryId',this.subcategoryID);
      this._masterCategoryService.add_sub_sub_healthcare_category(formData).subscribe((res:any)=>{
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
          this.resetValues();
          this.getSuSubCategoryDetails();
          this.modalService.dismissAll();
        }
        else {
          Swal.fire({
            text:  res.data,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 500,
          });
          this.addLoading = false;
          this.getSuSubCategoryDetails();
          this.subsubCatgeoryForm.get('subsubcategoryname').reset();
        }
      })
  
  }

  update(){
    if(this.subsubCatgeoryForm.invalid){
      return;
    }

    if(this.image_URL === ''){
      return;
    }

    this.addLoading = true;
    const formData = new FormData();
    if(this.uploadImage != ''){
      formData.append('title',this.subsubCatgeoryForm.get('subsubcategoryname').value);
      formData.append('image',this.uploadImage);
      formData.append('subCategoryId',this.subcategoryID);
      formData.append('subSubCategoryId',this.ID);
    }
    else{
      formData.append('title',this.subsubCatgeoryForm.get('subsubcategoryname').value);
      formData.append('subCategoryId',this.subcategoryID);
      formData.append('subSubCategoryId',this.ID);
    }
    this._masterCategoryService.update_sub_sub_healthcare_category(formData).subscribe((res:any)=>{
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
        this.resetValues();
        this.getSuSubCategoryDetails();
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
        this._masterCategoryService.delete_sub_sub_healthcare_category(id).subscribe((res:any)=>{
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
            this.getSuSubCategoryDetails();
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
    this._masterCategoryService.change_sub_sub_status_healthcare_category(id,input).subscribe((res:any)=>{
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
        this.getSuSubCategoryDetails();
      }
    })
}

  resetValues(){
    this.image_URL = '';
    this.subsubCatgeoryForm.reset();
    this.addLoading = false;
    this.attemptedSubmit = false;
    this.uploadImage = '';
  }
}
