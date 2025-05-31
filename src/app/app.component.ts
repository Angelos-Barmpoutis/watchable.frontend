import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, DestroyRef, HostListener, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BehaviorSubject, EMPTY, forkJoin, switchMap, take } from 'rxjs';

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
    isAuthLoading$ = new BehaviorSubject<boolean>(false);
    private isAuthInProgress = false;

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
    ) {
        // Check for redirect state on component initialization
        const isRedirecting = sessionStorage.getItem('auth_redirect') === 'true';
        if (isRedirecting) {
            console.log('AppComponent: Detected redirect state on initialization');
            this.isAuthInProgress = true;
            this.isAuthLoading$.next(true);
        }

        // Add visibility change listener
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log('AppComponent: Tab became visible, checking state');
                this.checkAndRestoreState();
            }
        });
    }

    private checkAndRestoreState(): void {
        console.log('AppComponent: Checking and restoring state');
        const isRedirecting = sessionStorage.getItem('auth_redirect') === 'true';
        const stateStr = sessionStorage.getItem('auth_state');

        console.log('AppComponent: Current state check:', {
            isRedirecting,
            stateStr,
            url: window.location.href,
            isAuthInProgress: this.isAuthInProgress,
            isLoading: this.isAuthLoading$.value,
        });

        if (isRedirecting) {
            console.log('AppComponent: Restoring redirect state');
            this.isAuthInProgress = true;
            this.isAuthLoading$.next(true);
        }
    }

    @HostListener('window:popstate', ['$event'])
    onPopState(): void {
        console.log('PopState event triggered');
        console.log('Current auth state:', {
            isAuthInProgress: this.isAuthInProgress,
            isLoading: this.isAuthLoading$.value,
            isRedirecting: this.authService.isRedirectingSubject.value,
            url: window.location.href,
            sessionStorage: {
                auth_in_progress: sessionStorage.getItem('auth_in_progress'),
                auth_state: sessionStorage.getItem('auth_state'),
                auth_redirect: sessionStorage.getItem('auth_redirect'),
            },
        });

        // Only clean up if we're not in a redirect flow
        if (
            !this.authService.isRedirectingSubject.value &&
            (this.isAuthInProgress || sessionStorage.getItem('auth_in_progress') === 'true')
        ) {
            console.log('Cleaning up auth state after popstate');
            this.isAuthLoading$.next(false);
            this.isAuthInProgress = false;
            sessionStorage.removeItem('auth_in_progress');
            sessionStorage.removeItem('auth_state');
            sessionStorage.removeItem('auth_redirect');
            this.snackbarService.error('Authentication was cancelled');
            this.router.navigate([this.router.url.split('?')[0]], { replaceUrl: true });
        } else if (this.authService.isRedirectingSubject.value) {
            console.log('Preserving auth state during popstate (redirect in progress)');
        }
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(): void {
        console.log('BeforeUnload event triggered');
        console.log('Current auth state:', {
            isAuthInProgress: this.isAuthInProgress,
            isLoading: this.isAuthLoading$.value,
            isRedirecting: this.authService.isRedirectingSubject.value,
            url: window.location.href,
            sessionStorage: {
                auth_in_progress: sessionStorage.getItem('auth_in_progress'),
                auth_state: sessionStorage.getItem('auth_state'),
                auth_redirect: sessionStorage.getItem('auth_redirect'),
            },
        });

        // Only clean up if we're not redirecting to TMDB
        if (
            !this.authService.isRedirectingSubject.value &&
            (this.isAuthInProgress || sessionStorage.getItem('auth_in_progress') === 'true')
        ) {
            console.log('Cleaning up auth state before unload (not redirecting)');
            this.isAuthLoading$.next(false);
            this.isAuthInProgress = false;
            sessionStorage.removeItem('auth_in_progress');
            sessionStorage.removeItem('auth_state');
            sessionStorage.removeItem('auth_redirect');
        } else if (this.authService.isRedirectingSubject.value) {
            console.log('Preserving auth state during redirect');
        }
    }

    ngOnInit(): void {
        console.log('AppComponent initialized');
        this.initializeApp();
        this.handleAuthCallback();
    }

    private handleAuthCallback(): void {
        console.log('Starting auth callback handler');
        console.log('Initial state:', {
            isAuthInProgress: this.isAuthInProgress,
            isLoading: this.isAuthLoading$.value,
            isRedirecting: this.authService.isRedirectingSubject.value,
            isAuthenticated: this.authService.isAuthenticated(),
            sessionStorage: {
                auth_in_progress: sessionStorage.getItem('auth_in_progress'),
                auth_state: sessionStorage.getItem('auth_state'),
                auth_redirect: sessionStorage.getItem('auth_redirect'),
            },
        });

        // Check if we're returning from a redirect
        const isRedirecting = sessionStorage.getItem('auth_redirect') === 'true';
        if (isRedirecting) {
            console.log('Detected return from redirect');
            this.isAuthInProgress = true;
            this.isAuthLoading$.next(true);
        }

        this.route.queryParams
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((params: { request_token?: string; approved?: string; denied?: string }) => {
                    console.log('Auth callback params:', params);
                    console.log('Current URL:', window.location.href);
                    console.log('Current auth state:', {
                        isAuthInProgress: this.isAuthInProgress,
                        isLoading: this.isAuthLoading$.value,
                        isRedirecting: this.authService.isRedirectingSubject.value,
                        isAuthenticated: this.authService.isAuthenticated(),
                        sessionStorage: {
                            auth_in_progress: sessionStorage.getItem('auth_in_progress'),
                            auth_state: sessionStorage.getItem('auth_state'),
                            auth_redirect: sessionStorage.getItem('auth_redirect'),
                        },
                    });

                    const requestToken = params.request_token;
                    const approved = params.approved;
                    const denied = params.denied;

                    if (this.authService.isAuthenticated()) {
                        console.log('User already authenticated, skipping auth flow');
                        return EMPTY;
                    }

                    if (requestToken != null) {
                        console.log('Request token found:', requestToken);
                        if (approved === 'true') {
                            console.log('Auth approved');
                            if (window.opener) {
                                console.log('Window opener exists, sending message');
                                (window.opener as Window).postMessage(
                                    {
                                        type: 'AUTH_SUCCESS',
                                        requestToken: requestToken,
                                    },
                                    window.location.origin,
                                );
                                window.close();
                                return EMPTY;
                            }
                            console.log('No window opener, creating session');
                            this.isAuthInProgress = true;
                            sessionStorage.setItem('auth_in_progress', 'true');
                            this.isAuthLoading$.next(true);
                            console.log('State before creating session:', {
                                isAuthInProgress: this.isAuthInProgress,
                                isLoading: this.isAuthLoading$.value,
                                isRedirecting: this.authService.isRedirectingSubject.value,
                                sessionStorage: {
                                    auth_in_progress: sessionStorage.getItem('auth_in_progress'),
                                    auth_state: sessionStorage.getItem('auth_state'),
                                    auth_redirect: sessionStorage.getItem('auth_redirect'),
                                },
                            });
                            return this.authFacade.createSession(requestToken);
                        }

                        if (denied === 'true') {
                            console.log('Auth denied');
                            this.isAuthInProgress = false;
                            sessionStorage.removeItem('auth_in_progress');
                            sessionStorage.removeItem('auth_state');
                            sessionStorage.removeItem('auth_redirect');
                            this.isAuthLoading$.next(false);
                            this.snackbarService.error('Authentication was denied. Please try again.');
                            this.router.navigate([this.router.url.split('?')[0]], { replaceUrl: true });
                            return EMPTY;
                        }
                    }
                    console.log('No auth params found');
                    return EMPTY;
                }),
            )
            .subscribe({
                next: (response) => {
                    console.log('Auth response received:', response);
                    if (response?.success) {
                        console.log('Auth successful, handling success');
                        this.authService.handleAuthSuccess(response);
                        this.router.navigate([this.router.url.split('?')[0]], { replaceUrl: true });
                    }
                    console.log('Cleaning up auth state after response');
                    this.isAuthInProgress = false;
                    sessionStorage.removeItem('auth_in_progress');
                    sessionStorage.removeItem('auth_state');
                    sessionStorage.removeItem('auth_redirect');
                    this.isAuthLoading$.next(false);
                },
                error: (error) => {
                    console.error('Auth error:', error);
                    console.log('Cleaning up auth state after error');
                    this.isAuthInProgress = false;
                    sessionStorage.removeItem('auth_in_progress');
                    sessionStorage.removeItem('auth_state');
                    sessionStorage.removeItem('auth_redirect');
                    this.isAuthLoading$.next(false);
                },
            });
    }

    private initializeApp(): void {
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
