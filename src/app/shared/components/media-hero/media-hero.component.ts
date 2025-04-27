import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { ButtonType } from '../../enumerations/components/button-type.enum';
import { MEDIA_TYPE } from '../../enumerations/media-type.enum';
import { POSTER_SIZE } from '../../enumerations/poster-size.enum';
import { getBackgroundImageUrl } from '../../helpers/background-image-url';
import { getTrailerVideo } from '../../helpers/trailer-url.helper';
import { Video } from '../../models/media.model';
import { MovieDetails } from '../../models/movie.model';
import { TvShowDetails } from '../../models/tv-show.model';
import { TimePipe } from '../../pipes/time.pipe';
import { ButtonComponent } from '../button/button.component';
import { VideoGalleryComponent } from '../video-gallery/video-gallery.component';

type MediaDetails = MovieDetails | TvShowDetails;

@Component({
    selector: 'app-media-hero',
    standalone: true,
    imports: [CommonModule, FadeInDirective, TimePipe, PosterPathDirective, VideoGalleryComponent, ButtonComponent],
    templateUrl: './media-hero.component.html',
    styleUrl: './media-hero.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaHeroComponent implements OnChanges {
    @Input() mediaDetails: MediaDetails | null | undefined = null;
    @Input() type: MEDIA_TYPE = MEDIA_TYPE.Movie;
    @Input() isLoading: boolean = false;

    readonly mediaType = MEDIA_TYPE;
    readonly posterSize = POSTER_SIZE;
    readonly default = DEFAULT;
    readonly ButtonType = ButtonType;

    showTrailer = false;
    trailerVideo: Video | null = null;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnChanges(): void {
        if (this.mediaDetails) {
            this.trailerVideo = getTrailerVideo(this.mediaDetails.videos?.results);
        }
    }

    toggleTrailer(): void {
        this.showTrailer = !this.showTrailer;
    }

    get backdropUrl(): string {
        if (!this.mediaDetails || !this.mediaDetails.backdrop_path) return '';
        return getBackgroundImageUrl(POSTER_SIZE.original, this.mediaDetails.backdrop_path);
    }

    get title(): string {
        return this.type === MEDIA_TYPE.Movie
            ? (this.mediaDetails as MovieDetails).title
            : (this.mediaDetails as TvShowDetails).name;
    }

    get releaseDate(): string {
        return this.type === MEDIA_TYPE.Movie
            ? (this.mediaDetails as MovieDetails).release_date
            : (this.mediaDetails as TvShowDetails).first_air_date;
    }

    get runtime(): number | null {
        return this.type === MEDIA_TYPE.Movie
            ? (this.mediaDetails as MovieDetails).runtime
            : (this.mediaDetails as TvShowDetails).episode_run_time?.[0] || null;
    }

    get voteAverage(): number {
        if (this.type === MEDIA_TYPE.Movie) {
            return (this.mediaDetails as MovieDetails).vote_average || 0;
        } else {
            return (this.mediaDetails as TvShowDetails).vote_average || 0;
        }
    }

    get voteCount(): number {
        if (this.type === MEDIA_TYPE.Movie) {
            return (this.mediaDetails as MovieDetails).vote_count || 0;
        } else {
            return (this.mediaDetails as TvShowDetails).vote_count || 0;
        }
    }

    get tagline(): string | null {
        if (this.type === MEDIA_TYPE.Movie) {
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
        if (this.type === MEDIA_TYPE.Movie) {
            return `${this.voteCount.toLocaleString()} votes`;
        }
        return `${this.voteCount.toLocaleString()} votes`;
    }

    get mediaTitle(): string {
        if (this.type === MEDIA_TYPE.Movie) {
            return (this.mediaDetails as MovieDetails).title;
        }
        return (this.mediaDetails as TvShowDetails).name;
    }

    get mediaReleaseDate(): string {
        if (this.type === MEDIA_TYPE.Movie) {
            return (this.mediaDetails as MovieDetails).release_date;
        }
        return (this.mediaDetails as TvShowDetails).first_air_date;
    }

    get mediaRuntime(): string {
        if (this.type === MEDIA_TYPE.Movie) {
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
        const date = this.type === MEDIA_TYPE.Movie ? this.mediaReleaseDate : this.mediaReleaseDate;
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
