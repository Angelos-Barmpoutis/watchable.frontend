import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AccountFacade } from '../facades/account.facade';
import { AuthFacade } from '../facades/auth.facade';
import { Account } from '../models/account.model';
import { SessionResponse } from '../models/auth.model';
import { LocalStorageService } from './local-storage.service';
import { SnackbarService } from './snackbar.service';

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
        private accountFacade: AccountFacade,
        private localStorageService: LocalStorageService,
        private destroyRef: DestroyRef,
        private snackbarService: SnackbarService,
    ) {
        const sessionId = this.getSessionId();
        this.isAuthenticatedSubject.next(!!sessionId);

        this.listenForAuthSuccess();
    }

    handleAuthSuccess(response: SessionResponse): void {
        if (response.success) {
            this.localStorageService.setItem(this.SESSION_KEY, response.session_id);
            this.isAuthenticatedSubject.next(true);

            this.getUserInfo()
                .pipe(
                    takeUntilDestroyed(this.destroyRef),
                    catchError(() => {
                        this.snackbarService.success('Signed in');
                        return of(null);
                    }),
                )
                .subscribe((userInfo) => {
                    if (userInfo) {
                        this.snackbarService.success(`Signed in as ${userInfo.username}`);
                    }
                });
        } else {
            this.snackbarService.error('Failed to create session');
            this.isLoadingSubject.next(false);
        }
    }

    private listenForAuthSuccess(): void {
        window.addEventListener('message', (event: MessageEvent<{ type: string; requestToken: string }>) => {
            if (event.origin === this.ORIGIN) {
                if (event.data.type === 'AUTH_SUCCESS') {
                    this.createSession(event.data.requestToken)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: (response) => this.handleAuthSuccess(response),
                            error: () => {
                                this.snackbarService.error('Failed to sign in');
                                this.isLoadingSubject.next(false);
                            },
                        });
                } else if (event.data.type === 'AUTH_DENIED') {
                    this.snackbarService.error('Authentication was denied');
                    this.isLoadingSubject.next(false);
                }
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

    signIn(): void {
        this.isLoadingSubject.next(true);
        this.authFacade
            .createRequestToken()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response?.success) {
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
                                        setTimeout(() => {
                                            if (!this.getSessionId()) {
                                                this.snackbarService.error('Authentication was denied');
                                            }
                                            this.isLoadingSubject.next(false);
                                        }, 500);
                                    }
                                }, 500);
                            } else {
                                this.isLoadingSubject.next(false);
                                this.snackbarService.error('Failed to open authentication window');
                            }
                        }
                    } else {
                        this.isLoadingSubject.next(false);
                        this.snackbarService.error('Failed to create request token');
                    }
                },
                error: () => {
                    this.isLoadingSubject.next(false);
                    this.snackbarService.error('Failed to start authentication process');
                },
            });
    }

    getUserInfo(): Observable<Account | null> {
        return this.accountFacade.getAccountInfo().pipe(
            catchError(() => {
                this.snackbarService.error('Failed to get user information');
                return of(null);
            }),
        );
    }

    signOut(): void {
        try {
            this.localStorageService.removeItem(this.SESSION_KEY);
            this.isAuthenticatedSubject.next(false);
            this.snackbarService.success('Signed out');
        } catch (error) {
            this.snackbarService.error('Failed to sign out');
        }
    }

    private isMobileDevice(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    getSessionId(): string | null {
        return this.localStorageService.getItem<string>(this.SESSION_KEY);
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }
}
