import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-delivery-address-cnfirm',
  templateUrl: './delivery-address-cnfirm.component.html',
  styleUrls: ['./delivery-address-cnfirm.component.css'],
})
export class DeliveryAddressCnfirmComponent implements OnInit {
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _activatedRoute: ActivatedRoute
  ) {}
  public location: any;
  private errorInAddress: boolean = false;
  private isNewAddress: boolean = false;
  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      const status = params['status'];
      if (status == 'new') {
        this.isNewAddress = true;
        this.getLocationFromGoogleMap();
      } else if (status == 'update') {
        this.isNewAddress = false;
        this.getAddressToUpdate();
      } else {
        this._router.navigate(['/']);
      }
    });
  }

  back() {
    const status = this.isNewAddress ? 'new' : 'update';
    this._router.navigate([`/locate-address/${status}`]);
  }

  addressForm: FormGroup = this._fb.group({
    houseNumber: ['', [Validators.required]],
    buildingName: ['', []],

    address: ['', [Validators.required]],
    area: ['', [Validators.required]],
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    pinCode: ['', [Validators.required]],
    latitude: ['', [Validators.required]],
    longitude: ['', [Validators.required]],
    deliveryInstruction: [''],
  });
  submitAddress() {
    console.log(this.addressForm.value);

    if (this.addressForm.invalid) {
      return;
    }
    const address = { ...this.addressForm.value };
    delete address.deliveryInstruction;
    if (this.isNewAddress) {
      this.addNewAddress(address);
    } else {
      address.id = this.location._id;
      this.updateAddress(address);
    }
  }
  addNewAddress(address) {
    this._auth.addNewDeliveryAddresses(address).subscribe(
      (res: any) => {
        this._auth.sw('success', 'Address added successfully');
        this._auth.fullyAuthenticate();
        this.toAddressModal();
      },
      (e) => {
        this.handleErr(e);
        this._auth.sw('error', e.error.message);
      }
    );
  }
  toAddressModal() {
    this._router.navigate(['/shopping']);
    setTimeout(() => {
      document.getElementById('openAddress').click();
    }, 2500);
  }
  updateAddress(address) {
    this._auth.updateDeliveryAddresses(address).subscribe(
      (res: any) => {
        this._auth.sw('success', 'Address updated successfully');
        this.toAddressModal();
      },
      (e) => {
        this.handleErr(e);
        this._auth.sw('error', e.error.message);
      }
    );
  }
  handleErr(e) {
    console.log(e.error);
  }
  isValidAddress(controlName: any) {
    return (
      (this.addressForm.get(controlName)!.invalid &&
        this.addressForm.get(controlName)!.touched) ||
      (this.errorInAddress && this.addressForm.get(controlName).invalid)
    );
  }

  getAddressToUpdate() {
    this.location = JSON.parse(localStorage.getItem('addressToUpdate')) || {};
    console.log(this.location);
    if (JSON.stringify(this.location) === '{}') {
      this.toAddressModal();
    }

    this.addressForm.patchValue({
      houseNumber: this.location.houseNumber,
      latitude: this.location.location.latitude.toString(),
      longitude: this.location.location.longitude.toString(),
      street: this.location.street,
      area: this.location.area,
      city: this.location.city,
      pinCode: this.location.pinCode,
    });
    // localStorage.removeItem('deliveryLocation');
  }
  getLocationFromGoogleMap() {
    this.location = JSON.parse(localStorage.getItem('deliveryLocation')) || {};
    if (JSON.stringify(this.location) === '{}') {
      this.toAddressModal();
    }
    // location = JSON.parse(this._auth.deliveryLocation);
    // if (!location) {
    //   this.toAddressModal();
    // }

    this.addressForm.patchValue({
      latitude: this.location.lat.toString(),
      longitude: this.location.lng.toString(),
      street: this.location.street,
      area: this.location.area,
      city: this.location.city,
      pinCode: this.location.pincode,
    });
    console.log(this.addressForm.value);
    // localStorage.removeItem('deliveryLocation');
  }
}
