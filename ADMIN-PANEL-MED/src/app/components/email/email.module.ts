import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GmailComponent } from './gmail/gmail.component';



import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { EmailRoutingModule } from './email-routing.module'; 
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [GmailComponent],
  imports: [
    CommonModule,
    EmailRoutingModule,
    DropzoneModule,
    Ng2SmartTableModule,
    DateInputsModule,
    NgbModule
  ]
})
export class EmailModule { }
