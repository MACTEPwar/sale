import { KeyboardNumberService } from './../../components/keyboard-number/keyboard-number.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  Optional,
  QueryList,
  Renderer2,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PrinterService } from '@common/core';
import { TNullable, TProduct } from '@common/types';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  EMPTY,
  Observable,
  Subject,
} from 'rxjs';
import { debounceTime, filter, switchMap, take, tap } from 'rxjs/operators';
import { SaleNewService } from './../../core/BLL/sale-logic/sale-new.service';
import { TReceiptProduct } from './../../shared/types/types/t-receipt-product';
import { ServiceService } from './../service/service.service';
import { environment } from 'src/environments/environment';

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

  searchType = environment.propductSearchType;

  addProductState: 'none' | 'selectProduct' | 'selectAmount' = 'none';
  lastAddedProduct: TNullable<TReceiptProduct> = null;
  currentArticle;

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
  inputCash: TNullable<string> = '0';
  /** Остаток */
  restCash: TNullable<number> = null;

  /** Признак видимости окна оплаты */
  visiblePaymantProcess = false;
  /** Признак выполнения запроса на оплату */
  payInProgress = false;
  payInStart = false;

  /** Изменение кол-ва товара в чеке (принимает новый объект товара, инициирует запрос) */
  // changeProductInReceipt: BehaviorSubject<TNullable<TReceiptProduct>> =
  //   new BehaviorSubject<TNullable<TReceiptProduct>>(null);
  /** Сохраняет предыдущее значение количества товара в чеке */
  prevAmount: TNullable<number> = null;

  selectedProduct: TNullable<TReceiptProduct> = null;

  curentValueKeyboard: string = '';

  @ViewChildren('amountInp') amountInps?: QueryList<ViewContainerRef>;

  constructor(
    private saleService: SaleNewService,
    private serviceService: ServiceService,
    private printerService: PrinterService,
    private titleService: Title,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    @Optional() private keyboardNumberService: KeyboardNumberService,
    private renderer: Renderer2
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

    this.currentArticle = this.searchType === 'number' ? '0' : '';

    /** Выполняется при изменении кол-ва в чеке */
    // this.changeProductInReceipt
    //   .pipe(
    //     debounceTime(300),
    //     filter((f) => f !== null)
    //   )
    //   .subscribe((product: TNullable<TReceiptProduct>) => {
    //     console.log(product);
    //     this.saleService
    //       .changeProductFromReceipt(product as TReceiptProduct)
    //       .subscribe((res) => {
    //         const arr = res.positions.sort(
    //           (x: any, y: any) => x.articlePosition - y.articlePosition
    //         );
    //         this.lastAddedProduct = arr[arr.length - 1];
    //       });
    //   // this.currentProduct = null;
    //   // this.lastAddedProduct = null;
    // });

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

    this.saleService.selectedProduct.subscribe((res) => {
      // if (
      //   res?.amount.toString() !== this.keyboardNumberService.value.getValue()
      // ) {
      //   this.keyboardNumberService.setValue(String(res?.amount ?? ''));
      // }

      console.log('subs', this.curentValueKeyboard, res);
      this.selectedProduct = res;
    });

    // this.keyboardNumberService.value.subscribe((res) => {
    //   this.saleService.changeAmount(res);
    // });

    // let raera = 0;
    // setInterval(() => {
    //   this.curentValueKeyboard.next(raera.toString());
    //   raera++;
    // }, 1000);
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
      this.currentArticle = this.searchType === 'number' ? '0' : '';
      const arr = res.positions.sort(
        (x: any, y: any) => x.articlePosition - y.articlePosition
      );
      // this.saleService.selectedProduct = arr[arr.length - 1];
      this.saleService.selectedProduct.next(arr[arr.length - 1]);
    });
  }

  openWindowChangeAmount(product: TReceiptProduct): void {
    // console.log(product);
    this.saleService.selectedProduct.next(product);
    this.addProductState = 'selectAmount';
  }

  onChangeKeyboard(event: TNullable<number | string>): void {
    // console.log('change', event);
    if (this.addProductState === 'selectProduct') {
    } else {
      this.saleService.changeAmount(event as TNullable<number>);
    }
  }

  onSearchProduct(event: TNullable<number>): void {
    if (event != null) {
      this.currentArticle = event.toString();
    } else {
      this.currentArticle = this.searchType === 'number' ? '0' : '';
    }
  }
  // onChangeKeyboard(event: any): void {
  //   console.log('change', event);
  //   this.saleService.changeAmount(event);
  //   // if (event == +event && event >= 0) {
  //   //   this.prevAmount = event;
  //   //   this.lastAddedProduct!.amount = +event;
  //   // } else if (event == '') {
  //   //   this.prevAmount = 0;
  //   //   this.lastAddedProduct!.amount = 0;
  //   //   event === '0';
  //   // } else {
  //   //   event = this.prevAmount;
  //   // }
  // }

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
    // this.currentInputValue = String(this.lastAddedProduct!.amount + 1);
    // this.changeProductInReceipt.next(this.lastAddedProduct);
    if (this.addProductState === 'selectProduct') {
    } else {
      if (this.selectedProduct!.amount != null)
        this.saleService.changeAmount(this.selectedProduct!.amount + 1);
    }
  }

  /**
   * При нажатии на кнопку "-1 товар"
   * @param product Товар
   */
  amountMinus(): void {
    // this.currentInputValue =
    //   +this.lastAddedProduct!.amount - 1 > 0
    //     ? String(+this.lastAddedProduct!.amount - 1)
    //     : '0';
    // this.changeProductInReceipt.next(this.lastAddedProduct);
    if (this.addProductState === 'selectProduct') {
    } else {
      if (this.selectedProduct!.amount != null)
        if (this.selectedProduct!.amount >= 1) {
          this.saleService.changeAmount(this.selectedProduct!.amount - 1);
        } else {
          this.saleService.changeAmount(0);
        }
    }
  }

  applyAmount(): void {
    this.lastAddedProduct = null;
    this.addProductState = 'none';
  }

  moneyMinus(): void {
    if (+this.inputCash! >= 1) {
      this.inputCash = (+this.inputCash! - 1).toString();
    } else {
      this.inputCash = '0';
    }
    this.onInputCash(this.inputCash);
  }
  moneyPlus(): void {
    this.inputCash = (+this.inputCash! + 1).toString();
    this.onInputCash(this.inputCash);
  }
  selectInputCash(): void {}
  onChangeKeyboardMoney(event: TNullable<number | string>): void {
    //  this.restCash
    this.inputCash = event as TNullable<string>;
    this.onInputCash(this.inputCash);
  }

  /** Когда нажал расплатиться наличкой */
  clickDoPayCash(): void {
    this.payInStart = true;
    this.visiblePaymantProcess = true;
  }

  /** Когда нажал расплатиться наличкой */
  clickDoPayCard(): void {
    this.confirmationService.confirm({
      message: 'Оплата по терміналу успішна?',
      acceptLabel: 'Так',
      rejectLabel: 'Нi',
      header: 'Увага',
      accept: () => {
        this.doPayment(1);
      },
    });
  }

  /**
   * Уогда вводишь наличку
   * @param event Сколько денег ввел
   */
  onInputCash(event: any): void {
    this.inputCash = event;
    this.restCash = +this.inputCash! - this.totalSum.getValue();
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
        sum = +this.inputCash! ?? this.totalSum.getValue();
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
          this.inputCash = '0';
          this.serviceService.getMoneyInKassa();
          this.payInProgress = false;
          // this.payInStart = false;
          // this.visiblePaymantProcess = false;
          // this.saleService.getContentForPrint(
          //   this.saleService.lastReceiptNumber.getValue()
          // );
        },
        (e) => {
          if (paymentType === 0) {
            this.visiblePaymantProcess = true;
            this.payInStart = true;
            this.payInProgress = false;
          } else {
            this.visiblePaymantProcess = false;
            this.payInProgress = false;
          }
        }
      );
  }

  /** Когда отменил ввод налички */
  cancelPay(): void {
    this.visiblePaymantProcess = false;
    this.payInStart = false;
    this.restCash = null;
    this.inputCash = '0';
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
      this.saleService.printReceipt(
        this.renderer,
        this.saleService.lastReceiptNumber.getValue()
      );
      // this.printerService.print(content!).subscribe((res) => {
      //   this.afterFinishPay();
      // });
    } else {
    }
    this.afterFinishPay();
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
