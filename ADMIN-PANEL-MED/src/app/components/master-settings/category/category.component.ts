import { Component, OnInit,ViewChild,ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons ,NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { PermissionService } from 'src/app/permission.service';
import { Location } from '@angular/common';
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { MasterSettingsCategoryService } from 'src/app/services/master-settings-category.service';
import { FormGroup,FormBuilder , Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  private tabSet: ViewContainerRef;
  public closeResult: string;

  
  //kendo table
  public gridView: GridDataResult;
  public skip = 0;

  //NEW VARIABLES
  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;

  public permissions :any = [];
  public user :any = [];
  public currentPrivilages :any = [];
  public aciveTagFlag :boolean = true;
  public editFlag :boolean;
  public deleteFlag :boolean;
  public viewFlag :boolean;
  public addFlag :boolean;

  public image_URL :any = '';
  public uploadImage :any = '';
  public attemptedSubmit :boolean = false;
  public addLoading :boolean = false;

  //medicine catgeory
  public medicineCategoryList:any = [];
  public medicineForm:FormGroup;
  public ID :any;


   //healthcare catgeory
   public healthcareCategoryList:any = [];
   public healthcareForm:FormGroup;

  selectedTab = '';
  @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
    this.tabSet = content;
  };

  ngAfterViewInit() {
    localStorage.clear();
    //console.log(this.tabSet.activeTab);
  }

  constructor( private _router: Router,
    private modalService: NgbModal,
    private _route : Router,
    private permissionService:PermissionService,
    private location: Location,
    private _masterCategoryService : MasterSettingsCategoryService,
    public formBuilder:FormBuilder) {
      
    this.medicineForm = this.formBuilder.group({
      categoryname: ['',Validators.required]
    })

    this.healthcareForm = this.formBuilder.group({
      categoryname: ['',Validators.required]
    })
  }

  ngOnInit(): void {

    console.log( this.location.path().split('/').pop());
    this.user = JSON.parse(sessionStorage.getItem('userData'));

    if(this.user != ''){
      this.permissionService.canActivate(this.location.path().split('/').pop())
    }


    let tabselected =  localStorage.getItem("TabID");
    if(tabselected!=''){
      if(tabselected  == 'tab-selectbyid1'){
        this.selectedTab = 'tab-selectbyid1';
      }
    }
    else{
      localStorage.clear();
      this.selectedTab = '';
    }


    this.getMedicineCatgeory();
    this.getHealthCareCatgeory();
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

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.getHealthCareCatgeory();
  }


  getMedicineCatgeory(){
    this._masterCategoryService.get_all_medicine_category().subscribe((res:any)=>{
      this.medicineCategoryList = res.data.reverse();
    })
  }

  
  getHealthCareCatgeory(){
    this._masterCategoryService.get_all_healthcare_category().subscribe((res:any)=>{
      this.healthcareCategoryList = res.data.reverse();
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

  open(content,Value:any,type:any,id:any) {
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


      if(type === 'medicine'){
          this._masterCategoryService.get_medicine_category_by_id(id).subscribe((res:any)=>{
            console.log(res.data);
            this.image_URL = res.data[0].image;
            this.ID = res.data[0]._id;
            this.medicineForm.patchValue({
              categoryname : res.data[0].title
            })
          })
      }

      else   if(type === 'healthcare'){
        this._masterCategoryService.get_healthcare_category_by_id(id).subscribe((res:any)=>{
          console.log(res.data);
          this.image_URL = res.data[0].image;
          this.ID = res.data[0]._id;
          this.healthcareForm.patchValue({
            categoryname : res.data[0].title
          })
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

  tabChangeEvent(event){
    console.log(event.nextId);
    //localStorage.setItem("TabID",event.nextId);
  }

  redirectToSubCategory(id){
    this.selectedTab = 'tab-selectbyid1';
      this._route.navigate(['/master-settings/sub-category/'+id]);
      localStorage.setItem("TabID",'tab-selectbyid1')
  }

  redirectToMedicineSubCategory(id){
      this._route.navigate(['/master-settings/medicine-category/'+id]);
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

  save(type:any){
    if(this.healthcareForm.invalid){
      return;
    }
    if(this.image_URL === ''){
      return;
    }

    this.addLoading = true;
    const formData = new FormData();
    formData.append('title',this.healthcareForm.get('categoryname').value);
    formData.append('image',this.uploadImage);
    this._masterCategoryService.add_healthcare_category(formData).subscribe((res:any)=>{
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
        this.getHealthCareCatgeory();
        this.modalService.dismissAll();
      }
      else {
        this.addLoading = false;
        Swal.fire({
          text:  'Already Exist!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 500,
        });
        this.getHealthCareCatgeory();
        this.healthcareForm.get('categoryname').reset();
      }
    })
  }

  update(type:any){
    if(type === 'medicine'){
      if(this.medicineForm.invalid){
        return;
      }

      if(this.image_URL === ''){
        return;
      }
      this.addLoading = true;
      const formData = new FormData();
      if(this.uploadImage != ''){
            formData.append('title',this.medicineForm.get('categoryname').value);
            formData.append('categoryId',this.ID);
            formData.append('image',this.uploadImage);
      }
      else{
        formData.append('title',this.medicineForm.get('categoryname').value);
        formData.append('categoryId',this.ID);
      }

      this._masterCategoryService.update_medicine_category(formData).subscribe((res:any)=>{
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
          this.resetValues();
          this.getMedicineCatgeory();
          this.modalService.dismissAll();
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

    else if(type === 'healthcare'){
      if(this.healthcareForm.invalid){
        return;
      }

      if(this.image_URL === ''){
        return;
      }
      this.addLoading = true;
      const formData = new FormData();
      if(this.uploadImage != ''){
            formData.append('title',this.healthcareForm.get('categoryname').value);
            formData.append('categoryId',this.ID);
            formData.append('image',this.uploadImage);
      }
      else{
        formData.append('title',this.healthcareForm.get('categoryname').value);
        formData.append('categoryId',this.ID);
      }

      this._masterCategoryService.update_healthcare_category(formData).subscribe((res:any)=>{
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
          this.resetValues();
          this.getHealthCareCatgeory();
          this.modalService.dismissAll();
        }
        else{
          this.addLoading = false;
          this.healthcareForm.get('categoryname').setValue('')
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

  delete(type:any,id:any){
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
        this._masterCategoryService.delete_healthcare_category(id).subscribe((res:any)=>{
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
            this.getHealthCareCatgeory();
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
  

  statusChange(event:any,type:any,id:any){
    if(type === 'medicine'){

        let input = {
          status : event.target.checked ? false : true
        }
        this._masterCategoryService.change_status_medicine_category(id,input).subscribe((res:any)=>{
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
            this.getMedicineCatgeory();
          }
        })
    }

    else  if(type === 'healthcare'){

      let input = {
        status : event.target.checked ? false : true
      }
      this._masterCategoryService.change_status_healthcare_category(id,input).subscribe((res:any)=>{
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
          this.getHealthCareCatgeory();
        }
      })
    }
  }

  resetValues(){
    this.image_URL = '';
    this.uploadImage = '';
    this.medicineForm.reset();
    this.healthcareForm.reset();
    this.attemptedSubmit = false;
    this.addLoading = false;
  }




}
