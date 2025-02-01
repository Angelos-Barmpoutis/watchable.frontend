import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../shared/constants/defaults.constant';
import { ProfilePathDirective } from '../../shared/directives/profile-path.directive';
import { PROFILE_SIZE } from '../../shared/enumerations/profile-size.enum';
import { PeopleFacade } from '../../shared/facades/people.facade';
import { Person } from '../../shared/models/people/person.model';
import { KnownForItem } from '../../shared/models/shared/known-for-item.model';
import { LimitToPipe } from '../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-people',
    standalone: true,
    providers: [],
    templateUrl: './people.component.html',
    styleUrl: './people.component.scss',
    imports: [CommonModule, ProfilePathDirective, LimitToPipe, RouterLink],
})
export class PeopleComponent implements OnInit {
    public profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    public profileFallback = DEFAULT.mediumProfileFallback;
    public popularPeople!: Array<Person>;

    constructor(
        private peopleFacade: PeopleFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getPopularPeople();
    }

    public isMovie(item: KnownForItem): boolean {
        return item.media_type === 'movie';
    }

    private getPopularPeople(): void {
        this.peopleFacade
            .getPopular()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((popularPeople) => {
                this.popularPeople = popularPeople.results;
            });
    }
}
