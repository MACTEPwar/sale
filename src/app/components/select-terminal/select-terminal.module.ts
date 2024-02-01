import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectTerminalComponent } from './select-terminal.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [SelectTerminalComponent],
  imports: [CommonModule, DropdownModule, FormsModule, ButtonModule],
  exports: [SelectTerminalComponent],
})
export class SelectTerminalModule {}
