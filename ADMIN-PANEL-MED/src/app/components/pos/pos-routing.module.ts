import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosMainComponent } from './pos-main/pos-main.component';
import { PosBillingComponent } from './pos-billing/pos-billing.component';
import { PosSalesReturnComponent } from './pos-sales-return/pos-sales-return.component';
import { PosPointOfSaleComponent } from './pos-point-of-sale/pos-point-of-sale.component';
import { PosSalesReportComponent } from './pos-sales-report/pos-sales-report.component';
import { PosReportsComponent } from './pos-reports/pos-reports.component';
import { PosConsumerCardComponent } from './pos-consumer-card/pos-consumer-card.component';
import { SelectPaymentCustomerComponent } from './select-payment-customer/select-payment-customer.component';
import { SelectPaymentCodeComponent } from './select-payment-code/select-payment-code.component';


const routes: Routes = [
   {
        path: '',
        component: PosMainComponent,
   },
   {
    path: 'billing',
    component: PosBillingComponent,
  },
  {
    path: 'sales-return',
    component: PosSalesReturnComponent,
  },
  {
    path: 'POS',
    component: PosPointOfSaleComponent,
  },
  {
    path: 'sales-report',
    component: PosSalesReportComponent,
  },
  {
    path: 'reports',
    component: PosReportsComponent,
  },
  {
    path: 'consumer',
    component: PosConsumerCardComponent,
  },
  {
    path: 'payment-code',
    component: SelectPaymentCodeComponent,
  },
  {
    path: 'payment',
    component: SelectPaymentCustomerComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
