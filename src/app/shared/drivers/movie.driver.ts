import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MovieDetails } from '../../core/models/movies/details.model';
import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { HttpService } from '../../core/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class MovieDriver {
    constructor(private httpService: HttpService) {}

    getNowPlaying(url: string): Observable<PaginatedMovies> {
        return this.httpService.get(url);
    }

    getPopular(url: string): Observable<PaginatedMovies> {
        return this.httpService.get(url);
    }

    getTopRated(url: string): Observable<PaginatedMovies> {
        return this.httpService.get(url);
    }

    getUpcoming(url: string): Observable<PaginatedMovies> {
        return this.httpService.get(url);
    }

    getDetails(url: string): Observable<MovieDetails> {
        return this.httpService.get(url);
    }
}
