import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedTvShows } from '../models/tv-show.model';
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
}
