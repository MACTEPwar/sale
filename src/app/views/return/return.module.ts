import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnComponent } from './return.component';
import { ReturnRoutingModule } from './return-router.module';

@NgModule({
  declarations: [ReturnComponent],
  imports: [CommonModule, ReturnRoutingModule],
})
export class ReturnModule {}
