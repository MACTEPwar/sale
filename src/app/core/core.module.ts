import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationService } from './authentication/authentication.service';
import { JwtInterceptor } from './interceptors/jwt.iterceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthenticationModule],
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
  exports: [AuthenticationModule],
})
export class CoreModule {}
