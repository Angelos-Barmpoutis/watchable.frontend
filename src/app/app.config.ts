import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { InterceptorService } from './core/services/interceptor.service';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
};
