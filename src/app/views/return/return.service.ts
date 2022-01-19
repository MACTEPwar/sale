import { TReceiptProduct } from './../../shared/types/types/t-receipt-product';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { TNullable } from '@common/types';
import { QueryService } from '@common/core';
import { environment } from 'src/environments/environment.prod';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ReturnService {
  products: BehaviorSubject<Array<TReceiptProduct>> = new BehaviorSubject<
    Array<TReceiptProduct>
  >([]);

  fiscalNumber: TNullable<string> = null;

  constructor(private queryService: QueryService) {}

  getReceiptByFiscalNumber(fiscalNumber: string): void {
    this.fiscalNumber = fiscalNumber;
    this.queryService
      .get(`${environment.apiUrl}/api/Receipt/fiscal/${fiscalNumber}`)
      .pipe(map((m: any) => m.data?.positions))
      .subscribe((positions: Array<TReceiptProduct>) => {
        this.products.next(
          positions.map((m) => {
            m.maxReturnAmount = m.amount;
            m.amount = 0;
            return m;
          })
        );
      });
  }

  changeAmount(product: TReceiptProduct): void {
    const temp = this.products.getValue();
    const finder = temp.find(
      (f) => f.article === product.article && f.bar === product.bar
    );
    if (finder != null) {
      finder.amount = product.amount;
      this.products.next(temp);
    }
  }

  doReturn(): Observable<any> {
    return this.queryService.post(
      `${environment.apiUrl}/api/Receipt/partreturn`,
      {
        orderTaxNumber: this.fiscalNumber,
        positions: this.products.getValue().map((m) => ({
          article: m.article,
          price: m.price,
          bar: m.bar,
          amount: m.amount,
          articlePosition: m.articlePosition,
        })),
      }
    );
  }
}

// {
//     fiscal: number,
//     products: [{
//       articlePosition: number,
//       article: number,
//       bar: string,
//       amount: number,
//       price: number
//     }]
//   }
