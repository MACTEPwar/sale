import { ServiceService } from './../service/service.service';
import { Component, OnInit } from '@angular/core';
import { TProduct } from '@common/types';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SaleService } from './../../core/BLL/sale-logic/sale.service';
import { TReceiptProduct } from './../../shared/types/types/t-receipt-product';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
})
export class SaleComponent implements OnInit {
  productList: Observable<Array<Product>>;

  test: Array<Product> = [];

  receiptProducts: Observable<Array<TReceiptProduct>>;
  totalSum: BehaviorSubject<number>;

  moneyInKassa: Observable<number>;

  listPaymentTypes: Observable<Array<any>>;

  visibleOtherPayment = false;
  pay: any = {};

  constructor(
    private saleService: SaleService,
    private serviceService: ServiceService
  ) {
    this.saleService.getPaymentsList();
    this.productList = this.saleService.productList.pipe(
      map((m) => {
        return m ?? [];
      })
    );
    this.receiptProducts = this.saleService.receipt.products;
    this.totalSum = this.saleService.receipt.totalSum;
    this.serviceService.getMoneyInKassa();
    this.moneyInKassa = this.serviceService.moneyInKassa;
    this.listPaymentTypes = this.saleService.paymentsList;
  }

  ngOnInit(): void {}

  addProductToReceipt(product: TProduct): void {
    let amount = prompt('Введiть кiлькiсть:') ?? 0;
    this.saleService.addProductToReceipt(product, +amount);
  }

  onChangeProduct(product: TReceiptProduct): void {
    this.saleService.changeProductFromReceipt(product);
  }

  onSearch(value: string): void {
    this.saleService.getProductList(value);
  }

  doPayment(paymentType: number): void {
    this.saleService
      .doPayment([{ sum: this.totalSum.getValue(), paymentType: paymentType }])
      .subscribe((res) => {
        this.saleService.getCurrentReceipt();
        this.serviceService.getMoneyInKassa();
      });
  }

  doPay(): void {
    let arr: Array<{ sum: number; paymentType: number }> = [];
    for (let p in this.pay) {
      arr.push({
        sum: +this.pay[p],
        paymentType: +p,
      });
    }

    this.saleService.doPayment(arr).subscribe((res) => {
      this.saleService.getCurrentReceipt();
      this.serviceService.getMoneyInKassa();
      this.visibleOtherPayment = false;

      for (let p in this.pay) {
        this.pay[p] = null;
      }
    });
  }
}

export class Product {
  id: string = '';
  name: string = '';
  bar: string = '';
  price: number = 0;
}
