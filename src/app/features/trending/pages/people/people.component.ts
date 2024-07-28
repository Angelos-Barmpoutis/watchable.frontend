import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../../../core/enumerations/poster-size.enum';
import { TRENDING_FILTER } from '../../../../core/enumerations/trending-filter.enum';
import { Movie } from '../../../../core/models/movies/movie.model';
import { Person } from '../../../../core/models/people/person.model';
import { Media } from '../../../../core/models/shared/media.model';
import { TvSeries } from '../../../../core/models/tv-series/tv-series.model';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './people.component.html',
    styleUrl: './people.component.scss',
    imports: [CommonModule, ReactiveFormsModule, PosterPathDirective, RouterLink],
})
export class TrendingPeopleComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
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

    public isMovie(item: Media | Movie | TvSeries): item is Movie {
        return (item as Movie).title !== undefined;
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
