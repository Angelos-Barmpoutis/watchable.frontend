import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { MediaCreditsCastPerson } from '../../models/media.model';
import { CastPersonComponent } from '../cast-person/cast-person.component';

@Component({
    selector: 'app-cast-grid',
    standalone: true,
    imports: [CommonModule, FadeInDirective, CastPersonComponent],
    templateUrl: './cast-grid.component.html',
    styleUrls: ['./cast-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastGridComponent {
    @Input() cast: Array<MediaCreditsCastPerson> = [];
    @Input() isLoading = false;

    readonly DEFAULT = DEFAULT;
    showAll = false;

    get hasMoreCast(): boolean {
        return this.cast.length > DEFAULT.castCount;
    }

    get skeletonArray(): Array<number> {
        return Array(DEFAULT.castCount)
            .fill(0)
            .map((_, index) => index + 1);
    }

    toggleShowAll(): void {
        this.showAll = !this.showAll;
    }
}
