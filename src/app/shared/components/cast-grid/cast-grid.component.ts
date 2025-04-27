import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { ButtonType } from '../../enumerations/components/button-type.enum';
import { MediaCreditsCastPerson } from '../../models/media.model';
import { ButtonComponent } from '../button/button.component';
import { CastPersonComponent } from '../cast-person/cast-person.component';

@Component({
    selector: 'app-cast-grid',
    standalone: true,
    imports: [CommonModule, FadeInDirective, CastPersonComponent, ButtonComponent],
    templateUrl: './cast-grid.component.html',
    styleUrls: ['./cast-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastGridComponent {
    @Input() cast: Array<MediaCreditsCastPerson> = [];
    @Input() isLoading = false;

    readonly default = DEFAULT;
    readonly ButtonType = ButtonType;
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
