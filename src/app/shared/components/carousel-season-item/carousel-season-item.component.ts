import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { MediaType } from '../../enumerations/media-type.enum';
import { PosterSize } from '../../enumerations/poster-size.enum';
import { TvShowSeason } from '../../models/tv-show.model';

@Component({
    selector: 'app-carousel-season-item',
    standalone: true,
    imports: [CommonModule, RouterLink, FadeInDirective, PosterPathDirective],
    templateUrl: './carousel-season-item.component.html',
    styleUrls: ['./carousel-season-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselSeasonItemComponent {
    @Input() public season!: TvShowSeason;
    @Input() public tvShowId!: number;
    @Input() public isLoading = false;

    posterSize: PosterSize = DEFAULT.mediumPosterSize;
    posterFallback = DEFAULT.mediumPosterFallback;

    public readonly mediaType = MediaType;
}
