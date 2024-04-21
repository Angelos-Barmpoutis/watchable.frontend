import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Observable, takeUntil } from 'rxjs';

import { TrendingFilter } from '../../core/enumerations/trending-filter.enum';
import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { TvSeries } from '../../core/models/tv-series/tv-series.model';
import { PageLoaderService } from '../../core/services/page-loader.service';
import { SectionLoaderService } from '../../core/services/section-loader.service';
import { SectionLoaderComponent } from '../../shared/components/section-loader/section-loader.component';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { BaseComponent } from '../../shared/helpers/base.component';
import { TvSeriesService } from '../../shared/services/tv-series.service';

@Component({
    selector: 'app-tv-series',
    standalone: true,
    providers: [TvSeriesService, SectionLoaderService],
    templateUrl: './tv-series.component.html',
    styleUrl: './tv-series.component.scss',
    imports: [CommonModule, PosterPathDirective, ReactiveFormsModule, SectionLoaderComponent],
})
export class TvSeriesComponent extends BaseComponent implements OnInit {
    TRENDING_FILTER = TrendingFilter;

    trendingFilter = TrendingFilter.Day;
    trendingForm: FormGroup;

    trending: Array<TvSeries> = [];
    airingToday: Array<TvSeries> = [];
    popular: Array<TvSeries> = [];
    topRated: Array<TvSeries> = [];

    trending$ = this.getTrending();
    airingToday$ = this.getAiringToday();
    popular$ = this.getPopular();
    topRated$ = this.getTopRated();

    isSectionloading = false;

    constructor(
        private tvSeriesService: TvSeriesService,
        private pageLoaderService: PageLoaderService,
        private sectionLoaderService: SectionLoaderService,
        private formBuilder: FormBuilder,
    ) {
        super();
        this.pageLoaderService.showLoader();

        this.sectionLoaderService.loading$.pipe(takeUntil(this.destroyed)).subscribe((isSectionloading) => {
            this.isSectionloading = isSectionloading;
        });

        this.trendingForm = this.formBuilder.group({
            filter: this.trendingFilter,
        });

        this.trendingForm.valueChanges
            .pipe(takeUntil(this.destroyed))
            .subscribe((formValue: { filter: TrendingFilter }) => {
                this.sectionLoaderService.showLoader();
                this.filterTrending(formValue.filter);
            });
    }

    ngOnInit(): void {
        forkJoin([this.trending$, this.airingToday$, this.popular$, this.topRated$])
            .pipe(takeUntil(this.destroyed))
            .subscribe(([trending, airingToday, popular, topRated]) => {
                this.populateTvSeries(trending, airingToday, popular, topRated);
                this.pageLoaderService.hideLoader();
            });
    }

    private getTrending(trendingFilter = this.trendingFilter): Observable<PaginatedTvSeries> {
        return this.tvSeriesService.getTrending(trendingFilter);
    }

    private getAiringToday(): Observable<PaginatedTvSeries> {
        return this.tvSeriesService.getAiringToday();
    }

    private getPopular(): Observable<PaginatedTvSeries> {
        return this.tvSeriesService.getPopular();
    }

    private getTopRated(): Observable<PaginatedTvSeries> {
        return this.tvSeriesService.getTopRated();
    }

    private filterTrending(trendingFilter: TrendingFilter): void {
        this.getTrending(trendingFilter)
            .pipe(takeUntil(this.destroyed))
            .subscribe((trending) => {
                this.trending = trending.results.slice(0, 10);
                this.sectionLoaderService.hideLoader();
            });
    }

    private populateTvSeries(
        trending: PaginatedTvSeries,
        airingToday: PaginatedTvSeries,
        popular: PaginatedTvSeries,
        topRated: PaginatedTvSeries,
    ): void {
        this.trending = trending.results.slice(0, 10);

        airingToday.results.forEach((tvSeries) => {
            if (!this.existsInCategory(tvSeries, this.trending)) {
                this.airingToday.push(tvSeries);
            }
        });
        this.airingToday = this.airingToday.slice(0, 10);

        popular.results.forEach((tvSeries, tvSeriesIndex) => {
            const remaining = popular.results.length - tvSeriesIndex;

            if (!this.existsInCategory(tvSeries, this.trending) && !this.existsInCategory(tvSeries, this.airingToday)) {
                this.popular.push(tvSeries);
            } else if (this.popular.length + remaining === 10) {
                this.popular.push(tvSeries);
            }
        });

        this.popular = this.popular.slice(0, 10);

        topRated.results.forEach((tvSeries, tvSeriesIndex) => {
            const remaining = topRated.results.length - tvSeriesIndex;

            if (
                !this.existsInCategory(tvSeries, this.trending) &&
                !this.existsInCategory(tvSeries, this.airingToday) &&
                !this.existsInCategory(tvSeries, this.popular)
            ) {
                this.topRated.push(tvSeries);
            } else if (this.topRated.length + remaining === 10) {
                this.topRated.push(tvSeries);
            }
        });

        this.topRated = this.topRated.slice(0, 10);
    }

    private existsInCategory(tvSeries: TvSeries, category: Array<TvSeries>): boolean {
        return category.some((categoryTvSeries) => tvSeries.id === categoryTvSeries.id);
    }
}
