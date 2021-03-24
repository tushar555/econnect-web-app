import { Component, NgZone } from "@angular/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Constant } from "./../../services/constant";
import { CommonService } from "./../../services/common.service";

@Component({
  selector: "app-leave-travel-allowance",
  templateUrl: "./leave-travel-allowance.component.html",
  styleUrls: ["./leave-travel-allowance.component.scss"]
})
export class LeaveTravelAllowanceComponent {
  localUserData: any;
  userDetails: any;
  salarySlip: any;
  tokenId: any;
  year: any;
  totalTax: number = 0;
  deducatedTaxArray: any;
  totalTaxArray: any;
  date = new Date();
  currentYear: any;
  isselected: boolean;
  yearsArray = [];

  constructor(
    private _services: CommonService,
    private spinnerService: Ng4LoadingSpinnerService,
    private _zone: NgZone
  ) {
    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.userDetails = this.localUserData;
      this.tokenId = this.localUserData.TokenId;
    });
    // this.userDetails = this.local.get('username');
    // this.tokenId = this.local.get('username').TokenId;
    //this.year = new Date().getFullYear;
    this._services.titleMessageSource.next("LTA Summary");
    this.getServerDate();
  }
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
          this.getLTAData();
        });
    });
  }
  getLTAData() {
    this.deducatedTaxArray = [];
    let requestUrl = Constant.getLTASummary;
    const data = { tokenId: this.tokenId, year: parseInt(this.year) };
    this._services.postService(requestUrl, data).then((data: any) => {
      this.spinnerService.hide();
      this.salarySlip = data.SalaryCardLTAItems;
      console.log("this.salarySlip", this.salarySlip);

      this.deducatedTaxArray = data.SalaryCardLTAItems;
      // this._services.authorizationKey = 'Bearer ' + data.authtoken.trim();
      var destinationArray = this.deducatedTaxArray.slice();
      this.totalTax = destinationArray.reduce(
        (n, x) => n + x.FlexiBlockedAmount,
        0
      );
    });
  }

  getDeductedSalary(item, index) {
    if (item.WageIdentifier == "W2 / DEDUCTION") {
      //wageIndentifier == "W2 / DEDUCTION" for tax dedction
      return item;
    }
  }

  Userlogout() {
    this._services.logout();
  }
}
