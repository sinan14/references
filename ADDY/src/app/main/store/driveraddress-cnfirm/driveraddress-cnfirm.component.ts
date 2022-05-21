import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driveraddress-cnfirm',
  templateUrl: './driveraddress-cnfirm.component.html',
  styleUrls: ['./driveraddress-cnfirm.component.css']
})
export class DriveraddressCnfirmComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {
  }
  convinience(){
    this.route.navigate(["/convenience"])

  }
  back(){
    this.route.navigate(["/map"])

  }

}
