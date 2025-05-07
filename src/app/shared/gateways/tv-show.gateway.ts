import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TvShowDriver } from '../drivers/tv-show.driver';
import { PaginatedTvShows, TvShowDetails, TvShowEpisodeDetails, TvShowSeasonDetails } from '../models/tv-show.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class TvShowGateway {
    private readonly baseUrl = `${environment.TMDBBaseUrl}tv`;

    constructor(
        private readonly http: HttpClient,
        private readonly urlService: UrlService,
        private readonly tvShowDriver: TvShowDriver,
    ) {}

    public getDetails(id: number): Observable<TvShowDetails> {
        const url = this.urlService.createUrlForTMDB(['tv', id.toString()], {
            append_to_response: 'credits,videos,images,reviews,similar,external_ids,recommendations',
        });
        return this.tvShowDriver.getDetails(url);
    }

    public getTvShowSeasonDetails(tvShowId: number, seasonNumber: number): Observable<TvShowSeasonDetails> {
        const url = this.urlService.createUrlForTMDB(['tv', tvShowId.toString(), 'season', seasonNumber.toString()], {
            append_to_response: 'credits,videos,images',
        });
        return this.tvShowDriver.getTvShowSeasonDetails(url);
    }

    public getTvShowEpisodeDetails(
        tvShowId: number,
        seasonNumber: number,
        episodeNumber: number,
    ): Observable<TvShowEpisodeDetails> {
        const url = this.urlService.createUrlForTMDB(
            ['tv', tvShowId.toString(), 'season', seasonNumber.toString(), 'episode', episodeNumber.toString()],
            {
                append_to_response: 'credits,videos,images',
            },
        );
        return this.tvShowDriver.getTvShowEpisodeDetails(url);
    }

    getPopular(page: number = 1): Observable<PaginatedTvShows> {
        const url = this.urlService.createUrlForTMDB(['tv', 'popular'], { page });
        return this.tvShowDriver.getPopular(url);
    }

    getTopRated(page: number = 1): Observable<PaginatedTvShows> {
        const url = this.urlService.createUrlForTMDB(['tv', 'top_rated'], { page });
        return this.tvShowDriver.getTopRated(url);
    }

    getAiringToday(page: number = 1): Observable<PaginatedTvShows> {
        const url = this.urlService.createUrlForTMDB(['tv', 'airing_today'], { page });
        return this.tvShowDriver.getAiringToday(url);
    }

    getTvShowsByGenre(genreId: number, page: number = 1): Observable<PaginatedTvShows> {
        const url = this.urlService.createUrlForTMDB(['tv', 'discover'], {
            with_genres: genreId.toString(),
            page,
        });
        return this.tvShowDriver.getTvShowsByGenre(url);
    }
}
