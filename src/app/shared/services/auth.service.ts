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
    private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

    readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    readonly isLoading$ = this.isLoadingSubject.asObservable();

    constructor(
        private authFacade: AuthFacade,
        private localStorageService: LocalStorageService,
        private destroyRef: DestroyRef,
    ) {
        const sessionId = this.getSessionId();
        this.isAuthenticatedSubject.next(!!sessionId);

        this.listenForAuthSuccess();
    }

    handleAuthSuccess(response: SessionResponse): void {
        if (response.success) {
            this.localStorageService.setItem(this.SESSION_KEY, response.session_id);
            this.isAuthenticatedSubject.next(true);
        }
    }

    private listenForAuthSuccess(): void {
        window.addEventListener('message', (event: MessageEvent<{ type: string; requestToken: string }>) => {
            if (event.origin === this.ORIGIN && event.data.type === 'AUTH_SUCCESS') {
                this.createSession(event.data.requestToken)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((response) => this.handleAuthSuccess(response));
            }
        });
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

    private isMobileDevice(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    signIn(): void {
        this.isLoadingSubject.next(true);
        this.authFacade
            .createRequestToken()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        const currentPath = window.location.pathname;
                        const authUrl = `${this.TMDB_AUTH_URL}${response.request_token}?redirect_to=${this.ORIGIN}${currentPath}`;

                        if (this.isMobileDevice()) {
                            window.location.href = authUrl;
                        } else {
                            const popup = window.open(authUrl, 'TMDB Authentication', 'width=800,height=600');

                            if (popup) {
                                const checkPopup = setInterval(() => {
                                    if (popup.closed) {
                                        clearInterval(checkPopup);
                                        this.isLoadingSubject.next(false);
                                    }
                                }, 500);
                            } else {
                                this.isLoadingSubject.next(false);
                            }
                        }
                    }
                },
                error: () => {
                    this.isLoadingSubject.next(false);
                },
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
