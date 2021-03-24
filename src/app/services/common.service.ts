import { Constant } from "./constant";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EventEmitter } from "@angular/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { LocalStorageService } from "ngx-store";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import * as CryptoJS from "crypto-js";
import "rxjs/Rx";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public successData = new Subject<any>();
  public successDocumentData = new Subject<any>();
  public nav = new Observable();
  schemeDeclaration: any;
  Status: any;
  userDetails: any;
  localUserData: any;
  previousDeclarationDetails: any;
  declarationId: any;
  entryType: any;
  formControlFields: any = [];
  modalHeader: any;
  fieldDetailsArray: any = [];
  authKey: any;
  errorMsg: any;
  clickFrom: any;
  empToken: any;
  admindeclarationDetails: any;
  AdminEmpFlexiQuery: any;
  AdminEmpFlexiConfig: any;
  SearchAdminFlexi: any;
  ActualsPeriod: any;
  DeclarationPeriod: any;
  emittedProofArray: any;
  previousDocumentDetails: any;
  public TitleMessage: any = '';
  public userInfo: any = {};
  public serverDate: any;
  public onlineOffline: boolean = navigator.onLine;
  public sideBarActiveImage: any = '';
  public sideBarActiveImageIndex: any = 0;
  public authorizationKey: any;
  empName: any;
  empAge: any;
  SchemeStatus: any;
  public header = {
    headers: {
      "Access-Control-Allow-Credentials": false,
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzA2NjQyMiIsImlzcyI6Ik1NRlNFQ29ubmVjdEFQSSIsImV4cCI6MTUyNjU0MTU4OX0.2T3VkMl6S1QJjuPd-aEAMcRnFBZAR5cUfhYR9iA48Mw"
    }
  };
  public messageSource = new Subject<{}>();
  public titleMessageSource = new BehaviorSubject<{}>(this.TitleMessage);
  public sideBarActiveImageSource = new BehaviorSubject<string>(
    this.sideBarActiveImage
  );
  public sideBarActiveImageIndexSource = new BehaviorSubject<number>(
    this.sideBarActiveImageIndex
  );
  public authtokenobs = new BehaviorSubject<any>("");
  public authtoketheader: any;
  public userdataobs = new BehaviorSubject<any>({});
  public locationPath  = new BehaviorSubject<string>("");
  constructor(
    private _http: HttpClient,
    public spinnerService: Ng4LoadingSpinnerService,
    public _storage: LocalStorageService,
    private _router: Router
  ) {
    // alert('in comman service');

    this.toggleSidebar = new EventEmitter<boolean>();
    this.errorMsg = this.messageSource.asObservable();
    this.TitleMessage = this.titleMessageSource.asObservable();
    this.sideBarActiveImage = this.sideBarActiveImageSource.asObservable();
    this.sideBarActiveImageIndex = this.sideBarActiveImageIndexSource.asObservable();

    this.getUserDetail().then(data => {
      this.localUserData = data;
    });
    this.authtokenobs.subscribe(dt => {
      this.authtoketheader = dt;
    });
  }

  toggleSidebar: EventEmitter<boolean>;

  getSideMenuList(): any {
    return this._http.get(Constant.sidemenu_url);
  }

  getDashboardMenuList(): any {
    return this._http.get(Constant.dashboard);
  }

  logout() {
    const promise = new Promise((resolve, reject) => {
      this._storage.clear();
      resolve(true);
    });
    return promise;
  }



  getHeaders(): any {
    const promise = new Promise(resolve => {
      this.decrypt(this._storage.get("userToken")).then(authtoken => {
        resolve({
          "Content-Type": "application/json",
          Authorization: "Bearer " + authtoken,
          platform: "w"
        });
      });
    });
    return promise;
  }

  showSnackbar(error) {
    if (error.error !== null && error.error !== undefined) {
      error.status = error.error.status;
    }

    switch (true) {
      case error.status == 409:
        this.messageSource.next({ message: "", code: "409" });
        break;
      case error.status == 401:
        this.messageSource.next({
          message: "Your session has expired. Please login again.",
          code: "401"
        });
        //  this._router.navigate(['/login']);
        break;
      case error.status == undefined:
      case error.status === 500:
        this.messageSource.next({
          message: "Something went wrong! Please try again later ",
          code: ""
        });
        break;
      case error.status == 504 ||
        error.status == 0 ||
        error.status == null:
        this.messageSource.next({
          message: "Please check your Internet connection!",
          code: ""
        });
        break;

      case error.status === "coming_soon":
        this.messageSource.next({ message: "Coming Soon", code: "" });
        break;
      default:
        this.messageSource.next({ message: error.status, code: "" });
        break;
    }

    const snackbar = document.getElementById("snackbar");
      if (snackbar){ snackbar.className = "show" };

    setTimeout(()=> {
      snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
  }

  //getPostRequest

  async getUserDetail() {
    const promise = new Promise(resolve => {
      if (this._storage.get("username")) {
        this.decrypt(this._storage.get("username")).then((dt: any) => {
          dt = JSON.parse(dt);
          resolve(dt);
        });
      } else {
        resolve(undefined);
      }
    });
    return promise;
  }

  getPinStatus() {
    const promise = new Promise(resolve => {
      resolve(this._storage.get("pinStatus"));
    });
    return promise;
  }

  setPinStatus(data) {
    const promise = new Promise(resolve => {
      this._storage.set("pinStatus", data);
      resolve(true);
    });
    return promise;
  }

  setUserDetail(data) {
    const promise = new Promise(resolve => {
      const dt = JSON.stringify(data);
      this.encrypt(dt).then(userdata => {
        this._storage.set("username", userdata);
        resolve(true);
      });
    });
    return promise;
  }

  getHeader(): any {
    var promise: any;

    promise = new Promise((resolve, reject) => {
      var header = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this._storage.get("userToken"),
        "Access-Control-Allow-Credentials": false
      };
      resolve({ headers: header });
    });
    return promise;
  }

  // New Function Post Service
 async postService(url, param, loader = true) {
    // if (loader) {
    //   this.spinnerService.show();
    // }

    const promise = new Promise((resolve, reject) => {
      this.getHeaders().then(reqHeaders => {
        // timeout(30000)

        this._http
          .post(url, param, { headers: reqHeaders, observe: "response" })
          .share()
          .subscribe(
            data => {
              // let abc = this.spinnerService.hide();

              // if(data.headers.get('authtoken')){
              this.validateResponse(data.headers.get("authtoken"));
              if (loader) {
                this.spinnerService.hide();
              }
              // }

              resolve(data.body);
            },
            error => {
              if (loader) {
                this.spinnerService.hide();
              }
              this.showSnackbar(error);
              reject(error);
            }
          );
      });
    });
    return promise;
  }

  postuploadFile(url, param) {
    const promise = new Promise((resolve, reject) => {
      this.getHeaders().then(reqHeaders => {
        const header = { Authorization: reqHeaders.Authorization };
        this._http
          .post(url, param, { headers: header, observe: "response" })
          .subscribe(
            data => {
              this.validateResponse(data.headers.get("authtoken"));

              // let abc = this.spinnerService.hide();
              // this.validateResponse(data.headers.get('authToken'));
              resolve(data);
            },
            error => {
              this.spinnerService.hide();
              this.showSnackbar(error);
            }
          );
      });
    });
    return promise;
  }

  // New Function Get Service
  getService(url) {
    //  this.spinnerService.show();
    const promise = new Promise((resolve, reject) => {
      this._http
        .get(url)
        .subscribe(
          data => {
            // this.spinnerService.hide();
            resolve(data);
          },
          error => {
            this.spinnerService.hide();
            this.showSnackbar(error);
          }
        );
    });
    return promise;
  }

  async encrypt(plain_text) {
    const promise = new Promise(resolve => {
      const key = CryptoJS.enc.Utf8.parse("S@LT&P@@sW0rDkEY");
      const iv = CryptoJS.enc.Utf8.parse("@1B2c3D4e5F6g7H8");
      let encrypted = {};
      encrypted = CryptoJS.AES.encrypt(plain_text, key, {
        iv: iv
      });
      const encrypted_text = encrypted["ciphertext"].toString(
        CryptoJS.enc.Base64
      );
      resolve(encrypted_text);
    });
    return promise;
  }

  decrypt(plain_text = "test") {
    const promise = new Promise(resolve => {
      const key = CryptoJS.enc.Utf8.parse("S@LT&P@@sW0rDkEY");
      const iv = CryptoJS.enc.Utf8.parse("@1B2c3D4e5F6g7H8");
      let decrypted: any;
      decrypted = CryptoJS.AES.decrypt(plain_text, key, {
        iv: iv
      });
      const decrypted_text = decrypted.toString(CryptoJS.enc.Utf8);

      resolve(decrypted_text);
    });
    return promise;
  }
  validateResponse(arg: any): any {
    this.encrypt(arg).then(dt => {
      this._storage.set("userToken", dt);
    });
  }

  browser() {
    var ua = navigator.userAgent.match(
      /(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i
    ),
      browser;
    if (
      navigator.userAgent.match(/Edge/i) ||
      navigator.userAgent.match(/Trident.*rv[ :]*11\./i)
    ) {
      browser = "msie";
    } else {
      browser = ua[1].toLowerCase();
    }
    return browser;
  }
}
