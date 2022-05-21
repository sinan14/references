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
  selector: 'app-medicine-category',
  templateUrl: './medicine-category.component.html',
  styleUrls: ['./medicine-category.component.scss']
})
export class MedicineCategoryComponent implements OnInit {


  
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
  public submedicineCategoryList :any = [];
  public subCatgeoryForm:FormGroup;
  public attemptedSubmit :boolean = false;
  public addLoading :boolean = false;

  
  constructor( private _router: Router,
    private modalService: NgbModal,private permissionService:PermissionService,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private _masterCategoryService : MasterSettingsCategoryService,
    public formBuilder:FormBuilder) {
      this.subCatgeoryForm = this.formBuilder.group({
        categoryname: ['',Validators.required]
      })
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.categoryID = params.get('medCatgeoryID');
      console.log(this.categoryID);
      this._masterCategoryService.get_medicine_category_by_id(this.categoryID).subscribe((res:any)=>{
        this.categoryName = res.data[0].title;
      })
    });

    console.log( this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissions = this.permissionService.canActivate(this.location.path().split('/').pop())
      console.log(this.permissions)
    }

    this.getSubMedicineCatgeory();
  }

  
  disableTab(value){
    let flag = this.permissionService.setBoxPrivilege(value,this.user.isAdmin);
    this.editFlag = this.permissionService.editFlag;
    this.deleteFlag = this.permissionService.deleteFlag;
    this.viewFlag = this.permissionService.viewFlag;
    return flag;
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.getSubMedicineCatgeory();
  }

  getSubMedicineCatgeory(){
    this._masterCategoryService.get_all_sub_medicine_category_by_category(this.categoryID).subscribe((res:any)=>{
      this.submedicineCategoryList = res.data.reverse();
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


      this._masterCategoryService.get_sub_medicine_category_by_id(id).subscribe((res:any)=>{
        console.log(res.data);
        this.ID = res.data[0]._id;
        this.subCatgeoryForm.patchValue({
          categoryname : res.data[0].title
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

  save(){
    if(this.subCatgeoryForm.invalid){
      return;
    }

    let input ={
      'title' : this.subCatgeoryForm.get('categoryname').value,
      'categoryId': this.categoryID
    }
    this.addLoading = true;
    this._masterCategoryService.add_sub_medicine_category(input).subscribe((res:any)=>{
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
        this.getSubMedicineCatgeory();
        this.resetValues();
        this.skip = 0;
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
        this.getSubMedicineCatgeory();
        this.resetValues();
      }
    })
  }

  update(){
    if(this.subCatgeoryForm.invalid){
      return;
    }

    let input ={
      'title' : this.subCatgeoryForm.get('categoryname').value,
      'categoryId': this.categoryID,
      'subCategoryId': this.ID
    }
    this.addLoading = true;
    this._masterCategoryService.update_sub_medicine_category(input).subscribe((res:any)=>{
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
        this.resetValues();
        this.getSubMedicineCatgeory();
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
        this.getSubMedicineCatgeory();
        this.resetValues();
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
        this._masterCategoryService.delete_sub_medicine_category(id).subscribe((res:any)=>{
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
            this.getSubMedicineCatgeory();
            this.skip = 0;
            this.ngOnInit();
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
        this._masterCategoryService.change_status_sub_medicine_category(id,input).subscribe((res:any)=>{
          console.log(res);
          if(res.status){
            Swal.fire({
              text:  res.data,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor:  '#3085d6',
              imageHeight: 500,
            });
            this.getSubMedicineCatgeory();
          }
        })
  }

  resetValues(){
    this.subCatgeoryForm.reset();
    this.attemptedSubmit = false;
    this.addLoading = false;
  }

}
