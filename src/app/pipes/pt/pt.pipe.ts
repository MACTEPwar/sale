import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pt',
})
export class PtPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/ /g, String.fromCharCode(160));
    // return value.gs
  }
}
