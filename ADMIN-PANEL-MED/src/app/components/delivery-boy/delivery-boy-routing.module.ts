import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryBoysComponent } from './delivery-boys/delivery-boys.component';
import { DeliveryBoysDetailsComponent } from './delivery-boys-details/delivery-boys-details.component';
import { PendingDeliveryDetailComponent } from './pending-delivery-detail/pending-delivery-detail.component';


const routes: Routes = [
  {
    path: '',
    component: DeliveryBoysComponent,
  },
  {
    path: 'delivery-boys-details/:id',
    component: DeliveryBoysDetailsComponent,
  },
  {
    path: 'details/:id',
    component: PendingDeliveryDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryBoyRoutingModule { }
