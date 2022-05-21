import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment.prod';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddressFormComponent } from './addressForm/address-form.component';
import { CustomerMapComponent } from './customer-map/customer-map.component';
import { CustomerThankyouComponent } from './customer-thankyou/customer-thankyou.component';
import { AddressConfirmComponent } from './address-confirm/address-confirm.component';
import { CustomerOrderDetailsComponent } from './customer-order-details/customer-order-details.component';

@NgModule({
  declarations: [AddressConfirmComponent,CustomerHomeComponent,LandingPageComponent,AddressFormComponent,CustomerThankyouComponent,CustomerMapComponent, CustomerOrderDetailsComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    CustomerRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.agmCoreApiKey,

      libraries: ['places']
    })
    
  ]
})
export class CustomerModule { }
