import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { HttpService } from '../../core/services/http.service';
import { UrlService } from '../../core/services/url.service';

@Injectable()
export class TvSeriesService {
    constructor(
        private httpService: HttpService,
        private urlService: UrlService,
    ) {}

    getTrending(trendingFilter: string): Observable<PaginatedTvSeries> {
        return this.httpService.get<PaginatedTvSeries>(this.urlService.urlFor(['trending', 'tv', trendingFilter]));
    }

    getAiringToday(): Observable<PaginatedTvSeries> {
        return this.httpService.get<PaginatedTvSeries>(this.urlService.urlFor(['tv', 'airing_today']));
    }

    getPopular(): Observable<PaginatedTvSeries> {
        return this.httpService.get<PaginatedTvSeries>(this.urlService.urlFor(['tv', 'popular']));
    }

    getTopRated(): Observable<PaginatedTvSeries> {
        return this.httpService.get<PaginatedTvSeries>(this.urlService.urlFor(['tv', 'top_rated']));
    }
}
