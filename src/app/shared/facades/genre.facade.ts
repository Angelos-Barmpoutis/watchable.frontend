import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GenreGateway } from '../gateways/genre.gateway';
import { GenresResponse } from '../models/genre.model';

@Injectable({
    providedIn: 'root',
})
export class GenreFacade {
    constructor(private genreGateway: GenreGateway) {}

    public getMovieGenres(): Observable<GenresResponse> {
        return this.genreGateway.getMovieGenres();
    }

    public getTvShowGenres(): Observable<GenresResponse> {
        return this.genreGateway.getTvShowGenres();
    }
}
