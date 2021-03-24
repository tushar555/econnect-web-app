import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form16Component } from './form16.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component : Form16Component}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Form16Component]
})
export class Form16Module { }
