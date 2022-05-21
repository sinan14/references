import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LabelTemplateDirective } from '@progress/kendo-angular-inputs';
import { PromoServiceService } from 'src/app/services/promo-service.service';

@Component({
  selector: 'app-referal-promo-details',
  templateUrl: './referal-promo-details.component.html',
  styleUrls: ['./referal-promo-details.component.scss']
})
export class ReferalPromoDetailsComponent implements OnInit {


  public id: any = ''
  public newUser: any = ''
  public referalUser: any = ''
  public benefit: any = ''
  public User_Details_Array: any = []
  public hasPrevPage: boolean = false
  public hasNextPage: boolean = true
  public total_items: any
  public total_page: any
  public current_page: any

  constructor(private Activated_Router: ActivatedRoute,
    private Promo_Service: PromoServiceService) { }

  ngOnInit(): void {
    this.id = ''
    this.Activated_Router.paramMap.subscribe((res: any) => {

      this.id = res.get('id')
      console.log(this.id);

      if (this.id != '') {
        this.get_USER_DETAILS_BY_ID(1, 10)
      }

    })

    // get('id').
  }


  get_USER_DETAILS_BY_ID(pg, limit) {
    console.log(pg, limit);
    let body = {
      page: pg,
      limit: limit,
      id: this.id
    }
    this.Promo_Service.get_USER_DETAILS_BY_ID(body).subscribe((res: any) => {
      console.log(res);
      this.newUser = res.data.datas.newUser
      this.referalUser = res.data.datas.referalUser
      this.benefit = res.data.datas.benefit
      this.User_Details_Array = []
      this.User_Details_Array = res.data.finalResult
      this.hasPrevPage = res.data.hasPrevPage
      this.hasNextPage = res.data.hasNextPage
      this.total_items = res.data.total_items
      this.total_page = res.data.total_page
      this.current_page = res.data.current_page


    })
  }


  Search_Name(event: any) {
    console.log(event.target.value);
    let body = {
      page: 1,
      limit: 10,
      id: this.id,
      keyword: event.target.value
    }
    this.Promo_Service.search_USER_BY_NAME(body).subscribe((res: any) => {
      console.log(res, "search");
      this.User_Details_Array = []
      this.User_Details_Array = res.data.finalResult
      this.hasPrevPage = res.data.hasPrevPage
      this.hasNextPage = res.data.hasNextPage
      this.total_items = res.data.total_items
      this.total_page = res.data.total_page
      this.current_page = res.data.current_page
    })


  }





}
