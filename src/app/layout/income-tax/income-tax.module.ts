import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { IncomeTaxComponent } from "./income-tax.component";
import { AuthGuard } from "../../gaurd/auth.guard";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: '', component: IncomeTaxComponent, canDeactivate: [AuthGuard]}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    IncomeTaxComponent
  ],
  providers: [AuthGuard]
})
export class IncomeTaxModule { }
