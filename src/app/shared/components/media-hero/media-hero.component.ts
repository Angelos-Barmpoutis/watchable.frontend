import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    Input,
    OnChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of, switchMap } from 'rxjs';

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
import { MovieDetails, PaginatedMovies } from '../../models/movie.model';
import { PaginatedTvShows, TvShowDetails } from '../../models/tv-show.model';
import { FormatNumberWithKPipe } from '../../pipes/format-number.pipe';
import { TimePipe } from '../../pipes/time.pipe';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/enumerations/button-type.enum';
import { VideoGalleryComponent } from '../video-gallery/video-gallery.component';

type MediaDetails = MovieDetails | TvShowDetails;

@Component({
    selector: 'app-media-hero',
    standalone: true,
    imports: [
        CommonModule,
        FadeInDirective,
        TimePipe,
        FormatNumberWithKPipe,
        PosterPathDirective,
        BackgroundPathDirective,
        VideoGalleryComponent,
        ButtonComponent,
    ],
    templateUrl: './media-hero.component.html',
    styleUrl: './media-hero.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaHeroComponent implements OnChanges {
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

    private destroyRef = inject(DestroyRef);
    private accountFacade = inject(AccountFacade);
    private authService = inject(AuthService);
    private snackbarService = inject(SnackbarService);
    private cdr = inject(ChangeDetectorRef);

    ngOnChanges(): void {
        if (this.mediaDetails) {
            this.trailerVideo = getTrailerVideo(this.mediaDetails.videos?.results);

            if (this.authService.isAuthenticated()) {
                this.checkWatchlistStatus();
            } else {
                this.isInWatchlist = false;
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
                    if (response.status_code === 1 || response.status_code === 13) {
                        this.snackbarService.success(
                            this.isInWatchlist ? 'Added to watchlist' : 'Removed from watchlist',
                        );
                    } else {
                        this.isInWatchlist = previousState;
                        this.cdr.detectChanges();
                        this.snackbarService.error('Failed to update watchlist');
                    }
                },
                error: () => {
                    this.isInWatchlist = previousState;
                    this.cdr.detectChanges();
                    this.snackbarService.error('Failed to update watchlist');
                },
            });
    }

    private checkWatchlistStatus(): void {
        if (!this.mediaDetails) return;

        this.authService.userInfo$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((userInfo) => {
                    if (!userInfo) {
                        this.snackbarService.error('Failed to get user information');
                        return of(null);
                    }

                    const watchlist$: Observable<PaginatedMovies | PaginatedTvShows> =
                        this.type === MediaType.Movie
                            ? this.accountFacade.getWatchlistMovies(userInfo.id)
                            : this.accountFacade.getWatchlistTVShows(userInfo.id);

                    return watchlist$;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (watchlist) => {
                    if (watchlist) {
                        this.isInWatchlist = watchlist.results.some(
                            (item: { id: number }) => item.id === this.mediaDetails?.id,
                        );
                        this.cdr.detectChanges();
                    }
                },
                error: () => {
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
