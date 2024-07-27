import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { UrlService } from '../../core/services/url.service';
import { TvSeriesDriver } from '../drivers/tv-series.driver';

@Injectable({
    providedIn: 'root',
})
export class TvSeriesGateway {
    constructor(
        private tvSeriesDriver: TvSeriesDriver,
        private urlService: UrlService,
    ) {}

    getAiringToday(): Observable<PaginatedTvSeries> {
        return this.tvSeriesDriver.getAiringToday(this.urlService.urlFor(['tv', 'airing_today']));
    }

    getPopular(): Observable<PaginatedTvSeries> {
        return this.tvSeriesDriver.getPopular(this.urlService.urlFor(['tv', 'popular']));
    }

    getTopRated(): Observable<PaginatedTvSeries> {
        return this.tvSeriesDriver.getTopRated(this.urlService.urlFor(['tv', 'top_rated']));
    }
}
