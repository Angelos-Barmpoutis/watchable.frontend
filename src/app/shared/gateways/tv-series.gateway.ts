import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TvSeriesDriver } from '../drivers/tv-series.driver';
import { PaginatedTvSeries } from '../models/tv-series/paginated-tv-series.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class TvSeriesGateway {
    constructor(
        private tvSeriesDriver: TvSeriesDriver,
        private urlService: UrlService,
    ) {}

    getAiringToday(page: number): Observable<PaginatedTvSeries> {
        return this.tvSeriesDriver.getAiringToday(this.urlService.urlFor(['tv', `airing_today?page=${page}`]));
    }

    getPopular(page: number): Observable<PaginatedTvSeries> {
        return this.tvSeriesDriver.getPopular(this.urlService.urlFor(['tv', `popular?page=${page}`]));
    }

    getTopRated(page: number): Observable<PaginatedTvSeries> {
        return this.tvSeriesDriver.getTopRated(this.urlService.urlFor(['tv', `top_rated?page=${page}`]));
    }
}
