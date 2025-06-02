import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AddMovieRatingRequest, AddMovieRatingResponse, MovieDetails, PaginatedMovies } from '../models/movie.model';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class MovieDriver {
    constructor(private httpService: HttpService) {}

    getNowPlaying(url: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(url);
    }

    getPopular(url: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(url);
    }

    getTopRated(url: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(url);
    }

    getUpcoming(url: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(url);
    }

    getDetails(url: string): Observable<MovieDetails> {
        return this.httpService.get<MovieDetails>(url);
    }

    getMoviesByGenre(url: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(url);
    }

    addMovieRating(url: string, request: AddMovieRatingRequest): Observable<AddMovieRatingResponse> {
        return this.httpService.post<AddMovieRatingResponse>(url, request);
    }
}
