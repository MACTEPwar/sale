import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TReceiptProduct, TNullable } from '@common/types';
import { Observable } from 'rxjs';
import { ReturnService } from './return.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss'],
  providers: [ReturnService],
})
export class ReturnComponent implements OnInit {
  products: Observable<Array<TReceiptProduct>>;
  selectedProduct: TNullable<TReceiptProduct> = null;
  visibleSelectedAmount = false;

  constructor(
    private titleService: Title,
    private returnService: ReturnService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmService: ConfirmationService
  ) {
    this.titleService.setTitle('Повернення товару');
    this.products = this.returnService.products;
  }

  ngOnInit(): void {
    // вычитать чек
    let receiptNumber = this.route.snapshot.params.fiscalNumber;
    this.returnService.getReceiptByFiscalNumber(receiptNumber);
  }

  openWindowChangeAmount(receiptProduct: TReceiptProduct): void {
    this.selectedProduct = receiptProduct;
    this.visibleSelectedAmount = true;
  }

  onChangeKeyboard(event: TNullable<number>): void {
    const prevAmount = this.selectedProduct!.amount;
    if (event != null) {
      if (event >= 0 && event <= this.selectedProduct!.maxReturnAmount!) {
        this.selectedProduct!.amount = event;
        this.returnService.changeAmount(this.selectedProduct!);
      } else {
        this.selectedProduct!.amount = prevAmount;
      }
    }
  }

  amountMinus(): void {
    if (this.selectedProduct!.amount >= 1) {
      this.selectedProduct!.amount -= 1;
    } else {
      this.selectedProduct!.amount = 0;
    }
    this.returnService.changeAmount(this.selectedProduct!);
  }

  amountPlus(): void {
    if (
      this.selectedProduct!.amount + 1 <=
      this.selectedProduct?.maxReturnAmount!
    ) {
      this.selectedProduct!.amount += 1;
    } else {
      this.selectedProduct!.amount = this.selectedProduct!.maxReturnAmount!;
    }
    this.returnService.changeAmount(this.selectedProduct!);
  }

  applyAmount(): void {
    this.visibleSelectedAmount = false;
  }

  doRetrun(): void {
    this.confirmService.confirm({
      header: 'Увага',
      acceptLabel: 'Так',
      rejectLabel: 'Нi',
      message: 'Зробити повернення?',
      accept: () => {
        this.returnService.doReturn().subscribe((res) => {
          this.messageService.add({
            summary: 'Iнфо',
            detail: 'Виконано повернення',
            severity: 'success',
          });
          this.router.navigate(['/report/receipts']);
        });
      },
    });
  }

  doCancelreturn(): void {
    this.confirmService.confirm({
      header: 'Увага',
      acceptLabel: 'Так',
      rejectLabel: 'Нi',
      message: 'Вiдмiнити повернення?',
      accept: () => {
        this.router.navigate(['/report/receipts']);
      },
    });
  }
}
