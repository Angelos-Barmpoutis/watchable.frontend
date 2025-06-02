import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorService } from './error.service';

/**
 * HTTP interceptor service for request/response processing
 * Automatically adds authentication headers and handles global error processing
 */
@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(private errorService: ErrorService) {}

    /**
     * Intercepts HTTP requests to add authentication and handle errors
     * @param request - The outgoing HTTP request
     * @param next - The next handler in the interceptor chain
     * @returns Observable of HTTP events with error handling
     */
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
