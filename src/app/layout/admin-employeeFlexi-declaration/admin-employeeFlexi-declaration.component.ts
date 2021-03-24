import { log } from 'util';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { Constant } from './../../services/constant';
import { element } from 'protractor';
import { CommonService } from './../../services/common.service';
import { Component, OnInit } from '@angular/core';
import { Services } from '@angular/core/src/view';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as moment from 'moment';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl, NgForm } from '@angular/forms';
import { CommonArray } from '../../services/commonArray';
import { ActivatedRoute, Router } from '@angular/router';

declare var jquery: any;
declare var $: any;
class FlexiDetailstest {
  FlexiId: number;
  DeclaredAmount: number;
  FlexiComponent: string;
  IsEditable: boolean;
  Limit: number;
  Remarks: string;
  Status:any
}

@Component({
  selector: 'app-admin-employee-declaration',
  templateUrl: './admin-employeeFlexi-declaration.component.html',
  styleUrls: ['./admin-employeeFlexi-declaration.component.scss']
})

export class AdminEmployeeFlexiDeclarationComponent implements OnInit {
  flexiDetails: FlexiDetailstest[] = [];
  FlexiPay: number;
  BalanceFlexi: number;
  DeclaredAmount: number;
  FlexiYear: number;
  actionType: any;
  empToken: any;
  empName: any;
  offlineObj: any;
  adminRemarks: string = '';
  TokenId: any;
  subScheme: any;
  EmployeeName: any;
  flexiDetailsAdmin: any;
  noRemarks;
  showSubmit: any;
  constructor(public spinnerService: Ng4LoadingSpinnerService,private route1:Router, public route: ActivatedRoute, public local: LocalStorageService, private _services: CommonService) {
    this.FlexiYear = parseInt(moment().format('YYYY'));
    this.route.queryParams.subscribe((dt: any) => {
      //this.empToken = dt.TokenId;
      //this.empName = dt.EmpName;
    });


    console.dir(this._services.AdminEmpFlexiQuery);
    if (this._services.AdminEmpFlexiQuery) {
      this.empToken = this._services.AdminEmpFlexiQuery.TokenId;
      this.empName = this._services.AdminEmpFlexiQuery.EmpName;
    }else{
      this.route1.navigate(['mfss/admin-flexi'], );

    }

  }

  ngOnInit() {
    this.getFlexiDetails();
  }

  getFlexiDetails() {
    this.spinnerService.show();
    this._services.getUserDetail().then((data: any) => {
      // data.TokenId '23105449'

      this.TokenId = data.TokenId;
      let url = Constant.AdminGetFlexiComponents;
      let param = JSON.stringify({
        "tokenid": data.TokenId,
        "emptokenid": this.empToken
      });
      // let param = {
      //   "tokenid": data.TokenId,
      //   "emptokenid": this.empToken
      // }
      this._services.postService(url, param)
        .then((data: any) => {
          this.spinnerService.hide();
          this.flexiDetails = data.FlexiComponents;
          this.flexiDetailsAdmin = data.FlexiComponents;
          this.EmployeeName = data.FlexiComponents[0].EmployeeName;
          console.log(this.flexiDetails);
          this.getFlexiPayBalance();
          this.calculateFlexiDeclaration(0, 0);
          var count=0;
          
          for(let i=0;i< this.flexiDetails.length;i++){
                if(this.flexiDetails[i].Status == 'Rejected'){
                  this.showSubmit='rejected'; 
                }else if(this.flexiDetails[i].Status == 'Approved'){
                  this.showSubmit='approved'; 
                }
          }        
        })
    })
  }

  openRejectionModal(subScheme) {
    console.log('rejectionModal', subScheme);
    console.dir(subScheme);
    this.subScheme = subScheme;
    $('#rejectionModal').modal('show');
  }

  adminApproveReject() {
    let url = Constant.AdminFlexiApproveRejectDeclarations;
    let actionType = 'Approved';
    if (this.actionType == 'approved')
      actionType = 'Approved';
    else if (this.actionType == 'reject')
      actionType = 'Rejected';
    else if (this.actionType == 'rejectAll')
      actionType = 'rejectall';
    else if (this.actionType == 'approveAll')
      actionType = 'approveall';

    console.dir(this.adminRemarks);
    let params = {
      // "AdminTokenId": this._storage.get('username').TokenId,
      "AdminTokenId": this.TokenId,
      "emptokenid": this.empToken,
      "declarations": [
        {
          "DeclarationId": this.offlineObj.FlexiId,
          "Status": actionType,
          "AdminRemarks": this.adminRemarks ? this.adminRemarks : null,
        }
      ]
    };
    console.dir(params);
    // return false;
    //console.log(params);
    this.spinnerService.show();
    this._services.postService(url, params).then((data) => {
      // console.log(data);
      if (data == "Success") {
        this.getFlexiDetails();
        //  this.initializeSection();
      } else {

      }
      this.spinnerService.hide();
    })
  }



  adminConfirmation(action, declaration) {
    this.actionType = action;
    this.offlineObj = declaration;
    this.adminRemarks = null;
    console.dir(this.offlineObj);
    if (action === 'approve') {
      $("#approveModal").modal('show');
    } else if (action === 'reject') {

      $("#rejectModal").modal('show');
    }
    else if (action === 'rejectAll') {
      // this.adminRemarks = null;
      $("#rejectModalAll").modal('show');
    } else if (action === 'approveAll') {
      $("#approveModalAll").modal('show');
    }
  }

  validateAmountKeyPress(event, limit, i) {
    let chr = parseInt(event.key);
    if (isNaN(chr)) {
      console.log('not number');
      return false;
    }
  }

  validateAmountKeyUp(event, limit, i) {
    let amount = this.flexiDetails[i].DeclaredAmount;
    if (amount.toString() == '' || amount == null) {
      this.flexiDetails[i].DeclaredAmount = 0;
    }
    if (limit !== null && amount > limit) {
      this.flexiDetails[i].DeclaredAmount = limit;
    }
    console.log('amount', amount, 'limit', limit);
    this.calculateFlexiDeclaration(limit, i);
  }

  submitFlexiDeclaration() {
    this._services.getUserDetail().then((data: any) => {
      // data.TokenId '23105449'
      this.spinnerService.show();
      let url = Constant.SubmitFlexiDeclaration;
      let param = {
        tokenid: data.TokenId,
        fiscal_year: this.FlexiYear,
        FlexiComponents: this.flexiDetails
      }
      this._services.postService(url, param)
        .then((data: any) => {
          console.log(data);
          // this.getFlexiDetails();
          this.spinnerService.hide();
          this.showMessageModal();
        }, err => {
          console.log(err);
        });
    })
  }

  showSubmitFlexi() {
    $("#conformationModal").modal('show');
  }

  showMessageModal() {
    $("#messageModal").modal('show');
  }

  getFlexiPayBalance() {
    this.flexiDetails.forEach((el) => {
      if (el.FlexiId == 9) {
        this.FlexiPay = el.DeclaredAmount;
      } else if (el.FlexiId == 10) {
        this.BalanceFlexi = el.DeclaredAmount
      }
    });
    console.log('flexipay', this.FlexiPay);
    console.log('balanceflexi', this.BalanceFlexi);
  }

  calculateFlexiDeclaration(limit, i) {
    this.DeclaredAmount = 0;
    this.flexiDetails.forEach((el) => {
      if (el.FlexiId !== 9 && el.FlexiId !== 10) {
        if (el.DeclaredAmount == null) {
          el.DeclaredAmount = 0;
        }
        el.DeclaredAmount = parseInt(el.DeclaredAmount.toString());
        if (!isNaN(el.DeclaredAmount))
          this.DeclaredAmount += el.DeclaredAmount;
      }
    });
    this.BalanceFlexi = this.FlexiPay - this.DeclaredAmount;
    if (this.BalanceFlexi < 0) {
      this.flexiDetails[i].DeclaredAmount += this.BalanceFlexi;
      this.DeclaredAmount += this.BalanceFlexi;
      // console.log(this.flexiDetails[i].DeclaredAmount);
      this.BalanceFlexi = 0;
    }
  }
}
