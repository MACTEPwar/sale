import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixedNoRound',
})
export class ToFixedNoRoundPipe implements PipeTransform {
  transform(value: number, precision: number = 1): number {
    const factor = Math.pow(10, precision);
    return Math.floor(value * factor) / factor;
  }
}
