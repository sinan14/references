import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremiumComponent } from './premium/premium.component';


import { PremiumMembersRoutingModule } from './premium-members-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PremiumMembersListComponent } from './premium-members-list/premium-members-list.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PremiumComponent, PremiumMembersListComponent],
  imports: [
    CommonModule,
    PremiumMembersRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxTrimDirectiveModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    FormsModule,ReactiveFormsModule

  ]
})
export class PremiumMembersModule { }
