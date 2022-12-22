import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, Pipe, Renderer2 } from '@angular/core';
import { PreloaderService, PrinterService, QueryService } from '@common/core';
import { environment } from 'src/environments/environment';
import { map, take, tap } from 'rxjs/operators';
@Injectable()
export class PeriodReportService {
  contentForPrint$: BehaviorSubject<Array<string>> = new BehaviorSubject<
    Array<string>
  >([]);

  constructor(
    private queryService: QueryService,
    private printerService: PrinterService,
    private preloaderService: PreloaderService
  ) {}

  getEcrsList$(): Observable<any> {
    return this.queryService
      .get(`${environment.apiUrl}/api/reports/ecrsList`)
      .pipe(
        take(1),
        map((m) => m.data)
      );
  }

  getPeriodReport$(filter: any): Observable<any> {
    this.preloaderService.setLoader(true);
    return this.queryService
      .get(
        `${
          environment.apiUrl
        }/api/reports/periodReport?fromDt=${filter.fromDate.toISOString()}&toDt=${filter.toDate.toISOString()}&fiscalNumber=${
          filter.fiscalNumber
        }`
      )
      .pipe(
        take(1),
        map((m: any) => m.data),
        tap(
          (_) => {
            this.contentForPrint$.next(_.data);
          },
          () => {},
          () => {
            this.preloaderService.setLoader(false);
          }
        )
      );
  }

  print(renderer: Renderer2): void {
    this.printerService.clearPrintBlank();
    this.contentForPrint$.getValue().forEach((str: string) => {
      this.printerService.addTextToPrint(renderer, str);
    });
    this.printerService.test_print();
  }
}
