import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { MediaType } from '../../enumerations/media-type.enum';
import { MovieItem } from '../../models/movie.model';
import { TvShowItem } from '../../models/tv-show.model';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/enumerations/button-type.enum';
import { MediaListItemComponent } from '../media-list-item/media-list-item.component';

@Component({
    standalone: true,
    selector: 'app-media-grid',
    imports: [CommonModule, MediaListItemComponent, ButtonComponent, FadeInDirective],
    templateUrl: './media-grid.component.html',
    styleUrl: './media-grid.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaGridComponent {
    @Input() items: Array<MovieItem | TvShowItem> = [];
    @Input() type: MediaType = MediaType.Movie;
    @Input() isLoading = false;
    @Input() initialCount = DEFAULT.castCount;
    showAll = false;

    readonly ButtonType = ButtonType;

    get hasMore(): boolean {
        return this.items.length > this.initialCount;
    }

    get skeletonArray(): Array<number> {
        return Array(this.initialCount)
            .fill(0)
            .map((_, index) => index + 1);
    }

    toggleShowAll(): void {
        this.showAll = !this.showAll;
    }

    trackById(index: number, item: { id: number }): number {
        return item.id;
    }
}
