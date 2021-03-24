import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../services/common.service";
import { Constant } from "./../../services/constant";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ActivatedRoute } from "@angular/router";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { FormArray } from "@angular/forms";

declare var jquery: any;
declare var $;

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"]
})
export class MyProfileComponent implements OnInit {
  contactList: any;
  userdata: any;
  localUserData: any;
  userInfo: any;
  isAdminIT: any;
  userDetails: any;
  sub: any;
  showSkip: any = false;
  showdata: boolean = false;
  aadharno: any;
  mobno: any;
  email: any;
  panno: any;
  address: any;
  ename: any;
  ephoneno: any;
  ProfileForm: FormGroup;
  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  phonePattern = /^[789]\d{9}$/;
  PANNoPattern = /[A-Z]{5}\d{4}[A-Z]{1}/;

  TokenId: any;
  afterSubmitresp: any;

  constructor(
    private _services: CommonService,
    private route: ActivatedRoute,
    public spinnerService: Ng4LoadingSpinnerService,
    private _fb: FormBuilder
  ) {
    this._services.titleMessageSource.next("My Profile");

    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.userInfo = this.localUserData;
      this.TokenId = this.userInfo.TokenId;
      this.userInfo.ModulesAdmin[0].IsIncomeTaxAdmin;
      this.isAdminIT = this.userInfo.ModulesAdmin[0].IsIncomeTaxAdmin;

    });
  }


  onKeyDown(event) {
    console.log(event.target.value.length);
    console.log(event.target.value.length > 3);

    if (event.target.value.length > 3) {
      (<HTMLInputElement>document.getElementById("reEnterPin")).select();

      const input = <HTMLInputElement>document.querySelector("#partitioned");
      input.blur();
      return false;
    }
  }


  ngOnInit() {
    this.ProfileForm = this._fb.group({
      mobileno: [
        "",
        [Validators.required, Validators.pattern(this.phonePattern)]
      ],
      emailid: [
        "",
        [Validators.required, Validators.pattern(this.emailPattern)]
      ],
      adharno: ["", [Validators.required]],
      pannumber: [
        "",
        [Validators.required, Validators.pattern(this.PANNoPattern)]
      ],
      addressfc1: ["", [Validators.required]],
      addressfc2: ["", [Validators.required]],
      addressfc3: ["", [Validators.required]],
      addressfc4: ["", [Validators.required]],
      addressfc5: ["", [Validators.required]],
      addressfc6: ["", [Validators.required]],
      addressfc7: ["", [Validators.required]],
      addressfc8: ["", [Validators.required]],
      addressfc9: ["", [Validators.required]],
      addressfc10: ["", [Validators.required]],
      addressfc11: ["", [Validators.required]],
      addressfc12: ["", [Validators.required]],
      addressfc13: ["", [Validators.required]],
      zipcode: ["", [Validators.required]],
      contacts: this._fb.array([])
    });

    this.spinnerService.show();
    let url = Constant.GetBasicProfile;
    let param = {
      tokenid: this.localUserData.TokenId
    };
    this.showSkip = this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.showdata = params["skip"] || false;
    });
    //console.log(this.showdata,"this.showdata..");
    this._services.postService(url, param).then((data: any) => {
      //console.log("jkesfw",data);
      this.userDetails = data;
      if (
        this.userDetails.emergencyContact &&
        this.userDetails.emergencyContact.length > 0
      ) {
        const control = <FormArray>this.ProfileForm.controls["contacts"];
        this.userDetails.emergencyContact.forEach((element, i) => {
          control.push(this.createContact(element.Name, element.PhoneNo));
        });
      }
      console.log(this.userDetails, "userDetails");
      this.ProfileForm.controls["mobileno"].setValue(data.PhoneNo);
      this.ProfileForm.controls["emailid"].setValue(data.Email);
      this.ProfileForm.controls["adharno"].setValue(data.Aadhar);
      this.ProfileForm.controls["pannumber"].setValue(data.PAN);
      this.ProfileForm.controls["addressfc1"].setValue(data.Address.address1);
      this.ProfileForm.controls["addressfc2"].setValue(data.Address.address2);
      this.ProfileForm.controls["addressfc3"].setValue(data.Address.address3);
      this.ProfileForm.controls["addressfc4"].setValue(data.Address.address4);
      this.ProfileForm.controls["addressfc5"].setValue(data.Address.address5);
      this.ProfileForm.controls["addressfc6"].setValue(data.Address.address6);
      this.ProfileForm.controls["addressfc7"].setValue(data.Address.address7);
      this.ProfileForm.controls["addressfc8"].setValue(data.Address.address8);
      this.ProfileForm.controls["addressfc9"].setValue(data.Address.address9);
      this.ProfileForm.controls["addressfc10"].setValue(data.Address.address10);
      this.ProfileForm.controls["addressfc11"].setValue(data.Address.address11);
      this.ProfileForm.controls["addressfc12"].setValue(data.Address.address12);
      this.ProfileForm.controls["addressfc13"].setValue(data.Address.address13);
      this.ProfileForm.controls["zipcode"].setValue(data.Address.zipCode);
      this.spinnerService.hide();
    });
  }

  createContact(value1, value2): FormGroup {
    return this._fb.group({
      name: [value1, [Validators.required]],
      phone: [value2, [Validators.required]]
    });
  }

  updateinfo() {
    let data = {
      tokenId: this.localUserData.TokenId,
      PhoneNo: this.ProfileForm.get("mobileno").value,
      Email: this.ProfileForm.get("emailid").value,
      Aadhar: this.ProfileForm.get("adharno").value,
      PAN: this.ProfileForm.get("pannumber").value,
      Address: {
        addressType: this.userDetails.Address.addressType,
        address1: this.ProfileForm.get("addressfc1").value,
        address2: this.ProfileForm.get("addressfc2").value,
        address3: this.ProfileForm.get("addressfc3").value,
        address7: this.ProfileForm.get("addressfc7").value,
        address6: this.ProfileForm.get("addressfc6").value,
        address5: this.ProfileForm.get("addressfc5").value,
        address4: this.ProfileForm.get("addressfc4").value,
        address9: this.ProfileForm.get("addressfc9").value,
        zipCode: this.ProfileForm.get("zipcode").value,
        address8: this.ProfileForm.get("addressfc8").value,
        address10: this.ProfileForm.get("addressfc10").value,
        address11: this.ProfileForm.get("addressfc11").value,
        address12: this.ProfileForm.get("addressfc12").value,
        address13: this.ProfileForm.get("addressfc13").value,
        startDate: this.userDetails.Address.startDate
      },
      dependants: this.userDetails.dependants,
      emergencyContact: this.ProfileForm.get("contacts").value
    };
    console.log(data, "data..");
    const link = Constant.UpdateUserProfile;
    this._services.postService(link, data).then((respdata: any) => {
      this.userdata = respdata;
      console.log(this.userdata, "this.userdata");
      if (respdata.d.length > 0) {
        //this._services.showSnackbar('status': 'Please make atleast one declaration!');
        this._services.showSnackbar({
          status: "Updated Successfully!"
        });
        // this.navCtrl.pop({ animate: true, animation: 'ios-transition', duration: 1000, direction: 'back' });
      } else {
        this._services.showSnackbar("Error in updating profile data");
        //this.navCtrl.pop({ animate: true, animation: 'ios-transition', duration: 1000, direction: 'back' });
      }
    });
  }

  onkeyPress(event) {
    // if (event.target.value.length > 0) {
    //   return false;
    // }
    // if (event.target.value.length + 1 > 5) {
    //   return false;
    // }

    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
  }

}
