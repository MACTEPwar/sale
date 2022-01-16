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
  // @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  // @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  // private _value: string = '';
  // public get value(): string {
  //   return this._value;
  // }
  // @Input()
  // public set value(value: string) {
  //   console.log('input', value);
  //   this._value = value;
  //   // this.cdr.detectChanges();
  //   this.valueChange.emit(this.value);
  // }

  value: Observable<string> = EMPTY;

  clearFunction = () => {
    // this.value = '';
    // this.change.emit(this.value);
    this.keyboardNumberService.clear();
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private keyboardNumberService: KeyboardNumberService
  ) {}

  ngOnInit(): void {
    this.value = this.keyboardNumberService.value;
  }

  setValue(value: string): void {
    if (value === 'b') {
      if (this.keyboardNumberService.value.getValue().length >= 1) {
        this.keyboardNumberService.setValue(
          this.keyboardNumberService.value
            .getValue()
            .slice(0, this.keyboardNumberService.value.getValue().length - 1)
        );
      } else {
        return;
      }
    } else {
      this.keyboardNumberService.setValue(
        `${String(this.keyboardNumberService.value.getValue())}${String(value)}`
      );
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
