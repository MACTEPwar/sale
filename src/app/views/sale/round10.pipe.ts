import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round10',
})
export class Round10Pipe implements PipeTransform {
  transform(value: number): string {
    return value.toFixed(2);
  }
}
