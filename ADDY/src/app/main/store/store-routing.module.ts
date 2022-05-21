import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConvenienceComponent } from './convenience/convenience.component';
import { ReviewOrderComponent } from './review-order/review-order.component';
import { SuccessComponent } from './success/success.component';
import { ShoppingWebViewComponent } from './shopping-web-view/shopping-web-view.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { DeliveryMapComponent } from './delivery-map/delivery-map.component';
import { DriveraddressCnfirmComponent } from './driveraddress-cnfirm/driveraddress-cnfirm.component';
import { DeliveryAddressCnfirmComponent } from './delivery-address/delivery-address-cnfirm.component';

const routes: Routes = [
  { path: 'convenience', component: ConvenienceComponent },
  { path: 'review', component: ReviewOrderComponent },
  { path: 'success', component: SuccessComponent },
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'product/:id/:sellerId', component: ProductComponent },
  { path: 'shopping', component: ShoppingWebViewComponent },
  { path: 'address/:status', component: DeliveryMapComponent },
  {
    path: 'complete-address/:status',
    component: DeliveryAddressCnfirmComponent,
  },
  { path: 'addressDriver', component: DriveraddressCnfirmComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}
