import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPipe } from './../../pipe/search.pipe';
import { HospitalComponent } from './hospital.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: HospitalComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HospitalComponent,
    SearchPipe
  ]
})
export class HospitalModule { }
