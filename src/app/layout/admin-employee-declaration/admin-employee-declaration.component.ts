import { HttpClient } from '@angular/common/http';
import { Constant } from './../../services/constant';
import { CommonService } from './../../services/common.service';
import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormBuilder } from '@angular/forms';
import { CommonArray } from '../../services/commonArray';
import { ActivatedRoute } from '@angular/router';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-admin-employee-declaration',
  templateUrl: './admin-employee-declaration.component.html',
  styleUrls: ['./admin-employee-declaration.component.scss']
})
export class AdminEmployeeDeclarationComponent implements OnInit {

  localUserData: any;
  userInfo: any;
  isSimulationExists: any;
  isDeclarationExists: any;
  isAmountChanged: boolean;
  simulationList: any[];
  yesAction: string;
  selectedSection: any = 'declaration';
  flag: any;
  selectedSchemeId: string;
  modalSchemeId: any;
  oldtitle: any;
  salaryDetails: any = [];
  selectedType: any = 'yearly';
  declaredArrayList: any = [];
  ngForm: any;
  showInfo = false;
  totalTaxableSalary: number;
  originalTaxableSalary = 0;
  totalTaxableAmount: number;
  totalDeclaredAmount = 0;
  showMessage = false;
  fiscalYear: number;
  items: any = [{}];
  schemedeclarationsList: any = [];
  unsavedbtnList: any = [];
  isAdminIT = false;
  schemeNo: any;
  selectedScheme: any;
  selectedRegime: string;
  empToken: any;
  actionType: string;
  adminRemark: string;
  errMsg: boolean;
  offlineObj: any;
  empName: any;
  adminRemarks: string = '';
  amountInput: any;
  okModalTitle: string;
  okModalBody: string;
  declarationIdsApproval: any[];
  titlemessage: string;
  bodyMessage: string;
  dependentDetails: any;
  dependentMotherName: any;
  dependentFatherName: any;
  dependentSpouseName: any;
  dependentChildName: any;
  emittedProofArray: any;
  dependentAllChild: any;
  employeeAge: any;
  userDetails: any;
  withDisability: boolean;
  withSeverDisability: boolean;
  eightyValue: any;
  empAge: any;
  RegimeType: any;

  constructor(
    private _services: CommonService,
    public spinnerService: Ng4LoadingSpinnerService,
    public formBuilder: FormBuilder,
    public http: HttpClient,
    public route: ActivatedRoute
  ) {
    this._services.successData.subscribe(resp => {

      if (resp !== null) {
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
            // foundObj.Amount = foundObj.Amount === 0 ? resp.Amount : foundObj.Amount;  //Uncomment if want to take amount from modal.
            foundObj.Amount = resp.Amount;
            foundObj.Status = 'Pending';
            //foundObj.Amount ? foundObj.Amount : resp.Amount;
            if (resp.entryType == 'multiple') {
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
        $('#finalsubmitMessageModal').modal({
          backdrop: 'static',
          keyboard: false
        });

      }
    });
  }

  async ngOnInit() {
    this.fiscalYear = 2019;
    this.amountInput = {};
    this.declarationIdsApproval = [];
    this.route.queryParams.subscribe((dt: any) => {
      this._services.decrypt(dt.T).then(decToken => {
        this.empToken = decToken;
        Promise.resolve(decToken);
      }).then(decToken => {
        return this._services.decrypt(dt.EN).then((decEmpName) => {
          this.empName = decEmpName;
          return;
        })
      }).then(async () => {
        this.localUserData =  await this._services.getUserDetail();
        this.userInfo = this.localUserData;
        this.userInfo.ModulesAdmin[0].IsIncomeTaxAdmin;
        this.isAdminIT = this.userInfo.ModulesAdmin[0].IsIncomeTaxAdmin;
        await this.getProfileDetails();
        await this.getEmployeeDeclarations();
      })

    });
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

  checkisNaN(value) {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
  }

  closeModal() {
    this.flag = !this.flag;
  }

  getRelationName(tempArray, relationName) {
    if (!tempArray) {
      return false;
    }
    const foundObj = tempArray.find(obj => obj.Relationship === relationName);

    if (foundObj) {
      return foundObj.Name;
    } else {
      return '';
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
      return '';
    }
  }

  async getProfileDetails() {
    const param = {
      tokenid: this.localUserData.TokenId,
      requestToken: this.empToken
    };
    const url = Constant.GetBasicProfile;
    this._services.spinnerService.show();
    const data = await this._services.postService(url, param);
    this._services.spinnerService.hide();
    this.userDetails = data;
    this.dependentDetails = this.userDetails.dependants;
      this.dependentAllChild = this.getAllChilds(
        this.dependentDetails,
        'Child'
      );
  }

  getAllChilds(tempArray, relationName) {
    if (!tempArray) {
      return [];
    }
    const foundObj = tempArray.filter(obj => obj.Relationship === relationName);
    const temp = [];
    if (foundObj) {
      foundObj.forEach(obj => {
        temp.push({ value: obj.Name, label: obj.Name, Gender: obj.Gender });
      });
      return temp;
    } else {
      return [];
    }
  }
  // Open Modal by rendering the modal Component using schemes
  openModalComponent(obj) {
    console.log('LOA', obj);
    if (obj.Section === '80DD') {
      let declaredScheme = this.schemedeclarationsList.Schemes.filter(
        obj => obj.Section === '80DD'
      )[0].subSectiondetails.filter(obj => obj.Amount > 0);

      if (
        declaredScheme.length > 0 &&
        declaredScheme[0].SchemeID !== obj.SchemeID
      ) {
        this._services.showSnackbar({
          status: 'Sorry! Only one declaration is allowed in 80DD '
        });

        return;
      }
      console.log('declaredScheme', declaredScheme);
    }
    if (obj.ProofRequired) {
      this.adminRemark = obj.Status !== 'Pending' ? obj.AdminRemarks : null;
      if (obj.OfflineProof) {
        this.offlineObj = obj;
        $('#offlineModal').modal({
          backdrop: 'static',
          keyboard: false
        });
        this.errMsg = false;
        return false;
      }
      this._services.admindeclarationDetails = obj;
      this.selectedSchemeId = obj.SchemeID;
      this._services.declarationId = this.selectedSchemeId;

      this.flag = !this.flag;

      this._services.empName = this.empName;
      this._services.empAge = this.empAge;
      this._services.userDetails = {

        dependentMotherName: this.getRelationName(
          this.dependentDetails,
          'Mother'
        ),
        dependentFatherName: this.getRelationName(
          this.dependentDetails,
          'Father'
        ),
        dependentSpouseName: this.getRelationName(
          this.dependentDetails,
          'Spouse'
        ),
        dependentChildName: this.getRelationName(
          this.dependentDetails,
          'Child'
        ),
        dependentAllChild: this.dependentAllChild,
        dependentMotherAge: this.getRelationAge(
          this.dependentDetails,
          'Mother'
        ),
        dependentFatherAge: this.getRelationAge(
          this.dependentDetails,
          'Father'
        ),
        dependentSpouseAge: this.getRelationAge(
          this.dependentDetails,
          'Spouse'
        ),
        dependentChildAge: this.getRelationAge(this.dependentDetails, 'Child')
      };

      this._services.clickFrom = 'admin';
      this._services.empToken = this.empToken;

      switch (obj.SchemeID) {

        case 2:
          this._services.formControlFields = CommonArray.HRAformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.HRA;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 25:
          this._services.formControlFields = CommonArray.LICformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.LIC;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 27:
          this._services.formControlFields = CommonArray.ULIPformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.ULIP;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 28:
          this._services.formControlFields = CommonArray.PPFformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.PPF;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 29:
        case 30:
          this._services.formControlFields = CommonArray.NSCformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.NSC;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 35:
        case 36:
          this._services.formControlFields =
            CommonArray.ChildTuitionFeeformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.ChildTuitionFee;
          this._services.entryType = 'single';
          this._services.schemeDeclaration = this.schemedeclarationsList.Schemes;
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 31:
          this._services.formControlFields =
            CommonArray.HousingLoanformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.HousingLoan;
          this._services.entryType = 'single';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 32:
          this._services.formControlFields =
            CommonArray.NotifiedMutualFundformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.NotifiedMutualFund;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 20:
          this._services.formControlFields =
            CommonArray.NotifiedMutualFundformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.NotifiedPensionFund;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 37:
          this._services.formControlFields =
            CommonArray.SukanyaSamriddhiSchemeformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.SukanyaSamriddhiScheme;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 38:
          this._services.formControlFields =
            CommonArray.PostOfficeDepositformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.PostOfficeDeposit;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 39:
          this._services.formControlFields =
            CommonArray.ScheduledBankDepositformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.ScheduledBankDeposit;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 19:
          this._services.formControlFields =
            CommonArray.CertainPensionFundsformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.CertainPensionFunds;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 40:
          this._services.formControlFields =
            CommonArray.InterestFirstTimeHomeBuyerformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray =
            CommonArray.InterestFirstTimeHomeBuyer;
          this._services.entryType = 'single';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 8:
          this._services.formControlFields =
            CommonArray.MedicalEightyDformControlFieldsNonSeniorSelf;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray =
            CommonArray.MedicalEightyDSelfNonSenior;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          console.log(
            'this._services.previousDeclarationDetails',
            this._services.previousDeclarationDetails,
            obj.DeclarationDetails
          );
          break;
        case 9:
          this._services.formControlFields =
            CommonArray.MedicalEightyDformControlFieldsSeniorSelf;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray =
            CommonArray.MedicalEightyDSelfSenior;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 10:
          this._services.formControlFields =
            CommonArray.MedicalEightyDformControlFieldsNonSeniorParent;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray =
            CommonArray.MedicalEightyDParentNonSenior;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 11:
          this._services.formControlFields =
            CommonArray.MedicalEightyDformControlFieldsSeniorParent;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray =
            CommonArray.MedicalEightyDParentSenior;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 12:
          this._services.formControlFields =
            CommonArray.MedicalEightyDformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.MedicalEightyDSelf;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 13:
          this._services.formControlFields =
            CommonArray.MedicalEightyDformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.MedicalEightyDParents;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 1:
          this._services.formControlFields =
            CommonArray.PreviousEmployerformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.PreviousEmployer;
          this._services.entryType = 'single';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 7:
          this._services.formControlFields =
            CommonArray.IncomeOtherSourcesformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.IncomeOtherSources;
          this._services.entryType = 'single';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 17:
          this._services.formControlFields =
            CommonArray.DependentSeverDisabilityformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray =
            CommonArray.DependentSeverDisability;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 16:
          this._services.formControlFields =
            CommonArray.DependentDisabilityformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.DependentDisability;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 22:
          this._services.formControlFields =
            CommonArray.MedicalTreatmentformControlFieldsNonSenior;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray =
            CommonArray.MedicalTreatmentNonSenior;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 21:
          this._services.formControlFields =
            CommonArray.MedicalTreatmentformControlFieldsSenior;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.MedicalTreatmentSenior;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 18:
          this._services.formControlFields =
            CommonArray.LoanHigherEducationformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.LoanHigherEducation;
          this._services.entryType = 'single';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        case 6:
          this._services.formControlFields =
            CommonArray.IncomeHousePropertyformControlFields;
          this._services.modalHeader = obj.SchemeName;
          this._services.fieldDetailsArray = CommonArray.IncomeHouseProperty;
          this._services.entryType = 'multiple';
          this._services.previousDeclarationDetails = obj.DeclarationDetails;
          break;
        default:
          this._services.formControlFields = [];
          this._services.fieldDetailsArray = [];
          this._services.modalHeader = 'No Proofs Require';
          break;
      }
    }
  }

  confirmationBox(action) {
    this.actionType = action;
    if (this.actionType == 'reject' && !this.adminRemark) {
      this.errMsg = true;
      return false;
    }
    this.errMsg = false;
    // $('#ProofModal').modal('hide');
    $('#adminConformationModal').modal({
      backdrop: 'static',
      keyboard: false
    });
  }

  adminConfirmation(action, declaration) {
    if (
      this.declarationIdsApproval.indexOf(declaration.DeclarationId) === -1 &&
      action !== 'reject'
    ) {
      this._services.showSnackbar({
        status: 'Please click on Consider for actuals'
      });
      return false;
    }

    this.actionType = action;
    this.offlineObj = declaration;
    if (action === 'approve') {

      $('#approveModal').modal({
        backdrop: 'static',
        keyboard: false
      });

    } else if (action === 'reject') {

      this.adminRemark = null;
      $('#rejectModal').modal({
        backdrop: 'static',
        keyboard: false
      });

    }
  }


  considerForActuals(declaration: any, ev) {
    let val = ev.target.checked;
    let id = declaration.DeclarationId ? declaration.DeclarationId : undefined;

    if (val === true) {
      this.declarationIdsApproval.push(id);
    } else {
      this.declarationIdsApproval.splice(
        this.declarationIdsApproval.findIndex(x => x == id),
        1
      );
    }

  }

  checkboxConsiderActuals(id) {
    if (this.declarationIdsApproval.findIndex(x => x == id) > -1) {
      return true;
    } else {
      return false;
    }
  }

  confirmMultipleApprove() {
    this.actionType = 'approve';
    $('#adminMultiConformationModal').modal({
      backdrop: 'static',
      keyboard: false
    });
  }

  multipleConsiderForActuals() {
    let url = Constant.AdminApproveRejectDeclarations;
    let declarations = [];
    for (let i = 0; i < this.declarationIdsApproval.length; i++) {
      declarations.push({
        DeclarationId: this.declarationIdsApproval[i],
        Status: 'Approved',
        AdminRemarks: 'Multiple consider for actuals'
      });
    }
    let params = {
      AdminTokenId: this.localUserData.TokenId,
      declarations: declarations
    };
    // console.log(params);
    // return false;
    this.spinnerService.show();
    this._services.postService(url, params).then(data => {
      console.log('SUCCESS', data, this.actionType)
      this.spinnerService.hide();
      if (data == 'Success') {
        this.declarationIdsApproval = [];
        if (this.actionType == 'approve') {
          this.titlemessage = ' Approved Successfully.';
          this.bodyMessage = 'Selected schemes has been approved.';
        } else if (this.actionType == 'reject') {
          this.bodyMessage = 'Selected schemes has been rejected.';
          this.titlemessage = 'Rejected Successfully.';
        }

        $('#successMessage').modal({
          backdrop: 'static',
          keyboard: false
        });

      } else {
      }
    });
  }

  adminApproveReject() {
    let url = Constant.AdminApproveRejectDeclarations;
    let actionType = 'Approved';
    if (this.actionType == 'approve') actionType = 'Approved';
    else if (this.actionType == 'reject') actionType = 'Rejected';

    let params = {
      // "AdminTokenId": this._storage.get('username').TokenId,
      AdminTokenId: this.localUserData.TokenId,
      declarations: [
        {
          DeclarationId: this.offlineObj.DeclarationId,
          Status: actionType,
          AdminRemarks: this.adminRemark ? this.adminRemark : null
        }
      ]
    };
    //console.log(params);
    this.spinnerService.show();
    this._services.postService(url, params).then(data => {
      this.spinnerService.hide();
      if (data == 'Success') {
        debugger;
        this.declarationIdsApproval = [];
        if (actionType == 'Approved') {
          this.titlemessage = 'Approved Successfully.';
          this.bodyMessage = 'Selected scheme has been approved.';
        } else if (actionType == 'Rejected') {
          this.bodyMessage = 'Selected scheme has been rejected.';
          this.titlemessage = 'Rejected Successfully.';
        }

        $('#successMessage').modal({
          backdrop: 'static',
          keyboard: false
        });
      } else {
      }
    });
  }




  getSectionDeclaredAmount(sectionKey, SchemesArray) {
    return SchemesArray.filter(
      obj => obj.Section === sectionKey.Section
    ).reduce((n, x) => n + x.Amount, 0);
  }

  getAmountConsider(sectionKey, SchemesArray) {
    const amount = SchemesArray.filter(
      obj => obj.Section === sectionKey.Section
    ).reduce((n, x) => n + x.Amount, 0);

    if (amount < sectionKey.SectionLimit) {
      return amount;
    } else {
      return sectionKey.SectionLimit;
    }
  }

  getSectionwiseArray(sectionKey, SchemesArray) {

    return SchemesArray.filter(obj => obj.Section === sectionKey.Section).sort(
      function (a, b) {
        if (a.Status === null) return 1;
        else if (a.Sataus !== null) return -1;
        // else return a - b;
      }
    );
  }

  getIsSelected(scheme) {
    return this.selectedScheme.Section === scheme.Section;
  }

  async getEmployeeDeclarations() {
    let url = Constant.AdminGetDeclarationsByToken;
    let param = {
      tokenid: this.localUserData.TokenId,
      emptokenid: this.empToken
    };

    this._services.spinnerService.show();
    const res: any = await this._services.postService(url, param);
    const data = {...res};
    this.empAge = data.empAge;
      data.Scheme.forEach(obj => {
        obj.DeclarationId = obj.DeclarationId === 0 ? null : obj.DeclarationId;
      });
      this.modifydeclarationArray(data);
      if (this.selectedScheme === undefined) {
        this.setSelectedCategory(this.schemedeclarationsList.Schemes[0], 0);
      }else {
        this.setSelectedCategory(this.selectedScheme, this.schemeNo);

      }
      this.showInfo = true;
      this._services.spinnerService.hide();
  }

  modifydeclarationArray(declarationList) {
    const SectionWiseArray = [];
    let uniqueSections;
    uniqueSections = new Set(declarationList.Scheme.map(scheme => scheme.Section));

    uniqueSections.forEach((sname)=> {

      let limit =  declarationList.Scheme.find(scheme => scheme.Section === sname).SectionLimit || 0;
      let subDetails = [];

      subDetails = declarationList.Scheme.filter( scheme => scheme.Section === sname )
                   .sort((a)=> { return a.Status ? -1 : 1 });
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
  }

  setSelectedCategory(scheme, i) {

    let temp: any;
    if (scheme && scheme.Section === '80U') {
      temp = scheme.subSectiondetails.filter(obj => obj.Amount > 0);
      if (temp.length > 0) {
        this.eightyValue = '';
        this.checkValue(temp[0].Amount, temp[0].SchemeID);
      }
    }

    this.selectedScheme = scheme;
    this.schemeNo = i;
  }

  openAdminIT() { }
  openRejectionModal(remarks) {
    this.adminRemarks = remarks;
    $('#rejectionModal').modal({
      backdrop: 'static',
      keyboard: false
    });
  }
  openUploadModal() {
    $('#uploadModal').modal({
      backdrop: 'static',
      keyboard: false
    });
  }

  toggleInput(SchemeID) {
    if (this.amountInput[SchemeID] !== undefined) {
      this.amountInput[SchemeID].enable = !this.amountInput[SchemeID].enable;
    } else {
      this.amountInput[SchemeID] = {};
      this.amountInput[SchemeID].enable = true;
    }
  }

  editDeclaration(id, value) {
    debugger;
    if (this.amountInput[id] === undefined) {
      this.amountInput[id] = {};
    }
    this.amountInput[id].value = value;
    this.toggleInput(id);
  }

  cancelDeclaration(id, i) {
    this.toggleInput(id);
    this.schemedeclarationsList.Schemes[this.schemeNo].subSectiondetails[
      i
    ].Amount = this.amountInput[id].value;
  }

  saveDeclaration(declaration) {
    this.sendToApproval('Pending', declaration);
  }

  sendToApproval(statusFlag, declaration) {
    this.yesAction = 'sendToApproval';
    const NewSchemesArray = [];
    let flag: any;
    if (this.withDisability || this.withSeverDisability) {
      this._services.showSnackbar({
        status: 'Please enter valid amount in section 80U'
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
        //   // if (
        //   //   innerItem.SchemeID == "14" ||
        //   //   innerItem.SchemeID == "15" ||
        //   //   innerItem.SchemeID == "23" ||
        //   //   innerItem.SchemeID == "40" ||
        //   //   innerItem.SchemeID == "44"
        //   // ) {
        //   //   innerItem.Status =
        //   //     innerItem.Amount !== 0 && innerItem.Status === null ?
        //   //       "Pending" :
        //   //       innerItem.Status;
        //   // } else if (innerItem.Amount > 0 && innerItem.Status === null) {
        //   //   innerItem.Status = 'Pending';
        //   // }
        //   // if (statusFlag == "Save" && innerItem.Status != "Pending") {
        //   //   NewSchemesArray.push(innerItem);
        //   // } else if (statusFlag !== "Save") {
        //   //   NewSchemesArray.push(innerItem);
        //   // }
        // }
      });
    });

    NewSchemesArray.forEach((item, i) => {
      if (
        item.ProofRequired &&
        item.DeclarationDetails === null &&
        item.OfflineProof === false
      ) {
        flag = true;
      }
    });

    let requestTokenId = this.empToken;

    const data = {
      RequestType: statusFlag,
      TokenId: this.localUserData.TokenId,
      RequestTokenId: requestTokenId,
      FiscalYear: this.fiscalYear,
      Schemes: NewSchemesArray
    };

    const url = Constant.SubmitIncomeTaxDeclarations;
    this._services.postService(url, data).then((resp: any) => {

      if (resp == 'Success') {
        this.isAmountChanged = false;
        if (declaration !== null) {
          this.toggleInput(declaration.SchemeID);
        }

        $('#successMessageModal').modal({
          backdrop: 'static',
          keyboard: false
        });

      } else {
        this._services.showSnackbar({
          status: 'Something went wrong! Please try again.'
        });
      }

      setTimeout(() => {
        $('#proofsNotUpdated').modal({
          backdrop: 'static',
          keyboard: false
        });
      }, 1000);
    });
  }

  checkIfdeclared80U(value, SchemeNo) {
    let SchemeDOM = document.getElementById('proof-amt' + SchemeNo) as HTMLInputElement;

    let amount = parseInt(value);

    if (amount > 0) {
      this.eightyValue = SchemeNo;
      if (SchemeDOM !== null) SchemeDOM.setAttribute('disabled', 'disabled');
    } else {
      this.eightyValue = '';
      if (SchemeDOM !== null) SchemeDOM.removeAttribute('disabled');
    }
  }

  onInFocus(subScheme) {
    if (subScheme.Amount === 0 || subScheme.Amount === '0') {
      subScheme.Amount = '';
    }
  }

  saveAmount(item, flag) {
    if (
      item.Amount === '' ||
      /^[a-zA-Z()%~`!@#$%^&*()_+=|}{:'";<>,.?/\[\]\-\\]+$/.test(item.Amount)
    ) {
      item.Amount = 0;
    }
  }

  confirmChange(regime: string) {
      this.selectedRegime = regime;
      let modalTitle = 'Confirm Reset Regime';
      let modalBody = `<p> Are you sure you want to reset regime for SAP Code <b>${this.empToken} </b> ?</p>`;
      $('#modal-title1').html(modalTitle);
      $('#modal-body1').html(modalBody);
      $('#RegimeModal').modal({
        backdrop: 'static',
        keyboard: false
      });
  }

  changeRegime() {
    const param = Object.assign({
      tokenid: this.localUserData.TokenId,
      tokenidTobeModify: this.empToken,
      selectedRegimeType: this.selectedRegime
    });
    const url = Constant.UpdateITRegimeType;
    this.spinnerService.show();
    this._services.postService(url, param).then((resp: any) => {
      if (resp.toLowerCase() === 'success') {
        this.titlemessage = 'Saved Sucessfully';
        this.bodyMessage = 'Regime has been changed sucessfully!';

        $('#successMessage').modal({
          backdrop: 'static',
          keyboard: false
        });
      }
      this.spinnerService.hide();
    });
  }

  checkValue(value, SchemeID) {

    if (SchemeID == 14) {

      this.checkIfdeclared80U(value, 15);
      if (parseInt(value) >= 75001) {
        this.withDisability = true;
      } else {
        this.withDisability = false;
      }
    } else if (SchemeID == 15) {

      this.checkIfdeclared80U(value, 14);
      if (parseInt(value) >= 125001) {
        this.withSeverDisability = true;
      } else {
        this.withSeverDisability = false;
      }
    }
  }
}
