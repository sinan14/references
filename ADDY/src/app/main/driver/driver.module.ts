import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverRoutingModule } from './driver-routing.module';
import { LoginComponent } from './login/login.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DriverMapComponent } from './driver-map/driver-map.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { Ng2TelInputModule } from 'ng2-tel-input';

@NgModule({
  declarations: [LoginComponent,OrderDetailsComponent, DriverMapComponent],
  imports: [
    CommonModule,
    DriverRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDkittXkcO5UmfM_n8ScpYC6uyCG-tmQz4',
      libraries: ['places', 'drawing', 'geometry'],
      
    }),
    AgmDirectionModule, 
    Ng2TelInputModule ,
  ]
})
export class DriverModule { }
