import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const authReq = request.clone({
            setHeaders: {
                Authorization: `Bearer ${environment.authToken}`,
            },
        });

        return next.handle(authReq);
    }
}
