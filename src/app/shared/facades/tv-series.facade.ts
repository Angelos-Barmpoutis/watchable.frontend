import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { TvSeriesGateway } from '../gateways/tv-series.gateway';

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

    public getAiringToday(): Observable<PaginatedTvSeries> {
        return this.tvSeriesGateway.getAiringToday();
    }

    public getPopular(): Observable<PaginatedTvSeries> {
        return this.tvSeriesGateway.getPopular();
    }

    public getTopRated(): Observable<PaginatedTvSeries> {
        return this.tvSeriesGateway.getTopRated();
    }

    public getAllTvSeries(): Observable<AllTvSeries> {
        return forkJoin({
            airingToday: this.getAiringToday(),
            popular: this.getPopular(),
            topRated: this.getTopRated(),
        });
    }
}
