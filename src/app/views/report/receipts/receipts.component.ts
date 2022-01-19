import { TNullable } from './../../../shared/types/types/t-nullabel';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { ReceiptsService, TReceipt } from './receipt.service';
import { Title } from '@angular/platform-browser';
import { ServiceService } from '../../service/service.service';

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

  visibleReturnDialog = false;
  stateReturn: 'none' | 'selectType' | 'finished' = 'none';
  constructor(
    private receiptService: ReceiptsService,
    private titleService: Title,
    private serviceService: ServiceService,
    private renderer: Renderer2
  ) {
    this.titleService.setTitle('Список чекiв');
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

  onSelectReturn(fiscalNumber: number): void {
    this.fiscalNumber = fiscalNumber;
    this.stateReturn = 'selectType';
    this.visibleReturnDialog = true;
  }

  changeReturnType(type: 'full' | 'partial' | 'cancel'): void {
    if (type === 'full') {
      this.receiptService
        .returnReceipt$(this.fiscalNumber!)
        .subscribe((res) => {
          this.stateReturn = 'finished';
        });
    }
    if (type === 'partial') {
      alert('В розробцi');
    }
    if (type === 'cancel') {
      this.stateReturn = 'none';
      this.visibleReturnDialog = false;
    }
  }

  finishReturn(state: boolean): void {
    // печатаю чек
    if (state === true) {
      this.serviceService.printLastReceipt(this.renderer);
    }
    this.stateReturn = 'none';
    this.visibleReturnDialog = false;
  }
}
