import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Account, AddToWatchlistRequest, AddToWatchlistResponse } from '../models/account.model';
import { PaginatedMovies } from '../models/movie.model';
import { PaginatedTvShows } from '../models/tv-show.model';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class AccountDriver {
    constructor(private httpService: HttpService) {}

    getAccountInfo(url: string): Observable<Account> {
        return this.httpService.get<Account>(url);
    }

    getRatedMovies(url: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(url);
    }

    getRatedTVShows(url: string): Observable<PaginatedTvShows> {
        return this.httpService.get<PaginatedTvShows>(url);
    }

    getWatchlistMovies(url: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(url);
    }

    getWatchlistTVShows(url: string): Observable<PaginatedTvShows> {
        return this.httpService.get<PaginatedTvShows>(url);
    }

    addToWatchlist(url: string, request: AddToWatchlistRequest): Observable<AddToWatchlistResponse> {
        return this.httpService.post<AddToWatchlistResponse>(url, request);
    }
}
