import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GymComponent } from './gym/gym.component';
import { DietPlanComponent } from './diet-plan/diet-plan.component';
import { CalorieChartComponent } from './calorie-chart/calorie-chart.component';
import { FitnessClubComponent } from './fitness-club/fitness-club.component';
import { YogaComponent } from './yoga/yoga.component';
import { FitnessCalorieChartComponent } from './fitness-calorie-chart/fitness-calorie-chart.component';


const routes: Routes = [
  {
    path: '',
    component: GymComponent,
  },
  {
    path: 'diet-plan/:id',
    component: DietPlanComponent,
  },
  {
    path: 'calorie-chart/:id',
    component: CalorieChartComponent,
  },
  {
    path: 'fitness-club',
    component: FitnessClubComponent,
  },
  {
    path: 'yoga',
    component: YogaComponent,
  },
  {
    path: 'calorie',
    component: FitnessCalorieChartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FitnesswellnessRoutingModule { }
