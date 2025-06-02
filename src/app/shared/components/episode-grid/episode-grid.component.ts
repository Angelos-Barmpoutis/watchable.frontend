import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TvShowEpisode } from '../../models/tv-show.model';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/enumerations/button-type.enum';
import { EpisodeGridItemComponent } from '../episode-grid-item/episode-grid-item.component';

@Component({
    standalone: true,
    selector: 'app-episode-grid',
    imports: [CommonModule, RouterModule, EpisodeGridItemComponent, ButtonComponent],
    templateUrl: './episode-grid.component.html',
    styleUrls: ['./episode-grid.component.scss']
})
export class EpisodeGridComponent {
    @Input() episodes: Array<TvShowEpisode> = [];
    @Input() tvShowId!: number;
    @Input() seasonNumber!: number;
    @Input() isLoading = false;
    @Input() episodesCount = 6;

    showAll = false;

    readonly buttonType = ButtonType;

    get displayedEpisodes(): Array<TvShowEpisode> {
        if (this.showAll) {
            return this.episodes;
        }
        return this.episodes.slice(0, this.episodesCount);
    }

    get hasMoreEpisodes(): boolean {
        return this.episodes.length > this.episodesCount;
    }

    get skeletonArray(): Array<number> {
        return Array(this.episodesCount).fill(0) as Array<number>;
    }

    trackByItemId(index: number, item: TvShowEpisode): number {
        return item.id;
    }

    trackByIndex(index: number): number {
        return index;
    }

    toggleShowAll(): void {
        this.showAll = !this.showAll;
    }
}
