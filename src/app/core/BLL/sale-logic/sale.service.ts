import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { MessageService } from 'primeng/api';
import { TReceiptProduct } from './../../../shared/types/types/t-receipt-product';
import { environment } from './../../../../environments/environment';
import { BehaviorSubject, from, iif, Observable, of, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, Pipe } from '@angular/core';
import { Receipt, TProduct } from '@common/types';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Capacitor } from '@capacitor/core';

@Injectable()
export class SaleService {
  receipt: Receipt = new Receipt();
  productList: BehaviorSubject<Array<TProduct>> = new BehaviorSubject<
    Array<TProduct>
  >([]);
  paymentsList: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(
    []
  );

  constructor(
    private httpClient: HttpClient,
    private http: HTTP,
    private messageService: MessageService,
    private authService: AuthenticationService
  ) {
    this.getProductList();
    this.getCurrentReceipt();
  }

  getProductList(name: string | null = null): void {
    this.getPorducts$(name).subscribe(
      (res) => {
        // alert(JSON.stringify(res, null, 4));
        this.productList.next(
          res.map((m: any) => ({
            id: m.id,
            name: m.name,
            bar: m.bar,
            price: m.price,
          }))
        );
      },
      (e) => {}
    );
  }

  getPorducts$(name: string | null = null): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          getProducts_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!,
            name
          ),
          getProducts_WEB$(this.httpClient, name)
        )
      )
    );
    // return this.httpClient
    //   .get(`${environment.apiUrl}/api/barPrice/list`, {
    //     params: obj,
    //   })
    //   .pipe(map((m: any) => m.data));
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
    this.getCurrentReceipt$().subscribe(
      (result) => {
        // alert(JSON.stringify(result, null, 4));
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
      },
      (err) => {
        // alert(JSON.stringify(err, null, 4));
      }
    );
  }

  doPayment(
    array: Array<{ sum: number; paymentType: number }>
  ): Observable<any> {
    return this.doPayment$(array).pipe(
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

  getPaymentsList(): void {
    this.getPaementsList$()
      .pipe(take(1))
      .subscribe((res) => {
        this.paymentsList.next(res);
      });
  }

  private addProductToReceiptHttp(
    product: TProduct,
    amount: number
  ): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          addProductToReceiptHttp_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!,
            product,
            amount
          ),
          addProductToReceiptHttp_WEB$(this.httpClient, product, amount)
        )
      )
    );
  }

  private changeProductFromReceiptHttp(
    product: TReceiptProduct
  ): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          changeProductFromReceiptHttp_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!,
            product
          ),
          changeProductFromReceiptHttp_WEB$(this.httpClient, product)
        )
      )
    );
  }

  private getCurrentReceipt$(): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          getCurrentReceipt_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!
          ),
          getCurrentReceipt_WEB$(this.httpClient)
        )
      )
    );
  }

  private doPayment$(
    array: Array<{ sum: number; paymentType: number }>
  ): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          doPayment_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!,
            array
          ),
          doPayment_WEB$(this.httpClient, array)
        )
      ),
      tap(
        (_: any) => {},
        (error: any) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Помилка',
            detail: error.error.message,
          });
        }
      ),
      map((m: any) => m.data)
    );
  }

  private getPaementsList$(): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          getPaementsList_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!
          ),
          getPaementsList_WEB$(this.httpClient)
        )
      ),
      map((m: any) => m.data)
    );
  }
}

export function getProducts_ANDROID$(
  http: HTTP,
  auth: string,
  name: string | null = null
): Observable<any> {
  let obj: any = {};
  if (name) {
    obj.name = name;
  }

  http.setDataSerializer('json');

  return from(
    http.get(`${environment.apiUrl}/api/barPrice/list`, obj, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth}`,
    })
  ).pipe(
    map((m: any) => JSON.parse(m.data).data),
    take(1)
  );
}

export function getProducts_WEB$(
  http: HttpClient,
  name: string | null = null
): Observable<any> {
  let obj: any = {};
  if (name) {
    obj.name = name;
  }

  return http
    .get(`${environment.apiUrl}/api/barPrice/list`, {
      params: obj,
    })
    .pipe(
      map((m: any) => m.data),
      take(1)
    );
}

export function addProductToReceiptHttp_ANDROID$(
  http: HTTP,
  auth: string,
  product: TProduct,
  amount: number
): Observable<any> {
  http.setDataSerializer('json');

  return from(
    http.post(
      `${environment.apiUrl}/api/Receipt/fiscal/add`,
      {
        bar: product.bar,
        articlePosition: 0,
        discountSum: 0,
        amount,
      },
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      }
    )
  ).pipe(
    map((m: any) => JSON.parse(m.data).data),
    take(1)
  );
}

export function addProductToReceiptHttp_WEB$(
  http: HttpClient,
  product: TProduct,
  amount: number
): Observable<any> {
  return http
    .post(`${environment.apiUrl}/api/Receipt/fiscal/add`, {
      bar: product.bar,
      articlePosition: 0,
      discountSum: 0,
      amount,
    })
    .pipe(
      map((m: any) => m.data),
      take(1)
    );
}

export function changeProductFromReceiptHttp_ANDROID$(
  http: HTTP,
  auth: string,
  product: TReceiptProduct
): Observable<any> {
  http.setDataSerializer('json');

  return from(
    http.post(
      `${environment.apiUrl}/api/Receipt/fiscal/change`,
      {
        bar: product.bar,
        articlePosition: product.articlePosition,
        discountSum: product.discountSum,
        amount: product.amount,
      },
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      }
    )
  ).pipe(
    map((m: any) => JSON.parse(m.data).data),
    take(1)
  );
}

export function changeProductFromReceiptHttp_WEB$(
  http: HttpClient,
  product: TReceiptProduct
): Observable<any> {
  return http
    .post(`${environment.apiUrl}/api/Receipt/fiscal/change`, {
      bar: product.bar,
      articlePosition: product.articlePosition,
      discountSum: product.discountSum,
      amount: product.amount,
    })
    .pipe(
      map((m: any) => m.data),
      take(1)
    );
}

export function getCurrentReceipt_ANDROID$(
  http: HTTP,
  auth: string
): Observable<any> {
  return from(
    http.get(
      `${environment.apiUrl}/api/Receipt/fiscal`,
      {},
      {
        Authorization: `Bearer ${auth}`,
      }
    )
  ).pipe(
    map((m: any) => JSON.parse(m.data).data),
    take(1)
  );
}

export function getCurrentReceipt_WEB$(http: HttpClient): Observable<any> {
  return http.get(`${environment.apiUrl}/api/Receipt/fiscal`).pipe(
    map((m: any) => m.data),
    take(1)
  );
}

export function doPayment_ANDROID$(
  http: HTTP,
  auth: string,
  array: Array<{ sum: number; paymentType: number }>
): Observable<any> {
  http.setDataSerializer('json');

  return from(
    http.post(
      `${environment.apiUrl}/api/Receipt/fiscal/payment`,
      array.map((m) => ({ amount: m.sum, paymentType: m.paymentType })),
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      }
    )
  ).pipe(
    map((m: any) => JSON.parse(m.data)),
    take(1)
  );
}

export function doPayment_WEB$(
  http: HttpClient,
  array: Array<{ sum: number; paymentType: number }>
): Observable<any> {
  return http.post(
    `${environment.apiUrl}/api/Receipt/fiscal/payment`,
    array.map((m) => ({ amount: m.sum, paymentType: m.paymentType }))
  );
}

export function getPaementsList_ANDROID$(
  http: HTTP,
  auth: string
): Observable<any> {
  return from(
    http.get(
      `${environment.apiUrl}/api/payments/list`,
      {},
      {
        Authorization: `Bearer ${auth}`,
      }
    )
  ).pipe(map((m) => JSON.parse(m.data)));
}

export function getPaementsList_WEB$(http: HttpClient): Observable<any> {
  return http.get(`${environment.apiUrl}/api/payments/list`).pipe(take(1));
}
