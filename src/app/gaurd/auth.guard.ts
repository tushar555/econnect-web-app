import { CommonService } from "./../services/common.service";
import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanDeactivate
} from "@angular/router";
// import { Observable } from 'rxjs/Observable';
import { Observable } from "rxjs/Observable";
//import 'rxjs/add/observable/fromEvent';
import { LocalStorageService } from "ngx-store";

// export interface CanComponentDeactivate {
//   canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
// }

@Injectable()
export class AuthGuard
  implements CanActivate, CanActivateChild, CanDeactivate<any> {
  constructor(
    public _services: CommonService,
    public route: Router,
    public local: LocalStorageService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const storedID = this.local.get("username");

    if (storedID === null || storedID === undefined) {
      this.route.navigate(["/login"]);
      return false;
    } else {
      return true;
    }
  }

  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._services.getUserDetail().then((data: any) => {
      if (data !== undefined) {
        const storedID = data;
        let IncomeTaxAdmin = data.ModulesAdmin[0].IsIncomeTaxAdmin;
        let FlexiAdmin = data.ModulesAdmin[0].IsFlexiAdmin;

        //comment below two lines to activate the flexi and IT admin authorization.
        //IncomeTaxAdmin = true;
        // FlexiAdmin = true;

        let url = state.url;
        if (url === "/mfss/admin-IT" || url === "/mfss/admin-flexi") {
          if (url === "/mfss/admin-IT" && IncomeTaxAdmin === true) {
            return true;
          } else if (url === "/mfss/admin-flexi" && FlexiAdmin === true) {
            return true;
          } else {
            return false;
          }
        } else if (url == "/login") {
          if (storedID) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        this.route.navigate(["login"]);

        return true;
        //  return false;
      }
    });
  }
}
