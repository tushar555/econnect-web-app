import { Component, OnInit } from "@angular/core";
import {
  Constant,
  DropDownOptions,
  EntityMaster
} from "../../services/constant";
import { CommonService } from "../../services/common.service";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Router, NavigationExtras } from "@angular/router";
import { ExportToCsv } from "export-to-csv";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-admin-income-tax",
  templateUrl: "./admin-income-tax.component.html",
  styleUrls: ["./admin-income-tax.component.scss"]
})
export class AdminIncomeTaxComponent implements OnInit {

  sapReports = DropDownOptions.sapReports;
  mainStatus = DropDownOptions.status;
  adminReports = DropDownOptions.adminReports;
  adminReportMap = new Map([['HRA Report','HRA'], ['House Property Report','IncomeLoss'],
                      ['Other Income Report','IncomeOtherSource'], ['Transaction Details Report','Transaction'],
                      ['Previous Employment Report','PreviousEmployer']]);

  FILE_NAME = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}_$newStatus$_IT_Report`;
  localUserData: any;
  employeeRecords: any;
  searchItem: any= '';
  flag: any;
  filteredEmployee: any;
  actionType: string;
  recordSummary: any;
  recordnotfound: string = "assets/img/notfound.png";
  reportTypes :string[];
  curPage: number = 1;
  totalPages: number;
  status: string = '';
  titlemessage: any;
  bodyMessage: string;
  loaderSearch: boolean;

  options: any = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: false,
    // title: "Attendance Report",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true

    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };
  entityMaster = EntityMaster.entityMaster;
  CompanyCode: any;
  selectedEmp: any;

  constructor(
    private _services: CommonService,
    private route: Router,
    public spinnerService: Ng4LoadingSpinnerService
  ) { }

  async ngOnInit() {
    this.reportTypes = [...this.mainStatus, ...this.sapReports, ...this.adminReports];
    this.localUserData = await this._services.getUserDetail();
    this.CompanyCode = this.entityMaster.filter(
        obj => obj.companyName === this.localUserData.CompanyName
      )[0].companyCode;
    this.flag = false;
    this.employeeRecords = [];
    this._services.titleMessageSource.next("Admin IT");
    this.recordSummary  = await this.getSummary();
    this.getRecords();
  }

  async getSummary() {
    let param = {
      tokenid: this.localUserData.TokenId
    };
    return this._services.postService(Constant.AdminGetAllDeclarations, param);
  }

  async getRecords() {
    if (this.status !== "" && !this.mainStatus.includes(this.status)) { return false; }

    try {
      let param = {
        tokenid: this.localUserData.TokenId,
        searchtext: this.searchItem,
        page: this.curPage,
        status: this.status
      };
      this.loaderSearch = true;
      const data = await this._services.postService(Constant.getITAdminDeclarations, param, false);
      this.employeeRecords =  data["Declarations"];
      this.totalPages = data["TotalPages"];
    }catch(e) {
      console.error('error', e);
      this.spinnerService.hide();
    }finally {
      this.loaderSearch = false;
      this.spinnerService.hide();
    }
  }

  clear() {
    this.searchItem='';
    this.getRecords();
  }

  getUsers(status: string) {
    this.status = status;
    this.getRecords();
  }

  async downloadAsExcel() {

    try {
      let apiURL = Constant.getITAdminDeclarations;
      let param: any = {
        tokenid: this.localUserData.TokenId,
        searchtext: this.status,
        page: 0
      };

      if(this.sapReports.includes(this.status) ) {
        apiURL = Constant.getITReportSAP;
      }else if(this.status !== '') {
        param = {...param, searchtext: this.adminReports.indexOf(this.status)+1 }
        apiURL = Constant.getITReport;
      }

     this.spinnerService.show();

     const resp: any =  await this._services.postService(apiURL, param, false);
     console.log('status', this.status);

     if(this.sapReports.includes(this.status) ) { this.download(resp[0], this.status); return }

     const type = this.adminReportMap.get(this.status);
     const data = resp[type] === undefined ? resp.Declarations.slice(): resp[type];
     this.checkReportType(data, type);
    } catch (e){
      console.error('error', e );
      const error = e || "Something went wrong!";
      this._services.showSnackbar({ status: error });
    } finally {
      this.spinnerService.hide();
    }

  }

  download(data, status = 'file') {
    if(!data || !data.length) { throw new Error('No Record found!') }

    this.options =  { ...this.options, filename: this.FILE_NAME.replace('$newStatus$', status) };
    const csvExporter = new ExportToCsv(this.options);
      csvExporter.generateCsv(data);
  }

  checkReportType(declarations, type?) {
    if(!declarations || !declarations.length) { throw new Error('No Record found!') }

    // if (type === 'HRA') { this.downloadHRA(declarations); return }
    //if (type === 'IncomeLoss') { this.downloadIncomeLoss(declarations); return }
    //if (type === 'IncomeOtherSource') { this.downloadIncomeOtherSource(declarations); return }
    //if (type === 'Transaction') { this.download(declarations, type); return }
    // if (type === 'PreviousEmployer') { this.downloadPreviousEmployer(declarations); return }

    if(type){ this.download(declarations, type); return}

    let newtempIncomeTax = [];
      declarations.forEach((obj: any) => {
        if (obj.DeclarationsDetail) {
          obj.DeclarationsDetail.forEach(innerObj => {
            newtempIncomeTax.push({
              "Company_Code": obj.CompanyID,
              "Token_Id": obj.TokenId,
              "EmployeeName": obj.EmpName,
              "EmpGrade": obj.EmpGrade || "-",
              "Location": obj.Location,
              "RegimeType": obj.regimetype,
              "TotalDeclarations": obj.TotalDeclarations,
              "SchemeName": innerObj.schemename,
              "Section": innerObj.section || "-",
              "Amount": innerObj.amount,
              "Status": innerObj.status,
              "Remarks": innerObj.remark || ""
            });
          });
        }
      });
     this.download(newtempIncomeTax, 'All');
  }

  downloadPreviousEmployer(declarations) {
    if(!declarations) { throw new Error('No Record found!') }
    let newSchemeArray = [];
    declarations.forEach(obj => {
      newSchemeArray.push({
        "Company Code": obj.CompanyCode,
        "Token ID": obj.TokenID,
        "Scheme Category": obj.SchemeCategory,
        "Salary US17": obj.SalaryUS17 || 0,
        "Professional Tax": obj.professionalTax || 0,
        "PF": obj.PF || 0 ,
        "IncomeTax Deducted": obj.IncomeTaxDeducted || 0 ,
        "Medical Exemption": obj.MedicalExemption || 0,
        "LTA Exemptions": obj.LTAExemptions || 0,
        "LTA Carried Forward": obj.LTACarriedForward || 0 ,
        "Leave Encashment Exmp": obj.LeaveEncashmentExmp || 0 ,
        "Gratuity Exemption": obj.GratuityExemption || 0 ,
        "VRS Exemption": obj.VRSExemption || 0 ,
        "Perquisite US17": obj.PerquisiteUS17 || 0 ,
        "Surcharge Deducted": obj.SurchargeDeducted || 0,
        "EduCess Deducted": obj.EduCessDeducted || 0 ,
         "Remark": obj.Remark
      });
    });
    this.download(newSchemeArray, 'previousEmployer');
  }

  downloadIncomeOtherSource(declarations) {
    if(!declarations) { throw new Error('No Record found!') }
    let newSchemeArray = [];
    declarations.forEach(obj => {
      newSchemeArray.push({
        "Company Code": obj.CompanyCode,
        "Token ID": obj.TokenID,
        "Scheme Category": obj.SchemeCategory,
        "Business Profit": obj.BusinessProfit || 0 ,
        "LTNormal": obj.LTNormal || 0,
        "LTSpecial": obj.LTSpecial || 0 ,
        "Divident Income": obj.DividentIncome || 0 ,
        "STGain": obj.STGain || 0,
        "Other Income": obj.OtherIncome || 0,
        "TDS On OtherIncome": obj.TDSOnOtherIncome || 0,
        "Total Interest Inc": obj.TotalInterestInc || 0,
        "NCS Interest": obj.NCSInterest || 0 ,
        "SAV Bank Interest": obj.SAVBankInterest || 0,
        "Other Interest": obj.OtherInterest || 0,
        "Remark": obj.Remark
      });
    });
    this.download( newSchemeArray, 'IncomeOtherSource');
  }

  downloadIncomeLoss(declarations) {
    if(!declarations) { throw new Error('No Record found!') }
    let newSchemeArray = [];
    declarations.forEach(obj => {
      newSchemeArray.push({
        "Company Code": obj.CompanyCode,
        "Token ID": obj.TokenID,
        "Scheme Category": obj.SchemeCategory,
        "Type": obj.Type,
        "House CoOwner": obj.HouseCoOwner,
        "Pre-EMI InterestValue": obj.PreEMIInterestValue || 0 ,
        "Interest Housing Loan ": obj.InterestHousingLoan || 0,
        "Rent Received Anually": obj.RentReceivedAnually || 0,
        "Municipal Taxes": obj.MunicipalTaxes || 0,
        "Statutory Deduction": obj.StatutoryDeduction || 0,
        "Net Annual Value": obj.NetAnnualValue || 0,
        "Interest Paid On Borrowings": obj.InterestBorrowedCapital || 0,
        "Net Income House Property": obj.NetIncomeHouseProperty || 0,
        "Lender Type": obj.LenderType || 0,
        "Lenders Name": obj.LendersName,
        "Property Type": obj.PropertyType || "" ,
        "AnnualLettable Value Rent Amount": obj.AnnualLettableValueRentAmount,
        "Standard Deduction": obj.StandardDeduction || 0 ,
        "Possession Date": obj.PossessionDate || "" ,
        "Lenders PAN": obj.LendersPAN,
        "Remarks": obj.Remarks
      });
    });

    this.download( newSchemeArray, 'IncomeLossHouse');
  }

  downloadHRA(declarations) {
    let newSchemeArray = [];
    if(!declarations) { throw new Error('No Record found!') }
    declarations.forEach(obj => {
      newSchemeArray.push({
        "Company Code": obj.CompanyCode,
        "Token ID": obj.TokenID,
        "Scheme Category": obj.SchemeCategory,
        "Rented Address": obj.Address,
        "Rented Pincode": obj.PinCode === null ? "-" : obj.PinCode,
        "LandLord Name": obj.LandLordName,
        "LandLord Address": obj.LandLordAddress,
        "LandLord Pincode": obj.LandLordPinCode === null ? "-" : obj.LandLordPinCode,
        "LandLord PanNo": obj.LandLordPanNo,
        "From Date": `${new Date(obj.FromDate).getFullYear()}-${(new Date(obj.FromDate).getMonth() + 1)}-${new Date(obj.FromDate).getDate()}`,
        "To Date": `${new Date(obj.ToDate).getFullYear()}-${new Date(obj.ToDate).getMonth() + 1}-${new Date(obj.ToDate).getDate()}`,
        "Housing Type": obj.HousingType === "Rent" ? "Rented Accom." : obj.HousingType,
        "Rent per Month": obj.RentPerMonth || 0,
        "Remarks": obj.Remarks || "",
        "City Category": obj.IsMetroCity || ""
      });
    });

    this.download( newSchemeArray, 'HRA');
  }

  arraynum(n) { return Array(n)}

  DeclartionAdminView(value) {
    // this.showMessageFlexi=value
    $("#toggleConfirmation").modal("show");
    if (value == "changeView") {
      this.route.navigate(["mfss/income-tax"]);
    }
  }


  sendDataUser(data: any) {
    let navigationExtras: NavigationExtras = {};
    this._services.encrypt(data.TokenId).then((encToken) => {
      return Promise.resolve(encToken)
    }).then((encToken) => {
      return this._services.encrypt(data.EmpName).then((encEmpName) => {
        return ({ T: encToken, EN: encEmpName })
      })
    }).then((encObj) => {
      navigationExtras.queryParams = encObj;
      this.route.navigate(["mfss/admin-emp-declaration"], navigationExtras);
    })
    //return this._services.decrypt(enc);
    // }).then((decr) => {
    //   console.log('DECRYPT', decr)
    // })

    //this.route.navigate(["mfss/admin-emp-declaration"], navigationExtras);
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

  configure() {
    this.route.navigate(['/mfss/admin-declaration-config']);
  }

  searchInput() {
    if(this.searchItem.length >= 5){
      this.getRecords();
    }
    if (this.searchItem === "") {
      this.status = null;
      this.searchItem = undefined;
      this.getRecords();
    }
  }

  confirmReset(emp) {
    this.selectedEmp = emp;
    let modalTitle = 'Confirm Reset Regime';
    let modalBody = `<p> Are you sure you want to reset regime for SAP Code <b>${this.selectedEmp.TokenId} </b> ?</p>`;
    $('#modal-title1').html(modalTitle);
    $('#modal-body1').html(modalBody);
    $('#RegimeModal').modal({
      backdrop: 'static',
      keyboard: false
    });
  }

  resetRegime() {
    const param = Object.assign({
      tokenid: this.localUserData.TokenId,
      tokenidTobeModify: this.selectedEmp.TokenId,
      selectedRegimeType: null
    });

    const url = Constant.UpdateITRegimeType;
    this.spinnerService.show();
    this._services.postService(url, param).then((resp: any) => {
      if (resp.toLowerCase() === 'success') {
        this.selectedEmp = null;
        this.titlemessage = 'Saved Sucessfully';
        this.bodyMessage = 'Regime has been reset sucessfully!';

        $('#successMessage').modal({
          backdrop: 'static',
          keyboard: false
        });
      }
      this.spinnerService.hide();
    });
  }
}
