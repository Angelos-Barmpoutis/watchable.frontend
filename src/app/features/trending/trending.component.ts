import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../core/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../core/enumerations/profile-size.enum';
import { TRENDING_FILTER } from '../../core/enumerations/trending-filter.enum';
import { Movie } from '../../core/models/movies/movie.model';
import { Person } from '../../core/models/people/person.model';
import { Media } from '../../core/models/shared/media.model';
import { TvSeries } from '../../core/models/tv-series/tv-series.model';
import { DEFAULT } from '../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { ProfilePathDirective } from '../../shared/directives/profile-path.directive';
import { TrendingFacade } from '../../shared/facades/trending.facade';
import { BaseComponent } from '../../shared/helpers/base.component';
import { LimitToPipe } from '../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './trending.component.html',
    styleUrl: './trending.component.scss',
    imports: [CommonModule, PosterPathDirective, ProfilePathDirective, ReactiveFormsModule, LimitToPipe, RouterLink],
})
export class TrendingComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.mediumPosterSize;
    public posterFallback = DEFAULT.mediumPosterFallback;
    public profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    public profileFallback = DEFAULT.mediumProfileFallback;
    public TRENDING_FILTER = TRENDING_FILTER;
    public trendingForm!: FormGroup;
    public isTrendingMoviesLoading = false;
    public isTrendingTvSeriesLoading = false;
    public isTrendingPeopleLoading = false;
    public trendingMovies: Array<Movie> = [];
    public trendingTvSeries: Array<TvSeries> = [];
    public trendingPeople: Array<Person> = [];

    constructor(
        private trendingFacade: TrendingFacade,
        private formBuilder: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.initTrendingForm();
        this.getTrendingMovies();
        this.getTrendingTvSeries();
        this.getTrendingPeople();
        this.onTrendingFilterChanges();
    }

    public isMovie(item: Media | Movie | TvSeries): item is Movie {
        return (item as Movie).title !== undefined;
    }

    private getTrendingMovies(): void {
        this.isTrendingMoviesLoading = true;
        const trendingFilter: TRENDING_FILTER =
            (this.trendingMoviesFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingMovies(trendingFilter)
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingMovies) => {
                this.trendingMovies = trendingMovies.results;
                this.isTrendingMoviesLoading = false;
            });
    }

    private getTrendingTvSeries(): void {
        this.isTrendingTvSeriesLoading = true;
        const trendingFilter: TRENDING_FILTER =
            (this.trendingTvSeriesFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingTvSeries(trendingFilter)
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingTvSeries) => {
                this.trendingTvSeries = trendingTvSeries.results;
                this.isTrendingTvSeriesLoading = false;
            });
    }

    private getTrendingPeople(): void {
        this.isTrendingPeopleLoading = true;
        const trendingFilter: TRENDING_FILTER =
            (this.trendingPeopleFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingPeople(trendingFilter)
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingPeople) => {
                this.trendingPeople = trendingPeople.results;
                this.isTrendingPeopleLoading = false;
            });
    }

    private initTrendingForm(): void {
        this.trendingForm = this.formBuilder.group({
            moviesFilter: DEFAULT.trendingFilter,
            tvSeriesFilter: DEFAULT.trendingFilter,
            peopleFilter: DEFAULT.trendingFilter,
        });
    }

    private onTrendingFilterChanges(): void {
        this.trendingMoviesFilterFormField.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.getTrendingMovies();
        });

        this.trendingTvSeriesFilterFormField.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.getTrendingTvSeries();
        });

        this.trendingPeopleFilterFormField.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.getTrendingPeople();
        });
    }

    private get trendingMoviesFilterFormField(): FormControl {
        return this.trendingForm.get('moviesFilter') as FormControl;
    }

    private get trendingTvSeriesFilterFormField(): FormControl {
        return this.trendingForm.get('tvSeriesFilter') as FormControl;
    }

    private get trendingPeopleFilterFormField(): FormControl {
        return this.trendingForm.get('peopleFilter') as FormControl;
    }
}
