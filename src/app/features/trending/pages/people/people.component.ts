import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { PROFILE_SIZE } from '../../../../core/enumerations/profile-size.enum';
import { TRENDING_FILTER } from '../../../../core/enumerations/trending-filter.enum';
import { Person } from '../../../../core/models/people/person.model';
import { KnownForItem } from '../../../../core/models/shared/known-for-item.model';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { ProfilePathDirective } from '../../../../shared/directives/profile-path.directive';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';

@Component({
    selector: 'app-trending-people',
    standalone: true,
    providers: [],
    templateUrl: './people.component.html',
    styleUrl: './people.component.scss',
    imports: [CommonModule, ReactiveFormsModule, ProfilePathDirective, RouterLink],
})
export class TrendingPeopleComponent extends BaseComponent implements OnInit {
    public profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    public profileFallback = DEFAULT.mediumProfileFallback;
    public TRENDING_FILTER = TRENDING_FILTER;
    public trendingPeopleForm!: FormGroup;
    public trendingPeople: Array<Person> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private trendingFacade: TrendingFacade,
        private formBuilder: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.initTrendingForm();
        this.getTrendingPeople();
        this.onTrendingFilterChanges();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getTrendingPeople(true);
        }
    }

    public isMovie(item: KnownForItem): boolean {
        return item.media_type === 'movie';
    }

    private getTrendingPeople(loadMore: boolean = false): void {
        const trendingFilter: TRENDING_FILTER =
            (this.trendingPeopleFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingPeople(trendingFilter, this.currentPage)
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingPeople) => {
                if (loadMore) {
                    this.trendingPeople = [...this.trendingPeople, ...trendingPeople.results];
                } else {
                    this.trendingPeople = trendingPeople.results;
                }

                this.currentPage = +trendingPeople.page;
                this.totalPages = +trendingPeople.total_pages;
            });
    }

    private initTrendingForm(): void {
        this.trendingPeopleForm = this.formBuilder.group({
            peopleFilter: DEFAULT.trendingFilter,
        });
    }

    private onTrendingFilterChanges(): void {
        this.trendingPeopleFilterFormField.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.currentPage = DEFAULT.page;
            this.getTrendingPeople();
        });
    }

    private get trendingPeopleFilterFormField(): FormControl {
        return this.trendingPeopleForm.get('peopleFilter') as FormControl;
    }
}
