import { environment } from '../../environments/environment';

export class Constant {

  public static BASE_URL = ''; //For static/local json files
  public static base_url = environment.API_URL;//'https://mmfss-econnectweb.azurewebsites.net/api/'; // UAT
  //public static base_url = "https://mmfslweconnect.azurewebsites.net/api/"; //Production

  public static embedMapApiKey = 'AIzaSyCW7dI5cvBn9V2hctlTS3Xl_HmLZ33b3eI';
  public static embedMapURL = `https://www.google.com/maps/embed/v1/search?key=${Constant.embedMapApiKey}&zoom=18`;

  public static dashboard = Constant.BASE_URL + 'assets/data/menu.json';
  public static sidemenu_url = Constant.BASE_URL + 'assets/data/sidemenu.json';
  public static lta = Constant.BASE_URL + 'assets/data/lta.json';
  public static getCurrentDateInfo = Constant + '';

  //Authentication
  public static userAuthentication = Constant.base_url + 'Account/Authenticate';
  public static ssoAuth = Constant.base_url + 'Account/authenticateSSO';
  //public static getIP = 'http://api.ipify.org/?format=json';
  public static Logout = Constant.base_url + 'Account/Logout';
  public static SetPin = Constant.base_url + 'Account/SetPin';
  public static CheckPinLogin = Constant.base_url + 'Account/CheckPinLogin';

  //Attendance
  public static GetWeekOffHolidayCalender = Constant.base_url + 'Attendance/GetWeekOffHolidayCalender';
  public static getHolidaysInYear = Constant.base_url + 'Attendance/getHolidaysInYear';
  public static marksCheckInAttendance = Constant.base_url + 'Attendance/AttendenceAppPunch';
  public static MonthWiseAttendance = Constant.base_url + 'Attendance/GetMonthAttendance';
  public static MonthAttendanceNew = Constant.base_url + 'Attendance/GetMonthAttendanceNew';
  public static getEmpAttendanceMonthWeek = Constant.base_url + 'Attendance/getEmpAttendanceMonthWeek';
  public static approveAttendance = Constant.base_url + 'Attendance/ManagerApproveReject';
  public static getServerDateTime = Constant.base_url + 'Attendance/GetServerDateTime';
  public static getPunchData = Constant.base_url + 'Attendance/getPunchData';
  public static getPunchDataForApp = Constant.base_url + 'Attendance/getPunchDataForApp';
  public static getDayAttendance = Constant.base_url + 'Attendance/GetDayAttendance';
  public static GetPendingAttendance = Constant.base_url + 'Attendance/GetPendingAttendance';
  public static ApproveRejectAttendance = Constant.base_url + 'Attendance/ApproveRejectAttendance';
  public static regularizeAttendance = Constant.base_url + 'Attendance/InsertRegularizationData';
  public static GetUserNotification = Constant.base_url + 'Attendance/GetNotification';
  public static GetAttendanceweekly = Constant.base_url + 'Attendance/getEmpAttendanceWeekly';
  public static GetAdminAttendanceEmpSearch = Constant.base_url + 'Attendance/GetAdminAttendanceEmpSearch';

  //Income Tax
  public static GetTaxProjectionDocument = Constant.base_url + 'DMS/GetTaxProjectionDocument';
  public static getPincodes = `${Constant.base_url}IncomeTax/getPincodes`;
  public static GetITCalculatorLog = Constant.base_url + "IncomeTax/GetITCalculatorLog";
  public static InsertITCalculatorlog = Constant.base_url + 'IncomeTax/InsertITCalculatorlog';
  public static SubmitITCalculationbyToken = Constant.base_url + 'IncomeTax/SubmitITCalculationbyToken';
  public static getITCalculatorHeadsbyToken = Constant.base_url + 'IncomeTax/getITCalculatorHeadsbyToken';
  public static getITCalculator = Constant.base_url + 'IncomeTax/getITCalculator';
  public static incomeTax = Constant.base_url + 'IncomeTax/getIncomeTaxData';
  public static newIncomeTax = Constant.base_url + 'IncomeTax/getNewIncomeTaxData';
  public static submitIncomeTax = Constant.base_url + 'IncomeTax/submitIncomeTaxDeclarations';
  public static saveIncomeTax = Constant.base_url + 'IncomeTax/submitPreIncomeTaxDeclaration';
  public static hraExemption = Constant.base_url + 'IncomeTax/submitHRAExemption';
  public static simulationList = Constant.BASE_URL + 'assets/data/temp-SectionList.json';
  public static AdminGetAllDeclarations = Constant.base_url + 'IncomeTax/AdminGetAllDeclarations';
  public static AdminGetAllFlexiDeclarations = Constant.base_url + 'Flexi/AdminGetAllDeclarations';
  public static SubmitITProofs = Constant.base_url + 'IncomeTax/SubmitITProofs';
  public static SubmitITDeclarationDetails = Constant.base_url + 'IncomeTax/SubmitITDeclarationDetails';
  public static SubmitIncomeTaxDeclarations = Constant.base_url + 'IncomeTax/SubmitIncomeTaxDeclarations';
  public static SubmitIncomeTaxSimulations = Constant.base_url + 'IncomeTax/SubmitIncomeTaxSimulations';
  public static getIncomeTaxSimData = Constant.base_url + 'IncomeTax/getIncomeTaxSimData';
  public static DeleteITDeclarations = Constant.base_url + 'IncomeTax/DeleteITDeclarations';
  public static SimulationDeclarationCheck = Constant.base_url + 'IncomeTax/SimulationDeclarationCheck';
  public static getITLogs = Constant.base_url + 'IncomeTax/getITLogs';
  public static getNewIncomeTaxDataLastYear = `${Constant.base_url}IncomeTax/getNewIncomeTaxDataLastYear`;
  public static GetAttendanceAdminReport = Constant.base_url + 'Attendance/GetAttendanceAdminReport';
  public static getITReport = Constant.base_url + 'IncomeTaxReports/getITReport';
  public static GetBankPAN = Constant.base_url + 'IncomeTax/GetBankPAN';
  public static UpdateITRegimeType = `${Constant.base_url}IncomeTax/UpdateITRegimeType`;
  public static AdminApproveRejectDeclarations = Constant.base_url + 'IncomeTax/AdminApproveRejectDeclarations';
  public static imcomeTaxEmployeeSearch = Constant.base_url + 'IncomeTax/EmployeeSearch';
  public static AdminGetDeclarationsByToken = Constant.base_url + 'IncomeTax/AdminGetDeclarationsByToken';
  public static getITAdminDeclarations = Constant.base_url + 'IncomeTax/getITAdminDeclarations';
  public static GetITSchedule = Constant.base_url + 'IncomeTax/GetITSchedule';
  public static UpdateITSchedule = Constant.base_url + 'IncomeTax/UpdateITSchedule';
  public static getITReportSAP = Constant.base_url + 'IncomeTaxReports/getITReportSAP';

  // Appraisal
  public static AppraisalLetter = Constant.base_url + 'Appraisal/GetAppraisalLetter';

  // Profile
  public static GetBasicProfile = Constant.base_url + 'Employee/GetBasicProfile';
  public static UpdateUserProfile = Constant.base_url + 'Employee/SubmitBasicProfile';

  // Salary Card
  public static getMonthwiseSalaryCard = Constant.base_url + 'SalaryCard/getMonthwiseSalaryCard';
  public static getSalaryCarddata = Constant.base_url + 'SalaryCard/getSalaryCard';
  public static getSalarySlip = Constant.base_url + 'SalaryCard/getSalarySlip';
  public static getLTASummary = Constant.base_url + 'SalaryCard/getLTASummary';

  // Hospital
  public static hospital = Constant.base_url + 'Hospital/GetHospitalList';
  public static hospital_local = Constant.BASE_URL + 'assets/data/hospital.json';
  public static employeeSearch = Constant.base_url + 'Employee/EmployeeSearch';
  public static getEmergencyContact = Constant.base_url + 'Employee/GetEmergencyContacts';

  // FeedBack
  public static GetFeedbackQuestions = Constant.base_url + 'FeedbackQuestions/GetFeedbackQuestions';
  public static SubmitFeedback = Constant.base_url + 'Feedback/SubmitFeedback';

  // Flexi
  public static AdminFlexiApproveRejectDeclarations = Constant.base_url + 'Flexi/AdminApproveRejectDeclarations';
  public static GetFlexiComponentsCompName = Constant.base_url + 'Flexi/getAllCompany';
  public static GetFlexiComponentsEmpName = Constant.base_url + 'Flexi/getEmpIdGradeCompany';
  public static GetAdminFlexiComponentsEmpName = Constant.base_url + 'Flexi/getEmpByToken';
  public static GetAdminFlexiComponentsEmpLogs = Constant.base_url + 'Flexi/getFlexiLogByToken';
  public static GetFlexiComponentsGradeName = Constant.base_url + 'Flexi/getEmpGradeCompany';
  public static GetFlexiComponentsSubmitFlexi = Constant.base_url + 'Flexi/SubmitFlexiMapping';
  public static GetFlexiComponentsConfig = Constant.base_url + 'Flexi/getAllFlexiMapping';
  public static AdminGetFlexiComponents = Constant.base_url + 'Flexi/AdminGetDeclarationsByToken';
  public static GetFlexiComponents = Constant.base_url + 'IncomeTax/getFlexiComponents';
  public static SubmitFlexiDeclaration = Constant.base_url + 'IncomeTax/submitFlexiDeclaration';
  public static getITAdminFlexiDeclarations = Constant.base_url + 'Flexi/getFlexiAdminDeclarations';
  public static getFlexiList = Constant.base_url + 'Flexi/getAllFlexiMappingRule';
  public static AdminApproveRejectFlexiMapping = Constant.base_url + 'Flexi/ApproveRejectFlexiMappingRule';

// Salary Slip
  public static form16 = Constant.base_url + 'SalarySlip/GetForm16';

// Feedback
  public static GetGiftStatus = Constant.base_url + 'Feedback/GetGiftStatus';
  public static UpdateGiftStatus = Constant.base_url + 'Feedback/UpdateGiftStatus';

// Policy
  public static GetPolicies = Constant.base_url + 'Policy/GetPolicies';
}

export class EntityMaster {
  public static entityMaster = [
    {
      companyName: 'MIBL',
      companyCode: '1031'
    },
    {
      companyName: 'MRHFL',
      companyCode: '1032'
    },
    {
      companyName: 'MMFSL',
      companyCode: '1033'
    },
    {
      companyName: 'MAMC',
      companyCode: '1059'
    }
  ];
}

export class DropDownOptions {
  static adminReports = ['Transaction Details Report','HRA Report', 'House Property Report',
                          'Other Income Report','Previous Employment Report' ];
  static status =  ['Pending', 'Approved', 'Rejected'];
  static sapReports = [ '581', '584', '585', '586' ];
  /* [
    {
      key: 'pending',
      value: 'Pending'
    },
    {
      key: 'approved',
      value: 'Approved'
    },
    {
      key: 'rejected',
      value: 'Rejected'
    },
    {
      key: '1',
      value: 'Transaction Details Report'
    },
    {
      key: '2',
      value: 'HRA Report'
    },
    {
      key: '3',
      value: 'House Property Report'
    },
    {
      key: '4',
      value: 'Other Income Report'
    },
    {
      key: '5',
      value: 'Previous Employment Report'
    },
    {
      key: '581',
      value: '581'
    },
    {
      key: '584',
      value: '584'
    },
    {
      key: '585',
      value: '585'
    },
    {
      key: '586',
      value: '586'
    },
  ]; */
}
