import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { POSTER_SIZE } from '../../enumerations/poster-size.enum';
import { SearchResult } from '../../models/search.model';

@Component({
    selector: 'app-movie-search-list-item',
    standalone: true,
    imports: [CommonModule, RouterLink, PosterPathDirective, FadeInDirective],
    templateUrl: './movie-search-list-item.component.html',
    styleUrl: './movie-search-list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieSearchListItemComponent {
    @Input() movie!: SearchResult;
    @Input() isLoading = false;
    posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    posterFallback = DEFAULT.smallPosterSize;
}
