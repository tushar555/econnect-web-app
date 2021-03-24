import {
  Component,
  OnInit,
  NgZone,

  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { saveAs } from "file-saver";
import { LocalStorageService } from "ngx-store";
import { CommonService } from "../../services/common.service";
import { DomSanitizer } from "@angular/platform-browser";
declare var FileSaver: any;
import * as $ from "jquery";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Constant } from "../../services/constant";

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: "app-current-pay-slip",
  templateUrl: "./current-pay-slip.component.html",
  styleUrls: ["./current-pay-slip.component.scss"]
})
export class CurrentPaySlipComponent
  implements OnInit, AfterViewInit, OnDestroy {
  // empData: Array<{ any }> = [];
  localUserData: any;
  empData: any = [999];

  showcPay = "block";
  showsStmt = "none";
  showModal = "none";
  fileURL: any;
  pdfObj = null;

  date = new Date();
  salaryData: any;
  monthsArray: any = [];
  month: any;
  reader: any;
  yearsArray = [];
  year: any;
  currentYear: any;
  isselected: boolean;
  tokenId: any;
  pageheight: any;
  totalEarnings = 0;
  totalDeductions = 0;
  userDetails: any = {};
  showInfo: boolean = false;
  showPaySlips: boolean = false;

  documents: {}[] = [];

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    public sanitize: DomSanitizer,
    public local: LocalStorageService,
    private _zone: NgZone,
    public http: HttpClient,
    private _services: CommonService,
    private _http: HttpClient
  ) {
    this.isselected = true;
    this.fileURL = this.sanitize.bypassSecurityTrustResourceUrl("");

    this.reader = new FileReader();
    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.tokenId = this.localUserData.TokenId;
      this.userDetails = this.localUserData;
    });
    // this.tokenId = this.local.get('username').TokenId;
    // this.userDetails = this.local.get('username');
    this.getServerDate();
  }

  getServerDate() {
    // this.spinnerService.show();

    //alert("hi");
    this._services
      .getService(Constant.getServerDateTime)
      .then((newdate: any) => {
        this.date = new Date(newdate);
        this.currentYear = this.date.getFullYear();
        this.month = this.date.getMonth() + 1;
        this.year = this.date.getFullYear();

        this.spinnerService.hide();
        for (let i = 0; i <= 2; i++) {
          this.yearsArray.push(this.date.getFullYear() - i);
        }
        //this.spinnerService.hide();
        this.initializeMonths();
        // this.getDetails();
        this.getMonths(this.date.getFullYear(), "");
        //console.log("completing serverdate");
        this._services.titleMessageSource.next("My Payslip");

        this.showInfo = true;
      });
  }

  ngAfterViewInit() {
    this.pageheight = $(window).height();
    let abc = document.getElementById("test");
    abc.style.height = this.pageheight + "px";
    // console.log("in viewinit");
  }
  changeTab(param: string) {
    if (param === "c_pay") {
      this.showsStmt = "none";
      this.showcPay = "block";
    } else if (param === "s_stmt") {
      this.showsStmt = "block";
      this.showcPay = "none";
    }
  }

  initializeMonths() {
    this.monthsArray = [
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
    this.month = this.monthsArray[this.date.getMonth() - 1];
  }

  getMonths(event, fromDOM) {
    this.year = event;
    this.isselected = fromDOM === "" ? true : false;

    if (event == this.date.getFullYear()) {
      // console.log('Year', event);

      let month = [];
      console.log("this.date.getMonth()", this.date.getMonth());
      for (let i = 0; i <= this.date.getMonth() - 1; i++) {
        // console.log(this.date.getMonth());

        month.push(this.monthsArray[i]);
      }
      this.monthsArray = month;
      this.month = this.monthsArray[this.date.getMonth() - 1];
      // console.log('If Month', this.month);
    } else {
      // console.log('OriginalYear', event);
      this.initializeMonths();
    }

    //  console.log('MonthsArray', this.monthsArray);
  }

  ngOnInit() { }
  ngOnDestroy() {
    //this.spinnerService.hide();
  }

  check() {
    return this.isselected;
  }
  closeModal() {
    this.showModal = "none";
  }

  openModal() {
    return { display: this.showModal };
  }

  getPaySlip(month) {
    // this.spinnerService.show();

    let data = {};
    this.month = month;
    this.spinnerService.show();
    data = {
      tokenId: this.tokenId,
      month: this.monthsArray.indexOf(this.month) + 1,
      year: parseInt(this.year)
    };
    let link = Constant.getSalarySlip;
    // data = {
    //   "tokenid": "23061537",
    //   "month": 5,
    //   "year": 2018

    // }
    //this.spinnerService.hide();
    //console.log('LOGG', data);

    this._services.postService(link, data).then((respdata: any) => {
      this.showInfo = true;
      this.showPaySlips = true;

      if (respdata.Message === "Success") {
        this.showModal = "block";
        var binaryString = window.atob(respdata.Base64File);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
          var ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
        }
        let blob = new Blob([bytes], { type: "application/pdf" });

        var tempFile = URL.createObjectURL(blob);
        console.log(tempFile);

        console.log("tempFile: ", tempFile);
        // var tempFile = 'data:application/pdf;base64,' + respdata.Base64File;
        this.fileURL = this.sanitize.bypassSecurityTrustResourceUrl(tempFile);

        console.log("File URL", this.fileURL);

        // const linkSource = 'data:application/pdf;base64,' + respdata.Base64File;
        // const downloadLink = document.createElement("a");
        // const fileName = "sample.pdf";

        // downloadLink.href = linkSource;
        // downloadLink.download = fileName;
        // downloadLink.click();

        setTimeout(() => {
          this.spinnerService.hide();
        }, 10000);
      } else {
        this.spinnerService.hide();
        this._services.showSnackbar({ status: "Record Not Found!" });
      }
    });
  }

  getPaySlipMulti(month) {
    // this.spinnerService.show();
    let data = {};
    this.month = month;
    this.spinnerService.show();
    data = {
      tokenId: this.tokenId,
      month: this.monthsArray.indexOf(this.month) + 1,
      year: parseInt(this.year)
    };
    let link = Constant.getSalarySlip;
    this._services.postService(link, data).then((respdata: any) => {
      this.showPaySlips = true;
      if (respdata.Message === "Success") {
        this.documents = respdata.data;
        this.spinnerService.hide();
      } else {
        this.spinnerService.hide();
        this._services.showSnackbar({ status: "Record Not Found!" });
      }
    });
  }

  showFile(Base64File) {
    this.spinnerService.show();
    this.fileURL = "";

    this.showModal = "block";
    var binaryString = window.atob(Base64File);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    let blob = new Blob([bytes], { type: "application/pdf" });

    var tempFile = URL.createObjectURL(blob);
    console.log(tempFile);

    console.log("tempFile: ", tempFile);
    // var tempFile = 'data:application/pdf;base64,' + respdata.Base64File;
    this.fileURL = this.sanitize.bypassSecurityTrustResourceUrl(tempFile);

    if (this.fileURL) {
      this.spinnerService.hide();
    }

    console.log("File URL", this.fileURL);
  }
}
