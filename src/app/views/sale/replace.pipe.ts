import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {
  transform(value: any, search: string, replacement: string): string {
    return value.toString().replace(new RegExp(search, 'g'), replacement);
  }
}