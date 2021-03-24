import {Component} from '@angular/core';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {CommonService} from '../../services/common.service';
import {Constant} from '../../services/constant';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-form16',
  templateUrl: './form16.component.html',
  styleUrls: ['./form16.component.scss']
})
export class Form16Component {
  year: any = null;
  date = new Date();
  yearsArray = [];
  localUserData: any;
  tokenId: any;
  userDetails: any = {};
  showModal = 'none';
  fileURL: any;
  shownorecord: any;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private _services: CommonService,
    public sanitize: DomSanitizer,
  ) {
    this.fileURL = this.sanitize.bypassSecurityTrustResourceUrl('');
    this._services.titleMessageSource.next('Form16');

    this._services.getUserDetail().then((data) => {
      this.localUserData = data;
      this.tokenId = this.localUserData.TokenId;
      this.userDetails = this.localUserData;
    });
    this.getServerDate();
  }

  closeModal() {
    this.showModal = 'none';
  }

  openModal() {
    return {'display': this.showModal};
  }

  getServerDate() {
  //  this.spinnerService.show();
    this._services.getService(Constant.getServerDateTime).then((newdate: any) => {
      this.date = new Date(newdate);
      let currentYear = this.date.getFullYear().toString().substring(2);
      for (let i = 0; i <= 2; i++) {
        this.yearsArray.push((this.date.getFullYear() - (i + 1)) + '-' + (parseInt(currentYear) - i));
      }
    });
  }

  getForm16() {
    this.shownorecord = false;
    console.log(this.year);
    if (!this.year) { return false; }
    let data = {};
    this.spinnerService.show();
    this.shownorecord = false;
    data = {
      'TokenId': this.tokenId,
      'FinancialYear': this.year
    };
    const link = Constant.form16;

    this._services.postService(link, data).then((respdata: any) => {
      this.shownorecord = (!respdata.Base64File) ? false : true;
      if (respdata.Message === 'Success') {
        // this.showModal = 'block';

        const binaryString = window.atob(respdata.Base64File);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
          const ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
        }
        // console.log('abcd:::' + binaryString + '|' + binaryLen);
        console.log('bytes: ', bytes);
        const blob = new Blob([bytes], {type: 'application/pdf'});
        console.log('blob: ', blob);
        const tempFile = URL.createObjectURL(blob);
        console.log('tempFile: ', tempFile);
        this.fileURL = this.sanitize.bypassSecurityTrustResourceUrl(tempFile);
        console.log('fileURL: ', this.fileURL);


        /*const a = document.createElement('a');
        // @ts-ignore
        a.style = 'display: none';
        a.href = tempFile;
        a.download = 'myFile.pdf'; // gives it a name via an a tag

        a.click();*/

        this.spinnerService.hide();
      } else {
        this.spinnerService.hide();
        // this._services.showSnackbar({ "status": 'Record Not Found!' })
      }
    });
  }
}
