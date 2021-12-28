import { environment } from './../../../../environments/environment';
import { BehaviorSubject, Observable, timer } from 'rxjs';
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
      this.receipt.addProduct(product, amount);
      this.receipt.totalSum.next(result);
    });
  }

  dropProductFromReceipt(id: string): void {
    this.dropProductFromReceiptHttp(id).subscribe((result) => {
      this.receipt.dropProduct(id);
      this.receipt.totalSum.next(result);
    });
  }

  // private addProductToReceiptHttp(
  //   product: TProduct,
  //   amount: number
  // ): Observable<any> {
  //   return this.httpClient.post(`${environment.apiUrl}/sale/addProduct`, {
  //     productId: product.id,
  //     amount,
  //   });
  // }

  // TODO: когда бек сделает, то раскоментить предыдыщую
  private addProductToReceiptHttp(
    product: TProduct,
    amount: number
  ): Observable<any> {
    return this.waitTime(2000).pipe(
      map((m) => {
        return this.receipt.totalSum.getValue() + product.price * amount;
      })
    );
  }

  // private dropProductFromReceiptHttp(productId: string): Observable<any> {
  //   return this.httpClient.delete(
  //     `${environment.apiUrl}/sale/dropProduct/${productId}`
  //   );
  // }

  // TODO: когда бек сделает, то раскоментить предыдыщую
  private dropProductFromReceiptHttp(productId: string): Observable<any> {
    return this.waitTime(2000).pipe(
      map((m) => {
        const product: any = this.receipt.products
          .getValue()
          .find((f) => f.id === productId);
        return (
          this.receipt.totalSum.getValue() - product?.amount * product?.price
        );
      })
    );
  }

  private getMockProducts(): Array<TProduct> {
    return Array.from({ length: 40 }, (_, i) => i + 1).map((m) => ({
      name: `Товар ${m}`,
      bar: `11${m}`,
      id: `${m}`,
      price: this.randomInteger(50, 300),
    }));
  }

  private randomInteger(min: number, max: number) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

  private waitTime(time: number): Observable<any> {
    return timer(time);
  }
}
