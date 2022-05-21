import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediMallComponent } from './medi-mall/medi-mall.component';


const routes: Routes = [
  {
    path: '',
    component: MediMallComponent,
    // data: {
    //   title: "Reports",
    //   breadcrumb: "Reports"
    // }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedimallRoutingModule { }
