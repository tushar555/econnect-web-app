import { LocalStorageService } from "ngx-store";
import { CommonService } from "./../../services/common.service";
import { Component, ViewChild, NgZone, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import {} from "googlemaps";
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
  selector: "app-admin-list-view-details",
  templateUrl: "./admin-list-view-details.component.html",
  styleUrls: ["./admin-list-view-details.component.scss"]
})
export class AdminListViewDetailsComponent {
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
  searchItem: any;
  //isMarkAttendanceAllowed: any = true;
  constructor(
    private _services: CommonService,
    public cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private _storage: LocalStorageService,
    public spinnerService: Ng4LoadingSpinnerService,
    public formBuilder: FormBuilder
  ) {}
}
