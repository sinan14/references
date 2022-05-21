import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/internal/operators';
import EmployeeService from 'src/app/services/employee.service';
import Employee from 'src/app/models/employee.model';
import DepartmentService from 'src/app/services/department.service';
import Department from 'src/app/models/department.model';
import PrivilegeService from 'src/app/services/privilege.service';
import Privilege from 'src/app/models/privilege.model';
import Swal from 'sweetalert2';
import { ThemeService } from 'ng2-charts';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  public API = environment.apiUrl;

  public closeResult: string;
  public generalForm: FormGroup;
  public seoForm: FormGroup;
  state$: Observable<object>;
  public privileges: Array<Privilege>;
  public depId;
  public selectedPrivilegeGroupValue: Array<string> = [];

  public employees;
  public res = [];
  public ids = [];

  public desgins = [];
  public depts = [];
  public emails = [];
  public phones = [];
  public listPermissions: Array<string> = ['Manage Admin', 'Manage HR', 'Manage Accounts', 'Manage Products', 'Manage Order', 'Manage Inventory'];
  public DeptName: any;
  public department: any;
  public selectedValues: any = [];
  public allPrivilegeValues: any = [];
  public departmentForm: FormGroup;
  public departments :any = [];

  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _route: Router,
    public activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private privilegeService: PrivilegeService) {
  }

  ngOnInit() {
    // this.depId = this.activatedRoute.snapshot.paramMap.get('_');
    // this.getDepartmentDetails(this.depId);

    this.activatedRoute.paramMap.subscribe(params => {
      this.depId = params.get('departmentId');
         this.getDepartmentDetails(this.depId);

    });

    this.getEmployeeDetails();
    this.getAllDepartment();

  }

  get f() {
    return this.departmentForm.controls;
  }

  getEmployeeDetails() {
    this.departmentService.getEmployeeListByDeptID(this.depId).subscribe(res => {
      this.employees = res["data"];
      console.log("Employees", this.employees);
    });
  }

  getAllDepartment(){
    this.departmentService.getAll().subscribe((res:any) => {
     
      this.departments = res.data;
    });
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

  newEmployee(id) {
    this._route.navigate(['/team-management/new-employee', id]);
  }


  getDepartmentDetails(id) {
    this.departmentService.getSingleDepartment(id).subscribe((res: any) => {
      console.log(res.data)
      this.department = res.data;
      this.privileges = res.data.active_privilege_groups;
      this.allPrivilegeValues = res.data.all_privilege_groups;
      console.log(this.privileges)
      this.selectedValues = this.privileges
      //this.seselectedValues;
      this.DeptName = res.data.name;


      this.departmentForm = this.formBuilder.group({
        deptname: [this.DeptName, Validators.required],
        multiselect: [this.selectedValues, Validators.required],
      })

    })
  }



  handleChange(value: any) {
    let data: any = [];
    for (let i = 0; i < this.selectedValues.length; i++) {
      data.push(this.selectedValues[i]["_id"])
    }
    this.selectedPrivilegeGroupValue = data;
    console.log(this.selectedPrivilegeGroupValue);
    //let this.privilege=this.privileges[index];
    //this.privlgs.push({"privilage":this.privileges[index][0]});
    //this.createJSON(this.privlgs);

  }

  update() {

    if (this.departmentForm.invalid) {
      return;
    }
    let data :any = [];
    data.push(this.departments.find((res:any)=> res.name === this.f.deptname.value && res.name != this.DeptName ));
    console.log(data);
    if(data[0] === undefined ){
        if( this.f.deptname.value != '' && this.selectedPrivilegeGroupValue != []){
            let data = {
              "name":this.f.deptname.value,
              "privilegeGroups":this.selectedPrivilegeGroupValue
            }
            console.log(data);
            this.modalService.dismissAll();
            this.departmentService.updateDepartment(data,this.depId).subscribe((res:any)=>{
              console.log(res);
              Swal.fire({
                text: 'Updated Successfully',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
                confirmButtonColor:  '#3085d6',
                imageHeight: 50,
              });
            })
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
  editEmployee(id) {
    this._route.navigate(['/team-management/edit-employee', this.depId, id]);
  }

  deleteEmployee(id) {

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
        this.departmentService.deleteEmployee(id).subscribe((res) => {
          console.log(res);
          this.getEmployeeDetails();
          Swal.fire({
            text: 'Employee Deleted Successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3085d6',
            imageHeight: 50,
          });
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });


  }

  employeeSearchFilter(event: any) {

    if(event.target.value != ''){
      let input ={
        "keyword":event.target.value,
        "departmentId":this.depId
      }
      this.departmentService.searchEmployee(input).subscribe((res: any) => {
        console.log(res);
        this.employees = res.result;
      })
    }
    else {
      this.getEmployeeDetails();
    }
    // if(event.target.value != ''){
    //   const val = event.target.value.toLowerCase();

    //   // filter our data
    //   const temp = this.employees.filter(function (d) {
    //     return d.firstname.toLowerCase().indexOf(val) !== -1 || !val;
    //   });

    //   // update the rows
    //   this.employees = temp;
    // }
    // else{
    //   this.getEmployeeDetails();
    // }
  }

}
