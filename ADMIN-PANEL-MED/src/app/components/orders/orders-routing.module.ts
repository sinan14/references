import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { PermissionService } from 'src/app/permission.service';


const routes: Routes = [
  {
    path: '',
    component: NewOrderComponent,
  },
  {
    path: 'new-order',
    //canActivate:[PermissionService],
    component: NewOrderComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
