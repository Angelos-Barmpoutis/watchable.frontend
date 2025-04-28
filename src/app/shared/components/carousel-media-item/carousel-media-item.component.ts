import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { MediaType } from '../../enumerations/media-type.enum';
import { PosterSize } from '../../enumerations/poster-size.enum';
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
    @Input() type: MediaType = MediaType.Movie;

    readonly mediaType = MediaType;

    posterSize: PosterSize = DEFAULT.largePosterSize;
    posterFallback = DEFAULT.largePosterFallback;

    get title(): string {
        if (!this.item) {
            return '';
        }

        if (this.type === MediaType.Movie) {
            return (this.item as Movie).title || '';
        } else {
            return (this.item as TvShow).name || '';
        }
    }
}
