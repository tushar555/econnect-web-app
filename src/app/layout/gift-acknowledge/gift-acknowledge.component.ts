import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../services/common.service";
import { Constant } from "../../services/constant";
import { Validators, FormGroup, FormBuilder, FormArray } from "@angular/forms";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-gift-acknowledge",
  templateUrl: "./gift-acknowledge.component.html",
  styleUrls: ["./gift-acknowledge.component.scss"]
})
export class GiftAcknowledgeComponent implements OnInit {
  localUserData: any;
  GiftStatus: any;
  showForm: boolean;
  ngForm: any;
  giftData: any = [];
  staus: any;
  ngShow: any = false;
  constructor(public service: CommonService, public _fb: FormBuilder) {
    this.showForm = false;
    this.service.titleMessageSource.next("25 Years gift acknowledgement");
    this.service.getUserDetail().then(data => {
      this.localUserData = data;
    });

    this.ngForm = this._fb.group({
      TokenId: ["", Validators.compose([Validators.required])],
      Name: ["", Validators.compose([Validators.required])],
      MobileNo: [
        "",
        Validators.compose([Validators.pattern(/^[1-9]{1}[0-9]{9}$/)])
      ],
      Location: ["", Validators.required],
      PAN: [""],
      BankAccountNo: ["", Validators.compose([Validators.required])],
      RHR: ["", Validators.required],
      Status: [false]
    });
  }

  ngOnInit() {
    // let modalFormArray = this.ngForm.get() as FormArray;
    // modalFormArray.patchValue({})
    let url = Constant.GetGiftStatus;
    let param = {
      tokenid: this.localUserData.TokenId
    };
    this.service.postService(url, param).then((data: any) => {
      this.ngShow = true;
      this.GiftStatus = data.GiftStatus;
      this.giftData = data;
      //this.giftData.MobileNo = null;
      this.patchValue();
    });
  }

  checkMobileNo(event) {
    // let value = event.target.value;
    // if (value !== "+" && isNaN(value) && value == " ") {
    //   return false;
    // } else {
    //   return true;
    // }
  }

  checkCharOnly(event) {
    var value = String.fromCharCode(event.which);
    var pattern = new RegExp(/[a-zåäö ]/i);
    return pattern.test(value);
  }

  patchValue() {
    if (this.GiftStatus) {
      this.ngForm.patchValue({
        BankAccountNo: this.giftData.BankAccountNo,
        MobileNo: this.giftData.MobileNo
      });
    }
    this.ngForm.patchValue({
      TokenId: this.giftData.TokenId,
      Name: this.giftData.Name,
      Location: this.giftData.Location,
      RHR: this.giftData.RHR,
      Status: this.GiftStatus
    });
  }

  checkIfPanCorrect() {
    this.ngForm.get("BankAccountNo").value;
  }

  submit() {
    let param = this.ngForm.getRawValue();
    param.tokenid = this.localUserData.TokenId;
    let url = Constant.UpdateGiftStatus;

    this.service.postService(url, param).then((data: any) => {
      if (data === "Success") {
        $("#saveSuccess").modal("show");
      } else {
        this.service.showSnackbar({
          status: "Something went wrong. Try again."
        });
      }
    });
  }

  back() {
    this.showForm = false;
  }

  afterSubmission() {
    this.ngOnInit();
  }
}
