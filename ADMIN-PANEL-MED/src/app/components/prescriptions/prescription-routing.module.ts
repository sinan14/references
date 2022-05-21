import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrescriptionComponentComponent } from './prescription-component/prescription-component.component';


const routes: Routes = [
  {
    path: '',
    component: PrescriptionComponentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionRoutingModule { }
