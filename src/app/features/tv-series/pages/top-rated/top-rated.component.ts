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
    selector: 'app-top-rated-tv-series',
    standalone: true,
    providers: [],
    templateUrl: './top-rated.component.html',
    styleUrl: './top-rated.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class TvSeriesTopRatedComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public topRatedTvSeries: Array<TvSeries> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private tvSeriesFacade: TvSeriesFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getTopRatedTvSeries();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getTopRatedTvSeries(true);
        }
    }

    private getTopRatedTvSeries(loadMore: boolean = false): void {
        this.tvSeriesFacade
            .getTopRated(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((topRatedTvSeries) => {
                if (loadMore) {
                    this.topRatedTvSeries = [...this.topRatedTvSeries, ...topRatedTvSeries.results];
                } else {
                    this.topRatedTvSeries = topRatedTvSeries.results;
                }

                this.currentPage = topRatedTvSeries.page;
                this.totalPages = topRatedTvSeries.total_pages;
            });
    }
}
