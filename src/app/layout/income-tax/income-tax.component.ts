import { HttpClient } from "@angular/common/http";
import { LocalStorageService } from "ngx-store";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Component, ViewChild } from "@angular/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import * as moment from "moment";
import { Constant } from "./../../services/constant";
import { CommonService } from "./../../services/common.service";
import { CommonArray } from "../../services/commonArray";
import { SchemeInformation } from "../../services/scheme-info";
import { IncomeTaxSimulationComponent } from "../../components/income-tax-simulation/income-tax-simulation.component";

declare var jquery: any;
declare var $;
let statesWithFlags: any = [];

@Component({
  selector: "app-income-tax",
  templateUrl: "./income-tax.component.html",
  styleUrls: ["./income-tax.component.scss"],
})
export class IncomeTaxComponent {
  localUserData: any;
  userInfo: any;
  contentProcessing: boolean;
  loadingText = 'Loading...'
  isSimulationExists: any; // Check if already simulated data is present
  isDeclarationExists: any; // Check if already declared data is present
  isAmountChanged: boolean; // Check is amount changed in form
  simulationList: any[]; // Simulation list array
  yesAction: string; // check when yes button click on confirm button
  selectedSection: any = "declaration";
  checkDiscarding: any = false; // Check if there is need to show confirm box
  flag: any;
  selectedSchemeId: any;
  salaryDetails: any = [];
  ngForm: any;
  totalTaxableSalary: number;
  originalTaxableSalary = 0;
  totalTaxableAmount: number;
  showMessage = false;
  fiscalYear: number;
  items: any = [{}];
  schemedeclarationsList: any = [];
  isAdminIT = false;
  schemeNo: any;
  selectedScheme: any;
  isDeclartionmade = true;
  AdminRemarks: any;
  subScheme: any;
  subSchemeKeys: string[];
  schemeLogs: any;
  declaredSchmes: any;
  successMessage: any;
  successFromDeclaration: any;
  yearsArray: any = [];
  fileURL: any;
  shownorecord: boolean;
  date: Date;
  year: number;
  userDetails: any;
  dependentDetails: any;
  dependentMotherName: any;
  dependentFatherName: any;
  dependentSpouseName: any;
  dependentChildName: any;
  emittedProofArray: any;
  dependentAllChild: any;
  employeeAge: any;
  withDisability: boolean;
  withSeverDisability: boolean;
  isNonSeniorMedicalValid: boolean = true;
  isSeniorMedicalValid: boolean = true;
  isSevereDisabilityValid: boolean = true;
  isNonSevereDisabilityValid: boolean = true;
  saveClicked = false;
  ValueChanged: boolean;
  infoScheme: any;
  selectedInfoIcon: any;
  public model: any;
  eightyValue: any;
  DeclarationPeriod: any = false;
  ActualsPeriod: any = false;
  isAdminChecked: any = false;
  selectedRegimeType: any;
  simulatedDetails: any;
  simulatedTax: any = {
    Old_Amount: 0,
    New_Amount: 0
  }

  notSubmittedSchemes = [];
  search = (text$: Observable<string>) =>
    text$.pipe(
      map(term =>
        term === "" ?
          [] :
          statesWithFlags
            .filter(
              v => v.SchemeName.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10)
      )
    );
  formatter = (x: {
    SchemeName: string
  }) => x.SchemeName;
  IspreviousYearSelected: boolean = false;
  deletedSchemes: any = [];
  @ViewChild('taxSimulation') simulationDetails: IncomeTaxSimulationComponent;
  typeofSelection: any;
  originalschemedeclarationsList: any;
  displayFY: string;

  constructor(
    private _services: CommonService,
    private _storage: LocalStorageService,
    public spinnerService: Ng4LoadingSpinnerService,
    public http: HttpClient,
    public route: Router,
    public sanitize: DomSanitizer
  ) {
    this._services.titleMessageSource.next("Income Tax");
    this.createYearsArray();

    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.userInfo = this.localUserData;
      this.isAdminIT = this.userInfo.ModulesAdmin[0].IsIncomeTaxAdmin;

      if (this.userInfo) {
        this.employeeAge = this.userInfo.Age ? this.userInfo.Age : 0;
      }
    });


    this._services.successData.subscribe(resp => {
      this.successMessage = resp;
      if (resp !== null) {
        this.successFromDeclaration = undefined;

        for (let i = 0; i < this.schemedeclarationsList.Schemes.length; i++) {
          const foundObj = this.schemedeclarationsList.Schemes[
            i
          ].subSectiondetails.find(obj => obj.SchemeID == resp.modalSchemeId);

          if (foundObj) {

            this.getSectionDeclaredAmount(
              foundObj,
              this.schemedeclarationsList.Schemes[this.schemeNo]
                .subSectiondetails
            );
            foundObj.DeclarationDetailsIds = resp.DeclarationDetailsIds;
            foundObj.ProofLength = resp.ProofLength;
            foundObj.ProofCount = resp.ProofLength;
            foundObj.Amount = resp.Amount;
            foundObj.Status = "Pending";
            if (resp.entryType == "multiple") {
              if (foundObj.DeclarationDetails) {
                foundObj.DeclarationDetails[0] = resp.DeclarationDetails;
              } else {
                foundObj.DeclarationDetails = [resp.DeclarationDetails];
              }
            } else {
              foundObj.DeclarationDetails = resp.DeclarationDetails;
            }
            foundObj.filledDeclarations = resp.DeclarationDetails;

            break;
          }
        }
        if (resp.modalSchemeId === 7) {
          this.setValuetoTTA();
        }

        this.ValueChanged = true;
        if (resp) {
          $("#successMessageModal").modal("show");
        }
      }
    });

    this._services.successDocumentData.subscribe(resp => {
      if (resp) {
        this.emittedProofArray = resp.resp;
        this._services.emittedProofArray = resp.resp;

        for (let i = 0; i < this.schemedeclarationsList.Schemes.length; i++) {
          const foundObj = this.schemedeclarationsList.Schemes[
            i
          ].subSectiondetails.find(obj => obj.SchemeID == resp.modalSchemeId);

          if (foundObj) {
            foundObj.Proofs = this.emittedProofArray;

            break;
          }
        }
      }
    });

    this._services.getService(Constant.getServerDateTime).then(data => {
      const year = moment(data).year();
      const month = moment(data).month();

      if (month>=3) {
         this.displayFY =  `${year} - ${year+1}`;
      }else {
        this.displayFY =  `${year-1} - ${year}`;
      }
      this.fiscalYear = year;

      this.checkAlreadySimOrDeclare();
    });
  }

  onTaxEventEmit(event) {
    this.simulatedDetails = event;
    const temp = this.simulatedDetails.taxSummary.find(obj => (obj.id === 33));
    this.simulatedTax.Old_Amount = Math.round(temp.Old_Amount);
    this.simulatedTax.New_Amount = Math.round(temp.New_Amount);
  }

  onChange() {
    if (typeof this.model == "object") {
      const SchemeNoArray = this.schemedeclarationsList.Schemes.map(
        obj => obj.Section
      );
      let schemeNo = SchemeNoArray.indexOf(this.model.Section);

      this.setSelectedCategory(
        this.schemedeclarationsList.Schemes[schemeNo],
        schemeNo
      );
    } else {
      this.model = "";
    }
  }

  getStyle(SchemeName) {
    if (this.model && SchemeName === this.model.SchemeName) {
      return {
        "border-left": "3px solid #fef200",
        color: "#675f5f",
        background: "rgba(254, 242, 0, 0.161)",
        "font-weight": "600"
      };
    }
  }

  getTaxProjection(eve) {
    this.year = eve.target.value;

    if (!this.year) {
      return false;
    }
    let data = {};
    data = {
      tokenid: this.localUserData.TokenId,
      FinancialYear: this.year
    };

    const link = Constant.GetTaxProjectionDocument;

    this._services.postService(link, data).then((respdata: any) => {
      this.shownorecord = respdata.Base64File === "" ? false : true;

      if (respdata.Message === "Success") {
        const binaryString = window.atob(respdata.Base64File);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
          const ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
        }
        const blob = new Blob([bytes], {
          type: "application/pdf"
        });
        const tempFile = URL.createObjectURL(blob);
        this.fileURL = this.sanitize.bypassSecurityTrustResourceUrl(tempFile);
        this._services.spinnerService.hide();
      } else {
        this._services.spinnerService.hide();
      }
    });
  }

  createYearsArray() {
    this._services
      .getService(Constant.getServerDateTime)
      .then((newdate: any) => {
        this.date = new Date(newdate);
        for (let i = 0; i <= 2; i++) {
          this.date = new Date(newdate);
          const currentYear = this.date
            .getFullYear()
            .toString()
            .substring(2);
          this.yearsArray.push(
            this.date.getFullYear() -
            (i + 1) +
            "-" +
            (parseInt(currentYear) - i)
          );
        }

      });
  }

  checkDisabled() {
    let flag = false;
    loop1: for (
      let i = 0; i < this.schemedeclarationsList.Schemes.length; i++
    ) {
      loop2: for (
        let j = 0; j < this.schemedeclarationsList.Schemes[i].subSectiondetails.length; j++
      ) {
        if (
          this.schemedeclarationsList.Schemes[i].subSectiondetails[j].Status ===
          "Approved" ||
          this.schemedeclarationsList.Schemes[i].subSectiondetails[j].Status ===
          "Pending" ||
          this.schemedeclarationsList.Schemes[i].subSectiondetails[j].Status ===
          "Rejected"
        ) {
          flag = true;
          break loop1;
        }
      }
    }
    return flag;
  }


  checkAlreadySimOrDeclare() {
    const url = Constant.SimulationDeclarationCheck;
    const param = {
      tokenid: this.localUserData.TokenId,
      fiscal_year: this.fiscalYear
    };
    this._services.postService(url, param).then((resp: any) => {
      this.isDeclarationExists = resp.DeclarationExists;
      this.isSimulationExists = resp.SimulationExists;
      this.initlializeSection();
    });
  }

  // Set the section Name at the start
  async initlializeSection() {
    if (this.isDeclarationExists) {
      this.checkDiscarding = true;
    }

    await this.getTaxableAmount(this.selectedSection);
    //debugger;
    if (this.selectedRegimeType === 'new') {
      this.selectedSection = "simulation";
    } else {
      this.selectedSection = "declaration";
    }

  }

  closeModal() {
    this.flag = !this.flag;
  }

  openModalComponent(obj) {
    if (obj.Section === "80DD") {
      let declaredScheme = this.schemedeclarationsList.Schemes.filter(
        obj => obj.Section === "80DD"
      )[0].subSectiondetails.filter(obj => obj.Amount > 0);

      if (
        declaredScheme.length > 0 &&
        declaredScheme[0].SchemeID !== obj.SchemeID
      ) {
        this._services.showSnackbar({
          status: "Sorry! Only one declaration is allowed in 80DD "
        });
        return;
      }
    }

    this.saveClicked = false;
    this.selectedSchemeId = obj.SchemeID;
     this.flag = !this.flag;
    this._services.clickFrom = "employee";
    this._services.declarationId = this.selectedSchemeId;
    this._services.DeclarationPeriod = this.DeclarationPeriod;
    this._services.ActualsPeriod = this.ActualsPeriod;
    this._services.SchemeStatus = obj.Status;

    this._services.userDetails = {
      dependentMotherName: this.getRelationName(
        this.dependentDetails,
        "Mother"
      ),
      dependentFatherName: this.getRelationName(
        this.dependentDetails,
        "Father"
      ),
      dependentSpouseName: this.getRelationName(
        this.dependentDetails,
        "Spouse"
      ),
      dependentChildName: this.getRelationName(this.dependentDetails, "Child"),
      dependentAllChild: this.dependentAllChild,
      // tslint:disable-next-line: max-line-length
      dependentMotherAge: this.getRelationAge(this.dependentDetails, "Mother"),
      dependentFatherAge: this.getRelationAge(this.dependentDetails, "Father"),
      dependentSpouseAge: this.getRelationAge(this.dependentDetails, "Spouse"),
      dependentChildAge: this.getRelationAge(this.dependentDetails, "Child")
    };

    switch (obj.SchemeID) {
      case 2:
        this._services.formControlFields = CommonArray.HRAformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.HRA;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 25:
        this._services.formControlFields = CommonArray.LICformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.LIC;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 27:
        this._services.formControlFields = CommonArray.ULIPformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.ULIP;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 28:
        this._services.formControlFields = CommonArray.PPFformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.PPF;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 29:
      case 30:
        this._services.formControlFields = CommonArray.NSCformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.NSC;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 35:
      case 36:
        this._services.formControlFields =
          CommonArray.ChildTuitionFeeformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.ChildTuitionFee;
        this._services.entryType = "single";
        this._services.schemeDeclaration = this.schemedeclarationsList.Schemes;
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 31:
        this._services.formControlFields =
          CommonArray.HousingLoanformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.HousingLoan;
        this._services.entryType = "single";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 32:
        this._services.formControlFields =
          CommonArray.NotifiedMutualFundformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.NotifiedMutualFund;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 20:
        this._services.formControlFields =
          CommonArray.NotifiedMutualFundformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.NotifiedPensionFund;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 37:
        this._services.formControlFields =
          CommonArray.SukanyaSamriddhiSchemeformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.SukanyaSamriddhiScheme;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 38:
        this._services.formControlFields =
          CommonArray.PostOfficeDepositformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.PostOfficeDeposit;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 39:
        this._services.formControlFields =
          CommonArray.ScheduledBankDepositformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.ScheduledBankDeposit;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 19:
        this._services.formControlFields =
          CommonArray.CertainPensionFundsformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.CertainPensionFunds;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 40:
        this._services.formControlFields =
          CommonArray.InterestFirstTimeHomeBuyerformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray =
          CommonArray.InterestFirstTimeHomeBuyer;
        this._services.entryType = "single";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 8:
        this._services.formControlFields =
          CommonArray.MedicalEightyDformControlFieldsNonSeniorSelf;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray =
          CommonArray.MedicalEightyDSelfNonSenior;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;

        break;
      case 9:
        this._services.formControlFields =
          CommonArray.MedicalEightyDformControlFieldsSeniorSelf;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.MedicalEightyDSelfSenior;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 10:
        this._services.formControlFields =
          CommonArray.MedicalEightyDformControlFieldsNonSeniorParent;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray =
          CommonArray.MedicalEightyDParentNonSenior;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 11:
        this._services.formControlFields =
          CommonArray.MedicalEightyDformControlFieldsSeniorParent;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray =
          CommonArray.MedicalEightyDParentSenior;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 12:
        this._services.formControlFields =
          CommonArray.MedicalEightyDformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.MedicalEightyDSelf;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 13:
        this._services.formControlFields =
          CommonArray.MedicalEightyDformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.MedicalEightyDParents;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 1:
        this._services.formControlFields =
          CommonArray.PreviousEmployerformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.PreviousEmployer;
        this._services.entryType = "single";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 7:
        this._services.formControlFields =
          CommonArray.IncomeOtherSourcesformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.IncomeOtherSources;
        this._services.entryType = "single";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 17:
        this._services.formControlFields =
          CommonArray.DependentSeverDisabilityformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.DependentSeverDisability;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 16:
        this._services.formControlFields =
          CommonArray.DependentDisabilityformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.DependentDisability;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 22:
        this._services.formControlFields =
          CommonArray.MedicalTreatmentformControlFieldsNonSenior;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray =
          CommonArray.MedicalTreatmentNonSenior;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 21:
        this._services.formControlFields =
          CommonArray.MedicalTreatmentformControlFieldsSenior;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.MedicalTreatmentSenior;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 18:
        this._services.formControlFields =
          CommonArray.LoanHigherEducationformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.LoanHigherEducation;
        this._services.entryType = "single";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      case 6:
        this._services.formControlFields =
          CommonArray.IncomeHousePropertyformControlFields;
        this._services.modalHeader = obj.SchemeName;
        this._services.fieldDetailsArray = CommonArray.IncomeHouseProperty;
        this._services.entryType = "multiple";
        this._services.previousDeclarationDetails = obj.DeclarationDetails;
        break;
      default:
        this._services.formControlFields = [];
        this._services.fieldDetailsArray = [];
        this._services.modalHeader = "No Proofs Require";
        break;
    }
  }

  openDeleteConfirm(flag, subScheme?) {
    if (flag == "confirmation") {
      $("#deleteConfirmation").modal("show");

      this.selectedSchemeId = subScheme.SchemeID;
    } else if (flag == "final_delete") {
      this.schemedeclarationsList.Schemes.filter(
        obj => obj.Section === this.selectedScheme.Section
      )[0]
        .subSectiondetails.filter(
          innerObj => innerObj.SchemeID === this.selectedSchemeId
        )
        .map(ele => {
          this.deletedSchemes.push({
            SchemeName: ele.SchemeName,
            Amount: ele.Amount,
            Status: 'Deleted',
            isProofsAttched: ele.Proofs && ele.Proofs.length !== 0 ?
              "Yes" :
              "No"
          });
          ele.DeclarationDetails = null;
          ele.Amount = 0;
          return ele;
        });

      this.schemedeclarationsList.Schemes.filter(
        obj => obj.Section === this.selectedScheme.Section
      )[0]
        .subSectiondetails.filter(
          innerObj => innerObj.SchemeID === this.selectedSchemeId
        )
        .map(ele => {
          ele.DeclarationDetails = null;
          ele.Amount = 0;
          if (this.selectedSchemeId == 7) {
            this.schemedeclarationsList.Schemes.filter(
              obj => obj.Section === "80TTA"
            )[0].subSectiondetails[0].Amount = 0;

            this.schemedeclarationsList.Schemes.filter(
              obj => obj.Section === "80TTB"
            )[0].subSectiondetails[0].Amountt = 0;
          }
          return ele;
        });
    }
  }
  // Check condition on submit proof offline checkbox
  // clickCheckBox(i, j, obj, eve) {
  //   obj.OfflineProof = eve.target.checked;
  //   if ($('#checkbox' + i + j).is(':checked')) {
  //     $('#online_proof' + obj.SchemeID).hide();
  //     $('#online_disabled_proof' + obj.SchemeID).show();
  //     $('#declare' + obj.SchemeID).removeAttr('disabled');

  //   } else {
  //     $('#online_proof' + obj.SchemeID).show();
  //     $('#online_disabled_proof' + obj.SchemeID).hide();
  //     $('#declare' + obj.SchemeID).attr('disabled', 'disabled');
  //   }

  // }

  DeclartionAdminView(value) {
    $("#toggleConfirmation").modal("show");

    if (value == "changeView") {
      this.route.navigate(["mfss/admin-IT"]);
      // this.route.navigate(["mfss/admin-IT"]);
    }
  }

  outputFunctionCall(event) {

  }

  checkStatus(subScheme, status){
    return (subScheme.Status === status) && (this.selectedSection=='declaration')
  }

  // calculate taxable amount and total declared amount
  async getTaxableAmount(flag, isPreviousYearSelected?) {
    let url: any;
    let param: any;
    this.shownorecord = false;
    //if (flag === "declaration" || flag === "declarationStatus") {
    this.contentProcessing = true;
    url = isPreviousYearSelected ? Constant.getNewIncomeTaxDataLastYear : Constant.newIncomeTax;
    param = {
      tokenid: this.localUserData.TokenId,
      // "tokenid": this._storage.get('username').TokenId,
      fiscal_year: this.fiscalYear
    };

    await this._services.postService(url, param).then( async (data: any) => {
      //data.simulationCount = 0;
    //  this._services.spinnerService.hide();
      this.schemedeclarationsList = {
        ...data
      };

      this.originalschemedeclarationsList = {
        ...data
      };

      statesWithFlags = this.schemedeclarationsList.Schemes;
      //SchemeNoArray = this.schemedeclarationsList.Schemes
      this.DeclarationPeriod = data.DeclarationPeriod;
      this.ActualsPeriod = data.ActualsPeriod;
      this.deletedSchemes = [];
      if(isPreviousYearSelected){ $('#warningModal').modal('show'); }
      if (flag === "declaration") {
        // tslint:disable-next-line: max-line-length
        this.isAdminChecked = this.schemedeclarationsList.Schemes.findIndex(obj => obj.Status === 'Approved' || obj.Status === 'Rejected') !== -1 ? true : false
      }

      this.modifydeclarationArray(this.schemedeclarationsList, flag);

      this.selectedRegimeType = data.selectedRegimeType;

      this.getSalaryComponentsDetails(this.schemedeclarationsList);
      if (flag === "declaration") {
       await this.getProfileDetails();
        this.setValuetoTTA();
      }

      this.isDeclartionmade = this.checkDeclaration();

      this.setSelectedCategory(this.schemedeclarationsList.Schemes[0], 0);

      // this.incomeTaxList = data.Schemes;
      // this.previousDeclaredList = this.filterPreviousDeclared(this.incomeTaxList)

      this.totalTaxableSalary = data.Taxable;

      this.originalTaxableSalary = data.Taxable;
      this.totalTaxableAmount = data.IncomeTax === null ? 0 : data.IncomeTax;
      this.contentProcessing = false;

      setTimeout(() => {
        if ( this.selectedRegimeType === null &&
             this.selectedSection !== 'declaration' &&
             this.typeofSelection !== 'taxRegime' ) {

          $('#warningSimulationModal').modal('show');
        }
        if (flag === "simulation") {
          this.initialcalculateTotalTax();
        }
      }, 100);
    }).catch((error)=>{
      this.contentProcessing = false;
    });
  }

 async getProfileDetails() {
   this.loadingText = "Fetching Profile Details...";
    const param = {
      tokenid: this.localUserData.TokenId,
      requestToken: this.localUserData.TokenId
      // ,
      // requestToken: this.localUserData.TokenId
    };
    const url = Constant.GetBasicProfile;
   await this._services.postService(url, param).then((data: any) => {
      this.userDetails = data;

      this.dependentDetails = this.userDetails.dependants;

      this.dependentDetails.map(obj => {
        if (
          obj.Relationship.toLowerCase().includes("domestic partner") ||
          obj.Relationship.toLowerCase().includes("child")
        ) {
          obj.Relationship = "Child";
        }
        return obj;
      });

      this.dependentAllChild = this.getAllChilds(
        this.dependentDetails,
        "Child"
      );
      console.log('Child', this.dependentDetails)
      this.loadingText = 'Loading...';
    }).catch(()=>{
      this.contentProcessing = false;
      this.loadingText = 'Loading...';
    });
  }

  getAllChilds(tempArray, relationName) {
    const foundObj = tempArray.filter(obj => obj.Relationship === relationName);
    const temp = [];
    if (foundObj) {
      foundObj.forEach(obj => {
        temp.push({
          value: obj.Name,
          label: obj.Name,
          Gender: obj.Gender
        });
      });
      return temp;
    } else {
      return [];
    }
  }

  getRelationName(tempArray, relationName) {
    if (!tempArray) {
      return false;
    }

    const foundObj = tempArray.find(obj => obj.Relationship === relationName);

    if (foundObj) {
      return foundObj.Name;
    } else {
      return "";
    }
  }
  getRelationAge(tempArray, relationName) {
    if (!tempArray) {
      return false;
    }
    const foundObj = tempArray.find(obj => obj.Relationship === relationName);

    if (foundObj) {
      return foundObj.Age;
    } else {
      return "";
    }
  }

  getAggregationOfChapter(schemedeclarationsList) {
    let sum = 0;
    schemedeclarationsList.Schemes.forEach(obj => {
      sum += obj.amountConsider;
    });
    return sum;
  }


  getNgClass() {

    return {
      'active1': (this.selectedSection === 'declaration')
    }
  }

  getSalaryComponentsDetails(schemedeclarationsList) {
    this.salaryDetails = [];

    //schemedeclarationsList.StdDeduction = 50000
    this.salaryDetails.push({
      title: "Gross Salary",
      value: 0,
      // ? schemedeclarationsList.GrossSalary
      // : 0,
      index: 1
    }, {
      title: "Exemptions u/s 10(B)",
      value: schemedeclarationsList.ExemptionUS10 ?
        schemedeclarationsList.ExemptionUS10 :
        0,
      index: 2,
      subSections: [{
        sectionName: "HRA Exemption",
        value: schemedeclarationsList.HRAAnnualExemption ?
          schemedeclarationsList.HRAAnnualExemption :
          0
      },
      {
        sectionName: "CEA Exemption",
        value: schemedeclarationsList.CEAAnnualExemption ?
          schemedeclarationsList.CEAAnnualExemption :
          0
      }
      ]
    }, {
      title: "Balance(A-B)",
      value: schemedeclarationsList.Balance ?
        schemedeclarationsList.Balance :
        0,
      index: 3
    }, {
      title: "Std. Deduction",
      value: schemedeclarationsList.StdDeduction ?
        schemedeclarationsList.StdDeduction :
        0,
      index: 4
    }, {
      title: "Empmnt Tax(Prof. Tax)",
      value: schemedeclarationsList.EmploymentTax ?
        schemedeclarationsList.EmploymentTax :
        0,
      index: 5
    }, {
      title: "Income under HD salary",
      value: schemedeclarationsList.IncmUnderHdSalary ?
        schemedeclarationsList.IncmUnderHdSalary :
        0,
      index: 6
    },
      //  {'title' : 'PF', 'value' : schemedeclarationsList.PF, 'index': 2},
      // { title: "Basic", value: schemedeclarationsList.Basic, index: 3 },
      {
        title: "Gross Total Income",
        value: schemedeclarationsList.GrossTotIncome ?
          schemedeclarationsList.GrossTotIncome :
          0,
        index: 7
      }, {
      title: "Agg of Chapter VI",
      value: schemedeclarationsList.AggOfChapterVI ?
        schemedeclarationsList.AggOfChapterVI :
        0,
      index: 8
    }, {
      title: "Total Income",
      value: schemedeclarationsList.TotalIncome ?
        schemedeclarationsList.TotalIncome :
        0,
      index: 9
    }, {
      title: "Tax on Total Income",
      value: schemedeclarationsList.TaxOnTotalIncome ?
        schemedeclarationsList.TaxOnTotalIncome :
        0,
      index: 10
    }, {
      title: "Taxable payable and Surcharges",
      value: schemedeclarationsList.TaxPayableAndSurcharg ?
        schemedeclarationsList.TaxPayableAndSurcharg :
        0,
      index: 11
    }, {
      title: "Tax deducted so far",
      value: schemedeclarationsList.TaxDeductedSoFar ?
        schemedeclarationsList.TaxDeductedSoFar :
        0,
      index: 13
    }, {
      title: "Income Tax",
      value: schemedeclarationsList.IncomeTax ?
        schemedeclarationsList.IncomeTax :
        0,
      index: 13
    }
    );
  }

  setSalaryDetails(data, flag) {
    // Salary details in side panel
    this.salaryDetails = [{
      key: "Gross Salary",
      value: 0,
      index: 1
    },
    {
      key: "Balance",
      value: 0,
      index: 2
    },
    {
      key: "Standard Deduction",
      value: 0,
      index: 3
    },
    {
      key: "Employment Tax (prof Tax)",
      value: 0,
      index: 4
    },
    {
      key: "Gross Total income",
      value: 0,
      index: 5
    },
    {
      key: "Agg of Chapter VI",
      value: 0,
      index: 7
    },
    {
      key: "Total Income",
      value: 0,
      index: 6
    },

    {
      key: "Tax Payble and Edu Cess",
      value: 0,
      index: 8
    }
    ];

    this.salaryDetails.forEach(item => {
      switch (item.index) {
        case 1:
          item.value = data.GrossSalary;
          break;
        case 2:
          item.value = data.Balance;
          break;
        case 3:
          item.value = data.StdDeduction;
          break;
        case 4:
          item.value = data.EmploymentTax;
          break;
        case 5:
          item.value = data.GrossTotIncome;
          break;
        case 6:
          item.value = data.TotalIncome;
          break;
        case 7:
          item.value = data.AggOfChapterVI;
          break;
        case 8:
          item.value = data.TaxPayableEduCess;
          break;
      }
    });
    this.setChapSixValue(flag);
    this.setTotalIncome();

    if (flag !== "simulation") {
      // setTimeout(()=>{
      this.salaryDetails.splice(5, 8);

      // })
    }
  }

  checkDeclaration() {
    return !this.schemedeclarationsList.Schemes.every( scheme => scheme.declaredAmount === 0);
  }

  // Modify the server response according to the sections

  modifydeclarationArray(declarationList, flag) {

    const SectionWiseArray = [];
    let uniqueSections;
    if( flag === 'declarationStatus' ) {
       uniqueSections = new Set(declarationList.Schemes.filter(scheme => scheme.Amount !==0 ).map(s => s.Section));
    }else {
       uniqueSections = new Set(declarationList.Schemes.map(scheme => scheme.Section));
    }

    uniqueSections.forEach((sname)=> {
        let limit =  declarationList.Schemes.find(scheme => scheme.Section === sname).SectionLimit || 0;
        let subDetails = [];
        if( flag === 'declarationStatus' ) {
          subDetails = declarationList.Schemes.filter(scheme => scheme.Section === sname && scheme.Amount !== 0 );
        }else {
          subDetails = declarationList.Schemes.filter(scheme => scheme.Section === sname );
        }
        let amtDeclared = subDetails.filter(scheme => scheme.SchemeID !==7 &&
                                    scheme.SchemeID !==2 &&
                                    scheme.SchemeID !==1 )
                            .reduce((n, x)=> n + +x.Amount, 0);
        let consider = amtDeclared > limit? limit: amtDeclared;
       SectionWiseArray.push({
          "Section": sname,
          "subSectiondetails": subDetails,
          "SectionLimit": limit,
          "amountConsider": consider,
          "declaredAmount": amtDeclared
       })
     })

    this.schemedeclarationsList.Schemes = [...SectionWiseArray];

    if (this.selectedSection === "simulation") {
      this.simulationList = SectionWiseArray;
    }
  }

  setChapSixValue(flag) {
    if (flag == "simulation") {
      let Total = 0;
      const foundObj = this.salaryDetails.find(obj => obj.index === 7);
      this.schemedeclarationsList.Schemes.forEach(item => {

        if (item.Section !== "General") {
          Total += item.amountConsider;
        }
      });
      foundObj.value = Total;
      //  this.schemedeclarationsList.Schemes.reduce((n,x)=>n +x.amountConsider,0)
    }
  }
  checkisNaN(value) {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
  }

  setValuetoTTA() {
    const TTAAMount = 0;
    let otherSavAmount1 = 0;
    let otherSavAmount2 = 0;

    // tslint:disable-next-line: max-line-length
    const sectionObjTTA = this.schemedeclarationsList.Schemes.find(
      obj => obj.Section == "80TTA"
    ).subSectiondetails.find(innerobj => innerobj.SchemeID == 23);
    const sectionObjTTB = this.schemedeclarationsList.Schemes.find(
      obj => obj.Section == "80TTB"
    ).subSectiondetails.find(innerobj => innerobj.SchemeID == 44);
    const sectionObjOtherIncome = this.schemedeclarationsList.Schemes.find(
      obj => obj.Section == "General"
    ).subSectiondetails.find(innerobj => innerobj.SchemeID == 7);

    if (sectionObjOtherIncome.DeclarationDetails !== null) {
      otherSavAmount1 = this.checkisNaN(
        sectionObjOtherIncome.DeclarationDetails[0].SAVBankInterest
      );
      otherSavAmount2 =
        this.checkisNaN(
          sectionObjOtherIncome.DeclarationDetails[0].SAVBankInterest
        ) +
        this.checkisNaN(
          sectionObjOtherIncome.DeclarationDetails[0].OtherInterest
        );
    }
    if (this.employeeAge < 60) {
      sectionObjTTA.Amount =
        otherSavAmount1 <= sectionObjTTA.Limit ?
          otherSavAmount1 :
          sectionObjTTA.Limit;
    } else if (this.employeeAge >= 60) {
      sectionObjTTB.Amount =
        otherSavAmount2 <= sectionObjTTB.Limit ?
          otherSavAmount2 :
          sectionObjTTB.Limit;
    }
  }

  setSelectedCategory(scheme, i) {
    //  if(scheme){
    //   if (scheme.Section === '80TTA'){
    //     const sectionObj =  this.schemedeclarationsList.Schemes.find(obj=>obj.Section == 'General').subSectiondetails.find(innerobj => innerobj.SchemeID == 7 );

    //     if (sectionObj.DeclarationDetails !== null){
    //       const otherSavAmount =  sectionObj.DeclarationDetails[0].SAVBankInterest + sectionObj.DeclarationDetails[0].OtherInterest
    //       sectionObj.Amount = otherSavAmount <= scheme.SectionLimit ? otherSavAmount : scheme.SectionLimit
    //     }else{
    //       sectionObj.Amount = 0
    //     }
    //   }
    // }


    let temp: any;

    if (scheme && scheme.Section === "80U") {
      temp = scheme.subSectiondetails.filter(obj => obj.Amount > 0);
      if (temp.length > 0) {
        //this.checkIfdeclared80U(9999, 15);
        this.eightyValue = "";
        this.checkValue(temp[0].Amount, temp[0].SchemeID);
      }

      // else if (tempId.length > 0 && tempId[0] === 15) {
      //   this.checkIfdeclared80U(9999, 14);
      // }
    }

    if (scheme !== null) {
      this.selectedScheme = scheme;
    }

    this.schemeNo = i;
  }

  setTotalIncome() {
    const foundObj = this.salaryDetails.find(obj => obj.index === 6);
    const ChapSix = this.salaryDetails.find(obj => obj.index === 7);
    const gross = this.salaryDetails.find(obj => obj.index === 5);

    foundObj.value = gross.value - ChapSix.value;
  }

  getIsSelected(scheme) {
    return this.selectedScheme.Section === scheme.Section;
  }

  getAmountConsider(sectionKey, SchemesArray) {
    let amount: any;
    amount = SchemesArray.filter(
      obj =>
        obj.Section === sectionKey.Section &&
        obj.SchemeID !== 7 &&
        obj.SchemeID !== 1 &&
        obj.SchemeID !== 2
    ).reduce((n, x) => n + parseInt(x.Amount), 0);

    if (amount < sectionKey.SectionLimit || sectionKey.SectionLimit === 0) {
      return amount;
    } else {
      return sectionKey.SectionLimit;
    }
  }

  getSectionDeclaredAmount(sectionKey, SchemesArray) {
    let amount: any;
    // tslint:disable-next-line: max-line-length
    amount = SchemesArray.filter(
      obj =>
        obj.Section === sectionKey.Section &&
        obj.SchemeID !== 7 &&
        obj.SchemeID !== 1
    ).reduce((n, x) => n + parseInt(x.Amount), 0);

    return amount;
    // tslint:disable-next-line: max-line-length
    // return SchemesArray.filter(obj => obj.Section === sectionKey.Section  &&  obj.SchemeID !==6 && obj.SchemeID !==7).reduce((n, x) => n + x.Amount, 0);
  }

  getSectionwiseArray(sectionKey, SchemesArray, flag) {

    if (flag !== "declarationStatus") {
      // return SchemesArray.filter(obj => obj.Section === sectionKey.Section);
      return SchemesArray.filter(obj => obj.Section === sectionKey.Section)
        .sort(a => {
          return a.Status === null ? 1 : a.Status !== null ? -1 : ''
        })

    } else {
      return SchemesArray.filter(
        obj =>
          obj.Section === sectionKey.Section &&
          obj.Status !== "Save" &&
          obj.Status !== null
      );
    }
  }

  // Save the amount when user click on save button
  saveAmount(item, flag) {
    if (item.SchemeID === 16 && !this.isNonSevereDisabilityValid) {
      return false;
    }

    if (item.SchemeID === 17 && !this.isSevereDisabilityValid) {
      return false;
    }


    if (item.SchemeID === 21 && !this.isSeniorMedicalValid) {
      return false;
    }

    if (item.SchemeID === 22 && !this.isNonSeniorMedicalValid) {
      return false;
    }

    if (item.SchemeID == 14 && this.withDisability) {
      return false;
    }

    if (item.SchemeID == 15 && this.withSeverDisability) {
      return false;
    }

    if (
      item.Amount === "" ||
      /^[a-zA-Z()%~`!@#$%^&*()_+=|}{:'";<>,.?/\[\]\-\\]+$/.test(item.Amount)
    ) {
      item.Amount = 0;
    }

    if (flag === "fromStatus") {
      document.getElementById("save-btn" + item.SchemeID).style.visibility =
        "hidden";
      document.getElementById("cancel-btn" + item.SchemeID).style.visibility =
        "hidden";
      document.getElementById("edit" + item.SchemeID).style.visibility =
        "visible";
      document
        .getElementById("proof-amt" + item.SchemeID)
        .setAttribute("disabled", "disabled");
    }
    this.checkDiscarding = true;
    this.isAmountChanged = true;
    const foundObj = this.schemedeclarationsList.Schemes.find(
      obj => obj.Section === item.Section
    );

    // tslint:disable-next-line: max-line-length
    foundObj.declaredAmount = this.getSectionDeclaredAmount(
      foundObj,
      this.schemedeclarationsList.Schemes[this.schemeNo].subSectiondetails
    );

    if (this.selectedSection === "simulation") {
      // let checkfoundObj = this.schemedeclarationsList.Schemes.find((x, i) => x.subSectiondetails[i].SchemeID === item.SchemeID);
      //foundObj.amountConsider =  temp < this.schemedeclarationsList.Schemes[this.schemeNo].SectionLimit ? temp : this.schemedeclarationsList.Schemes[this.schemeNo].SectionLimit;
      foundObj.amountConsider = this.getAmountConsider(
        foundObj,
        this.schemedeclarationsList.Schemes[this.schemeNo].subSectiondetails
      );
      this.setChapSixValue(this.selectedSection);

      this.initialcalculateTotalTax();
    }
  }

  getProofCount(subScheme) {
    return subScheme.DeclarationDetails ?
      subScheme.DeclarationDetails[0].length :
      0;
  }

  //total tax
  initialcalculateTotalTax() {
    this.totalTaxableSalary = this.originalTaxableSalary;
    this.schemedeclarationsList.Schemes.forEach(obj => {
      // obj.subSectiondetails.forEach((innerobj) => {
      let tempAmount: any = 0;

      // Taxable Income From Previous Employer and Other Income (Int, Dividend, St/lt Capgain)
      // These scheme's values are adding in taxable income which we are doing as follows..

      /*********Start********* */
      const tempArray = obj.subSectiondetails.filter(
        inner => inner.SchemeID === 1 || inner.SchemeID === 7
      );
      tempArray.forEach(item => {
        this.totalTaxableSalary += parseInt(item.Amount);
      });
      /*********ENd********* */

      if (
        obj.Section === "80D" ||
        obj.Section === "80DD" ||
        obj.Section === "80DDB"
      ) {
        this.calculateTaxableIncome(obj.subSectiondetails);
      } else {
        tempAmount = this.totalTaxableSalary - obj.amountConsider;
        this.totalTaxableSalary = tempAmount <= 0 ? 0 : tempAmount;
      }

      //this.calculateIncomeTax( obj);
      // });
    });

    this.calculateFinalTax();
  }

  calculateTaxableIncome(tempArray) {
    let Amount = 0;
    let tempLimit = 0;
    const foundObj = tempArray.filter(
      obj => obj.SchemeID == 12 || obj.SchemeID == 13
    );
    if (foundObj[0]) {
      Amount = foundObj.reduce((n, x) => n + parseInt(x.Amount), 0);
      tempLimit = foundObj[0].Limit;

      if (Amount >= tempLimit) {
        this.totalTaxableSalary -= tempLimit;
      } else if (Amount < tempLimit) {
        this.totalTaxableSalary -= Amount;
      }
    }

    tempArray.forEach(obj => {
      if (obj.SchemeID !== 12 && obj.SchemeID !== 13) {
        if (obj.Amount >= obj.Limit) {
          this.totalTaxableSalary -= parseInt(obj.Limit);
        } else if (obj.Amount < obj.Limit) {
          this.totalTaxableSalary -= parseInt(obj.Amount);
        }
      }
    });
  }

  calculateFinalTax() {
    let amount: any;
    let total = 0;
    this.totalTaxableAmount = 0;

    if (this.totalTaxableSalary > 250000) {
      if (this.totalTaxableSalary > 250000) {
        amount =
          this.totalTaxableSalary > 500000 ?
            (500000 - 250000) * 0.05 :
            (this.totalTaxableSalary - 250000) * 0.05; //param minus from 250000
        total += amount;
      }
      if (this.totalTaxableSalary > 500000) {
        amount =
          this.totalTaxableSalary > 1000000 ?
            (1000000 - 500000) * 0.2 :
            (this.totalTaxableSalary - 500000) * 0.2; //param minus from 500000
        total += amount;
      }
      if (this.totalTaxableSalary > 1000000) {
        amount = (this.totalTaxableSalary - 1000000) * 0.3; //param minus from 500000
        total += amount;
      }
    }

    const education_cess = total * 0.04;
    this.totalTaxableAmount = total + education_cess;

    //cess  4%
    // this.totalTaxableAmount += (this.totalTaxableAmount * 4) / 100;
    // this.totalTaxableAmount = Math.round(this.totalTaxableAmount * 100) / 100;

    this.showMessage = true;
    //this.totalTaxableSalary = this.originalTaxableSalary;
    const foundObj = this.salaryDetails.find(obj => obj.index == 8);
    if (foundObj) {
      foundObj.value = this.totalTaxableAmount;
    }

    //$('#successModal').modal('show');
    //this.successMsg = "Your total calculated tax amount is " + this.totalTaxableAmount[i];
  }

  openSlabInfo(regimeType) {
    $('#slabInfoModal').modal('show');
  }

  setSelectedSection(flag, typeofSelection?) {
    //debugger;
    this.IspreviousYearSelected = false;
    if (flag === this.selectedSection && typeofSelection === this.typeofSelection) {
      return false
    }

    if (typeofSelection !== 'taxRegime') {
      this.simulatedDetails = [];

    } else if (typeofSelection === 'taxRegime' &&
       ( this.originalschemedeclarationsList.simulationCount === 0 ||
        this.originalschemedeclarationsList.simulationCount === null )) {
      $('#regimeNotAllowed').modal('show');
      return;
    }

    this.selectedSection = null;
    this.typeofSelection = typeofSelection;

    if (this.ValueChanged) {
      $("#conformationModal").modal("show");
      this.yesAction = flag;
    } else {
      if (this.isAmountChanged) {

        $("#conformationModal").modal("show");
        this.yesAction = flag;

      } else if (!this.isAmountChanged) {

        this.selectedSection = null;

        if (typeofSelection === 'get_previous') {
          this.IspreviousYearSelected = true;
        }

        if (flag !== 'simulation') {
          this.getTaxableAmount(flag);
        } else {
          // this.contentProcessing = true;
          this.isDeclartionmade = true;
        }

        setTimeout(() => {
          this.yesAction = flag;
          this.selectedSection = flag;
          if ( this.selectedRegimeType === null &&
            this.selectedSection !== 'declaration' &&
            this.typeofSelection !== 'taxRegime' ) {

         $('#warningSimulationModal').modal('show');
       }
        }, 1000);
      }
    }
  }



  simulateDetails() {

    this.simulationDetails.calculateIncomeTaxDetails();
    console.log('Calculate', this.simulationDetails)
    const idArrar = [2, 3, 9, 10, 12, 14, 15, 18, 19, 20, 21, 22, 24, 25];
    const tempArray = this.simulatedDetails.calculatorComponents.filter(obj => idArrar.includes(obj.id))
      .map(obj => {
        return {
          id: obj.id,
          Old_Amount: obj.Old_Amount,
          New_Amount: obj.New_Amount
        }
      });
    let url = Constant.InsertITCalculatorlog;
    let req = {
      tokenid: this.localUserData.TokenId,
      eventNo: null,
      fiscalYear: null,
      createdby: this.localUserData.TokenId,
      taxSummary: this.simulatedDetails.taxSummary,
      SectionSimulatedDetails: tempArray
    };

    this._services.postService(url, req).then(resp => {
      // debugger;
      // if (resp === "Suceess") {

      this.originalschemedeclarationsList.simulationCount = this.originalschemedeclarationsList.simulationCount === 0 ?
        1 : this.originalschemedeclarationsList.simulationCount
      //      }

    });

  }
  IsHRAIncomeProofsAdded() {
    let flag: any;
    flag = this.schemedeclarationsList.Schemes.filter(obj => obj.Section === 'General')[0].subSectiondetails.map(obj => {
      if (obj.SchemeID === 2 || obj.SchemeID === 6) {
        return obj.Amount > 0 && obj.DeclarationDetails === null;
      }
    });

    return flag.indexOf(true) !== -1 ? true : false;
  }

  confirmationBox(yesAction) {

    if (this.withDisability || this.withSeverDisability) {
      this._services.showSnackbar({
        status: "Please enter valid amount in section 80U"
      });
      return false;
    }

    if (!this.isNonSeniorMedicalValid || !this.isSeniorMedicalValid) {
      this._services.showSnackbar({
        status: "Please enter valid amount in section 80DDB"
      });
      return false;
    }

    if (!this.isNonSevereDisabilityValid || !this.isSevereDisabilityValid) {
      this._services.showSnackbar({
        status: "Please enter valid amount in section 80DD"
      });
      return false;
    }

    this.declaredSchmes = [];
    this.schemedeclarationsList.Schemes.forEach(item => {
      item.subSectiondetails.forEach(innerItem => {
        if (innerItem.Amount !== 0 && innerItem.Status !=="Approved") {
          this.declaredSchmes.push({
            SchemeName: innerItem.SchemeName,
            Amount: innerItem.Amount,
            originalStatus: innerItem.Status,
            Status: 'Pending',
            isProofsAttched: innerItem.Proofs && innerItem.Proofs.length !== 0 ?
              "Yes" :
              "No"
          });

        }
      });
    });

    this.notSubmittedSchemes = [];
    this.notSubmittedSchemes = this.declaredSchmes.filter(s => s.originalStatus === null);
    // if(this.notSubmittedSchemes.length !==0 ){
    //   $("#notSubmittedModal").modal('show');
    //   return;
    // }
    this.yesAction = yesAction;
    switch (true) {
      case yesAction === "sendApproval" && !this.DeclarationPeriod:
        this._services.showSnackbar({
          status: "You cannot make declaration now."
        });
        break;

      case yesAction === 'sendApproval' && !this.ActualsPeriod && this.IsHRAIncomeProofsAdded():
        $("#noHRAIncomePresentModal").modal({
          backdrop: "static",
          keyboard: false
        });
        break;

      case yesAction === "sendApproval" && this.DeclarationPeriod:
        this.declaredSchmes = this.declaredSchmes.concat(this.deletedSchemes);
        if (this.declaredSchmes.length === 0) {
          this._services.showSnackbar({
            status: "No declaration made yet."
          });
        } else {
          $("#conformationModal").modal("show");
        }

        break;
      case yesAction === "discard_sim" || yesAction === "discard_new":
        $("#conformationModal").modal("show");
        break;

      default:
        this.onYesAction();
        break;
    }

    // if(yesAction === 'sendApproval' && !this.DeclarationPeriod){

    //   this._services.showSnackbar({ 'status': 'You cannot make declaration now.' });

    // }else if ((yesAction === 'sendApproval' && this.DeclarationPeriod) || yesAction === 'discard_sim' || yesAction === 'discard_new' ) {

    //     this.schemedeclarationsList.Schemes.forEach((item) => {
    //       item.subSectiondetails.forEach((innerItem) => {
    //           if(innerItem.Amount !== 0)
    //            this.declaredSchmes.push({'SchemeName':innerItem.SchemeName, 'Amount':innerItem.Amount, 'isProofsAttched':innerItem.Proofs=== null?'No':'Yes'})
    //       });
    //     });

    //   $('#conformationModal').modal('show');
    // } else {

    //   this.onYesAction();
    // }
  }

  sendToApproval(statusFlag) {
    this.saveClicked = false;
    this.yesAction = "sendToApproval";
    const NewSchemesArray = [];
    let flag: any;
    this.successFromDeclaration = undefined;

    if (this.withDisability || this.withSeverDisability) {
      this._services.showSnackbar({
        status: "Please enter valid amount in section 80U"
      });
      return false;
    }
    if (!this.isNonSeniorMedicalValid || !this.isSeniorMedicalValid) {
      this._services.showSnackbar({
        status: "Please enter valid amount in section 80DDB"
      });
      return false;
    }

    if (!this.isNonSevereDisabilityValid || !this.isSevereDisabilityValid) {
      this._services.showSnackbar({
        status: "Please enter valid amount in section 80DD"
      });
      return false;
    }


    this.schemedeclarationsList.Schemes.forEach(item => {

      item.subSectiondetails.forEach(innerItem => {
        if(innerItem.Amount !== 0 &&
          innerItem.Status !== "Approved" &&
          innerItem.Status !== "Rejected") {
          innerItem.Status = innerItem.Amount !== 0 ? "Pending" : innerItem.Status;
          NewSchemesArray.push(innerItem);
        }
        // if (innerItem.Status != "Approved" && innerItem.Status != "Rejected") {
        //   if (
        //     innerItem.SchemeID == "14" ||
        //     innerItem.SchemeID == "15" ||
        //     innerItem.SchemeID == "23" ||
        //     innerItem.SchemeID == "40" ||
        //     innerItem.SchemeID == "44"
        //   ) {
        //     innerItem.Status =
        //       innerItem.Amount !== 0 && innerItem.Status === null ?
        //         "Pending" :
        //         innerItem.Status;
        //   } else if (innerItem.Amount > 0 && innerItem.Status === null) {
        //     innerItem.Status = 'Pending';
        //   }


        //   if (statusFlag == "Save" && innerItem.Status != "Pending") {
        //     NewSchemesArray.push(innerItem);
        //   } else if (statusFlag !== "Save") {
        //     NewSchemesArray.push(innerItem);
        //   }
        // }
      });
    });

    NewSchemesArray.forEach((item, i) => {
      if (
        item.ProofRequired &&
        item.DeclarationDetails === null &&
        item.OfflineProof === false
      ) {
        // && item.Amount !==0
        flag = true;
        // this.notProofsUpdated.push(item);
      }
    });

    // this.spinnerService.show();
    let requestTokenId = this.localUserData.TokenId;
    if (this._services.clickFrom == "admin") {
      requestTokenId = this._services.empToken;
    }
    const data = {
      RequestType: statusFlag,
      TokenId: this.localUserData.TokenId,
      RequestTokenId: requestTokenId,
      // "TokenId": this._storage.get('username').TokenId,
      FiscalYear: this.fiscalYear,
      Schemes: NewSchemesArray
    };

    const url = Constant.SubmitIncomeTaxDeclarations;
    console.log('REQ', data)
    this._services.postService(url, data).then((resp: any) => {

      this.successFromDeclaration = resp;
      // this.spinnerService.hide();

      if (resp == "Success") {
        this.isAmountChanged = false;
        if (this.selectedSection === "simulation") {
          this.isSimulationExists = true;
          this.checkDiscarding = true;
        } else {
          this.isDeclarationExists = true;
          this.checkDiscarding = true;
        }

        if (statusFlag === "Save") {
          this.saveClicked = true;
          $("#successMessageModal").modal({
            backdrop: "static",
            keyboard: false
          });
          this.setSelectedSection("declaration", '');
        } else {
          $("#successMessageModal").modal({
            backdrop: "static",
            keyboard: false
          });
        }

        this.ValueChanged = false;

      } else {
        this._services.showSnackbar({
          status: "Something went wrong! Please try again."
        });
      }
    });
  }

  newDeclaration() {
    const url = Constant.DeleteITDeclarations;
    const data = {
      tokenid: this.localUserData.TokenId,
      // "tokenid": this._storage.get('username').TokenId,
      fiscal_year: this.fiscalYear
    };

    this._services.postService(url, data).then(response => {
      this.isDeclarationExists = false;
      this.checkDiscarding = false;
      this.getTaxableAmount(this.selectedSection);
    });

    // this.schemedeclarationsList.Schemes.forEach((object) => {
    //   object.subSectiondetails.forEach((innerObj) => {
    //     innerObj.Amount = 0;
    //     innerObj.DeclarationDetails = null;
    //     innerObj.DeclarationDetailsIds = null;
    //     innerObj.DeclarationId = null;
    //     innerObj.OfflineProof = null;
    //   })
    //   object.amountConsider = 0;
    //   object.declaredAmount = 0;
    // })
    // this.totalTaxableSalary = 0;
    // this.totalTaxableAmount = 0;
  }

  openInfoModal(subScheme) {
    $("#informationModal").modal("show");
    this.selectedInfoIcon = subScheme;
    // debugger;
    this.infoScheme = SchemeInformation.schemeInfoArray.find(
      obj => obj && obj.schemID.includes(subScheme.SchemeID)
    );
  }

  regimeSelection() {

  }

  importFromSimulation() {
    // Check if user move from simulation to declaration without saving
    let totalAmount = 0;
    if (this.simulationList !== undefined) {
      this.simulationList.forEach(obj => {
        totalAmount += obj.subSectiondetails.reduce((n, x) => n + x.Amount, 0);
      });
    }
    if (this.simulationList !== undefined && totalAmount !== 0) {
      this.simulationList.forEach((obj, i) => {
        this.schemedeclarationsList.Schemes[i].SectionLimit = obj.SectionLimit;
        this.schemedeclarationsList.Schemes[i].amountConsider =
          obj.amountConsider;
        this.schemedeclarationsList.Schemes[i].declaredAmount =
          obj.declaredAmount;
        obj.subSectiondetails.forEach((innerObj, j) => {
          if (
            this.schemedeclarationsList.Schemes[i].subSectiondetails[j] !==
            undefined &&
            this.schemedeclarationsList.Schemes[i].subSectiondetails[j]
              .SchemeID !== 2
          ) {
            this.schemedeclarationsList.Schemes[i].subSectiondetails[
              j
            ].Status = null;
            this.schemedeclarationsList.Schemes[i].subSectiondetails[j].Amount =
              innerObj.Amount;
          }
        });
      });
      this._services.showSnackbar({
        status: "Data imported successfully!"
      });
    } else {
      this._services.showSnackbar({
        status: "No calculated record found!"
      });
    }
  }

  onYesAction() {
    if (this.yesAction == "sendApproval") {
      this.sendToApproval("Pending");
    } else if (this.yesAction === "discard_new") {
      this.newDeclaration();
    } else if (this.yesAction === "discard_sim") {
      this.importFromSimulation();
    } else if (
      this.yesAction === "simulation" ||
      this.yesAction === "declaration" ||
      this.selectedSection === "declaration"
    ) {
      this.selectedSection = this.yesAction;
      this.isAmountChanged = false;
      this.ValueChanged = false;
      this.getTaxableAmount(this.selectedSection);
    }
  }

  // isSchemeDeclared(scheme) {

  //   return !(scheme.subSectiondetails.length === 0);

  // }

  onInFocus(subScheme) {
    if (subScheme.Amount === 0 || subScheme.Amount === "0") {
      subScheme.Amount = "";
    }
  }
  openDeclarationStatusModal(subScheme) {
    this.subScheme = subScheme;
    if (this.subScheme.DeclarationDetails !== null) {
      this.subSchemeKeys = Object.keys(this.subScheme.DeclarationDetails[0][0]);
    }
    $("#statusDetails").modal("show");
  }

  getFileName(path) {
    return path.split("/").pop();
  }

  fileExt(filePath) {
    const ext = this.getFileName(filePath)
      .split(".")
      .pop()
      .toLowerCase();
    if (ext == "png" || ext == "jpg" || ext == "jpeg") {
      return "image";
    } else if (ext == "pdf") {
      return "pdf";
    } else {
      return "invalid";
    }
  }
  openRejectionModal(subScheme) {
    this.subScheme = subScheme;
    $("#rejectionModal").modal("show");
  }
  openUploadModal() {
    $("#uploadModal").modal("show");
  }

  getAlertMessage() {
    // if(this.isAmountChanged && (this.yesAction === 'discard_sim' ||this.yesAction === 'discard_new')){
    //   return 'Are you sure you want to over-ride all existing data?';
    // }else if(this.isAmountChanged){
    //   return'Your changes are unsaved. Are you sure you want to leave?';
    // }else{

    if (this.yesAction === "sendApproval") {
      return "Are you sure you want to submit?";
    }
    if (this.yesAction === "discard_sim" || this.yesAction === "discard_new") {
      return "Are you sure you want to over-write all existing data?";
    }
    if (
      this.yesAction === "simulation" ||
      this.yesAction === "declaration" ||
      this.yesAction === "declarationStatus" ||
      this.yesAction == "taxProjection"
    ) {
      return "Your changes are unsaved. Are you sure you want to leave?";
    }

    // }
  }

  showDeclarationLogs(subScheme) {
    this.spinnerService.show();

    this.subScheme = subScheme;
    const data = {
      tokenid: this.localUserData.TokenId,
      SchemeId: subScheme.SchemeID
    };

    const url = Constant.getITLogs;

    //   this.spinnerService.show();
    this._services.postService(url, data).then((resp: any) => {
      this.spinnerService.hide();
      let abc = [];
      this.schemeLogs = resp;
      if (this.schemeLogs.Schemes.length !== 0) {
        abc = Object.keys(this.schemeLogs.Schemes).filter(
          obj => obj === "Amount" || obj === "Status"
        );
      }
      setTimeout(() => {
        $("#logDetails").modal({
          backdrop: "static",
          keyboard: false
        });
      }, 1000);
    });
  }

  getImageCount(log) {
    if (log.DeclarationDetails === null) {
      return "No";
    } else {
      // let count = 0;
      // log.DeclarationDetails.forEach((item) => {

      //   count += item.Proofs.length;
      // })
      if (
        log.DeclarationDetails[0].Proofs === null ||
        log.DeclarationDetails[0].Proofs.length === 0
      ) {
        return "No";
      } else {
        return "Yes";
      }
    }
  }

  getimages(log) {
    let fileArray = [];
    if (log.DeclarationDetails === null) {
      fileArray = [];
    } else {
      log.DeclarationDetails.forEach(item => {
        item.Proofs.forEach(innerItem => {
          fileArray.push({
            fileName: this.getFileName(innerItem.Path),
            filePath: innerItem.Path,
            fileExt: this.fileExt(innerItem.Path)
          });
        });
      });
    }
    return fileArray;
  }

  getProofs(log) {
    const fileArray = [];
    // log.DeclarationDetails = [{"Id":102,"SalaryUS17":78.00,"ExemptionsUS10":7987.00,"ProfessionalTax":70.00,"PF":797.00,"IncomeTaxDeducted":7.00,"MedicalExemption":98785.00,"LTAExemptions":8.00,"LTACarriedForward":987.00,"LeaveEncashmentExmp":878978.00,"GratuityExemption":98.00,"VRSExemption":97.00,"PerquisiteUS17":686.00,"SurchargeDeducted":979.00,"EduCessDeducted":7987.00,"Remarks":"","Proofs":[{"Id":355,"Path":"https://mmfss-econnectweb.azurewebsites.net/ITDeclarationProofs/201931913368020.png"},{"Id":356,"Path":"https://mmfss-econnectweb.azurewebsites.net/ITDeclarationProofs/201931913368021.pdf"}]}]
    if (log.DeclarationDetails === null) {
      return fileArray;
    } else {
      log.DeclarationDetails.forEach(item => {
        item.Proofs.forEach(innerItem => {
          fileArray.push(this.getFileName(innerItem.Path));
        });
      });
      return fileArray.toString();
    }
  }

  checkIfdeclared80U(value, SchemeNo) {
    let SchemeDOM = document.getElementById("proof-amt" + SchemeNo) as HTMLInputElement;
    let amount = parseInt(value);
    if (amount > 0) {
        this.eightyValue = SchemeNo;
      if (SchemeDOM !== null) SchemeDOM.setAttribute("disabled", "disabled");
    } else {
        this.eightyValue = "";
      if (SchemeDOM !== null) SchemeDOM.removeAttribute("disabled");
    }
  }

  checkValue(value, SchemeID) {

    if (SchemeID == 14) {
        //this.eightyValue = 15;
        this.checkIfdeclared80U(value, 15);

      if (parseInt(value) >= 75001) {
        this.withDisability = true;
      } else {
        this.withDisability = false;
      }
    } else if (SchemeID == 15) {
        //this.eightyValue = 14;
        this.checkIfdeclared80U(value, 14);

      if (parseInt(value) >= 125001) {
        this.withSeverDisability = true;
      } else {
        this.withSeverDisability = false;
      }
    }

    if (SchemeID === 21) {
      if (parseInt(value) >= 100001) {
        this.isSeniorMedicalValid = false;
      } else {
        this.isSeniorMedicalValid = true;
      }
    } else if (SchemeID === 22) {
      if (parseInt(value) >= 40001) {
        this.isNonSeniorMedicalValid = false;
      } else {
        this.isNonSeniorMedicalValid = true;
      }
    }

    if (SchemeID === 17) {
      if (parseInt(value) >= 125001) {
        this.isSevereDisabilityValid = false;
      } else {
        this.isSevereDisabilityValid = true;
      }
    } else if (SchemeID === 16) {
      if (parseInt(value) >= 75001) {
        this.isNonSevereDisabilityValid = false;
      } else {
        this.isNonSevereDisabilityValid = true;
      }
    }
  }

  isNumber(evt, obj) {
        evt = evt ? evt : window.event;
    let charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  editAmount(Scheme) {
    const property = document.getElementById("proof-amt" + Scheme.SchemeID) as HTMLInputElement;

    if (property.disabled) {
          Scheme.previousAmount = Scheme.Amount;
      document.getElementById("save-btn" + Scheme.SchemeID).style.visibility =
        "visible";
      document.getElementById("cancel-btn" + Scheme.SchemeID).style.visibility =
        "visible";

      document.getElementById("edit" + Scheme.SchemeID).style.visibility =
        "hidden";

      document
        .getElementById("proof-amt" + Scheme.SchemeID)
        .removeAttribute("disabled");
    }

        }

  isDisabled(subScheme) {
    const Actual = this.ActualsPeriod;
    if (((subScheme.SchemeID === 8 || subScheme.SchemeID === 10) && this.employeeAge >= 60) || (subScheme.SchemeID === 9 && this.employeeAge < 60)) {
      return true;
    }
    return this.selectedSection === 'declarationStatus' || ((Actual || subScheme.SchemeID === 2 || subScheme.SchemeID === 6 || subScheme.SchemeID === 7) && (this.selectedSection === 'declaration' &&
        subScheme.ProofRequired)) || subScheme.SchemeCategory === '80TTA' || subScheme.SchemeCategory ===
      '80TTB' || this.eightyValue === subScheme.SchemeID;
  }

  isEditEnabled(subScheme) {
    const Actual = this.ActualsPeriod;
    let flag = false;
    if (Actual || subScheme.SchemeID === 2 || subScheme.SchemeID === 6 || subScheme.SchemeID === 7) {
          flag = true;
    }
    flag = flag && ((subScheme.ProofRequired && !subScheme.OfflineProof) && this.selectedSection === 'declaration')
    return flag;
  }

  cancel(subScheme) {
          subScheme.Amount = subScheme.previousAmount;
    document.getElementById("edit" + subScheme.SchemeID).style.visibility =
      "visible";
    document.getElementById(
      "cancel-btn" + subScheme.SchemeID
    ).style.visibility = "hidden";
    document.getElementById("save-btn" + subScheme.SchemeID).style.visibility =
      "hidden";
    document
      .getElementById("proof-amt" + subScheme.SchemeID)
      .setAttribute("disabled", "disabled");
  }

  onRegimeSelect() {
      this.selectedSection = 'simulation';
      this.getTaxableAmount(this.selectedSection);
  }

  ngOnDestroy() {
          //this.ActualsPeriod = false;
          this.DeclarationPeriod = false;
  }

  canDeactivate() {
    if (this.isAmountChanged) {
      if (
        confirm("Your changes are unsaved. Are you sure you want to leave?")
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
