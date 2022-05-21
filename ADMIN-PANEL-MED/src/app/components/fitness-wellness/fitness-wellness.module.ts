import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GymComponent } from './gym/gym.component';




import { FitnesswellnessRoutingModule } from './fitness-wellness-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@progress/kendo-angular-editor';
import { GridModule ,ExcelModule,PDFModule  } from "@progress/kendo-angular-grid";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { PagerModule } from "@progress/kendo-angular-pager";

import { ChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DietPlanComponent } from './diet-plan/diet-plan.component';
import { CalorieChartComponent } from './calorie-chart/calorie-chart.component';
import { FitnessClubComponent } from './fitness-club/fitness-club.component';
import { YogaComponent } from './yoga/yoga.component';
import { FitnessCalorieChartComponent } from './fitness-calorie-chart/fitness-calorie-chart.component';
import { MasterPageTabComponent } from './master-page-tab/master-page-tab.component';
import { FitnessClubTabComponent } from './fitness-club-tab/fitness-club-tab.component';
import { YogaPageTabComponent } from './yoga-page-tab/yoga-page-tab.component';
import { DietRegimeTabComponent } from './diet-regime-tab/diet-regime-tab.component';
import { HealthRemindersTabComponent } from './health-reminders-tab/health-reminders-tab.component';
import { NutriChartTabComponent } from './nutri-chart-tab/nutri-chart-tab.component';
import { TestimonialTabComponent } from './testimonial-tab/testimonial-tab.component';
import { BmiTabComponent } from './bmi-tab/bmi-tab.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [GymComponent, 
    DietPlanComponent, 
    CalorieChartComponent, 
    FitnessClubComponent, 
    YogaComponent, 
    FitnessCalorieChartComponent,
    MasterPageTabComponent, 
    FitnessClubTabComponent,
    YogaPageTabComponent,
    DietRegimeTabComponent,
    HealthRemindersTabComponent,
    NutriChartTabComponent,
    TestimonialTabComponent,
    BmiTabComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    FitnesswellnessRoutingModule,
    ChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    Ng2SmartTableModule,
    NgbModule,
    DropDownsModule,
    InputsModule,
    FormsModule,
    EditorModule,
    GridModule,
    ExcelModule,
    PDFModule,
    DateInputsModule,
    PagerModule
  ]
})
export class FitnessWellnessModule { }
