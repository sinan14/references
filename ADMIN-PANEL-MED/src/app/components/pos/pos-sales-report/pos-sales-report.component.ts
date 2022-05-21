import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-pos-sales-report',
  templateUrl: './pos-sales-report.component.html',
  styleUrls: ['./pos-sales-report.component.scss']
})
export class PosSalesReportComponent implements OnInit {

  constructor(private _route:Router) { }

  ngOnInit(): void {
  }

  redirectTo(value){
      if(value === 'sales-return-report'){
        this._route.navigate(['/pos/sales-return']);
      }
      else if(value === 'pos'){
        this._route.navigate(['/pos/POS']);
      }
  }

}
