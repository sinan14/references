import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-pos-main',
  templateUrl: './pos-main.component.html',
  styleUrls: ['./pos-main.component.scss']
})
export class PosMainComponent implements OnInit {

  constructor(private _route:Router) { }

  ngOnInit(): void {
  }


  redirectTo(value){
    if(value === 'power'){
      this._route.navigate(['/pos']);
    }
    else if(value === 'billing'){
      this._route.navigate(['/pos/billing']);
    }
    else if(value === 'salesreturn'){
      this._route.navigate(['/pos/sales-return']);
    }
    else if(value === 'pos'){
      this._route.navigate(['/pos/POS']);
    }
  }
}
