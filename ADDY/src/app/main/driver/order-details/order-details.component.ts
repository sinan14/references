import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { DriverLoginService } from 'src/app/services/driver-login.service';
import { LoginComponent } from '../login/login.component';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  packagePrice:any
  acceptvalue:boolean=false;
  order_id!:any
  updateStatus:any
status:any
phoneNumber:any
  fromAddress:any
  toAddress:any
  deliveryFee:any
  from_Latitude:any
  from_Longitude:any
  to_Latitude:any
  to_Longitude:any
  latitude!: number;
  longitude!: number;
  zoom!: number;
  constructor(private router: Router,
    private login:DriverLoginService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.setCurrentLocation()
    this.order_id=localStorage.getItem("orderId") as string
    console.log(this.order_id)
    this.login.order_details(this.order_id).subscribe((res:any)=>{
      this.packagePrice=res.data.packagePrice
      this.fromAddress=res.data.fromAddress
      this.toAddress=res.data.toAddress
      this.phoneNumber=res.data.toAddress.mobile
      this.to_Latitude=res.data.toAddress.location.latitude
      this.to_Longitude=res.data.toAddress.location.longitude
      this.from_Latitude=res.data.fromAddress.location.latitude
      this.from_Longitude=res.data.fromAddress.location.longitude
      console.log("lattitude" +this.to_Latitude)
     
     
     
  
   
    })
    
  }
  // Get Current Location Coordinates
setCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position
        );
      
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.zoom = 16;1
      

    });
  }
}
  order(){
    this.router.navigate(["/order"]);

  }
  accept(){
    this.acceptvalue=true;
  }
  deliverFeePay()
  {
     this.login.deliver_fee(this.order_id,this.deliveryFee).subscribe((res:any)=>{
       console.log(Object.values(res)[0])
       if(Object.values(res)[0]=="estimatedDeliveryFee added"){
       
       this.login.status_update(this.order_id,"Approved").subscribe((res:any)=>{
       console.log(res)
       this.acceptvalue=true;
       })
       this.login.driver_status_list(this.order_id).subscribe((res:any)=>{
         console.log(res)
         this.status=res.data.statuses
         console.log(this.status)
       })
       }else{
        this.acceptvalue=false;
       }
     })
  }
  reject(){
    this.login.status_update(this.order_id,"Rejected").subscribe((res:any)=>{
      console.log(res)
    })
  }
  statusUpdate(e:any){
this.updateStatus=e.target.value;
   // this.login.status_update(this.order_id,e.target.value).subscribe((res:any)=>{
     // console.log(res)
    //})

  }
  update(){
    this.login.status_update(this.order_id,this.updateStatus).subscribe((res:any)=>{
      console.log(res)
     })
  }
  callNow(){
    const num = `tel:+91${this.phoneNumber}`;
    var aTag = document.createElement('a');
    aTag.setAttribute('href', num);
    aTag.click();
  }
  fromNav(){
    window.open("https://www.google.com/maps/dir/?api=1&origin="+this.latitude+","+this.longitude+"&destination="+this.from_Latitude+","+this.from_Longitude)
   
  }
  toNav(){
    window.open("https://www.google.com/maps/dir/?api=1&origin="+this.latitude+","+this.longitude+"&destination="+this.to_Latitude+","+this.to_Longitude)
}
}