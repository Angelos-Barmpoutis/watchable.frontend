import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { TvShowSeasonDetails } from '../../models/tv-show.model';

@Component({
    selector: 'app-season-details',
    standalone: true,
    imports: [CommonModule, FadeInDirective],
    templateUrl: './season-details.component.html',
    styleUrl: './season-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonDetailsComponent {
    @Input() seasonDetails: TvShowSeasonDetails | undefined;
    @Input() isLoading = false;

    get skeletonArray(): Array<number> {
        return Array(7)
            .fill(0)
            .map((_, index) => index);
    }
}
