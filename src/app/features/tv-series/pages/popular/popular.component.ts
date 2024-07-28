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
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class TvSeriesPopularComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public popularTvSeries: Array<TvSeries> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(private tvSeriesFacade: TvSeriesFacade) {
        super();
    }

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
            .pipe(takeUntil(this.destroyed))
            .subscribe((popularTvSeries) => {
                if (loadMore) {
                    this.popularTvSeries = [...this.popularTvSeries, ...popularTvSeries.results];
                } else {
                    this.popularTvSeries = popularTvSeries.results;
                }

                this.currentPage = +popularTvSeries.page;
                this.totalPages = +popularTvSeries.total_pages;
            });
    }
}
