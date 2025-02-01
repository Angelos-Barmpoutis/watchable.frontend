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
    selector: 'app-popular-tv-series',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class TvSeriesPopularComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public popularTvSeries: Array<TvSeries> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private tvSeriesFacade: TvSeriesFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getPopularTvSeries();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getPopularTvSeries(true);
        }
    }

    private getPopularTvSeries(loadMore: boolean = false): void {
        this.tvSeriesFacade
            .getPopular(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((popularTvSeries) => {
                if (loadMore) {
                    this.popularTvSeries = [...this.popularTvSeries, ...popularTvSeries.results];
                } else {
                    this.popularTvSeries = popularTvSeries.results;
                }

                this.currentPage = popularTvSeries.page;
                this.totalPages = popularTvSeries.total_pages;
            });
    }
}
