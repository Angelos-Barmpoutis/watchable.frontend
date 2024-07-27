import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { HttpService } from '../../core/services/http.service';

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
}
