import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { MediaType } from '../enumerations/media-type.enum';
import { DiscoverGateway } from '../gateways/discover.gateway';
import { MovieGateway } from '../gateways/movie.gateway';
import { Genre } from '../models/genre.model';
import { AddMovieRatingRequest, AddMovieRatingResponse, MovieDetails, PaginatedMovies } from '../models/movie.model';
import { LocalStorageService } from '../services/local-storage.service';

export interface AllMovies {
    nowPlaying: PaginatedMovies;
    popular: PaginatedMovies;
    topRated: PaginatedMovies;
    upcoming: PaginatedMovies;
}

export interface GenreContentBatch {
    [key: string]: PaginatedMovies;
}

@Injectable({
    providedIn: 'root',
})
export class MovieFacade {
    constructor(
        private movieGateway: MovieGateway,
        private discoverGateway: DiscoverGateway,
        private localStorageService: LocalStorageService,
    ) {}

    getNowPlaying(page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.movieGateway.getNowPlaying(page);
    }

    getPopular(page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.movieGateway.getPopular(page);
    }

    getTopRated(page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.movieGateway.getTopRated(page);
    }

    getUpcoming(page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.movieGateway.getUpcoming(page);
    }

    getDetails(id: number): Observable<MovieDetails> {
        return this.movieGateway.getDetails(id);
    }

    getAllMovies(): Observable<AllMovies> {
        return forkJoin({
            nowPlaying: this.getNowPlaying(),
            popular: this.getPopular(),
            topRated: this.getTopRated(),
            upcoming: this.getUpcoming(),
        });
    }

    getMovies(page: number = DEFAULT.page, genreId: number): Observable<PaginatedMovies> {
        return this.discoverGateway.getMovies(page, genreId);
    }

    getMoviesByGenreIds(
        currentMovieGenreIndex: number,
        genresPerBatch: number = DEFAULT.genresBatchSize,
    ): Observable<GenreContentBatch> {
        const movieGenres: Array<Genre> = this.localStorageService.getItem<Array<Genre>>('movieGenres') ?? [];
        const genresToLoad: Record<string, Observable<PaginatedMovies>> = {};

        for (let i = 0; i < genresPerBatch; i++) {
            if (currentMovieGenreIndex + i < movieGenres.length) {
                const genre = movieGenres[currentMovieGenreIndex + i];
                genresToLoad[`${MediaType.Movie}_${genre.name}`] = this.getMovies(undefined, genre.id);
            }
        }

        // If no genres to load, return empty object
        if (Object.keys(genresToLoad).length === 0) {
            // Return an empty observable that completes immediately
            return forkJoin({});
        }

        // Load the genres
        return forkJoin(genresToLoad);
    }

    addMovieRating(id: number, request: AddMovieRatingRequest): Observable<AddMovieRatingResponse> {
        return this.movieGateway.addMovieRating(id, request);
    }
}
