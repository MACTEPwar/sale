import { ConfirmationService, MessageService } from 'primeng/api';
import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PrinterService } from '@common/core';
import { TNullable, TProduct } from '@common/types';
import { BehaviorSubject, combineLatest, concat, Observable } from 'rxjs';
import { debounceTime, filter, switchMap, take } from 'rxjs/operators';
import { SaleNewService } from './../../core/BLL/sale-logic/sale-new.service';
import { TReceiptProduct } from './../../shared/types/types/t-receipt-product';
import { ServiceService } from './../service/service.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
})
export class SaleComponent implements OnInit {
  // @HostListener('document:keypress', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   console.log(event);
  //   let x = event.keyCode;
  //   if (x === 13 && this.focusAmountInput === true) {
  //     this.changeProductInReceipt.next(this.currentProduct);
  //     this.currentAmountInput.blur();
  //   }
  // }

  addProductState: 'none' | 'selectProduct' | 'selectAmount' = 'none';
  lastAddedProduct: TNullable<TReceiptProduct> = null;

  focusAmountInput = false;
  // currentProduct: any = null;
  currentAmountInput: any = null;
  currentInputValue = '';

  /**
   * Товары в чеке
   */
  receiptProducts: Observable<Array<TReceiptProduct>>;

  /** Общаа сумма чека */
  totalSum: BehaviorSubject<number>;

  /** Список типов оплат */
  listPaymentTypes: Observable<Array<any>>;
  /** Форма печати для чека */
  dataForPrint: Observable<Array<string>>;
  /** Смылка (QR-код) */
  link: Observable<string>;

  /** Введенные деньги в наличке */
  inputCash: TNullable<number> = null;
  /** Остаток */
  restCash: TNullable<number> = null;

  /** Признак видимости окна оплаты */
  visiblePaymantProcess = false;
  /** Признак выполнения запроса на оплату */
  payInProgress = false;
  payInStart = false;

  /** Изменение кол-ва товара в чеке (принимает новый объект товара, инициирует запрос) */
  changeProductInReceipt: BehaviorSubject<TNullable<TReceiptProduct>> =
    new BehaviorSubject<TNullable<TReceiptProduct>>(null);
  /** Сохраняет предыдущее значение количества товара в чеке */
  prevAmount: TNullable<number> = null;

  @ViewChildren('amountInp') amountInps?: QueryList<ViewContainerRef>;

  constructor(
    private saleService: SaleNewService,
    private serviceService: ServiceService,
    private printerService: PrinterService,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    /** Подписка на товары в чеке */
    this.receiptProducts = this.saleService.receipt.products;
    /** Подписка на сумму в чеке */
    this.totalSum = this.saleService.receipt.totalSum;
    /** Подписка на типы оплат */
    this.listPaymentTypes = this.saleService.paymentsList;
    /** Подписка на данные для печати */
    this.dataForPrint = this.saleService.contentForPrint;
    /** Подписка на ссылку для QR-кода */
    this.link = this.saleService.link;

    /** Выполняется при изменении кол-ва в чеке */
    this.changeProductInReceipt
      .pipe(
        debounceTime(300),
        filter((f) => f !== null)
      )
      .subscribe((product: TNullable<TReceiptProduct>) => {
        this.saleService
          .changeProductFromReceipt(product as TReceiptProduct)
          .subscribe((res) => {
            const arr = res.positions.sort(
              (x: any, y: any) => x.articlePosition - y.articlePosition
            );
            this.lastAddedProduct = arr[arr.length - 1];
          });
        // this.currentProduct = null;
        // this.lastAddedProduct = null;
      });

    this.titleService.setTitle('Продаж товару');
  }

  ngOnInit(): void {
    /** Получаю текущий чек */
    this.saleService.getCurrentReceipt();
    /** Получаю сумму денег в кассе */
    this.serviceService.getMoneyInKassa();
    /** Поулчаю статус ПРРО */
    this.serviceService.getEcrStatus();
    /** Поулчаю статус смены */
    this.serviceService.getShiftStatus();
    /** Получаю список доступных оплат */
    this.saleService.getPaymentsList();
  }

  ngAfterViewInit(): void {
    // this.amountInps?.changes.subscribe((ch) => {
    //   console.log('ch', ch);
    // });
  }

  /**
   * Добавляет товар в чек
   * @param product Товар
   */
  addProductToReceipt(product: TProduct): void {
    this.saleService.addProductToReceipt(product, 0).subscribe((res) => {
      this.addProductState = 'selectAmount';
      const arr = res.positions.sort(
        (x: any, y: any) => x.articlePosition - y.articlePosition
      );
      this.lastAddedProduct = arr[arr.length - 1];
    });
  }

  onChangeKeyboard(event: any): void {
    if (event == +event && event >= 0) {
      this.prevAmount = event;
      this.lastAddedProduct!.amount = +event;
      // this.currentProduct = product;
    } else if (event == '') {
      this.prevAmount = 0;
      this.lastAddedProduct!.amount = 0;
      event === '0';
      // this.currentProduct = product;
    } else {
      event = this.prevAmount;
    }
    this, this.changeProductInReceipt.next(this.lastAddedProduct);
  }

  /**
   * При вводе количества
   * @param amountInp Input
   * @param product Товар
   */
  // onInputAmount(amountInp: any, product: TReceiptProduct, event: any): void {
  //   if (amountInp.value == +amountInp.value && amountInp.value >= 0) {
  //     this.prevAmount = amountInp.value;
  //     product.amount = +amountInp.value;
  //     this.currentProduct = product;
  //   } else if (amountInp.value == '') {
  //     this.prevAmount = 0;
  //     product.amount = 0;
  //     amountInp.value === '0';
  //     this.currentProduct = product;
  //   } else {
  //     amountInp.value = this.prevAmount;
  //   }
  // }

  /**
   * При нажатии на кнопку "+1 товар"
   * @param product Товар
   */
  amountPlus(): void {
    // this.lastAddedProduct!.amount = this.lastAddedProduct!.amount + 1;
    this.currentInputValue = String(this.lastAddedProduct!.amount + 1);
    this.changeProductInReceipt.next(this.lastAddedProduct);
  }

  /**
   * При нажатии на кнопку "-1 товар"
   * @param product Товар
   */
  amountMinus(): void {
    this.currentInputValue =
      +this.lastAddedProduct!.amount - 1 > 0
        ? String(+this.lastAddedProduct!.amount - 1)
        : '0';
    this.changeProductInReceipt.next(this.lastAddedProduct);
  }

  applyAmount(): void {
    this.lastAddedProduct = null;
    this.addProductState = 'none';
  }

  /** Когда нажал расплатиться наличкой */
  clickDoPayCash(): void {
    this.payInStart = true;
    this.visiblePaymantProcess = true;
  }

  /**
   * Уогда вводишь наличку
   * @param event Сколько денег ввел
   */
  onInputCash(event: any): void {
    this.inputCash = event;
    this.restCash = this.inputCash! - this.totalSum.getValue();
  }

  /**
   * Оплата
   * @param paymentType Тип оплаты (может быть null)
   */
  doPayment(paymentType: TNullable<number> = null): void {
    if (this.totalSum.getValue() === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Помилка',
        detail: 'Чек порожнiй',
      });
      return;
    }

    this.payInProgress = true;
    this.payInStart = false;
    this.visiblePaymantProcess = true;

    let sum: any = null;

    switch (paymentType) {
      case 0: {
        sum = this.inputCash ?? this.totalSum.getValue();
        break;
      }
      case 1: {
        sum = this.totalSum.getValue();
      }
    }

    this.saleService
      .doPayment([
        {
          paymentType: paymentType as number,
          sum,
        },
      ])
      .subscribe(
        (res) => {
          this.restCash = null;
          this.inputCash = null;
          this.serviceService.getMoneyInKassa();
          this.payInProgress = false;
          this.saleService.getContentForPrint(
            this.saleService.lastReceiptNumber.getValue()
          );
        },
        (e) => {
          this.visiblePaymantProcess = false;
          this.payInProgress = false;
        }
      );
  }

  /** Когда отменил ввод налички */
  cancelPay(): void {
    this.visiblePaymantProcess = false;
    this.payInStart = false;
    this.restCash = null;
    this.inputCash = null;
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
        this.afterFinishPay();
      });
    } else {
      this.afterFinishPay();
    }
  }

  /** Поусл того как продажа полностью завершена */
  private afterFinishPay() {
    this.visiblePaymantProcess = false;
    /** Поулчаю статус ПРРО */
    this.serviceService.getEcrStatus();
    /** Поулчаю статус смены */
    this.serviceService.getShiftStatus();
  }

  /** Анулирует чек */
  doCancelReceipt(): void {
    this.confirmationService.confirm({
      message: 'Вы бажаєте анулювати чек?',
      acceptLabel: 'Так',
      rejectLabel: 'Нi',
      header: 'Iнфо',
      accept: () => {
        this.saleService.doCancelReceipt();
      },
    });
  }
}

export class Product {
  id: string = '';
  name: string = '';
  bar: string = '';
  price: number = 0;
}
