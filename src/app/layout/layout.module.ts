import { NgModule } from "@angular/core";
import { LayoutComponent } from "./layout.component";
import { LayoutRoutingModule } from "./layout-routing.module";
import { SharedModule } from "../shared/shared.module";
import { SidebarComponent } from "../components/sidebar/sidebar.component";

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent
  ],
  imports: [
    SharedModule,
    LayoutRoutingModule
  ],
  providers: [ ]
})
export class LayoutModule { }
