import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { MEDIA_TYPE } from '../../enumerations/media-type.enum';
import { POSTER_SIZE } from '../../enumerations/poster-size.enum';
import { Movie } from '../../models/movie.model';
import { TvShow } from '../../models/tv-show.model';

@Component({
    selector: 'app-carousel-media-item',
    standalone: true,
    imports: [CommonModule, RouterLink, PosterPathDirective, FadeInDirective],
    templateUrl: './carousel-media-item.component.html',
    styleUrl: './carousel-media-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselMediaItemComponent {
    @Input() item!: Movie | TvShow;
    @Input() isLoading = false;
    @Input() mediaType: MEDIA_TYPE = MEDIA_TYPE.Movie;
    readonly MEDIA_TYPE = MEDIA_TYPE;
    posterSize: POSTER_SIZE = DEFAULT.largePosterSize;
    posterFallback = DEFAULT.largePosterFallback;

    get title(): string {
        if (!this.item) {
            return '';
        }

        if (this.mediaType === MEDIA_TYPE.Movie) {
            return (this.item as Movie).title || '';
        } else {
            return (this.item as TvShow).name || '';
        }
    }
}
