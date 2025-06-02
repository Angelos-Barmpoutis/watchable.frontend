import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GenreDriver } from '../drivers/genre.driver';
import { GenresResponse } from '../models/genre.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class GenreGateway {
    constructor(
        private genreDriver: GenreDriver,
        private urlService: UrlService,
    ) {}

    getMovieGenres(): Observable<GenresResponse> {
        return this.genreDriver.getMovieGenres(this.urlService.createUrlForTMDB(['genre', 'movie', 'list']));
    }

    getTvShowGenres(): Observable<GenresResponse> {
        return this.genreDriver.getTvShowGenres(this.urlService.createUrlForTMDB(['genre', 'tv', 'list']));
    }
}
