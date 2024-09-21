import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MovieDetails } from '../../core/models/movies/details.model';
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

    getNowPlaying(page: number): Observable<PaginatedMovies> {
        return this.movieDriver.getNowPlaying(this.urlService.urlFor(['movie', `now_playing?page=${page}`]));
    }

    getPopular(page: number): Observable<PaginatedMovies> {
        return this.movieDriver.getPopular(this.urlService.urlFor(['movie', `popular?page=${page}`]));
    }

    getTopRated(page: number): Observable<PaginatedMovies> {
        return this.movieDriver.getTopRated(this.urlService.urlFor(['movie', `top_rated?page=${page}`]));
    }

    getUpcoming(page: number): Observable<PaginatedMovies> {
        return this.movieDriver.getUpcoming(this.urlService.urlFor(['movie', `upcoming?page=${page}`]));
    }

    getDetails(id: number): Observable<MovieDetails> {
        const movieId = id.toString();

        return this.movieDriver.getDetails(
            this.urlService.urlFor(['movie', `${movieId}?append_to_response=videos,images,reviews`]),
        );
    }
}
