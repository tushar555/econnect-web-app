import { LocalStorageService } from 'ngx-store';
import { Constant } from './../../services/constant';
import { CommonService } from './../../services/common.service';
import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { } from 'googlemaps';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';



declare var jquery: any;
declare var $: any;
// declare var google: any;

const MomentRange = require('moment-range');
const Moment = require('moment');
const mv = MomentRange.extendMoment(Moment);



@Component({
  selector: 'app-admin-attendance-approval',
  templateUrl: './admin-attendance-approval.component.html',
  styleUrls: ['./admin-attendance-approval.component.scss']
})
export class AdminAttendanceApprovalComponent implements OnInit {
  dateList: any;
  weeklyDataList: any;

  localUserData: any;
  usertype: string = '';
  ddMonth: number;
  conclusionData: any;
  cureentSelectedYear: number;
  selectedYear: number;
  flag: any;
  innerobj: any;
  obj: any;
  status: string;
  oldIndex: any = 0;
  IsManager: any;
  // Declarations: {}[];
  regularizeView: boolean;
  isHOEmp: any;
  abc: any;
  sortedArray: any = [];
  selectedGrid: any;
  totalDaysInMonth: any = [];
  public startDate: any;
  public headerDate: any;
  public listheaderDate: any;
  public currentServerDate;

  public month;
  public year;
  successMessage: any;
  public startWeek;
  public endWeek;

  public monthDate;
  public calendarDate;
  public calendarWeek;
  public weekArray;
  public monthWiseHolidays: Array<any> = [];
  public selectedMonth: any;
  holidayCount: number = 0;
  public TitleMsg = 'Attendance';
  pendingAttendance: any = [];

  map: google.maps.Map;
  latitude: any = '';
  longitude: any = '';
  signinTime: Date = new Date();
  signInType: string;
  serverCurrentdate: any;
  attendanceType: string;
  monthDetail: any;
  public attendanceDateArray;
  public type;
  attendanceInfo: any = null;
  tempMonth: any;
  response: any;
  currentMonth: any;
  currentDate: any;
  noRecord: boolean = false;
  detailsIcon: string = 'assets/img/select-date.png';
  defaultMsg: string = 'To check date description, select specific date.';
  calendarView: boolean = true;
  listView: boolean = false;
  leaveView: boolean = false;
  isPermissionSet: boolean = false;
  showCaleInfo: boolean = false;
  toggleButton: boolean = false;

  reasonText: any;
  leaveRequest: FormGroup;
  saveDaysMonth: any;
  saveDaysMonthList: any;
  leaveListClassActive: boolean = true;
  leaveReqClassActive: boolean = false;
  leaveCardClassActive: boolean = false;
  maxYear: any;
  minYear: any;
  weeklyData: any;
  weeklyTotal = {
    hours: '',
    minutes: ''
  }
  monthsArray: any = [];
  date = new Date();
  //leaveCardArr:any[]=[];
  leaveCard: any;
  monthNumber: any;
  weekGrid: any = [];
  public openFooter: boolean = false;
  public openStatus: boolean = false;
  noMapAvailable: boolean;
  attendanceActionView: any = false;
  empAttendance: any = [];
  yearsArray: any = [];
  searchText: any;
  showCross: boolean;
  params: any;
  responseArrAll: any;
  constructor(private _services: CommonService, public cd: ChangeDetectorRef, public router: ActivatedRoute,
    private ngZone: NgZone, private _storage: LocalStorageService, public elementRef: ElementRef,
    public spinnerService: Ng4LoadingSpinnerService, public formBuilder: FormBuilder,
    public route: Router) {


    this._services.titleMessageSource.next('Attendance Approval');

    this.router.queryParamMap.subscribe((params: any) => {
      this.params = params.params;
    })

    this._services.getUserDetail().then((data) => {
      this.localUserData = data;
      this.isHOEmp = this.localUserData.isHOEmp;
      this.IsManager = this.localUserData.IsManager;
      if (this.isHOEmp == true) {
        this.usertype = 'HO';
      } else {
        this.usertype = 'RO';
      }

      for (let i = 0; i <= 2; i++) {
        this.yearsArray.push(this.date.getFullYear() - i);
      }
      this.initializeData();
      setTimeout(() => {
        this.initializeMonths();
        this.getMonths(this.date.getFullYear());
      }, 500)


      setTimeout(() => {
        this.attendanceApproveReject(undefined);

      }, 1000)



    });

    this.listheaderDate = moment();

  }

  addClass(event) {

  }

  searchFn(ev: any) {
    this.empAttendance = [];
    this.showCross = true;
    // console.dir(ev.target.value);
    let searchItem = this.searchText;
    for (var i = 0; i < this.responseArrAll.length; i++) {
      console.dir(
        this.responseArrAll[i].EmployeeName.indexOf(searchItem) >= 0
      );

      if (this.responseArrAll[i].TokenID.indexOf(searchItem) >= 0 ||
        this.responseArrAll[i].EmployeeName.toLowerCase().indexOf(
          searchItem.toLowerCase()
        ) >= 0
      ) {
        this.empAttendance.push(this.responseArrAll[i]);
      }
      if (this.responseArrAll.length >= 1) {
        //   this.showCross = true;
      } else {
        //   this.showCross = false;
      }
    }

  }

  reset() {
    this.showCross = false;
    this.empAttendance = this.responseArrAll;
    this.searchText = '';
    console.log("reset");
    // this.curPageNo = 1;
    // this.getList('', this.curPageNo, 'start');
  }


  getMonths(event) {
    this.year = event;

    if (event == this.selectedYear) {

      let month = [];
      for (let i = 0; i <= this.currentMonth; i++) {
        month.push(this.monthsArray[i]);
      }
      this.monthsArray = month;
    } else {

      this.initializeMonths();
    }
    this.attendanceApproveReject(undefined)
  }

  getRepoteeName(event) {
    this.showCross = true;
    console.log(event);

  }

  resetReporteeName() {
    this.showCross = false;
    this.searchText = '';
  }

  initializeMonths() {
    this.monthsArray = ['', 'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December'];
    // this.month = this.monthsArray[this.date.getMonth() - 1];
  }

  initializeData() {

    this.spinnerService.show();

    this._services.getService(Constant.getServerDateTime).then((data) => {
      this.spinnerService.hide();
      console.log('this', data);

      this.startDate = data;
      this.headerDate = data;
      this.listheaderDate = data;
      this.currentServerDate = data;
      const date = moment(this.currentServerDate).date();
      this.currentMonth = moment(data).month() + 1;

      if (Object.keys(this.params).length == 0) {
        //if (data != null) {
        this.month = moment(data).month() + 1;
        this.year = moment(data).year();
        // }

      } else if (Object.keys(this.params).length !== 0) {
        this.month = this.params.month;
        this.year = this.params.year;
      }

      this.selectedYear = this.year;
      this.ddMonth = this.month;
    });

    //this.startDate = this._services.serverDate;

    // this.get_calendar(this.year, this.month, this.startDate);

  }

  ngOnInit() { }

  attendanceApproveReject(event) {
    this.spinnerService.show();
    setTimeout(() => {
      if (event == undefined) {
        this.selectedMonth = this.ddMonth;
      } else {
        this.selectedMonth = parseInt(event);
      }

      const tokenid = this.localUserData.TokenId;
      const data = { 'month': this.selectedMonth, 'year': this.year, 'tokenid': tokenid };
      console.log('datadatadata', data);

      this._services.postService(Constant.getEmpAttendanceMonthWeek, data)
        .then((response: any) => {
          this.empAttendance = response.data;
          this.responseArrAll = response.data;
          this.reset();
          console.log('MONTHHHH', this.empAttendance);

          this.spinnerService.hide();

        }, (error) => {
          console.log(error.status);
          this.spinnerService.hide();

        });

    }, 1000)




  }

  getDetails(emp, TokenID) {

    if (emp.WeeklyHours === null) {
      this._services.showSnackbar({ status: 'No Punch IN/Out data present.You cannot Approve this' })
      return
    }
    let params = {
      "tokenid": this.localUserData.TokenId,
      'emptokenid': TokenID, "year": this.year,
      "month": parseInt(this.selectedMonth), "WeekEndDate": emp.WeekEndDate,
      "WeekStartDate": emp.WeekStartDate, "WeekDesc": emp.WeekNo
    };
    this.route.navigate(['mfss/admin-attendance-details'], { queryParams: params })
  }


}
