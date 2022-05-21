import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediMallComponent } from './medi-mall/medi-mall.component';


import { MedimallRoutingModule } from './medi-mall-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';




@NgModule({
  declarations: [MediMallComponent],
  imports: [
    CommonModule,
    MedimallRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    GalleryModule
  ]
})
export class MediMallModule { }
