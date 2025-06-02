import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

import { BaseCarouselComponent } from '../../abstract/base-carousel.abstract';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { MediaType } from '../../enumerations/media-type.enum';
import { TvShowSeason } from '../../models/tv-show.model';
import { CarouselSeasonItemComponent } from '../carousel-season-item/carousel-season-item.component';

@Component({
    standalone: true,
    selector: 'app-carousel-season',
    imports: [CommonModule, CarouselSeasonItemComponent, FadeInDirective],
    templateUrl: './carousel-season.component.html',
    styleUrls: ['./carousel-season.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselSeasonComponent extends BaseCarouselComponent<TvShowSeason> {
    @Input() tvShowId!: number;

    readonly mediaType = MediaType;

    constructor() {
        super();
    }

    trackByItemId(index: number, item: TvShowSeason): number {
        return item.id;
    }
}
