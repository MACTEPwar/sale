import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Printer } from '@awesome-cordova-plugins/printer/ngx';
import { QRCodeModule } from 'angularx-qrcode';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeyboardLiteralModule } from './components/keyboard-literal/keyboard-literal.module';
import { KeyboardNumberModule } from './components/keyboard-number/keyboard-number.module';
import { MainMenuModule } from './components/main-menu/main-menu.module';
import { ProductListModule } from './components/product-list/product-list.module';
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
    RippleModule,
    MenuModule,
    SlideMenuModule,
    DropdownModule,
    FileUploadModule,
    KeyboardNumberModule,
    MainMenuModule,
    ProductListModule,
    KeyboardLiteralModule,
    ProgressBarModule,
  ],
  providers: [MessageService, Printer, HTTP, BarcodeScanner],
  bootstrap: [AppComponent],
})
export class AppModule {}
