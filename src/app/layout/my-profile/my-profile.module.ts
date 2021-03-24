import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyProfileComponent } from "./my-profile.component";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  {
    path: "",
    component: MyProfileComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [MyProfileComponent]
})
export class MyProfileModule {}
