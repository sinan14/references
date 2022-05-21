import { Component, OnInit, ChangeDetectorRef,ViewChild } from '@angular/core';
import { listPagesDB } from 'src/app/shared/tables/list-pages';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router }  from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import DepartmentService from 'src/app/services/department.service';
import Department from 'src/app/models/department.model';
import Privilege from 'src/app/models/privilege.model';
import PrivilegeService from 'src/app/services/privilege.service';
import { ToastrService } from 'ngx-toastr';
import { ArrayType } from '@angular/compiler';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { MultiSelectComponent } from "@progress/kendo-angular-dropdowns";

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent implements OnInit {


  @ViewChild("multiselect") public multiselect: MultiSelectComponent;
  public DEPT_NAME :any;
  public closeResult: string;
  public list_pages = [];
  public selected = [];
  public categories = [];
  public departments:Array<Department>;
  public privileges:Array<Privilege>;
  public privilege:Privilege=new Privilege();
  public deptList =[];
  public selectedPrivilegeGroupValue :Array<string> = [];
  public deptname;
  public groupname;
  public attemptedSubmit : boolean = false;
  add_Modal_Flag :boolean = false;
  update_Modal_Flag :boolean = false;
  public editDeptID:any;


  department: Department = new Department();
  departmentForm:FormGroup;


  public selectedValues: any = [];
  public res = [];
  public ids=[];

  public privlgs=[];
  constructor(private modalService: NgbModal,private toastr: ToastrService,
    private _route:Router,private departmentService: DepartmentService,
    private privilegeService: PrivilegeService,private changeDetection: ChangeDetectorRef ,
    private formBuilder:FormBuilder) {
    this.list_pages = listPagesDB.list_pages;
   ////alert(this.serviceDataView(this.privileges));
  }

  
  ngOnInit() {
    this.getAllDepartment();
    this.getAllPrivilages();

    this.departmentForm = this.formBuilder.group({
      deptname: ['',Validators.required],
      multiselect: ['',Validators.required],
    })
    
  }

  getAllDepartment(){
    this.departmentService.getAll().subscribe(data => {
     
      
      this.departments = data;
      console.log(this.departments);
      this.departments=this.departments["data"];
      ////alert(JSON.stringify(this.departments));
      
      
    });
  }
  getAllPrivilages(){
    this.privilegeService.getAll().subscribe(data => {
      this.privileges = data;
      console.log(this.privileges);
      this.privileges=this.privileges["data"];
      ////alert(JSON.stringify(this.privileges));
    });
  }

  get f(){
    return this.departmentForm.controls;
  }


 
  save() {
    if(this.departmentForm.invalid){
      Swal.fire({
        text: 'Please fill provided details',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 50,
      });
      return;
    }
    console.log(this.f.deptname.value) 
    if( this.f.deptname.value != '' && this.selectedPrivilegeGroupValue != []){

      let  list :any =[];
      list.push(this.departments.find((x)=> x.name === this.f.deptname.value))
      if(list[0] === undefined){
        this.modalService.dismissAll();
        let data = {
          "name":this.f.deptname.value,
          "privilegeGroups":this.selectedPrivilegeGroupValue
        }
        console.log(data);
        this.departmentService.postDepartment(data).subscribe(
          result => {
            if(result){
              Swal.fire({
                text: 'New Department Created',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor:  '#3085d6',
                imageHeight: 500,
            });
              this.departments.push(this.department);
              this.getAllDepartment();
              this.changeDetection.detectChanges();
            }
            else{
              Swal.fire({
                text: 'Already Added',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor:  '#3085d6',
                imageHeight: 500,
            });
            }
        
          },
          error => {
            console.error(error); 
            }
        );
      }
      else{
        this.deptname= '';
        //this.selectedValues = [];
        Swal.fire({
          text: 'Already Exist!!!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor:  '#3085d6',
          imageHeight: 500,
      });
      }
   
    }
    
   

  }


  update(){

    if(this.departmentForm.invalid){
      Swal.fire({
        text: 'Please fill provided details',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 50,
      });
      return;
    }

    let data :any = [];
    data.push(this.departments.find((res)=> res.name === this.deptname && res.name != this.DEPT_NAME));
    console.log(data);
    if(data[0] === undefined ){
        if( this.f.deptname.value != '' && this.selectedPrivilegeGroupValue != []){

              let data = {
                "name":this.f.deptname.value,
                "privilegeGroups":this.selectedPrivilegeGroupValue
              }
              console.log(data);
              this.modalService.dismissAll();
              this.departmentService.updateDepartment(data,this.editDeptID).subscribe((res:any)=>{
                console.log(res);
                  Swal.fire({
                    text: 'Updated Successfully',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                    confirmButtonColor:  '#3085d6',
                    imageHeight: 50,
                });
                this.getAllDepartment();
              })

        }
        else{
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
    else{
      Swal.fire({
        text: 'Already Exists',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor:  '#3085d6',
        imageHeight: 50,
      });
    }


  }
  handleChange(value:any) {
    if(this.add_Modal_Flag === true){
      let data :any = [];
      for(let i=0;i<this.selectedValues.length;i++){
        data.push(this.selectedValues[i]["_id"])
      } 
      this.selectedPrivilegeGroupValue = data;
      console.log(this.selectedPrivilegeGroupValue);
    }
    else{
      let data :any = [];
      console.log(this.selectedValues)
      for(let i=0;i<this.selectedValues.length;i++){
        data.push(this.selectedValues[i]["_id"])
      } 
      this.selectedPrivilegeGroupValue = data;
      console.log(this.selectedPrivilegeGroupValue)
    }
    //let this.privilege=this.privileges[index];
    //this.privlgs.push({"privilage":this.privileges[index][0]});
    //this.createJSON(this.privlgs);
    
  }

  handleFilter(value) {
    if (value.length >= 3) {
      let data :any =[];
      data = this.privileges.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      this.privileges = data;
    }else if(value === ''){
      this.getAllPrivilages();
    }
    else{
      this.getAllPrivilages();
      this.multiselect.toggle(false);
    }
  }
 
  toplevelLink(){
    this._route.navigate(['/team-management/team-list']);
  }

  open(content,Value:any,id:any) {
    console.log(Value)
    if(Value === 'add'){
      this.add_Modal_Flag = true;
      this.deptname = '';
      this.selectedValues = [];
      //this.update_Modal_Flag = false;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    else if(Value === 'edit'){
      this.add_Modal_Flag = false;
      //this.update_Modal_Flag = true;
      this.editDeptID = id;
      console.log(id);
      this.departmentService.getSingleDepartment(id).subscribe((res:any)=>{
        console.log(res);
        let data :any = [];
        data = res.data;
       this.deptname = res.data.name;
       this.DEPT_NAME =  res.data.name;
       this.selectedValues = res.data.active_privilege_groups;
    
       this.privileges = res.data.all_privilege_groups;
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  editDapartment(deptid){
  }

  deleteDapartment(deptid,name){
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
        this.departmentService.deleteDepartment(deptid).subscribe((res)=>{
          console.log(res);
          Swal.fire({
            text: name+' Department Deleted',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor:  '#3085d6',
            imageHeight: 50,
        });
          this.getAllDepartment();
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  
  }

  
  isControlHasError(form: string, controlName: string, validationType: string): boolean {
    let control = null;
    
    switch (form) {
      case 'departmentForm': control = this.departmentForm.controls[controlName]; break;
    }
    if (!control) {
      return false;
    }
    console.log("control : ",control);
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    console.log("result : ",result);
    return result;
  }


}
