import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, DestroyRef, HostListener, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BehaviorSubject, EMPTY, forkJoin, switchMap, take } from 'rxjs';

import { environment } from '../environments/environment';
import { BackToTopButtonComponent } from './shared/components/back-to-top-button/back-to-top-button.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { MobileNavigationComponent } from './shared/components/mobile-navigation/mobile-navigation.component';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';
import { AuthFacade } from './shared/facades/auth.facade';
import { GenreFacade } from './shared/facades/genre.facade';
import { Genre } from './shared/models/genre.model';
import { AuthService } from './shared/services/auth.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { SearchService } from './shared/services/search.service';
import { SnackbarService } from './shared/services/snackbar.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        HttpClientModule,
        CommonModule,
        HeaderComponent,
        MobileNavigationComponent,
        FooterComponent,
        BackToTopButtonComponent,
        LoadingComponent,
        SnackbarComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    isAppReady$ = new BehaviorSubject<boolean>(false);
    private authStateCheckTimeout: number | null = null;

    constructor(
        public searchService: SearchService,
        private localStorageService: LocalStorageService,
        private genresFacade: GenreFacade,
        private route: ActivatedRoute,
        private router: Router,
        private authFacade: AuthFacade,
        public authService: AuthService,
        private destroyRef: DestroyRef,
        public snackbarService: SnackbarService,
    ) {}

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler(event: any) {
        // Clear any pending auth state when user navigates away
        if (sessionStorage.getItem('auth_in_progress') === 'true') {
            this.cleanupAuthState();
        }
    }

    @HostListener('window:focus', ['$event'])
    onWindowFocus(event: any) {
        // Check auth state when window regains focus (important for mobile)
        this.checkForInterruptedAuth();
    }

    ngOnInit(): void {
        this.initializeGenres();
        this.handleTMDBAuthRedirect();
        this.listenAuthWindowMessages();

        // Only check for interrupted auth after a short delay to let handleTMDBAuthRedirect process first
        setTimeout(() => {
            this.checkForInterruptedAuth();
        }, 1000);
    }

    private handleTMDBAuthRedirect(): void {
        this.route.queryParams
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((params: { request_token?: string; approved?: string; denied?: string }) => {
                    const requestToken = params.request_token;
                    const approved = params.approved;
                    const denied = params.denied;
                    const wasRedirecting = sessionStorage.getItem('auth_in_progress') === 'true';

                    // Mark that we've handled the auth response
                    this.authService.setAuthHandled(true);

                    // If user is already authenticated, clean up any redirect state
                    if (this.authService.isAuthenticated()) {
                        if (wasRedirecting) {
                            this.cleanupAuthState();
                        }
                        return EMPTY;
                    }

                    // Handle successful auth
                    if (requestToken && approved === 'true') {
                        if (window.opener) {
                            // Desktop popup: send message to parent window
                            (window.opener as Window).postMessage(
                                {
                                    type: 'AUTH_SUCCESS',
                                    requestToken: requestToken,
                                },
                                environment.origin,
                            );
                            window.close();
                            return EMPTY;
                        }
                        // Mobile redirect: create session directly
                        return this.authFacade.createSession(requestToken);
                    }

                    // Handle denied auth
                    if (requestToken && denied === 'true') {
                        if (window.opener) {
                            // Desktop popup: send message to parent window
                            (window.opener as Window).postMessage(
                                {
                                    type: 'AUTH_DENIED',
                                },
                                environment.origin,
                            );
                            window.close();
                            return EMPTY;
                        }
                        // Mobile redirect: handle denial
                        this.cleanupAuthState();
                        this.snackbarService.error('Authentication was denied');
                        this.router.navigate([this.router.url.split('?')[0]], { replaceUrl: true });
                        return EMPTY;
                    }

                    // If we have auth parameters but no token, something went wrong
                    if (wasRedirecting && !requestToken && !approved && !denied) {
                        this.handleInterruptedAuth();
                        return EMPTY;
                    }

                    return EMPTY;
                }),
            )
            .subscribe({
                next: (createSessionResponse) => {
                    if (createSessionResponse?.success) {
                        this.authService.handleSessionSuccess(createSessionResponse);
                        this.router.navigate([this.router.url.split('?')[0]], { replaceUrl: true });
                    }

                    this.authService.updateAuthenticationLoadingState(false);
                    this.cleanupAuthState();
                },
                error: () => {
                    this.authService.updateAuthenticationLoadingState(false);
                    this.cleanupAuthState();
                    this.snackbarService.error('Authentication failed. Please try again.');
                },
            });
    }

    private checkForInterruptedAuth(): void {
        // Clear any existing timeout
        if (this.authStateCheckTimeout) {
            window.clearTimeout(this.authStateCheckTimeout);
        }

        // Don't check if we have auth query params (we're currently handling auth)
        const currentUrl = window.location.href;
        if (
            currentUrl.includes('request_token=') ||
            currentUrl.includes('approved=') ||
            currentUrl.includes('denied=')
        ) {
            return;
        }

        // Check if auth was in progress but never completed
        const wasInProgress = sessionStorage.getItem('auth_in_progress') === 'true';
        const authTimestamp = sessionStorage.getItem('auth_timestamp');
        const authHandled = this.authService.wasAuthHandled();

        // If user is already authenticated, clean up any stale auth state
        if (this.authService.isAuthenticated()) {
            if (wasInProgress) {
                this.cleanupAuthState();
            }
            return;
        }

        if (wasInProgress && !authHandled && authTimestamp) {
            const timeElapsed = Date.now() - parseInt(authTimestamp);
            const maxAuthTime = 5 * 60 * 1000; // 5 minutes

            if (timeElapsed > maxAuthTime) {
                // Auth has been pending too long, consider it interrupted
                this.handleInterruptedAuth();
            } else {
                // Set a timeout to check again later
                this.authStateCheckTimeout = window.setTimeout(() => {
                    // Double-check conditions before showing interrupted message
                    const stillInProgress = sessionStorage.getItem('auth_in_progress') === 'true';
                    const stillNotHandled = !this.authService.wasAuthHandled();
                    const notAuthenticated = !this.authService.isAuthenticated();

                    if (stillInProgress && stillNotHandled && notAuthenticated) {
                        this.handleInterruptedAuth();
                    }
                }, 10000); // Check again in 10 seconds
            }
        }
    }

    private handleInterruptedAuth(): void {
        this.cleanupAuthState();
        this.authService.updateAuthenticationLoadingState(false);
        this.snackbarService.error('Authentication was interrupted. Please try again.');
    }

    private cleanupAuthState(): void {
        // Clear timeout if exists
        if (this.authStateCheckTimeout) {
            window.clearTimeout(this.authStateCheckTimeout);
            this.authStateCheckTimeout = null;
        }

        // Clean up all auth-related sessionStorage
        sessionStorage.removeItem('auth_in_progress');
        sessionStorage.removeItem('auth_state');
        sessionStorage.removeItem('auth_redirect');
        sessionStorage.removeItem('auth_redirect_path');
        sessionStorage.removeItem('auth_redirect_url');
        sessionStorage.removeItem('auth_redirect_timestamp');
        sessionStorage.removeItem('auth_timestamp');
        sessionStorage.removeItem('auth_was_handled');

        // Only reset auth handled flag if user is not authenticated
        if (!this.authService.isAuthenticated()) {
            this.authService.setAuthHandled(false);
        }
    }

    private listenAuthWindowMessages(): void {
        window.addEventListener('message', (event) => {
            if (event.origin !== environment.origin) {
                return;
            }

            if (event.data.type === 'AUTH_SUCCESS') {
                this.authService.handleAuthSuccessStatus(event.data.requestToken);
            }

            if (event.data.type === 'AUTH_DENIED') {
                this.authService.handleAuthDeniedStatus();
            }
        });
    }

    private initializeGenres(): void {
        const storedMovieGenres = this.localStorageService.getItem<Array<Genre>>('movieGenres') ?? [];
        const storedTvShowGenres = this.localStorageService.getItem<Array<Genre>>('tvShowGenres') ?? [];

        if (storedMovieGenres.length > 0 && storedTvShowGenres?.length > 0) {
            this.isAppReady$.next(true);
        } else {
            forkJoin({
                movieGenres: this.genresFacade.getMovieGenres(),
                tvShowGenres: this.genresFacade.getTvShowGenres(),
            })
                .pipe(take(1))
                .subscribe({
                    next: (results) => {
                        if (!storedMovieGenres?.length) {
                            this.localStorageService.setItem<Array<Genre>>('movieGenres', results.movieGenres.genres);
                        }

                        if (!storedTvShowGenres?.length) {
                            this.localStorageService.setItem<Array<Genre>>('tvShowGenres', results.tvShowGenres.genres);
                        }

                        this.isAppReady$.next(true);
                    },
                    error: () => {
                        this.snackbarService.error('Failed to load genres');
                    },
                });
        }
    }
}
