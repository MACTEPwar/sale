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
    private renderer: Renderer2
  ) {
    this.receipt = this.receiptService.receipt;
    this.printContent = this.receiptService.contentForPrint;
  }

  ngOnInit(): void {}

  print(printContent: any): void {
    this.receiptService.print(this.fiscalNumber, this.renderer);
  }
}
