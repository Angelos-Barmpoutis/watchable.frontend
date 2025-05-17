import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthDriver } from '../drivers/auth.driver';
import { RequestTokenResponse, SessionResponse, UserInfo } from '../models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class AuthGateway {
    constructor(private authDriver: AuthDriver) {}

    createRequestToken(): Observable<RequestTokenResponse> {
        return this.authDriver.createRequestToken();
    }

    createSession(requestToken: string): Observable<SessionResponse> {
        return this.authDriver.createSession(requestToken);
    }

    getUserInfo(): Observable<UserInfo> {
        return this.authDriver.getUserInfo();
    }
}
