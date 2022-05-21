import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SugProductsComponent } from './sug-products/sug-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuggestedProductRoutingModule } from './suggested-product-routing.module';
import { GridModule ,ExcelModule,PDFModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SharedServiceService } from '../../shared-service.service';



@NgModule({
  declarations: [SugProductsComponent],
  imports: [
    CommonModule,
    SuggestedProductRoutingModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    ExcelModule,
    PDFModule,
    NgbModule,
    NgxChartsModule,
    Ng2SmartTableModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SharedServiceService],
})
export class SuggestedProductModule { }
