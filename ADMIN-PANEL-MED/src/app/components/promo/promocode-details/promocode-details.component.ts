import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { PromoServiceService } from 'src/app/services/promo-service.service';
@Component({
  selector: 'app-promocode-details',
  templateUrl: './promocode-details.component.html',
  styleUrls: ['./promocode-details.component.scss'],
})
export class PromocodeDetailsComponent implements OnInit {
  promo_table: any = {};
  promoCode: any;

  //   "data": {
  //     "result": [
  //         {
  //             "_id": "61adbac5c487659ef1525735",
  //             "createdAt": "2021-12-06T07:24:53.027Z",
  //             "discountAmount": "100",
  //             "userId": "UIN MDFL 21 11 10021"
  //         }
  //     ],
  //     "totalAmount": 100,
  //     "hasPrevPage": false,
  //     "hasNextPage": false,
  //     "total_items": 1,
  //     "total_page": 1,
  //     "current_page": 1
  // }
  public promoBody: { id: any; keyword: string; limit: number; page: number } =
    {
      page: 1,
      id: '',
      limit: 10,
      keyword: '',
    };

  constructor(
    private intl: IntlService,
    private _promoSerice: PromoServiceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.promoCode = params['promocode'];

      this.promoBody = {
        id,
        page: 1,
        limit: 10,
        keyword: '',
      };
      //console.log(this.promoBody);
    });
    this.fetchPromocodes(this.promoBody);
  }

  fetchPromocodes(data) {
    const body = {
      page: data.page,
      limit: 10,
      id: data.id,
    };
    //console.log(this.promoBody);
    //console.log('promo codes');
    this._promoSerice.fetchPromocodes(body).subscribe(
      (res: any) => {
        //console.log('promo details');
        //console.log(res);

        this.promo_table = JSON.parse(JSON.stringify(res.data));
        this.promo_table.result.forEach((promo, index) => {
          promo.slno = index + 1;
          promo.date = new Date(promo.createdAt).toLocaleTimeString('en-US');
        });
        //console.log(this.promo_table);
      },
      (error: any) => {
        //console.log('server err');
      }
    );
  }
  searchPromoByKeyword(data) {
    //console.log(data);
    if (data.keyword == '') {
      this.fetchPromocodes(this.promoBody);
    } else {
      this._promoSerice.searchPromocodes(data).subscribe(
        (res: any) => {
          //console.log('promo search details');
          //console.log(res);

          this.promo_table = JSON.parse(JSON.stringify(res.data));
          this.promo_table.result.forEach((promo, index) => {
            promo.slno = index + 1;
            promo.date = new Date(promo.createdAt).toLocaleTimeString('en-US');
          });
          //console.log(this.promo_table);
        },
        (error: any) => {
          //console.log('server err');
        }
      );
    }
  }

  orderPagination(page) {
    if (
      (this.promo_table.hasNextPage == false &&
        page > this.promo_table.current_page) ||
      (this.promo_table.hasPrevPage == false &&
        page < this.promo_table.current_page)
    ) {
      return;
    } else {
      this.promoBody.page = page;
      this.searchPromoByKeyword(this.promoBody);
    }
  }
  onChangeKeyword(keyword) {
    this.promoBody.keyword = keyword;
    this.promoBody.page = 1;
    this.searchPromoByKeyword(this.promoBody);
  }
}
