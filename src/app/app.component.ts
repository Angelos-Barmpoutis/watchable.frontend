import { CommonModule } from '@angular/common';
import {} from '@angular/common/http';
import { Component, DestroyRef, inject,OnInit } from '@angular/core';
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
    private destroyRef = inject(DestroyRef);

    constructor(
        public searchService: SearchService,
        private localStorageService: LocalStorageService,
        private genresFacade: GenreFacade,
        private route: ActivatedRoute,
        private router: Router,
        private authFacade: AuthFacade,
        public authService: AuthService,
        public snackbarService: SnackbarService,
    ) {}

    ngOnInit(): void {
        this.initializeGenres();
        this.handleTMDBAuthRedirect();
        this.listenAuthWindowMessages();
    }

    private handleTMDBAuthRedirect(): void {
        this.route.queryParams
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((params: { request_token?: string; approved?: string; denied?: string }) => {
                    const requestToken = params.request_token;
                    const approved = params.approved;
                    const denied = params.denied;

                    // If user is already authenticated, clean up any redirect state
                    if (this.authService.isAuthenticated()) {
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
                        this.authService.updateAuthenticationLoadingState(false);
                        this.snackbarService.error('Authentication was denied');
                        this.router.navigate([this.router.url.split('?')[0]], { replaceUrl: true });
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
                },
                error: () => {
                    this.authService.updateAuthenticationLoadingState(false);
                    this.snackbarService.error('Authentication failed. Please try again.');
                },
            });
    }

    private listenAuthWindowMessages(): void {
        window.addEventListener('message', (event) => {
            if (event.origin !== environment.origin || !event.data) {
                return;
            }

            const data = event.data as { type?: string; requestToken?: string };

            if (data.type === 'AUTH_SUCCESS' && data.requestToken) {
                this.authService.handleAuthSuccessStatus(data.requestToken);
            }

            if (data.type === 'AUTH_DENIED') {
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
