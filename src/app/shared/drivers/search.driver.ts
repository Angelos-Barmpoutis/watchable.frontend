import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedMovies } from '../models/movies/paginated-movies.model';
import { PaginatedPeople } from '../models/people/paginated-people.model';
import { PaginatedSearchItems } from '../models/shared/paginated-search-items.model';
import { PaginatedTvSeries } from '../models/tv-series/paginated-tv-series.model';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class SearchDriver {
    constructor(private httpService: HttpService) {}

    getMulti(url: string): Observable<PaginatedSearchItems> {
        return this.httpService.get(url);
    }

    getMovies(url: string): Observable<PaginatedMovies> {
        return this.httpService.get(url);
    }

    getTvSeries(url: string): Observable<PaginatedTvSeries> {
        return this.httpService.get(url);
    }

    getPeople(url: string): Observable<PaginatedPeople> {
        return this.httpService.get(url);
    }
}
