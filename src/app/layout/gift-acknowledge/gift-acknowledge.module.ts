import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { GiftAcknowledgeComponent } from "./gift-acknowledge.component";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  {
    path: "",
    component: GiftAcknowledgeComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GiftAcknowledgeComponent]
})
export class GiftAcknowledgeModule {}
