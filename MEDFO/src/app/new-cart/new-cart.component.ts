import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NewCartService } from 'src/app/services/new-cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-cart',
  templateUrl: './new-cart.component.html',
  styleUrls: ['./new-cart.component.css'],
})
export class NewCartComponent implements OnInit {
  add_Modal_Flag: boolean;
  update_Modal_Flag: boolean;
  errorInAddress: boolean;
  public userAddresses: any;
  public userAddress: any;

  phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  indianPinRegex: any = '';
  closeResult: string;

  constructor(
    private _cartService: NewCartService,
    // private modalService: NgbModal,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.add_Modal_Flag = false;
    this.update_Modal_Flag = false;
    this.getUserAddress();
  }

  newAddressForm: FormGroup = this._fb.group({
    id: [''],
    name: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern(this.phoneReg)]],
    pincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
    house: ['', [Validators.required]],
    landmark: ['', [Validators.required]],
    street: ['', [Validators.required]],
    type: ['', [Validators.required]],
    state: ['', Validators.required],
  });

  getUserAddress() {
    //we need to give some code to get user _id
    this._cartService.getAddress().subscribe(
      (res: any) => {
        console.log(res);
        this.userAddresses = res.data.address;

        if (res.error == false) {
        } else {
          console.log('some error occured');
        }
      },
      (err: any) => {}
    );
  }

  deleteUserAddress(num) {
    const id = this.userAddresses[num]._id;
    this._cartService.deleteUserAddress(id).subscribe(
      (res: any) => {
        console.log(res);
        if (res.error == false) {
          Swal.fire({
            icon: 'success',
            title: 'deleted successfully',
          });
          this.getUserAddress();
        } else {
          console.log('some error occured');
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  onSubmitAddress() {
    console.log(this.newAddressForm.value);
    console.log(this.newAddressForm);

    if (this.update_Modal_Flag == true) {
      this.updateAddress();
    } else {
      this.addNewUserAddress();
    }
  }

  addNewUserAddress() {
    console.log(this.newAddressForm.value);
    console.log(this.newAddressForm);
    if (this.newAddressForm.invalid) {
      this.errorInAddress = true;
      return;
    } else {
      this._cartService.addUserAddress(this.newAddressForm.value).subscribe(
        (res: any) => {
          console.log(res);
          if (res.error == false) {
            Swal.fire({
              title: 'Address added successfully',
              icon: 'success',
            }).then(() => {
              document.getElementById('dismiss-add-address').click();
              this.newAddressForm.reset();
              this.getUserAddress();
            });
          } else {
            console.log('some error occured');
          }
        },
        (err: any) => {
          console.log('some server occured');
        }
      );
    }
  }
  updateAddress() {
    if (this.newAddressForm.invalid) {
      this.errorInAddress = true;
      return;
    } else {
      this._cartService.editUserAddress(this.newAddressForm.value).subscribe(
        (res: any) => {
          console.log(res);
          if (res.error == false) {
            Swal.fire({
              title: 'Address updated successfully',
              icon: 'success',
            }).then(() => {
              document.getElementById('dismiss-add-address').click();
              document.getElementById('popup-select-address').click();
              this.getUserAddress();

              this.update_Modal_Flag = false;
              this.newAddressForm.reset();
            });
          } else {
            console.log('some error occured');
          }
        },
        (err: any) => {
          console.log('some server occured');
        }
      );
    }
  }

  changeAddressStatus(i) {
    console.log(i);
    const id = this.userAddresses[i]._id;

    this._cartService.changeAddresStatusById(id).subscribe(
      (res: any) => {
        console.log(res);

        if (res.error == false) {
          Swal.fire({
            icon: 'success',
            title: 'successfully deleted',
          }).then(() => {
            this.getUserAddress();
          });
        } else {
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  isValidnewUserAddress(controlName: any) {
    return (
      (this.newAddressForm.get(controlName)!.invalid &&
        this.newAddressForm.get(controlName)!.touched) ||
      (this.errorInAddress && this.newAddressForm.get(controlName).invalid)
    );
  }
  closeAddressForm() {
    this.newAddressForm.reset();
  }
  closeSelectAddress() {
    document.getElementById('dismiss-select-address').click();
  }
  editUserAddress(number) {
    this.update_Modal_Flag = true;
    this.navigateToAddForm(number);
  }
  navigateToAddForm(num) {
    if (this.update_Modal_Flag == false) {
      document.getElementById('dismiss-select-address').click();

      document.getElementById('popup-add-address').click();
    } else {
      document.getElementById('dismiss-select-address').click();
      document.getElementById('popup-add-address').click();

      this.patchAddForm(num);
    }
  }
  patchAddForm(i) {
    this.newAddressForm.patchValue({
      id: this.userAddresses[i]._id,
      name: this.userAddresses[i].name,
      mobile: this.userAddresses[i].mobile,
      pincode: this.userAddresses[i].pincode,
      house: this.userAddresses[i].house,
      landmark: this.userAddresses[i].landmark,
      street: this.userAddresses[i].street,
      type: this.userAddresses[i].type,
      state: this.userAddresses[i].state,
    });
  }
  states: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Orissa',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];
  ngAfterViewInit() {
    // @ts-ignore
    $('.owl-carousel').owlCarousel({});
  }
}
