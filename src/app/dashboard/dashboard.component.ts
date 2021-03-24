import { CommonService } from "./../services/common.service";
import {
  Component,
  OnInit,
  AfterViewInit
} from "@angular/core";
import { LocalStorageService } from "ngx-store";
// import * as $ from 'jquery';
import {
  Router,
  ActivatedRoute,
} from "@angular/router";
import { Constant } from "../services/constant";
import { AuthService } from "../services/auth.service";
import { environment } from '../../environments/environment';

declare var jquery: any;
declare var $: any;
import * as moment from "moment";
import { Menu } from "../interface/app.interface";
interface MenuList {
  imgSrc:string;
  iconhover: string;
  title: string;
  routerLink: string;
  isactive: number;
  index: number;
  isBalnk: boolean;
  isExternal: number;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  localUserData: any;
  isIncomeAdmin: any;

  name = "";
  companyName = "";
  location = "";
  imgLocation = "";
  TokenId: any;
  menuList: MenuList[] =[]  ;
  userInfo: any = {};
  pageheight: any;
  showInfo: boolean = false;

  IsTimeAdmin: any;
  IsManager: any;
  employeeLogs: any;
  EmpName: any;
  responseArr: any;
  IsCSR: any;
  IsGiftEligible: any;
  CSRURL: any;
  isPinPresent: any;
  IsRHR: any;
  IsPasswordChange: any;
  IsITEnabled: any;
  isProdBuild = environment.production;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private _services: CommonService,
    public local: LocalStorageService,
    private _auth: AuthService
  ) {
    // this.userInfo = this.local.get('username');
    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.userInfo = this.localUserData;
      // console.log('userInfo', this.userInfo);
      // console.log('local', this.localUserData);

      // this.userInfo = this._services.userInfo;
      this.IsManager = this.userInfo.ModulesAdmin[0].IsManager;
      this.IsTimeAdmin = this.userInfo.ModulesAdmin[0].IsTimeAdmin;
      this.IsCSR = this.userInfo.IsCSR;
      this.companyName = this.userInfo.CompanyName;
      this.location = this.userInfo.LocationName;
      this.TokenId = this.userInfo.TokenId;
      this.IsGiftEligible = this.userInfo.IsGiftEligible;
      this.CSRURL = this.userInfo.CSRURL;
      this.IsRHR = this.userInfo.IsRHR;
      this.IsITEnabled = this.userInfo.IsITEnabled;
      this.isPinPresent = this.userInfo.IsPinAvailable;
      //this.isIncomeAdmin = true; //this.userInfo.ModulesAdmin[0].IsIncomeTaxAdmin;

      this.imgLocation = "assets/img/default-image.png";

      this._services.getDashboardMenuList().subscribe(
        (data: Menu) => {
          this.menuList = data.prodmenu; //this.isProdBuild ? data.prodmenu: data.uatmenu;
          this.showInfo = true;
        },
        error => {
          this.showInfo = true;
          // console.log(error);
        }
      );

      // get current date from server
      this._services.getService(Constant.getServerDateTime).then(data => {
        this._services.serverDate = data;
      });
    });
  }

  ngAfterViewInit() {
    this.pageheight = $(window).height();
    const abc = document.getElementById("dashboard_id");
    // abc.style.height = this.pageheight + 'px';
    // const userInfoHeight = document.getElementById('userDetails');
    // console.log(userInfoHeight);

    // userInfoHeight.style.height = (this.pageheight / 2) + 'px';
    this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      let showdata = params["skip"] || false;
      // this._services.getPinStatus().then((resp: any) => {
      //   this.isPinPresent = resp.IsPinAvailable;
      //   this.IsPasswordChange = resp.IsPasswordChange;

      //   if (showdata === "true" && this.isPinPresent === "false") {
      //     $("#warningModal").modal("show");
      //     //        $("#warningModal").modal("toggle");
      //   } else if (showdata === "true" && this.IsPasswordChange === "true") {
      //     $("#warningModal").modal("show");
      //   }
      // });
    });
  }

  openMyProfile() {
    this._router.navigate(["/mfss/my-profile"]);
  }

  openlogs(e) {
    console.dir(e);
    this.employeeLogs = null;
    this._services.getUserDetail().then((data: any) => {
      let url = Constant.GetUserNotification;
      let param = JSON.stringify({
        tokenid: data.TokenId,
        todayDate: moment().format("YYYY-MM-DD")
      });
      console.dir(param);
      this._services.postService(url, param, false).then(
        (data: any) => {
          this.responseArr = data.Data;
          console.dir(this.responseArr);
        },
        error => {
          // this.spinnerService.hide();
          //  this.smallLoader=false;
        }
      );
    });
    $("#userNotif").modal("show");
  }

  ngOnInit() {
    console.log("**************************In ngOnInit");
  }

  checkVisibility(list) {
    //console.log('CHEEEEEEEEEEEE',this.IsManager,this.IsTimeAdmin );
    if (list.index === 4) {
      if (this.IsITEnabled) {
        return true;
      } else {
        return false;
      }
    } else if (list.index === 17) {
      if (this.IsManager) {
        return true;
      } else {
        return false;
      }
    } else if (list.index === 16) {
      if (this.IsTimeAdmin) {
        return true;
      } else {
        return false;
      }
    } else if (list.index === 14) {
      if (this.IsCSR) {
        return true;
      } else {
        return false;
      }
    }

    //else if (list.index === 5) {
    // if (this.companyName === "MAMC") {
    //   return true;
    // } else {
    //   return false;
    // }
    //}
    else if (list.index === 18) {
      // this.TokenId === "23175693" ||
      //   this.TokenId === "23135063" ||
      //   this.TokenId === "24009108"
      if (
        this.TokenId === "23175693" ||
        this.TokenId === "23135063" ||
        this.TokenId === "24009108" ||
        this.IsRHR
      ) {
        return true;
      } else {
        return false;
      }
    } else if (list.index === 20) {
      if (this.IsGiftEligible) {
        return true;
      } else {
        return false;
      }
    } else if (list.index === 21) {
      if (
        this.companyName === "MIBL" ||
        this.companyName === "MMFSL" ||
        this.companyName === "MAMC"
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  lTaSummery() { }

  Userlogout() {
    $("#confirmationModal").modal("show");
  }
  logout() {

    this._auth.logout();
      // this._auth.userlogout().then((data: any) => {
      //   if (data === "Success") {
      //     this.local.clear();
      //     this._router.navigate(["/login"]);
      //     $("#confirmationModal").modal("hide");
      //   }
      // });
  }

  comingSoon(list) {
    // if (list.isactive === 0) {
    //   this._services.showSnackbar({ status: "coming_soon" });
    // }
  }

  openLink(list) {
    this._services.sideBarActiveImageIndex = list.index;
    this._services.sideBarActiveImage = list.iconhover;

    if (list.index === 14) {
      window.open(this.CSRURL);
    } else {
      if (list.isExternal) {
        window.open(list.routerLink);
      }
    }

    // console.log(this._services.sideBarActiveImageIndex);
    // console.log(this._services.sideBarActiveImage);
  }

  routeLink(list) {
    // let designation = this.isIncomeAdmin;

    if (list.isactive === 1 && list.isExternal === 0) {
      // if (list.isAdminPresent && this.userInfo.ModulesAdmin[0].IsIncomeTaxAdmin) {
      //   return '/mfss/admin-IT'
      // } else {
      return list.routerLink;
      // }
    } else {
      return [];
    }
  }

  setPin() {
    //$("#warningModal").hide();
    // $("#warningModal").modal("hide");
    $("#warningModal").modal("toggle");
    this._router.navigate(["/mfss/my-profile"]);
  }
}
