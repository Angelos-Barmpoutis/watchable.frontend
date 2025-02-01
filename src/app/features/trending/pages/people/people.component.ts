import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { ProfilePathDirective } from '../../../../shared/directives/profile-path.directive';
import { PROFILE_SIZE } from '../../../../shared/enumerations/profile-size.enum';
import { TRENDING_FILTER } from '../../../../shared/enumerations/trending-filter.enum';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { Person } from '../../../../shared/models/people/person.model';
import { KnownForItem } from '../../../../shared/models/shared/known-for-item.model';

@Component({
    selector: 'app-trending-people',
    standalone: true,
    providers: [],
    templateUrl: './people.component.html',
    styleUrl: './people.component.scss',
    imports: [CommonModule, ReactiveFormsModule, ProfilePathDirective, RouterLink],
})
export class TrendingPeopleComponent implements OnInit {
    public profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    public profileFallback = DEFAULT.mediumProfileFallback;
    public TRENDING_FILTER = TRENDING_FILTER;
    public trendingPeopleForm!: FormGroup;
    public trendingPeople: Array<Person> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;
    private get trendingPeopleFilterFormField(): FormControl {
        return this.trendingPeopleForm.get('peopleFilter') as FormControl;
    }

    constructor(
        private trendingFacade: TrendingFacade,
        private formBuilder: FormBuilder,
        private destroyRef: DestroyRef,
    ) {}

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
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((trendingPeople) => {
                if (loadMore) {
                    this.trendingPeople = [...this.trendingPeople, ...trendingPeople.results];
                } else {
                    this.trendingPeople = trendingPeople.results;
                }

                this.currentPage = trendingPeople.page;
                this.totalPages = trendingPeople.total_pages;
            });
    }

    private initTrendingForm(): void {
        this.trendingPeopleForm = this.formBuilder.group({
            peopleFilter: DEFAULT.trendingFilter,
        });
    }

    private onTrendingFilterChanges(): void {
        this.trendingPeopleFilterFormField.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.currentPage = DEFAULT.page;
            this.getTrendingPeople();
        });
    }
}
