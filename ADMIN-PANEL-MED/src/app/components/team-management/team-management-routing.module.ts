import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamManagementComponent } from './team-management/team-management.component';
import { TeamComponent } from './team/team.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';

const routes: Routes = [
  {
    path: '',
    component: TeamManagementComponent,
    
  },
  {
    path: 'team-list/:departmentId',
    component: TeamComponent,
    
  },
  {
    path: 'new-employee/:departmentId',
    component: NewEmployeeComponent,
    
  },{
    path: 'edit-employee/:departmentId/:employeeId',
    component: NewEmployeeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeammanagementRoutingModule { }
