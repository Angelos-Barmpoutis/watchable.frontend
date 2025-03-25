import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { MEDIA_TYPE } from '../enumerations/media-type.enum';
import { DiscoverGateway } from '../gateways/discover.gateway';
import { TvShowGateway } from '../gateways/tv-show.gateway';
import { Genre } from '../models/genre.model';
import { PaginatedTvShows } from '../models/tv-show.model';
import { LocalStorageService } from '../services/local-storage.service';

export interface AllTvShows {
    airingToday: PaginatedTvShows;
    popular: PaginatedTvShows;
    topRated: PaginatedTvShows;
}

export interface GenreContentBatch {
    [key: string]: PaginatedTvShows;
}

@Injectable({
    providedIn: 'root',
})
export class TvShowFacade {
    constructor(
        private tvShowGateway: TvShowGateway,
        private discoverGateway: DiscoverGateway,
        private localStorageService: LocalStorageService,
    ) {}

    public getAiringToday(page: number = DEFAULT.page): Observable<PaginatedTvShows> {
        return this.tvShowGateway.getAiringToday(page);
    }

    public getPopular(page: number = DEFAULT.page): Observable<PaginatedTvShows> {
        return this.tvShowGateway.getPopular(page);
    }

    public getTopRated(page: number = DEFAULT.page): Observable<PaginatedTvShows> {
        return this.tvShowGateway.getTopRated(page);
    }

    public getAllTvShows(): Observable<AllTvShows> {
        return forkJoin({
            airingToday: this.getAiringToday(),
            popular: this.getPopular(),
            topRated: this.getTopRated(),
        });
    }

    public getTvShows(page: number = DEFAULT.page, genreId: number): Observable<PaginatedTvShows> {
        return this.discoverGateway.getTvShows(page, genreId);
    }

    public getTvShowsByGenreIds(
        currentTvShowGenreIndex: number,
        genresPerBatch: number = DEFAULT.genresBatchSize,
    ): Observable<GenreContentBatch> {
        const tvShowGenres: Array<Genre> = this.localStorageService.getItem<Array<Genre>>('tvShowGenres') ?? [];
        const genresToLoad: Record<string, Observable<PaginatedTvShows>> = {};

        for (let i = 0; i < genresPerBatch; i++) {
            if (currentTvShowGenreIndex + i < tvShowGenres.length) {
                const genre = tvShowGenres[currentTvShowGenreIndex + i];
                genresToLoad[`${MEDIA_TYPE.TvShow}_${genre.name}`] = this.getTvShows(undefined, genre.id);
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
