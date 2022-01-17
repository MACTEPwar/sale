import { environment } from 'src/environments/environment';
import { Injectable, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PrinterService, QueryService } from '@common/core';

@Injectable()
export class ReceiptsService {
  receipts: BehaviorSubject<Array<TReceipt>> = new BehaviorSubject<
    Array<TReceipt>
  >([]);
  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private queryService: QueryService,
    private printerService: PrinterService
  ) {}

  getReceipts(filter: TReceiptFilter): void {
    this.loading.next(true);
    this.httpClient
      .post(
        `${
          environment.apiUrl
        }/api/documents/list?dateTime=${filter.dateTime.toISOString()}`,
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
        this.receipts.next(data.Value);
        this.count.next(data.Key);
        this.loading.next(false);
      });
  }

  returnReceipt$(receipt: number): Observable<any> {
    return this.queryService.post(
      `${environment.apiUrl}/api/receipt/return/${receipt}`,
      {}
    );
  }
}

export type TReceipt = {
  id: string;
  fiscalNumber: number;
  receiptType: string;
  orderTaxNum: string;
  dfsLink: string;
  sum: number;
  dateCreate: Date;
};

export type TReceiptFilter = {
  dateTime: Date;
  skip: number;
  take: number;
};
