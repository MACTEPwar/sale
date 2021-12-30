import { TNullable } from './../../shared/types/types/t-nullabel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Receipt } from '@common/types';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ReceiptService {
  receipt: Receipt = new Receipt();
  contentForPrint: BehaviorSubject<Array<string>> = new BehaviorSubject<
    Array<string>
  >([]);

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  getReceipt(fiscalNumber: TNullable<number> = null): void {
    this.getReceiptByFiscalNumber$(fiscalNumber)
      .pipe(take(1))
      .subscribe((result: any) => {
        this.receipt.totalSum.next(+result.sum);
        this.receipt.products.next(
          result.positions.map((m: any) => ({
            articlePosition: m.articlePosition,
            name: m.name,
            amount: m.amount,
            price: m.price,
            bar: m.bar,
            discountSum: +m.discountSum,
          }))
        );
      });
  }

  getContentForPrint(fiscalNumber: TNullable<number> = null): void {
    this.getContentForPrint$(fiscalNumber)
      .pipe(take(1))
      .subscribe((res) => {
        this.contentForPrint.next(res);
      });
  }

  getContentForPrint$(fiscalNumber: TNullable<number> = null): Observable<any> {
    return this.httpClient
      .get(`${environment.apiUrl}/api/service/receipt/${fiscalNumber}`)
      .pipe(map((m: any) => m.data));
  }

  private getReceiptByFiscalNumber$(
    fiscalNumber: TNullable<number> = null
  ): Observable<any> {
    return this.httpClient
      .get(`${environment.apiUrl}/api/Receipt/fiscal/${fiscalNumber}`)
      .pipe(map((m: any) => m.data));
  }
}
