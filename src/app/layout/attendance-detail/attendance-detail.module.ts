import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../gaurd/auth.guard';
import { AttendanceDetailComponent } from './attendance-detail.component';

const routes: Routes = [
  { path: '', component: AttendanceDetailComponent, canDeactivate: [AuthGuard]  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AttendanceDetailComponent]
})
export class AttendanceDetailModule { }
