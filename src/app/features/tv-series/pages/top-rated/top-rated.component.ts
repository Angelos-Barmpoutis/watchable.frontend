import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../../../core/enumerations/poster-size.enum';
import { TvSeries } from '../../../../core/models/tv-series/tv-series.model';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { TvSeriesFacade } from '../../../../shared/facades/tv-series.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './top-rated.component.html',
    styleUrl: './top-rated.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class TvSeriesTopRatedComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public topRatedTvSeries: Array<TvSeries> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(private tvSeriesFacade: TvSeriesFacade) {
        super();
    }

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
            .pipe(takeUntil(this.destroyed))
            .subscribe((topRatedTvSeries) => {
                if (loadMore) {
                    this.topRatedTvSeries = [...this.topRatedTvSeries, ...topRatedTvSeries.results];
                } else {
                    this.topRatedTvSeries = topRatedTvSeries.results;
                }

                this.currentPage = +topRatedTvSeries.page;
                this.totalPages = +topRatedTvSeries.total_pages;
            });
    }
}
