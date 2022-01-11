import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { MessageService } from 'primeng/api';
import { Component, Input, OnInit } from '@angular/core';
import { ServiceMockService } from './service.-mock.service';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {
  @Input() panel: any;
  constructor(
    private serviceService: ServiceService,
    private messageService: MessageService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  doCashIn(): void {
    let result: string | null = prompt('Введiть суму');
    if (result !== null) {
      this.serviceService.doCashIn(+result).subscribe((res) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Iнфо',
          detail: 'Виконано внесення',
        });
      });
    }
  }

  doCashOut(): void {
    let result: string | null = prompt('Введiть суму');
    if (result !== null) {
      this.serviceService.doCashOut(+result).subscribe((res) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Iнфо',
          detail: 'Виконано вилучення',
        });
      });
    }
  }

  doZReport(): void {
    this.serviceService.doZReport$().subscribe((res) => {});
  }

  logout(): void {
    this.authService.logout();
    this.panel.hide()
  }
}
