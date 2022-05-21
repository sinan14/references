import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { CustomerService } from 'src/app/services/customer.service';
import { SharedService } from 'src/app/shared.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { data } from 'jquery';

@Component({
  selector: 'app-address-confirm',
  templateUrl: './address-confirm.component.html',
  styleUrls: ['./address-confirm.component.css']
})
export class AddressConfirmComponent implements OnInit {
  locaton:any;
  currentUser:any;
  orderId:any;
  mobile!: number;
  addressId:any;
  form = new FormGroup({
    address: new FormControl('',[Validators.required]),
    number: new FormControl('',[Validators.required]),
    delivery: new FormControl('',[Validators.required]),
    Bname:new FormControl('',[Validators.required])
  });
  constructor( private router: Router,private _customerService:CustomerService) {
   

   }

  ngOnInit(): void {
    this.orderId = JSON.parse((localStorage.getItem('orderid') || '{}'));
console.log(this.orderId,"sdsdsd");
this.mobile = JSON.parse((localStorage.getItem('mobile') || '{}'));
console.log(this.mobile,"mobile");

    this.locaton = JSON.parse((localStorage.getItem('currentPosition') || '{}'));
    console.log(this.locaton,"lll");

    this.currentUser = JSON.parse((localStorage.getItem('currentUser') || '{}'));
    console.log(this.currentUser,"useereee");
    
    this.addressId = JSON.parse((localStorage.getItem('addressId') || '{}'));

  }
   addAddress(){
    let locationdata={
    
      "latitude":this.locaton.lat.toString(),
      "longitude":this.locaton.lng.toString(),
      "buildingName":this.form.value.Bname,
          "address":this.form.value.address,
          "houseNumber":this.form.value.number,
          "pinCode":this.locaton.pincode,
          "street":this.locaton.street,
          "area":this.locaton.area,
          "city":this.locaton.city,
         
    
    }
    this._customerService.addAddress(locationdata).subscribe(
      (res: any) => {
        console.log(res);
        if(res){
          this.router.navigate(["/customerThankz"]);

        localStorage.clear();
        }
      })
 }
  get f(){
    return this.form.controls;
  }
  submit(){
    console.log(this.form.value);
    if(this.addressId){
      this.addAddress();
    }else{
    let datas={
      "orderId":this.orderId,
      "firstName":this.currentUser.firstName,
      "lastName":this.currentUser.lastName,
      "email":this.currentUser.email,
      "latitude":this.locaton.lat.toString(),
      "longitude":this.locaton.lng.toString(),
      "address": {
          "address":this.form.value.address,
          "house_no":this.form.value.number,
          "buildingName":this.form.value.Bname,
          "street":this.locaton.street,
          "area":this.locaton.area,
          "city":this.locaton.city,
         
      },
      "mobile":this.mobile,
    }
    console.log(datas);
    
    this._customerService.adduser(datas).subscribe(
      (res: any) => {
       console.log(res,"res");
       if(res){

        this.router.navigate(["/customerThankz"]);

        localStorage.clear();
       }
      })
    }
  }
  back(){
    this.router.navigate(["/customerMap"," "]);

  }
  
  checkout(){
    this.router.navigate(["/addressList"]);
  }


}
