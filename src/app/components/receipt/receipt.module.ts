import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptComponent } from './receipt.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [ReceiptComponent],
  imports: [CommonModule, TableModule],
  exports: [ReceiptComponent],
})
export class ReceiptModule {}
