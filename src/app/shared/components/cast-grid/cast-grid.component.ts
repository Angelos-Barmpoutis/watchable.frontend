import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { MediaCreditsCastPerson, MediaCreditsCrewPerson } from '../../models/media.model';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/enumerations/button-type.enum';
import { CastPersonComponent } from '../cast-person/cast-person.component';

@Component({
    standalone: true,
    selector: 'app-cast-grid',
    imports: [CommonModule, FadeInDirective, CastPersonComponent, ButtonComponent],
    templateUrl: './cast-grid.component.html',
    styleUrls: ['./cast-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CastGridComponent {
    @Input() cast: Array<MediaCreditsCastPerson | MediaCreditsCrewPerson> = [];
    @Input() isLoading = false;
    @Input() castCount = DEFAULT.castCount;

    readonly default = DEFAULT;
    readonly ButtonType = ButtonType;
    showAll = false;

    get hasMoreCast(): boolean {
        return this.cast.length > this.castCount;
    }

    get skeletonArray(): Array<number> {
        return Array(this.castCount)
            .fill(0)
            .map((_, index) => index + 1);
    }

    toggleShowAll(): void {
        this.showAll = !this.showAll;
    }
}
