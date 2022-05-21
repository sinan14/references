import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-promo',
  templateUrl: './edit-promo.component.html',
  styleUrls: ['./edit-promo.component.scss']
})
export class EditPromoComponent implements OnInit {

  public viewFlag :any;
  public editFlag :any = false;
  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem("EditFlag") === ''){
      this.editFlag = false;
    }
    else if(localStorage.getItem("EditFlag")  === "true"){
        this.editFlag = false;
    }
    else if(localStorage.getItem("EditFlag")  === "false"){
      this.editFlag = true;
    }
  }

}
