import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlExpiredComponent } from './main/url-expired/url-expired.component';

// import { LoginComponent } from './main/driver/login/login.component';

const routes: Routes =[
  {
    path: '',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'url',      component:UrlExpiredComponent },

   {
    path: '',
    // component: LoginComponent,
    children: [{
      path: '',
      loadChildren: () => import('./main/driver/driver.module').then(m => m.DriverModule)
    }]
  },
  {
    path: '',
   // component: CustomerHomeComponent,
    children: [{
      path: '',
      loadChildren: () => import('./main/customer/customer.module').then(m => m.CustomerModule)
    }]
  },
  {
    path: '',
   // component: CustomerHomeComponent,
    children: [{
      path: '',
      loadChildren: () => import('./main/store/store.module').then(m => m.StoreModule)
    }]
  },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
