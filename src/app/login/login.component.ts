import { CommonService } from './../services/common.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-store';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  content: string;
  showPassword = false;
  loginForm: any;
  invalid: any;
  responseDetails: any;
  userData:any;
  sapCode: string;
  loginFrom: string = 'SSO';
  private readonly SSO = 'https://sso.mfeka.com/#/welcome';

  constructor(
    public local: LocalStorageService,
    private _fb: FormBuilder,
    public auth: AuthService,
    public route: Router,
    public _services: CommonService,
    public spinnerService: Ng4LoadingSpinnerService,
     public activatedSnapshot: ActivatedRoute
  ) {
    this.invalid = 'none';

    this._services.errorMsg.subscribe(message => {

      if (message.code === '409') {
        $('#confirmationModal').modal('show');
      }
    });

  }

 async ngOnInit() {
    this.activatedSnapshot.params.subscribe(async (data: { token: string}) => {
        try {
          this.validateSession(data.token);
          this.loginFrom = 'SSO';
          this.login();
        } catch (e) {
         $('#warningModal').modal({
          backdrop: 'static',
          keyboard: false
        });
         // window.location.href = 'https://sso.mfeka.com/#/welcome';
        }
    });

    this.initializeLoginForm();
  }

  validateSession(token) {
    if(!token) { throw Error};
    var decodedString = decodeURIComponent(token).split("|");

    if(document.cookie) {
      const cookie = document.cookie.split(';');
      // const abc = "sid=83dde0c2-e6d5-4c22-a7d3-8feac26601f9";
      // const arr = abc.split(";");
      //document.write(pqr.split("=")[1]);
      const sidCookie = cookie.find(obj=> obj.includes("sid")).split("=");
      let sid;
      if(sidCookie) { sid =  sidCookie[1]; }
      if(sid == decodedString[1]) { this.sapCode = decodedString[0]; }
      else { throw Error; }
    } else {
      throw Error;
    }
  }
  onUnameClick() {
    this.loginForm.patchValue({ username: null });
  }
  initializeLoginForm() {
    // tslint:disable-next-line: comment-format
    //filled with default value to prevent auto fill of Chrome cache value
    this.loginForm = this._fb.group({
      username: ['Token ID', Validators.required],
      password: [null, Validators.required],
      pin: [null, []]
    });
  }

  onkeyUp(event, tb) {
    const getId = (+event.target.id + 1).toString();
    const htmlTemplate = document.getElementById(getId) as HTMLInputElement;

    if (htmlTemplate === null) {
      document.getElementById('loginBtn').focus();
      return false;
    }
    if (event.target.value.length == 1) {
      htmlTemplate.focus();
    }
  }

  onkeyPress(event) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
  }

  async login(overwriteSeesion?) {
    this.invalid = 'none';
    let loginData:any = {};

    if(this.loginFrom !== 'SSO' && !this.loginForm.valid) {
      this.invalid = 'block';
    }
    if(this.loginFrom === 'SSO') { loginData.username = this.sapCode;}
    else {
      loginData = this.loginForm.value;
      loginData.overwriteSeesion = overwriteSeesion;
    }

    const resp: any = await this.auth.checkLogin(loginData);
    if (resp.isUserValid) {
      this.local.clear();
      const encUser = await this._services.encrypt(resp.authtoken);
      this.local.set('userToken', encUser);
      this._services.setUserDetail(resp).then(res => {
        this.route.navigate(['/dashboard'], {
          queryParams: { skip: true }
        });
      });
    } else {
      this.invalid = 'block';
    }
  }

  loginSSO() {
    window.location.href = this.SSO;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
