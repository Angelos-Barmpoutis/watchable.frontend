import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PersonDetails } from '../../models/people.model';

@Component({
    standalone: true,
    selector: 'app-person-details',
    imports: [CommonModule],
    templateUrl: './person-details.component.html',
    styleUrl: './person-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonDetailsComponent {
    @Input() personDetails!: PersonDetails;
    @Input() isLoading = false;

    get gender(): string {
        switch (this.personDetails?.gender) {
            case 1:
                return 'Female';
            case 2:
                return 'Male';
            default:
                return '';
        }
    }
}
