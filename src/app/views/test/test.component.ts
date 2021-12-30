import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  print(printContent: any): void {
    const WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0'
    );
    WindowPrt!.document.write(`<header></header>`);
    WindowPrt!.document.write(`<body>`);
    WindowPrt!.document.write(printContent!.innerHTML);
    setTimeout(() => {
      // WindowPrt!.document.close();
      WindowPrt!.focus();
      WindowPrt!.print();
      // WindowPrt!.close();
    }, 2000);
  }
}
