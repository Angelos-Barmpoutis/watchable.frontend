import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { MediaType } from '../enumerations/media-type.enum';
import { DiscoverGateway } from '../gateways/discover.gateway';
import { TvShowGateway } from '../gateways/tv-show.gateway';
import { Genre } from '../models/genre.model';
import { PaginatedTvShows, TvShowDetails, TvShowEpisodeDetails, TvShowSeasonDetails } from '../models/tv-show.model';
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

    getAiringToday(page: number = DEFAULT.page): Observable<PaginatedTvShows> {
        return this.tvShowGateway.getAiringToday(page);
    }

    getPopular(page: number = DEFAULT.page): Observable<PaginatedTvShows> {
        return this.tvShowGateway.getPopular(page);
    }

    getTopRated(page: number = DEFAULT.page): Observable<PaginatedTvShows> {
        return this.tvShowGateway.getTopRated(page);
    }

    getDetails(id: number): Observable<TvShowDetails> {
        return this.tvShowGateway.getDetails(id);
    }

    getAllTvShows(): Observable<AllTvShows> {
        return forkJoin({
            airingToday: this.getAiringToday(),
            popular: this.getPopular(),
            topRated: this.getTopRated(),
        });
    }

    getTvShows(page: number = DEFAULT.page, genreId: number): Observable<PaginatedTvShows> {
        return this.discoverGateway.getTvShows(page, genreId);
    }

    getTvShowsByGenreIds(
        currentTvShowGenreIndex: number,
        genresPerBatch: number = DEFAULT.genresBatchSize,
    ): Observable<GenreContentBatch> {
        const tvShowGenres: Array<Genre> = this.localStorageService.getItem<Array<Genre>>('tvShowGenres') ?? [];
        const genresToLoad: Record<string, Observable<PaginatedTvShows>> = {};

        for (let i = 0; i < genresPerBatch; i++) {
            if (currentTvShowGenreIndex + i < tvShowGenres.length) {
                const genre = tvShowGenres[currentTvShowGenreIndex + i];
                genresToLoad[`${MediaType.TvShow}_${genre.name}`] = this.getTvShows(undefined, genre.id);
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

    getTvShowSeasonDetails(tvShowId: number, seasonNumber: number): Observable<TvShowSeasonDetails> {
        return this.tvShowGateway.getTvShowSeasonDetails(tvShowId, seasonNumber);
    }

    getTvShowEpisodeDetails(
        tvShowId: number,
        seasonNumber: number,
        episodeNumber: number,
    ): Observable<TvShowEpisodeDetails> {
        return this.tvShowGateway.getTvShowEpisodeDetails(tvShowId, seasonNumber, episodeNumber);
    }
}
