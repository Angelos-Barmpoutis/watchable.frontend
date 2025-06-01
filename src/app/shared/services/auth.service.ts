import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AccountFacade } from '../facades/account.facade';
import { AuthFacade } from '../facades/auth.facade';
import { createAuthPopup, getAuthUrl, handleMobileAuthRedirect, isMobileDevice } from '../helpers/auth.helper';
import { Account } from '../models/account.model';
import { CreateSessionResponse } from '../models/auth.model';
import { LocalStorageService } from './local-storage.service';
import { SnackbarService } from './snackbar.service';

/**
 * Authentication service for TMDB user authentication
 * Manages user session state, authentication flow, and user information
 */
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly SESSION_KEY = 'tmdb_session_id';
    private readonly USER_INFO_KEY = 'tmdb_user_info';

    private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
    private readonly userInfoSubject = new BehaviorSubject<Account | null>(null);

    /** Observable stream of authentication status changes */
    readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    /** Observable stream of authentication loading state */
    readonly isLoading$ = this.isLoadingSubject.asObservable();

    /** Observable stream of user information changes */
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

    /**
     * Stores user information after successful authentication
     * @private
     */
    private storeUser(): void {
        this.getUserInfo()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((userInfo) => {
                if (userInfo) {
                    this.localStorageService.setItem(this.USER_INFO_KEY, userInfo);
                    this.userInfoSubject.next(userInfo);
                    this.snackbarService.success(`Signed in as ${userInfo.username}`);
                } else {
                    this.snackbarService.error('Failed to get user information');
                }
            });
    }

    /**
     * Creates a TMDB session using the request token
     * @param requestToken - The authorized request token from TMDB
     * @returns Observable of session creation response
     * @private
     */
    private createSession(requestToken: string): Observable<CreateSessionResponse> {
        return this.authFacade.createSession(requestToken).pipe(
            tap((response) => {
                if (response.success) {
                    this.localStorageService.setItem(this.SESSION_KEY, response.session_id);
                }
            }),
        );
    }

    /**
     * Clears all authentication data from storage and resets state
     * @private
     */
    private clearAuthData(): void {
        this.localStorageService.removeItem(this.SESSION_KEY);
        this.localStorageService.removeItem(this.USER_INFO_KEY);
        this.isAuthenticatedSubject.next(false);
        this.userInfoSubject.next(null);
    }

    /**
     * Retrieves cached user information from storage
     * @returns User account information or null if not found
     * @private
     */
    private getUserInfoFromStorage(): Account | null {
        return this.localStorageService.getItem<Account>(this.USER_INFO_KEY);
    }

    /**
     * Handles successful session creation and updates user state
     * @param createSessionResponse - The successful session creation response
     */
    handleSessionSuccess(createSessionResponse: CreateSessionResponse): void {
        this.localStorageService.setItem(this.SESSION_KEY, createSessionResponse.session_id);
        this.storeUser();
        this.isAuthenticatedSubject.next(true);
        this.updateAuthenticationLoadingState(false);
    }

    /**
     * Handles successful authentication status from popup window
     * @param requestToken - The authorized request token from TMDB
     */
    handleAuthSuccessStatus(requestToken: string): void {
        this.updateAuthenticationLoadingState(true);

        this.createSession(requestToken)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((createSessionResponse) => {
                if (createSessionResponse.success) {
                    this.handleSessionSuccess(createSessionResponse);
                } else {
                    this.updateAuthenticationLoadingState(false);
                    this.snackbarService.error('Failed to create session');
                }
            })
            .add(() => this.updateAuthenticationLoadingState(false));
    }

    /**
     * Handles authentication denial from popup window
     */
    handleAuthDeniedStatus(): void {
        this.updateAuthenticationLoadingState(false);
        this.snackbarService.error('Authentication was denied');
    }

    /**
     * Retrieves current user account information from TMDB API
     * @returns Observable of user account information or null if failed
     */
    getUserInfo(): Observable<Account | null> {
        return this.accountFacade.getAccountInfo().pipe(
            catchError(() => {
                this.snackbarService.error('Failed to get user information');
                return of(null);
            }),
        );
    }

    /**
     * Initiates the authentication flow for both mobile and desktop
     */
    signIn(): void {
        this.isLoadingSubject.next(true);

        this.authFacade
            .createRequestToken()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (requestTokenResponse) => {
                    if (requestTokenResponse?.success) {
                        const authUrl = getAuthUrl(requestTokenResponse.request_token);

                        if (isMobileDevice()) {
                            handleMobileAuthRedirect(authUrl, () => {
                                if (this.isLoadingSubject.value && !this.isAuthenticated()) {
                                    this.updateAuthenticationLoadingState(false);
                                }
                            });
                        } else {
                            // Desktop flow with popup using helper
                            const popupWindow = createAuthPopup(
                                authUrl,
                                () => {
                                    // On popup close
                                    setTimeout(() => {
                                        if (this.isLoadingSubject.value && !this.getSessionId()) {
                                            this.snackbarService.error('Authentication was cancelled');
                                            this.updateAuthenticationLoadingState(false);
                                        }
                                    }, 500);
                                },
                                () => {
                                    // On timeout
                                    this.updateAuthenticationLoadingState(false);
                                    this.snackbarService.error('Authentication timeout. Please try again.');
                                },
                            );

                            if (!popupWindow) {
                                this.updateAuthenticationLoadingState(false);
                                this.snackbarService.error('Failed to open authentication window');
                            }
                        }
                    } else {
                        this.updateAuthenticationLoadingState(false);
                        this.snackbarService.error('Failed to create request token');
                    }
                },
                error: (error: unknown) => {
                    console.error('Sign in error:', error);
                    this.updateAuthenticationLoadingState(false);
                    this.snackbarService.error('Failed to start authentication process');
                },
            });
    }

    /**
     * Signs out the current user and clears all authentication data
     */
    signOut(): void {
        const sessionId = this.getSessionId();
        if (sessionId) {
            this.updateAuthenticationLoadingState(true);

            this.authFacade
                .deleteSession(sessionId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((response) => {
                    if (response.success) {
                        this.clearAuthData();
                        this.updateAuthenticationLoadingState(false);
                        this.snackbarService.success('Signed out');
                        this.router.navigate(['/']);
                    } else {
                        this.updateAuthenticationLoadingState(false);
                        this.snackbarService.error('Failed to sign out');
                    }
                });
        } else {
            this.clearAuthData();
            this.updateAuthenticationLoadingState(false);
            this.snackbarService.success('Signed out');
        }
    }

    /**
     * Gets the current session ID from storage
     * @returns The TMDB session ID or null if not authenticated
     */
    getSessionId(): string | null {
        return this.localStorageService.getItem<string>(this.SESSION_KEY);
    }

    /**
     * Checks if the user is currently authenticated
     * @returns True if user is authenticated, false otherwise
     */
    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    /**
     * Updates the authentication loading state
     * @param isLoading - Whether authentication is currently loading
     */
    updateAuthenticationLoadingState(isLoading: boolean): void {
        this.isLoadingSubject.next(isLoading);
    }
}
