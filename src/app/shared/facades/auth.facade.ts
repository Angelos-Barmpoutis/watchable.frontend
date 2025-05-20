import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthGateway } from '../gateways/auth.gateway';
import { CreateSessionResponse, DeleteSessionResponse, RequestTokenResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class AuthFacade {
    constructor(private authGateway: AuthGateway) {}

    createRequestToken(): Observable<RequestTokenResponse> {
        return this.authGateway.createRequestToken();
    }

    createSession(requestToken: string): Observable<CreateSessionResponse> {
        return this.authGateway.createSession(requestToken);
    }

    deleteSession(sessionId: string): Observable<DeleteSessionResponse> {
        return this.authGateway.deleteSession(sessionId);
    }
}
