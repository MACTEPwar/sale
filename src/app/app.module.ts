import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Printer } from '@awesome-cordova-plugins/printer/ngx';
import { QRCodeModule } from 'angularx-qrcode';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { IsLoginPagePipe } from './is-login-page.pipe';
import { ServiceModule } from './views/service/service.module';
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
    QRCodeModule,
    ConfirmDialogModule,
    FormsModule,
    DialogModule,
  ],
  providers: [MessageService, Printer, HTTP],
  bootstrap: [AppComponent],
})
export class AppModule {}
