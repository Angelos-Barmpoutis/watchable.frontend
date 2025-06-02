import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    AddTvShowEpisodeRatingRequest,
    AddTvShowEpisodeRatingResponse,
    AddTvShowRatingRequest,
    AddTvShowRatingResponse,
    PaginatedTvShows,
    TvShowDetails,
    TvShowEpisodeDetails,
    TvShowSeasonDetails,
} from '../models/tv-show.model';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class TvShowDriver {
    constructor(private httpService: HttpService) {}

    getAiringToday(url: string): Observable<PaginatedTvShows> {
        return this.httpService.get<PaginatedTvShows>(url);
    }

    getPopular(url: string): Observable<PaginatedTvShows> {
        return this.httpService.get<PaginatedTvShows>(url);
    }

    getTopRated(url: string): Observable<PaginatedTvShows> {
        return this.httpService.get<PaginatedTvShows>(url);
    }

    getDetails(url: string): Observable<TvShowDetails> {
        return this.httpService.get<TvShowDetails>(url);
    }

    getTvShowsByGenre(url: string): Observable<PaginatedTvShows> {
        return this.httpService.get<PaginatedTvShows>(url);
    }

    getTvShowSeasonDetails(url: string): Observable<TvShowSeasonDetails> {
        return this.httpService.get<TvShowSeasonDetails>(url);
    }

    getTvShowEpisodeDetails(url: string): Observable<TvShowEpisodeDetails> {
        return this.httpService.get<TvShowEpisodeDetails>(url);
    }

    addTvShowRating(url: string, request: AddTvShowRatingRequest): Observable<AddTvShowRatingResponse> {
        return this.httpService.post<AddTvShowRatingResponse>(url, request);
    }

    addTvShowEpisodeRating(
        url: string,
        request: AddTvShowEpisodeRatingRequest,
    ): Observable<AddTvShowEpisodeRatingResponse> {
        return this.httpService.post<AddTvShowEpisodeRatingResponse>(url, request);
    }
}
