import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MovieDriver } from '../drivers/movie.driver';
import { MovieDetails, PaginatedMovies } from '../models/movie.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class MovieGateway {
    constructor(
        private movieDriver: MovieDriver,
        private urlService: UrlService,
    ) {}

    getNowPlaying(page: number): Observable<PaginatedMovies> {
        return this.movieDriver.getNowPlaying(this.urlService.createUrlForTMDB(['movie', `now_playing?page=${page}`]));
    }

    getPopular(page: number): Observable<PaginatedMovies> {
        return this.movieDriver.getPopular(this.urlService.createUrlForTMDB(['movie', `popular?page=${page}`]));
    }

    getTopRated(page: number): Observable<PaginatedMovies> {
        return this.movieDriver.getTopRated(this.urlService.createUrlForTMDB(['movie', `top_rated?page=${page}`]));
    }

    getUpcoming(page: number): Observable<PaginatedMovies> {
        return this.movieDriver.getUpcoming(this.urlService.createUrlForTMDB(['movie', `upcoming?page=${page}`]));
    }

    getDetails(id: number): Observable<MovieDetails> {
        const movieId = id.toString();

        return this.movieDriver.getDetails(
            this.urlService.createUrlForTMDB(['movie', `${movieId}?append_to_response=videos,images,reviews`]),
        );
    }
}
