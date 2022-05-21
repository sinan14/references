import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverMapComponent } from './driver-map/driver-map.component';
import { LoginComponent } from './login/login.component';

import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [ { path: 'driver/:id',      component: LoginComponent },
{ path: 'driver-order',      component:OrderDetailsComponent },
{path:'map',component:DriverMapComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
