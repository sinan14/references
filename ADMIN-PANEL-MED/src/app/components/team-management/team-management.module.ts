import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamManagementComponent } from './team-management/team-management.component';



import { TeammanagementRoutingModule } from './team-management-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamComponent } from './team/team.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  maxFilesize: 50,
  url: 'https://httpbin.org/post',
};


@NgModule({
  declarations: [TeamManagementComponent, TeamComponent, NewEmployeeComponent, EditEmployeeComponent],
  imports: [
    CommonModule,
    TeammanagementRoutingModule,
    DropzoneModule,
    Ng2SmartTableModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownsModule,
    InputsModule
  ]
})
export class TeamManagementModule { }
