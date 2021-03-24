import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { LocalStorageService } from 'ngx-store';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Constant } from '../../services/constant';

import * as moment from 'moment';

declare var jquery: any;
declare var $: (arg0: string) => { (): any; new(): any; html: { (arg0: string): void; new(): any; }; modal: { (arg0: { backdrop: string; keyboard: boolean; }): void; new(): any; }; };
@Component({
  selector: 'app-income-tax-simulation',
  templateUrl: './income-tax-simulation.component.html',
  styleUrls: ['./income-tax-simulation.component.scss']
})
export class IncomeTaxSimulationComponent implements OnInit {

  @Input() schemedeclarationsList: any;
  simulatedTaxDetails: any = [];
  @Input() typeofSelection: any;
  @Output() taxEvent = new EventEmitter<any>();
  @Output() regimeSelectionEvent = new EventEmitter<any>();



  SectionSimulatedDetails: any = [];

  localUserData: any;
  BasicSalaryDetails: any=[];
  simulationComponents: any = [];
  modifiedSimulationComponents: any = [];
  selectedRegimeType: any;
  RegimeType: any;
  totalRentPaidValue: any;
  isMetroCity: any;
  employeeAge: any;
  TopUpPolicyAmount = 0;
  processing: boolean;
  constructor(private _services: CommonService,
    private _storage: LocalStorageService,
    public spinnerService: Ng4LoadingSpinnerService) { }

  async ngOnInit() {
    this.processing = true;
    this.employeeAge = this.schemedeclarationsList.Age;
    this.selectedRegimeType = this.schemedeclarationsList.selectedRegimeType;
    this.totalRentPaidValue = this.gettotalRentPaidValue();
    await this.getUserDetails();
    // this.getLogs();
      await this.getBasicSalaryDetails();

      await this.getSimulationComponent();
      await this.getmodifiedComponents();
      this.mapIncomeDetails();



    if (this.selectedRegimeType === 'new' || this.selectedRegimeType === 'old') {
      this.calculateIncomeTaxDetails();
    }
    this.processing = false;
  }

  getLogs() {
    const url = Constant.GetITCalculatorLog;
    const data = { tokenid: this.localUserData.TokenId };
    this._services.postService(url, data).then(resp => {
      //console.log(resp);
    });
  }

  gettotalRentPaidValue() {
    let TotalRentPaidValue = 0;

    const tempHRA = this.schemedeclarationsList.Schemes.find((obj: { SchemeID: number; }) => obj.SchemeID === 2).DeclarationDetails;

    if (tempHRA) {

      TotalRentPaidValue = [...tempHRA[0]].map(obj => {
        let totalRent = 0;
        const calcToDate = moment(obj.ToDate);
        const calcFromDate = moment(obj.FromDate);
        const diffMonths = Math.ceil(calcToDate.diff(calcFromDate, 'months', true));
        totalRent += diffMonths * +obj.RentPerMonth;
        this.isMetroCity = obj.IsMetroCity;
        return totalRent;
      }).reduce((sum, x) => sum + x, 0);

    }

    return TotalRentPaidValue;
  }

  async getIncomeTaxComponentDetails() {

    const url = Constant.newIncomeTax;
    const param = {
      tokenid: this.localUserData.TokenId,
      // "tokenid": this._storage.get('username').TokenId,
      fiscal_year: '2019'//this.fiscalYear
    };
    await this._services.postService(url, param).then(resp => {

      this.BasicSalaryDetails = resp;
    });
  }

  async getBasicSalaryDetails() {
    // this.BasicSalaryDetails = [];
    // return

    const url = Constant.getITCalculatorHeadsbyToken;
    const data = { tokenid: this.localUserData.TokenId };
    await this._services.postService(url, data).then(resp => {
      this.BasicSalaryDetails = resp;

      const Obj = this.BasicSalaryDetails.find((obj: { id: number; }) => obj.id === 16);
      if (Obj) {
        this.TopUpPolicyAmount = Obj.Limit;
      }
    }).catch(error=>{
      this.BasicSalaryDetails = [];
    });

  }

  async getUserDetails() {
    await this._services.getUserDetail().then(data => {
      this.localUserData = data;

    });
  }



  async getSimulationComponent() {
    const url = Constant.getITCalculator;
    const data = { tokenid: this.localUserData.TokenId };
    await this._services.postService(url, data).then((resp: any) => {

      this.simulationComponents = resp.calculatorComponents;
      this.simulatedTaxDetails = resp.taxSummary;
      this.SectionSimulatedDetails = resp.SectionSimulatedDetails || [];
    });
  }

  mapIncomeDetails() {

    this.simulationComponents.forEach((obj: any) => {
      this.patchOldNewValues(obj);
    });
  }

  async getmodifiedComponents() {

    // tslint:disable-next-line: no-shadowed-variable
    const uniqueValue = [...new Set(this.simulationComponents.map((obj: { Section: any; }) => obj.Section))];

    await uniqueValue.map((section) => {

      // tslint:disable-next-line: no-shadowed-variable
      let SectionDetails = this.simulationComponents.filter((obj: { Section: any; }) => obj.Section === section);
      if (section === '80D') {
        // tslint:disable-next-line: no-shadowed-variable
        SectionDetails = SectionDetails.filter((obj: { id: number; }) => obj.id !== 16);
      }
      this.modifiedSimulationComponents.push({ Section_Name: section, Section_Details: SectionDetails });

    });

    // tslint:disable-next-line: no-shadowed-variable
    const index = this.modifiedSimulationComponents.findIndex((obj: { Section_Name: string; }) => obj.Section_Name === '80U');
    const obj = this.modifiedSimulationComponents.splice(index, 1)[0];
    this.modifiedSimulationComponents.push(obj);

  }

  getAmount(amount: number) {
    return Math.round(amount);
  }

  patchOldNewValues(obj: { id: any; Old_Amount: number; New_Amount: number; }) {

    switch (obj.id) {

      case 1:
        let old1 = this.BasicSalaryDetails.find((obj: { id: number; }) => obj.id === 5) || { Limit: 0 };
        let new1 = this.BasicSalaryDetails.find((obj: { id: number; }) => obj.id === 5) || { Limit: 0 }
        obj.Old_Amount = old1.Limit; //.Income_From_Salary;
        obj.New_Amount = new1.Limit;
        break;
      case 2:
        let IncomeAmount = 0;
        const tmp = this.BasicSalaryDetails.find(obj => obj.id === 2);
        if (tmp) {
          IncomeAmount = tmp.Limit;
        }

        const IncomeLossSection = this.getSectionValues(6, 9);
        let IncomelossAmount = 0;
        if (IncomeLossSection < 0) {
          let sum = 0;
          const Scheme6Details = this.schemedeclarationsList.Schemes.find(obj => obj.SchemeID === 6).DeclarationDetails;
          if (Scheme6Details) {

            Scheme6Details[0].forEach(key => {

              if (key.Type === 'letout_property') {
                sum += key.RentReceivedAnnually;
              }
            });
          }
          IncomelossAmount += sum;
        }

        obj.Old_Amount = this.getSectionValues(7, 2) + IncomeAmount;
        obj.New_Amount = this.getSectionValues(7, 2) + IncomeAmount + IncomelossAmount;
        break;
      // case 3:
      //   obj.Old_Amount = this.selectedRegimeType === null ? this.schemedeclarationsList.Schemes.find(obj => obj.Section === '80TTA').Amount :
      //     this.SectionSimulatedDetails.find(obj => obj.id === 3).Old_Amount;
      //   obj.New_Amount = 0;
      //   break;
      case 4:
        obj.Old_Amount = 0;
        obj.New_Amount = 0;
        break;
      case 5:

        obj.Old_Amount = this.simulationComponents.
          filter((obj: { Section: string; id: number; }) => obj.Section === 'Income' && obj.id !== 5)
          .reduce((n: any, x: { Old_Amount: any; }) => n + x.Old_Amount, 0);
        obj.New_Amount = this.simulationComponents
          .filter((obj: { Section: string; id: number; }) => obj.Section === 'Income' && obj.id !== 5)
          .reduce((n: any, x: { New_Amount: any; }) => n + x.New_Amount, 0);
        break;
      case 6:
        obj.Old_Amount = 50000; //this.BasicSalaryDetails.Std_Deduction;
        obj.New_Amount = 0;
        break;
      case 7:
        obj.Old_Amount = 2500; //this.BasicSalaryDetails.Profession_Tax;
        obj.New_Amount = 0;
        break;
      case 8:
        let old2 = this.BasicSalaryDetails.find((obj: { id: number; }) => obj.id === 8) || { Limit: 0 }
        obj.Old_Amount = old2.Limit; //this.BasicSalaryDetails.Child_Education;
        obj.New_Amount = 0;
        break;
      case 9:
        const tempValue = this.getSectionValues(6, 9);
        // if (tempValue < 0) {
        //   const Obj = this.simulationComponents.find(obj => obj.id === 2);
        //   Obj.Old_Amount = Math.abs(tempValue);
        //   tempValue = 0;
        // }

        obj.Old_Amount = tempValue //tempValue < 0 ? 0 : tempValue; // this.schemedeclarationsList.Schemes.find(obj => obj.SchemeID === 6).Amount;
        obj.New_Amount = 0;
        break;
      case 10:

        let actualHRAReceived = 0;
        let basicSalary = 0;
        const hraObj = this.BasicSalaryDetails.find((obj: { id: number; }) => obj.id === 10);
        const basicSalaryObj = this.BasicSalaryDetails.find((obj: { id: number; }) => obj.id === 1);
        if (hraObj) {
          actualHRAReceived = hraObj.Limit;
        }
        if (basicSalaryObj) {
          basicSalary = basicSalaryObj.Limit;
        }

        const temp = this.totalRentPaidValue - (basicSalary * 0.10);
        const lessbasic10 = temp <= 0 ? 0 : temp;
        const basicMetro = this.isMetroCity ? basicSalary * 0.50 : basicSalary * 0.40;
        const HRAallowed = Math.min(lessbasic10, basicMetro, actualHRAReceived);
        const hraOld = this.SectionSimulatedDetails.find((obj: { id: number; }) => obj.id === 10);
        obj.Old_Amount = this.selectedRegimeType === null ? HRAallowed :(hraOld?hraOld.Old_Amount:0);
        obj.New_Amount = 0;
        break;
      case 11:
        let old3 = this.BasicSalaryDetails.find((obj: { id: number; }) => obj.id === 11) || { Limit: 0 };
        obj.Old_Amount = old3.Limit; //this.BasicSalaryDetails.Provident_Fund_Emp;
        obj.New_Amount = 0;
        break;
      case 12:
        obj.Old_Amount = this.get80CValue();
        obj.New_Amount = 0;
        break;
      case 13:
        let NpsEmpoyerAmount = 0;
        if (this.localUserData.CompanyName !== 'MIBL') {
          const Temp = this.BasicSalaryDetails.find((obj: { id: number; }) => obj.id === 14);
          NpsEmpoyerAmount = Temp ? Temp.Limit : 0;
        }

        obj.Old_Amount = NpsEmpoyerAmount; //this.BasicSalaryDetails.Nps_Employer;
        obj.New_Amount = NpsEmpoyerAmount; //this.BasicSalaryDetails.Nps_Employer;
        break;
      case 14:
        let NPSAmount = 0;
        if (this.localUserData.CompanyName === 'MIBL') {
          const temp = this.BasicSalaryDetails.find((obj: { id: number; }) => obj.id === 14);
          NPSAmount = this.getSectionValues(19, 14) + (temp ? temp.Limit : 0);
        } else {
          NPSAmount = this.getSectionValues(19, 14);
        }
        obj.Old_Amount = NPSAmount > 50000 ? 50000 : NPSAmount;
        obj.New_Amount = 0;
        break;
      case 15:
        const subSectiondetails6 = this.getsubSectionDetails('80D', 15);
        let TotalAmount = 0;
        const ConsiderPreventiveValue: { Self: number, Parent: number } = { Self: 0, Parent: 0 };
        let SelfNonSenior: number = 0;
        let ParentNonSenior: number = 0;
        let ParentSenior: number = 0;
        let SelfSenior: number = 0;
        let total: number = 0
        // let TopUpPolicy = 0;
        // const topupObj = this.BasicSalaryDetails.find(obj => obj.id === 16);
        // if (topupObj) {
        //   TopUpPolicy = topupObj.Limit;
        // }

        if (this.selectedRegimeType === null) {

          const ActualPreventiveValueSelf = subSectiondetails6.find((ele: { SchemeID: number; }) => ele.SchemeID === 12).Amount;
          const ActualPreventiveValueParent = subSectiondetails6.find((ele: { SchemeID: number; }) => ele.SchemeID === 13).Amount;
          ConsiderPreventiveValue.Parent = ActualPreventiveValueParent > 5000 ? 5000 : ActualPreventiveValueParent;
          ConsiderPreventiveValue.Self = ActualPreventiveValueSelf > 5000 ? 5000 : ActualPreventiveValueSelf;

          // ConsiderPreventiveValue.Parent +

          const parentSeniorAmount = subSectiondetails6.find((obj1: { SchemeID: number; }) => obj1.SchemeID === 11).Amount;
          ParentSenior = parentSeniorAmount === 0 ? 0 : parentSeniorAmount >= 50000 ? 50000 :
            parentSeniorAmount >= 50000 ? 50000 : parentSeniorAmount;

          if (this.employeeAge < 60) {
            const selfNonAmount = subSectiondetails6.find((obj1: { SchemeID: number; }) => obj1.SchemeID === 8).Amount;

            SelfNonSenior = selfNonAmount >= 25000 ? 25000 : (selfNonAmount + this.TopUpPolicyAmount + ConsiderPreventiveValue.Self)
              >= 25000 ? 25000 : (ConsiderPreventiveValue.Self + selfNonAmount + this.TopUpPolicyAmount);

            const parentNonAmount = subSectiondetails6.find((obj1: { SchemeID: number; }) => obj1.SchemeID === 10).Amount;
            ParentNonSenior = parentNonAmount === 0 ? 0 : parentNonAmount >= 25000 ? 25000 :
              parentNonAmount >= 25000 ? 25000 : parentNonAmount;

            // const parentSeniorAmount = subSectiondetails6.find((obj1: { SchemeID: number; }) => obj1.SchemeID === 11).Amount;
            // ParentSenior = parentSeniorAmount === 0 ? 0 : parentSeniorAmount >= 50000 ? 50000 :
            //                ConsiderPreventiveValue.Parent + parentSeniorAmount >= 50000 ? 50000:
            //                ConsiderPreventiveValue.Parent + parentSeniorAmount;
            if (ConsiderPreventiveValue.Self !== 0) {
              ConsiderPreventiveValue.Parent = 5000 - ConsiderPreventiveValue.Self <= 0 ? 0 : 5000 - ConsiderPreventiveValue.Self;
            }

            if (ParentSenior !== 0) {
              total = ParentSenior + ParentNonSenior + ConsiderPreventiveValue.Parent < 50000 ? ParentSenior + ParentNonSenior + ConsiderPreventiveValue.Parent : 50000;
              TotalAmount = total + SelfNonSenior < 75000 ? total + SelfNonSenior : 75000;

            } else {
              ParentNonSenior = ParentNonSenior + ConsiderPreventiveValue.Parent;
              TotalAmount = SelfNonSenior + ParentNonSenior < 50000 ? SelfNonSenior + ParentNonSenior : 50000
              // TotalAmount = NonSenior + ParentSenior < 75000 ?
              //   NonSenior + ParentSenior : 75000;
            }


          } else if (this.employeeAge >= 60) {
            const selfSeniorAmount = subSectiondetails6.find((obj1: { SchemeID: number; }) => obj1.SchemeID === 9).Amount;
            SelfSenior = selfSeniorAmount === 0 ? 0 : selfSeniorAmount >= 50000 ? 50000 :
              ConsiderPreventiveValue.Self + selfSeniorAmount + this.TopUpPolicyAmount > 50000 ? 50000 :
                ConsiderPreventiveValue.Self + selfSeniorAmount + this.TopUpPolicyAmount;

            // const parentSeniorAmount = subSectiondetails6.find((obj1: { SchemeID: number; }) => obj1.SchemeID === 11).Amount;
            // ParentSenior = parentSeniorAmount === 0 ? 0 : parentSeniorAmount >= 50000 ? 50000 :
            //   ConsiderPreventiveValue.Parent + parentSeniorAmount >= 50000 ? 50000 :
            //     ConsiderPreventiveValue.Parent + parentSeniorAmount;
            if (ConsiderPreventiveValue.Self !== 0) {
              ConsiderPreventiveValue.Parent = 5000 - ConsiderPreventiveValue.Self <= 0 ? 0 : 5000 - ConsiderPreventiveValue.Self;
            }

            ParentSenior = ParentSenior + ConsiderPreventiveValue.Parent;
            TotalAmount = SelfSenior + ParentSenior < 100000 ? (SelfSenior + ParentSenior) : 100000;
          }

          // TotalAmount = ParentSenior + ParentNonSenior + SelfSenior + SelfNonSenior;
        } else {
          TotalAmount = subSectiondetails6;
        }
        obj.Old_Amount = TotalAmount;
        obj.New_Amount = 0;
        break;

      // case 16:
      //   const topAmount = this.BasicSalaryDetails.find(obj => obj.id === 16)
      //   obj.Old_Amount = topAmount ? topAmount.Limit : 0;
      //   obj.New_Amount = 0;
      //   break;
      // case 17:
      //   obj.Old_Amount = 0;
      //   obj.New_Amount = 0;
      //   break;
      case 18:
        const subSectiondetails = this.getsubSectionDetails('80DD', 18);
        let TotalAmount4 = subSectiondetails;
        if (this.selectedRegimeType === null) {
          const nonSevereAmount = subSectiondetails[0].Amount > 75000 ? 75000 : subSectiondetails[0].Amount;
          const SevereAmount = subSectiondetails[1].Amount > 125000 ? 125000 : subSectiondetails[1].Amount;
          TotalAmount4 = nonSevereAmount + SevereAmount;
        }
        obj.Old_Amount = TotalAmount4;
        obj.New_Amount = 0;
        break;
      case 19:
        const subSectiondetails1 = this.getsubSectionDetails('80DDB', 19);
        let TotalAmount3 = subSectiondetails1;
        if (this.selectedRegimeType === null) {
          const seniorAmount = subSectiondetails1[0].Amount > 100000 ? 100000 : subSectiondetails1[0].Amount;
          const nonSeniorAmount = subSectiondetails1[1].Amount > 40000 ? 40000 : subSectiondetails1[1].Amount;
          TotalAmount3 = seniorAmount + nonSeniorAmount;
        }

        obj.Old_Amount = TotalAmount3;
        obj.New_Amount = 0;
        break;
      case 20:
        const subSectiondetails2 = this.getsubSectionDetails('80E', 20);
        obj.Old_Amount = this.selectedRegimeType === null ? subSectiondetails2[0].Amount : subSectiondetails2;
        obj.New_Amount = 0;
        break;
      case 21:
        // const subSectiondetails3 = this.getsubSectionDetails('80EE', 21);
        // obj.Old_Amount = this.selectedRegimeType === null ? subSectiondetails3[0].Amount > 50000 ? 50000
        //   : subSectiondetails3[0].Amount : subSectiondetails3;
        obj.Old_Amount = 0;
        obj.New_Amount = 0;
        break;
      case 22:
        const subSectiondetails3 = this.getsubSectionDetails('80EEA', 22);
        obj.Old_Amount = this.selectedRegimeType === null ? (subSectiondetails3[0] || { Amount: 0 }).Amount > 150000 ? 150000
          : (subSectiondetails3[0] || { Amount: 0 }).Amount : subSectiondetails3;
        obj.New_Amount = 0;
        break;
      case 23:
        obj.Old_Amount = 0;
        obj.New_Amount = 0;
        break;
      case 24:
        const subSectiondetails4 = this.getsubSectionDetails('80TTA', 24);
        obj.Old_Amount = this.selectedRegimeType === null ? subSectiondetails4[0].Amount > 10000 ? 10000
          : subSectiondetails4[0].Amount : subSectiondetails4;
        obj.New_Amount = 0;
        break;
      case 34:
        const subSectiondetails7 = this.getsubSectionDetails('80TTB', 34);
        obj.Old_Amount = this.selectedRegimeType === null ? subSectiondetails7[0].Amount > 50000 ? 50000
          : subSectiondetails7[0].Amount : subSectiondetails7;
        obj.New_Amount = 0;
        break;
      case 25:
        const subSectiondetails5 = this.getsubSectionDetails('80U', 25);
        let TotalAmount1 = subSectiondetails5;
        if (this.selectedRegimeType === null) {
          const nonSevereAmount1 = subSectiondetails5[0].Amount > 75000 ? 75000 : subSectiondetails5[0].Amount;
          const SevereAmount1 = subSectiondetails5[1].Amount > 125000 ? 125000 : subSectiondetails5[1].Amount;
          TotalAmount1 = nonSevereAmount1 + SevereAmount1;
        }


        obj.Old_Amount = TotalAmount1;
        obj.New_Amount = 0;
        break;

    }
  }

  getsubSectionDetails(sectionName: string, caseID: number) {

    if (this.selectedRegimeType === null) {

      return this.schemedeclarationsList.Schemes.filter((obj: { Section: any; }) => obj.Section === sectionName);
    }
    const amount = this.SectionSimulatedDetails.find((obj: { id: any; }) => obj.id === caseID);
    return amount ? amount.Old_Amount :0;
  }


  getSectionValues(SchemeID: number, caseID: number) {

    if (this.selectedRegimeType !== null) {
      const details = this.SectionSimulatedDetails.find((obj: { id: any; }) => obj.id === caseID);
      return details ? details.Old_Amount: 0;
    }

    return this.schemedeclarationsList.Schemes.find((obj: { SchemeID: any; }) => obj.SchemeID === SchemeID).Amount;
  }

  get80CValue() {

    if (this.selectedRegimeType === null) {
      const eightyCDetails = this.schemedeclarationsList.Schemes.filter((obj: { Section: string; SchemeID: number; }) => obj.Section === '80C' && obj.SchemeID !== 19);
      const total = eightyCDetails.reduce((n: any, x: any) => n + x.Amount, 0);
      return total > 150000 ? 150000 : total;
    }
    const details = this.SectionSimulatedDetails.find((obj: { id: number; }) => obj.id === 12);
    return details ? details.Old_Amount:0;

  }

  calculateIncomeTaxDetails() {

    this.simulatedTaxDetails.forEach((obj: { id: any; Old_Amount: number; New_Amount: number; }) => {
      switch (obj.id) {
        case 26:
          const simulatedComp = [this.simulationComponents.filter((obj: { Section: string; id: number; }) => obj.Section !== 'Income' && obj.id !== 11 && obj.id !== 12)];
          let section24Amount = this.simulationComponents.find(obj => obj.id === 9).Old_Amount;
          if (section24Amount > 0) {
            section24Amount = 0;
          }
          const eightyCAmount = this.simulationComponents.filter((obj: { id: number; }) => obj.id == 11 || obj.id == 12)
            .map((innerobj: { Old_Amount: any; }) => innerobj.Old_Amount).reduce((sum: any, x: any) => (sum + x), 0);
          const newValue = eightyCAmount < 150000 ? eightyCAmount : 150000;
          obj.Old_Amount = simulatedComp[0].map((obj: { Old_Amount: number; }) => {

            return obj.Old_Amount < 0 ? 0 : obj.Old_Amount;
          }).reduce((sum: any, x: any) => sum + x, 0) + newValue + section24Amount;
          obj.New_Amount = simulatedComp[0].map((obj: { New_Amount: any; }) => obj.New_Amount).reduce((sum: any, x: any) => sum + x, 0);

          break;
        case 27:

          const grossSalary = this.simulationComponents.find((obj: { id: number; }) => obj.id === 5);
          const totalDeductions = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id === 26);
          const temp1 = grossSalary.Old_Amount - totalDeductions.Old_Amount;
          const temp2 = grossSalary.New_Amount - totalDeductions.New_Amount;
          obj.Old_Amount = temp1 < 0 ? 0 : temp1;
          obj.New_Amount = temp2 < 0 ? 0 : temp2;

          break;
        case 28:

          // tslint:disable-next-line: no-shadowed-variable
          const taxableIncome = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id === 27);
          const oldTaxableIncome = taxableIncome.Old_Amount;
          const newTaxableIncome = taxableIncome.New_Amount;
          obj.Old_Amount = this.getIncomeTaxAmount('old', oldTaxableIncome);
          obj.New_Amount = this.getIncomeTaxAmount('new', newTaxableIncome);

          break;
        case 29:
          // tslint:disable-next-line: no-shadowed-variable
          const taxableSalary = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id === 27);

          let OldrebateAmount = 0;
          let NewrebateAmount = 0;
          if (taxableSalary.Old_Amount > 0 && taxableSalary.Old_Amount <= 500000) {
            OldrebateAmount = 12500;
          }
          if (taxableSalary.New_Amount > 0 && taxableSalary.New_Amount <= 500000) {
            NewrebateAmount = 12500;
          }
          obj.Old_Amount = OldrebateAmount;
          obj.New_Amount = NewrebateAmount;
          break;
        case 30:

          // tslint:disable-next-line: no-shadowed-variable
          const rebate = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id === 29);
          // tslint:disable-next-line: no-shadowed-variable
          const tax = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id === 28);
          const Old_rebate = tax.Old_Amount - rebate.Old_Amount;
          const New_rebate = tax.New_Amount - rebate.New_Amount;
          obj.Old_Amount = Old_rebate < 0 ? 0 : Old_rebate;
          obj.New_Amount = New_rebate < 0 ? 0 : New_rebate;
          break;
        case 31:
          // tslint:disable-next-line: no-shadowed-variable
          const taxable = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id === 27);
          // tslint:disable-next-line: no-shadowed-variable
          const Totaltax = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id === 28);
          obj.Old_Amount = this.getSurcharge(taxable.Old_Amount, Totaltax.Old_Amount);
          obj.New_Amount = this.getSurcharge(taxable.New_Amount, Totaltax.New_Amount);
          break;
        case 32:
          const TaxAfterRebate = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id === 30);
          const Surcharge = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id === 31);
          obj.Old_Amount = (TaxAfterRebate.Old_Amount + Surcharge.Old_Amount) * 0.04;
          obj.New_Amount = (TaxAfterRebate.New_Amount + Surcharge.New_Amount) * 0.04;
          break;
        case 33:
          obj.Old_Amount = this.simulatedTaxDetails.filter((obj: { id: number; }) => (obj.id === 30 || obj.id === 31 || obj.id === 32)).reduce((sum: any, obj: { Old_Amount: any; }) => sum + obj.Old_Amount, 0);
          obj.New_Amount = this.simulatedTaxDetails.filter((obj: { id: number; }) => (obj.id === 30 || obj.id === 31 || obj.id === 32)).reduce((sum: any, obj: { New_Amount: any; }) => sum + obj.New_Amount, 0);

          break;
      }
    });
    const Obj = this.simulationComponents.find((obj: { id: number; }) => obj.id == 5);
    const Obj1 = this.simulatedTaxDetails.find((obj: { id: number; }) => obj.id == 5);

    if (Obj && !Obj1) {
      this.simulatedTaxDetails.unshift(Obj);
    }


    this.taxEvent.emit({ calculatorComponents: this.simulationComponents, taxSummary: this.simulatedTaxDetails });
  }

  getIncomeTaxAmount(taxSlab: string, taxableIncome: number) {

    let calculatedTax = 0;

    if (taxSlab === 'old') {
      if (this.employeeAge < 60) {
        if (taxableIncome > 250000) {
          calculatedTax += (taxableIncome > 250000 && taxableIncome < 500000) ? (taxableIncome - 250000) * 0.05 : taxableIncome > 500000 ? (500000 - 250000) * 0.05 : 0;
          calculatedTax += (taxableIncome > 500000 && taxableIncome < 1000000) ? (taxableIncome - 500000) * 0.20 : taxableIncome > 1000000 ? (1000000 - 500000) * 0.20 : 0;
          calculatedTax += (taxableIncome > 1000000) ? (taxableIncome - 1000000) * 0.30 : 0;
        }
      } else if (this.employeeAge >= 60) {
        if (taxableIncome > 300000) {

          calculatedTax += (taxableIncome > 300000 && taxableIncome < 500000) ? (taxableIncome - 300000) * 0.05 :
            taxableIncome > 500000 ? (500000 - 300000) * 0.05 : 0;
          calculatedTax += (taxableIncome > 500000 && taxableIncome < 1000000) ? (taxableIncome - 500000) * 0.20 :
            taxableIncome > 1000000 ? (1000000 - 500000) * 0.20 : 0;
          calculatedTax += (taxableIncome > 1000000) ? (taxableIncome - 1000000) * 0.30 : 0;
        }
      }


      return calculatedTax;
    } else if (taxSlab === 'new') {

      if (taxableIncome > 250000) {

        calculatedTax += (taxableIncome > 250000 && taxableIncome < 500000) ? (taxableIncome - 250000) * 0.05 :
          taxableIncome > 500000 ? (500000 - 250000) * 0.05 : 0;
        calculatedTax += (taxableIncome > 500000 && taxableIncome < 750000) ? (taxableIncome - 500000) * 0.10 :
          taxableIncome > 750000 ? (750000 - 500000) * 0.10 : 0;
        calculatedTax += (taxableIncome > 750000 && taxableIncome < 1000000) ? (taxableIncome - 750000) * 0.15 :
          taxableIncome > 1000000 ? (1000000 - 750000) * 0.15 : 0;
        calculatedTax += (taxableIncome > 1000000 && taxableIncome < 1250000) ? (taxableIncome - 1000000) * 0.20 :
          taxableIncome > 1250000 ? (1250000 - 1000000) * 0.20 : 0;
        calculatedTax += (taxableIncome > 1250000 && taxableIncome < 1500000) ? (taxableIncome - 1250000) * 0.25 :
          (taxableIncome > 1500000) ? (1500000 - 1250000) * 0.25 : 0;
        calculatedTax += (taxableIncome > 1500000) ? (taxableIncome - 1500000) * 0.30 : 0;
      }
      return calculatedTax;
    }





  }

  getSurcharge(taxableIncome: number, Totaltax: number) {

    let Surcharge = 0;

    if (taxableIncome <= 5000000) {
      Surcharge = 0;
    } else if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
      Surcharge = Totaltax * 0.10;
    } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
      Surcharge = Totaltax * 0.15;
    } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
      Surcharge = Totaltax * 0.25;
    } else if (taxableIncome > 50000000) {
      Surcharge = Totaltax * 0.37;
    }
    return Surcharge;

  }

  isNumber(evt: any, obj: any) {
    evt = evt ? evt : window.event;
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  onInFocus(Amount: string | number) {
    if (Amount === 0 || Amount === '0') {
      Amount = '';
    }
  }

  setSelectedRegimeType(type: string, selection: string) {
    if (selection === 'confirmation') {
      this.RegimeType = type;
      const modalBody = `<p> Do you want to opt for ${type.toUpperCase()} tax regime ?
                            </p>`;
      $('#modal-body1').html(modalBody);
      $('#successModal').modal({
        backdrop: 'static',
        keyboard: false
      });

      return false;

    } else {

      const param = {
        tokenid: this.localUserData.TokenId,
        tokenidTobeModify: this.localUserData.TokenId,
        selectedRegimeType: this.RegimeType
      };
      const url = Constant.UpdateITRegimeType;
      this.spinnerService.show();
      this._services.postService(url, param).then((resp: any) => {
        if (resp.toLowerCase() === 'success') {
          this.regimeSelectionEvent.emit();
        }
        this.spinnerService.hide();
      });
    }


  }

  saveAmount(subScheme?: any, flag?: any) {

  }
}
