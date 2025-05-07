import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { BackdropPathDirective } from '../../directives/backdrop-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { MediaType } from '../../enumerations/media-type.enum';
import { TvShowEpisode } from '../../models/tv-show.model';

@Component({
    selector: 'app-episode-list-item',
    standalone: true,
    imports: [CommonModule, RouterLink, BackdropPathDirective, FadeInDirective],
    templateUrl: './episode-list-item.component.html',
    styleUrls: ['./episode-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeListItemComponent {
    @Input() public episode!: TvShowEpisode;
    @Input() public tvShowId!: number;
    @Input() public seasonNumber!: number;
    @Input() public isLoading = false;

    backdropSize = DEFAULT.mediumBackdropSize;
    backdropFallback = DEFAULT.mediumBackdropFallback;
    public readonly mediaType = MediaType;
}
