import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { TvShowEpisodeDetails } from '../../models/tv-show.model';

@Component({
    selector: 'app-episode-details',
    standalone: true,
    imports: [CommonModule, FadeInDirective],
    templateUrl: './episode-details.component.html',
    styleUrl: './episode-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeDetailsComponent {
    @Input() episodeDetails!: TvShowEpisodeDetails;
    @Input() isLoading = false;

    get skeletonArray(): Array<number> {
        return Array(7)
            .fill(0)
            .map((_, index) => index);
    }
}
