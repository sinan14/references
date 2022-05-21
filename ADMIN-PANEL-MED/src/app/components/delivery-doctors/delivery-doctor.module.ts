import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryDoctorsComponent } from './delivery-doctors/delivery-doctors.component';
import { DeliveryDoctorsDetailsComponent } from './delivery-doctors-details/delivery-doctors-details.component';

import { DeliveryDoctorRoutingModule } from './delivery-doctor-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DeliveryDoctorsComponent,
    DeliveryDoctorsDetailsComponent,
  ],
  imports: [
    CommonModule,
    DeliveryDoctorRoutingModule,
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
    FormsModule,ReactiveFormsModule
  ],
})
export class DeliveryDoctorsModule{}
