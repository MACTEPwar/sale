import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReceiptService, TReceipt } from './receipt.service';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
  providers: [ReceiptService],
})
export class ReceiptsComponent implements OnInit {
  receipts: Observable<Array<TReceipt>>;
  loading: Observable<boolean>;

  constructor(private receiptService: ReceiptService) {
    this.receipts = this.receiptService.receipts;
    this.loading = this.receiptService.loading;
    this.receiptService.getReceipts({
      dateTime: new Date(),
      skip: 0,
      take: 20,
    });
  }

  ngOnInit() {}

  loadReceipts(event: any): void {
    this.receiptService.getReceipts({
      dateTime: new Date(),
      skip: event.first,
      take: event.rows,
    });
  }
}
