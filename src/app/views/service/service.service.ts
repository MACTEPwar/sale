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
      .post(`${environment.apiUrl}/api/barPrice/import`, formData)
      .pipe(map((m) => m.data));
  }

  testPrint(renderer: Renderer2): void {
    this.printService
      .clearPrintBlank()
      .addTextToPrint(renderer, 'Hello world')
      .addTextToPrint(renderer, 'Hello world 1')
      .addTextToPrint(renderer, 'Hello world 2')
      .addTextToPrint(renderer, 'Hello world 3')
      .addTextToPrint(renderer, 'Hello world 4')
      .test_print();
  }
}
