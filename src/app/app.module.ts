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

@NgModule({
  declarations: [AppComponent, IsLoginPagePipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PanelMenuModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    ToastModule,
    ButtonModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
