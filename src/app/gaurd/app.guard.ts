import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from "../services/common.service";
import { LocalStorageService } from "ngx-store";
import { Location } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {
  constructor(  public _services: CommonService,
    public local: LocalStorageService,
    private location: Location) { }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve)=>{
      this._services.getUserDetail().then((data) => {
        const admin = data["ModulesAdmin"][0]["IsIncomeTaxAdmin"];
        if( !admin ) { return this.location.back(); }
        resolve(admin);
      });
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class ITEnabledGuard implements CanActivateChild {
  constructor( public _services: CommonService,
    public local: LocalStorageService,
    private location: Location) { }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve)=>{
      this._services.getUserDetail().then((data) => {
        const enable = data["IsITEnabled"];
        if( !enable ) { return this.location.back(); }
        resolve(enable);
      });
    });
  }
}
