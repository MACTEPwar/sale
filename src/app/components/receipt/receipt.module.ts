import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptComponent } from './receipt.component';
import { TableModule } from 'primeng/table';
import { PtModule } from '@common/pipes';

@NgModule({
  declarations: [ReceiptComponent],
  imports: [CommonModule, TableModule, PtModule],
  exports: [ReceiptComponent],
})
export class ReceiptModule {}
