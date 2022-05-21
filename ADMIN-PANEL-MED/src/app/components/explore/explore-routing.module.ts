import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreComponent } from './explore/explore.component';
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


const routes: Routes = [
  {
    path: '',
    component: ExploreComponent,
  },
  {
    path: 'article',
    component: ArticleComponent,
  },
  {
    path: 'create-article',
    component: CreateArticleComponent,
  },
  {
    path: 'view-article/:articleID/:viewFlag',
    component: CreateArticleComponent,
  },
  {
    path: 'edit-article/:articleID',
    component: CreateArticleComponent,
  },
  {
    path: 'health-videos',
    component: HealthvediosComponent,
  },
  {
    path: 'health-expert',
    component: HealthexpertComponent,
  },
  {
    path: 'quiz',
    component: QuizComponent,
  },
  {
    path: 'day-quiz/:winnerID',
    component: DayQuizComponent,
  },
  {
    path: 'master',
    component: MasterComponent,
  },
  {
    path: 'health-tips',
    component: HealthTipsComponent,
  },
  {
    path: 'create-health-tips',
    component: CreateHealthTipsComponent,
  },
  {
    path: 'edit-health-tips/:id',
    component: CreateHealthTipsComponent,
  },
  
  {
    path: 'quiz-winners',
    component: QuizWinnersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule { }
