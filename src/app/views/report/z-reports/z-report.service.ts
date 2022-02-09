import { TNullable } from './../../../shared/types/types/t-nullabel';
import { Injectable, Renderer2 } from '@angular/core';
import { PrinterService, QueryService } from '@common/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ZReportService {
  zReprots: BehaviorSubject<Array<TZReport>> = new BehaviorSubject<
    Array<TZReport>
  >([]);
  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  contentForPrint$: BehaviorSubject<Array<string>> = new BehaviorSubject<
    Array<string>
  >([]);

  constructor(
    private queryService: QueryService,
    private printerService: PrinterService
  ) {}

  getReceipts(filter: TZReportFilter): void {
    this.loading.next(true);
    this.queryService
      .post(
        `${
          environment.apiUrl
        }/api/reports/list?dateTime=${filter.dateTime.toISOString()}&toDateTime=${filter.toDateTime.toISOString()}`,
        {
          skip: filter.skip,
          take: filter.take,
        }
      )
      .pipe(
        map((m: any) => m.data),
        take(1)
      )
      .subscribe((data) => {
        this.zReprots.next(data.Value);
        this.count.next(data.Key);
        this.loading.next(false);
      });
  }

  print(renderer: Renderer2): void {
    this.printerService.clearPrintBlank();
    this.contentForPrint$.getValue().forEach((str: string) => {
      this.printerService.addTextToPrint(renderer, str);
    });
    this.printerService.test_print();
  }

  getContentForPrint$(shiftId: TNullable<number> = null): Observable<any> {
    return this.queryService
      .get(`${environment.apiUrl}/api/service/zreport/${shiftId}`)
      .pipe(
        map((m: any) => m.data),
        tap((_) => {
          this.contentForPrint$.next(_.data);
        })
      );
  }
}

export type TZReport = {
  id: string;
  fiscalNumber: number;
  shiftId: number;
  dateCreate: Date;
};

export type TZReportFilter = {
  dateTime: Date;
  toDateTime: Date;
  skip: number;
  take: number;
};
