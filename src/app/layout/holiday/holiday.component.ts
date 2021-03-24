import { LocalStorageService } from 'ngx-store';
import { Constant } from './../../services/constant';
import { CommonService } from './../../services/common.service';
import { Component, OnInit, NgZone } from '@angular/core';
import * as moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit {
  localUserData: any;
  serverCurrentdate: any;
  public startDate: any;
  public month;
  public year;
  public weekArray;
  public startWeek;
  public endWeek;
  public currentMonth: any;
  private monthDate;
  public calendarDate;
  public calendarWeek;
  public monthWiseHolidays = [];
  private monthDetail;
  private holidayCount: number;
  public selectedMonth: any;
  showInfo: boolean = false;
  toggleButton: boolean = false;
  saveDaysMonth: any;
  monthNumber: any;
  maxYear: any;
  minYear: any;
  saveDaysMonthList: any;
  tempMonth: any;
  dateList: any;
  selectedYear: number;
  ddMonth: number;
  attendanceInfo: any = null;
  noRecord: boolean = false;
  defaultMsg: string = 'To check date description, select specific date.';
  detailsIcon: string = "assets/img/select-date.png";
  totalDaysInMonth: any = [];
  yearWiseHolidayList: any=[];
  FixedHolidays: any=[];
  OptionalHolidays: any=[];
  WeekoffHolidays: any=[];
  constructor(public zone:NgZone,public spinnerService: Ng4LoadingSpinnerService, private _services: CommonService, private _storage: LocalStorageService) {
    this._services.titleMessageSource.next("Holiday List");
    this._services.getUserDetail().then((data)=>{
      this.localUserData = data;
      var d = new Date();
      this.maxYear = d.getFullYear() * 1+1;

     this.minYear = this.maxYear - 2;

      this.monthNumber = { 'January': '0', 'February': '1', 'March': '2', 'April': '3', 'May': '4', 'June': '5', 'July': '6', 'August': '7', 'September': '8', 'October': '9', 'November': '10', 'December': '11' };





      $(document).ready(function () {
        if ($('.mydatepicker').prop('type') != 'date') {
          $('.mydatepicker').datepicker();
        }
      });
    })
  }

  ngOnInit() {
    this.getServerdate();
    this.getYearWiseHolidaysList()

  }

  async getYearWiseHolidaysList(){
    const url = Constant.getHolidaysInYear;


     const param = JSON.stringify({
       "tokenid": this.localUserData.TokenId,
       // "tokenid": this._storage.get('username').TokenId,

     });

     console.log('Param', param);

     this.spinnerService.show();
       this._services.postService(url, param)
       .then( async(response: any) => {
        this.FixedHolidays = response.FixedHolidays;
        this.OptionalHolidays = response.OptionalHolidays;
        this.WeekoffHolidays = await this.getWeeklyHoliday();// response.WeekoffHolidays
        console.log('response.data',response);
       });
  }

  async getWeeklyHoliday(){
    const url = Constant.GetWeekOffHolidayCalender;
    const req = {
      "tokenid": this.localUserData.TokenId
    }
    const resp = await this._services.postService(url, req);
    return resp;
    return [
        {
          "HolidayDate":"2019-01-26T00:00:00",
          "HolidayDescription":"Republic Day"
        },
        {
          "HolidayDate":"2019-04-06T00:00:00",
          "HolidayDescription":"Gudi Padwa"
        },
        {
          "HolidayDate":"2019-04-13T00:00:00",
          "HolidayDescription":"Ram Navami"
        },
        {
          "HolidayDate":"2019-04-14T00:00:00",
          "HolidayDescription":"Dr Babasaheb Ambedkar Jayanti"
        },
        {
          "HolidayDate":"2019-05-18T00:00:00",
          "HolidayDescription":"Buddha Pournima"
        },
        {
          "HolidayDate":"2019-08-17T00:00:00",
          "HolidayDescription":"Parsi New Year"
        },
        {
          "HolidayDate":"2019-10-27T00:00:00",
          "HolidayDescription":"Diwali (Laxmi Pujan)"
        },
        {
          "HolidayDate":"2019-11-10T00:00:00",
          "HolidayDescription":"Id-E-Milad"
        }
      ]
  }


  getDay(HolidayDate, HolidayDay){
    if (HolidayDay) {
      return HolidayDay;
    }
    var days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var d = new Date(HolidayDate);
    var dayName = days[d.getDay()-1];
    return dayName
  }
  getHolidays(month, year){
    const url = Constant.MonthAttendanceNew;

     this.yearWiseHolidayList = [];

      const param = JSON.stringify({
        "month": month,
        "year": year,
        "tokenid": this.localUserData.TokenId,
        // "tokenid": this._storage.get('username').TokenId,

      });

      console.log('Param', param);

      this.spinnerService.show();


        this._services.postService(url, param)
        .then((response: any) => {
          console.log('response.data', response.data);


          this.getHolidayList(response.data, 'fromStart');

        });




  }

  getYearWiseHolidays(){
    let month;
  const fiscalMonth = [];
    for(let i=4;i<=15;i++){
      if(i<12){
        month = i
        fiscalMonth.push({'month':month,'year':this.year})
       // this.getHolidays(month, this.year)

      }else if(i==12){
       // this.getHolidays(i, this.year)
        fiscalMonth.push({'month':i,'year':this.year})

        month =1;
      }else if(i>12){
        fiscalMonth.push({'month':month,'year':this.year})

      //  this.getHolidays(month, this.year+1)
        month++
      }
    }

    fiscalMonth.forEach((obj)=>{
     console.log('getHolidays', obj.month, obj.year);

      this.getHolidays(obj.month, obj.year)


    })


  }

  refreshCalender(year, month, startDate) {
    this.get_calendar(year, month);
  }

  getServerdate() {
    const url = Constant.getServerDateTime;
    //this.spinnerService.show();
    this._services.getService(url).then((data) => {
      //this.spinnerService.hide();

      this.serverCurrentdate = data;
      if (data != null) {
        this.startDate = moment(this.serverCurrentdate).date();
        this.month = moment(this.serverCurrentdate).month();
        this.year = moment(this.serverCurrentdate).year();
        // this.weekArray = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        this.weekArray = [ 'S' , 'M', 'T', 'W', 'T', 'F', 'S'];


       // this.getYearWiseHolidays();

        this.get_calendar(this.year, this.month);


      }
    });
  }

  get_calendar(year, month) {

    this.tempMonth = month;
    var calendarDateValue = moment(this.serverCurrentdate).format("YYYY-MM-DD");
    var vm = this;

    var getDateMonthCall = function () {
      vm.getMonthDate(vm.startWeek, vm.endWeek, {
        y: year,
        M: month
      }, calendarDateValue);
      // vm.calendarEventDate =
    };

    this.startWeek = moment({ y: year, M: month }).startOf('month').get('isoWeek');
    this.endWeek = moment({ y: year, M: month }).endOf('month').get('isoWeek');
    this.getCalendarEvent(calendarDateValue, month, year, getDateMonthCall);
  }

  //generate calendar

  getMonthDate(startweek, endWeek, momentYear, calendarDate) {
    this.currentMonth = momentYear.M;
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

    for (let i = startweek; i <= endWeek + 1; i++) {
      this.monthDate.push([Array(7).fill(0).map((n, j) => moment(momentYear).set('week', i).startOf('week').clone().add(n + j, 'day').toDate())]);
    }

    for (let c = 0; c < this.monthDetail.length; c++) {
      var check = moment(this.monthDetail[c].AttendanceDate, 'YYYY/MM/DD');
      var day = check.format('D');
      this.monthDetail[c].date = day;
    }

    //combine attendance with response

    for (let j = 0; j < this.monthDate.length; j++) {
      this.calendarWeek = [];
      let event: any;
      for (let k = 0; k < this.monthDate[j][0].length; k++) {
        const date = this.monthDate[j][0][k];
        let currDate = 'no-current-date';
        if (momentYear.M != this.monthDate[j][0][k].getMonth()) {
          currDate = "muted";
        }

        let finddtt = moment(this.monthDate[j][0][k]).format('YYYY-MM-DDT00:00:00');
        let calendarIndex = this.monthDetail.findIndex((x) => x.AttendanceDate == finddtt);

      if ((calendarIndex == 0 || calendarIndex != false) && calendarIndex != -1) {

          event = this.monthDetail[calendarIndex];
        }
        else if (calendarIndex === false) {
          event = null;
        }
        if (moment(moment(this.monthDate[j][0][k]).format('YYYY-MM-DD')).diff(moment(this.serverCurrentdate).format('YYYY-MM-DD')) === 0) {
          currDate = "currentDate";
        }

        let flag: boolean;

        if (parseInt(this.monthDate[j][0][k].getMonth()) === parseInt(momentYear.M)) {
          flag = true;
         }else {
          flag = false;
        }

        if (event) {
          this.calendarWeek.push({
             attendance_date: event,
             cdate: date, currentDate: currDate,
             monthData: parseInt(this.monthDate[j][0][k].getMonth()),
             dateflag: flag });
        }
      }
      this.calendarDate.push(this.calendarWeek);
      console.log('CALEEEEEEEEEEEEEEEE', this.calendarDate);

    }

    function inArray(needle, monthDetail:[any]) {
      //var length = haystack.length;

      const foundObj = monthDetail.findIndex(obj => new Date(obj.AttendanceDate) === new Date( needle));

      console.log("FOOOOOOOOOOOOOOOOOOOOOOO",foundObj)

      for (var i = 0; i < monthDetail.length; i++) {

        if ( new Date( monthDetail[i].AttendanceDate ) === new Date( needle)) { return i; }
      }
      return false;
    }

    if (this.monthWiseHolidays.length > 0) {
      this.holidayCount = this.monthWiseHolidays.length;

    }
  }


  getCalendarEvent(calendarDateValue, month, year, getDateMonthCall) {
    const url = Constant.MonthAttendanceNew;

    const temp_month = parseInt(this.tempMonth) + 1;
    //let temp_month = parseInt(month) + 1;

     this.saveDaysMonth = moment(temp_month, 'MM').format('MMMM') + ' ' + this.year;
     this.saveDaysMonthList = moment(temp_month, 'MM').format('MMMM') + ' ' + this.year;

    // this.saveDaysMonth = moment(temp_month, 'MM').format('MMMM') + ' ' + year;
    // this.saveDaysMonthList = moment(temp_month, 'MM').format('MMMM') + ' ' + year;

    const param = JSON.stringify({
      "month": temp_month,
      "year": year,
      "tokenid": this.localUserData.TokenId,
      // "tokenid": this._storage.get('username').TokenId,

    });
    this.spinnerService.show();
    this._services.postService(url, param)
      .then((response: any) => {
        this.spinnerService.hide();
        this.showInfo = true;
        this.toggleButton = true;
        this.monthWiseHolidays = [];
        this.monthDetail = response.data;

        this.getHolidayList(this.monthDetail,'');

            this.applyDateAll();
           getDateMonthCall();


      }, (error) => {
        this.spinnerService.hide();
        // this._services.showSnackbar();
        this.showInfo = true;

      });
  }

  previousMonth() {
    this.toggleButton = false;
    this.startDate = moment(this.serverCurrentdate).subtract(1, 'months').toDate();
    this.serverCurrentdate = this.startDate;
    var mstartDate = moment(this.startDate);
    this.refreshCalender(mstartDate.get('year'), mstartDate.get('month'), this.startDate);

    this.selectedMonth = mstartDate.get('month') + 1;

    // this.attendanceInfo = null;
    this.holidayCount = 0;
  }

  nextMonth() {
    this.toggleButton = false;
    this.startDate = moment(this.serverCurrentdate).add(1, 'months').toDate();
    this.serverCurrentdate = this.startDate;
    var mstartDate = moment(this.startDate);
    this.refreshCalender(mstartDate.get('year'), mstartDate.get('month'), this.startDate);

    this.selectedMonth = mstartDate.get('month') + 1;

    // this.attendanceInfo = null;
    this.holidayCount = 0;
  }

  getHolidayList(monthDetail, flag) {
    for (let i = 0; i < monthDetail.length; i++) {

      if (monthDetail[i].HolidayDescription != '' && (monthDetail[i].IsHoliday || monthDetail[i].isOptionalHoliday) && monthDetail[i].HolidayDescription != null) {
        this.monthWiseHolidays.push({
          date: monthDetail[i].AttendanceDate,
          holidaydesc: monthDetail[i].HolidayDescription,
          holidayType: monthDetail[i].Status
        });

        if(flag == 'fromStart'){
          this.yearWiseHolidayList.push({
            date: monthDetail[i].AttendanceDate,
            holidaydesc: monthDetail[i].HolidayDescription,
            holidayType: monthDetail[i].Status
          })

        }



      }
    //   ('OOOOO', this.monthWiseHolidays);

    }

  }


  ngOnDestroy() {
    // this._services.spinnerService.hide();
  }


  applyDateAll() {
    setTimeout(() => {
      var self = this;
      var dateformat = self.saveDaysMonth.split(' ');
      dateformat[0] = self.monthNumber[dateformat[0]];
      var currentDate = new Date();
      console.dir(currentDate);
      if (self.saveDaysMonth !== " ") {
        $('.startDateAll').val(self.saveDaysMonth);
      }
      console.dir(self.saveDaysMonth);

      //var defaultDate = new Date('1/12/2019');

      $(document).ready(function () {
       //  ('LOGGGGGGGGGGGGGGGGGGGGGG',);
        const minYear = self.minYear;
        const maxYear  = self.maxYear
        $(".imageclick").on("click", function (e) {
          $('.startDateAll').datepicker('show');
        });

        $('.startDateAll').datepicker({
          changeMonth: true,
          changeYear: true,
          showButtonPanel: true,
          dateFormat: 'MM yy',
          yearRange: minYear + ':' + maxYear,
         // maxDate: '0',
          // defaultDate: defaultDate ,
          beforeShow: function (input, inst) {
            console.dir(self.saveDaysMonth);
            var dateformat1 = self.saveDaysMonth.split(' ');
            dateformat1[0] = self.monthNumber[dateformat1[0]];
            var string = dateformat1[0] * 1 + 1 + '/' + '01' + '/' + dateformat1[1];
            var defaultDate = new Date(string);
            $(this).datepicker("option", "defaultDate", defaultDate);
            $('.startDateAll').val(self.saveDaysMonth);
          },
          onClose: function (dateText, inst) {

            var date = $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
            date = date[0].value;
            // $("#startDate1").datepicker("option", "defaultDate", date);
            console.dir(date);
            console.dir(self.saveDaysMonth);
            if (date == self.saveDaysMonth) {
              return false;
            }
            date = date.split(' ')
            //  self.DatePickerMethod(date[1], self.monthNumber[date[0]]);
            self.get_calendar(inst.selectedYear, inst.selectedMonth)
            //self.getMonthAttendance=$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1))[0].value;
            self.saveDaysMonth = $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1))[0].value;
          }
        });
        $.datepicker._gotoToday = function(id) {
          $(id).datepicker('setDate', new Date()).datepicker('hide').blur();
       };
      });
    }, 0)

  }
}
