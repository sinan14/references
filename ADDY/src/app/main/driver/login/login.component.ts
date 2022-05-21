import { Component, OnInit } from '@angular/core';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params, ParamMap } from "@angular/router";
import { DriverLoginService } from 'src/app/services/driver-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
message:any;
routeId:any
flag:boolean=true
linkStatus:any
mobileNumber!:string
countryCode!:string
  constructor(private router: Router,
    private login:DriverLoginService,
    private route:ActivatedRoute) {
      this.route.paramMap.subscribe((params:ParamMap) => {
      this.routeId=params.get('id')
      console.log(this.routeId)
      })
     }

  ngOnInit(): void {
this.login.login_validity(this.routeId).subscribe((res:any)=>{
 this.linkStatus=Object.values(res)[0]
if(this.linkStatus=="Valid link"){
this.flag=false
}else if(this.linkStatus=="Invalid orderId."){
  this.flag=true
}

  
})

    
  
    const phoneInputField = document.querySelector("#phone");
    const phoneInput = (<any>window).intlTelInput(phoneInputField, {
      preferredCountries: ["us", "co", "in", "de"],
      separateDialCode:true,
      enablePlaceholder:false,
     utilsScript:
       "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
   });
  }
  order(){
    this.login.login(this.countryCode,this.mobileNumber).subscribe((res:any)=>{
      this.message=Object.values(res)[0]
      if(this.message=="logged in successfully"){
        localStorage.setItem("orderId",this.routeId)
        this.router.navigate(["/driver-order"]);
        console.log(this.mobileNumber)
      }
    })

  
    //

  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
hope(e:any){
console.log(e)
}
code(e:any)
{
  console.log((e.dialCode))
  this.countryCode=e.dialCode;

}
}
