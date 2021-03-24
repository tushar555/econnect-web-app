import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlexiComponent } from './flexi.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: FlexiComponent
  }
];


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlexiComponent]
})
export class FlexiModule { }
