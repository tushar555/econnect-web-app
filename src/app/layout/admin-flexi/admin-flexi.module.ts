import { NgModule } from '@angular/core';
import { AdminFlexiComponent } from './admin-flexi.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
// import { ModalComponent } from '../modal/modal.component';
const routes: Routes = [
  { path: '', component: AdminFlexiComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AdminFlexiComponent
  ],
  schemas: []
})
export class AdminFlexiModule { }
