import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { BackdropPathDirective } from '../../directives/backdrop-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { MediaType } from '../../enumerations/media-type.enum';
import { TvShowEpisode } from '../../models/tv-show.model';

@Component({
    standalone: true,
    selector: 'app-episode-grid-item',
    imports: [CommonModule, RouterLink, BackdropPathDirective, FadeInDirective],
    templateUrl: './episode-grid-item.component.html',
    styleUrls: ['./episode-grid-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpisodeGridItemComponent {
    @Input() public episode!: TvShowEpisode;
    @Input() public tvShowId!: number;
    @Input() public seasonNumber!: number;
    @Input() public isLoading = false;

    backdropSize = DEFAULT.mediumBackdropSize;
    backdropFallback = DEFAULT.mediumBackdropFallback;
    public readonly mediaType = MediaType;
}
