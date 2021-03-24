import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDeclarationConfigComponent } from './admin-declaration-config.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AdminDeclarationConfigComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ AdminDeclarationConfigComponent ]
})
export class AdminDeclarationConfigModule { }
