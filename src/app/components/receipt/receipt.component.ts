import { SaleService } from './../../core/BLL/sale-logic/sale.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { Receipt, TNullable } from '@common/types';
import { Observable } from 'rxjs';
import { ReceiptService } from './receipt.service';
import { SaleNewService } from 'src/app/core/BLL/sale-logic/sale-new.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  providers: [ReceiptService],
})
export class ReceiptComponent implements OnInit {
  receipt: TNullable<Receipt> = null;
  printContent: Observable<Array<string>>;

  @Input() showMode: 'print' | 'component' = 'component';

  private _fiscalNumber: TNullable<number> = null;
  public get fiscalNumber(): TNullable<number> {
    return this._fiscalNumber;
  }
  @Input() public set fiscalNumber(value: TNullable<number>) {
    this._fiscalNumber = value;
    switch (this.showMode) {
      case 'component': {
        this.receiptService.getReceipt(value);
        break;
      }
      case 'print': {
        this.receiptService.getContentForPrint(value);
        break;
      }
    }
  }

  constructor(
    private receiptService: ReceiptService,
    private renderer: Renderer2,
    private saleService: SaleNewService,
    private messageService: MessageService,
  ) {
    this.receipt = this.receiptService.receipt;
    this.printContent = this.receiptService.contentForPrint;
  }

  ngOnInit(): void {}

  print(printContent: any): void {
    this.receiptService.print(this.fiscalNumber, this.renderer);
  }

  sendReceiptToMail(email: string): void {
    if (this.isEmail(email)) {
      this.saleService
        .sendReceiptToEmail$(String(this.fiscalNumber), email)
        .subscribe((res) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Iнфо',
            detail: `Чек вiдправлено за адресою ${email}`,
          });
        }, (err)=> {
          this.messageService.add({
            severity: 'error',
            summary: 'Помилка',
            detail: ``,
          });
        });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Помилка',
        detail: `Email не валiдний. Перевiрте його, та спробуйте ще раз.`,
      });
    }
  }

  private isEmail(email: string) {
    // Регулярное выражение для проверки email-адреса
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Проверяем, соответствует ли строка регулярному выражению
    return emailRegex.test(email);
  }
}
