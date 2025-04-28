import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { ProfilePathDirective } from '../../directives/profile-path.directive';
import { ProfileSize } from '../../enumerations/profile-size.enum';
import { Person } from '../../models/people.model';

@Component({
    selector: 'app-person-list-item',
    standalone: true,
    imports: [CommonModule, RouterModule, FadeInDirective, ProfilePathDirective],
    templateUrl: './person-list-item.component.html',
    styleUrls: ['./person-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListItemComponent {
    @Input() person!: Person;
    @Input() isLoading = false;
    profileSize: ProfileSize = DEFAULT.mediumProfileSize;
    profileFallback = DEFAULT.mediumProfileFallback;
}
