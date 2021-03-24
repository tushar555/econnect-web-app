import { Component, OnInit } from '@angular/core';
import { Constant } from './../../services/constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as moment from 'moment';
import { CommonService } from './../../services/common.service';
import { Location } from '@angular/common';

class ConfigDetails{
  actualFrom: string;
  actualTill: string;
  declarationFrom: string;
  declarationTill: string;
}
declare var jquery: any;
declare var $;
@Component({
  selector: 'app-admin-declaration-config',
  templateUrl: './admin-declaration-config.component.html',
  styleUrls: ['./admin-declaration-config.component.scss']
})
export class AdminDeclarationConfigComponent implements OnInit {
  configDetails: ConfigDetails;
  localUserData: any;
  userInfo: any;
  isAdminIT: any;
  constructor(private _services: CommonService, public spinnerService: Ng4LoadingSpinnerService, public location: Location ) {
    this.configDetails = new ConfigDetails();
  }

  ngOnInit() {
    this._services.getUserDetail().then((data) => {
      this.localUserData = data;
      this.userInfo = this.localUserData;
      this.userInfo.ModulesAdmin[0].IsIncomeTaxAdmin;
      this.isAdminIT = this.userInfo.ModulesAdmin[0].IsIncomeTaxAdmin;
      this.getAdminDeclarationConfig();
    });
  }

  getAdminDeclarationConfig(){
    let param = {
      tokenid: this.localUserData.TokenId,
    }
    this._services.postService(Constant.GetITSchedule,param)
    .then((data)=>{
      console.log(data);
      this.configDetails.declarationFrom = moment(data[0].FromDate).format('YYYY-MM-DD');
      this.configDetails.declarationTill = moment(data[0].ToDate).format('YYYY-MM-DD');
      this.configDetails.actualFrom = moment(data[1].FromDate).format('YYYY-MM-DD');
      this.configDetails.actualTill = moment(data[1].ToDate).format('YYYY-MM-DD');
    })
  }

  updateAdminDeclarationConfig(){
    let param = {
      tokenid : this.localUserData.TokenId,
      scheduleItems :[
        {
          FromDate: this.configDetails.declarationFrom,
          ToDate: this.configDetails.declarationTill,
          Type: "Declaration"
        },
        {
          FromDate: this.configDetails.actualFrom,
          ToDate: this.configDetails.actualTill,
          Type: "Actuals"
        },
      ]
    }
    this.spinnerService.show();
    this._services.postService(Constant.UpdateITSchedule, param)
    .then((data)=>{
      console.log(data);
      $('#successModal').modal('show');
      this.spinnerService.hide();
    }, err=>{
      console.log(err);
      this.spinnerService.hide();
    })
  }
}
