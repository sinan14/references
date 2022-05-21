import { ActivatedRoute, Router, Params } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-customer-map',
  templateUrl: './customer-map.component.html',
  styleUrls: ['./customer-map.component.css'],
})
export class CustomerMapComponent implements OnInit {
  display = 'none';

  pincode!: number;
  latitude!: number;
  longitude!: number;
  zoom!: number;
  street!: string;
  addressId: any;
  area: any;
  city: any;

  @ViewChild('search') public searchElementRef!: ElementRef;

  geoCoder = new google.maps.Geocoder();
  constructor(
    private _customerService: CustomerService,
    private router: Router,
    private _sharedService: SharedService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) {
    //     this.addressId= this.route.snapshot.paramMap.get("id");
    // console.log( this.addressId);
  }
  setLocation(l: number, lng: number, c: any, s: any, pin: number, a: any) {
    let input = {
      lat: l,
      lng: lng,
      city: c,
      street: s,
      pincode: pin,
      area: a,
    };

    return input;
  }
  ngOnInit(): void {
    // if(this.addressId){

    // }
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      // this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(place, 'jkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjkjki');

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          console.log(this.latitude, this.longitude, 'latt');
          this.getAddress(this.latitude, this.longitude);
          this.zoom = 12;
        });
      });
    });
  }

  // Get Current Location Coordinates
  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude: number, longitude: number) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        console.log(results);
        console.log(status);
        if (status === 'OK') {
          this.zoom = 12;
          for (let i = 0; i < results.length; i++) {
            var types = results[i].types;

            if (types[0] === 'locality') {
              this.street = results[i].address_components[0].long_name;
              console.log(this.street, 'street');
            } else if (types[0] === 'postal_code') {
              this.pincode = results[i].address_components[0].long_name;
              console.log(this.pincode, 'pin');
            } else if (types[0] === 'route') {
              this.area = results[i].address_components[0].long_name;
              console.log(this.area, 'area');
            } else if (types[0] === 'administrative_area_level_2') {
              this.city = results[i].address_components[0].long_name;
              console.log(this.city, 'city');
            }
            // if(results[i].types[0]){
            // if(results[i].types[0]=="postal_code"){
            //   console.log(results[i].address_components[0].short_name);
            //   this.pincode=results[i].address_components[0].short_name
            // }

            // }
          }

          localStorage.setItem(
            'currentPosition',
            JSON.stringify(
              this.setLocation(
                latitude,
                longitude,
                this.street,
                this.city,
                this.pincode,
                this.area
              )
            )
          );
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  gotoConfirm() {
    this.router.navigate(['/addressconfirm']);
  }
  back() {
    this.router.navigate(['/user', ' ']);
  }
  openModal() {
    console.log('sdsd');

    this.display = 'block';
  }
  onCloseHandled() {
    this.display = 'none';
  }
}
