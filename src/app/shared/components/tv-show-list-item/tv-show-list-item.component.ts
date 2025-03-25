import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { POSTER_SIZE } from '../../enumerations/poster-size.enum';
import { TvShowItem } from '../../models/tv-show.model';

@Component({
    selector: 'app-tv-show-list-item',
    standalone: true,
    imports: [CommonModule, RouterLink, PosterPathDirective, FadeInDirective],
    templateUrl: './tv-show-list-item.component.html',
    styleUrl: './tv-show-list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TvShowListItemComponent {
    @Input() tvShow!: TvShowItem;
    @Input() isLoading = false;
    posterSize: POSTER_SIZE = DEFAULT.mediumPosterSize;
    posterFallback = DEFAULT.mediumPosterFallback;
}
