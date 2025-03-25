import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GenresResponse } from '../models/genre.model';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class GenreDriver {
    constructor(private httpService: HttpService) {}

    getMovieGenres(url: string): Observable<GenresResponse> {
        return this.httpService.get(url);
    }

    getTvShowGenres(url: string): Observable<GenresResponse> {
        return this.httpService.get(url);
    }
}
