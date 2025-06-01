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
    }

    private storeUser(): void {
        this.getUserInfo()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((userInfo) => {
                if (userInfo) {
                    this.localStorageService.setItem(this.USER_INFO_KEY, userInfo);
                    this.userInfoSubject.next(userInfo);
                    this.snackbarService.success(`Signed in as ${userInfo.username}`);
                } else {
                    this.snackbarService.error('Failed to get user information. Please try again.');
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

    private getAuthUrl(requestToken: string): string {
        const currentPath = window.location.pathname;
        return `${environment.TMDBAuthUrl}${requestToken}?redirect_to=${environment.origin}${currentPath}`;
    }

    private handleMobileAuth(authUrl: string): void {
        sessionStorage.setItem('auth_redirect', 'true');
        window.location.href = authUrl;
    }

    private clearAuthData(): void {
        this.localStorageService.removeItem(this.SESSION_KEY);
        this.localStorageService.removeItem(this.USER_INFO_KEY);
        this.isAuthenticatedSubject.next(false);
        this.userInfoSubject.next(null);
    }

    private getUserInfoFromStorage(): Account | null {
        return this.localStorageService.getItem<Account>(this.USER_INFO_KEY);
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
                next: (requestTokenResponse) => {
                    if (requestTokenResponse?.success) {
                        const authUrl = this.getAuthUrl(requestTokenResponse.request_token);

                        if (this.isMobileDevice()) {
                            this.handleMobileAuth(authUrl);
                        } else {
                            // Desktop flow with popup
                            const popupWindow = window.open(authUrl, 'TMDB Authentication', 'width=800,height=600');

                            if (popupWindow) {
                                const checkPopup = setInterval(() => {
                                    if (popupWindow.closed) {
                                        clearInterval(checkPopup);
                                        setTimeout(() => {
                                            if (!this.getSessionId()) {
                                                this.snackbarService.error(
                                                    'Authentication was cancelled. Please try again.',
                                                );
                                            }
                                            this.isLoadingSubject.next(false);
                                        }, 500);
                                    }
                                }, 500);
                            } else {
                                this.isLoadingSubject.next(false);
                                this.snackbarService.error('Failed to open authentication window. Please try again.');
                            }
                        }
                    } else {
                        this.isLoadingSubject.next(false);
                        this.snackbarService.error('Failed to create request token. Please try again.');
                    }
                },
                error: (error) => {
                    console.error('Sign in error:', error);
                    this.isLoadingSubject.next(false);
                    this.snackbarService.error('Failed to start authentication process. Please try again.');
                },
            });
    }

    handleSessionSuccess(createSessionResponse: CreateSessionResponse): void {
        this.localStorageService.setItem(this.SESSION_KEY, createSessionResponse.session_id);
        this.storeUser();
        this.isAuthenticatedSubject.next(true);
        this.isLoadingSubject.next(false);
    }

    handleAuthSuccessStatus(requestToken: string): void {
        this.createSession(requestToken)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((createSessionResponse) => {
                if (createSessionResponse.success) {
                    this.handleSessionSuccess(createSessionResponse);
                } else {
                    this.snackbarService.error('Failed to create session. Please try again.');
                    this.isLoadingSubject.next(false);
                }
            });
    }

    handleAuthDeniedStatus(): void {
        this.snackbarService.error('Authentication was denied. Please try again.');
        this.isLoadingSubject.next(false);
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

    getSessionId(): string | null {
        return this.localStorageService.getItem<string>(this.SESSION_KEY);
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }
}
