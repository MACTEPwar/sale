import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PtPipe } from './pt.pipe';

@NgModule({
  declarations: [PtPipe],
  imports: [CommonModule],
  exports: [PtPipe],
})
export class PtModule {}
