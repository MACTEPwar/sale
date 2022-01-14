import { ProductListModule } from './components/product-list/product-list.module';
import { KeyboardNumberModule } from './components/keyboard-number/keyboard-number.module';
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
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { MainMenuModule } from './components/main-menu/main-menu.module';

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
    RippleModule,
    MenuModule,
    SlideMenuModule,
    DropdownModule,
    FileUploadModule,
    KeyboardNumberModule,
    MainMenuModule,
    ProductListModule,
  ],
  providers: [MessageService, Printer, HTTP],
  bootstrap: [AppComponent],
})
export class AppModule {}
