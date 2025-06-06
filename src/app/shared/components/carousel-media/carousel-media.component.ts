import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

import { BaseCarouselComponent } from '../../abstract/base-carousel.abstract';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { MediaType } from '../../enumerations/media-type.enum';
import { Movie } from '../../models/movie.model';
import { TvShow } from '../../models/tv-show.model';
import { CarouselMediaItemComponent } from '../carousel-media-item/carousel-media-item.component';

@Component({
    standalone: true,
    selector: 'app-carousel-media',
    imports: [CommonModule, CarouselMediaItemComponent, FadeInDirective],
    templateUrl: './carousel-media.component.html',
    styleUrl: './carousel-media.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselMediaComponent extends BaseCarouselComponent<Movie | TvShow> {
    @Input() type: MediaType = MediaType.Movie;
    readonly mediaType = MediaType;

    constructor() {
        super();
    }

    trackByItemId(index: number, item: Movie | TvShow): number {
        return item.id;
    }
}
