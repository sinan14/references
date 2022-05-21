import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintComponent } from './complaint/complaint.component';


import { ComplaintsRoutingModule } from './complaints-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { GridModule, ExcelModule, PDFModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ComplaintComponent],
  imports: [
    CommonModule,
    ComplaintsRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    ExcelModule,
    PDFModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ComplaintsModule { }
