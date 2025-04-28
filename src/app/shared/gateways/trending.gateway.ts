import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TrendingDriver } from '../drivers/trending.driver';
import { TimeOption } from '../enumerations/time-option.enum';
import { PaginatedMovies } from '../models/movie.model';
import { PaginatedPeople } from '../models/people.model';
import { PaginatedTvShows } from '../models/tv-show.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class TrendingGateway {
    constructor(
        private trendingDriver: TrendingDriver,
        private urlService: UrlService,
    ) {}

    getMovies(trendingFilter: TimeOption, page: number): Observable<PaginatedMovies> {
        return this.trendingDriver.getMovies(
            this.urlService.createUrlForTMDB(['trending', 'movie', `${trendingFilter}?page=${page}`]),
        );
    }

    getTvShows(trendingFilter: TimeOption, page: number): Observable<PaginatedTvShows> {
        return this.trendingDriver.getTvShows(
            this.urlService.createUrlForTMDB(['trending', 'tv', `${trendingFilter}?page=${page}`]),
        );
    }

    getPeople(trendingFilter: TimeOption, page: number): Observable<PaginatedPeople> {
        return this.trendingDriver.getPeople(
            this.urlService.createUrlForTMDB(['trending', 'person', `${trendingFilter}?page=${page}`]),
        );
    }
}
