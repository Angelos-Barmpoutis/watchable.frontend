import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { PROFILE_SIZE } from '../../../../core/enumerations/profile-size.enum';
import { Person } from '../../../../core/models/people/person.model';
import { KnownForItem } from '../../../../core/models/shared/known-for-item.model';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { ProfilePathDirective } from '../../../../shared/directives/profile-path.directive';
import { PeopleFacade } from '../../../../shared/facades/people.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';

@Component({
    selector: 'app-popular-people',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [CommonModule, ProfilePathDirective, RouterLink],
})
export class PeoplePopularComponent extends BaseComponent implements OnInit {
    public profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    public profileFallback = DEFAULT.mediumProfileFallback;
    public popularPeople: Array<Person> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(private peopleFacade: PeopleFacade) {
        super();
    }

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
            .pipe(takeUntil(this.destroyed))
            .subscribe((popularPeople) => {
                if (loadMore) {
                    this.popularPeople = [...this.popularPeople, ...popularPeople.results];
                } else {
                    this.popularPeople = popularPeople.results;
                }

                this.currentPage = +popularPeople.page;
                this.totalPages = +popularPeople.total_pages;
            });
    }
}
