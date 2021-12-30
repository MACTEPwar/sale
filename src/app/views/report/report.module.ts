import { ReceiptModule } from './../../components/receipt/receipt.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { ZReportsComponent } from './z-reports/z-reports.component';
import { ReportRoutingModule } from './report-router.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [ReportComponent, ReceiptsComponent, ZReportsComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    DialogModule,
    ReceiptModule,
  ],
})
export class ReportModule {}
