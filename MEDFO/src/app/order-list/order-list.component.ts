import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HealthVaultService } from '../services/health-vault.service';
import { LandingService } from 'src/app/services/landing.service';
import { Title, Meta } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from 'src/app/services/orders.service';
import { environment } from 'src/environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NewCartService } from 'src/app/services/new-cart.service';
import Swal from 'sweetalert2';
import { ClipboardService } from 'ngx-clipboard';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserDashboardService } from 'src/app/services/user-dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {


  public myOrderList :any = [];
  public personal_info: any;


  constructor(public _orderService: OrdersService,
    private _newcartService: NewCartService,
    // private modalService: NgbModal,
    private _fb: FormBuilder,
    private _clipboardService: ClipboardService,
    private _router: Router,
    private Health_Vault_Service: HealthVaultService,
    public _landingService: LandingService,
    private titleService: Title,
    private metaService: Meta,
    public _toasterService :ToastrService,
    public _userDashboardService: UserDashboardService,) { }

  ngOnInit(): void {
    this.get_my_order();
    this.getPersonalDetails();
  }

  
  getPersonalDetails() {
    this._userDashboardService.getPersonalInfo().subscribe(
      (res: any) => {
        if (res.error == false) {
          this.personal_info = res.data;
          console.log(this.personal_info);
        } else {
          console.log('onh no error');
        }
      },
      (error: any) => {
        console.log('oh no error occure from server');
        console.log(error);
      }
    );
  }

  get_my_order(){
    this._orderService.get_my_orders().subscribe((res:any)=>{
      console.log(res);
      if(!res.error){
        this.myOrderList = res.data.result;
      }
    })
  }

  redirectToOrderDetails(id,status){
      this._router.navigate(['/dashboard-order-details/order-details/'+id])
    // else if(status==='returned'){
    //   this._router.navigate(['/return-detail/'+id])
    // }
  }

  
  changeDateFormat(date:any){
    var myDate = new Date();
    var nextDay = new Date(date);


    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(nextDay, 'dd MMMM yyyy');
   
    return end;
  }

  changeSecondDateFormat(date:any){
    var myDate = new Date();
    var nextDay = new Date(date);


    var datePipe = new DatePipe('en-US');
    var end = datePipe.transform(nextDay, 'EE dd MMM');
   
    return end;
  }

}
