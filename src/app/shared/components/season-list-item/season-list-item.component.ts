import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { MediaType } from '../../enumerations/media-type.enum';
import { PosterSize } from '../../enumerations/poster-size.enum';
import { TvShowSeason } from '../../models/tv-show.model';

@Component({
    selector: 'app-season-list-item',
    standalone: true,
    imports: [CommonModule, RouterLink, FadeInDirective, PosterPathDirective],
    templateUrl: './season-list-item.component.html',
    styleUrls: ['./season-list-item.component.scss'],
})
export class SeasonListItemComponent {
    @Input() season!: TvShowSeason;
    @Input() tvShowId!: number;
    @Input() isLoading = false;

    posterSize: PosterSize = DEFAULT.mediumPosterSize;
    posterFallback = DEFAULT.mediumPosterFallback;

    readonly mediaType = MediaType;
}
