import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AccountFacade } from '../facades/account.facade';
import { AuthFacade } from '../facades/auth.facade';
import { Account } from '../models/account.model';
import { CreateSessionResponse } from '../models/auth.model';
import { LocalStorageService } from './local-storage.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly SESSION_KEY = 'tmdb_session_id';
    private readonly USER_INFO_KEY = 'tmdb_user_info';
    private readonly AUTH_STATE_KEY = 'auth_state';
    private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
    private readonly userInfoSubject = new BehaviorSubject<Account | null>(null);

    readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    readonly isLoading$ = this.isLoadingSubject.asObservable();
    readonly userInfo$ = this.userInfoSubject.asObservable();

    constructor(
        private authFacade: AuthFacade,
        private accountFacade: AccountFacade,
        private localStorageService: LocalStorageService,
        private destroyRef: DestroyRef,
        private snackbarService: SnackbarService,
        private router: Router,
    ) {
        const sessionId = this.getSessionId();
        const userInfo = this.getUserInfoFromStorage();
        this.isAuthenticatedSubject.next(!!sessionId);
        this.userInfoSubject.next(userInfo);
        this.listenForAuthSuccess();
        this.restoreAuthState();
    }

    private restoreAuthState(): void {
        const authState = sessionStorage.getItem(this.AUTH_STATE_KEY);
        if (authState) {
            console.log('AuthService: Restoring auth state:', authState);
            const state = JSON.parse(authState);
            this.isLoadingSubject.next(state.isLoading);
            if (state.isLoading && !state.isRedirecting) {
                console.log('AuthService: Auth was in progress (not redirecting), cleaning up');
                this.isLoadingSubject.next(false);
                sessionStorage.removeItem(this.AUTH_STATE_KEY);
            }
        }
    }

    private saveAuthState(isLoading: boolean, isRedirecting: boolean = false): void {
        const state = { isLoading, isRedirecting };
        console.log('AuthService: Saving auth state:', state);
        sessionStorage.setItem(this.AUTH_STATE_KEY, JSON.stringify(state));
    }

    handleAuthSuccess(response: CreateSessionResponse): void {
        console.log('AuthService: Handling auth success:', response);
        if (response.success) {
            console.log('AuthService: Storing session ID');
            this.localStorageService.setItem(this.SESSION_KEY, response.session_id);
            this.isAuthenticatedSubject.next(true);
            sessionStorage.removeItem('auth_in_progress');
            this.saveAuthState(false);

            console.log('AuthService: Fetching user info');
            this.getUserInfo()
                .pipe(
                    takeUntilDestroyed(this.destroyRef),
                    catchError((error) => {
                        console.error('AuthService: Error fetching user info:', error);
                        this.snackbarService.success('Signed in');
                        return of(null);
                    }),
                )
                .subscribe((userInfo) => {
                    if (userInfo) {
                        console.log('AuthService: User info received:', userInfo);
                        this.storeUserInfo(userInfo);
                        this.snackbarService.success(`Signed in as ${userInfo.username}`);
                    }
                });
        } else {
            console.log('AuthService: Failed to create session');
            this.snackbarService.error('Failed to create session. Please try again.');
            this.isLoadingSubject.next(false);
            sessionStorage.removeItem('auth_in_progress');
            this.saveAuthState(false);
        }
    }

    private listenForAuthSuccess(): void {
        window.addEventListener('message', (event: MessageEvent<{ type: string; requestToken: string }>) => {
            if (event.origin === environment.origin) {
                if (event.data.type === 'AUTH_SUCCESS') {
                    this.createSession(event.data.requestToken)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: (response) => this.handleAuthSuccess(response),
                            error: () => {
                                this.snackbarService.error('Failed to sign in. Please try again.');
                                this.isLoadingSubject.next(false);
                            },
                        });
                } else if (event.data.type === 'AUTH_DENIED') {
                    this.snackbarService.error('Authentication was denied. Please try again.');
                    this.isLoadingSubject.next(false);
                }
            }
        });
    }

    private createSession(requestToken: string): Observable<CreateSessionResponse> {
        return this.authFacade.createSession(requestToken).pipe(
            tap((response) => {
                if (response.success) {
                    this.localStorageService.setItem(this.SESSION_KEY, response.session_id);
                }
            }),
        );
    }

    signIn(): void {
        console.log('AuthService: Starting sign in process');
        console.log('Current state:', {
            isAuthenticated: this.isAuthenticated(),
            isLoading: this.isLoadingSubject.value,
            sessionId: this.getSessionId(),
            url: window.location.href,
        });

        this.isLoadingSubject.next(true);
        this.saveAuthState(true);

        this.authFacade
            .createRequestToken()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('AuthService: Request token response:', response);
                    if (response?.success) {
                        const currentPath = window.location.pathname;
                        const authUrl = `${environment.TMDBAuthUrl}${response.request_token}?redirect_to=${environment.origin}${currentPath}`;
                        console.log('AuthService: Constructed auth URL:', authUrl);
                        console.log('AuthService: Is mobile device:', this.isMobileDevice());

                        if (this.isMobileDevice()) {
                            console.log('AuthService: Using mobile flow');
                            console.log('AuthService: Storing auth state in sessionStorage');
                            sessionStorage.setItem('auth_redirect_path', currentPath);
                            sessionStorage.setItem('auth_in_progress', 'true');
                            this.saveAuthState(true, true);
                            console.log('AuthService: Redirecting to:', authUrl);
                            window.location.href = authUrl;
                        } else {
                            console.log('AuthService: Using desktop flow');
                            const popup = window.open(authUrl, 'TMDB Authentication', 'width=800,height=600');

                            if (popup) {
                                console.log('AuthService: Popup opened successfully');
                                const checkPopup = setInterval(() => {
                                    if (popup.closed) {
                                        console.log('AuthService: Popup closed');
                                        clearInterval(checkPopup);
                                        setTimeout(() => {
                                            if (!this.getSessionId()) {
                                                console.log('AuthService: No session found after popup closed');
                                                this.snackbarService.error(
                                                    'Authentication was denied. Please try again.',
                                                );
                                            }
                                            this.isLoadingSubject.next(false);
                                        }, 500);
                                    }
                                }, 500);
                            } else {
                                console.log('AuthService: Failed to open popup');
                                this.isLoadingSubject.next(false);
                                this.saveAuthState(false);
                                this.snackbarService.error('Failed to open authentication window. Please try again.');
                            }
                        }
                    } else {
                        console.log('AuthService: Failed to create request token');
                        this.isLoadingSubject.next(false);
                        this.saveAuthState(false);
                        this.snackbarService.error('Failed to create request token. Please try again.');
                    }
                },
                error: (error) => {
                    console.error('AuthService: Sign in error:', error);
                    this.isLoadingSubject.next(false);
                    this.saveAuthState(false);
                    this.snackbarService.error('Failed to start authentication process. Please try again.');
                },
            });
    }

    getUserInfo(): Observable<Account | null> {
        return this.accountFacade.getAccountInfo().pipe(
            catchError(() => {
                this.snackbarService.error('Failed to get user information. Please try again.');
                return of(null);
            }),
        );
    }

    signOut(): void {
        const sessionId = this.getSessionId();
        if (sessionId) {
            this.authFacade
                .deleteSession(sessionId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((response) => {
                    if (response.success) {
                        this.clearAuthData();
                        this.snackbarService.success('Signed out');
                        this.router.navigate(['/']);
                    } else {
                        this.snackbarService.error('Failed to sign out. Please try again.');
                    }
                });
        } else {
            this.clearAuthData();
            this.snackbarService.success('Signed out');
        }
    }

    private clearAuthData(): void {
        this.localStorageService.removeItem(this.SESSION_KEY);
        this.localStorageService.removeItem(this.USER_INFO_KEY);
        this.isAuthenticatedSubject.next(false);
        this.userInfoSubject.next(null);
    }

    private storeUserInfo(userInfo: Account): void {
        this.localStorageService.setItem(this.USER_INFO_KEY, userInfo);
        this.userInfoSubject.next(userInfo);
    }

    private getUserInfoFromStorage(): Account | null {
        return this.localStorageService.getItem<Account>(this.USER_INFO_KEY);
    }

    private isMobileDevice(): boolean {
        const userAgent = navigator.userAgent;
        console.log('AuthService: User agent:', userAgent);
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        console.log('AuthService: Is mobile device:', isMobile);
        return isMobile;
    }

    getSessionId(): string | null {
        return this.localStorageService.getItem<string>(this.SESSION_KEY);
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }
}
