import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedCoinComponent } from './med-coin/med-coin.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MedicoinRoutingModule } from './medicoin-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
@NgModule({
  declarations: [MedCoinComponent],
  imports: [
    CommonModule,
    NgxTrimDirectiveModule,
    MedicoinRoutingModule,
    Ng2SmartTableModule,
    NgxDatatableModule,
    NgbModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
    // NgSelectModule,
  ],
})
export class MedicoinModule {}
