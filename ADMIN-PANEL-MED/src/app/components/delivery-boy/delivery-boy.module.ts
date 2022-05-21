import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryBoysComponent } from './delivery-boys/delivery-boys.component';
import { DeliveryBoysDetailsComponent } from './delivery-boys-details/delivery-boys-details.component';


import { DeliveryBoyRoutingModule } from './delivery-boy-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";


import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PendingDeliveryDetailComponent } from './pending-delivery-detail/pending-delivery-detail.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [DeliveryBoysComponent, DeliveryBoysDetailsComponent, PendingDeliveryDetailComponent],
  imports: [
    CommonModule,
    DeliveryBoyRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    NgxDatatableModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DeliveryBoyModule { }
