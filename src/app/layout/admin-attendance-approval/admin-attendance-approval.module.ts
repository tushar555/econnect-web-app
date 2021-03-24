import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAttendanceApprovalComponent } from './admin-attendance-approval.component';
import { AuthGuard } from '../../gaurd/auth.guard';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AdminAttendanceApprovalComponent, canDeactivate: [AuthGuard]  }
];


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminAttendanceApprovalComponent]
})
export class AdminAttendanceApprovalModule { }
