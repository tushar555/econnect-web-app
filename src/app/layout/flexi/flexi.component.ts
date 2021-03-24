import { Component, OnInit } from '@angular/core';
import { Constant } from '../../services/constant';
import { LocalStorageService } from 'ngx-store';
import { CommonService } from '../../services/common.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

// declare var jquery: any;
declare var $: any;

class FlexiDetails {
  FlexiId: number;
  DeclaredAmount: number;
  FlexiComponent: string;
  IsEditable: boolean;
  Limit: number;
  Remarks: string;
}
@Component({
  selector: 'app-flexi',
  templateUrl: './flexi.component.html',
  styleUrls: ['./flexi.component.scss']
})
export class FlexiComponent implements OnInit {
  flexiDetails: FlexiDetails[] = [];
  FlexiPay: number;
  BalanceFlexi: number;
  DeclaredAmount: number;
  FlexiYear: number;
  adminRemarks: any;
  showSubmit: number;
  showMessageFlexi: any;
  empToken: any;
  getEmpName: any;
  FlexiAdmin: any;
  description: any;

  constructor(public spinnerService: Ng4LoadingSpinnerService,public route: ActivatedRoute,public route1: Router, public local: LocalStorageService, private _services: CommonService) {
    this.FlexiYear = this.getFiscalYear();
    this._services.titleMessageSource.next('Flexi Declaration');

    this.route.queryParams.subscribe((dt: any)=>{
    //  this.empToken = dt.EmpIdFlexi;
    });

    if(this._services.SearchAdminFlexi){
      this.empToken = this._services.SearchAdminFlexi.TokenId;
      this._services.SearchAdminFlexi.TokenId=null;
    }
    console.dir(this.empToken);
  }

  ngOnInit() {
    this.getFlexiDetails();
  }

  getFlexiDetails() {
    this._services.getUserDetail().then((data: any) => {
      // data.TokenId '23105449'
      this.spinnerService.show();
      this.FlexiAdmin=data.ModulesAdmin[0].IsFlexiAdmin;
      console.dir(this.FlexiAdmin);
      let url = Constant.GetFlexiComponents;
      let param = JSON.stringify({
        tokenid: data.TokenId,
        empToken: this.empToken? this.empToken : null,
        fiscal_year: this.FlexiYear
      });
      this._services.postService(url, param)
        .then((data: any) => {
          this.spinnerService.hide();
          this.flexiDetails = data.FlexiComponents;
          this.getEmpName= data.FlexiComponents[0].EmployeeName;
          console.log(this.flexiDetails);
          this.getFlexiPayBalance();
          this.calculateFlexiDeclaration(0, 0);
          var count=0;
          for(let i=0;i< this.flexiDetails.length;i++){
                if(this.flexiDetails[i].IsEditable == false){
                    count++;
                }
          }
         this.showSubmit=count; 
        })
    })
  }

  ViewChange() {

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
    if (amount.toString() == '' || amount==null) {
      this.flexiDetails[i].DeclaredAmount = 0;
    }
    if (limit!==null && amount > limit) {
      this.flexiDetails[i].DeclaredAmount = limit;
    }
    console.log('amount',amount, 'limit', limit);
    this.calculateFlexiDeclaration(limit, i);
  }

  submitFlexiDeclaration(valueFlexi) {
    this._services.getUserDetail().then((data: any) => {
      // data.TokenId '23105449'
      this.spinnerService.show();
      let url = Constant.SubmitFlexiDeclaration;
      let param = {
        tokenid: data.TokenId,
        fiscal_year: this.FlexiYear,
        FlexiComponents: this.flexiDetails,
        empToken: this.empToken? this.empToken : null,
        type:valueFlexi
      }
      this._services.postService(url, param)
        .then((data: any) => {
          console.log(data);
          // this.getFlexiDetails();
          this.spinnerService.hide();
          this.showMessageModal();
        }, err => {
          console.log(err);
          this.spinnerService.hide();
        });
    })
  }
  

  showSubmitFlexi(value) {
    this.showMessageFlexi=value
    $("#conformationModal").modal('show');

  }

  DeclartionAdminView(e,value) {
    this.showMessageFlexi=value;
    if(value == 'Admin'){
      $("#conformationModal2").modal('show');
      return false;
    }
    else if(value == 'Employee'){
      $("#conformationModal1").modal('show');

    }
    if(value == 'changeView'){
      this.route1.navigate(['mfss/admin-flexi'], );
    }
    else if(value == 'changeViewAdmin'){
      window.location.reload();
    }
  }

  showMessageModal() {
    $("#messageModal").modal('show');
  }

  openRejectionModal(remarks) {
    this.adminRemarks = remarks;
    $('#rejectionModal').modal('show');
  }

  openDescriptionModal(remarks) {
    console.dir(remarks);
    this.description = remarks.Description;
    $('#DescriptionModal').modal('show');
  }
  getFlexiPayBalance() {
    this.flexiDetails.forEach((el) => {
      if (el.FlexiId == 9) {
        this.FlexiPay = el.DeclaredAmount;
        el.DeclaredAmount=0;
      } else if (el.FlexiId == 10) {
        this.BalanceFlexi = el.DeclaredAmount
      }
    });
    console.log('flexipay', this.FlexiPay);
    console.log('balanceflexi', this.BalanceFlexi);
  }

  calculateFlexiDeclaration(limit, i) {
    var balance=this.BalanceFlexi;
    this.DeclaredAmount = 0;
    this.flexiDetails.forEach((el) => {
      if (el.FlexiId !== 9 && el.FlexiId !== 10) {
        if(el.DeclaredAmount == null){
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
    if(i == 4){
      if(balance>=1200){
       // this.flexiDetails[i].DeclaredAmount=1200
        $('#selectCEA').val(this.flexiDetails[i].DeclaredAmount);
        //this.BalanceFlexi=balance-this.flexiDetails[i].DeclaredAmount;  
        this.BalanceFlexi=this.FlexiPay - this.DeclaredAmount;
        if(this.flexiDetails[i].DeclaredAmount>1200 && this.flexiDetails[i].DeclaredAmount<2400){
          this.BalanceFlexi=this.BalanceFlexi+this.flexiDetails[i].DeclaredAmount;
          this.DeclaredAmount= this.DeclaredAmount-this.flexiDetails[i].DeclaredAmount;
          this.flexiDetails[i].DeclaredAmount=0;
          $('#selectCEA').val('0'); 
        }
      }else{
        $('#selectCEA').val('0'); 
       // if(balance<0){
          this.BalanceFlexi=this.flexiDetails[i].DeclaredAmount-(this.BalanceFlexi*-1);
          this.DeclaredAmount= this.DeclaredAmount-this.flexiDetails[i].DeclaredAmount;
          this.flexiDetails[i].DeclaredAmount=0;
      //  }else{
      //    this.flexiDetails[i].DeclaredAmount=0;
          //this.BalanceFlexi = this.FlexiPay - this.DeclaredAmount;
          //this.BalanceFlexi=balance;
        //  return false;
      //  } 
      }
      
    }
    setTimeout(() => {

    }, 100);
  }

  getFiscalYear(){
    return moment().get('month')>2 ? moment().get('year')+1 : moment().get('year');
  }
}
