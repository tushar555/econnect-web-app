import { CommonService } from "../../services/common.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "ngx-store";
import { AuthService } from "../../services/auth.service";
import { Constant } from "../../services/constant";
import * as moment from "moment";
declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  Title: any;
  responseArr: any;

  constructor(
    private _services: CommonService,
    public _auth: AuthService,
    public local: LocalStorageService
  ) {
    this._services.TitleMessage.subscribe(message => {
      console.log("Income TaxIncome Tax", message);

      this.Title = message ? message : "Income Tax";
    });
  }

  ngOnInit() {}

  onClickMenuButton() {
    this._services.toggleSidebar.emit(true);
  }
  openlogs(e) {
    console.dir(e);
    // this.employeeLogs=null;
    this._services.getUserDetail().then((data: any) => {
      let url = Constant.GetUserNotification;
      let param = JSON.stringify({
        tokenid: data.TokenId,
        todayDate: moment().format("YYYY-MM-DD")
      });
      console.dir(param);
      this._services.postService(url, param, false).then((data: any) => {
        this.responseArr = data.Data;
        console.dir(this.responseArr);
      });
    });
    $("#userNotif").modal("show");
  }

  Userlogout() {
    // console.log('LOGOUT');

    $("#confirmationModal").modal("show");
  }

  logout(value) {
    //
    this._auth.logout();
    // if (value === 1) {
    //   this._auth.userlogout().then((data: any) => {
    //     console.log("Loouttt", data);

    //     if (data === "Success") {
    //       this.local.clear();
    //     //  this._router.navigate(["/login"]);
    //       $("#confirmationModal").modal("hide");

    //       window.location.replace( 'https://sso.mfeka.com/#/auth/login' );

    //     }
    //   });
    // }
  }
}
