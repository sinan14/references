import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StoreHomeService } from 'src/app/services/store-home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public currencyApi: string = 'https://api.exchangerate-api.com/v4/latest/USD';
  public exchangeRates: any;
  public sellerId: string;
  // public localCurrency: any;
  public sellerDetails: any = {};
  public products: any = {};
  public categories: any = [];
  public colorArrayForSearch: any = [];
  public uomArrayForSearch: any = [];
  public uomValueArrayForSearch: any = [];

  constructor(public _homeService: StoreHomeService, private _fb: FormBuilder) {
    // this.http.get<{ ip: string }>('https://jsonip.com').subscribe((data) => {
    //   console.log('th data', data);
    //   this.ipAddress = data;
    // });
  }
  searchForm: FormGroup = this._fb.group({
    uomValue: new FormArray([]),
    color: new FormArray([]),

    searchBy: [null],
    sortBy: [null],
    minPrice: [null, [Validators.min(0)]],
    maxPrice: [null, [Validators.min(0)]],
  });
  onFiltering() {
    console.log(this.searchForm.value);
    document.getElementById('closeFilter').click();
    const body = { ...this.searchForm.value };
    body.page = 1;
    body.limit = 10;
    body.sellerId = this.sellerId;
    this.searchForm.reset();
    this._homeService.filterProducts(body).subscribe(
      (res: any) => {
        this.handleProductRes(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  onCheckboxChangeUomValue(event) {
    const formArray: FormArray = this.searchForm.get('uomValue') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }
  onCheckboxChangeColor(event) {
    const formArray: FormArray = this.searchForm.get('color') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  changeUomOnFilter(index) {
    this.uomValueArrayForSearch = this.uomArrayForSearch[index].uomValue;
    this.colorArrayForSearch = this.uomArrayForSearch[index].color;
    (<FormArray>this.searchForm.get('color')).clear();
    (<FormArray>this.searchForm.get('uomValue')).clear();
    // const control = <FormArray>this.searchForm.controls['color'];

    // for (let i = control.length - 1; i >= 0; i--) {
    //   control.removeAt(i);
    // }
    console.log(this.searchForm.value);
  }
  getUomAndUomValuesForFiltering(sellerId: any) {
    this._homeService.getUomAndUomValuesForFiltering(sellerId).subscribe(
      (res: any) => {
        const colorArr: any = [];
        if (res.status) {
          console.log(res.filter);

          res.data.filter.forEach((arr: any, index: number) => {
            this.uomArrayForSearch.push({
              index,
              uom: arr.uom,
              uomValue: arr.uomValue,
              color: arr.color,
            });
            arr.color.forEach((c: any) => {
              colorArr.push(c);
            });
          });
          this.uomValueArrayForSearch = this.uomArrayForSearch[0].uomValue;
          this.colorArrayForSearch = this.uomArrayForSearch[0].color;
        }
        console.log(this.colorArrayForSearch);
        console.log(this.uomArrayForSearch);
        console.log(this.uomValueArrayForSearch);
        console.log(this.uomValueArrayForSearch);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.sellerId = '61cea413d2191ae5e5846435';
    // this.fetchPromise(this.currencyApi);
    // const categoryId = '61cead158ff211e30a5dc630';
    this.getProductCategoriesBySellerId(this.sellerId);
    this.getUomAndUomValuesForFiltering(this.sellerId);

    // if (!this._homeService.localCurrency) {
    this.getProductsBySellerId({
      page: 1,
      limit: 20,
      sellerId: this.sellerId,
    });
    // }

    // this._homeService.getIp();
    // this.getIP();
  }

  // getIP() {
  //   this._homeService.getIPAddress().subscribe((res: any) => {
  // this.ipAddress = res.ip;
  //     console.log(res);
  //   });
  // }

  getProductsBySellerId(data: any) {
    // data = { page: '', limit: '', sellerId: '' };

    this._homeService.getProductsBySellerId(data).subscribe(
      (res: any) => {
        if (res.data.sellerDetails) {
          this.sellerId = res.data.sellerDetails.sellerId;
        }
        this.handleProductRes(res);
      },
      (err: any) => {
        console.log(ErrorEvent);
      }
    );
  }

  //todo get categories of products
  getProductCategoriesBySellerId(sellerId: any) {
    this._homeService.getProductCategoriesBySellerId(sellerId).subscribe(
      (res: any) => {
        // console.log(res);

        if (res.status) {
          this.categories = res.data.categories;
          this.categories.unshift({ _id: 1, productCategory: 'All' });

          $(document).on('click', '.category button', function () {
            $('.category button').removeClass('active');
            $(this).addClass('active');
          });
          setTimeout(() => {
            document.getElementById('0')?.classList.add('active');
          }, 500);
        } else {
        }
      },
      (err: any) => {}
    );
  }
  //todo handle responses from api
  handleProductRes(res: any) {
    console.log(res);
    if (res.status) {
      this.products = res.data.products;
      const toRate =
        this._homeService.currencyRates[this._homeService.localCurrency];
      this.products.productDetails.forEach((item: any) => {
        let fromRate = this._homeService.currencyRates[item.countryCode];
        item.convertedPrice = Math.trunc((toRate / fromRate) * item.price);
      });
    } else {
      console.log(res.message);
    }
  }

  //list products category wise
  filterByCategory(categoryId: any) {
    if (categoryId === 1) {
      this.getProductsBySellerId({
        page: 1,
        limit: 10,
        sellerId: this.sellerId,
      });
    } else {
      this.getProductsByCategoryId({
        page: 1,
        limit: 10,
        sellerId: this.sellerId,
        categoryId,
      });
    }
  }
  getProductsByCategoryId(data: any) {
    // data = { page: '', limit: '', sellerId: '' ,categoryId: ''};

    this._homeService.getProductsByCategoryId(data).subscribe(
      (res: any) => {
        this.handleProductRes(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  async fetchPromise(url: any) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      this.exchangeRates;
    } catch (e) {
      console.log('SOMETHING WENT WRONG!!!', e);
    }
  }
  ngAfterViewInit() {
    $('input:checkbox').change(function () {
      if ($(this).is(':checked')) $(this).parent().addClass('active');
      else $(this).parent().removeClass('active');
    });
  }
}
