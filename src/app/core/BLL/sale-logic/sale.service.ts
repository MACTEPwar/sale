import { TReceiptProduct } from './../../../shared/types/types/t-receipt-product';
import { environment } from './../../../../environments/environment';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Receipt, TProduct } from '@common/types';
import { filter, map, take, tap } from 'rxjs/operators';

@Injectable()
export class SaleService {
  receipt: Receipt = new Receipt();
  productList: BehaviorSubject<Array<TProduct>> = new BehaviorSubject<
    Array<TProduct>
  >([]);

  constructor(private httpClient: HttpClient) {
    this.getProductList();
    this.getCurrentReceipt();
  }

  getProductList(name: string | null = null): void {
    this.getPorducts$(name).subscribe((res) => {
      this.productList.next(
        res.map((m: any) => ({
          id: m.id,
          name: m.name,
          bar: m.bar,
          price: m.price,
        }))
      );
    });
  }

  getPorducts$(name: string | null = null): Observable<any> {
    let obj: any = {};
    if (name) {
      obj.name = name;
    }
    return this.httpClient
      .get(`${environment.apiUrl}/api/barPrice/list`, {
        params: obj,
      })
      .pipe(map((m: any) => m.data));
  }

  addProductToReceipt(product: TProduct, amount: number): void {
    this.addProductToReceiptHttp(product, amount).subscribe((result) => {
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
      // this.receipt.addProduct(product, amount);
      // this.receipt.totalSum.next(result);
    });
  }

  changeProductFromReceipt(product: TReceiptProduct): void {
    this.changeProductFromReceiptHttp(product)
      .pipe(take(1))
      .subscribe((result) => {
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

  getCurrentReceipt(): void {
    this.getCurrentReceipt$()
      .pipe(take(1))
      .subscribe((result) => {
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

  doPayment(sum: number, paymentType: number): Observable<any> {
    return this.doPayment$(sum, paymentType).pipe(
      filter((f) => f === true),
      tap((t) => {
        this.receipt.products.next([]);
        this.receipt.totalSum.next(0);
      }),
      take(1)
    );
    //     .subscribe((res) => {
    //       this.getCurrentReceipt();
    //     });
  }

  private addProductToReceiptHttp(
    product: TProduct,
    amount: number
  ): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/Receipt/fiscal/add`, {
        bar: product.bar,
        articlePosition: 0,
        discountSum: 0,
        amount,
      })
      .pipe(map((m: any) => m.data));
  }

  private changeProductFromReceiptHttp(
    product: TReceiptProduct
  ): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/Receipt/fiscal/change`, {
        bar: product.bar,
        articlePosition: product.articlePosition,
        discountSum: product.discountSum,
        amount: product.amount,
      })
      .pipe(map((m: any) => m.data));
  }

  private getCurrentReceipt$(): Observable<any> {
    return this.httpClient
      .get(`${environment.apiUrl}/api/Receipt/fiscal`)
      .pipe(map((m: any) => m.data));
  }

  private doPayment$(sum: number, paymentType: number): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/Receipt/fiscal/payment`, [
        { paymentType, amount: sum },
      ])
      .pipe(map((m: any) => m.data));
  }
}
