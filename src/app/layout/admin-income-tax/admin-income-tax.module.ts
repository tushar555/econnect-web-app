import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminIncomeTaxComponent } from './admin-income-tax.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AdminIncomeTaxComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AdminIncomeTaxComponent
  ],
  schemas: []
})
export class AdminIncomeTaxModule { }
