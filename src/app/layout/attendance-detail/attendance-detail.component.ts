import { Component, OnInit } from '@angular/core';
import { Constant } from './../../services/constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommonService } from './../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss']
})
export class AttendanceDetailComponent implements OnInit {
  attendanceDetail: any = [];
  isAll: boolean = false;
  errMsg: boolean = true;
  params: any;
  showdata: any;
  noMapAvailable: boolean;
  isPermissionSet: boolean;
  latitude: number;
  longitude: number;
  showDetails = false;
  latitudein: any;
  longitudein: any;
  lat_long_in: any;
  lat_long_out: any;
  latitudeout: any;
  longitudeout: any;
  tokenid: any;
  emptokenid: any;
  adminRemark: any;
  punchin: any;
  punchout: boolean;
  selectArrayCount: any = [];

  constructor(private _services: CommonService, public router: Router, public route: ActivatedRoute,
    public spinnerService: Ng4LoadingSpinnerService, public location: Location) {
    this._services.titleMessageSource.next('Attendance Details');
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        console.log(params, 'params');
        this.params = params;
        if (params) {
          this.tokenid = params['tokenid'];
          this.emptokenid = params['emptokenid'];
          this.getWeekly(params);
        }
        else {
          this.router.navigate(['/mfss/admin-attendance-approval']);
        }
      });
    console.log(this.params, ' this.params');
    //
    // this.localUserData.TokenId
    this.selectArrayCount = [];
  }
  formatlatlong(lat_long_in, lat_long_out, param) {
    this.latitudein = lat_long_in.split(':')[0];
    this.longitudein = lat_long_in.split(':')[1];
    this.latitudeout = lat_long_out.split(':')[0];
    this.longitudeout = lat_long_out.split(':')[1];
    this.getLatLong(this.latitudein, this.longitudein, 'in');
  }
  getLatLong(latitude, longitude, param) {
    console.log(latitude, '/long', longitude);
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    if (param == 'in') {
      this.punchin = true;
      this.punchout = false;
    }
    else if (param == 'out') {
      this.punchout = true;
      this.punchin = false;
    }
    $('#attaendancemapModal').modal('show');
    if (latitude == null || longitude == null) {
      console.log('No Punch In Or Punch Out Map Available');
      this.noMapAvailable = true;
    }
    else if (latitude !== null && longitude !== null) {
      if (navigator.geolocation) {

        const getId = 'attendancemap';

        const div = document.getElementById(getId);
        let mapFrame = `<iframe width="100%" height="90%" frameborder="0" style="border:0" src="${Constant.embedMapURL}&q=${latitude},${longitude}" allowfullscreen></iframe>`;
        div.innerHTML = mapFrame;
        /*        const map = new google.maps.Map(div, {
                  center: {
                    lat: latitude,
                    lng: longitude
                  },
                  zoom: 18,
                  draggable: false
                });
                const marker = new google.maps.Marker({
                  position: new google.maps.LatLng(latitude,longitude),
                  map: map,
                  title: 'You are here!'
                }); */
        // navigator.geolocation.getCurrentPosition((position) => {

        //   this.isPermissionSet = true;
        //   this.noMapAvailable = true;
        //   // this.latitude = latitude == 0? position.coords.latitude: parseFloat( latitude);
        //   // this.longitude = longitude == 0? position.coords.longitude: parseFloat( longitude);


        //   // console.log('THIS>', this.latitude);

        //   // console.log('THIS>', this.longitude);


        // }, (error) => {
        //  // this.setGeolocationErrorMsg(error);
        //   //$('#successModal').modal('show');
        // }, { enableHighAccuracy: true, maximumAge: 50000 });
      } else {
        //alert("Not set map");
      }
    }
  }
  ngOnInit() {
  }
  checkValue(event: any) {
    console.log(this.isAll, 'isAll', this.attendanceDetail);
    if (this.isAll) {
      this.attendanceDetail.forEach(element => {
        if (element.TimeIn !== null || element.TimeOut !== null) {
          element.IsChecked = true;
        }

      });
    }
    else {
      this.attendanceDetail.forEach(element => {
        element.IsChecked = false;
      });
    }
  }
  checkinnerValue(item) {

    if (item.TimeIn === null || item.TimeOut === null) {
      this._services.showSnackbar({ status: 'No Punch IN/Out data present.You cannot Approve this' })
      item.IsChecked = false;
      return;
    }
    let array = this.attendanceDetail.filter(
      book => book.IsChecked == false || book.IsChecked == undefined || book.IsChecked == null);

    this.selectArrayCount = array;
    if (array.length > 0) {
      this.isAll = false;
    }
    else {
      this.isAll = true;
    };

  }
  getWeekly(params) {
    //api/Attendance/getEmpAttendanceWeekly
    this._services.postService(Constant.GetAttendanceweekly, params)
      .then((data) => {
        console.log(data, 'data..');
        this.spinnerService.hide();
        if (data['data'].length > 0) {
          this.attendanceDetail = data['data'];
        }
        this.showDetails = true;

      })
  }
  openModal() {
    let data = this.attendanceDetail.filter(
      book => (book.IsChecked == true && book.ApprovalStatus === null));
    if (data.length > 0) {

    } else {
      this._services.showSnackbar({ status: 'Please select any one of the above' });
      return false;
    }

    $('#remarksModal').modal('show');
  }
  hideModal() {
    $('#remarksModal').modal('hide');
  }
  submitData(status) {

    let data = this.attendanceDetail.filter(
      book => (book.IsChecked == true && book.ApprovalStatus === null));
    if (data.length > 0) {
      data.forEach(element => {
        element.ApprovalStatus = status;
      });
      if (!this.adminRemark) {
        this.adminRemark = '';
      }
      let newdata = {
        'EmpTokenId': this.emptokenid,
        'TokenId': this.tokenid,
        'Remarks': this.adminRemark,
        'data': data
      }
      this.spinnerService.show();
      this._services.postService(Constant.approveAttendance, newdata)
        .then((response: any) => {
          this.getWeekly(this.params)
          console.log(response, 'response..');
          this.spinnerService.hide();
          this.hideModal();
        }, (error) => {
          //this.attendanceDetail=[];
          console.log(error.status);
          this.spinnerService.hide();
          this.hideModal();
        });
    }
    else {
      this._services.showSnackbar({ status: 'Please select any one of the above' });

    }

  }

  pageBack() {
    let params = { 'month': parseInt(this.params.month), 'year': parseInt(this.params.year) }
    this.router.navigate(['/mfss/admin-attendance-approval'], { queryParams: params })
  }

  isAllApproved() {
    console.log('this.attendanceDetail', this.attendanceDetail);

    function checkIfApproved(obj) {
      return obj.ApprovalStatus !== 'approved' && obj.ApprovalStatus !== 'rejected';
    }
    return this.attendanceDetail.some(checkIfApproved);
  }

  getHours(timeOut, timeIn) {
    let min = moment(timeOut).diff(moment(timeIn), 'minute');
    return Math.floor(min / 60) + ':' + min % 60;
  }
}
