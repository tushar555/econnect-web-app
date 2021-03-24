import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminEmployeeFlexiConfigComponent } from './admin-employeeFlexi-config.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AdminEmployeeFlexiConfigComponent}
];

@NgModule({
  imports: [
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [AdminEmployeeFlexiConfigComponent]
})
export class AdminEmployeeFlexiConfigModule { }
