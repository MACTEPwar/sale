import { TReceiptProduct } from './../../shared/types/types/t-receipt-product';
import { Component, OnInit } from '@angular/core';
import { Receipt, TProduct } from '@common/types';
import { Observable } from 'rxjs';
import { SaleService } from './../../core/BLL/sale-logic/sale.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
})
export class SaleComponent implements OnInit {
  productList: Observable<Array<TProduct>>;
  receiptProducts: Observable<Array<TReceiptProduct>>;
  totalSum: Observable<number>;

  constructor(private saleService: SaleService) {
    this.productList = this.saleService.productList;
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
