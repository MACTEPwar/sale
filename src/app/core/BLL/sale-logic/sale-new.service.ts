import { Injectable, Renderer2 } from '@angular/core';
import { QueryService, PrinterService } from '@common/core';
import { Receipt, TNullable, TProduct } from '@common/types';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, take, tap, switchMap } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { TReceiptProduct } from './../../../shared/types/types/t-receipt-product';

@Injectable()
export class SaleNewService {
  lastReceiptNumber: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);
  receipt: Receipt = new Receipt();

  paymentsList: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(
    []
  );

  contentForPrint: BehaviorSubject<Array<string>> = new BehaviorSubject<
    Array<string>
  >([]);
  link: BehaviorSubject<string> = new BehaviorSubject<string>('');

  selectedProduct: BehaviorSubject<TNullable<TReceiptProduct>> =
    new BehaviorSubject<TNullable<TReceiptProduct>>(null);

  constructor(
    private messageService: MessageService,
    private queryService: QueryService,
    private printService: PrinterService
  ) {}

  addProductToReceipt(product: TProduct, amount: number): Observable<any> {
    return this.addProductToReceipt$(product, amount).pipe(
      map((m) => m.data),
      tap((result) => {
        this.receipt.totalSum.next(+result.sum);
        this.receipt.products.next(
          result.positions.map((m: any) => ({
            articlePosition: m.articlePosition,
            name: m.name,
            amount: m.amount,
            price: m.price,
            bar: m.bar,
            discountSum: +m.discountSum,
            sum: +m.sum,
          }))
        );
      })
    );
  }

  prevValue: TNullable<number> = null;

  changeAmount(amount: TNullable<number>): void {
    // let numResult: TNullable<number> = +amount;
    // let flag = false;

    // if (!isNaN(numResult)) {
    //   this.prevValue = numResult;
    // } else {
    //   numResult = this.prevValue;
    //   console.log('goto prev', numResult);
    //   flag = true;
    // }

    const temp = this.selectedProduct.getValue();

    if (temp == null) {
      return;
    }

    // if (String(numResult) != amount && !flag) {
    //   return;
    // }

    temp!.amount = amount ?? 0;
    //this.selectedProduct!.next(temp);
    // console.log(temp);
    this.changeProductFromReceipt(temp!).subscribe((res) => {
      temp.sum = +res.positions.find(
        (f: any) => f.articlePosition === temp.articlePosition
      ).sum;
    });
  }

  changeProductFromReceipt(product: TReceiptProduct): Observable<any> {
    return of({}).pipe(
      switchMap((_) => this.changeProductFromReceipt$(product)),
      map((m) => m.data),
      tap((result) => {
        this.receipt.totalSum.next(+result.sum);
        this.receipt.products.next(
          result.positions.map((m: any) => ({
            articlePosition: m.articlePosition,
            name: m.name,
            amount: m.amount,
            price: m.price,
            bar: m.bar,
            discountSum: +m.discountSum,
            sum: +m.sum,
          }))
        );
      })
    );
  }

  getCurrentReceipt(): void {
    this.getCurrentReceipt$()
      .pipe(map((m) => m.data))
      .subscribe(
        (result) => {
          console.log('CURRENT RECEIPT', result);
          if (result != null) {
            this.receipt.totalSum.next(+result.sum);
            this.receipt.products.next(
              result.positions.map((m: any) => ({
                articlePosition: m.articlePosition,
                name: m.name,
                amount: m.amount,
                price: m.price,
                bar: m.bar,
                discountSum: +m.discountSum,
                sum: +m.sum,
              }))
            );
          }
        },
        (err) => {
          // alert(JSON.stringify(err, null, 4));
        }
      );
  }

  doCancelReceipt(): void {
    this.cancelReceipt$()
      .pipe(map((m) => m.data))
      .subscribe((res) => {
        this.receipt.products.next([]);
        this.receipt.totalSum.next(0);
        this.messageService.add({
          severity: 'info',
          detail: 'Чек анульовано',
          summary: 'Iнфо',
        });
      });
  }

  doPayment(
    array: Array<{ sum: number; paymentType: number; terminalData: any }>
  ): Observable<any> {
    return this.doPayment$(array).pipe(
      tap((p) => {
        this.lastReceiptNumber.next(p.orderTaxNum);
      }),
      // map((m) => m.data),
      filter((f) => f.data === true),
      tap((t) => {
        this.receipt.products.next([]);
        this.receipt.totalSum.next(0);
      })
    );
  }

  getPaymentsList(): void {
    this.getPaementsList$()
      .pipe(map((m) => m.data))
      .subscribe((res) => {
        this.paymentsList.next(res);
      });
  }

  printReceipt(
    renderer: Renderer2,
    fiscalNumber: TNullable<number> = null
  ): void {
    this.getContentForPrint$(fiscalNumber)
      .pipe(
        map((m: any) => m.data),
        take(1)
      )
      .subscribe((res) => {
        this.printService.clearPrintBlank();
        res.data.forEach((str: string) => {
          this.printService.addTextToPrint(renderer, str);
        });
        if (res.link != null) {
          this.printService.addQrCode(renderer, res.link);
        }
        this.printService.test_print();
        // this.contentForPrint.next(res.data);
        // this.link.next(res.link);
      });
  }

  getContentForPrint(fiscalNumber: TNullable<number> = null): void {
    this.getContentForPrint$(fiscalNumber)
      .pipe(map((m: any) => m.data))
      .subscribe((res) => {
        this.contentForPrint.next(res.data);
        this.link.next(res.link);
      });
  }

  private getContentForPrint$(
    fiscalNumber: TNullable<number> = null
  ): Observable<any> {
    return this.queryService.get(
      `${environment.apiUrl}/api/service/receipt/${fiscalNumber}`
    );
  }

  private addProductToReceipt$(
    product: TProduct,
    amount: number
  ): Observable<any> {
    return this.queryService.post(
      `${environment.apiUrl}/api/Receipt/fiscal/add`,
      {
        bar: product.bar,
        articlePosition: 0,
        discountSum: 0,
        amount,
        price: product.price,
      }
    );
  }

  private changeProductFromReceipt$(product: TReceiptProduct): Observable<any> {
    return this.queryService.post(
      `${environment.apiUrl}/api/Receipt/fiscal/change`,
      {
        bar: product.bar,
        articlePosition: product.articlePosition,
        discountSum: product.discountSum,
        amount: product.amount,
      }
    );
  }

  private getCurrentReceipt$(): Observable<any> {
    return this.queryService.get(`${environment.apiUrl}/api/Receipt/fiscal`);
  }

  private doPayment$(
    array: Array<{ sum: number; paymentType: number; terminalData: any }>
  ): Observable<any> {
    return this.queryService.post(
      `${environment.apiUrl}/api/Receipt/fiscal/payment`,
      array.map((m) => ({
        amount: m.sum,
        paymentType: m.paymentType,
        terminalData: m.terminalData ?? null,
      }))
    );
  }

  private getPaementsList$(): Observable<any> {
    return this.queryService.get(`${environment.apiUrl}/api/payments/list`);
  }

  private cancelReceipt$(): Observable<any> {
    return this.queryService.post(
      `${environment.apiUrl}/api/Receipt/cancel`,
      {}
    );
  }

  public sendReceiptToEmail$(
    fiscalNumber: string,
    email: string
  ): Observable<any> {
    return this.queryService.post(
      `${environment.apiUrl}/api/Receipt/fiscal/send?number=${fiscalNumber}&email=${email}`,
      {}
    );
  }
}
