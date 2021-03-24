import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LeaveTravelAllowanceComponent } from './leave-travel-allowance.component';


const routes: Routes = [
  {
    path: '',
    component: LeaveTravelAllowanceComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LeaveTravelAllowanceComponent
  ]
})
export class LeaveTravelAllowanceModule { }
