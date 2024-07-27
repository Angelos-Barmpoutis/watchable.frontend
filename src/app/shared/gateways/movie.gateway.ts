import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { UrlService } from '../../core/services/url.service';
import { MovieDriver } from '../drivers/movie.driver';

@Injectable({
    providedIn: 'root',
})
export class MovieGateway {
    constructor(
        private movieDriver: MovieDriver,
        private urlService: UrlService,
    ) {}

    getNowPlaying(): Observable<PaginatedMovies> {
        return this.movieDriver.get(this.urlService.urlFor(['movie', 'now_playing']));
    }

    getPopular(): Observable<PaginatedMovies> {
        return this.movieDriver.get(this.urlService.urlFor(['movie', 'popular']));
    }

    getTopRated(): Observable<PaginatedMovies> {
        return this.movieDriver.get(this.urlService.urlFor(['movie', 'top_rated']));
    }

    getUpcoming(): Observable<PaginatedMovies> {
        return this.movieDriver.get(this.urlService.urlFor(['movie', 'upcoming']));
    }
}
