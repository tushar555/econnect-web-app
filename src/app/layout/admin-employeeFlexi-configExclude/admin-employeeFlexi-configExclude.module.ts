import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AdminEmployeeFlexiConfigExcludeComponent } from './admin-employeeFlexi-configExclude.component';
import { SharedModule } from '../../shared/shared.module';


const routes: Routes = [
  { path: '', component: AdminEmployeeFlexiConfigExcludeComponent}
];

@NgModule({
  imports: [
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [AdminEmployeeFlexiConfigExcludeComponent]
})
export class AdminEmployeeFlexiConfigExcludeModule { }
