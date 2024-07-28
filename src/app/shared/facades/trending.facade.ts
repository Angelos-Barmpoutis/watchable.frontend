import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TRENDING_FILTER } from '../../core/enumerations/trending-filter.enum';
import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { PaginatedPeople } from '../../core/models/people/paginated-people.model';
import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { DEFAULT } from '../constants/defaults.constant';
import { TrendingGateway } from '../gateways/trending.gateway';

@Injectable({
    providedIn: 'root',
})
export class TrendingFacade {
    constructor(private trendingGateway: TrendingGateway) {}

    public getTrendingMovies(
        trendingFilter: TRENDING_FILTER = DEFAULT.trendingFilter,
        page: number = DEFAULT.page,
    ): Observable<PaginatedMovies> {
        return this.trendingGateway.getTrendingMovies(trendingFilter, page);
    }

    public getTrendingTvSeries(
        trendingFilter: TRENDING_FILTER = DEFAULT.trendingFilter,
        page: number = DEFAULT.page,
    ): Observable<PaginatedTvSeries> {
        return this.trendingGateway.getTrendingTvSeries(trendingFilter, page);
    }

    public getTrendingPeople(
        trendingFilter: TRENDING_FILTER = DEFAULT.trendingFilter,
        page: number = DEFAULT.page,
    ): Observable<PaginatedPeople> {
        return this.trendingGateway.getTrendingPeople(trendingFilter, page);
    }
}
