import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'delivery-app-map',
  templateUrl: './delivery-map.component.html',
  styleUrls: ['./delivery-map.component.css'],
})
export class DeliveryMapComponent implements OnInit {
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
  isNewAddress: boolean = true;
  constructor(
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthService
  ) {}
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
    this._activatedRoute.params.subscribe((params) => {
      const status = params['status'];
      if (status == 'new') {
        this.isNewAddress = true;
      } else if (status == 'update') {
        this.isNewAddress = false;
      } else {
        this.router.navigate(['/']);
      }
    });
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
          }
          this._auth.deliveryLocation = JSON.stringify(
            this.setLocation(
              latitude,
              longitude,
              this.street,
              this.city,
              this.pincode,
              this.area
            )
          );
          localStorage.setItem(
            'deliveryLocation',
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
    const status = this.isNewAddress ? 'new' : 'update';
    const route = `/complete-address/${status}`;
    console.log(status, route);
    alert(`stat is ${status} route is ${route}`);

    this.router.navigate([route]);
  }
  back() {
    this.router.navigate(['/shopping']);
  }
  openModal() {
    console.log('sdsd');

    this.display = 'block';
  }
  onCloseHandled() {
    this.display = 'none';
  }
}
