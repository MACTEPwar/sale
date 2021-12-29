import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SaleRoutingModule } from './sale-router.module';
import { SaleComponent } from './sale.component';
import { StyleClassModule } from 'primeng/styleclass';

@NgModule({
  declarations: [SaleComponent],
  imports: [
    CommonModule,
    SaleRoutingModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    FormsModule,
    StyleClassModule,
  ],
})
export class SaleModule {}
