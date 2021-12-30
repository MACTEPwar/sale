import { ServiceModule } from './views/service/service.module';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IsLoginPagePipe } from './is-login-page.pipe';
import { PanelMenuModule } from 'primeng/panelmenu';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NgxPrintModule } from 'ngx-print';
import { TestComponent } from './views/test/test.component';

@NgModule({
  declarations: [AppComponent, IsLoginPagePipe, TestComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PanelMenuModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    ToastModule,
    ButtonModule,
    OverlayPanelModule,
    ServiceModule,
    NgxPrintModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
