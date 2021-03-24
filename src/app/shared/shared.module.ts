import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IncomeTaxSimulationComponent } from '../components/income-tax-simulation/income-tax-simulation.component';
import { ModalComponent } from "../components/modal/modal.component";
import { HeaderComponent } from "../components/header/header.component";
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDatepickerModule,
    InfiniteScrollModule
  ],
  declarations: [
    IncomeTaxSimulationComponent,
    HeaderComponent,
    ModalComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDatepickerModule,
    NgMultiSelectDropDownModule,
    InfiniteScrollModule,
    IncomeTaxSimulationComponent,
    HeaderComponent,
    ModalComponent
  ]
})
export class SharedModule { }
