import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComplaintComponent } from './complaint/complaint.component';


const routes: Routes = [
  {
    path: '',
    component: ComplaintComponent,
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
export class ComplaintsRoutingModule { }
