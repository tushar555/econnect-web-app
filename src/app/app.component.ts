import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { LocalStorageService } from "ngx-store";
import { CommonService } from "./services/common.service";
import { Location } from "@angular/common";
import { environment } from "../environments/environment";
import { AuthService } from "./services/auth.service";

declare var jquery: any;
declare var $;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "app";
  // template: string =
  //   `<img src=assets/img/loader.gif alt="Loader">`
  errorMsg: any;

  template = `<div class="custom-spinner-template" ></div>`;
  errorCode: any;

  ngOnInit() {
    /* Reload page on click of sidemenu start */
    /*this._route.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this._route.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this._route.navigated = false;
        window.scrollTo(0, 0);
      }
    });*/
    /* Reload page on click of sidemenu end */
    var timer = -performance.now();
    if (environment.production) {
      if (location.protocol == "http") {
        window.location.href = location.href.replace("http", "https");
      }
    }
    timer += performance.now();
  }

  constructor(
    private _route: Router,
    private idle: Idle,
    public local: LocalStorageService,
    public location: Location,
    private _shared: CommonService,
    public auth: AuthService
  ) {

    this._shared.locationPath.next(this.location.path());
    this._shared.getUserDetail().then((data: any) => {
      if (
        (data && this.location.path() == "/login") ||
        this.location.path() == ""
      ) {
        this._route.navigate(["/dashboard"]);
        return true;
      }
    });
    this.checkUserIdle();
    this.styleForMobile();
    this._shared.messageSource.subscribe((message: any) => {

      this.errorCode = message.code;
      this.errorMsg = message.message;
      if (message.code === "401") {
        $("#successMessage").modal("show");
        this.local.clear();
      }
    });

    $(document).ready(function() {
      $("body").tooltip({ selector: "[data-toggle=tooltip]" });
    });

    // let fakeBlocker = document.getElementById('fake_position_meta');
    // let letwe = {};
    // letwe = JSON.parse(fakeBlocker.content);

    // if (letwe.isEnabled) {
    //   alert("you added fake blocker");
    // }
  }

  onOkClicked() {
    this._route.navigate(["/login"]);
  }

  checkUserIdle() {
    var timer = -performance.now();

    this.idle.setIdle(1500);
    this.idle.setTimeout(20);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeoutWarning.subscribe((countdown: number) => {});
    this.idle.onTimeout.subscribe(() => {
      this.local.clear();
      this._route.navigate(["/login"]);
    });

    this.idle.watch();
    timer += performance.now();
  }
  gotomypayslip() {
    //  this._route.navigate(['/currentpayslip']);
  }

  styleForMobile() {
    const scrollDiv = <HTMLDivElement>document.querySelector(".sidebar");
  }
}
