import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentPaySlipComponent } from './current-pay-slip.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: CurrentPaySlipComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CurrentPaySlipComponent]
})
export class CurrentPaySlipModule { }
