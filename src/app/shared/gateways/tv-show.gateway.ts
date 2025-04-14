import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TvShowDriver } from '../drivers/tv-show.driver';
import { PaginatedTvShows, TvShowDetails } from '../models/tv-show.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class TvShowGateway {
    constructor(
        private tvShowDriver: TvShowDriver,
        private urlService: UrlService,
    ) {}

    getAiringToday(page: number = 1): Observable<PaginatedTvShows> {
        const url = this.urlService.createUrlForTMDB(['tv', 'airing_today'], { page });
        return this.tvShowDriver.getAiringToday(url);
    }

    getPopular(page: number = 1): Observable<PaginatedTvShows> {
        const url = this.urlService.createUrlForTMDB(['tv', 'popular'], { page });
        return this.tvShowDriver.getPopular(url);
    }

    getTopRated(page: number = 1): Observable<PaginatedTvShows> {
        const url = this.urlService.createUrlForTMDB(['tv', 'top_rated'], { page });
        return this.tvShowDriver.getTopRated(url);
    }

    getDetails(id: number): Observable<TvShowDetails> {
        const url = this.urlService.createUrlForTMDB(['tv', id.toString()], {
            append_to_response: 'credits,videos,images,reviews,similar,external_ids,recommendations',
        });
        return this.tvShowDriver.getDetails(url);
    }
}
