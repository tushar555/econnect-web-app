import { CommonService } from "../../services/common.service";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { ISideMenu, SideMenu } from '../../interface/app.interface';
import { environment } from "../../../environments/environment";
import { AuthService } from "../../services/auth.service";
// import * as $ from 'jquery';

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit, AfterViewInit {
  localUserData: any;
  index: any;
  sourceImage: any;
  showSideBar = false;
  sidemenu: SideMenu[];
  pageheight: any;
  IsManager: any;
  IsTimeAdmin: any;
  IsCSR: any;
  companyName: any;
  TokenId: any;
  IsGiftEligible: any;
  CSRURL: any;
  IsRHR: any;
  IsITEnabled: any;
  isProdBuild: boolean = environment.production;
  constructor(
    public router: Router,
    private _service: CommonService,
    private _auth: AuthService
  ) {

    // this.pageheight = $(window).height()-55;
  }

  ngAfterViewInit() {
    this.pageheight = $(window).height() - 55;
    const abc = document.getElementById("test");
    abc.style.height = this.pageheight + "px";
  }

  openMyProfile() {
    this.router.navigate(["/mfss/my-profile"]);
  }

  checkVisibility(list) {
    if (list.index === 5) {
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
    } else if (list.index === 15) {
      if (this.IsCSR) {
        return true;
      } else {
        return false;
      }
    } else if (list.index === 18) {
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

 async ngOnInit() {
    this.localUserData = await this._service.getUserDetail();
    this.IsManager = this.localUserData.ModulesAdmin[0].IsManager;
    this.IsTimeAdmin = this.localUserData.ModulesAdmin[0].IsTimeAdmin;
    this.IsCSR = this.localUserData.IsCSR;
    this.companyName = this.localUserData.CompanyName;
    this.TokenId = this.localUserData.TokenId;
    this.IsGiftEligible = this.localUserData.IsGiftEligible;
    this.CSRURL = this.localUserData.CSRURL;
    this.IsRHR = this.localUserData.IsRHR;
    this.IsITEnabled = this.localUserData.IsITEnabled;
    this.getSideMenuList();
    const scrollDiv = document.querySelector(".content-section") as HTMLDivElement;
    const userInfo = document.querySelector(".user-info") as HTMLDivElement;

    this._service.toggleSidebar.subscribe(
      data => {
        this.showSideBar = !this.showSideBar;
        if (this.showSideBar) {
          scrollDiv.style.marginLeft = "60px";
          // userInfo.style.display = 'none';
        } else {
          scrollDiv.style.marginLeft = "210px";
          // userInfo.style.display = 'block';
          scrollDiv.style.transition = "all 0.5s ease-in-out";
        }
      },
      error => { }
    );
  }

  getSideMenuList() {
    this._service.getSideMenuList().subscribe(
      (data: ISideMenu )=> {
        this.sidemenu =  data.prodsidemenu;//this.isProdBuild ? data.prodsidemenu: data.uatsidemenu;
      },
      error => { }
    );
  }

  onClickMenuButton() {
    // this._service.toggleSidebar.emit(true);
  }

  onResize(event) {
    event.target.innerWidth;
  }

  comingSoon(list) {
    // if (list.isactive === 0) {
    //   this._service.showSnackbar({ status: "coming_soon" });
    // }
  }

  openLink(list) {
    //console.log('LINK OPEN', list);
    this._service.sideBarActiveImageIndex = list.index;
    this._service.sideBarActiveImage = list.iconhover;

    if (list.name === "Logout") {
      this.Userlogout();
      return false;
    }

    if (list.index === 15) {
      window.open(this.CSRURL);
    } else {
      if (list.isExternal) {
        window.open(list.routerLink);
      }
    }

    // this._service.sideBarActiveImageIndexSource.next(list.index);
    // this._service.sideBarActiveImageSource.next(list.iconhover);
    // this._service.sideBarActiveImage.subscribe((overimage) => {
    //   console.log('Over Image', overimage);

    //   this.sourceImage = overimage;
    // });

    // this._service.sideBarActiveImageIndex.subscribe((overIndex) => {
    //   console.log('Imag 2', overIndex);

    //   this.index = overIndex
    // })
  }

  changeIcon(list, i) {
    let id = "imageId" + i;
    (document.getElementById(id) as HTMLInputElement).src = list.iconhover;
  }

  changeLeaveIcon(list, i) {
    let id = "imageId" + i;
    (document.getElementById(id) as HTMLInputElement ).src = list.icon;
  }
  // active class
  addActive() {
    let sidemenu = document.getElementById("test");
    let btns = sidemenu.getElementsByClassName("sidemenu-class");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        //  alert(btns);
      });
    }
  }

  routeLink(list) {
    if (list.name === "Logout") {
      return [];
    }

    if (list.isactive === 1 && list.isExternal === 0) {
      // if (list.isAdminPresent && this.empData.ModulesAdmin[0].IsIncomeTaxAdmin) {
      // return '/mfss/admin-IT'
      // } else {
      return list.routerLink;
      // }
    } else {
      return [];
    }
  }

  Userlogout() {
    $("#confirmationModal").modal("show");
  }

  logout() {
    this._auth.logout();
    // if (value === 1) {
    //   this._service.logout().then((data: any) => {
    //     // data = true;
    //     if (data) {
    //       this.router.navigate(["/login"]);
    //       $("#confirmationModal").modal("hide");
    //     }
    //   });
    // }
  }
}
