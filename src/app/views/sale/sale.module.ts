import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleComponent } from './sale.component';
import { SaleRoutingModule } from './sale-router.module';

@NgModule({
  declarations: [SaleComponent],
  imports: [CommonModule, SaleRoutingModule],
})
export class SaleModule {}
