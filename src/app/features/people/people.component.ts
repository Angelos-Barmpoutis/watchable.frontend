import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { PROFILE_SIZE } from '../../core/enumerations/profile-size.enum';
import { Person } from '../../core/models/people/person.model';
import { KnownForItem } from '../../core/models/shared/known-for-item.model';
import { DEFAULT } from '../../shared/constants/defaults.constant';
import { ProfilePathDirective } from '../../shared/directives/profile-path.directive';
import { PeopleFacade } from '../../shared/facades/people.facade';
import { BaseComponent } from '../../shared/helpers/base.component';
import { LimitToPipe } from '../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-people',
    standalone: true,
    providers: [],
    templateUrl: './people.component.html',
    styleUrl: './people.component.scss',
    imports: [CommonModule, ProfilePathDirective, LimitToPipe, RouterLink],
})
export class PeopleComponent extends BaseComponent implements OnInit {
    public profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    public profileFallback = DEFAULT.mediumProfileFallback;
    public popularPeople!: Array<Person>;

    constructor(private peopleFacade: PeopleFacade) {
        super();
    }

    ngOnInit(): void {
        this.getPopularPeople();
    }

    public isMovie(item: KnownForItem): boolean {
        return item.media_type === 'movie';
    }

    private getPopularPeople(): void {
        this.peopleFacade
            .getPopular()
            .pipe(takeUntil(this.destroyed))
            .subscribe((popularPeople) => {
                this.popularPeople = popularPeople.results;
            });
    }
}
