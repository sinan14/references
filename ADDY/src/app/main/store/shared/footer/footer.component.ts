import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StoreHomeService } from 'src/app/services/store-home.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  public seller: any = {
    address: 'address 1',
    area: 'area details',
    businessName: 'Business name',
    code: '968',
    colorCode: '#000',
    colorName: 'Black',
    countryCode: 'OM',
    firstName: 'John',
    houseNumber: '3445',
    lastName: 'Mathew',
    latitude: '124',
    logo: 'https://addy.sgp1.digitaloceanspaces.com/1640679599754_apple.png',
    longitude: '125',
    mobile: '92513070',
    sellerId: '61cea413d2191ae5e5846435',
    street: 'street details',
    id: '61ceabad8ff211e30a5dc61f',
  };
  payment;
  constructor(private _homeService: StoreHomeService) {}
  public currentYear: any;
  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.fetchSellerDetails();
  }
  fetchSellerDetails() {
    this._homeService.fetchSellerDetails().subscribe(
      (res: any) => {
        // console.log(res);
        if (res.status) {
          this.seller = JSON.parse(JSON.stringify(res.data.sellerDetails));
          this.payment=res.data.sellerDetails.payment;
          localStorage.setItem('payment',JSON.stringify(this.payment));

          if (res.data.sellerDetails) {
            this.seller.colorName = 'Red';
            this.seller.colorCode = '#f5232f';

            // let className1 = `${this.seller.colorName}Class`;
            // this.createClass(`.dynamic-class`, 'background-color: green;');
            // this.applyClass('dynamic-class', '', false);
            const redcolor = `.redcolorShade { color:${this.seller.colorCode}!important; }`;
            const bgDynamic = `.bgDynamic { background-color:${this.seller.colorCode}10!important; }`;
            const active = `.active { background-color:${this.seller.colorCode}20!important; }`;
            setTimeout(() => {
              this.addClass(redcolor);
              this.addClass(bgDynamic);
              this.addClass(active);
            }, 1000);
          }
        }
      },
      (err: any) => {}
    );
  }
  addClass(className: string) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = className;
    document.getElementsByTagName('head')[0].appendChild(style);
    // document.getElementById(id)!.className = 'cssClass';
  }
}
