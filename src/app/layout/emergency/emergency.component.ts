import { Constant } from './../../services/constant';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-store';
import { CommonService } from '../../services/common.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

class Employee {
  name: string;
  tokenId: string;
  contacts: any;
}

declare var $: any;

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.scss']
})
export class EmergencyComponent implements OnInit {
  localUserData: any;
  showNoRecord: boolean;
  showDetails: any = true;
  userInfo: any = {};
  tokenId: any;
  searchItem: string = "";
  contactList = [];
  anotherContactList = [];
  showList: any = false;
  contactDetails = [];
  datanotfound: any;
  recordnotfound: any;
  showInfo: boolean = false;
  selectedEmployee: Employee = new Employee;
  loaderSearch: boolean = false;

  constructor(public spinnerService: Ng4LoadingSpinnerService, public local: LocalStorageService, private _services: CommonService) {
    this.selectedEmployee.name = '';
    this.selectedEmployee.tokenId = '';
    this.selectedEmployee.contacts = [];

    this._services.getUserDetail().then((data) => {
      this.localUserData = data;
      this.userInfo = this.localUserData;
      this.tokenId = this.userInfo.TokenId;
    });
    // this.userInfo = this.local.get('username');
    this.datanotfound = 'assets/img/defaultnotfound.png';
    this.recordnotfound = 'assets/img/notfound.png';
    this._services.titleMessageSource.next("Emergency Contacts");
  }

  ngOnInit() {
    console.log(this.selectedEmployee.contacts.length);
    this.spinnerService.show();
    let url = Constant.getEmergencyContact;
    let param = JSON.stringify({
      "tokenid": this.tokenId,
      "RequestTokenId": this.tokenId
    });
    this._services.postService(url, param)
      .then((data: any) => {
        //console.log('data', data);


        this.showInfo = true;
        this.contactDetails = data;
        this.spinnerService.hide();
      })
  }

  reset(){
    console.log('reset');
    this.searchItem = '';
    this.selectedEmployee.name = '';
    this.selectedEmployee.tokenId = '';
    this.selectedEmployee.contacts = [];
    this.showList = false;
    this.contactList = [];
    this.showDetails = true;
    this.ngOnInit();
  }

  searchContact(param) {
    let text = param.target.value;
    let length = text.length;
    this.showNoRecord = false;
    console.log(text, length);
    // console.log('contactList', this.contactList);

    // console.log('contactList1', this.contactDetails);
    switch (true) {
      case (length < 1):
        this.reset();
        break;
      case (length >= 3):
        // this.showDetails = true;
        this.showDetails = false;
        this.getContacts(text);
        console.log('in Case 1');
 
        break;
      case (length < 3):
        // console.log('in Case 2');

        this.contactList = [];
        this.anotherContactList = [];
        this.showList = false;
        // this.showDetails = false;
        break;
      case (length > 3):
        console.log('in Case 3');
        this.showDetails = false;


        // console.log('in Case 3 else');
        this.initialize('', '');
        this.contactList.map(item => item.Name);
        this.contactList = this.contactList.filter((item) => {
          return (item.Name.toLowerCase().indexOf(text.toLowerCase()) > -1);
        });

        if (this.contactList.length === 0) {

          this.showNoRecord = true;
          // console.log('No record ', this.showNoRecord);

          //this.getContacts(param);
        }

        break;
    }

  }

  getContacts(param) {
    let url = Constant.employeeSearch;
    let param1 = JSON.stringify({
      "tokenid": this.tokenId,
      "search_text": param
    });
    this.showList = true;
    // this.spinnerService.show()
    this.loaderSearch = true;
    this._services.postService(url, param1,false)
      .then((resp: any) => {
        // this.showSnackbar();

        if (resp.Message === 'Success') {
          this.contactList = resp.employees;
          this.initialize(this.contactList, 'fromget');
          console.log(this.contactList);
          // this.spinnerService.hide()
          this.loaderSearch = false;
        } else {
          // console.log('Server Error');
          this._services.showSnackbar('Data Not Found!');
          this.loaderSearch = false;
          // this.spinnerService.hide()
        }
      })
      .catch((error)=>{
        console.log(error);
        this.loaderSearch = false;
      })
  }

  initialize(temp, flag) {
    if (flag === 'fromget') {
      this.contactList = temp;
      this.anotherContactList = temp
    } else {
      this.contactList = this.anotherContactList;
      // console.log('from else ');

    }
    //  console.log('from initialize', this.contactList);
  }

  ngOnDestroy() {
    this._services.spinnerService.hide();
  }

  showContacts(contact) {
    console.log(contact);
    this.selectedEmployee.name = contact.Name;
    this.selectedEmployee.tokenId = contact.TokenId;
    this.getEmergencyContacts(contact.TokenId)
    .then((res:any)=>{
      $('#employeeContacts').modal('show');
      this.selectedEmployee.contacts = res;
    },(err)=>{
      console.log(err);
      this.selectedEmployee.contacts = null;
    })
  }

  getEmergencyContacts(tokenid) {
    return new Promise((resolve, reject) => {
      this._services.getUserDetail()
        .then((user: any) => {
          console.log(user);
          this.spinnerService.show();
          let data = {
            tokenId: user.TokenId,
            RequestTokenId: tokenid
          }
          this._services.postService(Constant.getEmergencyContact, data)
            .then((resp: any) => {
              console.log(resp);
              // this.contactDetails = resp;
              resolve(resp);
              this.spinnerService.hide();
            }).catch((error: any) => {
              console.log('emergency contacts',error);
              reject(error);
              this._services.showSnackbar(error);
              this.spinnerService.hide();
            })
        })
    })
  }
}
