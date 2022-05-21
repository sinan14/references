import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalSubscriptionsComponent } from './total-subscriptions/total-subscriptions.component';


import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TooltipModule } from "@progress/kendo-angular-tooltip";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TotalSubscriptionsComponent],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
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
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SubscriptionsModule { }
