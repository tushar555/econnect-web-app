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
  GradeAllowed:object;
  Remarks: string;
  RuleId:number;
}

@Component({
  selector: 'app-admin-employee-configExclude',
  templateUrl: './admin-employeeFlexi-configExclude.component.html',
  styleUrls: ['./admin-employeeFlexi-configExclude.component.scss']
})

export class AdminEmployeeFlexiConfigExcludeComponent implements OnInit {
  flexiDetails: FlexiDetailstest[] = [];
  FlexiPay: number;
  BalanceFlexi: number;
  DeclaredAmount: number;
  FlexiYear: number;
  actionType: any;
  offlineObj: any;
  dropdownListEmp:any;
  dropdownListComp:any;
  complength:any;
  adminRemarks: string = '';
  selectedDate: {start:  Date, end: Date};
  selectedItemsEmp: any;
  selectedItemsComp:any;
  selectedItemsGrade:any;
  adminRemark;
  smallLoader:any;
  dataComp: any;
  dropdownListGrade: any;
  sendCompName: any;
  sendGradeName: any;
  sendEmpName:any;
  getDate: any;
  complengthEmp: any;
  complengthGrade: any;
  getListData: any;
  RuleId: any;
  dateRangeMinDate: any;
 // [key:string]:any;

  constructor(public spinnerService: Ng4LoadingSpinnerService,private route1:Router, public route: ActivatedRoute, public local: LocalStorageService, private _services: CommonService) {
    this.FlexiYear = parseInt(moment().format('YYYY'));

    let sDate = new Date();
    let eDate = new Date();
    this.selectedDate={start:  sDate, end: eDate};
    this.dateRangeMinDate = moment(new Date()).format('YYYY-MM-DD');
    console.dir(moment(new Date()).format('YYYY-MM-DD'));
    this.dataComp=true;
    this.selectedItemsEmp=[];
    this.selectedItemsComp=[];
    this.selectedItemsGrade=[];
    this.getListData;
    this.route.queryParams.subscribe((dt: any)=>{
      this.getListData=dt;
       console.dir(dt);
    });
  }

  dropdownList = [];
  selectedItems = [];
  dropdownSettingsEmp = {};
  dropdownSettingsComp={};
  dropdownSettingsGrade={};
  ngOnInit() {
    this.getFlexiDetails();


    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' },
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [];
    
    this.dropdownListComp = [
      { CompanyCode: 0, CompanyName: 'No data Available' },
    ];

    // this.dropdownListGrade = [
    //   { GradeLevel: 0, Prefix: 'No data Available' },
    // ];

    // this.dropdownListEmp=[
    //   "No data Present",
    //   ];

    // this.selectedItemsComp=[];
    this.dropdownSettingsEmp = {
      singleSelection: false,
      idField: 'EmployeeIdExclude',
      textField: 'EmployeeIdExclude',
      selectAllText: 'Select All',
      searchPlaceholderText:'search Emp code',
      noDataAvailablePlaceholderText:'select grade',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 100,
      allowSearchFilter: true
    };
    this.dropdownSettingsComp = {
      singleSelection: false,
      idField: 'CompanyCode',
      textField: 'CompanyName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 100,
      allowSearchFilter: true
    };
    this.dropdownSettingsGrade = {
      singleSelection: false,
      idField: 'Prefix',
      textField: 'Prefix',
      disabled:true,
      noDataAvailablePlaceholderText:'select company',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 100,
      allowSearchFilter: true
    };
  }
  onItemSelectEmp(item: any) {
    console.log(item);
    console.dir(this.selectedItemsEmp);
    if(this.selectedItemsEmp.length == this.complengthEmp){
      return false;
    }

    var data='';
    for(let i=0;i<this.selectedItemsEmp.length;i++){
        if(data !== ''){
          data=data+','+(this.selectedItemsEmp[i])
        }else{
          data=(this.selectedItemsEmp[i])
        }
       // data.push({'CompanyCode':this.selectedItemsComp[i].CompanyCode});
    }
    this.sendEmpName=data;
    console.dir(this.sendEmpName);
    this.complengthEmp=this.selectedItemsEmp.length;
    //this.getEmpName(data);
  }

  onItemSelectComp(GradeCache){
    if(this.selectedItemsComp.length == this.complength){
      return false;
    }
    if(GradeCache !== 'showCacheGrade'){
      this.selectedItemsGrade=[];
      this.dropdownListEmp=[];
      this.selectedItemsEmp=[];
    }
      console.dir(this.flexiDetails)
      var data='';
      for(let i=0;i<this.selectedItemsComp.length;i++){
          if(data !== ''){
            data=data+','+(this.selectedItemsComp[i].CompanyCode)
          }else{
            data=(this.selectedItemsComp[i].CompanyCode)
          }
         // data.push({'CompanyCode':this.selectedItemsComp[i].CompanyCode});
      }
      this.complength=this.selectedItemsComp.length;
      this.sendCompName=data
      this.getCompanyGradeName(data);
      console.dir(data);
  }
  onItemSelectGrade(GradeCache){
    console.dir(this.selectedItemsGrade);
    console.dir(this.flexiDetails);
    if(this.selectedItemsGrade.length == this.complengthGrade){
      return false;
    }

    if(GradeCache !== 'showCacheGrade'){
      this.dropdownListEmp=[];
      this.selectedItemsEmp=[];
    }
    var data='';
    for(let i=0;i<this.selectedItemsGrade.length;i++){
        if(data !== ''){

          data=data+','+(this.selectedItemsGrade[i])
        }else{
          data=(this.selectedItemsGrade[i])
        }
       // data.push({'CompanyCode':this.selectedItemsComp[i].CompanyCode});
    }
    this.sendGradeName=data;
    this.complengthGrade=this.selectedItemsGrade.length;
    if(this.sendGradeName.length>0){
      this.dropdownListEmp=[{'id':12}];
    }else{
      this.dropdownListEmp=[];
    }

    console.dir(this.sendGradeName);
  }
  onItemSelectGradeLoad(ShowCache){
    console.dir(this.selectedItemsGrade)
    var data='';
    for(let i=0;i<this.selectedItemsGrade.length;i++){
        if(data !== ''){

         data=data+','+(this.selectedItemsGrade[i].Prefix)
        }else{
          data=(this.selectedItemsGrade[i].Prefix)
        }
       // data.push({'CompanyCode':this.selectedItemsComp[i].CompanyCode});
    }
    this.sendGradeName=data;
    this.complengthGrade=this.selectedItemsGrade.length;
    if(this.sendGradeName.length>0){
      this.dropdownListEmp=[{'id':12}];
    }else{
      this.dropdownListEmp=[];
    }
    console.dir(this.sendGradeName);
  }


  onSelectAll(items: any) {
    console.log(items);
  }

  onDropdownClose(){
    console.dir( this.selectedItemsEmp);
  }


  
  // getStateTest(param){
  //   this.smallLoader=true;

  //   console.dir(param);
  //   this._services.getService('http://108.210.133.21/core/api/List/StateDescription/'+param)
  //   .then((data: any) => {
  //     this.smallLoader=false;

  //     if(data.length == 0){
  //       this.dropdownListEmp =[];
  //     }else{
  //       this.dropdownListEmp = data;
  //     }
  //     console.dir(this.dropdownListEmp);
  //   })
  // }


  getEmpName(paramEmp){
    this.smallLoader=true;
    this._services.getUserDetail().then((data: any) => {
      let url = Constant.GetFlexiComponentsEmpName;
      let param = JSON.stringify({
        tokenid: data.TokenId,
        CompanyID:this.sendCompName,
        Grades: this.sendGradeName,
        EmployeeIdExclude:paramEmp
       // action: 'all'
      });
      console.dir(param);
      this._services.postService(url, param,false)
        .then((data: any) => {
          this.spinnerService.hide();
          this.smallLoader=false;
          if(data.EmployeeIdExclude.length == 0){
            this.dropdownListEmp=[{'id':12}];
          }else{
            this.dropdownListEmp = data.EmployeeIdExclude;
          }
          console.dir(this.dropdownListEmp);

        },(error) => {
          this.spinnerService.hide();
          this.smallLoader=false;

        });
    });
    console.dir(paramEmp);
    // this._services.getService('http://108.210.133.21/core/api/List/StateDescription/'+paramEmp)
    // .then((data: any) => {
    //   this.smallLoader=false;

    //   if(data.length == 0){
    //     this.dropdownListEmp =['No Data Found'];
    //   }else{
    //     this.dropdownListEmp = data;
    //   }
    //   console.dir(this.dropdownListEmp);
    // })
  }

  change(date){
    this.getDate=date
    this.getDate.start=this.getDate.start._d;
    this.getDate.end=this.getDate.end._d;

  }

  getCompanyGradeName(CompName){
    
    console.dir({CompanyID:CompName});

    this._services.getUserDetail().then((data: any) => {
      // data.TokenId '23105449'
      //this.spinnerService.show();
      let url = Constant.GetFlexiComponentsGradeName;
      let param = JSON.stringify({
        tokenid: data.TokenId,
        CompanyID:CompName
      });
      console.dir(param);
      this._services.postService(url, param)
        .then((data: any) => {
         
          this.dataComp=false;
          console.dir(this.dataComp);
          this.dropdownListGrade=data.grade;
          var flags = [], output = [], l =  this.dropdownListGrade.length, i;
          for( i=0; i<l; i++) {
              if( flags[ this.dropdownListGrade[i].Prefix]) continue;
              flags[ this.dropdownListGrade[i].Prefix] = true;
              output.push( this.dropdownListGrade[i].Prefix);
          };
          this.dropdownListGrade=output;
          console.dir(this.dropdownListGrade);

          //this.dropdownListComp=data.company;
         // console.log(this.dropdownListComp);
          // this.flexiDetails = data.FlexiMappingComponents;
          // console.log(this.flexiDetails);
          // this.getFlexiPayBalance();
          // this.calculateFlexiDeclaration(0, 0);
        })
    })
   }

  
 getCompanyName(){
  this._services.getUserDetail().then((data: any) => {
    // data.TokenId '23105449'
   // this.spinnerService.show();
    let url = Constant.GetFlexiComponentsCompName;
    let param = JSON.stringify({
      tokenid: data.TokenId,
     // action: 'all'
    });
    console.dir(param);
    this._services.postService(url, param)
      .then((data: any) => {
        this.spinnerService.hide();
         

        this.dropdownListComp=data.company;
        this.complength=this.selectedItemsComp.length;
        console.log(this.selectedItemsGrade);
        // this.flexiDetails = data.FlexiMappingComponents;
        // console.log(this.flexiDetails);
        // this.getFlexiPayBalance();
        // this.calculateFlexiDeclaration(0, 0);
      })
  })
 }

  getFlexiDetails() {
  this._services.getUserDetail().then((data: any) => {
    // data.TokenId '23105449'
   // this.spinnerService.show();
    let url = Constant.GetFlexiComponentsConfig;
    let param = JSON.stringify({
      tokenid: data.TokenId,
      action: this.getListData.action,
      CompanyID :this.getListData.CompanyId,
      RuleId:this.getListData.RuleId
    });
    console.dir(param);
    this._services.postService(url, param)
      .then((data: any) => {
        this.flexiDetails = data.FlexiMappingComponents;
        this.RuleId=this.flexiDetails[0].RuleId;
        this.selectedItemsEmp=data.EmployeeIdExclude ? data.EmployeeIdExclude : [];
        data.grade=data.grade ? data.grade : [];
        //this.selectedItemsGrade=data.grade ? data.grade : [];
        // var flags = [], output = [], l =  data.grade.length, i;
        // for( i=0; i<l; i++) {
        //     if( flags[ data.grade[i].Prefix]) continue;
        //     flags[ data.grade[i].Prefix] = true;
        //     output.push( data.grade[i]);
        // };
        this.selectedItemsGrade=data.grade?data.grade: [];

        for(let i=0;i<this.flexiDetails.length;i++){
          this.flexiDetails[i].GradeAllowed=[
             "L2E",
             "L3DH",
             "L3E",
             "L4DH",
             "L5DH",
             "L10O",
          ];
           // console.dir(this.flexiDetails[i].GradeAllowed);
           // this['selectedGrade'+[i]]=this.flexiDetails[i].GradeAllowed;
            //console.dir(this['selectedGrade'+[i]]);
        }

        this.selectedItemsComp=data.company ? data.company : [];
      //  this.selectedDate=data.StartDate?{start:  new Date(data.StartDate), end: new Date(data.EndDate)}:{start:  new Date(), end: new Date()};
      //  this.getDate.end=data.EndDate;
        //this.selectedItemsEmp= [ "23212522","23212540","23221012"];
      //  this.getDate.start=data.StartDate;
        this.spinnerService.hide();
        this.getCompanyName();
        if( data.company !==undefined && data.company.length >0 ){
          //this.onItemSelectGrade('value');
          this.onItemSelectComp('showCacheGrade');
          this.onItemSelectGradeLoad('showCacheGrade');
          this.onItemSelectEmp('showCacheGrade');
        }
        console.log(this.flexiDetails);
        //this.getFlexiPayBalance();
        //this.calculateFlexiDeclaration(0, 0);
      })
  })
  }
  
  adminApproveReject() {
    console.dir(this.selectedDate);
    let url = Constant.AdminApproveRejectDeclarations;
    let actionType = 'Approved';

    this._services.getUserDetail().then((data: any) => {

      let url = Constant.GetFlexiComponentsSubmitFlexi;

      let param =JSON.stringify({ 
        tokenid: data.TokenId,
        StartDate:moment(this.getDate.start).format('YYYY-MM-DD'),
        EndDate:moment(this.getDate.end).format('YYYY-MM-DD'),
        CompanyID:this.sendCompName,
        Grades: this.sendGradeName,
        EmployeeIdExclude:this.sendEmpName,
        FlexiMappingComponents:this.flexiDetails,
        RuleId:this.RuleId
      });
      console.dir(param);
      this._services.postService(url, param,false)
        .then((data: any) => {
         
          this.dataComp=false;
          console.dir(this.dataComp);
            if(this.getListData.action=='all'){
              this._services.showSnackbar({ 'status': data });
            }else{
              this._services.showSnackbar({ 'status': data });
            }
          setTimeout(()=>{
            if(data == 'Inserted Sucessfully' || data == "Updated Sucessfully"){
              this.route1.navigate(['mfss/admin-flexi-config']);
            }

          },2000)

          //this.getFlexiDetails();
          //this.dropdownListComp=data.company;
         // console.log(this.dropdownListComp);
          // this.flexiDetails = data.FlexiMappingComponents;
          // console.log(this.flexiDetails);
          // this.getFlexiPayBalance();
          // this.calculateFlexiDeclaration(0, 0);
        })
    })



    // //console.log(params);
    // this.spinnerService.show();
    // this._services.postService(url, params).then((data) => {
    //  // console.log(data);
    //   if (data == "Success") {
    //     this.initializeSection();
    //   } else {

    //   }
    //   this.spinnerService.hide();
    // })
  }



  adminConfirmation(action, declaration){
    this.actionType = action;
    this.offlineObj = declaration;
    if(action==='approveAll'){
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
    if (amount.toString() == '' || amount==null) {
      this.flexiDetails[i].DeclaredAmount = 0;
    }
    if (limit!==null && amount > limit) {
      this.flexiDetails[i].DeclaredAmount = limit;
    }
    console.log('amount',amount, 'limit', limit);
    this.calculateFlexiDeclaration(limit, i);
  }

  submitFlexiDeclaration() {
    this._services.getUserDetail().then((data: any) => {
      // data.TokenId '23105449'
     // this.spinnerService.show();
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
  }
  adminApproveRejectAll(){

  }
}
