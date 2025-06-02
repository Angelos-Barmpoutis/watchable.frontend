import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateSessionResponse, DeleteSessionResponse, RequestTokenResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class AuthDriver {
    constructor(private http: HttpClient) {}

    createRequestToken(): Observable<RequestTokenResponse> {
        return this.http.get<RequestTokenResponse>(`${environment.TMDBBaseUrl}authentication/token/new`);
    }

    createSession(requestToken: string): Observable<CreateSessionResponse> {
        return this.http.post<CreateSessionResponse>(`${environment.TMDBBaseUrl}authentication/session/new`, {
            request_token: requestToken,
        });
    }

    deleteSession(sessionId: string): Observable<DeleteSessionResponse> {
        return this.http.delete<DeleteSessionResponse>(`${environment.TMDBBaseUrl}authentication/session`, {
            body: { session_id: sessionId },
        });
    }
}
