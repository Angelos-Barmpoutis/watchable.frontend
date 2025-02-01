import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { PaginatedMovies } from '../models/movies/paginated-movies.model';
import { PaginatedPeople } from '../models/people/paginated-people.model';
import { PaginatedSearchItems } from '../models/shared/paginated-search-items.model';
import { PaginatedTvSeries } from '../models/tv-series/paginated-tv-series.model';
import { DEFAULT } from '../constants/defaults.constant';
import { SearchGateway } from '../gateways/search.gateway';

export interface AllSearchItems {
    multi: PaginatedSearchItems;
    movies: PaginatedMovies;
    tvSeries: PaginatedTvSeries;
    people: PaginatedPeople;
}

@Injectable({
    providedIn: 'root',
})
export class SearchFacade {
    constructor(private searchGateway: SearchGateway) {}

    public getMulti(query: string = '', page: number = DEFAULT.page): Observable<PaginatedSearchItems> {
        return this.searchGateway.getMulti(query, page);
    }

    public getMovies(query: string = '', page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.searchGateway.getMovies(query, page);
    }

    public getTvSeries(query: string = '', page: number = DEFAULT.page): Observable<PaginatedTvSeries> {
        return this.searchGateway.getTvSeries(query, page);
    }

    public getPeople(query: string = '', page: number = DEFAULT.page): Observable<PaginatedPeople> {
        return this.searchGateway.getPeople(query, page);
    }

    public getAll(query: string = ''): Observable<AllSearchItems> {
        return forkJoin({
            multi: this.getMulti(query),
            movies: this.getMovies(query),
            tvSeries: this.getTvSeries(query),
            people: this.getPeople(query),
        });
    }
}
