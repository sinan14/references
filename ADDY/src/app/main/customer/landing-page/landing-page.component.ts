import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { CustomerService } from 'src/app/services/customer.service';
import { SharedService } from '../../../shared.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  oderId:any;
  mobile!: number;
  filladdress:boolean=false;
  constructor(private _sharedService : SharedService,private route: ActivatedRoute,
     private router: Router,private _customerService:CustomerService) { 
   this.oderId= this.route.snapshot.paramMap.get("id");
    //this._sharedService.setData(this._sharedService.orderId, this.oderId);
    // localStorage.setItem('orderid',JSON.stringify( this.oderId));
    // this.oderId = JSON.parse((localStorage.getItem('orderid') || '{}'));

console.log(this.oderId,"pppppppppppp");


  }

  ngOnInit(): void {
   
  }
  ngAfterViewInit(){


  }
  gotoAddressForm(){
   // [routerLink]="['/customerHome']"
  // this.router.navigate(["/addressList"]);
   this.router.navigate(["/addressForm"]);


  }
  secondPage(){
    this.router.navigate(["/addressForm"]);

  }
  checkLink() {

    this._customerService.checkLink(this.oderId).subscribe(
      (res: any) => {
       console.log(res,"res");
       if(res.status){
       this.mobile= res.data.responseData.toMobile;
       localStorage.setItem('mobile',JSON.stringify(  this.mobile));

         if(res.data.responseData.toScreen=="address"){
         this.router.navigate(["/addressList"]);

         }else if(res.data.responseData.toScreen=="know_more"){
           this.filladdress=true;

         }

       }else{
        this.router.navigate(["/url"]);
    


       }
       
      },
      (err: any) => {}
    );
  }

}
