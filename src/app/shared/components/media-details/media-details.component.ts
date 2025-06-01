import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { asyncScheduler, BehaviorSubject, combineLatest, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { MediaType } from '../../enumerations/media-type.enum';
import { AccountFacade } from '../../facades/account.facade';
import { MovieFacade } from '../../facades/movie.facade';
import { TvShowFacade } from '../../facades/tv-show.facade';
import { MovieDetails } from '../../models/movie.model';
import { TvShowDetails } from '../../models/tv-show.model';
import { FormatNumberWithKPipe } from '../../pipes/format-number.pipe';
import { TimePipe } from '../../pipes/time.pipe';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

type MediaDetails = MovieDetails | TvShowDetails;

@Component({
    standalone: true,
    selector: 'app-media-details',
    imports: [CommonModule, RouterModule, FormatNumberWithKPipe, TimePipe],
    templateUrl: './media-details.component.html',
    styleUrls: ['./media-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDetailsComponent implements OnChanges, OnInit {
    @Input() mediaDetails!: MediaDetails | undefined;
    @Input() type: MediaType = MediaType.Movie;
    @Input() isLoading = true;
    userRating?: number;

    readonly mediaType = MediaType;

    private mediaDetailsSubject = new BehaviorSubject<MediaDetails | undefined>(undefined);

    constructor(
        private readonly movieFacade: MovieFacade,
        private readonly tvShowFacade: TvShowFacade,
        private readonly accountFacade: AccountFacade,
        private readonly authService: AuthService,
        private readonly snackbarService: SnackbarService,
        private readonly destroyRef: DestroyRef,
        private readonly cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        combineLatest([this.authService.isAuthenticated$, this.mediaDetailsSubject.asObservable()])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(([mediaDetails]) => {
                if (mediaDetails) {
                    this.getUserRating();
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['mediaDetails']) {
            this.mediaDetailsSubject.next(this.mediaDetails);
        }
    }

    get stars(): Array<number> {
        return Array(5)
            .fill(0)
            .map((_, index) => index + 1);
    }

    get isMovie(): boolean {
        return this.type === MediaType.Movie;
    }

    get isTvShow(): boolean {
        return this.type === MediaType.TvShow;
    }

    get movieDetails(): MovieDetails | null {
        return this.isMovie && this.mediaDetails ? (this.mediaDetails as MovieDetails) : null;
    }

    get tvShowDetails(): TvShowDetails | null {
        return this.isTvShow && this.mediaDetails ? (this.mediaDetails as TvShowDetails) : null;
    }

    get skeletonArray(): Array<number> {
        return Array(10)
            .fill(0)
            .map((_, index) => index);
    }

    get isUserAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    private getUserRating(): void {
        if (!this.authService.isAuthenticated()) {
            this.userRating = undefined;

            asyncScheduler.schedule(() => {
                this.cdr.detectChanges();
            });
            return;
        }

        this.authService.userInfo$
            .pipe(
                tap(() => {
                    this.isLoading = true;
                    this.cdr.detectChanges();
                }),
                takeUntilDestroyed(this.destroyRef),
                switchMap((userInfo) => {
                    switch (this.type) {
                        case MediaType.Movie:
                            // First get the first page to know total pages
                            return this.accountFacade.getRatedMovies(userInfo?.id ?? 0, 1).pipe(
                                switchMap((firstPage) => {
                                    if (!firstPage || firstPage.total_pages <= 1) {
                                        return of(firstPage);
                                    }

                                    // Create an array of observables for all pages
                                    const pageRequests = Array.from({ length: firstPage.total_pages - 1 }, (_, i) =>
                                        this.accountFacade.getRatedMovies(userInfo?.id ?? 0, i + 2),
                                    );

                                    // Combine all pages
                                    return forkJoin([of(firstPage), ...pageRequests]).pipe(
                                        map((pages) => ({
                                            ...firstPage,
                                            results: pages.flatMap((page) => page.results),
                                        })),
                                    );
                                }),
                            );
                        case MediaType.TvShow:
                            return this.accountFacade.getRatedTVShows(userInfo?.id ?? 0, 1).pipe(
                                switchMap((firstPage) => {
                                    if (!firstPage || firstPage.total_pages <= 1) {
                                        return of(firstPage);
                                    }

                                    // Create an array of observables for all pages
                                    const pageRequests = Array.from({ length: firstPage.total_pages - 1 }, (_, i) =>
                                        this.accountFacade.getRatedTVShows(userInfo?.id ?? 0, i + 2),
                                    );

                                    // Combine all pages
                                    return forkJoin([of(firstPage), ...pageRequests]).pipe(
                                        map((pages) => ({
                                            ...firstPage,
                                            results: pages.flatMap((page) => page.results),
                                        })),
                                    );
                                }),
                            );
                        default:
                            return of(null);
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (rated) => {
                    if (rated) {
                        const ratedItem = rated.results.find(
                            (item: { id: number }) => item.id === this.mediaDetails?.id,
                        );

                        this.userRating = ratedItem?.rating;
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    }
                },
                error: () => {
                    this.snackbarService.error('Failed to check rating status');
                },
            });
    }

    rateMedia(rating: number): void {
        if (!this.authService.isAuthenticated()) {
            this.snackbarService.warning('Please sign in to rate items');
            return;
        }

        const previousRating = this.userRating;
        this.userRating = rating;
        this.cdr.detectChanges();

        const request = { value: rating };

        if (this.type === MediaType.Movie) {
            this.movieFacade
                .addMovieRating(this.mediaDetails?.id ?? 0, request)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (response) => {
                        if (response.status_code !== 1 && response.status_code !== 13 && response.status_code !== 12) {
                            this.userRating = previousRating;
                            this.cdr.detectChanges();
                            this.snackbarService.error('Failed to update rating');
                        } else {
                            this.snackbarService.success('Rating updated');
                        }
                    },
                    error: () => {
                        this.userRating = previousRating;
                        this.cdr.detectChanges();
                        this.snackbarService.error('Failed to update rating');
                    },
                });
        } else {
            this.tvShowFacade
                .addTvShowRating(this.mediaDetails?.id ?? 0, request)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (response) => {
                        if (response.status_code !== 1 && response.status_code !== 13 && response.status_code !== 12) {
                            this.userRating = previousRating;
                            this.cdr.detectChanges();
                            this.snackbarService.error('Failed to update rating');
                        }
                    },
                    error: () => {
                        this.userRating = previousRating;
                        this.cdr.detectChanges();
                        this.snackbarService.error('Failed to update rating');
                    },
                });
        }
    }
}
