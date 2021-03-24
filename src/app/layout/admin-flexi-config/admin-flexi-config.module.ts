import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminFlexiConfigComponent } from './admin-flexi-config.component';

import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AdminFlexiConfigComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AdminFlexiConfigComponent
  ],
  schemas: []
})
export class AdminFlexiConfigModule { }
