import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInterfaceComponent } from './user-interface/user-interface.component';
import { PosterManagementComponent } from './poster-management/poster-management.component';
import { IconManagementComponent } from './icon-management/icon-management.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';


import { UsermanagemntRoutingModule } from './user-management-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@progress/kendo-angular-editor';

@NgModule({
  declarations: [UserInterfaceComponent, PosterManagementComponent, IconManagementComponent, PrivacyPolicyComponent, TermsConditionsComponent, DisclaimerComponent],
  imports: [
    EditorModule,
    CommonModule,
    UsermanagemntRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,ReactiveFormsModule
  ]
})
export class UserManagementModule { }
