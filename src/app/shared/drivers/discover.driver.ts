import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedMovies } from '../models/movie.model';
import { PaginatedTvShows } from '../models/tv-show.model';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class DiscoverDriver {
    constructor(private httpService: HttpService) {}

    getMovies(url: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(url);
    }

    getTvShows(url: string): Observable<PaginatedTvShows> {
        return this.httpService.get<PaginatedTvShows>(url);
    }
}
