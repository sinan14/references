import { Component, NgZone, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-driver-map',
  templateUrl: './driver-map.component.html',
  styleUrls: ['./driver-map.component.css']
})
export class DriverMapComponent implements OnInit {
 
  display = "none";
latiAndLongi:any
latitude!: number;
  longitude!: number;
  zoom!: number;
  address!: string;
  from_Latitude!:number
  from_Longitude!:number
  to_Latitude:any
  to_Longitude:any
  //lat!:number;
  //lng!:number;
  public lat = 11.595000;
public lng = 75.590591;

public origin: any;
public destination: any;
  constructor(private router: Router, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,private _route:ActivatedRoute) { 
      this._route.queryParams.subscribe(params => {
        this.from_Latitude=Number(params.latitude);
        this.from_Longitude=Number(params.longitude);
        console.log("param="+ this.from_Latitude,this.from_Longitude)
      });
    }


  ngOnInit(): void {
    this.getDirection();
   // this.lat=11.595000;
    //this.lng=75.590591
  
    //this.to_Latitude = Number(localStorage.getItem("to-latitude")); //get location
    //this.to_Longitude = Number(localStorage.getItem("to-longitude")); //get location
    //this.from_Latitude = Number(localStorage.getItem("from-latitude")); //get location
   // this.from_Longitude = Number(localStorage.getItem("to-longitude")); //get location
    //console.log(this.to_Latitude +  +this.to_Longitude+  +this.from_Latitude+  +this.from_Longitude)
 
  this.setCurrentLocation();
  
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
getDirection() {
  this.origin = { lat: 11.595000, lng: 75.590591 };
  this.destination = { lat: 10.5952496, lng: 76.0362579 };

  // Location within a string
  // this.origin = 'Taipei Main Station';
  // this.destination = 'Taiwan Presidential Office';
}
}
