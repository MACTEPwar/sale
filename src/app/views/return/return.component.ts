import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss'],
})
export class ReturnComponent implements OnInit {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Повернення товару');
  }

  ngOnInit(): void {}
}
