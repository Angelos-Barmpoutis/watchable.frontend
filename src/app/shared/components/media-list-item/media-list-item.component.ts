import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { MediaType } from '../../enumerations/media-type.enum';
import { PosterSize } from '../../enumerations/poster-size.enum';
import { MovieItem } from '../../models/movie.model';
import { TvShowItem } from '../../models/tv-show.model';
import { RatingBadgeComponent } from '../rating-badge/rating-badge.component';

@Component({
    selector: 'app-media-list-item',
    standalone: true,
    imports: [CommonModule, RouterLink, PosterPathDirective, RatingBadgeComponent, FadeInDirective],
    templateUrl: './media-list-item.component.html',
    styleUrl: './media-list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaListItemComponent {
    @Input() media: MovieItem | TvShowItem | undefined;
    @Input() isLoading = false;
    @Input() type: MediaType = MediaType.Movie;

    posterSize: PosterSize = DEFAULT.mediumPosterSize;
    posterFallback = DEFAULT.mediumPosterFallback;
    mediaType = MediaType;

    get title(): string {
        if (!this.media) return '';
        return this.type === MediaType.Movie ? (this.media as MovieItem).title : (this.media as TvShowItem).name;
    }

    get releaseDate(): string {
        if (!this.media) return '';
        return this.type === MediaType.Movie
            ? (this.media as MovieItem).release_date
            : (this.media as TvShowItem).first_air_date;
    }

    get genres(): Array<{ name: string }> {
        return this.media?.genres || [];
    }
}
