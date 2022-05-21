import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DeliveryDoctorsComponent  } from './delivery-doctors/delivery-doctors.component';
import { DeliveryDoctorsDetailsComponent } from './delivery-doctors-details/delivery-doctors-details.component';
;


const routes: Routes = [
  {
    path: '',
    component: DeliveryDoctorsComponent,
  },
  {
    path: 'delivery-doctors-details',
    component: DeliveryDoctorsDetailsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryDoctorRoutingModule { }
