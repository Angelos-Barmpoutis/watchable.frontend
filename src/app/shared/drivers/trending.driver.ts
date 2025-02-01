import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedMovies } from '../models/movies/paginated-movies.model';
import { PaginatedPeople } from '../models/people/paginated-people.model';
import { PaginatedTvSeries } from '../models/tv-series/paginated-tv-series.model';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class TrendingDriver {
    constructor(private httpService: HttpService) {}

    getTrendingMovies(url: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(url);
    }

    getTrendingTvSeries(url: string): Observable<PaginatedTvSeries> {
        return this.httpService.get<PaginatedTvSeries>(url);
    }

    getTrendingPeople(url: string): Observable<PaginatedPeople> {
        return this.httpService.get<PaginatedPeople>(url);
    }
}
