import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2 } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { PrinterService, QueryService } from '@common/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ServiceService {
  /** Деньги в кассе */
  moneyInKassa: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  /** Состояние смены */
  shiftStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /** состояние ПРРО */
  isOnline$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**  */
  shopGroups$: BehaviorSubject<Array<{ id: string; name: string }>> =
    new BehaviorSubject<Array<{ id: string; name: string }>>([]);

  constructor(
    private queryService: QueryService,
    private printService: PrinterService
  ) {}

  getMoneyInKassa(): void {
    this.getMoneyInKassa$().subscribe((res) => {
      this.moneyInKassa.next(res);
    });
  }

  /**
   * Проверяет состояние смены
   */
  getShiftStatus(): void {
    this.getShiftStatus$().subscribe((res) => {
      this.shiftStatus$.next(res);
    });
  }

  /**
   * Проверяет состояние ПРРО
   */
  getEcrStatus(): void {
    this.getEcrStatus$().subscribe((res) => {
      this.isOnline$.next(res);
    });
  }

  doCashIn(sum: number): Observable<any> {
    return this.queryService
      .post(`${environment.apiUrl}/api/service/servicein`, { sum })
      .pipe(map((m: any) => m.data));
  }

  doCashOut(sum: number): Observable<any> {
    return this.queryService
      .post(`${environment.apiUrl}/api/service/serviceout`, { sum })
      .pipe(map((m: any) => m.data));
  }

  printZReport(render: Renderer2): void {
    this.getLastZReport$()
      .pipe(map((m) => m.data))
      .subscribe((res) => {
        this.printService.clearPrintBlank();
        res.data.forEach((str: string) => {
          this.printService.addTextToPrint(render, str);
        });
        this.printService.test_print();
      });
  }

  printLastReceipt(render: Renderer2): void {
    this.getLastReceipt$()
      .pipe(map((m) => m.data))
      .subscribe((res) => {
        this.printService.clearPrintBlank();
        res.data.forEach((str: string) => {
          this.printService.addTextToPrint(render, str);
        });
        if (res.link != null) {
          this.printService.addQrCode(render, res.link);
        }
        this.printService.test_print();
      });
  }

  doZReport$(): Observable<any> {
    return this.queryService.post(
      `${environment.apiUrl}/api/Service/dozreport`,
      {}
    );
  }

  doXReport(renderer: Renderer2): void {
    this.queryService
      .get(`${environment.apiUrl}/api/service/xreport`)
      .pipe(map((m) => m.data))
      .subscribe((res: any) => {
        this.getMoneyInKassa();
        this.getEcrStatus();
        this.getShiftStatus();

        if ((res.data as Array<string>).length > 0) {
          this.printService.clearPrintBlank();
          (res.data as Array<string>).forEach((str, ind) => {
            this.printService.addTextToPrint(renderer, str);
          });
          this.printService.test_print();
        }
      });
  }

  getShopGroups(): void {
    this.getShopGroups$()
      .pipe(map((m) => m.data))
      .subscribe((res) => this.shopGroups$.next(res));
  }

  private getLastZReport$(): Observable<any> {
    return this.queryService.get(
      `${environment.apiUrl}/api/Service/zreport/last`
    );
  }

  private getLastReceipt$(): Observable<any> {
    return this.queryService.get(
      `${environment.apiUrl}/api/Service/receipt/last`
    );
  }

  /**
   * Запрос на проверку состояние смены
   * @returns Observable<any>
   */
  private getShiftStatus$(): Observable<boolean> {
    return this.queryService
      .get(`${environment.apiUrl}/api/Service/shiftStatus`)
      .pipe(map((m) => m.data as boolean));
  }

  /**
   * Запрос на проверку состояние ПРРО
   * @returns Observable<any>
   */
  private getEcrStatus$(): Observable<boolean> {
    return this.queryService
      .get(`${environment.apiUrl}/api/ecr/status`)
      .pipe(map((m) => m.data as boolean));
  }

  private getMoneyInKassa$(): Observable<any> {
    return this.queryService
      .get(`${environment.apiUrl}/api/service/moneyInKassa`)
      .pipe(map((m) => m.data));
  }

  private getShopGroups$(): Observable<any> {
    return this.queryService.get(`${environment.apiUrl}/api/shopGroup/list`);
  }

  importProducts$(products: File, groupId: string): Observable<any> {
    const formData = new FormData();

    formData.append('products', products);
    formData.append('groupId', groupId);

    return this.queryService
      .post(
        `${environment.apiUrl}/api/barPrice/import`,
        formData,
        {},
        'multipart'
      )
      .pipe(map((m) => m.data));
  }

  /* TERM */

  purchase$(terminalIndex: number, amount: number): Observable<any> {
    return this.queryService.post(
      `${environment.terminalUrl}/api/Terminal/purchase`,
      { terminalIndex, amount }
    );
  }

  getListTerminals$(): Observable<any> {
    return this.queryService
      .get(`${environment.terminalUrl}/api/Terminal/listTerminals`)
  }

  void$(terminalIndex: number, invoiceNumber: string): Observable<any> {
    return this.queryService.post(
      `${environment.terminalUrl}/api/Terminal/void`,
      { terminalIndex, invoiceNumber }
    );
  }

  xReportTreminal(index: number): Observable<any> {
    return this.queryService.post(
      `${environment.terminalUrl}/api/Terminal/xreport/${index}`,
      {}
    );
  }

  zReportTreminal(index: number): Observable<any> {
    return this.queryService.post(
      `${environment.terminalUrl}/api/Terminal/zreport/${index}`,
      {}
    );
  }

  /* End TERM */

  testPrint(renderer: Renderer2): void {
    // this.printService.print('<pre><qrcode class=\"ng-star-inserted\"><div class=\"qrcode\"><img src=\"data:image/png;base64,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\"></div></qrcode><p _ngcontent-qvr-c80=\"\">Привет</p><p _ngcontent-qvr-c80=\"\">Гончара</p><p _ngcontent-qvr-c80=\"\">Дом 3</p><p _ngcontent-qvr-c80=\"\">Hello</p><p _ngcontent-qvr-c80=\"\">------------</p><p _ngcontent-qvr-c80=\"\">   ф ф Ш Ї їЩ</p><p _ngcontent-qvr-c80=\"\"> IД 34554362   </p><p _ngcontent-qvr-c80=\"\"> IД 34554362   </p><p _ngcontent-qvr-c80=\"\">  IД 34554362   </p><p _ngcontent-qvr-c80=\"\">Привет</p><p _ngcontent-qvr-c80=\"\">Гончара</p><p _ngcontent-qvr-c80=\"\">Дом 3</p></pre>').subscribe(res => {} )
    this.printService
      .clearPrintBlank()
      .addTextToPrint(renderer, '       Тестовий платник 3       ')
      .addTextToPrint(renderer, '         Тестовая печать        ')
      .addTextToPrint(renderer, '   ф ф Ш Ї їЩ')
      .addTextToPrint(renderer, '  ІД 34554362   ')
      .addTextToPrint(renderer, '  ПОДАТОК   ')
      // .addTextToPrint(renderer, '  О   ')
      // .addTextToPrint(renderer, '  П')
      // .addTextToPrint(renderer, '  Е')
      // .addTextToPrint(renderer, '  Р')
      // .addTextToPrint(renderer, '  А')
      // .addTextToPrint(renderer, '  Ц')
      // .addTextToPrint(renderer, '  І')
      // .addTextToPrint(renderer, '  Я')
      // .addTextToPrint(renderer, '  З')
      // .addTextToPrint(renderer, '  В')
      // .addTextToPrint(renderer, '  И')
      // .addTextToPrint(renderer, '  Д')
      // .addTextToPrint(renderer, '  А')
      // .addTextToPrint(renderer, '  Ч')
      // .addTextToPrint(renderer, '  І')
      // .addTextToPrint(renderer, '  Г')
      // .addTextToPrint(renderer, '  О')
      // .addTextToPrint(renderer, '  Т')
      // .addTextToPrint(renderer, '  І')
      // .addTextToPrint(renderer, '  В')
      // .addTextToPrint(renderer, '  К')
      // .addTextToPrint(renderer, '  О')
      // .addTextToPrint(renderer, '  В')
      // .addTextToPrint(renderer, '  И')
      // .addTextToPrint(renderer, '  Х')
      .addTextToPrint(renderer, '  ОПЕРАЦІЯ')
      .addTextToPrint(renderer, 'ОПЕРАЦІЯ')
      .addTextToPrint(renderer, '  ОПЕРАЦІЯ З ВИДАЧІ ГОТІВКОВИХ   ')
      .addTextToPrint(renderer, '  ОПЕРАЦІЯ З ВИДАЧІ ГОТІВКОВИХ   ')
      .addTextToPrint(renderer, '  ОПЕРАЦІЯ З ВИДАЧІ ГОТІВКОВИХ  ')
      .test_print();
  }
}
