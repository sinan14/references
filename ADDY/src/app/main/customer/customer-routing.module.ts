import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressConfirmComponent } from './address-confirm/address-confirm.component';
import { AddressListComponent } from './address-list/address-list.component';
import { AddressFormComponent } from './addressForm/address-form.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { CustomerMapComponent } from './customer-map/customer-map.component';
import { CustomerOrderDetailsComponent } from './customer-order-details/customer-order-details.component';
import { CustomerThankyouComponent } from './customer-thankyou/customer-thankyou.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: 'customerHome', component: CustomerHomeComponent },

  { path: 'user/:id', component: LandingPageComponent },
   { path: 'addressForm', component: AddressFormComponent },
   { path: 'addressList', component: AddressListComponent },
   { path: 'customerMap/:id', component: CustomerMapComponent },
  { path: 'customerThankz', component: CustomerThankyouComponent },
  { path: 'addressconfirm', component: AddressConfirmComponent },
  {path:'orderDetails',component:CustomerOrderDetailsComponent}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
