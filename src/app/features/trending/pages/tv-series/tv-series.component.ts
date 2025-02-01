import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { POSTER_SIZE } from '../../../../shared/enumerations/poster-size.enum';
import { TRENDING_FILTER } from '../../../../shared/enumerations/trending-filter.enum';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { TvSeries } from '../../../../shared/models/tv-series/tv-series.model';

@Component({
    selector: 'app-people-tv-series',
    standalone: true,
    providers: [],
    templateUrl: './tv-series.component.html',
    styleUrl: './tv-series.component.scss',
    imports: [CommonModule, ReactiveFormsModule, PosterPathDirective, RouterLink],
})
export class TrendingTvSeriesComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public TRENDING_FILTER = TRENDING_FILTER;
    public trendingTvSeriesForm!: FormGroup;
    public trendingTvSeries: Array<TvSeries> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private trendingFacade: TrendingFacade,
        private formBuilder: FormBuilder,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.initTrendingForm();
        this.getTrendingTvSeries();
        this.onTrendingFilterChanges();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getTrendingTvSeries(true);
        }
    }

    private getTrendingTvSeries(loadMore: boolean = false): void {
        const trendingFilter: TRENDING_FILTER =
            (this.trendingTvSeriesFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingTvSeries(trendingFilter, this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((trendingTvSeries) => {
                if (loadMore) {
                    this.trendingTvSeries = [...this.trendingTvSeries, ...trendingTvSeries.results];
                } else {
                    this.trendingTvSeries = trendingTvSeries.results;
                }

                this.currentPage = trendingTvSeries.page;
                this.totalPages = trendingTvSeries.total_pages;
            });
    }

    private initTrendingForm(): void {
        this.trendingTvSeriesForm = this.formBuilder.group({
            tvSeriesFilter: DEFAULT.trendingFilter,
        });
    }

    private onTrendingFilterChanges(): void {
        this.trendingTvSeriesFilterFormField.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.currentPage = DEFAULT.page;
            this.getTrendingTvSeries();
        });
    }

    private get trendingTvSeriesFilterFormField(): FormControl {
        return this.trendingTvSeriesForm.get('tvSeriesFilter') as FormControl;
    }
}
