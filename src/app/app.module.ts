import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { Routes, RouterModule } from "@angular/router";
import { WebStorageModule } from "ngx-store";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./gaurd/auth.guard";
import { AdminGuard } from "./gaurd/app.guard";
import { SharedModule } from "./shared/shared.module";

const routes: Routes = [
  {
    path: "login",
    loadChildren: "./login/login.module#LoginModule"
  },
  {
    path: "login/:token",
    loadChildren: "./login/login.module#LoginModule"
  },
  {
    path: "dashboard",
    canActivateChild: [AuthGuard],
    loadChildren: "./dashboard/dashboard.module#DashboardModule"
  },
  {
    path: "mfss",
    canActivateChild: [AuthGuard],
    loadChildren: "./layout/layout.module#LayoutModule"
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    path: "**",
    loadChildren: "./page-not-found/page-not-found.module#PageNotFoundModule"
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    SharedModule,
    HttpClientModule,
    WebStorageModule,
    NgIdleKeepaliveModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
