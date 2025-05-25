import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { ProfilePathDirective } from '../../directives/profile-path.directive';
import { ProfileSize } from '../../enumerations/profile-size.enum';
import { MediaCreditsCastPerson, MediaCreditsCrewPerson } from '../../models/media.model';

@Component({
    selector: 'app-cast-person',
    standalone: true,
    imports: [CommonModule, ProfilePathDirective, RouterLink, FadeInDirective],
    templateUrl: './cast-person.component.html',
    styleUrl: './cast-person.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastPersonComponent {
    @Input() person!: MediaCreditsCastPerson | MediaCreditsCrewPerson;
    @Input() isLoading = false;

    readonly profileSize = ProfileSize;
    readonly default = DEFAULT;

    get role(): string {
        return 'character' in this.person ? this.person.character : this.person.job;
    }
}
