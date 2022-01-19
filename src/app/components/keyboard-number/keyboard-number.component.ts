import { TNullable } from '@common/types';
import {
  Component,
  ContentChild,
  Input,
  OnInit,
  Output,
  TemplateRef,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { KeyboardNumberService } from './keyboard-number.service';

@Component({
  selector: 'app-keyboard-number',
  templateUrl: './keyboard-number.component.html',
  styleUrls: ['./keyboard-number.component.scss'],
})
export class KeyboardNumberComponent implements OnInit {
  @Input()
  itemTemplate?: TemplateRef<any>;
  @Input()
  value: TNullable<string> = null;
  @Input() defaultValue: any = null;
  @Input() max: number = 9999;
  @Input() min: number = 0;
  @Output() change: EventEmitter<TNullable<number>> = new EventEmitter<
    TNullable<number>
  >();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  clearFunction = () => {
    this.value = this.defaultValue;
    if (this.value == null || this.value === '' || this.value === undefined) {
      this.change.emit(this.defaultValue);
    } else {
      this.change.emit(parseFloat(this.value));
    }
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private keyboardNumberService: KeyboardNumberService
  ) {}

  ngOnInit(): void {}

  setValue(value: string): void {
    if (value === 'b') {
      if (this.value && this.value!.toString().length >= 2) {
        this.value = this.value
          .toString()
          .slice(0, this.value.toString().length - 1);
      } else if (this.value && this.value!.toString().length === 1) {
        this.value = this.defaultValue;
      } else {
        return;
      }
    } else {
      const temp = `${String(this.value?.toString())}${String(value)}`;
      if (/^[0-9]*[.,]{0,1}[0-9]*$/.test(temp)) {
        if (+temp >= this.min && +temp <= this.max) {
          this.value = temp;
        } else {
          this.value = String(Number(this.value));
        }
      }
    }
    if (this.value == null || this.value === '' || this.value === undefined) {
      this.change.emit(this.defaultValue);
    } else {
      this.change.emit(parseFloat(this.value));
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
