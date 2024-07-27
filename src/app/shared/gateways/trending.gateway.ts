import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TrendingFilter } from '../../core/enumerations/trending-filter.enum';
import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { UrlService } from '../../core/services/url.service';
import { TrendingDriver } from '../drivers/trending.driver';

@Injectable({
    providedIn: 'root',
})
export class TrendingGateway {
    constructor(
        private trendingDriver: TrendingDriver,
        private urlService: UrlService,
    ) {}

    getTrendingMovies(trendingFilter: TrendingFilter): Observable<PaginatedMovies> {
        return this.trendingDriver.getTrendingMovies(this.urlService.urlFor(['trending', 'movie', trendingFilter]));
    }

    getTrendingTvSeries(trendingFilter: string): Observable<PaginatedTvSeries> {
        return this.trendingDriver.getTrendingTvSeries(this.urlService.urlFor(['trending', 'tv', trendingFilter]));
    }
}
