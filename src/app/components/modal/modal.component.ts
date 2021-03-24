import {
  Component,
  OnInit,
  NgZone,
  Input,
  Injectable,
  EventEmitter,
  Output
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  FormControl
} from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Constant } from '../../services/constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as moment from 'moment';
import { PincodeArray } from '../../services/commonArray';
import {
  NgbDateStruct,
  NgbDatepickerConfig,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';

import { NgbDateCustomParserFormatter } from '../../services/dateformat';
import { HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
//import 'rxjs/add/observable/fromEvent';

declare var jquery: any;
declare var $: any;

@Injectable()
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class ModalComponent implements OnInit {

  @Output() CloseModalEvent = new EventEmitter();
  @Input() SchemeId: any;

  localUserData: any;
  DeclarationId: any;
  ageArray = [];
  modalSchemeId: any;
  entryType: any;
  formControlFields: any = [];
  modalHeader: any;
  items: any = [{}];
  ngForm: FormGroup;
  fieldDetailsArray: any = [];
  formData = new FormData();
  previousDeclarationDetails: any = [];
  clickFrom: string;
  //admin
  adminRemark: string;
  actionType: string;
  errMsg: boolean;
  isValidDate = true;
  empToken: string;
  hraMonths: any = [];
  typeForIncomeHouse: any = [];
  totalHraAmount: number;
  selectedAttachment: any;
  confirmHiddenBlock = true;
  deleteHiddenBlock = true;
  ActualsPeriod: any;
  DeclarationPeriod: any;
  model: NgbDateStruct;
  date: { year: number };
  paymentDateBetween: any = [];
  amountConsider: any = [];
  minDate: { year: number; month: number; day: number };
  maxDate: { year: number; month: number; day: number };
  schemeSeletedValue: any = [];
  selectedChildName: any = '';
  bankwisePanDetails: any = [];
  employeeAge: any;
  dependentChildAge;
  dependentSpouseAge;
  dependentFatherAge: any;
  dependentMotherAge: any;
  inValidDate: any = [];
  FromDateArray = [];
  ToDateArray = [];
  inValidPaymentDate: any = [];
  empName: any;
  SchemeStatus: any = '';
  pincodeWiseArray: PincodeArray[] = [{
    Pincode: '422423',
    City: 'Mumbai',
    Ismetro: true
  },
  {
    Pincode: '422422',
    City: 'Nashik',
    Ismetro: false
  },
  {
    Pincode: '422421',
    City: 'Pune',
    Ismetro: false
  }, {
    Pincode: '422420',
    City: 'Kolkata',
    Ismetro: true
  },
  {
    Pincode: '422419',
    City: 'Thane',
    Ismetro: false
  }
  ];
  isSelfSelected = false;

  //allFiles = []
  displayFiles = [];
  uploadButton: string[] = [];
  warningMessage: string[] = [];
  isEachFileUploaded: boolean = true;
  allowedFileType = [ 'application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  processing : boolean;
  constructor(
    public formBuilder: FormBuilder,
    public service: CommonService,
    public spinnerService: Ng4LoadingSpinnerService,
    public zone: NgZone,
    public config: NgbDatepickerConfig,
    private sanitizer: DomSanitizer
  ) {

    $(document).ready(() => {
      $('.mydatepicker').keydown(false);
      $('#ProofModal').modal({
        backdrop: 'static',
        keyboard: false
      });

      let today = new Date();

      $('body').on('focus', '.datepicker_recurring_start', function () {
        $(this).datepicker({
          dateFormat: 'dd-M-yy',
          autoclose: true,
          endDate: 'today',
          maxDate: today
        });
      });
    });

  }

  async ngOnInit() {
    this.init();
    this.initForm();
    await this.initUser();
    this.initDetailsArray();
    this.setHraMonths();
    this.initValidationsAndAge();
    this.patchValues();

    await this.getBankWisePan();
    await this.getDateTime();

   }

    init(){
      this.FromDateArray = [];
      this.ToDateArray = [];
      this.ageArray = [];
      this.inValidDate = [];
      this.DeclarationId = this.service.admindeclarationDetails ?
        this.service.admindeclarationDetails.DeclarationId :
        '';
      this.empToken = this.service.empToken;
      this.clickFrom = this.service.clickFrom;
      this.modalHeader = this.service.modalHeader;
      this.entryType = this.service.entryType;
      this.ActualsPeriod = this.service.ActualsPeriod;
      this.DeclarationPeriod = this.service.DeclarationPeriod;

      this.dependentChildAge =
        this.service.userDetails.dependentChildAge === '' ?
          9999 :
          this.service.userDetails.dependentChildAge;
      this.dependentSpouseAge =
        this.service.userDetails.dependentSpouseAge === '' ?
          9999 :
          this.service.userDetails.dependentSpouseAge;
      this.dependentMotherAge = this.service.userDetails.dependentMotherAge === '' ? 9999 :
        this.service.userDetails.dependentMotherAge;
      this.dependentFatherAge =
        this.service.userDetails.dependentFatherAge === '' ?
          9999 :
          this.service.userDetails.dependentFatherAge;

      this.fieldDetailsArray = this.service.fieldDetailsArray;

      if (
        this.service.previousDeclarationDetails !== null &&
        this.service.previousDeclarationDetails !== undefined &&
        this.service.previousDeclarationDetails.length !== 0
      ) {
        this.previousDeclarationDetails = this.service.previousDeclarationDetails;
      } else {
        this.previousDeclarationDetails = [];
      }

    }

    async initUser(){
      this.localUserData = await this.service.getUserDetail();

      if (this.clickFrom === 'admin') {
        this.empName = this.service.empName;
        this.employeeAge = this.service.empAge;
        this.modalSchemeId = this.service.admindeclarationDetails ?
          this.service.admindeclarationDetails.SchemeID :
          '';
      } else {
        this.SchemeStatus = this.service.SchemeStatus;
        this.modalSchemeId = this.service.declarationId;
        if (this.localUserData) {
          this.employeeAge = this.localUserData.Age ?
            this.localUserData.Age :
            0;
        }
        this.empName = `${this.localUserData.FirstName} ${this.localUserData.LastName}`;
      }
    }

    initDetailsArray(){

      switch (this.modalSchemeId){
        case 8:case 9:
          this.fieldDetailsArray[0]['options'] = [{
            value: 'self',
            label: 'Self',
            Age: this.employeeAge
          },
          {
            value: 'child',
            label: 'Child',
            Age: this.dependentChildAge
          },
          {
            value: 'spouse',
            label: 'Spouse',
            Age: this.dependentSpouseAge
          }
          ];
          break;

          case 13:
          this.fieldDetailsArray[0]['options'] = [{
            value: 'mother',
            label: 'Mother',
            Age: this.dependentMotherAge
          },
          {
            value: 'father',
            label: 'Father',
            Age: this.dependentFatherAge
          }
          ];
          break;

          case 12:
          this.fieldDetailsArray[0]['options'] = [{
            value: 'self',
            label: 'Self',
            Age: this.employeeAge
          },
          {
            value: 'child',
            label: 'Child',
            Age: this.dependentChildAge
          },
          {
            value: 'spouse',
            label: 'Spouse',
            Age: this.dependentSpouseAge
          }
          ];
            break;

          case 16:case 17:
          this.fieldDetailsArray[0]['options'] = [{
            value: 'child',
            label: 'Child',
            Age: this.dependentChildAge
          },
          {
            value: 'spouse',
            label: 'Spouse',
            Age: this.dependentSpouseAge
          },
          {
            value: 'mother',
            label: 'Mother',
            Age: this.dependentMotherAge
          },
          {
            value: 'father',
            label: 'Father',
            Age: this.dependentFatherAge
          },
          {
            value: 'brother',
            label: 'Brother',
            Age: 0
          },
          {
            value: 'sister',
            label: 'Sister',
            Age: 0
          }
          ];
          break;

          case 10:case 11:
            this.fieldDetailsArray[0]['options'] = [{
              value: 'mother',
              label: 'Mother',
              Age: this.dependentMotherAge
            },
            {
              value: 'father',
              label: 'Father',
              Age: this.dependentFatherAge
            }
            ];
            break;
            case 21:case 22:
              this.fieldDetailsArray[0]['options'] = [{
                value: 'self',
                label: 'Self',
                Age: this.employeeAge
              },
              {
                value: 'child',
                label: 'Child',
                Age: this.dependentChildAge
              },
              {
                value: 'spouse',
                label: 'Spouse',
                Age: this.dependentSpouseAge
              },
              {
                value: 'mother',
                label: 'Mother',
                Age: this.dependentMotherAge
              },
              {
                value: 'father',
                label: 'Father',
                Age: this.dependentFatherAge
              },
              {
                value: 'brother',
                label: 'Brother',
                Age: 0
              },
              {
                value: 'sister',
                label: 'Sister',
                Age: 0
              }
              ];
              break;

      }

    }

    async getBankWisePan() {
      const url = Constant.GetBankPAN;
      const param = {
        tokenid: this.localUserData.TokenId
      };
      let details;
      details = await this.service.postService(url, param).then();
      this.bankwisePanDetails  = [...details]
      this.bankwisePanDetails.forEach((obj: any) => { obj.PAN = obj.value; obj.value = obj.label });
      this.spinnerService.hide();
    }

    async getDateTime() {
      const dateTime = await this.service.getService(Constant.getServerDateTime);
      const year = moment(dateTime).year();
      this.maxDate = {
        year: moment(dateTime).year(),
        month: moment(dateTime).month() + 1,
        day: moment(dateTime).date()
      };

    }

    setHraMonths() {
      const curMonth = moment().get('month');
      let startMonthYear: any;
      let endMonthYear: any;
      if (curMonth > 2) {
        startMonthYear = moment().format('YYYY-04-01');
        endMonthYear = moment()
          .add(1, 'year')
          .format('YYYY-03-31');
      } else {
        startMonthYear = moment()
          .subtract(1, 'year')
          .format('YYYY-04-01');
        endMonthYear = moment().format('YYYY-03-31');
      }
      for (let i = 0; i < 12; i++) {
        const curMonth = moment(startMonthYear).add(i, 'month');
        this.hraMonths.push({
          label: curMonth.format('MMM YYYY'),
          value: curMonth.format('YYYY-MM')
        });
      }
    }

    initForm() {
      this.ngForm = this.formBuilder.group({
        items: this.formBuilder.array([this.createNgForm()])
      });
      if ( this.previousDeclarationDetails !== null && this.previousDeclarationDetails.length !== 0 ) {
        const declaration = this.service.entryType === 'multiple' ? this.previousDeclarationDetails[0] : this.previousDeclarationDetails
        for (let i = 0; i < declaration.length - 1; i++) {
          this.addProof('start');
        }
        this.addProofFiles()
      }
    }

    initValidationsAndAge(){

      for (let k = 0; k < this.ngForm.value.items.length; k++) {
        this.makeRemarkRequiredField(k);
      }

      switch(this.modalSchemeId) {

        case 8:case 10:case 22:
          this.fieldDetailsArray[0]['options'] = this.fieldDetailsArray[0][
            'options'
          ].filter(obj => (obj.Age === 0 || obj.Age < 60) && obj.Age !== 9999);
          break;

        case 9:case 11:case 21:
          this.fieldDetailsArray[0]['options'] = this.fieldDetailsArray[0][
            'options'
          ].filter(obj => (obj.Age >= 60 || obj.Age === 0) && obj.Age !== 9999);
          break;

         case 12:case 13:case 16:case 17:
          this.fieldDetailsArray[0]['options'] = this.fieldDetailsArray[0][
            'options'
          ].filter(obj => obj.Age !== 9999);
           break;
      }
    }

    patchValues() {
      this.previousDeclarationDetails.forEach((item, i) => {
        if (this.modalSchemeId == 6) {
          this.checkFields(item.Type, i, '');
        }
        this.patchValue(item, i);
      });

      if (this.previousDeclarationDetails.length === 0 && this.modalSchemeId === 2) {
        const modalFormArray = this.ngForm.get('items') as FormArray;
        let today = new Date();
        let fromYear;
        let toYear;

        if ((today.getMonth() + 1) <= 3) {
          fromYear = (today.getFullYear() - 1);
          toYear = today.getFullYear()
        } else {
          fromYear = today.getFullYear();
          toYear = (today.getFullYear() + 1);
        }

        modalFormArray.at(0).patchValue({
          FromDate: { year: fromYear, month: 4, day: 1 },
          ToDate: { year: toYear , month: 3, day: 31 }
        });
      }

      if (this.clickFrom == 'admin') {
        this.modalSchemeId = this.service.admindeclarationDetails ? this.service.admindeclarationDetails.SchemeID : '';
      } else {
        this.modalSchemeId = this.service.declarationId;
      }
      if (this.modalSchemeId == 6) {
        for (let i = 1; i <= this.previousDeclarationDetails.length - 1; i++) {
          this.fieldDetailsArray.forEach(item => {
            $('#' + item.name + i).attr('disabled', 'disabled');
          });
        }
      }

      if (this.modalSchemeId === 36) {
        const DeclarationDetails = this.service.schemeDeclaration
          .find(obj => obj.Section === '80C')
          .subSectiondetails.find(obj => obj.SchemeID === 35)
          .DeclarationDetails;
        if (DeclarationDetails) {
          this.selectedChildName = DeclarationDetails[0].ChildName;
        }
      }

      this.patchProfileName(0);
    }
    addProofFiles() {
      let previousDeclarationDetails = [];
      if (this.service.entryType === 'multiple') {
        previousDeclarationDetails = this.previousDeclarationDetails[0];
      } else {
        previousDeclarationDetails = this.previousDeclarationDetails;
      }

    previousDeclarationDetails.forEach((obj, i) => {
      if (!obj.Proofs) {
        this.displayFiles[i] = [];
      } else {
        this.displayFiles[i] = obj.Proofs ? obj.Proofs : []
      }
    })
    this.previousDeclarationDetails = previousDeclarationDetails;
  }

  getMinDate(obj) {
    const currentMonth = moment(this.localUserData).month() + 1;
    let startFinancialYear: any;
    if (currentMonth >= 4) {
      startFinancialYear = moment(this.localUserData).year();
    } else {
      startFinancialYear = moment(this.localUserData).year() - 1;
    }

    switch (true) {
      case this.modalSchemeId === 28 || this.modalSchemeId === 27:
        return {
          year: startFinancialYear,
          month: 4,
          day: 1
        };
        break;
      case this.modalSchemeId === 30 || this.modalSchemeId === 31:
        return {
          year: moment(this.localUserData).year() - 15,
          month: 4,
          day: 1
        };
      case obj.name == 'SanctionDate':
        return {
          year: 2019,
          month: 4,
          day: 1
        };
      case obj.name === 'PolicyDate':
        return {
          year: 1965,
          month: 1,
          day: 1
        };
      case obj.name === 'PossessionDate':
        return {
          year: 1965,
          month: 1,
          day: 1
        };
      case obj.name == 'PaymentDate' ||
        obj.name == 'FromDate' ||
        obj.name == 'ToDate':
        return {
          year: startFinancialYear,
          month: 4,
          day: 1
        };
      default:
        return {
          year: startFinancialYear,
          month: 4,
          day: 1
        };
    }
  }

  getmaxDate(obj) {
    const currentMonth = moment(this.localUserData).month() + 1;
    let endFinancialYear: any;
    if (currentMonth >= 4) {
      endFinancialYear = moment(this.localUserData).year() + 1;
    } else {
      endFinancialYear = moment(this.localUserData).year();
    }

    switch (true) {
      case obj.name == 'SanctionDate':
        return {
          year: 2021,
          month: 3,
          day: 31
        };
        break;
      case obj.name === 'PolicyDate':
        return {
          year: endFinancialYear,
          month: 3, // moment(this.localUserData).month(),
          day: 31 //moment(this.localUserData).date()
        };
        break;
      case obj.name == 'PaymentDate' ||
        obj.name == 'FromDate' ||
        obj.name == 'ToDate':
        return {
          year: endFinancialYear,
          month: 3,
          day: 31
        };
        break;
      case obj.name == 'PossessionDate':
        return {
          year: endFinancialYear,
          month: 3,
          day: 31
        };
        break;
      default:
        return {
          year: endFinancialYear,
          month: 3,
          day: 31
        };
        break;
    }
  }


  getAllPincode() {
    const url = Constant.getPincodes;
    const param = {
      tokenid: this.localUserData.TokenId
    };
    this.service.postService(url, param).then((resp: PincodeArray[]) => {
      this.pincodeWiseArray = resp;
    });
  }

  getNgclassForSingleinp(obj) {
    return {
      'checkbox-style': obj.type == 'checkbox',
      'loan-taken': obj.name === 'PF' ||
        obj.name === 'MedicalExemption' ||
        obj.name === 'LoanSanctioned'
    };
  }

  makeRemarkRequiredField(i) {

    const modalFormArray1 = this.ngForm.get('items') as FormArray;
    if (this.clickFrom === 'admin') {
      modalFormArray1
        .at(i)
        .get('Remarks')
        .setValidators([Validators.required]);
      this.fieldDetailsArray.map(obj => {
        obj.isRequired = obj.name === 'Remarks' ? true : obj.isRequired;

        return obj;
      });
    } else if (this.clickFrom === 'employee') {
      modalFormArray1
        .at(i)
        .get('Remarks')
        .setValidators([]);
      this.fieldDetailsArray.map(obj => {
        obj.isRequired = obj.name === 'Remarks' ? false : obj.isRequired;

        return obj;
      });
    }

    modalFormArray1
      .at(i)
      .get('Remarks')
      .updateValueAndValidity();
  }

  patchProfileName(i) {
    if (!this.localUserData) {
      return false;
    }
    // this.makeRemarkRequiredField(i);

    if (
      this.modalSchemeId == 29 ||
      // this.modalSchemeId == 28 ||
      this.modalSchemeId == 30 ||
      this.modalSchemeId == 19
    ) {
      const modalFormArray = this.ngForm.get('items') as FormArray;

      modalFormArray.at(i).patchValue({
        AccountHolderName: this.empName,
        EmployeeName: this.empName
      });
      // modalFormArray
      //   .at(0)
      //   .get("AccountHolderName")
      //   .disable();
    }

    if (
      this.modalSchemeId === 37 ||
      this.modalSchemeId === 35 ||
      this.modalSchemeId === 36
    ) {
      if (
        this.service.userDetails.dependentAllChild &&
        this.service.userDetails.dependentAllChild.length !== 0
      ) {
        this.fieldDetailsArray.forEach(obj => {
          const childrenNames = this.service.userDetails.dependentAllChild;

          if (this.modalSchemeId == 37) {
            obj.options = childrenNames.filter(obj => obj.Gender == 'F');
          } else {
            obj.options = childrenNames.filter(
              obj => obj.label !== this.selectedChildName
            );
          }
        });
      }
    }

    if (
      this.modalSchemeId == 32 ||
      this.modalSchemeId == 37 ||
      this.modalSchemeId == 20
    ) {
      const modalFormArray = this.ngForm.get('items') as FormArray;
      modalFormArray.at(i).patchValue({
        DepositerName: this.empName
      });

      // modalFormArray.at(0).patchValue({'DaughterName':})
    }

    if (this.modalSchemeId == 38 || this.modalSchemeId == 39) {
      const modalFormArray = this.ngForm.get('items') as FormArray;
      modalFormArray.at(i).patchValue({
        InvestorName: this.empName
      });
    }
  }
  toggle(i) {
    $('#innerproofDetails' + i).slideToggle('slow');
  }

  hideModal(k) {
    $('#innerproofDetails' + k).hide('slow');
  }

  openDeleteConfirm(i) {
    this.selectedAttachment = i + 1;
    this.deleteHiddenBlock = false;
    $('#ProofModal .modal-body').animate({
      scrollTop: document.body.scrollHeight + 300
    },
      'slow'
    );
    for (let k = 0; k < this.ngForm.value.items.length; k++) {
      this.hideModal(k);
    }
    //  $("#deleteConformationModal").modal('show');
  }
  closeDeleteBlock() {
    this.deleteHiddenBlock = true;
  }

  patchValue(item, i) {
    //  // return true
    const modalFormArray = this.ngForm.get('items') as FormArray;

    if (item.length === undefined || item.length === 0) {
      // tslint:disable-next-line: forin
      for (const g in item) {
        // if (typeof item[g] !== "object") {

        const dateform = moment(item[g], 'YYYY-MM-DDT00:00:00', true).isValid();
        if (dateform) {
          let month = moment(item[g]).format('M');
          let day = moment(item[g]).format('D');
          let year = moment(item[g]).format('YYYY');
          item[g] = {
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day)
          };
          // }
        }

        if (g === 'PolicyDate') {
          this.onDateChanged(i, item[g]);
        }
      }
      modalFormArray.at(i).patchValue(item);
      this.disbaleFields(i);
      this.onKeyupEvent(i);
      //modalFormArray.at(i).patchValue(this.previousDeclarationDetails[i]);
    } else {
      this.previousDeclarationDetails[0].forEach((obj, j) => {
      //  debugger;
        // tslint:disable-next-line: forin
        for (const g in obj) {
          if (typeof obj[g] !== 'object') {
            // debugger;
            const dateform = moment(
              obj[g],
              'YYYY-MM-DDT00:00:00',
              true
            ).isValid();
            if (dateform) {
              // debugger;
              let month = moment(obj[g]).format('M');
              let day = moment(obj[g]).format('D');
              let year = moment(obj[g]).format('YYYY');
              obj[g] = {
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day)
              };
            }
          }

          if (g === 'PolicyDate') {
            this.onDateChanged(j, obj[g]);
          }
        }

        modalFormArray.at(j).patchValue(obj);
        this.onKeyupEvent(j);
      });
    }
  }

  deleteProof() {
    const control = this.ngForm.controls['items'] as FormArray;
    control.removeAt(this.selectedAttachment - 1);
    this.displayFiles.splice(this.selectedAttachment-1,1);
    this.deleteHiddenBlock = true;

    if (this.modalSchemeId === 25) {
      this.amountConsider.splice(this.selectedAttachment - 1, 1);
    }
  }

  async uploadFiles() {

   const length = this.ngForm.get('items')['controls'].length;
    for(let i=0; i<length; i++) {

      let uploadedFiles = [];
      for (let index = 0; index < this.displayFiles[i].length; index++) {

        let tmpfile ;
        if(this.displayFiles[i][index].Id){
          tmpfile = this.displayFiles[i][index];
        }else {
          const formData = new FormData();
          formData.append('TokenId', this.clickFrom === 'admin' ? this.empToken : this.localUserData.TokenId);
          formData.append('CreatedBy', this.localUserData.TokenId);
          formData.append('SchemeId', this.modalSchemeId);
          formData.append('Id', this.displayFiles[i][index].Id);
          formData.append('file', this.displayFiles[i][index]);
          const file = await this.upload(formData);
            tmpfile = file[0];
           }
           uploadedFiles.push(tmpfile);
         }
      this.displayFiles[i] = [...uploadedFiles];
      this.displayFiles[i].forEach(obj => obj._id = Math.random());
      // this.uploadButton[i] = 'Upload'
      // this.warningMessage[i]='Please submit all proof details before you leave'
    }

  }

  async upload(formData) {
    const url = Constant.SubmitITProofs;
    const resp = await this.service.postuploadFile(url, formData) as HttpResponse<any>;
    return resp.body;
  }

  onFilechanged(event, i) {

    this.warningMessage = [];
    this.uploadButton = [];
    const file = event.target.files;

    const validFileformat = Array.from(file).every(( f: File) => this.allowedFileType.includes(f.type));
    const validFileName =  Array.from(file).every(( f: File)=>  f.name.split(".").length <=2 );
    if(!validFileName) {
      this.warningMessage[i] = 'File name must not include . (dot)';
      return false;
    }

    if(!validFileformat) {
      this.warningMessage[i] = 'Allowed file formats .pdf, .jpg, .jpeg, .png';
      return false;
    }
    if(this.displayFiles[i]){
      const fileNames =  Array.from(file).map(( f: File) => f.name);
      const foundFile = Array.from(this.displayFiles[i]).find((f: File ) => fileNames.includes(f.name));

      if (foundFile){
        this.warningMessage[i] = 'File name already exits! Try another';
        return false;
      }
    }

    const isValidFileSize = Array.from(file).every((f: File) => +f.size <= 2097152) //less than or equal to 2MB;
    if (!isValidFileSize) {
      this.warningMessage[i] = 'File size must be less than 2 MB!';
      return false;
    }
    if (!this.displayFiles[i]) {
      this.displayFiles[i] = [].concat(...file);
    } else {
     this.displayFiles[i].push(...file);
    }
    Array.from(file).forEach(( obj:any ) =>{obj._id = Math.random()});
  }

  deleteFile(file, i) {
    const count = this.displayFiles[i].length;
    if(count <= 1){
      this.warningMessage[i] = 'Atleast one document is required!';
      return;
    }
    this.displayFiles[i] = this.displayFiles[i].filter(obj => obj.Id? obj.Id !== file.Id : obj._id !== file._id);
  }

  selectedOption(eve, j) {
    const flag = eve.target.value;
    const modalFormArray = this.ngForm.get('items') as FormArray;
    const temp = modalFormArray.at(j).get('Relationship') ?
      modalFormArray.at(j).get('Relationship').value :
      '';
    if (flag === 'mother') {
      this.patchValueOnSelection(
        j,
        this.service.userDetails.dependentMotherName
      );

      this.patchAgeOnSelection(
        j,
        this.service.userDetails.dependentMotherAge,
        flag
      );
    }

    if (flag === 'father') {
      this.patchValueOnSelection(
        j,
        this.service.userDetails.dependentFatherName
      );
      this.patchAgeOnSelection(
        j,
        this.service.userDetails.dependentFatherAge,
        flag
      );
    }

    if (flag === 'spouse') {

      this.patchValueOnSelection(
        j,
        this.service.userDetails.dependentSpouseName
      );
      this.patchAgeOnSelection(
        j,
        this.service.userDetails.dependentSpouseAge,
        flag
      );
    }

    if (flag === 'brother' || flag === 'sister') {
      this.patchValueOnSelection(j, '');
      this.patchAgeOnSelection(j, '', flag);
    }

    if (temp === 'child') {
      // modalFormArray.at(j).patchValue({
      //   NameOfAssured: this.service.userDetails.dependentChildName
      // });
      // modalFormArray.at(j).patchValue({
      //   DependentName: this.service.userDetails.dependentChildName
      // });
      if (
        this.service.userDetails.dependentAllChild &&
        this.service.userDetails.dependentAllChild.length !== 0
      ) {
        if (
          this.service.userDetails.dependentAllChild &&
          this.service.userDetails.dependentAllChild.length !== 0
        ) {
          this.fieldDetailsArray.forEach(obj => {
            if (
              obj.name == 'NameOfAssured' ||
              obj.name == 'DependentName' ||
              obj.name == 'PatientName' ||
              obj.name == 'Name' ||
              obj.name == 'AccountHolderName'
            ) {
              obj.type = 'select';
              obj.options = this.service.userDetails.dependentAllChild;
            }
          });
        }
      }

      this.patchValueOnSelection(
        j,
        this.service.userDetails.dependentChildName,
        'Child'
      );
      this.patchAgeOnSelection(
        j,
        this.service.userDetails.dependentChildAge,
        flag
      );
    } else {
      this.fieldDetailsArray.forEach(obj => {
        if (
          obj.name == 'NameOfAssured' ||
          obj.name == 'DependentName' ||
          obj.name == 'PatientName' ||
          obj.name == 'Name' ||
          obj.name == 'AccountHolderName'
        ) {
          obj.type = 'text';
        }
      });
    }
    // modalFormArray
    //   .at(j)
    //   .get("NameOfAssured")
    //   .disable();
    // modalFormArray
    //   .at(j)
    //   .get("DependentName")
    //   .disable();
    // modalFormArray
    //   .at(j)
    //   .get("Name")
    //   .disable();

    if (flag === 'Self') {
      this.patchValueOnSelection(j, this.empName, 'Self');
      this.patchAgeOnSelection(j, this.employeeAge, flag);

      // modalFormArray.at(j).patchValue({
      //   Name: `${this.localUserData.FirstName} ${this.localUserData.LastName}`
      // });
      // modalFormArray.at(j).get("Name")
      //   ? modalFormArray
      //     .at(j)
      //     .get("Name")
      //     .disable()
      //   : "";
    }

    if (this.modalSchemeId === 6) {
      const flag = eve.target.value;

      this.fieldDetailsArray.forEach(item => {
        if (item.editable === flag) {
          $('#' + item.name + j).removeAttr('disabled');
        } else {
          $('#' + item.name + j).attr('disabled', 'disabled');
        }
      });
    }
  }

  onDateChanged(i, value) {
    const modalFormArray = this.ngForm.get('items') as FormArray;
    let FromDate: any;
    let ToDate: any;
    if (this.modalSchemeId === 2) {
      this.onFocusOutCheckHRA();
      if (modalFormArray.at(i)) {
        const temp1 = this.ngForm.value.items[i].FromDate;
        const temp2 = this.ngForm.value.items[i].ToDate;
        //this.hraMonths

        if (temp1) {
          FromDate = Date.parse(`${temp1.year}-${temp1.month}-${temp1.day}`);
        }
        if (temp2) {
          ToDate = Date.parse(`${temp2.year}-${temp2.month}-${temp2.day}`);
        }
        // debugger;
        const mapFromArray = this.ngForm.value.items.map(obj => obj.FromDate);
        const mapToArray = this.ngForm.value.items.map(obj => obj.ToDate);

        if (this.ngForm.value.items.length > 1) {
          loopStart: for (let k = 0; k < this.ngForm.value.items.length; k++) {
            if (i !== k) {
              const objFrom = Date.parse(
                `${this.ngForm.value.items[k].FromDate.year}-${this.ngForm.value.items[k].FromDate.month}-${this.ngForm.value.items[k].FromDate.day}`
              );
              const objTo = Date.parse(
                `${this.ngForm.value.items[k].ToDate.year}-${this.ngForm.value.items[k].ToDate.month}-${this.ngForm.value.items[k].ToDate.day}`
              );
              //debugger;
              if (
                objFrom >= FromDate ||
                (objFrom <= FromDate && FromDate <= objTo)
              ) {
                this.FromDateArray[i] = true;
                break loopStart;
              } else {
                this.FromDateArray[i] = false;
              }

              if (ToDate >= objFrom && ToDate <= objTo) {
                this.ToDateArray[i] = true;
                break loopStart;
              } else {
                this.ToDateArray[i] = false;
              }
            }
          }


        }

        if (FromDate > ToDate) {
          this.inValidDate[i] = true;
        } else {
          this.inValidDate[i] = false;
        }
      }
    }

    if (this.modalSchemeId === 40) {
      if (modalFormArray.at(i)) {
        const temp1 = this.ngForm.value.items[i].SanctionDate;
        const temp2 = this.ngForm.value.items[i].PossessionDate;
        const SanctionDate = Date.parse(
          `${temp1.year}-${temp1.month}-${temp1.day}`
        );
        const PossessionDate = Date.parse(
          `${temp2.year}-${temp2.month}-${temp2.day}`
        );

        if (SanctionDate > PossessionDate) {
          this.inValidDate[i] = true;
        } else {
          this.inValidDate[i] = false;
        }
      }
    }

    if (this.modalSchemeId === 25) {
      if (modalFormArray.at(i)) {
        const temp =
          value == '' ? modalFormArray.at(i).get('PolicyDate').value : value;
        const tempPaymentDate =
          value == '' ? modalFormArray.at(i).get('PaymentDate').value : value;

        const PaymentDate = Date.parse(
          `${tempPaymentDate.year}-${tempPaymentDate.month}-${tempPaymentDate.day}`
        );
        const PolicyDate = Date.parse(`${temp.year}-${temp.month}-${temp.day}`);
        if (PaymentDate < PolicyDate) {
          this.inValidPaymentDate[i] = true;
        } else {
          this.inValidPaymentDate[i] = false;
        }

        const condition1 = Date.parse('2012-4-1');
        const condition2 = Date.parse('2013-3-31');
        if (PolicyDate < condition1) {
          this.paymentDateBetween[i] = 'before';
        } else if (PolicyDate >= condition1 && PolicyDate <= condition2) {
          this.paymentDateBetween[i] = 'between';
        } else if (PolicyDate > condition2) {
          this.paymentDateBetween[i] = 'after';
        }
      }
    }

    // this.ngForm.value.items[j][name] = inputDate;
  }



  getPremiumAmount(amount) {
    return isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
  }

  getPolicyAmount(amount) {
    return isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
  }

  checkBoxClick(obj, event, i) {
    if (this.modalSchemeId === 6) {
      // debugger;
      const modalFormArray = this.ngForm.get('items') as FormArray;
      const Type = modalFormArray
        .at(i)
        .get('Type').value;
      const RentReceivedAnnually = modalFormArray
        .at(i)
        .get('RentReceivedAnnually').value;

      const InterestBorrowedCapital = modalFormArray
        .at(i)
        .get('InterestBorrowedCapital').value;

      const PreEMIInterestValue = modalFormArray
        .at(i)
        .get('PreEMIInterestValue').value;
      const MunicipalTaxes = modalFormArray.at(i).get('MunicipalTaxes').value;
      const temp =
        this.checkisNaN(RentReceivedAnnually) - this.checkisNaN(MunicipalTaxes);
      // + this.checkisNaN(PreEMIInterestValue)
      const NetAnnualValue = temp <= 0 ? 0 : temp;
      const StatutoryDeduction = NetAnnualValue * 0.3;

      const AnnuanlLattable = NetAnnualValue - StatutoryDeduction;

      const NetIncomeHouseProperty =
        this.checkisNaN(InterestBorrowedCapital) +
        this.checkisNaN(PreEMIInterestValue) -
        AnnuanlLattable;

      modalFormArray.at(i).patchValue({
        NetAnnualValue: (Type == 'self_property' || NetAnnualValue) < 0 ? 0 : NetAnnualValue
      });

      modalFormArray.at(i).patchValue({
        StatutoryDeduction: Type == 'self_property' ? 0 : StatutoryDeduction
      });

      modalFormArray.at(i).patchValue({
        AnnualLettableValueRentAmount: Type == 'self_property' ? 0 : AnnuanlLattable
      });

      modalFormArray.at(i).patchValue({
        NetIncomeHouseProperty: Type === 'self_property' ? 0 : NetIncomeHouseProperty
      });


      // modalFormArray
      //   .at(i)
      //   .get("NetAnnualValue")
      //   .disable();
      // modalFormArray
      //   .at(i)
      //   .get("StatutoryDeduction")
      //   .disable();
    }

    if (obj.type === 'checkbox') {
      const val = event.target.checked;
      const patchVal = {};
      patchVal[obj.name] = val;

      (this.ngForm.get('items') as FormArray).at(i).patchValue(patchVal);
    }
  }

  patchAgeOnSelection(i, value, objName) {
    const modalFormArray = this.ngForm.get('items') as FormArray;

    modalFormArray.at(i).patchValue({
      Age: value
    });
    // if (objName === 'brother' || objName === 'sister'){
    //   modalFormArray.at(i).get("Age")
    //     ? modalFormArray
    //       .at(i)
    //       .get("Age")
    //       .enable()
    //     : "";
    // }

    if (value !== '') {
      modalFormArray.at(i).get('Age') ?
        modalFormArray
          .at(i)
          .get('Age')
          .disable() :
        '';
    } else {
      modalFormArray.at(i).get('Age') ?
        modalFormArray
          .at(i)
          .get('Age')
          .enable() :
        '';
    }
  }

  disbaleFields(j) {
    const modalFormArray = this.ngForm.get('items') as FormArray;

    modalFormArray.at(j).get('AccountHolderName') ?
      modalFormArray
        .at(j)
        .get('AccountHolderName')
        .disable() :
      '';
    modalFormArray.at(j).get('NameOfAssured') ?
      modalFormArray
        .at(j)
        .get('NameOfAssured')
        .disable() :
      '';

    modalFormArray.at(j).get('DependentName') ?
      modalFormArray
        .at(j)
        .get('DependentName')
        .disable() :
      '';

    modalFormArray.at(j).get('PatientName') ?
      modalFormArray
        .at(j)
        .get('PatientName')
        .disable() :
      '';

    modalFormArray.at(j).get('Name') ?
      modalFormArray
        .at(j)
        .get('Name')
        .disable() :
      '';
  }

  patchValueOnSelection(j, value, type?) {
    const modalFormArray = this.ngForm.get('items') as FormArray;

    modalFormArray.at(j).patchValue({
      AccountHolderName: value
    });
    modalFormArray.at(j).patchValue({
      NameOfAssured: value
    });
    modalFormArray.at(j).patchValue({
      DependentName: value
    });
    modalFormArray.at(j).patchValue({
      PatientName: value
    });
    modalFormArray.at(j).patchValue({
      Name: value
    });

    if (value !== '' && type !== 'Child') {
      modalFormArray.at(j).get('AccountHolderName') ?
        modalFormArray
          .at(j)
          .get('AccountHolderName')
          .disable() :
        '';
      modalFormArray.at(j).get('NameOfAssured') ?
        modalFormArray
          .at(j)
          .get('NameOfAssured')
          .disable() :
        '';

      modalFormArray.at(j).get('DependentName') ?
        modalFormArray
          .at(j)
          .get('DependentName')
          .disable() :
        '';

      modalFormArray.at(j).get('PatientName') ?
        modalFormArray
          .at(j)
          .get('PatientName')
          .disable() :
        '';

      modalFormArray.at(j).get('Name') ?
        modalFormArray
          .at(j)
          .get('Name')
          .disable() :
        '';
    } else {
      modalFormArray.at(j).get('AccountHolderName') ?
        modalFormArray
          .at(j)
          .get('AccountHolderName')
          .enable() :
        '';
      modalFormArray.at(j).get('NameOfAssured') ?
        modalFormArray
          .at(j)
          .get('NameOfAssured')
          .enable() :
        '';

      modalFormArray.at(j).get('DependentName') ?
        modalFormArray
          .at(j)
          .get('DependentName')
          .enable() :
        '';

      modalFormArray.at(j).get('PatientName') ?
        modalFormArray
          .at(j)
          .get('PatientName')
          .enable() :
        '';

      modalFormArray.at(j).get('Name') ?
        modalFormArray
          .at(j)
          .get('Name')
          .enable() :
        '';
    }
  }

  checkFields(event, i, obj) {

    const flag = event;
    const modalFormArray = this.ngForm.get('items') as FormArray;
    // modalFormArray.at(i);
    const temp = modalFormArray.at(i).get('Relationship') ?
      modalFormArray.at(i).get('Relationship').value :
      '';

    if (obj.name === 'LendersName') {

      const LendersName = modalFormArray.at(i).get('LendersName').value;
      const newLendersPAN = this.bankwisePanDetails.filter(
        obj => obj.label == LendersName
      )[0].PAN;
      modalFormArray.at(i).patchValue({
        LendersPAN: newLendersPAN
      });
      // debugger;
    }

    if (obj.name === 'Type') {

      this.isSelfSelected = modalFormArray.value.map(obj => {
        return obj.Type === 'self_property' ? true : false;
      }).filter(obj => obj == true).length > 1 ? true : false;


    }

    if (flag === 'FinancialInstitution') {
      this.fieldDetailsArray.forEach(obj => {
        if (obj.name == 'LendersName') {
          obj.type = 'select';
          obj.options = this.bankwisePanDetails;
        }
      });
    } else if (flag == 'Employer' || flag == 'Others') {
      this.fieldDetailsArray.forEach(obj => {
        if (obj.name == 'LendersName') {
          obj.type = 'text';
        }
      });
    } else if (temp === 'child') {
      if (
        this.service.userDetails.dependentAllChild &&
        this.service.userDetails.dependentAllChild.length !== 0
      ) {
        this.fieldDetailsArray.forEach(obj => {
          if (
            obj.name == 'NameOfAssured' ||
            obj.name == 'DependentName' ||
            obj.name == 'PatientName' ||
            obj.name == 'AccountHolderName'
          ) {
            obj.type = 'select';
            obj.options = this.service.userDetails.dependentAllChild;
          }
        });
      }
    } else {
      this.fieldDetailsArray.forEach(obj => {
        if (
          obj.name == 'NameOfAssured' ||
          obj.name == 'DependentName' ||
          obj.name == 'PatientName' ||
          obj.name == 'AccountHolderName'
        ) {
          obj.type = 'text';
        }
      });
    }

    if (flag === 'mother') {
      this.patchValueOnSelection(
        i,
        this.service.userDetails.dependentMotherName
      );
      this.patchAgeOnSelection(
        i,
        this.service.userDetails.dependentMotherAge,
        flag
      );
    }

    if (flag === 'brother' || flag === 'sister') {
      this.patchValueOnSelection(i, '');
      this.patchAgeOnSelection(i, '', flag);
    }

    if (flag === 'father') {
      this.patchValueOnSelection(
        i,
        this.service.userDetails.dependentFatherName
      );
      this.patchAgeOnSelection(
        i,
        this.service.userDetails.dependentFatherAge,
        flag
      );
    }

    if (flag === 'spouse') {
      this.patchValueOnSelection(
        i,
        this.service.userDetails.dependentSpouseName
      );
      this.patchAgeOnSelection(
        i,
        this.service.userDetails.dependentSpouseAge,
        flag
      );
    }

    if (flag === 'child') {
      this.patchValueOnSelection(
        i,
        this.service.userDetails.dependentChildName,
        'Child'
      );
      this.patchAgeOnSelection(
        i,
        this.service.userDetails.dependentChildAge,
        flag
      );
    }

    if (flag === 'self') {
      this.patchValueOnSelection(i, this.empName);
      this.patchAgeOnSelection(i, this.employeeAge, flag);
    }

    // if (flag === "selfRelationDependant") {
    //   modalFormArray.at(j).patchValue({
    //     DependentName: `${this.localUserData.FirstName} ${
    //       this.localUserData.LastName
    //     }`
    //   });
    // }

    if (modalFormArray.at(i).get('Type')) {
      this.schemeSeletedValue[i] =
        modalFormArray.at(i).get('Type').value === '' ?
          event :
          modalFormArray.at(i).get('Type').value;

    }

    if (flag === 'self_property' || flag === 'letout_property') {
      if (flag === 'self_property') {
        const modalFormArray = this.ngForm.get('items') as FormArray;
        modalFormArray.at(i).patchValue({
          NetAnnualValue: 0
        });

        modalFormArray.at(i).patchValue({
          StatutoryDeduction: 0
        });

        modalFormArray.at(i).patchValue({
          AnnualLettableValueRentAmount: 0
        });

        modalFormArray.at(i).patchValue({
          NetIncomeHouseProperty: 0
        });
        // modalFormArray.at(i).patchValue({
        //   RentReceivedAnnually: 0
        // });
        // modalFormArray.at(i).patchValue({
        //   MunicipalTaxes: 0
        // });
      }
      this.typeForIncomeHouse[i] =
        this.typeForIncomeHouse[i] === undefined ?
          [] :
          this.typeForIncomeHouse[i];
      this.typeForIncomeHouse[i] = flag;
    }

    if (flag === 'letout_property') {
      //  const modalFormArray = this.ngForm.get("items") as FormArray;
      modalFormArray.at(i)
        .get('MunicipalTaxes')
        .setValidators([Validators.required]);

      modalFormArray.at(i)
        .get('RentReceivedAnnually')
        .setValidators([Validators.required]);
      modalFormArray
        .at(i)
        .get('MunicipalTaxes')
        .updateValueAndValidity();
      modalFormArray
        .at(i)
        .get('RentReceivedAnnually')
        .updateValueAndValidity();
    } else if (flag === 'self_property') {
      modalFormArray.at(i)
        .get('MunicipalTaxes')
        .setValidators([]);
      modalFormArray.at(i)
        .get('RentReceivedAnnually')
        .setValidators([]);
      modalFormArray
        .at(i)
        .get('MunicipalTaxes')
        .updateValueAndValidity();
      modalFormArray
        .at(i)
        .get('RentReceivedAnnually')
        .updateValueAndValidity();
    }


    if (obj.name === 'City') {
      const isMetro = !(modalFormArray.at(i).get('City').value === 'Other');
      modalFormArray.at(i).patchValue({
        IsMetroCity: isMetro
      });
    }

    // this.typeForIncomeHouse[j] = ;
  }

  addProof(flag) {
    this.items = this.ngForm.get('items') as FormArray;
    this.items.push(this.createNgForm());

    this.patchProfileName(this.items.length - 1);
    for (let k = 0; k < this.ngForm.value.items.length - 1; k++) {
      this.hideModal(k);
    }
  }

  createNgForm(): FormGroup {
    if (this.service.formControlFields) {
      this.formControlFields = this.service.formControlFields;
    }
    return this.formBuilder.group(this.formControlFields);
  }

  adminApproveReject() {
    const url = Constant.AdminApproveRejectDeclarations;
    let actionType = 'Approved';
    if (this.actionType == 'approve') {
      actionType = 'Approved';
    } else if (this.actionType == 'reject') {
      actionType = 'Rejected';
    }

    const params = {
      AdminTokenId: this.localUserData.TokenId,
      // "AdminTokenId": this._storage.get('username').TokenId,
      declarations: [{
        DeclarationId: this.DeclarationId,
        Status: actionType,
        AdminRemarks: this.adminRemark ? this.adminRemark : null
      }]
    };

    this.spinnerService.show();
    this.service.postService(url, params).then(data => {

      if (data === 'Success') {
        location.reload();
      } else { }
      this.spinnerService.hide();
    });
  }

  confirmationBox(action) {
    this.actionType = action;
    if (this.actionType === 'reject' && !this.adminRemark) {
      this.errMsg = true;
      return false;
    }
    this.errMsg = false;
    // $('#ProofModal').modal('hide');
    $('#adminconformationModal').modal('show');
  }

  employeeConfirmationBox() {

    for (let k = 0; k < this.ngForm.value.items.length; k++) {
      this.hideModal(k);
    }

    $('#ProofModal .modal-body').animate({
      scrollTop: document.body.scrollHeight
    },'slow');

    const docsLength = this.displayFiles.length;
    const proofsLength = this.ngForm.value.items.length;

    // const tds = this.ngForm.value['items'][0]['TDSOnOtherIncome'];
    // const saving = this.ngForm.value['items'][0]['SAVBankInterest'];

    // if (this.modalSchemeId === 7 && (tds === "" && saving === "" )) {
    //  this.isEachFileUploaded = true;
    // } else {
      console.log('proof', this.ngForm.value.items, 'docs', this.displayFiles.length);
      if(docsLength !== proofsLength ){ this.isEachFileUploaded = false; return;}
   // }

    this.confirmHiddenBlock = false;
  }
  closeblock() {
    this.confirmHiddenBlock = true;
  }

  hraCalculation(event) { }

  checkisNaN(value) {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
  }
  dismissMessage(i?: number) {
    this.isEachFileUploaded = true;
  }

  async onProofSubmit() {
    let DeclarationDetails: any;
    let InterestPaid: any;
    this.processing = true;
    await this.uploadFiles();

    if (this.entryType == 'single') {
      const singleEntryngForm = this.ngForm.getRawValue().items;
      const temp = Object.getOwnPropertyNames(singleEntryngForm[0]);

      temp.forEach(obj => {
        const tempObj = singleEntryngForm[0][obj];
        if (typeof tempObj === 'object') {
          if (tempObj) {
            singleEntryngForm[0][
              obj
            ] = `${tempObj.month}-${tempObj.day}-${tempObj.year}`;
          }
        }
      });

      // this.ngForm.value.items[0].Id =
      //   this.previousDeclarationDetails.length == 0
      //     ? null
      //     : this.previousDeclarationDetails[0].Id;
      // this.ngForm.value.items[0].Id =
      //   this.ngForm.value.items[0].Id === undefined
      //     ? null
      //     : this.ngForm.value.items[0].Id;

      DeclarationDetails = singleEntryngForm;
      if (this.modalSchemeId === 40) {
        const tempAmt = this.checkisNaN(
          this.ngForm.value.items[0].InterestPaid
        );
        InterestPaid = tempAmt > 150000 ? 150000 : tempAmt;
      }
    }

    if (this.entryType == 'multiple') {
      const temporaryArray = this.ngForm.getRawValue().items;
      if (this.previousDeclarationDetails.length !== 0) {
        this.setIdInDeclarationDetails(
          temporaryArray,
          this.previousDeclarationDetails[0]
        );
      }

      temporaryArray.forEach((item, i) => {
        const temp = Object.getOwnPropertyNames(item);

        temp.forEach(obj => {
          const tempObj = item[obj];
          if (typeof tempObj === 'object') {
            if (tempObj) {
              item[obj] = `${tempObj.month}-${tempObj.day}-${tempObj.year}`;
            }
          }
        });

        if (this.modalSchemeId === 2) {
          item.IsMetroCity = item.IsMetroCity == 'true' || item.IsMetroCity == true;
        }
      });

      DeclarationDetails = temporaryArray;
    }

    let tempArray = [];
    const url = Constant.SubmitITDeclarationDetails;
    tempArray = DeclarationDetails;
    let requestTokenid = this.localUserData.TokenId;
    if (this.service.clickFrom === 'admin') {
      requestTokenid = this.empToken;
    } else {
      requestTokenid = this.localUserData.TokenId;
    }

    tempArray.forEach((item, i) => {
      item.Proofs = this.displayFiles[i];
    })
    const param = {
      TokenId: this.localUserData.TokenId,
      RequestTokenId: requestTokenid,
      SchemeID: this.modalSchemeId,
      DeclarationDetails: tempArray
    };

    let incomeFromHouseProperty = 0;
    if (this.modalSchemeId === 6) {
      this.ngForm.value.items.forEach((item, i) => {
        if (this.schemeSeletedValue[i] == 'letout_property') {
          incomeFromHouseProperty += this.checkisNaN(
            item.NetIncomeHouseProperty
          );
        }

        if (this.schemeSeletedValue[i] == 'self_property') {
          incomeFromHouseProperty += this.checkisNaN(
            item.InterestBorrowedCapital
          );
        }
      });
    }

    let SalaryUS17Amount = 0;
    if (this.modalSchemeId === 1) {
      SalaryUS17Amount = this.ngForm.value.items.reduce(
        (n, x) =>
          n +
          (this.checkisNaN(x.LTACarriedForward) +
            this.checkisNaN(x.SalaryUS17) +
            this.checkisNaN(x.PerquisiteUS17)) -
          (this.checkisNaN(x.ExemptionsUS10) +
            this.checkisNaN(x.ProfessionalTax) +
            this.checkisNaN(x.PF) +
            this.checkisNaN(x.LTAExemptions) +
            // this.checkisNaN(x.IncomeTaxDeducted) +
            this.checkisNaN(x.MedicalExemption) +
            this.checkisNaN(x.LeaveEncashmentExmp) +
            this.checkisNaN(x.GratuityExemption) +
            this.checkisNaN(x.VRSExemption)),

        0
      );
      SalaryUS17Amount = SalaryUS17Amount < 0 ? 0 : SalaryUS17Amount;
    }


    this.service.postService(url, param).then((data: any) => {
      let DeclarationDetailsIds = [];
      DeclarationDetailsIds = data.map(item => item.Id);

      this.setIdInDeclarationDetails(tempArray, data);

      tempArray = this.ngForm.getRawValue().items;

      this.setIdInDeclarationDetails(tempArray, data);

      tempArray.forEach((item, i) => {
        item.Proofs = this.displayFiles[i];
      })
      this.processing = false;
      $('#ProofModal').modal('hide');
      switch (this.modalSchemeId) {
        case 2:
          this.service.successData.next({
            // Amount: this.ngForm.value.items.reduce((n, x) => n + parseInt(x.RentPerMonth), 0),
            modalSchemeId: this.modalSchemeId,
            Amount: this.ngForm.value.items.reduce(
              (n, x) => n + this.checkisNaN(x.RentPerMonth),
              0
            ), //this.totalHraAmount,
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray[0].length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          //this.service.successData.next({ modalSchemeId: this.modalSchemeId, Amount: parseInt(this.ngForm.value.items[0].RentPerMonth), DeclarationDetailsIds: DeclarationDetailsIds });
          break;
        case 25:
          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: this.amountConsider.reduce((n, x) => n + x, 0),
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
        case 27:
          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: this.ngForm.value.items.reduce(
              (n, x) => n + parseInt(x.Premium),
              0
            ),
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
        case 28:
        case 29:
        case 30:
        case 35:
        case 36:
        case 32:
        case 37:
        case 38:
        case 39:
        case 16:
        case 17:
        case 22:
        case 18:
        case 21:
        case 20:
          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: this.ngForm.value.items.reduce(
              (n, x) => n + parseInt(x.Amount),
              0
            ),
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
        case 31:
          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: this.checkisNaN(this.ngForm.value.items[0].Total),
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
        case 19:
          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: this.ngForm.value.items.reduce(
              (n, x) => n + this.checkisNaN(x.NPSAmount),
              0
            ),
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
        case 40:
          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: InterestPaid,
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: this.ngForm.value.items.reduce(
              (n, x) => n + this.checkisNaN(x.Premium),
              0
            ),
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
        case 1:
          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: SalaryUS17Amount,
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
        case 7:
          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: this.ngForm.value.items.reduce(
              (n, x) =>
                n +
                (this.checkisNaN(x.BusinessProfit) +
                  this.checkisNaN(x.LTNormal) +
                  this.checkisNaN(x.LTSpecial) +
                  this.checkisNaN(x.STGain) +
                  this.checkisNaN(x.OtherIncome) +
                  this.checkisNaN(x.DividentIncome) +
                  // this.checkisNaN(x.TDSOnOtherIncome) +
                  this.checkisNaN(x.TotalInterestInc) +
                  this.checkisNaN(x.NCSInterest) +
                  this.checkisNaN(x.SAVBankInterest) +
                  this.checkisNaN(x.OtherInterest)),
              0
            ),
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
        case 6:
          let finalAmount = incomeFromHouseProperty;
          // if (incomeFromHouseProperty > 0 incomeFromHouseProperty > 200000){

          //       const finalAmount = 200000;
          //   }

          if (incomeFromHouseProperty > 0 && incomeFromHouseProperty > 200000) {
            finalAmount = 200000;
          }

          this.service.successData.next({
            modalSchemeId: this.modalSchemeId,
            Amount: finalAmount, // incomeFromHouseProperty,
            DeclarationDetailsIds: DeclarationDetailsIds,
            ProofLength: tempArray.length,
            DeclarationDetails: tempArray,
            ClickFrom: this.clickFrom,
            entryType: this.entryType
          });
          break;
      }

      this.spinnerService.hide();
    });
  }

  setIdInDeclarationDetails(tempArray, data) {


    for (let i = 0; i < tempArray.length; i++) {
      const ID = data[i] ? data[i].Id : null;
      tempArray[i].Id = ID;

    }

  }

  checkConditions() {
    // if (this.ngForm.valid && this.uploadedFileData !== undefined) {
    // if (this.modalSchemeId === 40) {
    //  return false;
    // }
    // if (this.ngForm.valid && this.getAllFileStatus())
    if(this.processing) { return true;}
    if (this.ngForm.valid && this.checkValidDateFunc()) {
      return false;
    } else {
      return true;
    }
  }


  checkValidDateFunc() {
    switch (this.modalSchemeId) {
      case 2:
        return this.inValidDate.includes(true) ||
          this.ToDateArray.includes(true) ||
          this.FromDateArray.includes(true) ?
          false :
          true;
        break;
      case 25:
        return this.inValidPaymentDate.includes(true) ? false : true;
        break;
      case 40:
        return this.inValidDate.includes(true) ? false : true;
        break;
      case 6:
        return !this.isSelfSelected;
        break;
      default:
        return true;
    }
    // if (this.modalSchemeId === 2 || this.modalSchemeId == 40) {
    //   return this.inValidDate.includes(true) ? false : true;
    //   // } else if(this.ageArray.includes(true)){
    //   //   return false;
    // } else {
    //   return true;
    // }
  }

  getFileName(path) {
    if (path !== undefined && path !== null && path !== '') {
      return path.split('/').pop();
    }
  }

  fileExt(filePath) {
    const ext = this.getFileName(filePath)
      .split('.')
      .pop()
      .toLowerCase();
    if (ext == 'png' || ext == 'jpg' || ext == 'jpeg') {
      return 'image';
    } else if (ext == 'pdf') {
      return 'pdf';
    } else {
      return 'invalid';
    }
  }

  getDate(datetime, obj, i) {
    // alert(':LOggg'+datetime[i]);
    //previousDeclarationDetails[i][obj.name]

    // datetime[i][obj.name]
    if (datetime == null) {
      return null;
    } else {
      datetime.substring(0, 11);
    }

    // if (!datetime[i] && datetime[i] !== '')
    //   return null;
    // else
    //   return datetime[i][obj.name].substring(0, 11);
  }

  checkValidDate(name, event, i) {
    if (name === 'FromDate' || name === 'ToDate') {
      if (
        new Date(this.ngForm.value.items[i].ToDate).getTime() >=
        new Date(this.ngForm.value.items[i].FromDate).getTime()
      ) {
        this.isValidDate = true;
      } else {
        this.isValidDate = false;
      }
    }
  }

  OpenFile(file){
    let contentType = [
      { ext: 'pdf', contentType: 'application/pdf'},
      { ext: 'jpg', contentType: 'image/jpg'},
      { ext: 'jpeg', contentType: 'image/jpeg'},
      { ext: 'png', contentType: 'image/png'},
      { ext: 'doc', contentType: 'application/msword'},
      { ext: 'docx', contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingm'},
    ]
    let ext = file.name.split('.')[1];
    if(file.Base64File){
      const foundType =  contentType.find(c => c.ext === ext);
      const actualType = (foundType)? foundType.contentType : null;
      const path = `data:${actualType};base64,${file.Base64File}`;
      var iframe = "<iframe width='100%' height='100%' src='" + path + "'></iframe>"
      var x = window.open();
      x.document.open();
      x.document.write(iframe);
      return;
    }
     window.open(file.Path);
  }

  onValueChange(obj, event, i) {

    const modalFormArray = this.ngForm.get('items') as FormArray;
    if (this.modalSchemeId === 31) {
      const RepaymentOfPrincipalAmount = modalFormArray
        .at(i)
        .get('RepaymentOfPrincipalAmount').value;
      const StampDuty = modalFormArray.at(i).get('StampDuty').value;
      const NetValue =
        this.checkisNaN(RepaymentOfPrincipalAmount) +
        this.checkisNaN(StampDuty);

      //    let NetValue = isNaN(temp) || temp < 0 ? 0 : temp;

      modalFormArray.at(i).patchValue({
        Total: NetValue
      });
    }
  }

  onKeyupEvent(i, name?) {
    //   let modalFormArray = this.ngForm.get("items") as FormArray;
    //   let Age = this.checkisNaN(modalFormArray.at(i).get("Age").value);

    //  if(Age===0){
    //    this.ageArray[i] = true
    //   }else{
    //    this.ageArray[i] = false;
    //   }
    const modalFormArray = this.ngForm.get('items') as FormArray;
    if (this.modalSchemeId === 25) {

      const Premium = this.checkisNaN(
        modalFormArray.at(i).get('Premium').value
      );
      const PolicyAmount = this.checkisNaN(
        modalFormArray.at(i).get('PolicyAmount').value
      );

      if (Premium == 0 || PolicyAmount == 0) {
        return false;
      }

      if (this.paymentDateBetween[i] == 'before') {
        const tempPolicy = PolicyAmount * 0.2;
        this.amountConsider[i] = tempPolicy >= Premium ? Premium : tempPolicy;
      } else if (this.paymentDateBetween[i] == 'between') {
        const tempPolicy = PolicyAmount * 0.1;
        this.amountConsider[i] = tempPolicy >= Premium ? Premium : tempPolicy;
      } else if (this.paymentDateBetween[i] == 'after') {
        let newPolicy: any = 0;
        // if (this.employeeAge >= 60) {
        //   newPolicy = PolicyAmount * 0.15;
        // } else if (this.employeeAge < 60) {
        newPolicy = PolicyAmount * 0.1;
        //  }

        this.amountConsider[i] = newPolicy >= Premium ? Premium : newPolicy;
      }

    }

    // if (this.modalSchemeId === 2 && modalFormArray.at(i).get(name)) {

    //   const tempPin = modalFormArray.at(i).get(name).value;
    //   if (name === 'Pincode' && tempPin.length === 6) {
    //     const foundObj = this.pincodeWiseArray.filter(obj => obj.Pincode === tempPin)[0];
    //     modalFormArray.at(i).patchValue({ 'IsMetroCity': foundObj.Ismetro });
    //     modalFormArray.at(i).patchValue({ 'City': foundObj.City });
    //   }
    // }
  }

  checkIsRequired(i, name) {
    const modalFormArray = this.ngForm.get('items') as FormArray;
    const control = modalFormArray.at(i).get(name);
    const {
      validator
    } = control;
    if (validator) {
      const validation = validator(new FormControl());
      return validation !== null && validation.required === true;
    }
    return false;
  }

  onFocusOutCheckHRA() {
    const formData = this.ngForm.get('items') as FormArray;

    if (this.modalSchemeId === 2) {
      let totalRent = 0;
      let diffMonths = 0;

      const proofCount = formData.length;
      //formData

      // tslint:disable-next-line: forin
      for (const obj of formData.value) {
        if (obj.FromDate && obj.ToDate && obj.RentPerMonth) {
          const calcToDate = moment([obj.ToDate.year, obj.ToDate.month - 1, obj.ToDate.day]);
          const calcFromDate = moment([obj.FromDate.year, obj.FromDate.month - 1, obj.FromDate.day]);

          diffMonths = Math.ceil(calcToDate.diff(calcFromDate, 'months', true));
          totalRent += diffMonths * parseInt(obj.RentPerMonth);
        }
      }



      if (totalRent >= 100000) {
        setRemoveValidators([
          Validators.required,
          Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
        ], true);

      } else {
        setRemoveValidators([], false);
      }

    }

    function setRemoveValidators(validators, flag) {
      formData.value.forEach((obj, i) => {
        formData.at(i)
          .get('LandLordPanNo')
          .setValidators(validators);
        formData
          .at(i)
          .get('LandLordPanNo')
          .updateValueAndValidity();
      });
    }
  }

  numberOnly(event, obj, j, i, tempObj): boolean {

    if (obj.isNumber) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      if (this.modalSchemeId == 16 && parseInt(event.target.value) > 75000) {
        return false;
      }

      if (this.modalSchemeId == 17 && parseInt(event.target.value) > 125000) {
        return false;
      }

      return true;
    } else if (obj.onlyChar) {
      let value = String.fromCharCode(event.which);
      let pattern = new RegExp(/[a-zåäö ]/i);
      return pattern.test(value);
    }
  }

  inputBlur(obj) {

    if (obj.name === 'RentPerMonth' || obj.name === 'LandLoardPanNo') {
      this.calculateTotalHRA();
    }
  }

  hraMonthChange(proofNo, event, dateSource) {
    if (dateSource === 'FromDate') {
      const fromMonthVal = $('#FromDate' + proofNo)
        .children('option:selected')
        .val();
      $('#ToDate' + proofNo)
        .val(fromMonthVal)
        .change();
    }
    this.calculateTotalHRA();
  }

  hraMonthOptionsCheck(proofNo, objname, monthInx) {
    let res1 = false;
    let res2 = false;

    let fromMonthVal: any;
    let fromMonthInx: any;
    let fromProofNo: any;
    fromMonthVal = $('#FromDate' + proofNo)
      .children('option:selected')
      .val();
    fromMonthInx = $('#FromDate' + proofNo).prop('selectedIndex');

    if (objname === 'ToDate') {
      if (monthInx < fromMonthInx - 1) {
        res1 = true;
      }
    }

    if (proofNo > 0) {
      for (let i = proofNo; i >= 0; i--) {
        const prevProofFromMonthInx = $('#FromDate' + (i - 1)).prop(
          'selectedIndex'
        );
        const prevProofToMonthInx = $('#ToDate' + (i - 1)).prop(
          'selectedIndex'
        );
        if (
          prevProofFromMonthInx - 2 < monthInx &&
          monthInx < prevProofToMonthInx
        ) {
          res2 = true;
          break;
        }
      }
    }
    return res1 || res2 ? true : false;
  }

  calculateTotalHRA() {
    this.totalHraAmount = 0;
    const formData = this.ngForm.get('items') as FormArray;
    const proofCount = formData.length;

    const monthlyHRA = [];
    for (let i = 0; i < proofCount; i++) {
      const fromDateInx = $('#FromDate' + i).prop('selectedIndex');
      const toDateInx = $('#ToDate' + i).prop('selectedIndex');
      const monthCount = toDateInx - fromDateInx + 1;
      const monthlyAmount = parseInt(formData.at(i).get('RentPerMonth').value);
      const proofAmount = monthCount * monthlyAmount;
      if (proofAmount >= 100000) {

        formData
          .at(i)
          .get('LandLordPanNo')
          .setValidators([
            Validators.required,
            Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
          ]);

        this.fieldDetailsArray[i].isRequired = true;
      } else {

        formData
          .at(i)
          .get('LandLordPanNo')
          .setValidators([Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)]);
        this.fieldDetailsArray[i].isRequired = false;
      }
      formData
        .at(i)
        .get('LandLordPanNo')
        .updateValueAndValidity();
      this.totalHraAmount += proofAmount;
      monthlyHRA.push({
        fromDateInx,
        toDateInx,
        monthCount,
        monthlyAmount,
        proofAmount
      });
    }

  }

}
