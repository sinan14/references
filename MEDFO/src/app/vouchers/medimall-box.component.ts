import { Component, OnInit } from '@angular/core';
import { CouponService } from 'src/app/services/coupon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medimall-box',
  templateUrl: './medimall-box.component.html',
  styleUrls: ['./medimall-box.component.css'],
})
export class MedimallBoxComponent implements OnInit {
  public allCoupons: any = [];
  public filteredCoupons: any = [];
  public allCategory: boolean;
  public medicineCategory: boolean;
  public consultationCategory: boolean;
  public diagnosticCategory: boolean;
  showCouponDetails: any = [
    {
      category: 'healthcare',
      code: 'SUBH1001',
      from: '26 November 2021',
      image: 'http://143.110.240.107:8000/coupon/image_1634981368457.jpg',
      name: 'SUBheal',
      termsAndCondition: 'ufyugvjuv',
      to: '31 December 2021',
      type: 'scratchable',
      _id: '618f54953e0df331580a333c',
    },
  ];

  public categories: string[] = [
    'All',
    'medicine',
    'healthcare',
    'Subscription',
    'Premium Subscription',
  ];

  constructor(private _couponService: CouponService) {}

  ngOnInit(): void {
    this.fetchCoupons();
  }

  openCategory(evt, categoryName) {
    var i, tabcontent, tablinks;
    console.log(categoryName);
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    evt.currentTarget.className += ' active';
    this.filterCategoryWise(categoryName);
  }

  filterCategoryWise(categoryName) {
    document.getElementById('London').style.display = 'block';
    console.log(categoryName);
    console.log(this.categories);
    if (categoryName == this.categories[0]) {
      this.filteredCoupons = this.allCoupons;
    } else if (categoryName == this.categories[1]) {
      this.filteredCoupons = this.allCoupons.filter(
        (item) => item.category == this.categories[1]
      );
      // .filter((el) => new Date(el.from) <= new Date())
      // .filter((e) => new Date(e.to) >= new Date());
    } else if (categoryName == this.categories[2]) {
      this.filteredCoupons = this.allCoupons
        .filter((item) => item.category == this.categories[2])
        //checking from date is less than yester day

        // .filter((el) => new Date(el.from) <= new Date())
        // //checking to date is grater than yester day
        .filter((e) => new Date(e.to) >= new Date());
    } else if (categoryName == this.categories[3]) {
      this.filteredCoupons = this.allCoupons.filter(
        (item) => item.category == this.categories[3]
      );
      // .filter((el) => new Date(el.from) <= new Date())
      // .filter((e) => new Date(e.to) >= new Date());
    } else if (categoryName == this.categories[4]) {
      this.filteredCoupons = this.allCoupons.filter(
        (item) => item.category == this.categories[4]
      );
      // .filter((el) => new Date(el.from) <= new Date())
      // .filter((e) => new Date(e.to) >= new Date());
    }
    console.log(this.filteredCoupons);
  }

  viewCoupon(couponDetails, index) {
    this.showCouponDetails = couponDetails;
    this.showCouponDetails.inputId = `inputfield${index}`;
    console.log(this.showCouponDetails);
  }
  //database methods
  // fetch coupons
  fetchCoupons() {
    this._couponService.fetchCoupons().subscribe(
      (res: any) => {
        console.log(res);
        if (res.error == false) {
          document.getElementById('London').style.display = 'block';
          this.filteredCoupons = JSON.parse(JSON.stringify(res.data.allCoupons))
            .filter(
              (el) =>
                new Date(el.from) <= new Date() && new Date(el.to) >= new Date()
            )
            .sort(function (a: any, b: any) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              //@ts-ignore
              return new Date(b.from) - new Date(a.from);
            });
          // .filter((e) => new Date(e.to) >= new Date());
          console.log(this.filteredCoupons);

          console.log(res.data.allCoupons);

          this.allCoupons = this.filteredCoupons;
          setTimeout(() => {
            console.log('click');
            document.getElementById('buttonAll').click();
            console.log('click');
          }, 1500);
        }
      },
      (error) => {
        console.log(error.error);
      }
    );
  }

  /* To copy any Text */
  copyText(text: string) {
    // this.currentURL = text;

    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    textField.focus(); //SET FOCUS on the TEXTFIELD
    document.execCommand('copy');
    textField.remove();
    console.log('should have copied ' + text);
    const modal = document.getElementById('viewCoupon');
    modal.focus(); //SET FOCUS BACK to MODAL
    Swal.fire({
      text: 'Coupon code copied',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3085d6',
      imageHeight: 1000,
    });
  }
}
