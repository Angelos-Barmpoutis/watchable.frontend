import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthGateway } from '../gateways/auth.gateway';
import { RequestTokenResponse, SessionResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class AuthFacade {
    constructor(private authGateway: AuthGateway) {}

    createRequestToken(): Observable<RequestTokenResponse> {
        return this.authGateway.createRequestToken();
    }

    createSession(requestToken: string): Observable<SessionResponse> {
        return this.authGateway.createSession(requestToken);
    }
}
