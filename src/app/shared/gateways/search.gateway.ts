import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SearchDriver } from '../drivers/search.driver';
import { PaginatedMovies } from '../models/movie.model';
import { PaginatedPeople } from '../models/people.model';
import { PaginatedSearchResults } from '../models/search.model';
import { PaginatedTvShows } from '../models/tv-show.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class SearchGateway {
    constructor(
        private searchDriver: SearchDriver,
        private urlService: UrlService,
    ) {}

    getMulti(query: string, page: number): Observable<PaginatedSearchResults> {
        return this.searchDriver.getMulti(
            this.urlService.createUrlForTMDB(['search', `multi?query=${query}&page=${page}`]),
        );
    }

    getMovies(query: string, page: number): Observable<PaginatedMovies> {
        return this.searchDriver.getMovies(
            this.urlService.createUrlForTMDB(['search', `movie?query=${query}&page=${page}`]),
        );
    }

    getTvShows(query: string, page: number): Observable<PaginatedTvShows> {
        return this.searchDriver.getTvShows(
            this.urlService.createUrlForTMDB(['search', `tv?query=${query}&page=${page}`]),
        );
    }

    getPeople(query: string, page: number): Observable<PaginatedPeople> {
        return this.searchDriver.getPeople(
            this.urlService.createUrlForTMDB(['search', `person?query=${query}&page=${page}`]),
        );
    }
}
