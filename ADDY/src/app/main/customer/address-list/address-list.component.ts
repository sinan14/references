import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { CustomerService } from 'src/app/services/customer.service';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {
  orderId:any;
  address:any;
  city:any;
  area:any;
  houseNumber:any;
  addressId:any;
  constructor(private route: ActivatedRoute,private _customerService:CustomerService,private router: Router,private _sharedService:SharedService) { 
    // this.orderId = (this._sharedService.get(this._sharedService.orderId));
   // this.orderId= this.route.snapshot.paramMap.get("id");
   this.orderId = JSON.parse((localStorage.getItem('orderid') || '{}'));

    console.log(this.orderId,"bbbbbbbbbbbbbbbbbbbbb");
  }

  ngOnInit(): void {

    this.checkout();
    

  }
 
  gotothanku(){
    this.router.navigate(["/customerThankz"]);

  }
  gotomap(){
    this.router.navigate(["/customerMap",this.addressId]);

  }
  back(){
    this.router.navigate(["/user"]);

  }

  edit(){
    this.router.navigate(["/customerMap"]);

  }
  checkout() {

    this._customerService.checkout(this.orderId).subscribe(
      (res: any) => {
       console.log(res,"res",res.data.addresses[0].address );
       if(res.data.addresses.length >0){
       this.address= res.data.addresses[0].address;
       console.log( res.data.addresses[0].address,"ggggggggggg");
       
       this.city=res.data.addresses[0].city;
this.area=res.data.addresses[0].area;
this.houseNumber=res.data.addresses[0].houseNumber;
this.addressId=res.data.addresses[0]._id;
localStorage.setItem('addressId',JSON.stringify( this.addressId));

console.log(this.houseNumber,this.area,this.city,this.address,"///////////////");

       }else{
       

       }
       
      },
      (err: any) => {}
    );
  }

}
