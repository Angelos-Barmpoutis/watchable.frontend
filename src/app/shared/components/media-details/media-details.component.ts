import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MEDIA_TYPE } from '../../enumerations/media-type.enum';
import { MovieDetails } from '../../models/movie.model';
import { TvShowDetails } from '../../models/tv-show.model';

type MediaDetails = MovieDetails | TvShowDetails;

@Component({
    selector: 'app-media-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './media-details.component.html',
    styleUrls: ['./media-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaDetailsComponent {
    @Input() mediaDetails!: MediaDetails;
    @Input() type: MEDIA_TYPE = MEDIA_TYPE.Movie;
    @Input() isLoading = false;

    readonly mediaType = MEDIA_TYPE;

    get isMovie(): boolean {
        return this.type === MEDIA_TYPE.Movie;
    }

    get isTvShow(): boolean {
        return this.type === MEDIA_TYPE.TvShow;
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
}
