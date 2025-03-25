import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedMovies } from '../models/movie.model';
import { PaginatedPeople } from '../models/people.model';
import { PaginatedSearchResults } from '../models/search.model';
import { PaginatedTvShows } from '../models/tv-show.model';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class SearchDriver {
    constructor(private httpService: HttpService) {}

    getMulti(url: string): Observable<PaginatedSearchResults> {
        return this.httpService.get(url);
    }

    getMovies(url: string): Observable<PaginatedMovies> {
        return this.httpService.get(url);
    }

    getTvShows(url: string): Observable<PaginatedTvShows> {
        return this.httpService.get(url);
    }

    getPeople(url: string): Observable<PaginatedPeople> {
        return this.httpService.get(url);
    }
}
