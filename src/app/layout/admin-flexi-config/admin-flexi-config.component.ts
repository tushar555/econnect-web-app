import { Component, OnInit } from "@angular/core";
import { Constant } from "../../services/constant";
import { CommonService } from "../../services/common.service";
import { LocalStorageService } from "ngx-store";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Router, NavigationExtras } from "@angular/router";

declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-admin-income-tax",
  templateUrl: "./admin-flexi-config.component.html",
  styleUrls: ["./admin-flexi-config.component.scss"]
})
export class AdminFlexiConfigComponent implements OnInit{
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
  recordSummaryActive: any;
  datanotfound: string = "assets/img/defaultnotfound.png";
  recordnotfound: string = "assets/img/notfound.png";
  // statusTypes = ['pending','approved','rejected'];
  statusTypes = ["all", "active", "inactive"];
  curPage: number = 1;
  status: string = "all";
  FlexiActive: any;
  FlexiAll: any;
  FlexiDeactive: any;
  PutArchived: any;
  ShowText: string;
  EnableStatus: string;
  flexiShow: any;
  showCross: boolean;

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
      this._services.titleMessageSource.next("Admin Flexi Configuration");
      this.getAllFLexiList();
      // this.getRecords('bload');
    });
  }

  ngOnInit() {
    // this.getRecords();
  }

  ngAfterViewInit() {}

  getAllFLexiList() {
    let param = {
      tokenid: this.localUserData.TokenId
    };
    this.status = "all";
    this._services
      .postService(Constant.getFlexiList, param)
      .then((res: any) => {
        console.log(res);
        this.spinnerService.hide();
        this.FlexiAll = res.FlexiMappingRule;
        this.FlexiActive = [];
        this.FlexiDeactive = [];
        this.flexiShow = res.FlexiMappingRule;

        console.dir(this.FlexiActive);
        console.dir(this.FlexiDeactive);
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
    // if(this.searchItem && this.searchItem.length > 2){
    let param = {
      tokenid: this.localUserData.TokenId,
      searchtext: this.searchItem,
      page: this.curPage,
      status: this.status
    };
    this._services
      .postService(Constant.getITAdminFlexiDeclarations, param)
      .then(data => {
        console.log("my data: ", data);
        this.employeeRecords = data["Declarations"];
      });
    // }
  }

  resetsearch() {
    this.status = "all";
    this.flexiShow = this.FlexiAll;
    this.searchItem = "";
  }

  getsearch() {
    this.flexiShow = [];
    this.status = "all";
    for (var i = 0; i < this.FlexiAll.length; i++) {
      var text = this.FlexiAll[i].RuleId;
      console.dir(
        text.toString().indexOf(this.searchItem) >= 0 ||
          this.FlexiAll[i].CompanyName.indexOf(this.searchItem) >= 0
      );

      if (
        text.toString().indexOf(this.searchItem) >= 0 ||
        this.FlexiAll[i].CompanyName.toLowerCase().indexOf(
          this.searchItem.toLowerCase()
        ) >= 0
      ) {
        this.flexiShow.push(this.FlexiAll[i]);
      }
      if (this.FlexiAll.length >= 1) {
        this.showCross = true;
      } else {
        this.showCross = false;
      }
    }
  }

  GetDropdown(status) {
    console.dir(status);
    this.flexiShow = [];
    if (status == "active") {
      for (var i = 0; i < this.FlexiAll.length; i++) {
        if (this.FlexiAll[i].IsActive == true) {
          this.flexiShow.push(this.FlexiAll[i]);
        }
      }
    } else if (status == "inactive") {
      for (var i = 0; i < this.FlexiAll.length; i++) {
        if (this.FlexiAll[i].IsActive == false) {
          this.flexiShow.push(this.FlexiAll[i]);
        }
      }
    } else {
      this.flexiShow = this.FlexiAll;
    }
  }

  arraynum(n) {
    return Array(n);
  }

  scrolledup() {
    console.log("scrolled up");
    this.curPage++;
    // alert();
  }

  confirmationBox(data, state) {
    this.PutArchived = data;
    console.dir(state);
    if (state == "Active") {
      this.ShowText = "Do you want to make Rule Inactive";
    } else {
      this.ShowText = "Do you want to make Rule active";
    }
    $("#conformationModal").modal("show");
  }
  sendDataUser(data: any, status) {
    if (data == "Add") {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          // TokenId: data.TokenId,
          CompanyId: "null",
          RuleId: "0",
          action: "all"
        }
      };
      this._services.AdminEmpFlexiConfig = {
        CompanyId: "null",
        RuleId: "0",
        action: "all"
      };
      this.route.navigate(["mfss/admin-empFlexi-config"], navigationExtras);
    } else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          TokenId: data.TokenId,
          CompanyId: data.CompanyCode,
          enable: data.IsActive,
          RuleId: data.RuleId,
          action: "N/A"
        }
      };
      this._services.AdminEmpFlexiConfig = {
        TokenId: data.TokenId,
        CompanyId: data.CompanyCode,
        enable: data.IsActive,
        RuleId: data.RuleId,
        action: "N/A"
      };
      this.route.navigate(["mfss/admin-empFlexi-config"]);
    }
  }

  adminApproveReject() {
    let url = Constant.AdminApproveRejectFlexiMapping;
    let actionType = "Approved";
    if (this.actionType == "approve") actionType = "Approved";
    else if (this.actionType == "reject") actionType = "Rejected";

    let params = {
      // "AdminTokenId": this._storage.get('username').TokenId,
      tokenid: this.localUserData.TokenId,
      CompanyId: this.PutArchived.CompanyCode,
      RuleId: this.PutArchived.RuleId,
      IsActive: !this.PutArchived.IsActive,
      StartDate: this.PutArchived.StartDate,
      EndDate: this.PutArchived.EndDate
    };
    //console.log(params);
    this.spinnerService.show();
    this._services.postService(url, params).then(data => {
      // console.log(data);
      this.spinnerService.hide();
      if (data == "Success") {
        //location.reload();
        this.getAllFLexiList();
      } else {
      }
    });
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

  createNewException() {}
}
