import { Constant } from './constant';
import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { UserCredentials } from '../interface/app.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usercredentials = {} as UserCredentials;
  processing: boolean;
  logoutEvent = new Subject();
  private readonly SSO = 'https://sso.mfeka.com/#/welcome';

  constructor(
    private _http: HttpClient,
    private _services: CommonService,
    public local: LocalStorageService
  ) {
    this.logoutEvent.subscribe((value)=> {
      if(value) {
        window.location.href = this.SSO;
      }
    })
  }

  async checkLogin(usercredentials) {
    //this._services.spinnerService.show();
    let username: any;
    let password: any;
    let url = Constant.ssoAuth;
    if(usercredentials.password){
      username = await this._services.encrypt(usercredentials.username);
      password = await this._services.encrypt(usercredentials.password);
      url = Constant.userAuthentication;
      this.processing = true;
    }else {
      username = usercredentials.username;
    }

    // this.processing = true;
    let data = JSON.stringify({
      tokenid: username,
      password: password,
      overwriteSession: usercredentials.overwriteSeesion || null,
      PIN:  usercredentials.pin || null,
    });
    return this._http.post(url, data,
           {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
              },
              observe: 'response'
            }).pipe(
              catchError( e =>{
                this._services.showSnackbar(e);
                this.processing = false;
                //window.location.href = "https://sso.mfeka.com/#/auth/login";
                return throwError(e);
              }),
              map((resp)=> {return resp.body}),
              tap(()=> this.processing = false)
              ).toPromise();
  }


  autoLogin(data): any {
    return new Promise((resolve, reject) => {

      this._http.post(Constant.userAuthentication, data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'
        },
        observe: 'response'
      } ).subscribe((response:any)=>{

        if(response.body.isUserValid){
          this._services.validateResponse(response.headers.get('authtoken'));
          resolve(response.body);
        }else{
          reject({ error: 'user is not valid' });
        }
      },(error)=>{
        reject({ error: error });
      });
    });
  }

 logout() {
    this.local.clear();
    var allCookies = document.cookie.split(';');
    for (let i = 0; i < allCookies.length; i++) {
      document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
    }
    this.logoutEvent.next(true);
  }


  userlogout() {
   // this.logoutEvent.next(true);
    // this.spinnerService.show();
    // return new Promise((resolve, reject) => {
    //   this._services.getUserDetail().then((data: any) => {
    //     let httpdata = JSON.stringify({ tokenid: data.TokenId });
    //     this._http
    //       .post(Constant.Logout, httpdata, {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Access-Control-Allow-Origin': '*',
    //           'Access-Control-Allow-Credentials': 'true'
    //         },
    //         observe: 'response'
    //       })
    //       .timeout(30000)
    //       .subscribe(
    //         data => {
    //           this.spinnerService.hide();
    //           resolve(data.body);
    //         },
    //         error => {
    //           this.spinnerService.hide();
    //           reject({ error: error });
    //         }
    //       );
    //   });
    // });
  }

  checkPinStatus(URL, data) {
    return this._http.post(URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }
}
