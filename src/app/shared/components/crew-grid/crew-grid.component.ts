import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { ProfilePathDirective } from '../../directives/profile-path.directive';
import { ProfileSize } from '../../enumerations/profile-size.enum';
import { MediaCreditsCrewPerson } from '../../models/media.model';
import { GuestStarPerson } from '../../models/people.model';

type CrewPerson = MediaCreditsCrewPerson | GuestStarPerson;

@Component({
    selector: 'app-crew-grid',
    standalone: true,
    imports: [CommonModule, ProfilePathDirective, RouterLink, FadeInDirective],
    templateUrl: './crew-grid.component.html',
    styleUrls: ['./crew-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrewGridComponent {
    @Input() crew: Array<CrewPerson> = [];
    @Input() isLoading = false;

    readonly profileSize = ProfileSize;
    readonly default = DEFAULT;

    get skeletonArray(): Array<number> {
        return Array(DEFAULT.castCount)
            .fill(0)
            .map((_, index) => index + 1);
    }

    getRole(person: CrewPerson): string {
        if ('character' in person) {
            return person.character;
        }
        return `${person.job} (${person.department})`;
    }
}
