import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreComponent } from './explore/explore.component';


import { ExploreRoutingModule } from './explore-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { EditorModule } from '@progress/kendo-angular-editor';
import { GridModule ,ExcelModule,PDFModule} from "@progress/kendo-angular-grid";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';




import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { LabelModule } from '@progress/kendo-angular-label';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArticleComponent } from './article/article.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { HealthvediosComponent } from './healthvedios/healthvedios.component';
import { QuizComponent } from './quiz/quiz.component';
import { HealthexpertComponent } from './healthexpert/healthexpert.component';
import { DayQuizComponent } from './day-quiz/day-quiz.component';
import { MasterComponent } from './master/master.component';
import { HealthTipsComponent } from './health-tips/health-tips.component';
import { CreateHealthTipsComponent } from './create-health-tips/create-health-tips.component';
import { QuizWinnersComponent } from './quiz-winners/quiz-winners.component';


import { DialogComponent } from './create-article/dailog.component';
import { UploadComponent } from './create-article/upload.component';


import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  maxFilesize: 50,
  url: 'https://httpbin.org/post',
};



@NgModule({
  declarations: [ExploreComponent, ArticleComponent, 
    CreateArticleComponent, HealthvediosComponent, 
    QuizComponent, HealthexpertComponent, DayQuizComponent,
     MasterComponent, HealthTipsComponent,
      CreateHealthTipsComponent, QuizWinnersComponent,
      DialogComponent,UploadComponent],
  imports: [
    CommonModule,
    ExploreRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    DropDownsModule,
    InputsModule,
    HttpClientModule,
    EditorModule,
    GridModule,
    ExcelModule,
    PDFModule,
    FormsModule,
    ReactiveFormsModule,
    DialogsModule,
    LabelModule,
    UploadModule,
    ButtonsModule,
    DateInputsModule
  ],
  providers: [
    // {
    //   provide: DROPZONE_CONFIG,
    //   useValue: DEFAULT_DROPZONE_CONFIG,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UploadComponent,
      multi: true,
    },
    
  ]
})
export class ExploreModule { }
