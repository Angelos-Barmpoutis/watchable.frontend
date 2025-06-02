import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { ProfilePathDirective } from '../../directives/profile-path.directive';
import { ProfileSize } from '../../enumerations/profile-size.enum';
import { Person } from '../../models/people.model';

@Component({
    standalone: true,
    selector: 'app-carousel-person-item',
    imports: [CommonModule, RouterLink, FadeInDirective, ProfilePathDirective],
    templateUrl: './carousel-person-item.component.html',
    styleUrls: ['./carousel-person-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselPersonItemComponent {
    @Input() item!: Person;
    @Input() isLoading = false;
    profileSize: ProfileSize = DEFAULT.mediumProfileSize;
    profileFallback = DEFAULT.mediumProfileFallback;
}
