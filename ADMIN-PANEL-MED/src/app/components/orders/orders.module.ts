import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';

import { OrdersRoutingModule } from './orders-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TooltipModule } from "@progress/kendo-angular-tooltip";

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewOrderComponent } from './new-order/new-order.component';


import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { EditorModule } from "@progress/kendo-angular-editor";

@NgModule({
  declarations: [OrderComponent, NewOrderComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    TooltipModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
  ],
  providers: [
    NgbActiveModal
  ]
})
export class OrdersModule { }
