import {
  Component,
  ContentChild,
  Input,
  OnInit,
  Output,
  TemplateRef,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-keyboard-number',
  templateUrl: './keyboard-number.component.html',
  styleUrls: ['./keyboard-number.component.scss'],
})
export class KeyboardNumberComponent implements OnInit {
  @Input()
  itemTemplate?: TemplateRef<any>;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  private _value: string = '';
  @Input()
  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    if (value === 'b') {
      if (this.value.length >= 1) {
        this._value = this.value.slice(0, this.value.length - 1);
      } else {
        return;
      }
    } else {
      this._value = `${String(this.value)}${String(value)}`;
    }
    this.valueChange.emit(this.value);
  }

  clearFunction = () => {
    this.value = '';
  };

  constructor() {}

  ngOnInit(): void {}

  setValue(value: string): void {
    // if (value === 'b') {
    //   if (this.value.length >= 1) {
    //     this.value = this.value.slice(0, this.value.length - 1);
    //   } else {
    //     return;
    //   }
    // } else {
    //   this.value = `${String(this.value)}${String(value)}`;
    // }
    this.value = value;
  }
}
