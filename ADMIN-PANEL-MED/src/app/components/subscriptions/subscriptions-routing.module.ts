import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TotalSubscriptionsComponent } from './total-subscriptions/total-subscriptions.component';


const routes: Routes = [
    {
            path: '',
            component: TotalSubscriptionsComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsRoutingModule { }
