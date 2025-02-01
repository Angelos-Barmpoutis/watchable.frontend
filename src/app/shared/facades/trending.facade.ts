import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { TRENDING_FILTER } from '../enumerations/trending-filter.enum';
import { TrendingGateway } from '../gateways/trending.gateway';
import { PaginatedMovies } from '../models/movies/paginated-movies.model';
import { PaginatedPeople } from '../models/people/paginated-people.model';
import { PaginatedTvSeries } from '../models/tv-series/paginated-tv-series.model';

export interface AllTrending {
    movies: PaginatedMovies;
    tvSeries: PaginatedTvSeries;
    people: PaginatedPeople;
}
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

    public getAllTrending(): Observable<AllTrending> {
        return forkJoin({
            movies: this.getTrendingMovies(),
            tvSeries: this.getTrendingTvSeries(),
            people: this.getTrendingPeople(),
        });
    }
}
