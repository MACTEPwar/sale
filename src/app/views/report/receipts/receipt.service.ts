import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class ReceiptsService {
  receipts: BehaviorSubject<Array<TReceipt>> = new BehaviorSubject<
    Array<TReceipt>
  >([]);
  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}

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
