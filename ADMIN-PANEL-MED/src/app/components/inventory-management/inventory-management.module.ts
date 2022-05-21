import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { InventoryComponent } from './inventory/inventory.component';


import { InventorymanagementRoutingModule } from './inventory-management-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DropDownsModule ,DropDownTreesModule, MultiSelectModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { UploadsModule } from "@progress/kendo-angular-upload";
import { GridModule } from "@progress/kendo-angular-grid";
import { TooltipModule } from "@progress/kendo-angular-tooltip";
import { EditorModule } from '@progress/kendo-angular-editor';

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
// const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
//   method: "get",
//   maxFilesize: 50,
//   //url: 'https://httpbin.org/post?token=',
// };




import { HttpClientModule, HTTP_INTERCEPTORS , HttpClientJsonpModule } from '@angular/common/http';
import { UploadComponent } from './add-inventory/upload.component';
import { AddinventoryHealthcareComponent } from './addinventory-healthcare/addinventory-healthcare.component';
import { StockComponent } from './stock/stock.component';
import { ExpiryInventoryComponent } from './expiry-inventory/expiry-inventory.component';
import { MostBuyedComponent } from './most-buyed/most-buyed.component';
import { MostSearchComponent } from './most-search/most-search.component';
import { FavouriteComponent } from './favourite/favourite.component';

@NgModule({
  declarations: [AddInventoryComponent, InventoryListComponent, AddNewProductComponent,InventoryComponent,UploadComponent, AddinventoryHealthcareComponent, StockComponent, ExpiryInventoryComponent, MostBuyedComponent, MostSearchComponent, FavouriteComponent],
  imports: [
    CommonModule,
    InventorymanagementRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    DropzoneModule,
    NgxDatatableModule,
    DropDownsModule,
    DropDownTreesModule,
    MultiSelectModule,
    InputsModule,
    UploadsModule,
    HttpClientModule,
    GridModule,
    TooltipModule,
    EditorModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientJsonpModule
  ],
  providers: [
    // {
    //   provide: DROPZONE_CONFIG,
    //   useValue: DEFAULT_DROPZONE_CONFIG,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: UploadInterceptor,
    //   multi: true,
    // },
    NgbActiveModal
  ]
})
export class InventoryManagementModule { }
