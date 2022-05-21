import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event/event.component';



import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { EventRoutingModule } from './event-routing.module'; 
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { HttpClientModule } from '@angular/common/http';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

FullCalendarModule.registerPlugins([ 
  interactionPlugin,
  dayGridPlugin
]);

@NgModule({
  declarations: [EventComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    DropzoneModule,
    Ng2SmartTableModule,
    DateInputsModule,
    FullCalendarModule,
    HttpClientModule
  ]
})
export class EventModule { }
