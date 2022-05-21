import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-pos-billing',
  templateUrl: './pos-billing.component.html',
  styleUrls: ['./pos-billing.component.scss']
})
export class PosBillingComponent implements OnInit {

  public formArray = [];
  setBooleanRow :boolean = false;
  trueFlag :boolean = true;
  falseFlag :boolean = false;

  constructor(private _route:Router) { }

  ngOnInit(): void {
    this.formArray.push('');
  }

  addForm(){
    this.formArray.push('');
   
  }
  removeForm(id){
    this.formArray.splice(id, 1);
  }

  trackByFn(index: any) {
    return index;
  }

  AddTableRow(value:any){
    if(value === 'true'){
      this.setBooleanRow = true;
      this.trueFlag = false;
      this.falseFlag = true;
    }
    else if(value === ''){
      this.setBooleanRow = false;
      this.trueFlag = true;
      this.falseFlag = false;
    }
  }

  redirectToSalesReport(){
    this._route.navigate(['/pos/sales-report']);
  }
  

}
