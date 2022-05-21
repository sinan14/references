import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskComponent } from './task/task.component';


const routes: Routes = [
    {
        path: '',
        children: [
          {
            path: 'task-list',
            component: TaskComponent,
           
          }
         
        ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
