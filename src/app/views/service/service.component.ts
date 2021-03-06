import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ServiceMockService } from './service.-mock.service';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  providers: [{ provide: ServiceService, useClass: ServiceMockService }],
})
export class ServiceComponent implements OnInit {
  constructor(
    private serviceService: ServiceService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  doCashIn(): void {
    let result: string | null = prompt('Введiть суму');
    if (result !== null) {
      this.serviceService.doCashIn(+result).subscribe((res) => {
        this.messageService.add({
          severity:'info',
          summary: 'Iнфо',
          detail: 'Виконано внесення',
        });
      });
    }
  }
}
