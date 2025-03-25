import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DiscoverDriver } from '../drivers/discover.driver';
import { PaginatedMovies } from '../models/movie.model';
import { PaginatedTvShows } from '../models/tv-show.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class DiscoverGateway {
    constructor(
        private discoverDriver: DiscoverDriver,
        private urlService: UrlService,
    ) {}

    getMovies(page: number, genreId: number): Observable<PaginatedMovies> {
        return this.discoverDriver.getMovies(
            this.urlService.createUrlForTMDB(['discover', `movie?page=${page}&with_genres=${genreId}`]),
        );
    }

    getTvShows(page: number, genreId: number): Observable<PaginatedTvShows> {
        return this.discoverDriver.getTvShows(
            this.urlService.createUrlForTMDB(['discover', `tv?page=${page}&with_genres=${genreId}`]),
        );
    }
}
