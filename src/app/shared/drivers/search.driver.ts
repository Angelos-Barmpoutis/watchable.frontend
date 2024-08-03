import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { PaginatedPeople } from '../../core/models/people/paginated-people.model';
import { PaginatedSearchItems } from '../../core/models/shared/paginated-search-items.model';
import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { HttpService } from '../../core/services/http.service';

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
