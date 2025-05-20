import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MediaType } from '../enumerations/media-type.enum';
import { AccountGateway } from '../gateways/account.gateway';
import { Account, AddToWatchlistResponse } from '../models/account.model';
import { PaginatedMovies } from '../models/movie.model';
import { PaginatedTvShows } from '../models/tv-show.model';

@Injectable({
    providedIn: 'root',
})
export class AccountFacade {
    constructor(private accountGateway: AccountGateway) {}

    getAccountInfo(): Observable<Account> {
        return this.accountGateway.getAccountInfo();
    }

    getRatedMovies(page = 1): Observable<PaginatedMovies> {
        return this.accountGateway.getRatedMovies(page);
    }

    getRatedTVShows(page = 1): Observable<PaginatedTvShows> {
        return this.accountGateway.getRatedTVShows(page);
    }

    getWatchlistMovies(page = 1): Observable<PaginatedMovies> {
        return this.accountGateway.getWatchlistMovies(page);
    }

    getWatchlistTVShows(page = 1): Observable<PaginatedTvShows> {
        return this.accountGateway.getWatchlistTVShows(page);
    }

    addToWatchlist(mediaId: number, mediaType: MediaType, watchlist: boolean): Observable<AddToWatchlistResponse> {
        return this.accountGateway.addToWatchlist({ media_id: mediaId, media_type: mediaType, watchlist });
    }
}
