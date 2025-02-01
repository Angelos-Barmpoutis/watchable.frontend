import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { TvSeriesGateway } from '../gateways/tv-series.gateway';
import { PaginatedTvSeries } from '../models/tv-series/paginated-tv-series.model';

export interface AllTvSeries {
    airingToday: PaginatedTvSeries;
    popular: PaginatedTvSeries;
    topRated: PaginatedTvSeries;
}

@Injectable({
    providedIn: 'root',
})
export class TvSeriesFacade {
    constructor(private tvSeriesGateway: TvSeriesGateway) {}

    public getAiringToday(page: number = DEFAULT.page): Observable<PaginatedTvSeries> {
        return this.tvSeriesGateway.getAiringToday(page);
    }

    public getPopular(page: number = DEFAULT.page): Observable<PaginatedTvSeries> {
        return this.tvSeriesGateway.getPopular(page);
    }

    public getTopRated(page: number = DEFAULT.page): Observable<PaginatedTvSeries> {
        return this.tvSeriesGateway.getTopRated(page);
    }

    public getAllTvSeries(): Observable<AllTvSeries> {
        return forkJoin({
            airingToday: this.getAiringToday(),
            popular: this.getPopular(),
            topRated: this.getTopRated(),
        });
    }
}
