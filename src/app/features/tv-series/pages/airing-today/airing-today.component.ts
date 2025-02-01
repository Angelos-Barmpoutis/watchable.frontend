import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { POSTER_SIZE } from '../../../../shared/enumerations/poster-size.enum';
import { TvSeriesFacade } from '../../../../shared/facades/tv-series.facade';
import { TvSeries } from '../../../../shared/models/tv-series/tv-series.model';

@Component({
    selector: 'app-airing-today-tv-series',
    standalone: true,
    providers: [],
    templateUrl: './airing-today.component.html',
    styleUrl: './airing-today.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class TvSeriesAiringTodayComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public airingTodayTvSeries: Array<TvSeries> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private tvSeriesFacade: TvSeriesFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getAiringTodayTvSeries();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getAiringTodayTvSeries(true);
        }
    }

    private getAiringTodayTvSeries(loadMore: boolean = false): void {
        this.tvSeriesFacade
            .getAiringToday(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((airingTodayTvSeries) => {
                if (loadMore) {
                    this.airingTodayTvSeries = [...this.airingTodayTvSeries, ...airingTodayTvSeries.results];
                } else {
                    this.airingTodayTvSeries = airingTodayTvSeries.results;
                }

                this.currentPage = +airingTodayTvSeries.page;
                this.totalPages = airingTodayTvSeries.total_pages;
            });
    }
}
