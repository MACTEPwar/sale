import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { ZReportsComponent } from './z-reports/z-reports.component';
import { ReportRoutingModule } from './report-router.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [ReportComponent, ReceiptsComponent, ZReportsComponent],
  imports: [CommonModule, ReportRoutingModule, TableModule, ButtonModule],
})
export class ReportModule {}
