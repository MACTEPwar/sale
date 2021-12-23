import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceComponent } from './service.component';
import { ServiceRoutingModule } from './service-router.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [ServiceComponent],
  imports: [
    CommonModule,
    ServiceRoutingModule,
    ButtonModule
  ],
})
export class ServiceModule {}
