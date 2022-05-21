import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedimallReportComponent } from './medimall-report/medimall-report.component';


const routes: Routes = [
  {
    path: '',
    component: MedimallReportComponent,
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
export class MedimallreportRoutingModule { }
