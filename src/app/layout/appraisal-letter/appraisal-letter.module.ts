import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppraisalLetterComponent } from './appraisal-letter.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AppraisalLetterComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppraisalLetterComponent]
})
export class AppraisalLetterModule { }
