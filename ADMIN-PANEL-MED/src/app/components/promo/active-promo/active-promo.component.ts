import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";

@Component({
  selector: 'app-active-promo',
  templateUrl: './active-promo.component.html',
  styleUrls: ['./active-promo.component.scss']
})
export class ActivePromoComponent implements OnInit {
  
  public order = [];
  public temp = [];

  public accountForm: FormGroup;
  public permissionForm: FormGroup;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;


  constructor(private formBuilder: FormBuilder) {
    this.createAccountForm();
    this.createPermissionForm();
    this.order = orderDB.list_order;
  }

  ngOnInit(): void {
  }


  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.order = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }


  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      fname: [''],
      lname: [''],
      email: [''],
      password: [''],
      confirmPwd: ['']
    })
  }
  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({
    })
  }


}
