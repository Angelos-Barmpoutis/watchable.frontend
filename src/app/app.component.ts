import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, DestroyRef, OnInit } from '@angular/core';
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

    ngOnInit(): void {
        this.initializeGenres();
        this.handleTMDBAuthRedirect();
    }

    private handleTMDBAuthRedirect(): void {
        this.route.queryParams
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((params: { request_token?: string; approved?: string; denied?: string }) => {
                    const requestToken = params.request_token;
                    const approved = params.approved;
                    const denied = params.denied;
                    const wasRedirecting = sessionStorage.getItem('auth_redirect') === 'true';

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
                            this.authService.handleAuthSuccessStatus(requestToken);
                            window.close();
                            return EMPTY;
                        }

                        return this.authFacade.createSession(requestToken);
                    }

                    // Handle denied auth
                    if (requestToken && denied === 'true') {
                        if (window.opener) {
                            this.authService.handleAuthDeniedStatus();
                            window.close();
                            return EMPTY;
                        }
                        this.cleanupAuthState();
                        this.snackbarService.error('Authentication was denied');
                        this.router.navigate([this.router.url.split('?')[0]], { replaceUrl: true });
                        return EMPTY;
                    }

                    // Only treat as cancelled if we were redirecting AND have no auth-related params at all
                    // AND the URL doesn't look like it's still loading auth params
                    if (
                        wasRedirecting &&
                        !requestToken &&
                        !approved &&
                        !denied &&
                        !window.location.href.includes('request_token')
                    ) {
                        this.cleanupAuthState();
                        this.snackbarService.error('Authentication was cancelled');
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
                    this.cleanupAuthState();
                },
                error: () => {
                    this.cleanupAuthState();
                },
            });
    }

    private cleanupAuthState(): void {
        // Clean up all auth-related sessionStorage
        sessionStorage.removeItem('auth_in_progress');
        sessionStorage.removeItem('auth_state');
        sessionStorage.removeItem('auth_redirect');
        sessionStorage.removeItem('auth_redirect_path');
        sessionStorage.removeItem('auth_redirect_url');
        sessionStorage.removeItem('auth_redirect_timestamp');
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
