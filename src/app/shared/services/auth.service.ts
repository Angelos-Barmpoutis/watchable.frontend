import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthFacade } from '../facades/auth.facade';
import { SessionResponse, UserInfo } from '../models/auth.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly SESSION_KEY = 'tmdb_session_id';
    private readonly TMDB_AUTH_URL = environment.TMDBAuthUrl;
    private readonly ORIGIN = environment.origin;
    private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        private authFacade: AuthFacade,
        private localStorageService: LocalStorageService,
        private destroyRef: DestroyRef,
    ) {
        const sessionId = this.getSessionId();
        this.isAuthenticatedSubject.next(!!sessionId);

        this.listenForAuthSuccess();
    }

    private listenForAuthSuccess(): void {
        window.addEventListener('message', (event) => {
            if (event.origin === this.ORIGIN && event.data.type === 'AUTH_SUCCESS') {
                this.createSession(event.data.requestToken).subscribe((response) => this.handleAuthSuccess(response));
            }
        });
    }

    private handleAuthSuccess(response: SessionResponse): void {
        if (response.success) {
            this.isAuthenticatedSubject.next(true);
        }
    }

    private createSession(requestToken: string): Observable<SessionResponse> {
        return this.authFacade.createSession(requestToken).pipe(
            tap((response) => {
                if (response.success) {
                    this.localStorageService.setItem(this.SESSION_KEY, response.session_id);
                }
            }),
        );
    }

    signIn(): void {
        this.authFacade
            .createRequestToken()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response) => {
                if (response.success) {
                    const authUrl = `${this.TMDB_AUTH_URL}${response.request_token}?redirect_to=${this.ORIGIN}/auth-callback`;
                    window.open(authUrl, 'TMDB Authentication', 'width=800,height=600');
                }
            });
    }

    getSessionId(): string | null {
        return this.localStorageService.getItem<string>(this.SESSION_KEY);
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    getUserInfo(): Observable<UserInfo> {
        return this.authFacade.getUserInfo();
    }

    logout(): void {
        this.localStorageService.removeItem(this.SESSION_KEY);
        this.isAuthenticatedSubject.next(false);
    }
}
