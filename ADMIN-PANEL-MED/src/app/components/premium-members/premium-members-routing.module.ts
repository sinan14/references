import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PremiumComponent } from './premium/premium.component';
import { PremiumMembersListComponent } from './premium-members-list/premium-members-list.component';


const routes: Routes = [
    {
            path: '',
            component: PremiumComponent,
    },
    {
      path: 'premium-list',
      component: PremiumMembersListComponent,
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PremiumMembersRoutingModule { }
