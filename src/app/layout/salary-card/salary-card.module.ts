import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryCardComponent, NewPipe, securedLink } from './salary-card.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SalaryCardComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SalaryCardComponent, NewPipe, securedLink
    // HeaderComponent
  ]
})
export class SalaryCardModule { }
