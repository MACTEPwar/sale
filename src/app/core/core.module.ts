import { ConfigModule } from './config/config.module';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationService } from './authentication/authentication.service';
import { SaleLogicModule } from './BLL/sale-logic/sale-logic.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.iterceptor';
import { MainMenuModule } from './main-menu/main-menu.module';
import { PrinterModule } from './printer/printer.module';
import { QueryModule } from './query/query.module';
import { ConfigService } from './config/config.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthenticationModule,
    SaleLogicModule,
    PrinterModule,
    QueryModule,
    MainMenuModule,
    ConfigModule,
  ],
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
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => {
        return () =>
          configService
            .load()
            .toPromise();
      },
      multi: true,
      deps: [ConfigService],
    },
  ],
  exports: [
    AuthenticationModule,
    SaleLogicModule,
    PrinterModule,
    QueryModule,
    MainMenuModule,
    ConfigModule
  ],
})
export class CoreModule {}
