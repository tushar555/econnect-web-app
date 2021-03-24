import { Constant } from './../../services/constant';
import { CommonService } from './../../services/common.service';
import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss']
})
export class HospitalComponent implements OnInit {
  localUserData: any;
  public hospitalList: any;
  public queryString: any;
  showInfo: boolean = false;
  public originHospitalList: any = [];
  title: string = "Hospital";
  datanotfound: any;
  curPage: number;
  searchText: string
  totalPages: any;
  showCross: boolean;
  constructor(private _services: CommonService,
    private _spinnerService: Ng4LoadingSpinnerService) {
    // this._spinnerService.show();
    this._services.titleMessageSource.next("Hospital List");
    this.datanotfound = 'assets/img/notfound.png';

    this.curPage = 1;
    this._services.getUserDetail().then((data)=>{
      this.localUserData = data;
    })
  }

  ngOnInit() {

    this.hospitalListApi(1, '');
    // this._spinnerService.hide();
  }

  resetHospitalList() {
    this.curPage=1;
    this.showCross=false;
    this.hospitalListApi(1, '');
    this.searchText = '';
  }

  getHospital(source) {
   // console.log(this.searchText);
    if (source == 'p') {
      if(this.curPage >1){
        this.curPage--;
      }else{
        return false;
      }


    } else if (source == 'n') {
      if(this.curPage<this.totalPages){
        this.curPage++;
      }else{
        return false;
      }
    } else if (source == 's') {
      if (this.searchText.length >= 1 && this.searchText.length < 3) {
        return false;
      }
      if(this.searchText.length >= 1){
        this.showCross=true;
      }else{
        this.showCross=false;
      }
      this.curPage = 1;
    } else {
      return false;
    }

    this.hospitalListApi(this.curPage, this.searchText);
  }

  hospitalListApi(pagenumber, searchText) {
    this._spinnerService.show();
    let url = Constant.hospital;
    let param = {
      // "tokenid": this._storage.get('username').TokenId,
      "tokenid": this.localUserData.TokenId,
      "SearchText": searchText,
      "PageNo": pagenumber
    }

   // console.log('HELLLLLOOOOO');

    this._services.postService(url, param).then((response) => {
console.dir(response);
      this.hospitalList = response;
      this.totalPages=this.hospitalList.TotalPages;
      this.hospitalList=this.hospitalList.HospitalList;

    //  console.log('HHHHEHEHEHEHEHH', this.hospitalList);
      this.originHospitalList = response;
      this.showInfo = true;
      this._spinnerService.hide();
    });
  }
  filterItem(inputValue) {
   // console.log(inputValue);
  }

  onSearchChange(searchValue) {
    //let searchValue = eve.target.value;
    if (searchValue.length > 0) {
      this.hospitalList = this.customFilter(this.hospitalList, searchValue);
    }
    else {
      this.hospitalList = this.originHospitalList;
    }
    // var resultObject = this.search(searchValue, this.hospitalList);
    // console.log(resultObject);
    // this.productList = [{ category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football' }, { category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball' }, { category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball' }, { category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch' }, { category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5' }, { category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7' }];

  }

  search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i];
      }
    }
  }


  customFilter(objList, text) {
    // if (undefined === text || text === '') return objList;
    return objList.filter(product => {
      let flag;
      for (let prop in product) {
        flag = false;
        flag = product[prop].toString().indexOf(text) > -1;
        if (flag)
          break;
      }
      return flag;
    });
  }

}
