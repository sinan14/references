import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";

@Component({
  selector: 'app-landing-page',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }
 
  gotoAddressForm(){
    this.router.navigate(["/addressForm"]);

  }
  gotohome(){
    this.router.navigate(["/landing"]);

  }

}
