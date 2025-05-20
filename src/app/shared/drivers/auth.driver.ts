import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RequestTokenResponse, SessionResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class AuthDriver {
    constructor(private http: HttpClient) {}

    createRequestToken(): Observable<RequestTokenResponse> {
        return this.http.get<RequestTokenResponse>(`${environment.TMDBBaseUrl}authentication/token/new`);
    }

    createSession(requestToken: string): Observable<SessionResponse> {
        return this.http.post<SessionResponse>(`${environment.TMDBBaseUrl}authentication/session/new`, {
            request_token: requestToken,
        });
    }
}
