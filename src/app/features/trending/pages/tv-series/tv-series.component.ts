import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../../../core/enumerations/poster-size.enum';
import { TRENDING_FILTER } from '../../../../core/enumerations/trending-filter.enum';
import { TvSeries } from '../../../../core/models/tv-series/tv-series.model';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';

@Component({
    selector: 'app-people-tv-series',
    standalone: true,
    providers: [],
    templateUrl: './tv-series.component.html',
    styleUrl: './tv-series.component.scss',
    imports: [CommonModule, ReactiveFormsModule, PosterPathDirective, RouterLink],
})
export class TrendingTvSeriesComponent extends BaseComponent implements OnInit {
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
    ) {
        super();
    }

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
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingTvSeries) => {
                if (loadMore) {
                    this.trendingTvSeries = [...this.trendingTvSeries, ...trendingTvSeries.results];
                } else {
                    this.trendingTvSeries = trendingTvSeries.results;
                }

                this.currentPage = +trendingTvSeries.page;
                this.totalPages = +trendingTvSeries.total_pages;
            });
    }

    private initTrendingForm(): void {
        this.trendingTvSeriesForm = this.formBuilder.group({
            tvSeriesFilter: DEFAULT.trendingFilter,
        });
    }

    private onTrendingFilterChanges(): void {
        this.trendingTvSeriesFilterFormField.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.currentPage = DEFAULT.page;
            this.getTrendingTvSeries();
        });
    }

    private get trendingTvSeriesFilterFormField(): FormControl {
        return this.trendingTvSeriesForm.get('tvSeriesFilter') as FormControl;
    }
}
