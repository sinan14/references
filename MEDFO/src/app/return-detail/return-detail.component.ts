import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-return-detail',
  templateUrl: './return-detail.component.html',
  styleUrls: ['./return-detail.component.css']
})
export class ReturnDetailComponent implements OnInit {

  public return_id :any ='';
  public return_details :any = [];
  constructor(public _orderService: OrdersService,
    public activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {

    const items = document.querySelectorAll(".accordion a");

    function toggleAccordion() {
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('active');
    }

    items.forEach(item => item.addEventListener('click', toggleAccordion));


    this.activatedRoute.paramMap.subscribe(params => {
      this.return_id = params.get('return_id');
      this.get_return_order_details();
    });

    
  }


  get_return_order_details(){
    let input = {
      orderId  : this.return_id
    }
    this._orderService.get_return_details(input).subscribe((res:any)=>{
      console.log(res);
      if(!res.error){
        this.return_details = res.data;
      }
    })
  }

}
