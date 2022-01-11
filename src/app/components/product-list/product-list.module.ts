import { ButtonModule } from 'primeng/button';
import { ProductListService } from './product-list.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProductListComponent } from './product-list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductListComponent],
  imports: [CommonModule, AutoCompleteModule, FormsModule, ButtonModule],
  exports: [ProductListComponent],
})
export class ProductListModule {}
