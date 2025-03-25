import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { SearchGateway } from '../gateways/search.gateway';
import { PaginatedMovies } from '../models/movie.model';
import { PaginatedPeople } from '../models/people.model';
import { PaginatedSearchResults } from '../models/search.model';
import { PaginatedTvShows } from '../models/tv-show.model';

export interface AllSearchItems {
    multi: PaginatedSearchResults;
    movies: PaginatedMovies;
    tvShows: PaginatedTvShows;
    people: PaginatedPeople;
}

@Injectable({
    providedIn: 'root',
})
export class SearchFacade {
    constructor(private searchGateway: SearchGateway) {}

    public getMulti(query: string = '', page: number = DEFAULT.page): Observable<PaginatedSearchResults> {
        return this.searchGateway.getMulti(query, page);
    }

    public getMovies(query: string = '', page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.searchGateway.getMovies(query, page);
    }

    public getTvSeries(query: string = '', page: number = DEFAULT.page): Observable<PaginatedTvShows> {
        return this.searchGateway.getTvShows(query, page);
    }

    public getPeople(query: string = '', page: number = DEFAULT.page): Observable<PaginatedPeople> {
        return this.searchGateway.getPeople(query, page);
    }

    public getAll(query: string = ''): Observable<AllSearchItems> {
        return forkJoin({
            multi: this.getMulti(query),
            movies: this.getMovies(query),
            tvShows: this.getTvSeries(query),
            people: this.getPeople(query),
        });
    }
}
