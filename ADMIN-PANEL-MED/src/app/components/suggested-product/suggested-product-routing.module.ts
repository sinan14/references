import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SugProductsComponent } from './sug-products/sug-products.component';


const routes: Routes = [
   {
        path: '',
        component: SugProductsComponent,
        
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class    SuggestedProductRoutingModule { }
