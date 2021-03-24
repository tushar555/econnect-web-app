import { Component } from "@angular/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { CommonService } from "../../services/common.service";
import { Constant } from "../../services/constant";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";

@Component({
  selector: "app-appraisal-letter",
  templateUrl: "./appraisal-letter.component.html",
  styleUrls: ["./appraisal-letter.component.scss"]
})
export class AppraisalLetterComponent {
  year: any = null;
  date = new Date();
  yearsArray = [];
  localUserData: any;
  tokenId: any;
  userDetails: any = {};
  showModal = "none";
  fileURL: any;
  shownorecord: any;
  responseData: any = [];
  showPDF: any;
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private _services: CommonService,
    public sanitize: DomSanitizer
  ) {
    this.showPDF = false;
    this.fileURL = this.sanitize.bypassSecurityTrustResourceUrl("");
    this._services.titleMessageSource.next("Appraisal Letter");

    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.tokenId = this.localUserData.TokenId;
      this.userDetails = this.localUserData;
    });
    this.getServerDate();
  }

  closeModal() {
    this.showModal = "none";
  }

  openModal() {
    return { display: this.showModal };
  }

  getServerDate() {
    //  this.spinnerService.show();
    this._services
      .getService(Constant.getServerDateTime)
      .then((newdate: any) => {
        this.date = new Date(newdate);
        let currentYear = parseInt(
          this.date
            .getFullYear()
            .toString()
            .substring(2)
        );
        if (this.date.getMonth() > 3) {
          currentYear++;
          this.date = moment(newdate)
            .add(1, "year")
            .toDate();
        }
        console.log(currentYear);
        for (let i = 0; i <= 2; i++) {
          this.yearsArray.push(
            this.date.getFullYear() - (i + 1) + "-" + (currentYear - i)
          );
        }
        this.yearsArray = this.yearsArray.reverse();
        this.year = this.yearsArray[1];
        this.getAppraisalLetter();
      });
  }

  getAppraisalLetter() {
    // console.log(this.year);
    debugger;
    if (!this.year) {
      return false;
    }
    let data = {};
    this.spinnerService.show();
    //this.shownorecord = true;
    data = {
      TokenId: this.tokenId,
      FinancialYear: this.year
    };
    const link = Constant.AppraisalLetter;

    this._services.postService(link, data).then((respdata: any) => {
      this.spinnerService.hide();

      this.shownorecord = respdata.length === 0 ? true : false;
      // respdata.data

      this.responseData = respdata;
      // [
      //   {
      //     Base64File: "",
      //     Filename: "",
      //     Type: "AP",
      //     Date: ""
      //   },
      //   {
      //     Base64File: "",
      //     Filename: "",
      //     Type: "AP",
      //     Date: ""
      //   },
      //   {
      //     Base64File: "",
      //     Filename: "",
      //     Type: "PP",
      //     Date: ""
      //   }
      // ];
    });
  }

  backClick() {
    this.showPDF = false;
  }

  openPdfFile(obj) {
    //  if (this.responseData.Message === "Success") {
    // this.showModal = 'block';
    this.spinnerService.show();
    this.showModal = "block";
    let appraisalLetterFile = obj.Base64File;
    const binaryString = window.atob(appraisalLetterFile);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }

    const blob = new Blob([bytes], { type: "application/pdf" });

    const tempFile = URL.createObjectURL(blob);
    this.showPDF = true;
    this.fileURL = this.sanitize.bypassSecurityTrustResourceUrl(tempFile);

    /*const a = document.createElement('a');
        // @ts-ignore
        a.style = 'display: none';
        a.href = tempFile;
        a.download = 'myFile.pdf'; // gives it a name via an a tag

        a.click();*/

    //  this.spinnerService.hide();
    // } else {
    this.spinnerService.hide();
    // }
  }
}
