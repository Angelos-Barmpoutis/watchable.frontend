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
import { BehaviorSubject, combineLatest, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { DEFAULT } from '../../constants/defaults.constant';
import { BackgroundPathDirective } from '../../directives/background-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { BackdropSize } from '../../enumerations/backdrop-size.enum';
import { MediaType } from '../../enumerations/media-type.enum';
import { PosterSize } from '../../enumerations/poster-size.enum';
import { AccountFacade } from '../../facades/account.facade';
import { getTrailerVideo } from '../../helpers/trailer-url.helper';
import { Video } from '../../models/media.model';
import { MovieDetails } from '../../models/movie.model';
import { TvShowDetails } from '../../models/tv-show.model';
import { TimePipe } from '../../pipes/time.pipe';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/enumerations/button-type.enum';
import { VideoGalleryComponent } from '../video-gallery/video-gallery.component';

type MediaDetails = MovieDetails | TvShowDetails;

@Component({
    standalone: true,
    selector: 'app-media-hero',
    imports: [
        CommonModule,
        FadeInDirective,
        TimePipe,
        PosterPathDirective,
        BackgroundPathDirective,
        VideoGalleryComponent,
        ButtonComponent,
    ],
    templateUrl: './media-hero.component.html',
    styleUrl: './media-hero.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaHeroComponent implements OnChanges, OnInit {
    @Input() mediaDetails: MediaDetails | null | undefined = null;
    @Input() type: MediaType = MediaType.Movie;
    @Input() isLoading: boolean = false;
    @Input() seasonNumber?: number;
    @Input() episodeNumber?: number;

    readonly mediaType = MediaType;
    readonly posterSize = PosterSize;
    readonly backdropSize = BackdropSize;
    readonly default = DEFAULT;
    readonly ButtonType = ButtonType;

    showTrailer = false;
    trailerVideo: Video | null = null;
    isInWatchlist = false;

    private mediaDetailsSubject = new BehaviorSubject<MediaDetails | null | undefined>(null);

    constructor(
        private accountFacade: AccountFacade,
        private authService: AuthService,
        private snackbarService: SnackbarService,
        private cdr: ChangeDetectorRef,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        combineLatest([this.authService.isAuthenticated$, this.mediaDetailsSubject.asObservable()])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(([isAuthenticated, mediaDetails]) => {
                if (isAuthenticated && mediaDetails) {
                    this.getWatchlist();
                } else {
                    this.isInWatchlist = false;
                    this.cdr.detectChanges();
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['mediaDetails']) {
            this.mediaDetailsSubject.next(this.mediaDetails);

            if (this.mediaDetails) {
                this.trailerVideo = getTrailerVideo(this.mediaDetails.videos?.results);
                this.cdr.detectChanges();
            }
        }
    }

    toggleTrailer(): void {
        this.showTrailer = !this.showTrailer;
    }

    toggleWatchlist(): void {
        if (!this.authService.isAuthenticated()) {
            this.snackbarService.warning('Please sign in to add items to your watchlist');
            this.isInWatchlist = false;
            this.cdr.detectChanges();
            return;
        }

        const previousState = this.isInWatchlist;
        this.isInWatchlist = !this.isInWatchlist;
        this.cdr.detectChanges();

        this.authService.userInfo$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((account) => {
                    if (!account) {
                        throw new Error('No account information available');
                    }
                    return this.accountFacade.addToWatchlist(
                        account.id,
                        this.mediaDetails!.id,
                        this.type,
                        this.isInWatchlist,
                    );
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response.status_code !== 1 && response.status_code !== 13 && response.status_code !== 12) {
                        this.isInWatchlist = previousState;
                        this.cdr.detectChanges();
                        this.snackbarService.error('Failed to update watchlist');
                    } else {
                        this.snackbarService.success(
                            !this.isInWatchlist ? 'Removed from Watchlist' : 'Added to Watchlist',
                        );
                    }
                },
                error: () => {
                    this.isInWatchlist = previousState;
                    this.cdr.detectChanges();
                    this.snackbarService.error('Failed to update watchlist');
                },
            });
    }

    private getWatchlist(): void {
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
                            return this.accountFacade.getWatchlistMovies(userInfo?.id ?? 0, 1).pipe(
                                switchMap((firstPage) => {
                                    if (!firstPage || firstPage.total_pages <= 1) {
                                        return of(firstPage);
                                    }

                                    // Create an array of observables for all pages
                                    const pageRequests = Array.from({ length: firstPage.total_pages - 1 }, (_, i) =>
                                        this.accountFacade.getWatchlistMovies(userInfo?.id ?? 0, i + 2),
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
                            return this.accountFacade.getWatchlistTVShows(userInfo?.id ?? 0, 1).pipe(
                                switchMap((firstPage) => {
                                    if (!firstPage || firstPage.total_pages <= 1) {
                                        return of(firstPage);
                                    }

                                    // Create an array of observables for all pages
                                    const pageRequests = Array.from({ length: firstPage.total_pages - 1 }, (_, i) =>
                                        this.accountFacade.getWatchlistTVShows(userInfo?.id ?? 0, i + 2),
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
                next: (watchlist) => {
                    if (watchlist) {
                        this.isInWatchlist = watchlist.results.some(
                            (item: { id: number }) => item.id === this.mediaDetails?.id,
                        );
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.cdr.detectChanges();
                    this.snackbarService.error('Failed to check watchlist status');
                },
            });
    }

    get title(): string {
        if (this.type === MediaType.Movie) {
            return (this.mediaDetails as MovieDetails).title;
        }
        const showName = (this.mediaDetails as TvShowDetails).name;

        return showName;
    }

    get subtitle(): string {
        if (this.seasonNumber && this.episodeNumber) {
            return `S${this.seasonNumber.toString().padStart(2, '0')}E${this.episodeNumber
                .toString()
                .padStart(2, '0')}`;
        }
        return this.seasonNumber ? `S${this.seasonNumber.toString().padStart(2, '0')}` : '';
    }

    get releaseDate(): string {
        return this.type === MediaType.Movie
            ? (this.mediaDetails as MovieDetails).release_date
            : (this.mediaDetails as TvShowDetails).first_air_date;
    }

    get endDate(): string {
        return this.type === MediaType.Movie
            ? (this.mediaDetails as MovieDetails).release_date
            : (this.mediaDetails as TvShowDetails).last_air_date;
    }

    get runtime(): number | null {
        return this.type === MediaType.Movie
            ? (this.mediaDetails as MovieDetails).runtime
            : (this.mediaDetails as TvShowDetails).episode_run_time?.[0] || null;
    }

    get voteAverage(): number {
        if (this.type === MediaType.Movie) {
            return (this.mediaDetails as MovieDetails).vote_average || 0;
        } else {
            return (this.mediaDetails as TvShowDetails).vote_average || 0;
        }
    }

    get voteCount(): number {
        if (this.type === MediaType.Movie) {
            return (this.mediaDetails as MovieDetails).vote_count || 0;
        } else {
            return (this.mediaDetails as TvShowDetails).vote_count || 0;
        }
    }

    get tagline(): string | null {
        if (this.type === MediaType.Movie) {
            return (this.mediaDetails as MovieDetails).tagline;
        }
        return (this.mediaDetails as TvShowDetails).tagline;
    }

    get ratingClass(): string {
        if (this.voteAverage >= 8) return 'rating-top';
        if (this.voteAverage >= 7) return 'rating-high';
        if (this.voteAverage >= 5) return 'rating-medium';
        return 'rating-low';
    }

    get ratingDetails(): string {
        if (this.type === MediaType.Movie) {
            return `${this.voteCount.toLocaleString()} votes`;
        }
        return `${this.voteCount.toLocaleString()} votes`;
    }

    get mediaTitle(): string {
        if (this.type === MediaType.Movie) {
            return (this.mediaDetails as MovieDetails).title;
        }
        return (this.mediaDetails as TvShowDetails).name;
    }

    get mediaReleaseDate(): string {
        if (this.type === MediaType.Movie) {
            return (this.mediaDetails as MovieDetails).release_date;
        }
        return (this.mediaDetails as TvShowDetails).first_air_date;
    }

    get mediaRuntime(): string {
        if (this.type === MediaType.Movie) {
            const runtime = (this.mediaDetails as MovieDetails).runtime;
            return runtime ? `${runtime} min` : '';
        }
        return '';
    }

    get mediaGenres(): string {
        return this.mediaDetails?.genres?.map((genre) => genre.name).join(', ') ?? '';
    }

    get mediaOverview(): string {
        return this.mediaDetails?.overview ?? '';
    }

    get mediaPosterPath(): string {
        return this.mediaDetails?.poster_path ?? '';
    }

    get mediaBackdropPath(): string {
        return this.mediaDetails?.backdrop_path ?? '';
    }

    get mediaId(): number {
        return this.mediaDetails?.id ?? 0;
    }

    get mediaYear(): string {
        const date = this.type === MediaType.Movie ? this.mediaReleaseDate : this.mediaReleaseDate;
        return date ? new Date(date).getFullYear().toString() : '';
    }

    get mediaMeta(): Array<string> {
        const meta: Array<string> = [];
        if (this.mediaYear) meta.push(this.mediaYear);
        if (this.mediaRuntime) meta.push(this.mediaRuntime);
        if (this.mediaGenres) meta.push(this.mediaGenres);
        return meta;
    }
}
