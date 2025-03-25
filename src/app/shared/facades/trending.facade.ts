import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { MEDIA_TYPE } from '../enumerations/media-type.enum';
import { TIME_OPTION } from '../enumerations/time-option.enum';
import { DiscoverGateway } from '../gateways/discover.gateway';
import { TrendingGateway } from '../gateways/trending.gateway';
import { Genre } from '../models/genre.model';
import { PaginatedMovies } from '../models/movie.model';
import { PaginatedPeople } from '../models/people.model';
import { PaginatedTvShows } from '../models/tv-show.model';
import { LocalStorageService } from '../services/local-storage.service';

export interface AllTrending {
    movies: PaginatedMovies;
    tvShows: PaginatedTvShows;
    people: PaginatedPeople;
}

export interface GenreContentBatch {
    [key: string]: PaginatedMovies | PaginatedTvShows;
}

@Injectable({
    providedIn: 'root',
})
export class TrendingFacade {
    constructor(
        private trendingGateway: TrendingGateway,
        private discoverGateway: DiscoverGateway,
        private localStorageService: LocalStorageService,
    ) {}

    public getMovies(
        timeOption: TIME_OPTION = DEFAULT.timeOption,
        page: number = DEFAULT.page,
        genreId?: number,
    ): Observable<PaginatedMovies> {
        if (genreId) {
            return this.discoverGateway.getMovies(page, genreId);
        }
        return this.trendingGateway.getMovies(timeOption, page);
    }

    public getTvShows(
        timeOption: TIME_OPTION = DEFAULT.timeOption,
        page: number = DEFAULT.page,
        genreId?: number,
    ): Observable<PaginatedTvShows> {
        if (genreId) {
            return this.discoverGateway.getTvShows(page, genreId);
        }
        return this.trendingGateway.getTvShows(timeOption, page);
    }

    public getPeople(
        timeOption: TIME_OPTION = DEFAULT.timeOption,
        page: number = DEFAULT.page,
    ): Observable<PaginatedPeople> {
        return this.trendingGateway.getPeople(timeOption, page);
    }

    public getAllTrending(): Observable<AllTrending> {
        return forkJoin({
            movies: this.getMovies(),
            tvShows: this.getTvShows(),
            people: this.getPeople(),
        });
    }

    public getMoviesAndTvShowsByGenreIds(
        currentMovieGenreIndex: number,
        currentTvShowGenreIndex: number,
        genresPerBatch: number = DEFAULT.genresBatchSize,
    ): Observable<GenreContentBatch> {
        const movieGenres: Array<Genre> = this.localStorageService.getItem<Array<Genre>>('movieGenres') ?? [];
        const tvShowGenres: Array<Genre> = this.localStorageService.getItem<Array<Genre>>('tvShowGenres') ?? [];
        const genresToLoad: Record<string, Observable<PaginatedMovies | PaginatedTvShows>> = {};

        for (let i = 0; i < genresPerBatch / 2; i++) {
            if (currentMovieGenreIndex + i < movieGenres.length) {
                const genre = movieGenres[currentMovieGenreIndex + i];
                genresToLoad[`${MEDIA_TYPE.Movie}_${genre.name}`] = this.getMovies(undefined, undefined, genre.id);
            }
        }

        for (let i = 0; i < genresPerBatch / 2; i++) {
            if (currentTvShowGenreIndex + i < tvShowGenres.length) {
                const genre = tvShowGenres[currentTvShowGenreIndex + i];
                genresToLoad[`${MEDIA_TYPE.TvShow}_${genre.name}`] = this.getTvShows(undefined, undefined, genre.id);
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
}
