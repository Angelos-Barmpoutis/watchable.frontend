import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { PaginatedPeople } from '../../core/models/people/paginated-people.model';
import { PaginatedSearchItems } from '../../core/models/shared/paginated-search-items.model';
import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { UrlService } from '../../core/services/url.service';
import { SearchDriver } from '../drivers/search.driver';

@Injectable({
    providedIn: 'root',
})
export class SearchGateway {
    constructor(
        private searchDriver: SearchDriver,
        private urlService: UrlService,
    ) {}

    getMulti(query: string, page: number): Observable<PaginatedSearchItems> {
        return this.searchDriver.getMulti(this.urlService.urlFor(['search', `multi?query=${query}&page=${page}`]));
    }

    getMovies(query: string, page: number): Observable<PaginatedMovies> {
        return this.searchDriver.getMovies(this.urlService.urlFor(['search', `movie?query=${query}&page=${page}`]));
    }

    getTvSeries(query: string, page: number): Observable<PaginatedTvSeries> {
        return this.searchDriver.getTvSeries(this.urlService.urlFor(['search', `tv?query=${query}&page=${page}`]));
    }

    getPeople(query: string, page: number): Observable<PaginatedPeople> {
        return this.searchDriver.getPeople(this.urlService.urlFor(['search', `person?query=${query}&page=${page}`]));
    }
}
