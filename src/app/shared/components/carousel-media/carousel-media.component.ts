import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

import { BaseCarouselComponent } from '../../abstract/base-carousel.abstract';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { MEDIA_TYPE } from '../../enumerations/media-type.enum';
import { Movie } from '../../models/movie.model';
import { TvShow } from '../../models/tv-show.model';
import { CarouselMediaItemComponent } from '../carousel-media-item/carousel-media-item.component';

@Component({
    selector: 'app-carousel-media',
    standalone: true,
    imports: [CommonModule, CarouselMediaItemComponent, FadeInDirective],
    templateUrl: './carousel-media.component.html',
    styleUrl: './carousel-media.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselMediaComponent extends BaseCarouselComponent<Movie | TvShow> {
    @Input() type: MEDIA_TYPE = MEDIA_TYPE.Movie;
    readonly mediaType = MEDIA_TYPE;

    constructor() {
        super();
    }

    trackByItemId(index: number, item: Movie | TvShow): number {
        return item.id;
    }
}
