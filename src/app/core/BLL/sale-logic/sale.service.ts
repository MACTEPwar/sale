import { environment } from './../../../../environments/environment';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Receipt, TProduct } from '@common/types';
import { map } from 'rxjs/operators';

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

  dropProductFromReceipt(articlePosition: number): void {
    // this.dropProductFromReceiptHttp(id).subscribe((result) => {
    //   this.receipt.dropProduct(id);
    //   this.receipt.totalSum.next(result);
    // });
  }

  getCurrentReceipt(): void {
    this.getCurrentReceipt$().subscribe((result) => {
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

  // private dropProductFromReceiptHttp(productId: string): Observable<any> {
  //   return this.httpClient.delete(
  //     `${environment.apiUrl}/sale/dropProduct/${productId}`
  //   );
  // }

  // TODO: когда бек сделает, то раскоментить предыдыщую
  private dropProductFromReceiptHttp(articlePosition: number): Observable<any> {
    return of({});
  }

  private getCurrentReceipt$(): Observable<any> {
    return this.httpClient
      .get(`${environment.apiUrl}/api/Receipt/fiscal`)
      .pipe(map((m: any) => m.data));
  }
}
