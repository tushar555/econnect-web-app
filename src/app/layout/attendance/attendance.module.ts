import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import { TimeDiffPipe } from "./../../pipe/time-diff.pipe";
import { AttendanceComponent } from "./attendance.component";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: '', component : AttendanceComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AttendanceComponent, TimeDiffPipe]
})
export class AttendanceModule {}
