import { LocalStorageService } from "ngx-store";
import { Constant } from "./../../services/constant";
import { CommonService } from "./../../services/common.service";
import {
  Component,
  OnInit,
  ViewChild,
  NgZone,
  ChangeDetectorRef
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { } from "googlemaps";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

declare var jquery: any;
declare var $: any;
// declare var google: any;

const MomentRange = require("moment-range");
const Moment = require("moment");
const mv = MomentRange.extendMoment(Moment);

class RegularizeModalData {
  date: string;
  shiftBegin: string;
  shiftEnd: string;
  inTime: string;
  outTime: string;
  remarks: string;
}

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"]
})
export class AttendanceComponent implements OnInit {
  dateList: any;
  weeklyDataList: any;

  localUserData: any;
  usertype: string = "";
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
  public TitleMsg = "Attendance";
  pendingAttendance: any = [];
  @ViewChild("gmap") gmapElement: any;
  map: google.maps.Map;
  latitude: any = "";
  longitude: any = "";
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
  detailsIcon: string = "assets/img/select-date.png";
  defaultMsg: string = "To check date description, select specific date.";
  calendarView: boolean = true;
  listView: boolean = false;
  leaveView: boolean = false;
  isPermissionSet: boolean = false;
  showCaleInfo: boolean = false;
  toggleButton: boolean = false;
  regularizeData: RegularizeModalData;
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
    hours: "",
    minutes: ""
  };
  monthsArray: any = [];
  date = new Date();
  //leaveCardArr:any[]=[];
  leaveCard: any;
  monthNumber: any;
  weekGrid: any = [];
  public openFooter: boolean = false;
  public openStatus: boolean = false;
  noMapAvailable: boolean;
  punchingFlag: any;
  isMapAvailable: boolean;
  //isMarkAttendanceAllowed: any = true;
  constructor(
    private _services: CommonService,
    public cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private _storage: LocalStorageService,
    public spinnerService: Ng4LoadingSpinnerService,
    public formBuilder: FormBuilder
  ) {
    this.monthNumber = {
      January: "0",
      February: "1",
      March: "2",
      April: "3",
      May: "4",
      June: "5",
      July: "6",
      August: "7",
      September: "8",
      October: "9",
      November: "10",
      December: "11"
    };

    this._services.titleMessageSource.next("Attendance");
    this.weeklyTotal.hours = "";
    this.weeklyTotal.minutes = "";
    var d = new Date();
    this.maxYear = d.getFullYear() * 1;
    console.log("this.MaxYear", this.maxYear);
    this.minYear = this.maxYear - 1;

    //var d=new Date();
    //this.saveDaysMonthList=moment(d.getMonth()+1, 'MM').format('MMMM') +' '+d.getFullYear();
    // console.dir(this.saveDaysMonthList);
    this._services.getUserDetail().then(data => {
      this.localUserData = data;
      this.isHOEmp = this.localUserData.isHOEmp;
      this.IsManager = this.localUserData.IsManager;
      if (this.isHOEmp == true) {
        this.usertype = "HO";
      } else {
        this.usertype = "RO";
      }
      this.initializeData();
    });
    // this.isHOEmp = this._storage.get('username').isHOEmp;
    // this.IsManager = this._storage.get('username').IsManager;
    this.regularizeData = new RegularizeModalData();

    $(document).ready(function () {
      if ($(".mydatepicker").prop("type") != "date") {
        $(".mydatepicker").datepicker();
      }
    });

    this.leaveRequest = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      leaveType: ["", [Validators.required]],
      period: ["", [Validators.required]],
      comments: ["", [Validators.required]]
    });
    this.listheaderDate = moment();
    this.changeAttendanceList("");
  }
  ngAfterViewInit() {
    //this.goToClass();
  }
  goToClass() {
    // $(document).ready(function() {
    setTimeout(() => {
      $(".fixdiv").remove();
      //$(".applyborder").filter(":last").append(`<div class="fixdiv"   style="position: absolute;top: -17px;right: 0px;width: 150px;background: #fef205;z-index: 99;border-top-left-radius: 4px;border-top-right-radius: 4px;height: 16px;font-size: 11px;font-weight: 600;border: 1px solid #fef205;line-height: 1.2;">Hours: ${this.weeklyTotal.hours}h ${this.weeklyTotal.minutes}m</div>`);
      $(".applyBorder")
        .filter(":last")
        .append(
          this.isHOEmp == true
            ? `<div class="fixdiv" style="position: absolute;top: -17px;right: 0px;width: 100%;background: #fef205;z-index: 99;border-top-left-radius: 4px;border-top-right-radius: 4px;height: 16px;font-size: 11px;font-weight: 600;border: 1px solid #fef205;line-height: 1.2;">Hours: ${this.weeklyTotal.hours}h ${this.weeklyTotal.minutes}m</div>`
            : ""
        );
    }, 300);
    // });
  }
  showMap(flag) {
    this._services.getService(Constant.getServerDateTime).then(data => {
      this.startDate = data;
    });

    this.punchingFlag = flag;
    if (flag == "IN") {
      this.getLatLong(
        this.attendanceInfo.LatitudeIn,
        this.attendanceInfo.LongitudeIn
      );
    } else if (flag == "OUT") {
      this.getLatLong(
        this.attendanceInfo.LatitudeOut,
        this.attendanceInfo.LongitudeOut
      );
    }

    $("document").ready(function () { });

    if (
      this.attendanceInfo.LatitudeIn !== null &&
      this.attendanceInfo.LongitudeIn !== null
    ) {
      $("#attaendancemapModal").modal("show");
      // $('#successModal').modal('hide');
      setTimeout(() => {
        var width = $("#modal-body").width();
        $("#attendancemap").css("width", width);
      }, 2000);
    }

    //  this.getLatLong(this.attendanceInfo.LatitudeIn, this.attendanceInfo.LongitudeIn);

    //   $('#attaendancemapModal').modal('show');
    //   $('#successModal').modal('hide');
    //   setTimeout(() => {
    //     var width = $('#modal-body1').width();
    //     $("#attendancemap").css("width", width);
    //   }, 2000)
  }
  initializeData() {
    // this.month = moment().month();
    // this.year = moment().year();
    this.spinnerService.show();
    this.currentDate = new Date();
    this.selectedMonth = this.month + 1;
    // this.weekArray = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    this.weekArray = ["S", "M", "T", "W", "T", "F", "S"];
    this.latitude = "";
    this.longitude = "";
    this.startDate = this._services.serverDate;

    //**************************************** */

    this._services.getService(Constant.getServerDateTime).then(data => {
      this.startDate = data;
      this.headerDate = data;
      this.listheaderDate = data;
      this.currentServerDate = data;
      if (data != null) {
        let date = moment(this.serverCurrentdate).date();
        this.month = moment(this.serverCurrentdate).month();
        this.year = moment(this.serverCurrentdate).year();
        this.weekArray = ["S", "M", "T", "W", "T", "F", "S"];
        console.log("Year", this.year);
        console.log("Month", this.month);
        this.selectedYear = this.year;
        this.ddMonth = this.month;
        this.get_calendar(this.year, this.month);
      }
    });

    //this.startDate = this._services.serverDate;
    this.checkMarkAttendanceType();
    this.findMe();
    // this.get_calendar(this.year, this.month, this.startDate);
    // this.spinnerService.hide();
  }

  ngOnInit() { }

  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          // this.showPosition(position);
          this.isPermissionSet = true;
          console.log(position);
        },
        error => {
          console.log(error.code);
          this.setGeolocationErrorMsg(error);
          $("#successModal").modal("show");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  setGeolocationErrorMsg(error) {
    console.log("Error", error);

    switch (error.code) {
      case 1:
        this.successMessage =
          "User denied the request for Geolocation. To enable geolocation, check browser's settings"; //"You denied Geolocation, Please allow map to get your location."
        this.isPermissionSet = false;
        break;
      case 2:
        this.successMessage =
          "Location information is unavailable. To enable geolocation, check browser's settings."; //"Unable to retrieve your location"
        this.isPermissionSet = false;
        break;
      case 3:
        this.successMessage = "The request to get user location has timed out."; //"Unable to retrieve your location"
        this.isPermissionSet = false;
        break;
    }
  }

  get_calendar(year, month) {
    //startDate=moment(this.serverCurrentdate).date();
    this.tempMonth = month;
    this.year = year;
    //this.selectedYear = year;
    //this.ddMonth = month;
    this.totalDaysInMonth = [];

    //var calendarDateValue = moment(startDate).format("YYYY-MM-DD");
    var vm = this;
    console.log("new vm: ", vm);
    //console.log("calendarDateValue: ",calendarDateValue);
    var getDateMonthCall = function () {
      vm.getMonthDate(vm.startWeek, vm.endWeek, { y: year, M: month });
      // vm.calendarEventDate =
      // this.showCaleInfo = true;
    };

    //  console.log('HELLO',moment({ y: year, M: month }).isoWeekday(0).startOf('week').get('isoWeek'));
    // console.log('HELLO11', moment({ y: year, M: month }).startOf('month').get('isoWeek'));

    //***************************OLD********************** */
    this.startWeek = moment({ y: year, M: month })
      .startOf("month")
      .get("isoWeek");
    this.endWeek = moment({ y: year, M: month })
      .endOf("month")
      .get("isoWeek");

    //***************************NEW********************** */
    // this.startWeek = moment({ y: year, M: month }).isoWeekday(0).startOf('week').get('isoWeek');
    //this.endWeek =  moment({ y: year, M: month }).isoWeekday(0).endOf('week').get('isoWeek');

    this.getCalendarEvent(getDateMonthCall);
  }

  getMonthDate(startweek, endWeek, momentYear) {
    //console.log("my getMonthDate: "+startweek+"|"+endWeek);
    this.currentMonth = momentYear.M;

    //console.log("1call", this.currentMonth);
    console.log("monthDetail: ", this.monthDetail);
    if (startweek == 53) {
      ++endWeek;
    }
    if (momentYear.M == 0) {
      startweek = 1;
    }
    if (endWeek == 1) {
      endWeek = 53;
    }

    this.monthDate = [];
    this.calendarDate = [];
    console.log("Start Week", startweek);
    console.log("endWeek Week", endWeek);
    console.log("endWeek Week", this.monthDate);

    for (let i = startweek; i <= endWeek + 1; i++) {
      // alert("call");

      this.monthDate.push([
        Array(7)
          .fill(0)
          .map((n, j) =>
            moment(momentYear)
              .set("week", i)
              .startOf("week")
              .clone()
              .add(n + j, "day")
              .toDate()
          )
      ]);
      console.log("monthDateWeek", this.monthDate);
    }
    for (let c = 0; c < this.monthDetail.length; c++) {
      this.signinTime.getMonth() + 1;
      var check = moment(this.monthDetail[c].AttendanceDate); //, 'YYYY/MM/DD'
      console.log(check);
      var day = check.format("D");
      this.monthDetail[c].date = day;
    }

    for (let j = 0; j < this.monthDate.length; j++) {
      this.calendarWeek = [];
      let event: any;
      for (let k = 0; k < this.monthDate[j][0].length; k++) {
        let date = this.monthDate[j][0][k];
        let currDate = "no-current-date";

        if (momentYear.M != this.monthDate[j][0][k].getMonth()) {
          currDate = "muted";
        }
        let finddtt = moment(this.monthDate[j][0][k]).format(
          "YYYY-MM-DDT00:00:00"
        );
        let calendarIndex = this.monthDetail.findIndex(
          x => x.AttendanceDate == finddtt
        );
        if (
          (calendarIndex == 0 || calendarIndex != false) &&
          calendarIndex != -1
        ) {
          event = this.monthDetail[calendarIndex];
        } else if (calendarIndex === false) {
          event = null;
        }
        if (
          moment(moment(this.monthDate[j][0][k]).format("YYYY-MM-DD")).diff(
            moment(this.signinTime).format("YYYY-MM-DD")
          ) === 0
        ) {
          currDate = "currentDate";
        }
        let flag: boolean;
        if (
          parseInt(this.monthDate[j][0][k].getMonth()) ===
          parseInt(momentYear.M)
        ) {
          flag = true;
        } else {
          flag = false;
        }

        if (event) {
          this.calendarWeek.push({
            attendance_date: event,
            cdate: date,
            currentDate: currDate,
            monthData: parseInt(this.monthDate[j][0][k].getMonth()),
            dateflag: flag
          });
        }
      }
      if (this.calendarWeek.length > 0) {
        this.calendarDate.push(this.calendarWeek);
      }
    }
    function inArray(needle, monthDetail) {
      //var length = haystack.length;

      for (var i = 0; i < monthDetail.length; i++) {
        if (monthDetail[i].date == needle) {
          return i;
        }
      }
      return false;
    }

    if (this.monthWiseHolidays.length > 0) {
      this.holidayCount = this.monthWiseHolidays.length;
    }
    if (moment().get("month") == moment(this.date).get("month")) {
      this.getCurrentWeek().then(dt => {
        console.log(dt);
        this.showWeekDetails(dt);
      });
    } else {
      console.log(moment(this.date).get("month"));
      this.showWeekDetails(0);
    }

    this.intializeTotalDateArray(this.calendarDate);
    console.log("CALRENDAER", this.calendarDate);
    this.spinnerService.hide();
  }

  intializeTotalDateArray(calenderDate) {
    this.totalDaysInMonth = [];
    this.totalDaysInMonth.splice(0, this.totalDaysInMonth.length);
    console.log("TOTAL INITIALIZE ARRAY", calenderDate);
    calenderDate.forEach(item => {
      item.forEach(innerItem => {
        this.totalDaysInMonth.push(innerItem);
      });
    });
    this.checkCurrentDayWeek();
  }

  checkCurrentDayWeek() {
    console.log("Total Array", this.totalDaysInMonth);
    console.log("Current date", this.startDate);

    let foundIndex = this.totalDaysInMonth.findIndex(
      obj =>
        moment(this.startDate).format("DD-MM-YYYY") ==
        moment(obj.cdate).format("DD-MM-YYYY")
    );
    console.log(foundIndex);
    switch (true) {
      case foundIndex >= 0 && foundIndex < 7:
        this.showWeekDetails(0);
        break;
      case foundIndex >= 7 && foundIndex < 14:
        this.showWeekDetails(1);
        break;
      case foundIndex >= 14 && foundIndex < 21:
        this.showWeekDetails(2);
        break;
      case foundIndex >= 21 && foundIndex < 28:
        this.showWeekDetails(3);
        break;
      case foundIndex >= 28 && foundIndex < 35:
        this.showWeekDetails(4);
        break;
      case foundIndex >= 28 && foundIndex < 35:
        this.showWeekDetails(4);
        break;
    }
  }
  getCurrentWeek() {
    let promise = new Promise((resolve, reject) => {
      let i = 0;
      if (this.weeklyData) {
        this.weeklyData.forEach(week => {
          week.forEach(day => {
            console.log(moment(day.AttendanceDate).format("DD-MM-YYYY"));
            if (
              moment(day.AttendanceDate).format("DD-MM-YYYY") ==
              moment().format("DD-MM-YYYY")
            ) {
              resolve(i);
            }
          });
          i++;
        });
      }
    });
    return promise;
  }

  showWeekDetails(week) {
    this.calculateWeeklyHours(week);
    this.selectedGrid = week;
    console.log("foundIndex", this.selectedGrid);
    // this.tempArray = this.weekList[week];
    switch (true) {
      case week === 0:
        this.sortedArray = this.totalDaysInMonth.slice(0, 7);
        break;
      case week === 1:
        this.sortedArray = this.totalDaysInMonth.slice(7, 14);
        break;
      case week === 2:
        this.sortedArray = this.totalDaysInMonth.slice(14, 21);
        break;
      case week === 3:
        this.sortedArray = this.totalDaysInMonth.slice(21, 28);
        break;
      case week === 4:
        this.sortedArray = this.totalDaysInMonth.slice(28);
        break;
      case week === 5:
        this.sortedArray = this.totalDaysInMonth.slice(28);
        break;
    }
    console.log("weekdata", this.weeklyData[this.selectedGrid]);
    this.calculateWeeklyTime(week);
  }
  calculateWeeklyHours(week) {
    let curWeekData = this.weeklyData[week];
    let totalHours = 0;
    curWeekData.forEach(el => {
      if (el.TimeIn && el.TimeOut) {
        let start = moment(el.TimeIn);
        let end = moment(el.TimeOut);
        let duration = moment.duration(end.diff(start));
        totalHours += duration.asHours();
      }
    });
    let hrs = Math.floor(totalHours);
    let min = totalHours.toString().split(".")[1];
    min = (parseFloat("0." + min) * 60).toString();
    min = parseInt(min).toString();
    let totalHoursObj = {};
    totalHoursObj["totalHours"] = totalHours;
    totalHoursObj["hours"] = hrs;
    totalHoursObj["minutes"] = parseInt(min);
    this.weeklyTotal.hours = hrs.toString();
    this.weeklyTotal.minutes = min;
    console.log(totalHoursObj);
    this.goToClass();
  }
  weeklySegregation() {
    let weeklyData = [];
    let curWeek = 0;
    weeklyData[0] = [];
    console.log("this.monthDetail", this.monthDetail);

    for (let i = 0; i < this.monthDetail.length; i++) {
      weeklyData[curWeek].push(this.monthDetail[i]);
      // if (i < this.monthDetail.length - 1 && moment(this.monthDetail[i + 1].AttendanceDate).day() == 0) {
      if (
        i < this.monthDetail.length - 1 &&
        (moment(this.monthDetail[i + 1].AttendanceDate).day() == 0 ||
          (moment(this.monthDetail[i].AttendanceDate).date() == 15 &&
            moment(this.monthDetail[i].AttendanceDate).day() != 0))
      ) {
        curWeek++;
        weeklyData[curWeek] = [];
      }
    }
    return weeklyData;
  }

  checkWeekActive(d) {
    let flg = false;
    // console.log("date:: ", d);
    // console.log("in weeklydata: ", this.weeklyData);
    if (this.weeklyData && this.selectedGrid > -1) {
      // console.log(this.selectedGrid);
      // console.log(this.weeklyData[this.selectedGrid]);
      // console.log(d.attendance_date.AttendanceDate);
      for (let el of this.weeklyData[this.selectedGrid]) {
        if (el.AttendanceDate == d.attendance_date.AttendanceDate) {
          flg = true;
          break;
        }
      }
    }
    return flg;
  }

  checkDate(d) {
    if (this.sortedArray !== undefined) {
      //console.log('FLAG', this.tempArray);

      const checkDay = obj =>
        moment(obj.cdate).calendar() === moment(d.cdate).calendar() &&
        obj.currentDate !== "muted" &&
        obj.dateflag;
      //  console.log('CHECK Day', this.tempArray.some(checkDay));

      if (this.sortedArray.some(checkDay)) {
        // console.log('DateTrue', d);
        //console.log('True', checkDay);

        return true;
      } else {
        //console.log('False', checkDay);

        return false;
      }
    }
  }
  arrayOne(): any[] {
    return Array(5);
  }

  onMonthChange(ddMonth, selectedYear) {
    this.spinnerService.show();
    console.log(ddMonth + "|" + selectedYear);
    this.attendanceInfo = null;
    this.toggleButton = false;
    this.noRecord = false;
    this.detailsIcon = "assets/img/select-date.png";
    this.defaultMsg = "To check date description, select specific date.";
    this.holidayCount = 0;
    this.totalDaysInMonth = [];

    this.headerDate = moment(
      this.selectedYear + "-" + this.ddMonth + "-01"
    ).toDate();
    console.log("new header: " + this.headerDate);
    let mstartDate = moment(this.headerDate);
    this.get_calendar(this.selectedYear, this.ddMonth);

    // this.get_calendar(mstartDate.get('year'), mstartDate.get('month'));
    //this.selectedMonth = mstartDate.get('month') + 1;
    // this.listheaderDate = moment(this.listheaderDate).subtract(1, 'months').toDate();
    // let mstartDate = moment(this.listheaderDate);
    //this.getMonthDetail(selectedYear, ddMonth);
    // this.get_calendar(mstartDate.get('year'), mstartDate.get('month'), this.listheaderDate);
    //this.selectedMonth = mstartDate.get('month') + 1;
  }
  applyDateAll() {
    setTimeout(() => {
      var self = this;
      var dateformat = self.saveDaysMonth.split(" ");
      console.log("*******dateformat", this.startDate);

      dateformat[0] = self.monthNumber[dateformat[0]];
      var currentDate = new Date();
      console.dir(currentDate);
      if (self.saveDaysMonth !== " ") {
        $(".startDateAll").val(self.saveDaysMonth);
      }

      //var defaultDate = new Date('1/12/2019');

      $(document).ready(function () {
        $(".imageclick").on("click", function (e) {
          $(".startDateAll").datepicker("show");
        });

        $(".startDateAll").datepicker({
          changeMonth: true,
          changeYear: true,
          showButtonPanel: true,
          dateFormat: "MM yy",
          yearRange: self.minYear + ":" + self.maxYear,
          maxDate: "0",
          minDate: new Date(`${self.minYear}-04-01`),
          // defaultDate: defaultDate ,
          beforeShow: function (input, inst) {
            var dateformat1 = self.saveDaysMonth.split(" ");
            dateformat1[0] = self.monthNumber[dateformat1[0]];
            var string =
              dateformat1[0] * 1 + 1 + "/" + "01" + "/" + dateformat1[1];
            var defaultDate = new Date(string);

            $(this).datepicker("option", "defaultDate", defaultDate);
            $(".startDateAll").val(self.saveDaysMonth);
          },
          onClose: function (dateText, inst) {
            var date = $(this).datepicker(
              "setDate",
              new Date(inst.selectedYear, inst.selectedMonth, 1)
            );
            date = date[0].value;
            // $("#startDate1").datepicker("option", "defaultDate", date);
            console.dir(date);

            if (date == self.saveDaysMonth) {
              return false;
            }
            date = date.split(" ");
            self.DatePickerMethod(date[1], self.monthNumber[date[0]]);
            self.getMonthAttendance(self.monthNumber[date[0]] * 1 + 1, date[1]);
            //self.getMonthAttendance=$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1))[0].value;
            self.saveDaysMonth = $(this).datepicker(
              "setDate",
              new Date(inst.selectedYear, inst.selectedMonth, 1)
            )[0].value;
          }
        });
        $.datepicker._gotoToday = function (id) {
          $(id)
            .datepicker("setDate", new Date())
            .datepicker("hide")
            .blur();
        };
      });
    }, 0);
  }
  // applyDate() {
  //   setTimeout(() => {
  //     var self = this;
  //     var dateformat=self.saveDaysMonth.split(' ');
  //     dateformat[0]=self.monthNumber[dateformat[0]];

  //     if(self.saveDaysMonth){
  //       $('#startDate1').val(self.saveDaysMonth);
  //     }
  //     console.dir(self.saveDaysMonth);
  //     $(document).ready(function () {
  //       $('#startDate1').datepicker({
  //         changeMonth: true,
  //         changeYear: true,
  //         showButtonPanel: true,
  //         dateFormat: 'MM yy',
  //         maxDate: '0',
  //         //defaultDate: new Date(dateformat[1], dateformat[0], 1),
  //         onClose: function (dateText, inst) {

  //           var date=$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
  //               date=date[0].value;
  //              // $("#startDate1").datepicker("option", "defaultDate", date);
  //               console.dir(date);
  //               console.dir(self.saveDaysMonth);
  //                   if(date ==  self.saveDaysMonth){
  //                     return false;
  //                   }
  //               date=date.split(' ')
  //              self.DatePickerMethod(date[1],self.monthNumber[date[0]]);
  //              self.saveDaysMonth=$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1))[0].value;
  //         }
  //       });
  //     });
  //   }, 0)
  // }

  DatePickerMethod(year, month) {
    this.spinnerService.show();
    console.dir(year + "  " + month);
    // console.log(ddMonth + "|" + selectedYear);
    this.selectedYear = year;
    this.ddMonth = month;
    this.attendanceInfo = null;
    this.toggleButton = false;
    this.noRecord = false;
    this.detailsIcon = "assets/img/select-date.png";
    this.defaultMsg = "To check date description, select specific date.";
    this.holidayCount = 0;
    this.totalDaysInMonth = [];

    // this.headerDate = moment(this.selectedYear + "-" + this.ddMonth + "-01").toDate();
    // console.log("new header: " + this.headerDate);
    // let mstartDate = moment(this.headerDate);
    this.get_calendar(this.selectedYear, this.ddMonth);
  }
  previousYear() {
    console.dir(this.monthNumber);
    this.selectedYear -= 1;
    console.log("this.selectedYear", this.selectedYear);
    this.onMonthChange(this.ddMonth, this.selectedYear);
  }
  nextYear() {
    this.selectedYear += 1;
    console.log("this.selectedYear", this.selectedYear);
    this.onMonthChange(this.ddMonth, this.selectedYear);
  }
  previousMonth(type?) {
    this.attendanceInfo = null;
    this.toggleButton = false;
    this.noRecord = false;
    this.detailsIcon = "assets/img/select-date.png";
    this.defaultMsg = "To check date description, select specific date.";
    this.holidayCount = 0;
    this.totalDaysInMonth = [];
    if (type != "list" || type == undefined) {
      this.headerDate = moment(this.headerDate)
        .subtract(1, "months")
        .toDate();
      let mstartDate = moment(this.headerDate);
      this.get_calendar(mstartDate.get("year"), mstartDate.get("month"));
      this.selectedMonth = mstartDate.get("month") + 1;
    } else {
      this.listheaderDate = moment(this.listheaderDate)
        .subtract(1, "months")
        .toDate();
      let mstartDate = moment(this.listheaderDate);
      this.getMonthDetail(mstartDate.get("year"), mstartDate.get("month"));
      // this.get_calendar(mstartDate.get('year'), mstartDate.get('month'), this.listheaderDate);
      this.selectedMonth = mstartDate.get("month") + 1;
    }
  }

  nextMonth(type?) {
    this.attendanceInfo = null;
    this.toggleButton = false;
    this.noRecord = false;
    this.detailsIcon = "assets/img/select-date.png";
    this.defaultMsg = "To check date description, select specific date.";
    this.holidayCount = 0;

    this.totalDaysInMonth = [];

    if (type != "list" || type == undefined) {
      this.headerDate = moment(this.headerDate)
        .add(1, "months")
        .toDate();
      let mstartDate = moment(this.headerDate);
      this.get_calendar(mstartDate.get("year"), mstartDate.get("month"));
      this.selectedMonth = mstartDate.get("month") + 1;
    } else {
      this.listheaderDate = moment(this.listheaderDate)
        .add(1, "months")
        .toDate();
      let mstartDate = moment(this.listheaderDate);
      this.getMonthDetail(mstartDate.get("year"), mstartDate.get("month"));
      // this.get_calendar(mstartDate.get('year'), mstartDate.get('month'), this.listheaderDate);
      this.selectedMonth = mstartDate.get("month") + 1;
    }
  }

  openMap() {
    //this.isPermissionSet
    if (this.isPermissionSet) {
      console.dir("inside permission");
      this._services.getService(Constant.getServerDateTime).then(data => {
        this.startDate = data;
      });
      this.getLatLong("", "");
      $("document").ready(function () { });

      $("#mapModal").modal("show");
      $("#successModal").modal("hide");
      setTimeout(() => {
        var width = $("#modal-body").width();
        $("#map").css("width", width);
        console.dir($("#modal-body").css("width"));
      }, 2000);
    } else {
      $("#mapModal").modal("hide");
      $("#successModal").modal("show");
    }
  }
  openInfoModal() {
    $("#informationModal").modal("show");
  }

  // applyDateList() {
  //   setTimeout(() => {
  //     var self = this;
  //     if(self.saveDaysMonthList){
  //       //alert(self.saveDaysMonthList);
  //       $('#startDateList').val(self.saveDaysMonthList);
  //       $('#startDate').val(self.saveDaysMonthList);
  //     }
  //     $(document).ready(function () {
  //       $('#startDateList').datepicker({
  //         changeMonth: true,
  //         changeYear: true,
  //         showButtonPanel: true,
  //         dateFormat: 'MM yy',
  //         maxDate: '0',
  //         onClose: function (dateText, inst) {
  //           var date=$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
  //               date=date[0].value;
  //               console.dir(date);
  //               console.dir(self.saveDaysMonthList);
  //                   if(date ==  self.saveDaysMonthList){
  //                     return false;
  //                   }
  //               date=date.split(' ')
  //             // self.DatePickerMethod(date[1],self.monthNumber[date[0]]);
  //             self.getMonthAttendance(self.monthNumber[date[0]]*1+1,date[1]);
  //              self.saveDaysMonthList=$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1))[0].value;
  //         }
  //       });
  //     });
  //   }, 0)
  // }

  changeAttendanceList(direction) {
    if (direction == "next") {
      this.listheaderDate = moment(this.listheaderDate)
        .add(1, "months")
        .toDate();
    } else if (direction == "prev") {
      this.listheaderDate = moment(this.listheaderDate)
        .subtract(1, "months")
        .toDate();
    }
    let month = moment(this.listheaderDate).get("months") + 1;
    let year = moment(this.listheaderDate).get("years");
    console.log("month: ", month, "Year: ", year);
    this.getMonthAttendance(month, year);
  }

  getMonthAttendance(month, year) {
    this.spinnerService.show();
    this._services.getUserDetail().then((data: any) => {
      console.log(data);
      let params = {
        month: month,
        year: year,
        tokenid: data.TokenId
      };
      this._services.postService(Constant.MonthAttendanceNew, params).then(
        response => {
          this.dateList = response["data"];

          this.weeklyDataList = this.weeklySegregationList();
          // this.weeklyDataList.push(this.calendarDate);
          // this.setWeekGrid();
          console.log(this.weeklyDataList);
          console.log(moment().get("month") + 1);
          console.log(moment(this.date).get("month"));
          // if (moment().get('month')+1 == month) {
          if (moment().get("month") == moment(this.date).get("month")) {
            this.getCurrentWeek().then(dt => {
              console.log(dt);
              this.showWeekDetails(dt);
            });
          } else {
            console.log(moment(this.date).get("month"));
            this.showWeekDetails(0);
          }
        },
        error => {
          console.log("Error: ", error);
        }
      );
    });
  }

  setWeekGrid() {
    let weekDataLen = this.weeklyDataList.length;
    let lastWeek = this.weeklyDataList[weekDataLen - 1];
    console.log("lastweek", lastWeek);

    if (lastWeek === undefined || lastWeek === "") {
      this.weekGrid = Array(weekDataLen - 1);
      console.log("lastweek undefined", lastWeek);
      return false;
    } else {
      lastWeek.forEach(element => { });
    }
  }

  weeklySegregationList() {
    let weeklyData = [];
    let curWeek = 0;
    weeklyData[0] = [];
    for (let i = 0; i < this.dateList.length; i++) {
      if (
        moment(this.dateList[i].AttendanceDate).date() ==
        moment(this.serverCurrentdate).date()
      ) {
        console.log("in if");
        this.dateList[i].currentDate = true;
      } else {
        this.dateList[i].currentDate = false;
      }
      weeklyData[curWeek].push(this.dateList[i]);
      if (
        i < this.dateList.length - 1 &&
        (moment(this.dateList[i + 1].AttendanceDate).day() == 0 ||
          (moment(this.dateList[i].AttendanceDate).date() == 15 &&
            moment(this.dateList[i].AttendanceDate).day() != 0))
      ) {
        curWeek++;
        weeklyData[curWeek] = [];
      }
    }

    console.log("HOnestly", weeklyData);

    return weeklyData;
  }

  checkDateCurMonth(calDate) {
    let curMonth = moment(this.listheaderDate).get("month");
    let calDateMonth = moment(calDate).get("month");
    if (curMonth != calDateMonth) {
      return true;
    } else {
      return false;
    }
  }

  calculateWeeklyTime(week) {
    if (this.weeklyDataList) {
      let curWeekData = this.weeklyDataList[week];
      let totalMinutes = 0;
      curWeekData.forEach(el => {
        totalMinutes += el.MinutesConsidered;
      });
      this.weeklyTotal.minutes = Math.round(totalMinutes % 60).toString();
      this.weeklyTotal.hours = Math.floor(totalMinutes / 60).toString();
      return {
        hours: this.weeklyTotal.hours,
        minutes: this.weeklyTotal.minutes
      };
    }
  }
  //abcd
  markAttendance() {
    this.openStatus = !this.openStatus;
    const tempdate = new Date(this.startDate);
    const month = tempdate.getMonth() + 1;
    const newDate =
      tempdate.getFullYear() + "-" + month + "-" + tempdate.getDate();
    this._services.encrypt(this.latitude.toString()).then(lat => {
      console.log("encrypted lat: ", lat);
      this._services.encrypt(this.longitude.toString()).then(long => {
        console.log("encrypted long: ", long);
        /*let param = {
          "lst": [
            {
              // "TokenNo": this._storage.get('username').TokenId,
              "TokenNo": this.localUserData.TokenId,
              "AttendanceDate": newDate,
              "AttendanceTime": this.startDate,
              "TimeType": this.signInType,
              "MachineID": "",
              "Lat": lat,
              "Long": long,
              "Source": 2,
              // "CreatedBy": this._storage.get('username').TokenId
              "CreatedBy": this.localUserData.TokenId
            }],
          "tokenid": this.localUserData.TokenId
        }*/
        let param = {
          TimeType: this.signInType,
          MachineID: "",
          Lat: lat,
          Long: long,
          Source: 2,
          tokenid: this.localUserData.TokenId
        };
        console.log(param);
        this.spinnerService.show();
        this._services.postService(Constant.marksCheckInAttendance, param).then(
          (data: any) => {
            console.log(param);
            this.spinnerService.hide();
            let type = this.signInType === "O" ? "Punch Out" : "Punch In";
            this.successMessage =
              "Your " +
              type +
              " for " +
              moment(data.PunchedTime).format("DD-MMM-YYYY HH:mm:ss") +
              " was Successful!";
            // this.response = ;
            $("#mapModal").modal("hide");
            $("#successModal").modal("show");
            this.checkMarkAttendanceType();
            // setTimeout(function () {
            // window.location.reload();
            // }, 1800);
          },
          error => {
            this.spinnerService.hide();
            this.response = error;
            $("#mapModal").modal("hide");
            $("#successModal").modal("show");
          }
        );
      });
    });
  }

  checkMarkAttendance() {
    this.openStatus = !this.openStatus;

    // let date = moment(this.startDate).date();
    // let month = moment(this.startDate).month();
    // let year = moment(this.startDate).year();
    // let current_date = year + "-" + (month + 1) + "-" + date;

    // const param = JSON.stringify({
    //   // "tokenid": this._storage.get('username').TokenId,
    //   "tokenid": this.localUserData.TokenId,
    //   "AttendanceDate": current_date
    // });
    // this._services.postService(Constant.getPunchData, param).then((data: any) => {
    //   console.log(data);
    //   if (data.TimeType == null) {
    //     // $("#conformationModal").modal('show');
    //     this.openFooter = !this.openFooter
    //   }
    //   if (data.TimeType == 'O' && this.signInType == 'I') {
    //     // $("#conformationModal").modal('show');
    //     this.openFooter = !this.openFooter
    //   }
    //   if (data.TimeType == 'O') {
    //     // $("#conformationModal").modal('show');
    //     this.openFooter = !this.openFooter
    //   }
    //   if (data.TimeType == 'I') {
    //     // $("#conformationModal").modal('show');
    //     this.openFooter = !this.openFooter
    //   }
    // }, (error) => {
    //   console.log(error);
    // });
  }
  closePanel() {
    this.openStatus = !this.openStatus;
  }
  checkMarkAttendanceType() {
    let date = moment(this.startDate).date();
    let month = moment(this.startDate).month();
    let year = moment(this.startDate).year();
    let current_date = year + "-" + (month + 1) + "-" + date;
    const param = JSON.stringify({
      // "tokenid": this._storage.get('username').TokenId,
      tokenid: this.localUserData.TokenId,
      AttendanceDate: current_date
    });
    this._services.postService(Constant.getPunchData, param).then(
      (data: any) => {
        //  this._services.spinnerService.hide()
        // this.isMarkAttendanceAllowed = data.Status !== null && data.Status !== 'pending';
        if (data.TimeType == null) {
          this.attendanceType = "Punch In";
          this.signInType = "I";
        }
        if (data.TimeType == "I") {
          this.attendanceType = "Punch Out";
          this.signInType = "O";
        }
        if (data.TimeType == "O") {
          this.attendanceType = "Punch Out";
          this.signInType = "O";
        }
        //this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      }
    );
  }

  msToTime(duration) {
    let seconds = Math.floor(duration / 1000) % 60;
    let minutes = Math.floor(duration / (1000 * 60)) % 60;
    let hours = Math.floor(duration / (1000 * 60 * 60)) % 24;

    let hours1 = hours < 10 ? "0" + hours : hours;
    let minutes1 = minutes < 10 ? "0" + minutes : minutes;
    let seconds1 = seconds < 10 ? "0" + seconds : seconds;

    return hours1 + ":" + minutes1 + ":" + seconds1;
  }

  TimeMinutes(n) {
    let num = n;
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    let hours1 = rhours < 10 ? "0" + rhours : rhours;
    let minutes1 = rminutes < 10 ? "0" + rminutes : rminutes;
    return hours1 + ":" + minutes1;
    //return rhours + ":" + rminutes + ":" + '00';
  }

  MinutesConsidered(data) {
    let data1 = this.TimeMinutes(data);
    return data1;
  }

  showInfo(dateInfo: any) {
    // console.log("dateInfo",dateInfo)
    //  alert('Hello')
    //  alert('Date Info' + JSON.stringify(dateInfo));

    let date = moment(this.startDate).date();
    let month = moment(this.startDate).month();
    let year = moment(this.startDate).year();

    let calendarDate = moment(dateInfo.AttendanceDate).date();
    const calendarMonth = moment(dateInfo.AttendanceDate).month();
    let calendarYear = moment(dateInfo.AttendanceDate).year();
    const current_date = year + "-" + (month + 1) + "-" + date;

    let clockedHours = "";
    // if ((dateInfo.TimeIn && dateInfo.TimeOut) && this.localUserData.isHOEmp !== true) {
    //   console.dir('inside calTime');
    //   clockedHours = this.msToTime(new Date(dateInfo.TimeOut).getTime() - new Date(dateInfo.TimeIn).getTime());
    //   dateInfo['clockedHours']=clockedHours;
    // }
    if (dateInfo.MinutesConsidered != null && dateInfo.MinutesConsidered != 0) {
      console.dir("inside Ho");
      clockedHours = this.TimeMinutes(dateInfo.MinutesConsidered);
      dateInfo["clockedHours"] = clockedHours;
    }
    // if ((date === calendarDate) && (month === calendarMonth) && (year === calendarYear)) {

    //   let url = Constant.getPunchDataForApp;
    //   let param = {
    //     "AttendanceDate": current_date,
    //     "tokenid": this._storage.get('username').TokenId
    //   };
    //   // alert(param)
    //   this._services.postService(url, param)
    //     .then((response: any) => {
    //       console.log('RESPONSEEEEE', response);
    //       if (response.data.length != 0) {

    //         this.attendanceInfo = response.data[0];
    //         this.noRecord = true;
    //       }
    //       else {
    //         this.attendanceInfo = dateInfo;
    //         this.noRecord = true;
    //       }
    //     });

    // }
    // else {

    if (dateInfo.Status != "H") {
      this.attendanceInfo = dateInfo;
      this.noRecord = true;
    } else {
      if (dateInfo.Status == "H" || dateInfo.Status == "H") {
        this.detailsIcon = "assets/img/week-off.png";
        this.defaultMsg = dateInfo.StatusDescription;
        this.noRecord = false;
      } else {
        this.detailsIcon = "";
        this.defaultMsg = "";
        this.noRecord = true;
      }
      this.attendanceInfo = null;
    }
    console.log("ATTENDANCE INFO", this.attendanceInfo);

    //}
  }

  getCalendarEvent(getDateMonthCall) {
    let temp_month = parseInt(this.tempMonth) + 1;
    // const tokenid = this._storage.get('username').TokenId;
    const tokenid = this.localUserData.TokenId;

    this.saveDaysMonth =
      moment(temp_month, "MM").format("MMMM") + " " + this.year;
    this.saveDaysMonthList =
      moment(temp_month, "MM").format("MMMM") + " " + this.year;
    const data = { month: temp_month, year: this.year, tokenid: tokenid };
    console.log("new calendarEventdata", data);
    this.spinnerService.show();
    this._services.postService(Constant.MonthAttendanceNew, data).then(
      (response: any) => {

        this.showCaleInfo = true;
        this.toggleButton = true;
        this.monthWiseHolidays = [];
        this.monthDetail = response.data;
        this.weeklyData = this.weeklySegregation();
        console.log("FROMMMMM", this.weeklyData);
        this.spinnerService.hide();
        this.getHolidayList(this.monthDetail);
        this.applyDateAll();
        //this.spinnerService.hide();
        getDateMonthCall();
        //this.applyDate();
      },
      error => {
        this.spinnerService.hide();
        console.log(error.status);
        // this._services.showSnackbar(error);
      }
    );
  }

  //get month details
  getMonthDetail(year, month) {
    let temp_month = parseInt(month) + 1;
    // const tokenid = this._storage.get('username').TokenId;
    const tokenid = this.localUserData.TokenId;
    const data = { month: temp_month, year: year, tokenid: tokenid };
    console.log(year + "|" + month + "|" + Constant.MonthWiseAttendance);
    console.log("data: ", data);
    this.spinnerService.show();
    this._services.postService(Constant.MonthWiseAttendance, data).then(
      (response: any) => {
        console.log("MONTHHHH", response);

        this.spinnerService.hide();
        this.showCaleInfo = true;
        this.toggleButton = true;
        this.monthDetail = response.data;
      },
      error => {
        console.log(error.status);
        this.spinnerService.hide();
        // this._services.showSnackbar(error);
      }
    );
  }
  getLatLong(latitude, longitude) {
    if (latitude == null || longitude == null) {
      this._services.showSnackbar({ status: "No Map data Available." });

      this.noMapAvailable = true;
    } else if (latitude !== null && longitude !== null) {
      if (navigator.geolocation) {
        const getId = latitude == "" ? "map" : "attendancemap";

        const div = document.getElementById(getId);
        navigator.geolocation.getCurrentPosition(
          position => {
            this.isPermissionSet = true;
            this.noMapAvailable = true;
            this.isMapAvailable = true;
            this.latitude =
              latitude == "" ? position.coords.latitude : parseFloat(latitude);
            this.longitude =
              longitude == ""
                ? position.coords.longitude
                : parseFloat(longitude);

            console.log("THIS>", this.latitude);

            console.log("THIS>", this.longitude);
            let mapFrame = `<iframe width="100%" height="90%" frameborder="0" style="border:0" src="${Constant.embedMapURL}&q=${this.latitude},${this.longitude}" allowfullscreen></iframe>`;
            console.log(mapFrame);
            div.innerHTML = mapFrame;
            // const map = new google.maps.Map(div, {
            //   center: {
            //     lat: this.latitude,
            //     lng: this.longitude
            //   },
            //   draggable: false,
            //   zoom: 18
            // });
            // const marker = new google.maps.Marker({
            //   position: new google.maps.LatLng(this.latitude, this.longitude),
            //   map: map,

            //   title: 'You are here!'
            // });
          },
          error => {
            this.setGeolocationErrorMsg(error);
            $("#successModal").modal("show");
          },
          { enableHighAccuracy: true, maximumAge: 50000 }
        );
      } else {
        //alert("Not set map");
      }
    }
  }

  // Marks attendance
  marksSignIn() {
    this.checkMarkAttendance();
    // this.signInType = 'I';
    const tempdate = new Date(this.signinTime);
    const month = tempdate.getMonth() + 1;
    const newDate =
      tempdate.getFullYear() + "-" + month + "-" + tempdate.getDate();
    let param = {
      lst: [
        {
          // "TokenNo": this._storage.get('username').TokenId,
          TokenNo: this.localUserData.TokenId,
          AttendanceDate: newDate,
          AttendanceTime: this.signinTime,
          TimeType: this.signInType,
          MachineID: "",
          Lat: parseFloat(this.latitude),
          Long: parseFloat(this.longitude),
          Source: 2,
          CreatedBy: this.localUserData.TokenId
          // "CreatedBy": this._storage.get('username').TokenId
        }
      ]
    };

    this._services.postService(Constant.marksCheckInAttendance, param).then(
      data => {
        $("#mapModal").modal("hide");
        $("#successModal").modal("show");
        window.location.reload();
      },
      error => {
        $("#mapModal").modal("hide");
        $("#successModal").modal("show");
      }
    );
  }

  getHolidayList(monthDetail) {
    for (let i = 0; i < monthDetail.length; i++) {
      if (
        monthDetail[i].HolidayDescription != "" &&
        monthDetail[i].IsHoliday &&
        monthDetail[i].HolidayDescription != null
      ) {
        this.monthWiseHolidays.push({
          date: monthDetail[i].AttendanceDate,
          holidaydesc: monthDetail[i].HolidayDescription,
          holidayType: monthDetail[i].Status
        });
      }
    }
  }

  // calendarView

  leaveViewFun() {
    this.leaveView = true;
    this.calendarView = false;
    this.listView = false;
    this.regularizeView = false;

    const sideSection = <HTMLDivElement>document.querySelector(".side-section");
    const mainsection = <HTMLDivElement>(
      document.querySelector(".attendance-section")
    );
    sideSection.style.display = "none";
    this.leaveCardClassActive = false;
    this.leaveReqClassActive = false;
    this.leaveListClassActive = true;
    $("document").ready(function () {
      $("#leaveReq").click();
    });

    // for(var i=0;i<=30;i++){
    //   this.leaveCardArr.push({'leaveType':'leave-Balance','PL':5,'EL':5,'ML':10});
    // }

    this.leaveCard = [
      {
        leaveName: "Derived Balance-2017",

        PL: "15.0",

        EL: "0.0",

        ML: "0.0"
      },

      {
        leaveName: "Lapsed-2017",

        PL: "0.0",

        EL: "0.0",

        ML: "0.0"
      },

      {
        leaveName: "Closing Balance-2017",

        PL: "15.0",

        EL: "0.0",

        ML: "0.0"
      },

      {
        leaveName: "Credit for the 2018",

        PL: "20.0",

        EL: "17.0",

        ML: "10.0"
      },

      {
        leaveName: "Opening Balance-2018",

        PL: "35.0",

        EL: "17.0",

        ML: "10.0"
      },

      {
        leaveName: "Approved/Sanctioned-2018",

        PL: "0.0",

        EL: "10.5",

        ML: "6.0"
      },

      {
        leaveName: "Encashed 2018",

        PL: "0.0",

        EL: "0.0",

        ML: "0.0"
      },

      {
        leaveName: "Balance as on date",

        PL: "35.0",

        EL: "6.5",

        ML: "4.0"
      }
    ];
  }

  calendarview() {
    this.calendarView = true;
    this.listView = false;
    this.leaveView = false;
    this.regularizeView = false;
    const sideSection = <HTMLDivElement>document.querySelector(".side-section");
    const mainsection = <HTMLDivElement>(
      document.querySelector(".attendance-section")
    );
    sideSection.style.display = "block";
    //this.applyDate();
    this.applyDateAll();
  }

  listview() {
    const sideSection = <HTMLDivElement>document.querySelector(".side-section");
    const mainsection = <HTMLDivElement>(
      document.querySelector(".attendance-section")
    );
    sideSection.style.display = "none";
    //this.applyDateList();
    this.applyDateAll();
    this.listView = true;
    this.calendarView = false;
    this.regularizeView = false;
    this.leaveView = false;

    this.attendanceInfo = null;
  }

  ngOnDestroy() {
    $("#successModal").modal("hide");
    this.spinnerService.hide();
  }

  attendanceRegularize() {
    const sideSection = <HTMLDivElement>document.querySelector(".side-section");
    const mainsection = <HTMLDivElement>(
      document.querySelector(".attendance-section")
    );
    sideSection.style.display = "block";

    let data = {
      // TokenId: this._storage.get('username').TokenId
      TokenId: this.localUserData.TokenId
      //24003466
    };
    this.reasonText = "";
    this.listView = false;
    this.calendarView = false;
    this.leaveView = false;
    this.regularizeView = true;
    this.spinnerService.show();
    this._services
      .postService(Constant.GetPendingAttendance, data)
      .then(resp => {
        console.log(resp);

        this.pendingAttendance = resp;

        $("document").ready(function () {
          $("#poof0").slideDown("slow");
          this.oldIndex = 0;
        });

        this.spinnerService.hide();
      });
  }

  openConfirmation(flag, obj, innerobj) {
    this.obj = obj;
    this.innerobj = innerobj;
    this.flag = flag;
    console.log("this.flag", this.flag);
    this.status = flag === "Approved" ? "Approval" : "Rejection";
    console.log("this.status", this.status);

    setTimeout(() => {
      $("#confirmationAttendance").modal("show");
    }, 500);
  }

  approveReject() {
    if (this.reasonText.trim() != "") {
      let url = Constant.ApproveRejectAttendance;
      this.innerobj.Status = this.flag;
      // this.innerobj.Remarks = '';
      this.innerobj.Remarks = this.reasonText;
      let data = {
        TokenId: this.obj.TokenId,
        AttendanceEntries: [this.innerobj]
      };

      console.log("data", data);

      this._services.postService(url, data).then(resp => {
        if (resp == "Success") {
          $("#confirmationAttendance").modal("hide");
          this._services.showSnackbar({
            status: "Attendace " + this.flag + " Successfully"
          });
          this.attendanceRegularize();
        }
      });
    } else {
      this._services.showSnackbar({ status: "Reason field is mandatory" });
    }
  }
  toggle(i, flag) {
    for (var j = 0; j < this.pendingAttendance.length; j++) {
      i != j
        ? $("#poof" + j).slideUp("slow")
        : $("#poof" + i).slideToggle("slow");
    }
    this.oldIndex == i
      ? (this.oldIndex = this.pendingAttendance.length)
      : (this.oldIndex = i);
  }
  openTimeOffDialog(attendanceInfo) {
    console.log("kavita", attendanceInfo);
    this.regularizeData.date = attendanceInfo.AttendanceDate;
    this.regularizeData.shiftBegin = attendanceInfo.TimeIn;
    this.regularizeData.shiftEnd = attendanceInfo.TimeOut;
    this.regularizeData.inTime = "";
    this.regularizeData.outTime = "";
    this.regularizeData.remarks = "Your remarks";
    $("#timeoffModal").modal("show");
  }
  getDate(datetime) {
    if (!datetime) {
      return null;
    }
    return datetime.substring(0, 10);
  }
  getTime(datetime) {
    if (!datetime) {
      return null;
    }
    return datetime
      .toLowerCase()
      .split("t")
      .pop()
      .substring(0, 5);
  }
  regularizeSubmit() {
    console.log("kavi", this.regularizeData);
    let regularizationDate = this.dateFormat(this.regularizeData.date);
    let regularizeInTime = this.dateFormat(
      this.getDate(this.regularizeData.date) + " " + this.regularizeData.inTime
    );
    let regularizeOutTime = this.dateFormat(
      this.getDate(this.regularizeData.date) + " " + this.regularizeData.outTime
    );
    let actualInTime = this.dateFormat(this.regularizeData.shiftBegin);
    actualInTime =
      actualInTime === "Invalid date" ? regularizationDate : actualInTime;
    let actualOutTime = this.dateFormat(this.regularizeData.shiftEnd);
    actualOutTime =
      actualOutTime === "Invalid date" ? regularizationDate : actualOutTime;
    // const tokenid = this._storage.get('username').TokenId;
    const tokenid = this.localUserData.TokenId;
    const data = {
      TokenID: tokenid,
      RegularizationDate: regularizationDate,
      ActualInTime: actualInTime,
      ActualOutTime: actualOutTime,
      RegularizationInTime: regularizeInTime,
      RegularizationOutTime: regularizeOutTime,
      Remarks: this.regularizeData.remarks
    };
    console.log(data);
    // return false;
    this.spinnerService.show();
    this._services.postService(Constant.regularizeAttendance, data).then(
      (response: any) => {
        this.spinnerService.hide();
        this._services.showSnackbar({
          status: "Attendace successfully regularized"
        });
        $("#timeoffModal").modal("hide");
      },
      error => {
        this.spinnerService.hide();
        console.log(error.status);
      }
    );
  }
  validateRegularize() {
    if (
      !this.regularizeData.inTime ||
      !this.regularizeData.outTime ||
      !this.regularizeData.remarks
    ) {
      return true;
    } else {
      return false;
    }
  }
  dateFormat(date) {
    return moment(date).format();
  }

  formCntrl(controlName) {
    return this.leaveRequest.get(controlName);
  }
  activeClassChange(val) {
    this.leaveListClassActive = false;
    this.leaveReqClassActive = false;
    this.leaveCardClassActive = false;
    if (val == "leaveList") {
      this.leaveListClassActive = true;
    } else if (val == "leaveReq") {
      this.leaveReqClassActive = true;
    } else {
      this.leaveCardClassActive = true;
    }
  }
}
