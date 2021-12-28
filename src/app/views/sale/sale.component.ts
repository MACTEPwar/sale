import { Component, OnInit } from '@angular/core';
import { TProduct } from '@common/types';
import { Observable, of, Subject } from 'rxjs';
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
  totalSum: Observable<number>;

  constructor(private saleService: SaleService) {
    this.productList = this.saleService.productList.pipe(
      map((m) => {
        return m ?? [];
      })
    );
    this.receiptProducts = this.saleService.receipt.products;
    this.totalSum = this.saleService.receipt.totalSum;
  }

  ngOnInit(): void {}

  addProductToReceipt(product: TProduct): void {
    let amount = prompt('Введiть кiлькiсть:') ?? 0;
    this.saleService.addProductToReceipt(product, +amount);
  }

  dropProductFromReceipt(productId: string): void {
    this.saleService.dropProductFromReceipt(productId);
  }
}

export class Product {
  id: string = '';
  name: string = '';
  bar: string = '';
  price: number = 0;
}
