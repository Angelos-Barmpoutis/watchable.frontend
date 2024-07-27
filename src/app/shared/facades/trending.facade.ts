import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TrendingFilter } from '../../core/enumerations/trending-filter.enum';
import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { TrendingGateway } from '../gateways/trending.gateway';

@Injectable({
    providedIn: 'root',
})
export class TrendingFacade {
    constructor(private trendingGateway: TrendingGateway) {}

    public getTrendingMovies(trendingFilter: TrendingFilter): Observable<PaginatedMovies> {
        return this.trendingGateway.getTrendingMovies(trendingFilter);
    }

    public getTrendingTvSeries(trendingFilter: TrendingFilter): Observable<PaginatedTvSeries> {
        return this.trendingGateway.getTrendingTvSeries(trendingFilter);
    }
}
