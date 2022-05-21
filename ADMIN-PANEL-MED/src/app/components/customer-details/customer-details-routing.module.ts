import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { MedimallComponent } from './medimall/medimall.component';


const routes: Routes = [
  {
    path: '',
    component: CustomerDetailsComponent,
  },
  {
    path: 'medimall/:cust_id',
    component: MedimallComponent,
  },
  {
    path: 'cust/:cust_id',
    component: CustomerDetailsComponent,
  },


  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerdetailsRoutingModule { }
