import { Component, OnInit, Renderer2 } from '@angular/core';
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

  printContent$: Observable<Array<string>>;

  date: [Date, Date] = [
    new Date(new Date().setDate(new Date().getDate() - 31)),
    new Date(),
  ];

  oldEvent: any = null;

  constructor(
    private zReportService: ZReportService,
    private titleService: Title,
    private renderer: Renderer2
  ) {
    this.titleService.setTitle('Список змiн');
    this.zReprots = this.zReportService.zReprots;
    this.count = this.zReportService.count;
    this.loading = this.zReportService.loading;
    this.printContent$ = this.zReportService.contentForPrint$;
    this.zReportService.getReceipts({
      dateTime: this.date[0],
      toDateTime: this.date[1],
      skip: 0,
      take: 20,
    });
    this.oldEvent = {
      dateTime: this.date,
      toDateTime: this.date,
      skip: 0,
      take: 20,
    };
  }

  ngOnInit(): void {}

  loadZReports(event: any): void {
    this.zReportService.getReceipts({
      dateTime: this.date[0],
      toDateTime: this.date[1],
      skip: event.first,
      take: event.rows,
    });
    this.oldEvent = {
      dateTime: this.date,
      toDateTime: this.date,
      skip: event.first,
      take: event.rows,
    };
  }

  onDateChange(event: [Date, Date]): void {
    this.date = event;
    if (!event[0] || !event[1]) {
      return;
    }
    this.zReportService.getReceipts({
      dateTime: this.date[0],
      toDateTime: this.date[1],
      skip: 0,
      take: 20,
    });
    this.oldEvent = {
      dateTime: this.date,
      toDateTime: this.date,
      skip: 0,
      take: 20,
    };
  }

  print(): void {
    this.zReportService.print(this.renderer);
  }

  showReceipt(shiftId: number): void {
    this.zReportService.getContentForPrint$(shiftId).subscribe((res) => {
      this.visibleZReport = true;
    });
  }
}
