import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminListViewDetailsComponent } from './admin-list-view-details.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminListViewDetailsComponent]
})
export class AdminListViewDetailsModule { }
