import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { POSTER_SIZE } from '../../enumerations/poster-size.enum';
import { TvShowItem } from '../../models/tv-show.model';

@Component({
    selector: 'app-tv-show-list-item',
    standalone: true,
    imports: [CommonModule, RouterModule, PosterPathDirective],
    templateUrl: './tv-show-list-item.component.html',
    styleUrl: './tv-show-list-item.component.scss',
})
export class TvShowListItemComponent {
    @Input() tvShow!: TvShowItem;
    @Input() isLoading: boolean = false;

    protected readonly POSTER_SIZE = POSTER_SIZE;
    protected readonly DEFAULT = DEFAULT;
}
