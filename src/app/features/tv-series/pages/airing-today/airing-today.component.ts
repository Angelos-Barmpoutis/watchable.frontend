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
    templateUrl: './airing-today.component.html',
    styleUrl: './airing-today.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class TvSeriesAiringTodayComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public airingTodayTvSeries: Array<TvSeries> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(private tvSeriesFacade: TvSeriesFacade) {
        super();
    }

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
            .pipe(takeUntil(this.destroyed))
            .subscribe((airingTodayTvSeries) => {
                if (loadMore) {
                    this.airingTodayTvSeries = [...this.airingTodayTvSeries, ...airingTodayTvSeries.results];
                } else {
                    this.airingTodayTvSeries = airingTodayTvSeries.results;
                }

                this.currentPage = +airingTodayTvSeries.page;
                this.totalPages = +airingTodayTvSeries.total_pages;
            });
    }
}
