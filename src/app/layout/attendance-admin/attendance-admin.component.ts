import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ExportToCsv } from 'export-to-csv';


@Component({
  selector: 'app-attendance-admin',
  templateUrl: './attendance-admin.component.html',
  styleUrls: ['./attendance-admin.component.scss']
})
export class AttendanceAdminComponent implements OnInit {

  empAttendanceDetails:any;
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'My Awesome CSV',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };
  constructor(private _services: CommonService) {
    this._services.titleMessageSource.next('Attendance Admin');
    this.getDetails();
  }

  getDetails(){
    this.empAttendanceDetails = [{
      'empCode': '23105693',
      'empName': 'Prashant Chavhan',
      'Date': '23/01/2019',
      'Day': 'Moday',
      'System_Punch_In': '00:00:00',
      'System_Punch_Out': '00:00:00',
      'Punch_In_Source': 'Weconnect',
      'Time_In': '00:00:00',
      'Time_Out': '00:00:00',
      'hrs': '00:00:00',
      'Status': 'NA'
    },
    {
      'empCode': '23105693',
      'empName': 'Prashant Chavhan',
      'Date': '23/01/2019',
      'Day': 'Moday',
      'System_Punch_In': '00:00:00',
      'System_Punch_Out': '00:00:00',
      'Punch_In_Source': 'Weconnect',
      'Time_In': '00:00:00',
      'Time_Out': '00:00:00',
      'hrs': '00:00:00',
      'Status': 'NA'
    },
    {
      'empCode': '23105693',
      'empName': 'Prashant Chavhan',
      'Date': '23/01/2019',
      'Day': 'Moday',
      'System_Punch_In': '00:00:00',
      'System_Punch_Out': '00:00:00',
      'Punch_In_Source': 'Weconnect',
      'Time_In': '00:00:00',
      'Time_Out': '00:00:00',
      'hrs': '00:00:00',
      'Status': 'NA'
    },
    {
      'empCode': '23105693',
      'empName': 'Prashant Chavhan',
      'Date': '23/01/2019',
      'Day': 'Moday',
      'System_Punch_In': '00:00:00',
      'System_Punch_Out': '00:00:00',
      'Punch_In_Source': 'Weconnect',
      'Time_In': '00:00:00',
      'Time_Out': '00:00:00',
      'hrs': '00:00:00',
      'Status': 'NA'
    },
    {
      'empCode': '23105693',
      'empName': 'Prashant Chavhan',
      'Date': '23/01/2019',
      'Day': 'Moday',
      'System_Punch_In': '00:00:00',
      'System_Punch_Out': '00:00:00',
      'Punch_In_Source': 'Weconnect',
      'Time_In': '00:00:00',
      'Time_Out': '00:00:00',
      'hrs': '00:00:00',
      'Status': 'NA'
    },
    {
      'empCode': '23105693',
      'empName': 'Prashant Chavhan',
      'Date': '23/01/2019',
      'Day': 'Moday',
      'System_Punch_In': '00:00:00',
      'System_Punch_Out': '00:00:00',
      'Punch_In_Source': 'Weconnect',
      'Time_In': '00:00:00',
      'Time_Out': '00:00:00',
      'hrs': '00:00:00',
      'Status': 'NA'
    }]
  }

  exportCSV() {
    if (this.empAttendanceDetails) {
      const csvExporter = new ExportToCsv(this.options);

      csvExporter.generateCsv(this.empAttendanceDetails);
    }
  }

  ngOnInit() {
  }

}
