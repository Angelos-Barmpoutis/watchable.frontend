import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountDriver } from '../drivers/account.driver';
import { Account, AddToWatchlistRequest, AddToWatchlistResponse } from '../models/account.model';
import { PaginatedMovies } from '../models/movie.model';
import { PaginatedTvShows } from '../models/tv-show.model';
import { UrlService } from '../services/url.service';

@Injectable({
    providedIn: 'root',
})
export class AccountGateway {
    constructor(
        private accountDriver: AccountDriver,
        private urlService: UrlService,
    ) {}

    getAccountInfo(): Observable<Account> {
        return this.accountDriver.getAccountInfo(this.urlService.createUrlForTMDB(['account']));
    }

    getRatedMovies(page = 1): Observable<PaginatedMovies> {
        return this.accountDriver.getRatedMovies(
            this.urlService.createUrlForTMDB(['account', 'rated', 'movies', `page=${page}`]),
        );
    }

    getRatedTVShows(page = 1): Observable<PaginatedTvShows> {
        return this.accountDriver.getRatedTVShows(
            this.urlService.createUrlForTMDB(['account', 'rated', 'tv', `page=${page}`]),
        );
    }

    getWatchlistMovies(page = 1): Observable<PaginatedMovies> {
        return this.accountDriver.getWatchlistMovies(
            this.urlService.createUrlForTMDB(['account', 'watchlist', 'movies', `page=${page}`]),
        );
    }

    getWatchlistTVShows(page = 1): Observable<PaginatedTvShows> {
        return this.accountDriver.getWatchlistTVShows(
            this.urlService.createUrlForTMDB(['account', 'watchlist', 'tv', `page=${page}`]),
        );
    }

    addToWatchlist(request: AddToWatchlistRequest): Observable<AddToWatchlistResponse> {
        return this.accountDriver.addToWatchlist(this.urlService.createUrlForTMDB(['account', 'watchlist']), request);
    }
}
