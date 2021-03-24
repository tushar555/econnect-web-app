import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  Pipe,
  PipeTransform,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LocalStorageService } from "ngx-store";
import { CommonService } from "../../services/common.service";
import { DomSanitizer } from "@angular/platform-browser";
declare var FileSaver: any;
import * as $ from "jquery";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Constant } from "../../services/constant";
const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
@Pipe({
  name: "inrFormat"
})
export class NewPipe implements PipeTransform {
  transform(value: number) {
    if (value === undefined) {
      return 0;
    }
    return value.toLocaleString("hi-IN");
  }
}
@Pipe({
  name: "securedLink"
})
export class securedLink implements PipeTransform {
  constructor(public sanitize: DomSanitizer) {}
  transform(value: any) {
    return this.sanitize.bypassSecurityTrustResourceUrl(value);
  }
}

@Component({
  selector: "app-salary-card",
  templateUrl: "./salary-card.component.html",
  styleUrls: ["./salary-card.component.scss"]
})
export class SalaryCardComponent implements OnInit, AfterViewInit, OnDestroy {
  totalArr: any = [];
  salaryCardList: any = [];
  localUserData: any;
  tempFinalArray: any[];
  finalArray: any[];
  monthWiseArray: any[];
  monthAmountArray: any[];
  monthArray: any = [];
  shownorecord: any;

  // empData: Array<{ any }> = [];
  empData: any = [];

  showcPay = "block";
  showsStmt = "none";
  showModal = "none";
  fileURL: any;
  pdfObj = null;

  date = new Date();
  salaryData: any;

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
  showInfo = false;
  counter = [];
  responseArr;
  SalaryCardDataMonth;
  total;
  innerArr;

  @ViewChild("widgetsContent", { read: ElementRef })
  widgetsContent: ElementRef<any>;

  scrollRight() {
    console.log("right");
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft + 350,
      behavior: "smooth"
    });
  }

  scrollLeft() {
    console.log("left");
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft - 350,
      behavior: "smooth"
    });
  }

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    public sanitize: DomSanitizer,
    public local: LocalStorageService,
    private _zone: NgZone,
    public http: HttpClient,
    private _services: CommonService,
    private _http: HttpClient
  ) {
    this.fileURL = "";
    this.reader = new FileReader();
    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.tokenId = this.localUserData.TokenId;
      this.userDetails = this.localUserData;
    });
    // this.tokenId = this.local.get('username').TokenId;
    // this.userDetails = this.local.get('username');
    this._services.titleMessageSource.next("Salary Card");

    this.getServerDate();
    this.monthArray = [
      "",
      "Jan",
      "Feb",
      "March",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
  }

  ngAfterViewInit() {
    this.pageheight = $(window).height();
    const abc = document.getElementById("test");
    abc.style.height = this.pageheight + "px";
    setTimeout(() => {
      $(document).ready(function() {
        $("tbody").scroll(function(e) {
          //detect a scroll event on the tbody
          $("thead").css("left", -$("tbody").scrollLeft()); //fix the thead relative to the body scrolling
          $("thead th:nth-child(1)").css("left", $("tbody").scrollLeft()); //fix the first cell of the header
          $("tbody td:nth-child(1)").css("left", $("tbody").scrollLeft()); //fix the first column of tdbody
          // $('tbody tr.header-cell td:nth-child(1)').css('left', $('tbody').scrollLeft()); //fix the first column of tdbody
        });
      });
    }, 1000);
  }
  ngOnInit() {}

  getServerDate(): any {
    this.spinnerService.show();
    this._zone.run(() => {
      this._services
        .getService(Constant.getServerDateTime)
        .then((getDate: any) => {
          this.spinnerService.hide();
          this.date = new Date(getDate);
          this.currentYear = this.date.getFullYear();

          this.year = this.date.getFullYear();

          this.isselected = true;
          for (let i = 0; i <= 2; i++) {
            this.yearsArray.push(this.date.getFullYear() - i);
          }

          // this.getsalaryData();
          this.getMonthwiseSalaryData();
        });
    });
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

  downloadPDF() {
    this.salaryCardList[0];
    if (this.empData.length > 0) {
      const docDefinition = {
        content: [
          { text: "Pay Slip", style: "header" },
          { text: new Date().toTimeString(), alignment: "right" },

          { text: "For the Year", style: "subheader" },
          { text: this.year },

          { text: "Amount ₹", style: "subheader" },
          (this.totalEarnings - this.totalDeductions).toLocaleString("hi-IN"),

          { text: "Employee Details", style: "subheader" },
          {
            ul: [
              "Name:" +
                this.localUserData.FirstName +
                " " +
                this.localUserData.LastName,
              // 'Name:' + this.local.get('username').FirstName + ' ' + this.local.get('username').LastName,
              "ID  :" + this.localUserData.TokenId,
              // 'ID  :' + this.local.get('username').TokenId,
              "Designation: " + this.userDetails.JobTitle,
              "Location:" + this.localUserData.LocationName
              // 'Location:' + this.local.get('username').LocationName
            ],
            margin: [0, 0, 0, 15]
          },

          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 2,
              widths: ["*", "*", "*"],
              style: "table",
              body: this.gettable()
            }
          },
          {
            text:
              "Total Net Pay " +
              (this.totalEarnings - this.totalDeductions).toLocaleString(
                "hi-IN"
              ),
            style: "amount"
          }
          // { text: 'One Lakh three thousand one hundred and fifty', style: "amount_word" }
        ],
        styles: {
          amount_word: {
            fontSize: 10,
            alignment: "center",
            margin: [0, 5, 0, 0]
          },
          amount: {
            fontSize: 15,
            bold: true,
            alignment: "center",
            margin: [0, 10, 0, 0]
          },
          header: {
            fontSize: 18,
            bold: true
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 0]
          },
          story: {
            italic: true,
            alignment: "center",
            width: "50%"
          },
          table: {
            margin: [10, 10, 10, 10]
          }
        }
      };
      // this is the pdf file object which is important for all.
      this.pdfObj = pdfMake.createPdf(docDefinition);
      if (this.pdfObj !== null) {
        this.pdfObj.open();
      }
    } else {
      this._services.showSnackbar({ status: "Record Not Found!" });
    }
  }

  getMyStyles(p) {
    if (p === "showcPay") {
      return {
        display: this.showcPay,
        "border-bottom": this.showcPay ? "1px solid blue" : "0px"
      };
    } else {
      return {
        display: this.showsStmt,
        "border-bottom": this.showsStmt ? "1px solid blue" : "0px"
      };
    }
  }

  ngOnDestroy() {
    this.spinnerService.hide();
  }

  closeModal() {
    this.showModal = "none";
  }

  openModal() {
    return { display: this.showModal };
  }

  // getMonthwiseSalaryData() {
  //   this.empData = [];
  //   const data = { 'tokenId': this.tokenId, 'year': parseInt(this.year) };
  //   const link = Constant.getMonthwiseSalaryCard;
  //   this.shownorecord = false;
  //   this._services.postService(link, data).then((resp: any) => {
  //     console.log("data ",resp);
  //     let tempArray = [];
  //     let newtempArray = [];
  //     let test = [];

  //     tempArray = resp.Months;
  //     console.log("tempdqata",tempArray);
  //    this.shownorecord = tempArray.length === 0 ? true : false;
  //    this.totalEarnings = 0;
  //    this.totalDeductions = 0;
  //   let monthArray = [];
  //   this.monthWiseArray = [];
  //    this.monthAmountArray = [];
  //   this.finalArray = [];
  //  this.tempFinalArray = []
  // tempArray.forEach((obj, i) => {

  //     this.monthAmountArray = [];
  //       this.monthAmountArray[0] = obj.WageTypeDescription;
  //        this.monthAmountArray[new Date(obj.PeriodStart).getMonth() + 1] = obj.Amount
  //        this.finalArray[i] = this.monthAmountArray

  //      });

  //     for (let obj of this.finalArray) {
  //        for (let i = 0; i < 13; i++) {
  //         obj[i] = obj[i] === undefined ? 0 : obj[i];
  //        }
  //      }

  //     for (let i = 0; i < tempArray.length; ++i) {

  //        if (newtempArray.indexOf(tempArray[i].WageType) === -1) {
  //          newtempArray.push(tempArray[i].WageType);
  //          this.counter.push(this.countElement(tempArray, tempArray[i].WageType));
  //         test.push(tempArray[i]);
  //       }
  //     }
  //    for (let i = 0; i < newtempArray.length; i++) {

  //       let getAmount = this.getTotalAmountByID(newtempArray[i], tempArray);

  //        this.empData.push({ "wageType": newtempArray[i], "amount": getAmount, "description": test[i].WageTypeDescription, 'wageIdentifier': test[i].WageIdentifier })
  //      }

  //     //console.log('Emap data  ', this.empData);
  //     tempArray.forEach((item: any) => {
  //       this.totalEarnings += item.WageIdentifier.indexOf('EARNING') > -1 ? item.Amount : 0;
  //       this.totalDeductions += item.WageIdentifier.indexOf('DEDUCTION') > -1 ? item.Amount : 0;
  //     });

  //     this.showInfo = true;
  //     this.spinnerService.hide();
  //    })
  // }

  getMonthwiseSalaryData() {
    this.empData = [];
    let data = { tokenId: this.tokenId, year: parseInt(this.year) };
    // const data = { 'tokenId': 23105449, 'year': 2019 };
    const link = Constant.getSalaryCarddata;
    console.log("my data : ", data);
    // this.spinnerService.show();
    this.shownorecord = false;
    this._services.postService(link, data).then((resp: any) => {
      this.spinnerService.hide();
      const tempArray = [];
      const newtempArray = [];
      const test = [];
      this.salaryCardList = [];

      this.responseArr = resp.Months;
      console.log("responseArr:", this.responseArr);

      this.shownorecord = this.responseArr.length === 0 ? true : false;
      // alert("recorStatus" + this.shownorecord);
      this.totalArr = [];
      this.responseArr.forEach((element, key) => {
        let total = 0;
        element.Data.forEach((innerElement, key1) => {
          console.log("key:" + key + "|" + innerElement.Amount);
          total += innerElement.Amount;
        });
        this.totalArr.push(total);
      });
      console.log(this.totalArr);

      for (let i = 0; i < this.responseArr[0].Data.length; i++) {
        const x = [];
        const wageTypeDesc = this.responseArr[0].Data[i].WageTypeDescription;
        for (let j = 0; j < this.responseArr.length; j++) {
          x.push(this.responseArr[j].Data[i].Amount || "-");
        }
        this.salaryCardList.push({ [wageTypeDesc]: x });
      }
      console.log("salaryCardList", this.salaryCardList[0]);
      this.showInfo = true;
    });
  }

  getsalaryData() {
    debugger;
    this.empData = [];
    const data = { tokenId: this.tokenId, year: parseInt(this.year) };
    const link = Constant.getSalaryCarddata;
    this.spinnerService.show();
    this.shownorecord = false;
    this._services.postService(link, data).then((data: any) => {
      let tempArray = [];
      const newtempArray = [];
      const test = [];

      tempArray = data.SalaryCardItems;
      // console.log("tempdqata",tempArray);
      this.shownorecord = tempArray.length === 0 ? true : false;

      this.totalEarnings = 0;
      this.totalDeductions = 0;
      //this.empData = data.SalaryCardItems;

      const monthArray = [];
      // let wageTypeArray = [];
      this.monthWiseArray = [];
      this.monthAmountArray = [];
      this.finalArray = [];
      this.tempFinalArray = [];
      //    monthArray = tempArray.map(obj => new Date(obj.PeriodStart).getMonth()).filter((obj, i, data) => data.indexOf(obj) === i);
      //wageTypeArray = tempArray.map(obj => obj.WageTypeDescription).filter((obj, i, data) => data.indexOf(obj) === i)
      tempArray.forEach((obj, i) => {
        // let temp = tempArray.filter(innerobj => innerobj.WageTypeDescription == obj.WageTypeDescription);
        // this.monthAmountArray.push(obj.WageTypeDescription);
        this.monthAmountArray = [];
        this.monthAmountArray[0] = obj.WageTypeDescription;
        this.monthAmountArray[new Date(obj.PeriodStart).getMonth() + 1] =
          obj.Amount;
        this.finalArray[i] = this.monthAmountArray;

        // this.monthWiseArray.push(obj.WageTypeDescription, this.monthAmountArray)
      });

      for (const obj of this.finalArray) {
        for (let i = 0; i < 13; i++) {
          obj[i] = obj[i] === undefined ? 0 : obj[i];
        }
      }

      for (let i = 0; i < tempArray.length; ++i) {
        if (newtempArray.indexOf(tempArray[i].WageType) === -1) {
          newtempArray.push(tempArray[i].WageType);
          this.counter.push(
            this.countElement(tempArray, tempArray[i].WageType)
          );
          test.push(tempArray[i]);
        }
      }

      // get total amount
      for (let i = 0; i < newtempArray.length; i++) {
        const getAmount = this.getTotalAmountByID(newtempArray[i], tempArray);

        this.empData.push({
          wageType: newtempArray[i],
          amount: getAmount,
          description: test[i].WageTypeDescription,
          wageIdentifier: test[i].WageIdentifier
        });
      }

      //console.log('Emap data  ', this.empData);
      tempArray.forEach((item: any) => {
        this.totalEarnings +=
          item.WageIdentifier.indexOf("EARNING") > -1 ? item.Amount : 0;
        this.totalDeductions +=
          item.WageIdentifier.indexOf("DEDUCTION") > -1 ? item.Amount : 0;
      });

      this.showInfo = true;
      this.spinnerService.hide();
    });
  }

  countElement(arr, key) {
    return arr.reduce((n, x) => n + (x.WageType === key), 0);
    // return arr.reduce(this.abcd);
  }

  checkamountType(wageIdentifier: string) {
    // console.log('DATA', wageIdentifier);

    if (wageIdentifier.indexOf("EARNING") > -1) {
      return "earn";
    } else if (wageIdentifier.indexOf("DEDUCTION") > -1) {
      return "deduct";
    }
  }

  getTotalAmountByID(nameKey, tempArray) {
    let sum = 0;
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i].WageType === nameKey) {
        sum += tempArray[i].Amount;
      }
    }

    return sum;
  }
  loadTable() {
    $(document).ready(function() {
      $("tbody").scroll(function(e) {
        //detect a scroll event on the tbody
        $("thead").css("left", -$("tbody").scrollLeft()); //fix the thead relative to the body scrolling
        $("thead th:nth-child(1)").css("left", $("tbody").scrollLeft()); //fix the first cell of the header
        $("tbody td:nth-child(1)").css("left", $("tbody").scrollLeft()); //fix the first column of tdbody
        // $('tbody tr.header-cell td:nth-child(1)').css('left', $('tbody').scrollLeft()); //fix the first column of tdbody
      });
    });
  }

  gettable() {
    let tempObj = [];
    const bodyData = [];
    tempObj.push(
      { text: "Descriptions", bold: true, fillColor: "#CCCCCC" },
      { text: "Earnings", bold: true, fillColor: "#CCCCCC" },
      { text: "Deductions", bold: true, fillColor: "#CCCCCC" }
    );

    bodyData.push(tempObj);
    tempObj = [];
    for (let i = 0; i < this.empData.length; i++) {
      const arr = [];

      arr.push(this.empData[i].description);
      if (this.checkamountType(this.empData[i].wageIdentifier) === "earn") {
        arr.push(this.empData[i].amount.toLocaleString("hi-IN"));
        arr.push(" ");
      }
      if (this.checkamountType(this.empData[i].wageIdentifier) === "deduct") {
        arr.push(" ");
        arr.push(this.empData[i].amount.toLocaleString("hi-IN"));
      }

      bodyData.push(arr);
    }

    tempObj.push(
      { text: "Total", bold: true, fillColor: "#CCCCCC" },
      {
        text: this.totalEarnings.toLocaleString("hi-IN"),
        bold: true,
        fillColor: "#CCCCCC"
      },
      {
        text: this.totalDeductions.toLocaleString("hi-IN"),
        bold: true,
        fillColor: "#CCCCCC"
      }
    );
    bodyData.push(tempObj);

    return bodyData;
  }
}
