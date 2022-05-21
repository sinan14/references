import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserInterfaceComponent } from './user-interface/user-interface.component';
import { PosterManagementComponent } from './poster-management/poster-management.component';
import { IconManagementComponent } from './icon-management/icon-management.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';


const routes: Routes = [
   {
        path: '',
        component: UserInterfaceComponent,
        
   },
  {
    path: 'poster-management',
    component: PosterManagementComponent,
    
  },
  {
    path: 'icon-management',
    component: IconManagementComponent,
    
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent,
    
  },
  {
    path: 'disclaimer',
    component: DisclaimerComponent,
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsermanagemntRoutingModule { }
