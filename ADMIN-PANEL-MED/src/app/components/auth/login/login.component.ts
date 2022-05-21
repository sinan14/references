import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import EmployeeService from 'src/app/services/employee.service';

import Employee from 'src/app/models/employee.model';
import PrivilegeService from 'src/app/services/privilege.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loading:boolean = false;
  public hasError:boolean = false;
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public employee:Employee=new Employee();
  public invalid=true;
  public privileges :any = [];
  public attemptedSubmit: any;
  public toastStyle: object = {};

  constructor(private formBuilder: FormBuilder,
    private _router: Router, private toastr: ToastrService, 
    private employeeService: EmployeeService,
    private privilegeService:PrivilegeService) {
    this.createLoginForm();
    this.createRegisterForm(); 
  }

  
  ngOnInit() {
  }
  getAllPrivilages(){
    this.privilegeService.getAll().subscribe(data => {
      this.privileges = data;
      console.log(this.privileges);
      this.privileges=this.privileges["data"];
      ////alert(JSON.stringify(this.privileges));
    });
  }


  owlcarousel = [
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    }
  ]
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  get f(){
    return this.loginForm.controls;
  }
  

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['',Validators.required],
      password: ['',Validators.required],
    })
  }
  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      userName: [''],
      password: [''],
      confirmPassword: [''],
    })
  }

  showSuccess(){
    // this.toastr.show('Successfully Loggined', '',{ 
    //   timeOut: 2000,
    //   disableTimeOut:false
    // });
    // this.toastStyle = { left: 'unset', right: 'unset' };
    Swal.fire({
      text: 'Login Success',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      confirmButtonColor:  '#3085d6',
      imageHeight: 50,
  });
  } 
  showWarning(){
    this.toastr.warning('Unableto Login', 'Either Login name or Passwordis incorrect',{
      timeOut: 2000,
      disableTimeOut:false
    });
  } 
  showError(){
    this.toastr.error('Unable to Login', 'Either Login name or Passwordis incorrect',{
      timeOut: 2000,
      disableTimeOut:false
    });
  } 
  onSubmit(){
    //event.preventDefault();
    if(this.loginForm.invalid){
      return;
    }
    this.loading = true;
    this.employeeService.login(this.f.userName.value,this.f.password.value).subscribe(result => {
     
        
          if (result != ''){
            console.log(result.token);
            this.showSuccess();
            if(result.isAdmin){
              this._router.navigate(['/dashboard']);
            }
            else if(result.isStore){
              this._router.navigate(['/orders']);
            }
            else if(!result.isAdmin){
              this._router.navigate(['/dashboard']);
            }
          }
      
        },
        error => {
          this.hasError = true;
 
    });

    

    }



   
 
  }


