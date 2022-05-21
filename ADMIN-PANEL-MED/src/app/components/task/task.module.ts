import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';



import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TaskRoutingModule } from './task-routing.module'; 
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TooltipModule } from "@progress/kendo-angular-tooltip";


@NgModule({
  declarations: [TaskComponent],
  imports: [
    CommonModule,
    CommonModule,
    TaskRoutingModule,
    DropzoneModule,
    Ng2SmartTableModule,
    NgbModule,
    DropzoneModule,
    NgxDatatableModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    TooltipModule
  ]
})
export class TaskModule { }
