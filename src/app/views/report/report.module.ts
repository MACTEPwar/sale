import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { ZReportsComponent } from './z-reports/z-reports.component';
import { ReportRoutingModule } from './report-router.module';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [ReportComponent, ReceiptsComponent, ZReportsComponent],
  imports: [CommonModule, ReportRoutingModule, TableModule],
})
export class ReportModule {}
