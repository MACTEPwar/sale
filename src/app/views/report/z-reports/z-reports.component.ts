import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { TZReport, ZReportService } from './z-report.service';

@Component({
  selector: 'app-z-reports',
  templateUrl: './z-reports.component.html',
  styleUrls: ['./z-reports.component.scss'],
  providers: [ZReportService],
})
export class ZReportsComponent implements OnInit {
  visibleZReport = false;

  zReprots: Observable<Array<TZReport>>;
  count: Observable<number>;
  loading: Observable<boolean>;

  date: Date = new Date();

  oldEvent: any = null;

  constructor(
    private zReportService: ZReportService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Список змiн');
    this.zReprots = this.zReportService.zReprots;
    this.count = this.zReportService.count;
    this.loading = this.zReportService.loading;
    this.zReportService.getReceipts({
      dateTime: this.date,
      skip: 0,
      take: 20,
    });
    this.oldEvent = {
      dateTime: this.date,
      skip: 0,
      take: 20,
    };
  }

  ngOnInit(): void {}

  loadZReports(event: any): void {
    this.zReportService.getReceipts({
      dateTime: this.date,
      skip: event.first,
      take: event.rows,
    });
    this.oldEvent = {
      dateTime: this.date,
      skip: event.first,
      take: event.rows,
    };
  }

  onDateChange(event: Date): void {
    this.date = event;
    this.zReportService.getReceipts({
      dateTime: this.date,
      skip: 0,
      take: 20,
    });
    this.oldEvent = {
      dateTime: this.date,
      skip: 0,
      take: 20,
    };
  }
}
