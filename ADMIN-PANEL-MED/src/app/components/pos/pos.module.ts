import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosMainComponent } from './pos-main/pos-main.component';


import { PosRoutingModule } from './pos-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PosBillingComponent } from './pos-billing/pos-billing.component';
import { PosSalesReturnComponent } from './pos-sales-return/pos-sales-return.component';
import { PosPointOfSaleComponent } from './pos-point-of-sale/pos-point-of-sale.component';
import { PosSalesReportComponent } from './pos-sales-report/pos-sales-report.component';
import { PosReportsComponent } from './pos-reports/pos-reports.component';
import { PosConsumerCardComponent } from './pos-consumer-card/pos-consumer-card.component';
import { SelectPaymentCustomerComponent } from './select-payment-customer/select-payment-customer.component';
import { SelectPaymentCodeComponent } from './select-payment-code/select-payment-code.component';

@NgModule({
  declarations: [PosMainComponent, PosBillingComponent, PosSalesReturnComponent, PosPointOfSaleComponent, PosSalesReportComponent, PosReportsComponent, PosConsumerCardComponent, SelectPaymentCustomerComponent, SelectPaymentCodeComponent],
  imports: [
    CommonModule,
    PosRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    NgxDatatableModule
  ]
})
export class PosModule { }
