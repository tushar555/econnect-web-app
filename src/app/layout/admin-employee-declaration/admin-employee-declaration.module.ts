import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminEmployeeDeclarationComponent } from './admin-employee-declaration.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AdminEmployeeDeclarationComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminEmployeeDeclarationComponent]
})
export class AdminEmployeeDeclarationModule { }
