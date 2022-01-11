import { Component, OnInit } from '@angular/core';
import { PrinterService } from '@common/core';
import { TNullable, TProduct } from '@common/types';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SaleNewService } from './../../core/BLL/sale-logic/sale-new.service';
import { TReceiptProduct } from './../../shared/types/types/t-receipt-product';
import { ServiceService } from './../service/service.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
})
export class SaleComponent implements OnInit {
  /**
   * Товары в чеке
   */
  receiptProducts: Observable<Array<TReceiptProduct>>;

  /** Общаа сумма чека */
  totalSum: BehaviorSubject<number>;

  /** Денег в кассе */
  moneyInKassa: Observable<number>;

  /** Список типов оплат */
  listPaymentTypes: Observable<Array<any>>;
  /** Форма печати для чека */
  dataForPrint: Observable<Array<string>>;
  /** Смылка (QR-код) */
  link: Observable<string>;

  /** Признак видимости расширенного окна оплаты */
  visibleOtherPayment = false;
  /** Сумма по каждой оплате */
  pay: any = {};

  /** Признак видимости окна оплаты */
  visiblePaymantProcess = false;
  /** Признак выполнения запроса на оплату */
  payInProgress = false;

  /** Изменение кол-ва товара в чеке (принимает новый объект товара, инициирует запрос) */
  changeProductInReceipt: BehaviorSubject<TNullable<TReceiptProduct>> =
    new BehaviorSubject<TNullable<TReceiptProduct>>(null);
  /** Сохраняет предыдущее значение количества товара в чеке */
  prevAmount: TNullable<number> = null;

  constructor(
    private saleService: SaleNewService,
    private serviceService: ServiceService,
    private printerService: PrinterService
  ) {
    /** Подписка на товары в чеке */
    this.receiptProducts = this.saleService.receipt.products;
    /** Подписка на сумму в чеке */
    this.totalSum = this.saleService.receipt.totalSum;
    /** Подписка на сумму денег в кассе */
    this.moneyInKassa = this.serviceService.moneyInKassa;
    /** Подписка на типы оплат */
    this.listPaymentTypes = this.saleService.paymentsList;
    /** Подписка на данные для печати */
    this.dataForPrint = this.saleService.contentForPrint;
    /** Подписка на ссылку для QR-кода */
    this.link = this.saleService.link;

    /** Выполняется при изменении кол-ва в чеке */
    this.changeProductInReceipt
      .pipe(debounceTime(300))
      .subscribe((product: TNullable<TReceiptProduct>) => {
        this.saleService.changeProductFromReceipt(product as TReceiptProduct);
      });
  }

  ngOnInit(): void {
    /** Получаю текущий чек */
    this.saleService.getCurrentReceipt();
    /** Получаю сумму денег в кассе */
    this.serviceService.getMoneyInKassa();
  }

  /**
   * Добавляет товар в чек
   * @param product Товар
   */
  addProductToReceipt(product: TProduct): void {
    this.saleService.addProductToReceipt(product, 1);
  }

  /**
   * При фокусе количества - оно запоминается
   * @param amountInp Input
   */
  onFocusAmount(amountInp: any): void {
    this.prevAmount = amountInp.value;
  }

  /**
   * При вводе количества
   * @param amountInp Input
   * @param product Товар
   */
  onInputAmount(amountInp: any, product: TReceiptProduct): void {
    if (amountInp.value == +amountInp.value && amountInp.value > 0) {
      this.prevAmount = amountInp.value;
      product.amount = +amountInp.value;
      this.changeProductInReceipt.next(product);
    } else {
      amountInp.value = this.prevAmount;
    }
  }

  /**
   * При нажатии на кнопку "+1 товар"
   * @param product Товар
   */
  amountPlus(product: any): void {
    product.amount = product.amount + 1;
    this.changeProductInReceipt.next(product);
  }

  /**
   * При нажатии на кнопку "-1 товар"
   * @param product Товар
   */
  amountMinus(product: any): void {
    if (product.amount > 1) {
      product.amount = product.amount - 1;
      this.changeProductInReceipt.next(product);
    }
  }

  /**
   * Оплата
   * @param paymentType Тип оплаты (может быть null)
   */
  doPayment(paymentType: TNullable<number> = null): void {
    this.payInProgress = true;
    this.visiblePaymantProcess = true;
    let arr: Array<{ sum: number; paymentType: number }> = [];

    if (paymentType != null) {
      this.pay[paymentType] = this.totalSum.getValue();
    }

    for (let p in this.pay) {
      arr.push({
        sum: +this.pay[p],
        paymentType: +p,
      });
    }

    this.saleService.doPayment(arr).subscribe((res) => {
      // this.saleService.getCurrentReceipt();
      this.serviceService.getMoneyInKassa();
      this.visibleOtherPayment = false;
      this.payInProgress = false;

      for (let p in this.pay) {
        this.pay[p] = null;
      }
    });
  }

  /**
   * Оплата прошла успешно (завершающие действия)
   * @param printReceipt Признак печати чека
   * @param content Контент для печати чека
   */
  finishPay(
    printReceipt: boolean,
    content: HTMLElement | null | string = null
  ): void {
    if (printReceipt === true) {
      this.printerService.print(content!).subscribe((res) => {
        // this.visiblePaymantProcess = false;
      });
    } else {
      this.visiblePaymantProcess = false;
    }
  }
}

export class Product {
  id: string = '';
  name: string = '';
  bar: string = '';
  price: number = 0;
}
