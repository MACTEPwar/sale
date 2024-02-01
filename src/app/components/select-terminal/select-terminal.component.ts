import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-select-terminal',
  templateUrl: './select-terminal.component.html',
  styleUrls: ['./select-terminal.component.scss'],
})
export class SelectTerminalComponent implements OnInit {
  terminals = [];
  selectedTerminal: any = null;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.terminals = config.data.terminals ?? [];
    this.selectedTerminal = (this.terminals[0] as any).key;
  }

  ngOnInit(): void {}

  select(): void {
    if (this.selectedTerminal) {
      this.ref.close(this.selectedTerminal);
    }
  }
}
