import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePromoComponent } from './create-promo/create-promo.component';
import { ActivePromoComponent } from './active-promo/active-promo.component';
import { ExpiredPromoComponent } from './expired-promo/expired-promo.component';
import { StatementPromoComponent } from './statement-promo/statement-promo.component';
import { ReferalPromoComponent } from './referal-promo/referal-promo.component';


import { PromoRoutingModule } from './promo-routing.module';
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
import { PromoComponent } from './promo/promo.component';
import { PromoListComponent } from './promo-list/promo-list.component';
import { EditPromoComponent } from './edit-promo/edit-promo.component';
import { PromocodeDetailsComponent } from './promocode-details/promocode-details.component';
import { ReferalPromoDetailsComponent } from './referal-promo-details/referal-promo-details.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { EditorModule } from "@progress/kendo-angular-editor";

@NgModule({
  declarations: [CreatePromoComponent, ActivePromoComponent, ExpiredPromoComponent, StatementPromoComponent, ReferalPromoComponent, PromoComponent, PromoListComponent, EditPromoComponent, PromocodeDetailsComponent, ReferalPromoDetailsComponent],
  imports: [
    CommonModule,
    PromoRoutingModule,
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
    ReactiveFormsModule,
    EditorModule,
  ]
})
export class PromoModule { }
