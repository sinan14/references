import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterComponent } from './master/master.component';
import { CategoryComponent } from './category/category.component';
import { BrandComponent } from './brand/brand.component';
import { MastersettingsRoutingModule } from './master-settings-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
  GridModule,
  ExcelModule,
  PDFModule,
} from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UOMComponent } from './uom/uom.component';
import { UOMValueComponent } from './uomvalue/uomvalue.component';
import { TaxComponent } from './tax/tax.component';
import { DeliveryAreaComponent } from './delivery-area/delivery-area.component';
import { StoreCreationComponent } from './store-creation/store-creation.component';
import { PincodeComponent } from './pincode/pincode.component';
import { PolicyComponent } from './policy/policy.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { SubSubCategoryComponent } from './sub-sub-category/sub-sub-category.component';
import { DeliveryChargeComponent } from './delivery-charge/delivery-charge.component';
import { MedicineCategoryComponent } from './medicine-category/medicine-category.component';
import { PreferenceComponent } from './preference/preference.component';
import { AppModule } from 'src/app/app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPincodeComponent } from './main-pincode/main-pincode.component';

@NgModule({
  declarations: [
    MasterComponent,
    CategoryComponent,
    BrandComponent,
    UOMComponent,
    UOMValueComponent,
    TaxComponent,
    DeliveryAreaComponent,
    StoreCreationComponent,
    PincodeComponent,
    DeliveryChargeComponent,
    PolicyComponent,
    SubCategoryComponent,
    SubSubCategoryComponent,
    MedicineCategoryComponent,
    PreferenceComponent,
    MainPincodeComponent,
  ],
  imports: [
    CommonModule,
    MastersettingsRoutingModule,
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
    ExcelModule,
    PDFModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class MasterSettingsModule {}
