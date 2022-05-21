import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromoComponent } from './promo/promo.component';
import { CreatePromoComponent } from './create-promo/create-promo.component';
import { ActivePromoComponent } from './active-promo/active-promo.component';
import { ExpiredPromoComponent } from './expired-promo/expired-promo.component';
import { StatementPromoComponent } from './statement-promo/statement-promo.component';
import { ReferalPromoComponent } from './referal-promo/referal-promo.component';
import { PromoListComponent } from './promo-list/promo-list.component';
import { EditPromoComponent } from './edit-promo/edit-promo.component';
import { PromocodeDetailsComponent } from './promocode-details/promocode-details.component';
import { ReferalPromoDetailsComponent } from './referal-promo-details/referal-promo-details.component';


const routes: Routes = [
   {
        path: '',
        component: PromoComponent,
        
   },
  {
    path: 'create-promo',
    component: CreatePromoComponent,
    
  },
  {
    path: 'create-promo/:id/:type',
    component: CreatePromoComponent,
    
  },
  {
    path: 'active-promo',
    component: ActivePromoComponent,
    
  },
  {
    path: 'expired-promo',
    component: ExpiredPromoComponent,
    
  },
  {
    path: 'statement-promo',
    component: StatementPromoComponent,
    
  },
  {
    path: 'referal-promo',
    component: ReferalPromoComponent,
    
  },
  {
    path: 'promo-list',
    component: PromoListComponent,
    
  },
  {
    path: 'edit-promo',
    component: EditPromoComponent,
    
  },
  {
    path: 'promocode/:id/:promocode',
    component: PromocodeDetailsComponent,
    pathMatch: 'full'
    
  },
  {
    path: 'referal-promo-details/:id',
    component: ReferalPromoDetailsComponent,
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromoRoutingModule { }
