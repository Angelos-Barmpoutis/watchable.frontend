import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorService } from './error.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(private errorService: ErrorService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const authReq = request.clone({
            setHeaders: {
                Authorization: `Bearer ${environment.authToken}`,
            },
        });
        return next.handle(authReq).pipe(
            catchError((error: unknown) => {
                this.errorService.handleError(error as HttpErrorResponse);
                return throwError(() => error);
            }),
        );
    }
}
