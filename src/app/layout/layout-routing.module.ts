import { LayoutComponent } from "./layout.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../gaurd/auth.guard";
import { AdminGuard, ITEnabledGuard } from "../gaurd/app.guard";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "lta",
        canActivateChild: [AuthGuard],
        loadChildren:
          "./leave-travel-allowance/leave-travel-allowance.module#LeaveTravelAllowanceModule"
      },
      {
        path: "hospital",
        canActivateChild: [AuthGuard],
        loadChildren: "./hospital/hospital.module#HospitalModule"
      },
      {
        path: "currentpayslip",
        canActivateChild: [AuthGuard],
        loadChildren:
          "./current-pay-slip/current-pay-slip.module#CurrentPaySlipModule"
      },
      {
        path: "attendance",
        canActivateChild: [AuthGuard],
        loadChildren: "./attendance/attendance.module#AttendanceModule"
      },
      {
        path: "income-tax",
        canActivateChild: [AuthGuard, ITEnabledGuard],
        loadChildren: "./income-tax/income-tax.module#IncomeTaxModule"
      },
      {
        path: "salary-card",
        canActivateChild: [AuthGuard],
        loadChildren: "./salary-card/salary-card.module#SalaryCardModule"
      },
      {
        path: "holiday",
        canActivateChild: [AuthGuard],
        loadChildren: "./holiday/holiday.module#HolidayModule"
      },
      {
        path: "emergency",
        canActivateChild: [AuthGuard],
        loadChildren: "./emergency/emergency.module#EmergencyModule"
      },
      {
        path: "salarycard",
        canActivateChild: [AuthGuard],
        loadChildren: "./salary-card/salary-card.module#SalaryCardModule"
      },
      {
        path: "feedback",
        canActivateChild: [AuthGuard],
        loadChildren: "./feedback/feedback.module#FeedbackModule"
      },
      {
        path: "admin-IT",
        canActivateChild: [AuthGuard, AdminGuard, ITEnabledGuard],
        loadChildren: "./admin-income-tax/admin-income-tax.module#AdminIncomeTaxModule"
      },
      {
        path: "form16",
        canActivateChild: [AuthGuard],
        loadChildren: "./form16/form16.module#Form16Module"
      },
      {
        path: "appraisal-letter",
        canActivateChild: [AuthGuard],
        loadChildren: "./appraisal-letter/appraisal-letter.module#AppraisalLetterModule"
      },
      {
        path: "flexi",
        canActivateChild: [AuthGuard],
        loadChildren: "./flexi/flexi.module#FlexiModule"
      },
      {
        path: "admin-emp-declaration",
        canActivateChild: [AuthGuard, AdminGuard, ITEnabledGuard],
        loadChildren: "./admin-employee-declaration/admin-employee-declaration.module#AdminEmployeeDeclarationModule"
      },
      {
        path: "admin-empFlexi-declaration",
        canActivateChild: [AuthGuard],
        loadChildren: "./admin-employeeFlexi-declaration/admin-employeeFlexi-declaration.module#AdminEmployeeFlexiDeclarationModule"
      },
      {
        path: "admin-declaration-config",
        canActivateChild: [AuthGuard, AdminGuard, ITEnabledGuard],
        loadChildren: "./admin-declaration-config/admin-declaration-config.module#AdminDeclarationConfigModule"
      },
      {
        path: "admin-empFlexi-config",
        canActivateChild: [AuthGuard],
        loadChildren: "./admin-employeeFlexi-config/admin-employeeFlexi-config.module#AdminEmployeeFlexiConfigModule"
      },
      {
        path: "admin-flexi",
        canActivateChild: [AuthGuard],
        loadChildren: "./admin-flexi/admin-flexi.module#AdminFlexiModule"
      },
      {
        path: "admin-flexi-config",
        canActivateChild: [AuthGuard],
        loadChildren: "./admin-flexi-config/admin-flexi-config.module#AdminFlexiConfigModule"
      },
      {
        path: "admin-flexi-configExclude",
        canActivateChild: [AuthGuard],
        loadChildren: "./admin-employeeFlexi-configExclude/admin-employeeFlexi-configExclude.module#AdminEmployeeFlexiConfigExcludeModule"
      },
      {
        path: "my-profile",
        canActivateChild: [AuthGuard],
        loadChildren: "./my-profile/my-profile.module#MyProfileModule"
      },
      {
        path: "admin-attendance-details",
        canActivateChild: [AuthGuard],
        loadChildren: "./attendance-detail/attendance-detail.module#AttendanceDetailModule"
      },
      {
        path: "admin-attendance-approval",
        canActivateChild: [AuthGuard],
        loadChildren:
          "./admin-attendance-approval/admin-attendance-approval.module#AdminAttendanceApprovalModule"
      },
      {
        path: "Appraisal",
        canActivateChild: [AuthGuard],
        loadChildren: "./appraisal-letter/appraisal-letter.module#AppraisalLetterModule"
      },
      {
        path: "admin-attendance",
        canActivateChild: [AuthGuard],
        loadChildren: "./attendance-admin/attendance-admin.module#AttendanceAdminModule"
      },
      {
        path: "admin-list-view",
        canActivateChild: [AuthGuard],
        loadChildren: "./admin-list-view/admin-list-view.module#AdminListViewModule"
      },
      {
        path: "gift-acknowldge",
        canActivateChild: [AuthGuard],
        loadChildren: "./gift-acknowledge/gift-acknowledge.module#GiftAcknowledgeModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
