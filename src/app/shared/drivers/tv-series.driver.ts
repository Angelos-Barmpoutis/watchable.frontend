import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedTvSeries } from '../../core/models/tv-series/paginated-tv-series.model';
import { HttpService } from '../../core/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class TvSeriesDriver {
    constructor(private httpService: HttpService) {}

    getAiringToday(url: string): Observable<PaginatedTvSeries> {
        return this.httpService.get<PaginatedTvSeries>(url);
    }

    getPopular(url: string): Observable<PaginatedTvSeries> {
        return this.httpService.get<PaginatedTvSeries>(url);
    }

    getTopRated(url: string): Observable<PaginatedTvSeries> {
        return this.httpService.get<PaginatedTvSeries>(url);
    }
}
