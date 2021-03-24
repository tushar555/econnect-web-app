import { Component, OnInit } from "@angular/core";
import { Constant } from "../../services/constant";
import * as moment from "moment";
import { CommonService } from "../../services/common.service";
import { CommonArray } from "../../services/commonArray";
import { LocalStorageService } from "ngx-store";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Router, NavigationExtras } from "@angular/router";
import { a } from "@angular/core/src/render3";

declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-admin-income-tax",
  templateUrl: "./admin-flexi.component.html",
  styleUrls: ["./admin-flexi.component.scss"]
})
export class AdminFlexiComponent {
  localUserData: any;
  public employeeRecords: any;
  searchItem: any;
  flag: any;
  selectedSchemeId: string;
  filteredEmployee: any;
  actionType: string;
  adminRemark: string;
  errMsg: boolean;
  offlineObj: any;
  recordSummary: any;
  datanotfound: string = "assets/img/defaultnotfound.png";
  recordnotfound: string = "assets/img/notfound.png";
  statusTypes = ["all", "pending", "approved", "rejected"];
  curPage: number = 1;
  status: any = "all";
  pages: any;
  SearchEmployee: any;
  dropdownListEmp: any = [];
  showDropdownListEmp: any;
  sendEmployee: any;
  employeeLogs: any;
  EmpName: any;
  FlexiAdmin: any;

  constructor(
    private _services: CommonService,
    private route: Router,
    private _storage: LocalStorageService,
    public spinnerService: Ng4LoadingSpinnerService
  ) {
    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.flag = false;
      this.employeeRecords = [];
      this._services.titleMessageSource.next("Admin Flexi");
      this.getSummary();
      this.getRecords("bload");
      this._services.getUserDetail().then((data: any) => {
        this.FlexiAdmin = data.ModulesAdmin[0].IsFlexiAdmin;
      });
    });
  }

  ngOnInit() {
    // this.getRecords();
  }

  ngAfterViewInit() {}
  blurEmployee() {
    console.dir("sdsd");
    setTimeout(() => {
      //  this.showDropdownListEmp=false;
    }, 300);
  }
  openlogs(e) {
    console.dir(e);
    this.employeeLogs = null;
    this._services.getUserDetail().then((data: any) => {
      let url = Constant.GetAdminFlexiComponentsEmpLogs;
      let param = JSON.stringify({
        tokenid: data.TokenId,
        EmpTokenId: e.TokenId
      });
      console.dir(param);
      this._services.postService(url, param, false).then(
        (data: any) => {
          this.spinnerService.hide();
          this.employeeLogs = data;
          this.EmpName = this.employeeLogs[0].EmployeeName;
          // this.smallLoader=false;

          console.dir(this.employeeLogs);
        },
        error => {
          this.spinnerService.hide();
          //  this.smallLoader=false;
        }
      );
    });
    $("#logDetails").modal("show");
  }

  SendEmpName() {
    console.dir(this.sendEmployee);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        EmpIdFlexi: this.sendEmployee
      }
    };
    this._services.SearchAdminFlexi = { TokenId: this.sendEmployee };

    this.route.navigate(["mfss/flexi"]);
  }

  getEmpName(paramEmp, value) {
    //  this.smallLoader=true;
    this.showDropdownListEmp = true;
    if (paramEmp) {
      this.showDropdownListEmp = false;
      if (value == "TN") {
        this.SearchEmployee = paramEmp.TokenName;
        this.sendEmployee = paramEmp.TokenId;
      } else {
        this.SearchEmployee = paramEmp.TokenId;
        this.sendEmployee = paramEmp.TokenId;
      }
      return false;
    }
    this.dropdownListEmp = ["searching... "];
    this._services.getUserDetail().then((data: any) => {
      let url = Constant.GetAdminFlexiComponentsEmpName;
      let param = JSON.stringify({
        tokenid: data.TokenId,
        searchtext: this.SearchEmployee
        // action: 'all'
      });
      console.dir(param);
      this._services.postService(url, param, false).then(
        (data: any) => {
          this.spinnerService.hide();
          this.dropdownListEmp = data;
          // this.smallLoader=false;

          console.dir(this.dropdownListEmp);
        },
        error => {
          this.spinnerService.hide();
          //  this.smallLoader=false;
        }
      );
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

  getSummary() {
    let param = {
      tokenid: this.localUserData.TokenId
    };
    this._services
      .postService(Constant.AdminGetAllFlexiDeclarations, param)
      .then(res => {
        console.log(res);
        this.spinnerService.hide();
        this.recordSummary = res;
      });
  }
  getRecords(reqfrom) {
    if (reqfrom === "scroll") {
      this.curPage++;
    } else if (reqfrom === "bload") {
      this.curPage = 1;
    } else {
      return false;
    }
    if (this.status == "all") {
    }
    // if(this.searchItem && this.searchItem.length > 2){
    let param = {
      tokenid: this.localUserData.TokenId,
      searchtext: this.searchItem,
      page: this.curPage,
      status: this.status == "all" ? null : this.status
    };
    this._services
      .postService(Constant.getITAdminFlexiDeclarations, param)
      .then(data => {
        console.log("my data: ", data);
        this.employeeRecords = data["Declarations"];
        this.spinnerService.hide();
      });
    // }
  }

  searchInput() {
    if (this.searchItem === "") {
      // this.status = null;
      this.getRecords("bload");
    }
  }

  arraynum(n) {
    return Array(n);
  }

  scrolledup() {
    console.log("scrolled up");
    this.curPage++;
    alert();
  }

  openModalComponent(obj) {
    if (obj.ProofRequired) {
      if (obj.OfflineProof) {
        this.offlineObj = obj;
        $("#offlineModal").modal("show");
        this.errMsg = false;
        return false;
      }
      this._services.admindeclarationDetails = obj;
      this.selectedSchemeId = obj.SchemeID;

      this.flag = !this.flag;
      // console.log(this.flag);
      this._services.clickFrom = "admin";
      switch (obj.SchemeID) {
        case 2:
          this._services.formControlFields = CommonArray.HRAformControlFields;
          this._services.modalHeader = CommonArray.HRAmodalHeader;
          this._services.fieldDetailsArray = CommonArray.HRA;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 25:
          this._services.formControlFields = CommonArray.LICformControlFields;
          this._services.modalHeader = CommonArray.LICmodalHeader;
          this._services.fieldDetailsArray = CommonArray.LIC;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 27:
          this._services.formControlFields = CommonArray.LICformControlFields;
          this._services.modalHeader = CommonArray.LICmodalHeader;
          this._services.fieldDetailsArray = CommonArray.LIC;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 28:
          this._services.formControlFields = CommonArray.PPFformControlFields;
          this._services.modalHeader = CommonArray.PPFmodalHeader;
          this._services.fieldDetailsArray = CommonArray.PPF;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 29:
          this._services.formControlFields = CommonArray.NSCformControlFields;
          this._services.modalHeader = CommonArray.NSCmodalHeader;
          this._services.fieldDetailsArray = CommonArray.NSC;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 35:
          this._services.formControlFields =
            CommonArray.ChildTuitionFeeformControlFields;
          this._services.modalHeader = CommonArray.ChildTuitionFeemodalHeader;
          this._services.fieldDetailsArray = CommonArray.ChildTuitionFee;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 31:
          this._services.formControlFields =
            CommonArray.HousingLoanformControlFields;
          this._services.modalHeader = CommonArray.HousingLoanmodalHeader;
          this._services.fieldDetailsArray = CommonArray.HousingLoan;
          this._services.entryType = "single";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 32:
          this._services.formControlFields =
            CommonArray.NotifiedMutualFundformControlFields;
          this._services.modalHeader =
            CommonArray.NotifiedMutualFundmodalHeader;
          this._services.fieldDetailsArray = CommonArray.NotifiedMutualFund;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 37:
          this._services.formControlFields =
            CommonArray.SukanyaSamriddhiSchemeformControlFields;
          this._services.modalHeader =
            CommonArray.SukanyaSamriddhiSchememodalHeader;
          this._services.fieldDetailsArray = CommonArray.SukanyaSamriddhiScheme;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 38:
          this._services.formControlFields =
            CommonArray.PostOfficeDepositformControlFields;
          this._services.modalHeader = CommonArray.PostOfficeDepositmodalHeader;
          this._services.fieldDetailsArray = CommonArray.PostOfficeDeposit;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 39:
          this._services.formControlFields =
            CommonArray.ScheduledBankDepositformControlFields;
          this._services.modalHeader = CommonArray.ChildTuitionFeemodalHeader;
          this._services.fieldDetailsArray = CommonArray.ScheduledBankDeposit;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 20:
          this._services.formControlFields =
            CommonArray.CertainPensionFundsformControlFields;
          this._services.modalHeader =
            CommonArray.CertainPensionFundsmodalHeader;
          this._services.fieldDetailsArray = CommonArray.CertainPensionFunds;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 40:
          this._services.formControlFields =
            CommonArray.InterestFirstTimeHomeBuyerformControlFields;
          this._services.modalHeader =
            CommonArray.InterestFirstTimeHomeBuyermodalHeader;
          this._services.fieldDetailsArray =
            CommonArray.InterestFirstTimeHomeBuyer;
          this._services.entryType = "single";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 8:
        case 10:
        case 11:
        case 12:
          this._services.formControlFields =
            CommonArray.MedicalEightyDformControlFields;
          this._services.modalHeader = CommonArray.MedicalEightyDmodalHeader;
          this._services.fieldDetailsArray = CommonArray.MedicalEightyDSelf;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 13:
          this._services.formControlFields =
            CommonArray.MedicalEightyDformControlFields;
          this._services.modalHeader = CommonArray.MedicalEightyDmodalHeader;
          this._services.fieldDetailsArray = CommonArray.MedicalEightyDParents;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 1:
          this._services.formControlFields =
            CommonArray.PreviousEmployerformControlFields;
          this._services.modalHeader = CommonArray.PreviousEmployermodalHeader;
          this._services.fieldDetailsArray = CommonArray.PreviousEmployer;
          this._services.entryType = "single";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 7:
          this._services.formControlFields =
            CommonArray.IncomeOtherSourcesformControlFields;
          this._services.modalHeader =
            CommonArray.IncomeOtherSourcesmodalHeader;
          this._services.fieldDetailsArray = CommonArray.IncomeOtherSources;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 16:
        case 17:
          this._services.formControlFields =
            CommonArray.DependentDisabilityformControlFields;
          this._services.modalHeader =
            CommonArray.DependentDisabilitymodalHeader;
          this._services.fieldDetailsArray = CommonArray.DependentDisability;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 22:
          this._services.formControlFields =
            CommonArray.MedicalEightyDformControlFieldsNonSeniorParent;
          this._services.modalHeader = CommonArray.MedicalTreatmentmodalHeader;
          this._services.fieldDetailsArray =
            CommonArray.MedicalTreatmentNonSenior;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 18:
          this._services.formControlFields =
            CommonArray.LoanHigherEducationformControlFields;
          this._services.modalHeader =
            CommonArray.LoanHigherEducationmodalHeader;
          this._services.fieldDetailsArray = CommonArray.LoanHigherEducation;
          this._services.entryType = "single";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 6:
          this._services.formControlFields =
            CommonArray.IncomeHousePropertyformControlFields;
          this._services.modalHeader =
            CommonArray.IncomeHousePropertymodalHeader;
          this._services.fieldDetailsArray = CommonArray.IncomeHouseProperty;
          this._services.entryType = "multiple";
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        default:
          this._services.formControlFields = null;
          this._services.fieldDetailsArray = null;
          this._services.modalHeader = "No Proofs Require";
          break;
      }
    }
  }

  EmployeeconformationModal() {
    $("#EmployeeconformationModal").modal("show");
  }

  confirmationBox(action) {
    this.actionType = action;
    if (this.actionType == "reject" && !this.adminRemark) {
      this.errMsg = true;
      return false;
    }
    this.errMsg = false;
    // $('#ProofModal').modal('hide');
    $("#conformationModal").modal("show");
  }
  sendDataUser(data: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        //TokenId: data.TokenId,
        //EmpName: data.EmpName
      }
    };
    this._services.AdminEmpFlexiQuery = {
      TokenId: data.TokenId,
      EmpName: data.EmpName
    };

    this.route.navigate(["mfss/admin-empFlexi-declaration"], navigationExtras);
  }

  DeclartionAdminView(value) {
    // this.showMessageFlexi=value
    $("#conformationModal1").modal("show");
    if (value == "changeView") {
      this.route.navigate(["mfss/flexi"]);
    }
  }

  searchEmployee() {
    if (!this.searchItem) {
      this.filteredEmployee = this.employeeRecords["DeclarationList"];
      return;
    }
    this.filteredEmployee = this.employeeRecords["DeclarationList"].filter(
      obj => {
        if (
          obj.EmpName.toLowerCase().includes(this.searchItem.toLowerCase()) ||
          obj.ID.includes(this.searchItem)
        ) {
          return true;
        }
      }
    );
  }
}
