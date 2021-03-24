import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AdminListViewComponent } from "./admin-list-view.component";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: '', component: AdminListViewComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminListViewComponent]
})
export class AdminListViewModule {}
