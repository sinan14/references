import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
id:any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  gotoCustomer(){
     this.id="61d42878e4aa9e607c0cb083";
     
    //this.id="61d5171dbf73051a9e11e674"
    this.router.navigate(["/user",this.id]);

  }
  gotoDriver(){
    const driver_id="61d4281ae4aa9e607c0cb073"
    this.router.navigate(["/driver",driver_id]);

  }
  gotoStore(){
    this.router.navigate(["/home"]);

  }
}
