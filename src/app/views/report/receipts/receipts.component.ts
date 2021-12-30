import { TNullable } from './../../../shared/types/types/t-nullabel';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReceiptsService, TReceipt } from './receipt.service';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
  providers: [ReceiptsService],
})
export class ReceiptsComponent implements OnInit {
  visibleReceipt = false;
  fiscalNumber: TNullable<number> = null;

  receipts: Observable<Array<TReceipt>>;
  count: Observable<number>;
  loading: Observable<boolean>;

  date: Date = new Date();

  constructor(private receiptService: ReceiptsService) {
    this.receipts = this.receiptService.receipts;
    this.count = this.receiptService.count;
    this.loading = this.receiptService.loading;
    this.receiptService.getReceipts({
      dateTime: this.date,
      skip: 0,
      take: 20,
    });
  }

  ngOnInit() {}

  loadReceipts(event: any): void {
    this.receiptService.getReceipts({
      dateTime: this.date,
      skip: event.first,
      take: event.rows,
    });
  }

  onDateChange(event: Date): void {
    this.date = event;
    this.receiptService.getReceipts({
      dateTime: this.date,
      skip: 0,
      take: 20,
    });
  }

  onSelectReceipt(fiscalNumber: number): void {
    this.fiscalNumber = fiscalNumber;
    this.visibleReceipt = true;
  }
}
