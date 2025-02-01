import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TrendingDriver } from '../drivers/trending.driver';
import { TRENDING_FILTER } from '../enumerations/trending-filter.enum';
import { PaginatedMovies } from '../models/movies/paginated-movies.model';
import { PaginatedPeople } from '../models/people/paginated-people.model';
import { PaginatedTvSeries } from '../models/tv-series/paginated-tv-series.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class TrendingGateway {
    constructor(
        private trendingDriver: TrendingDriver,
        private urlService: UrlService,
    ) {}

    getTrendingMovies(trendingFilter: TRENDING_FILTER, page: number): Observable<PaginatedMovies> {
        return this.trendingDriver.getTrendingMovies(
            this.urlService.urlFor(['trending', 'movie', `${trendingFilter}?page=${page}`]),
        );
    }

    getTrendingTvSeries(trendingFilter: string, page: number): Observable<PaginatedTvSeries> {
        return this.trendingDriver.getTrendingTvSeries(
            this.urlService.urlFor(['trending', 'tv', `${trendingFilter}?page=${page}`]),
        );
    }

    getTrendingPeople(trendingFilter: TRENDING_FILTER, page: number): Observable<PaginatedPeople> {
        return this.trendingDriver.getTrendingPeople(
            this.urlService.urlFor(['trending', 'person', `${trendingFilter}?page=${page}`]),
        );
    }
}
