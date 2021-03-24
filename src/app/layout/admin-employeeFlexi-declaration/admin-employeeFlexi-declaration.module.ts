import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminEmployeeFlexiDeclarationComponent } from './admin-employeeFlexi-declaration.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AdminEmployeeFlexiDeclarationComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminEmployeeFlexiDeclarationComponent]
})
export class AdminEmployeeFlexiDeclarationModule { }
