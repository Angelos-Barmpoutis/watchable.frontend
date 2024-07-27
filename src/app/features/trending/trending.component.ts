import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';

import { TRENDING_FILTER } from '../../core/enumerations/trending-filter.enum';
import { Movie } from '../../core/models/movies/movie.model';
import { TvSeries } from '../../core/models/tv-series/tv-series.model';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { TrendingFacade } from '../../shared/facades/trending.facade';
import { BaseComponent } from '../../shared/helpers/base.component';
import { LimitToPipe } from '../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './trending.component.html',
    styleUrl: './trending.component.scss',
    imports: [CommonModule, PosterPathDirective, ReactiveFormsModule, LimitToPipe],
})
export class TrendingComponent extends BaseComponent implements OnInit {
    public TRENDING_FILTER = TRENDING_FILTER;
    public trendingForm!: FormGroup;
    public isTrendingMoviesLoading = false;
    public isTrendingTvSeriesLoading = false;
    public trendingMovies: Array<Movie> = [];
    public trendingTvSeries: Array<TvSeries> = [];
    private DEFAULT_TRENDING_FILTER: TRENDING_FILTER = TRENDING_FILTER.Day;

    constructor(
        private trendingFacade: TrendingFacade,
        private formBuilder: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getTrendingMovies();
        this.getTrendingTvSeries();
        this.initTrendingForm();
        this.onTrendingFilterChanges();
    }

    private getTrendingMovies(trendingFilter: TRENDING_FILTER = this.DEFAULT_TRENDING_FILTER): void {
        this.isTrendingMoviesLoading = true;

        this.trendingFacade
            .getTrendingMovies(trendingFilter)
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingMovies) => {
                this.trendingMovies = trendingMovies.results;
                this.isTrendingMoviesLoading = false;
            });
    }

    private getTrendingTvSeries(trendingFilter: TRENDING_FILTER = this.DEFAULT_TRENDING_FILTER): void {
        this.isTrendingTvSeriesLoading = true;

        this.trendingFacade
            .getTrendingTvSeries(trendingFilter)
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingTvSeries) => {
                this.trendingTvSeries = trendingTvSeries.results;
                this.isTrendingTvSeriesLoading = false;
            });
    }

    private initTrendingForm(): void {
        this.trendingForm = this.formBuilder.group({
            moviesFilter: this.DEFAULT_TRENDING_FILTER,
            tvSeriesFilter: this.DEFAULT_TRENDING_FILTER,
        });
    }

    private onTrendingFilterChanges(): void {
        this.trendingMoviesFilterFormField.valueChanges
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingFilter: TRENDING_FILTER) => {
                this.getTrendingMovies(trendingFilter);
            });

        this.trendingTvSeriesFilterFormField.valueChanges
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingFilter: TRENDING_FILTER) => {
                this.getTrendingTvSeries(trendingFilter);
            });
    }

    private get trendingMoviesFilterFormField(): FormControl {
        return this.trendingForm.get('moviesFilter') as FormControl;
    }

    private get trendingTvSeriesFilterFormField(): FormControl {
        return this.trendingForm.get('tvSeriesFilter') as FormControl;
    }
}
