import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { ProfilePathDirective } from '../../directives/profile-path.directive';
import { ProfileSize } from '../../enumerations/profile-size.enum';
import { MediaCreditsCastPerson } from '../../models/media.model';

@Component({
    selector: 'app-cast-person',
    standalone: true,
    imports: [CommonModule, ProfilePathDirective, RouterLink],
    templateUrl: './cast-person.component.html',
    styleUrl: './cast-person.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastPersonComponent {
    @Input() person!: MediaCreditsCastPerson;
    @Input() isLoading = false;

    readonly profileSize = ProfileSize;
    readonly default = DEFAULT;
}
