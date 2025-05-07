import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { BackdropPathDirective } from '../../directives/backdrop-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { BackdropSize } from '../../enumerations/backdrop-size.enum';

@Component({
    selector: 'app-episode-still',
    standalone: true,
    imports: [CommonModule, BackdropPathDirective, FadeInDirective],
    templateUrl: './episode-still.component.html',
    styleUrls: ['./episode-still.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeStillComponent {
    @Input() stillPath?: string;
    @Input() isLoading = false;

    readonly backdropSize = BackdropSize;
    readonly default = DEFAULT;
}
