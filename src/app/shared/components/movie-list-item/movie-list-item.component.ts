import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { PosterSize } from '../../enumerations/poster-size.enum';
import { MovieItem } from '../../models/movie.model';

@Component({
    selector: 'app-movie-list-item',
    standalone: true,
    imports: [CommonModule, RouterLink, PosterPathDirective, FadeInDirective],
    templateUrl: './movie-list-item.component.html',
    styleUrl: './movie-list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListItemComponent {
    @Input() movie!: MovieItem;
    @Input() isLoading = false;
    posterSize: PosterSize = DEFAULT.mediumPosterSize;
    posterFallback = DEFAULT.mediumPosterFallback;
}
