import { Component, OnInit } from '@angular/core';
import { ReceiptService } from './receipt.service';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
  providers: [ReceiptService],
})
export class ReceiptsComponent implements OnInit {
  products: any[] = [];

  constructor(private receiptService: ReceiptService) {}

  ngOnInit() {
    this.receiptService
      .getProductsSmall()
      .then((data: any) => (this.products = data));
  }
}
