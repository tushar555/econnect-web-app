import { LocalStorageService } from "ngx-store";
import { Constant } from "./../../services/constant";
import { CommonService } from "./../../services/common.service";
import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import * as moment from "moment";
import {} from "googlemaps";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { NgbCalendar } from "@ng-bootstrap/ng-bootstrap";

import { ExportToCsv } from "export-to-csv";

declare var jquery: any;
declare var $: any;
// declare var google: any;

const MomentRange = require("moment-range");
const Moment = require("moment");
const mv = MomentRange.extendMoment(Moment);

@Component({
  selector: "app-admin-list-view",
  templateUrl: "./admin-list-view.component.html",
  styleUrls: ["./admin-list-view.component.scss"]
  // providers: [
  //   { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  // ]
})
export class AdminListViewComponent implements OnInit {
  //isMarkAttendanceAllowed: any = true;
  fromDate: any;
  toDate: any;
  smallLoader: any;
  dropdownSettingsEmp: any;
  empdropdownList: any;
  locdropdownList: any;
  compdropdownList: any;
  selectedItemsEmp: any = null;
  monthsArray: any = [];
  tokenId: any;
  localUserData: any;
  empdropdownSettings: any;
  LocdropdownSettings: any;
  compdropdownSettings: any;
  selectedItemsComp: any = null;
  selectedItemsLoc: any = null;
  selectedObj: any;
  month: any;
  weeklyDataList: any;
  serverDate: any;
  curPage: number;
  totalPages: any = null;
  selectedDropDown: any;
  tempDropDownList: any;
  data = { token: null, loc: null, comp: null };
  options = {
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
  excelReport: any;
  isEmpListData: boolean = true;
  isLocationdata: boolean = true;
  isCompanydata: boolean = true;
  // { 'TokenId': string; 'EmpTokenId': any; 'Location': any; 'Company': any; 'Month': number; 'PageNo': any; };
  constructor(
    private _services: CommonService,
    public cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private _storage: LocalStorageService,
    public spinnerService: Ng4LoadingSpinnerService,
    public formBuilder: FormBuilder,
    private calendar: NgbCalendar
  ) {
    // this.fromDate = "";
    // this.toDate = "";
    this._services.titleMessageSource.next("Attendance Report");
    this.curPage = 1;
    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.tokenId = this.localUserData.TokenId;
    });

    ////this.fromDate
    //  this.fromDate = this.calendar.getPrev(this.calendar.getToday(), "d", 1);

    // let tempdate = new Date(
    //   this.fromDate.year,
    //   this.fromDate.month - 1,
    //   this.fromDate.day
    // ); // 2009-11-10
    // const month = tempdate.toLocaleString("en-us", { month: "short" });
    // this.fromDate = `${this.fromDate.day}-${month}-${this.fromDate.year}`;
    //  this.toDate = this.fromDate;

    setTimeout(() => {
      this.createMonthArray();
    }, 100);
  }
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  createMonthArray() {
    this._services.getService(Constant.getServerDateTime).then(data => {
      let month: any;
      this.serverDate = data;
      if (data != null) {
        month = moment(data).month();
        this.monthsArray = this.getMonthsArray().slice(0, month + 1);
      }
      console.log("this.monthsArray", this.monthsArray);
      this.month = month;
    });
  }

  toggle(event) {
    // debugger;
    event.toggle();
  }

  onDateChanged(event) {
    console.log("Evemt", event);
  }

  getMonthsArray() {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
  }

  setSelectedDropDown(flag) {
    this.selectedDropDown = flag;

    this.loadDropDownView(this.data.token, this.data.loc, this.data.comp);
  }

  loadDropDownView(EmpTokenId, locationId, companyId) {
    // this.selectedItemsEmp, this.selectedItemsLoc, this.selectedItemsComp;
    console.log(
      " this.selectedDropDown ",
      this.selectedDropDown,

      this.selectedItemsEmp
    );
    if (
      this.selectedDropDown !== "emptoken" &&
      this.selectedItemsEmp !== null
    ) {
      return false;
    }

    const data = {
      tokenid: this.tokenId,
      SearchText: null,
      EmpTokenId: EmpTokenId,
      location: locationId,
      company: companyId
    };
    this._services.spinnerService.hide();
    this._services
      .postService(Constant.GetAdminAttendanceEmpSearch, data)
      .then((resp: any) => {
        const responseData = resp.data;
        this.tempDropDownList = responseData;

        this.setDropDown(responseData);

        this._services.spinnerService.hide();
      })
      .catch(error => {
        console.log("ERROR", error);
      });

    this.empdropdownSettings = this.getSettings("TokenID", "TokenID");
    this.LocdropdownSettings = this.getSettings("LocationName", "LocationName");
    this.compdropdownSettings = this.getSettings("CompanyName", "CompanyName");
  }

  setDropDown(resp) {
    switch (this.selectedDropDown) {
      case "emptoken":
        if (resp.length === 0) {
          this.isEmpListData = false;
          this.empdropdownList = [{}];
        } else {
          this.isEmpListData = true;
          this.empdropdownList = this.getUniqueArray(resp, "emptoken");
        }
        break;
      case "emplocation":
        if (resp.length === 0) {
          this.isLocationdata = false;
          this.locdropdownList = [{}];
        } else {
          this.isLocationdata = true;
          this.locdropdownList = this.getUniqueArray(resp, "emplocation");
        }
        break;
      case "empCompany":
        if (resp.length === 0) {
          this.isCompanydata = false;
          this.compdropdownList = [{}];
        } else {
          this.isCompanydata = true;
          this.compdropdownList = this.getUniqueArray(resp, "empCompany");
        }
        break;
    }
  }

  getUniqueArray(data, flag) {
    function onlyUnique(value, index, self) {
      if (flag == "emptoken") {
        return data.findIndex(obj => obj.TokenID == value.TokenID) === index;
      }
      if (flag == "emplocation") {
        return (
          data.findIndex(obj => obj.LocationName == value.LocationName) ===
          index
        );
      }
      if (flag == "empCompany") {
        return (
          data.findIndex(obj => obj.CompanyName == value.CompanyName) === index
        );
      }
    }

    return data.filter(onlyUnique);
  }

  clickOnPagination(source) {
    //log(this.searchText);
    if (source == "p") {
      if (this.curPage > 1) {
        this.curPage--;
      } else {
        return false;
      }
    } else if (source == "n") {
      if (this.curPage < this.totalPages) {
        this.curPage++;
      } else {
        return false;
      }
    } else {
      return false;
    }

    this.search(this.curPage, "");
  }

  getSettings(idField, textField) {
    return {
      singleSelection: true,
      idField: idField,
      textField: textField,
      itemsShowLimit: 3,
      noDataAvailablePlaceholderText: " ",
      closeDropDownOnSelection: true,
      allowSearchFilter: true,
      clearSearchFilter: true
    };
  }

  resetHospitalList() {
    this.curPage = 1;

    this.search(1, "");
    //  this.searchText = '';
  }

  downloadAsExcel() {
    if (this.excelReport) {
      const csvExporter = new ExportToCsv(this.options);
      csvExporter.generateCsv(this.excelReport);
    }
  }

  search(pageNO, flag) {
    let foundObj: any;
    let locationID: any = null;
    let companyID: any = null;

    if (!this.fromDate) {
      this._services.showSnackbar({
        status: "Please select From Date"
      });
      return false;
    }

    if (!this.toDate) {
      this._services.showSnackbar({
        status: "Please select To Date"
      });
      return false;
    }
    // else {

    const data = {
      TokenId: this.tokenId,
      EmpTokenId: this.selectedItemsEmp ? this.selectedItemsEmp[0] : null,
      Location: this.selectedItemsLoc ? this.selectedItemsLoc[0] : null, //locationID,
      Company: this.selectedItemsComp ? this.selectedItemsComp[0] : null,
      AttendanceStartDate: `${this.fromDate.day}-${this.fromDate.month}-${this.fromDate.year}`,
      AttendanceEndDate: `${this.toDate.day}-${this.toDate.month}-${this.toDate.year}`,
      Month: this.month + 1,
      PageNo: pageNO
    };
    console.log("datadata", data);

    this._services
      .postService(Constant.GetAttendanceAdminReport, data)
      .then((resp: any) => {
        // debugger;
        if (resp.data.length === 0) {
          // this._services.showSnackbar({
          //   status: "No Records Found"
          // });
          $("#toggleConfirmation").modal("show");
          //  $("toggleConfirmation").show();
        } else {
          if (flag === "fromExcel") {
            this.excelReport = resp.data;
            this.downloadAsExcel();
          } else if (flag === "") {
            this.weeklyDataList = resp.data;
            this.totalPages = resp.TotalPage;
          }
        }

        this._services.spinnerService.hide();
      });
    //}
  }

  checkDateCurMonth(calDate) {
    const curMonth = moment(this.serverDate).get("month");
    const calDateMonth = moment(calDate).get("month");
    if (curMonth != calDateMonth) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {}
  TimeMinutes(n) {
    let num = n;
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    let hours1 = rhours < 10 ? "0" + rhours : rhours;
    let minutes1 = rminutes < 10 ? "0" + rminutes : rminutes;
    return hours1 + ":" + minutes1;
    //return rhours + ":" + rminutes + ":" + '00';
  }

  MinutesConsidered(data) {
    let data1 = this.TimeMinutes(data);
    return data1;
  }

  // onItemSelect(item: any) {
  //   console.log(item);
  // }

  getdataSearch(token, loc, comp) {
    this.data = { token: token, loc: loc, comp: comp };
    this.loadDropDownView(token, loc, comp);
  }

  onItemSelect(token, loc, comp) {
    if (this.selectedItemsEmp == "") {
      token = "23";
    }
    if (this.selectedItemsLoc == "") {
      loc = "RO";
    }
    if (this.selectedItemsComp == "") {
      comp = "10";
    }

    this.loadDropDownView(token, loc, comp);
  }
  onSelectAll(items: any, flag) {
    //debugger;
    if (flag == "fromLoc") {
      this.selectedItemsLoc = [items];
    }

    if (flag == "fromComp") {
      this.selectedItemsComp = [items];
    }

    if (flag === "fromToken") {
      this.selectedItemsEmp = [items];
      this.selectedObj = this.empdropdownList.find(
        obj => obj.TokenID === items
      );

      this.selectedItemsLoc = [this.selectedObj.LocationName];
      this.selectedItemsComp = [this.selectedObj.CompanyName];
      this.locdropdownList = [this.selectedObj];
      this.compdropdownList = [this.selectedObj];
    }
  }
}
