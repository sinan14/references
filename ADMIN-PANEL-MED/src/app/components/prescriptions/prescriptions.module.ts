import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionComponentComponent } from './prescription-component/prescription-component.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrescriptionRoutingModule } from './prescription-routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
@NgModule({
  declarations: [PrescriptionComponentComponent],
  imports: [
    CommonModule,
    NgxTrimDirectiveModule,
    PrescriptionRoutingModule,
    Ng2SmartTableModule,
    NgxDatatableModule,
    NgbModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PrescriptionsModule {}
