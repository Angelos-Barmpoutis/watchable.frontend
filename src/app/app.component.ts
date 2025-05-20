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
    isAuthLoading$ = new BehaviorSubject<boolean>(false);

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
        this.initializeApp();
        this.handleAuthCallback();
    }

    private handleAuthCallback(): void {
        this.route.queryParams
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((params: { request_token?: string; approved?: string; denied?: string }) => {
                    const requestToken = params.request_token;
                    const approved = params.approved;
                    const denied = params.denied;

                    if (this.authService.isAuthenticated()) {
                        return EMPTY;
                    }

                    if (requestToken != null) {
                        if (approved === 'true') {
                            if (window.opener) {
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
                            this.isAuthLoading$.next(true);
                            return this.authFacade.createSession(requestToken);
                        }

                        if (denied === 'true') {
                            this.snackbarService.error('Authentication was denied. Please try again.');
                            window.close();
                            return EMPTY;
                        }
                    }
                    return EMPTY;
                }),
            )
            .subscribe((response) => {
                if (response?.success) {
                    this.authService.handleAuthSuccess(response);
                    this.router.navigate([this.router.url.split('?')[0]]);
                }
                this.isAuthLoading$.next(false);
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
