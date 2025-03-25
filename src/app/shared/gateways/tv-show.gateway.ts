import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TvShowDriver } from '../drivers/tv-show.driver';
import { PaginatedTvShows } from '../models/tv-show.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class TvShowGateway {
    constructor(
        private tvShowDriver: TvShowDriver,
        private urlService: UrlService,
    ) {}

    getAiringToday(page: number): Observable<PaginatedTvShows> {
        return this.tvShowDriver.getAiringToday(this.urlService.createUrlForTMDB(['tv', `airing_today?page=${page}`]));
    }

    getPopular(page: number): Observable<PaginatedTvShows> {
        return this.tvShowDriver.getPopular(this.urlService.createUrlForTMDB(['tv', `popular?page=${page}`]));
    }

    getTopRated(page: number): Observable<PaginatedTvShows> {
        return this.tvShowDriver.getTopRated(this.urlService.createUrlForTMDB(['tv', `top_rated?page=${page}`]));
    }
}
