import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedimallReportComponent } from './medimall-report/medimall-report.component';

import {  MedimallreportRoutingModule } from './medimall-report-routing.module';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [MedimallReportComponent],
  imports: [
    CommonModule,
    MedimallreportRoutingModule,
    NgbModule
  ]
})
export class MedimallReportModule { }
