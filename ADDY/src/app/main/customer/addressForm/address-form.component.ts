import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { CustomerService } from 'src/app/services/customer.service';
import { SharedService } from 'src/app/shared.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  public loading:boolean=false;
  constructor(private _customerService:CustomerService,private router: Router,
    private _sharedService:SharedService) { }

  ngOnInit(): void {
    
  }
  setCurrentUser(e:any,f:any,l:any){
    let input={
     
      email: e,
      firstName: f,
    
      lastName: l,
     
    }

    return input;
  }
  gotoMap(){
    this.router.navigate(["/customerMap"]);

  }
  get f(){
    return this.form.controls;
  }
  back(){
    
  }
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    last_name: new FormControl('')
  });
  submit(){
    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
      this.loading=true;
      localStorage.setItem('currentUser',JSON.stringify(this.setCurrentUser(this.form.value.email, this.form.value.name,this.form.value.last_name)));


    this.router.navigate(["/customerMap"," "]);
    }
  

}
