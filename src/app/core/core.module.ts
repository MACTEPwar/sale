import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationService } from './authentication/authentication.service';
import { SaleLogicModule } from './BLL/sale-logic/sale-logic.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.iterceptor';
import { PrinterModule } from './printer/printer.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthenticationModule, SaleLogicModule, PrinterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useFactory: (auth: AuthenticationService) => {
        return new JwtInterceptor(auth);
      },
      deps: [AuthenticationService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ErrorInterceptor,
    },
  ],
  exports: [AuthenticationModule, SaleLogicModule, PrinterModule],
})
export class CoreModule {}
