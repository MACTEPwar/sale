import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationService } from './authentication/authentication.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.iterceptor';

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
