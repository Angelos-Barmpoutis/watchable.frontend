import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { ProfilePathDirective } from '../../../../shared/directives/profile-path.directive';
import { PROFILE_SIZE } from '../../../../shared/enumerations/profile-size.enum';
import { PeopleFacade } from '../../../../shared/facades/people.facade';
import { Person } from '../../../../shared/models/people/person.model';
import { KnownForItem } from '../../../../shared/models/shared/known-for-item.model';

@Component({
    selector: 'app-popular-people',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [CommonModule, ProfilePathDirective, RouterLink],
})
export class PeoplePopularComponent implements OnInit {
    public profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    public profileFallback = DEFAULT.mediumProfileFallback;
    public popularPeople: Array<Person> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private peopleFacade: PeopleFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getPopularPeople();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getPopularPeople(true);
        }
    }

    public isMovie(item: KnownForItem): boolean {
        return item.media_type === 'movie';
    }

    private getPopularPeople(loadMore: boolean = false): void {
        this.peopleFacade
            .getPopular(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((popularPeople) => {
                if (loadMore) {
                    this.popularPeople = [...this.popularPeople, ...popularPeople.results];
                } else {
                    this.popularPeople = popularPeople.results;
                }

                this.currentPage = popularPeople.page;
                this.totalPages = popularPeople.total_pages;
            });
    }
}
