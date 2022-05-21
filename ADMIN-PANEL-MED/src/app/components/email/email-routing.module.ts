import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GmailComponent } from './gmail/gmail.component';


const routes: Routes = [
    {
        path: '',
        component: GmailComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule { }
