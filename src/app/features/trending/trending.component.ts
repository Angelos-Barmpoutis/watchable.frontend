import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { ProfilePathDirective } from '../../shared/directives/profile-path.directive';
import { POSTER_SIZE } from '../../shared/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../shared/enumerations/profile-size.enum';
import { TRENDING_FILTER } from '../../shared/enumerations/trending-filter.enum';
import { TrendingFacade } from '../../shared/facades/trending.facade';
import { Movie } from '../../shared/models/movies/movie.model';
import { Person } from '../../shared/models/people/person.model';
import { KnownForItem } from '../../shared/models/shared/known-for-item.model';
import { TvSeries } from '../../shared/models/tv-series/tv-series.model';
import { LimitToPipe } from '../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-trending',
    standalone: true,
    providers: [],
    templateUrl: './trending.component.html',
    styleUrl: './trending.component.scss',
    imports: [CommonModule, PosterPathDirective, ProfilePathDirective, ReactiveFormsModule, LimitToPipe, RouterLink],
})
export class TrendingComponent implements OnInit {
    posterSize: POSTER_SIZE = DEFAULT.mediumPosterSize;
    posterFallback = DEFAULT.mediumPosterFallback;
    profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    profileFallback = DEFAULT.mediumProfileFallback;
    TRENDING_FILTER = TRENDING_FILTER;
    trendingForm!: FormGroup;
    isLoading = false;
    trendingMovies: Array<Movie> = [];
    trendingTvSeries: Array<TvSeries> = [];
    trendingPeople: Array<Person> = [];
    private get trendingMoviesFilterFormField(): FormControl {
        return this.trendingForm.get('moviesFilter') as FormControl;
    }

    private get trendingTvSeriesFilterFormField(): FormControl {
        return this.trendingForm.get('tvSeriesFilter') as FormControl;
    }

    private get trendingPeopleFilterFormField(): FormControl {
        return this.trendingForm.get('peopleFilter') as FormControl;
    }

    constructor(
        private trendingFacade: TrendingFacade,
        private formBuilder: FormBuilder,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.initTrendingForm();
        this.getAllTrending();
        this.onTrendingFilterChanges();
    }

    isMovie(item: KnownForItem): boolean {
        return item.media_type === 'movie';
    }

    private getTrendingMovies(): void {
        this.isLoading = true;
        const trendingFilter: TRENDING_FILTER =
            (this.trendingMoviesFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingMovies(trendingFilter)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((trendingMovies) => {
                this.trendingMovies = trendingMovies.results;
                this.isLoading = false;
            });
    }

    private getTrendingTvSeries(): void {
        this.isLoading = true;
        const trendingFilter: TRENDING_FILTER =
            (this.trendingTvSeriesFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingTvSeries(trendingFilter)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((trendingTvSeries) => {
                this.trendingTvSeries = trendingTvSeries.results;
                this.isLoading = false;
            });
    }

    private getTrendingPeople(): void {
        this.isLoading = true;
        const trendingFilter: TRENDING_FILTER =
            (this.trendingPeopleFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingPeople(trendingFilter)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((trendingPeople) => {
                this.trendingPeople = trendingPeople.results;
                this.isLoading = false;
            });
    }

    private getAllTrending(): void {
        this.isLoading = true;

        this.trendingFacade
            .getAllTrending()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((allTrending) => {
                this.trendingMovies = allTrending.movies.results;
                this.trendingTvSeries = allTrending.tvSeries.results;
                this.trendingPeople = allTrending.people.results;

                this.isLoading = false;
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
        this.trendingMoviesFilterFormField.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.getTrendingMovies();
        });

        this.trendingTvSeriesFilterFormField.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.getTrendingTvSeries();
        });

        this.trendingPeopleFilterFormField.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.getTrendingPeople();
        });
    }
}
