import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidayComponent } from './holiday.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component : HolidayComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HolidayComponent
    // HeaderComponent
  ]
})
export class HolidayModule { }
