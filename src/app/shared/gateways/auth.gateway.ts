import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthDriver } from '../drivers/auth.driver';
import { CreateSessionResponse, DeleteSessionResponse, RequestTokenResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class AuthGateway {
    constructor(private authDriver: AuthDriver) {}

    createRequestToken(): Observable<RequestTokenResponse> {
        return this.authDriver.createRequestToken();
    }

    createSession(requestToken: string): Observable<CreateSessionResponse> {
        return this.authDriver.createSession(requestToken);
    }

    deleteSession(sessionId: string): Observable<DeleteSessionResponse> {
        return this.authDriver.deleteSession(sessionId);
    }
}
