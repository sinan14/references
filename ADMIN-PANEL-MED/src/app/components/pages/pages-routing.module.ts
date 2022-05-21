import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPageComponent } from './list-page/list-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { NewDepartmentComponent } from './new-department/new-department.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-page',
        component: ListPageComponent,
       
      },
      {
        path: 'create-page',
        component: CreatePageComponent,
      
      },
      {
        path: 'new-department',
        component: NewDepartmentComponent,
       
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
