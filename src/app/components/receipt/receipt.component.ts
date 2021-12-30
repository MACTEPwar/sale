import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Receipt, TNullable } from '@common/types';
import { Observable } from 'rxjs';
import { ReceiptService } from './receipt.service';

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

  constructor(private receiptService: ReceiptService) {
    this.receipt = this.receiptService.receipt;
    this.printContent = this.receiptService.contentForPrint;
  }

  ngOnInit(): void {}

  print(printContent: any): void {
    const WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0'
    );
    WindowPrt!.document.write(`<header></header>`);
    WindowPrt!.document.write(`<body>`);
    WindowPrt!.document.write(printContent!.innerHTML);
    WindowPrt!.document.write(`</body>`);
    setTimeout(() => {
      WindowPrt!.document.close();
      WindowPrt!.focus();
      WindowPrt!.print();
      WindowPrt!.close();
    }, 2000);
  }
}
