import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedCoinComponent } from './med-coin/med-coin.component';


const routes: Routes = [
  {
    path: '',
    component: MedCoinComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicoinRoutingModule { }
