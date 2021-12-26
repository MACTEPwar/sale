import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SaleRoutingModule } from './sale-router.module';
import { SaleComponent } from './sale.component';

@NgModule({
  declarations: [SaleComponent],
  imports: [
    CommonModule,
    SaleRoutingModule,
    InputTextModule,
    TableModule,
    ButtonModule,
  ],
})
export class SaleModule {}
