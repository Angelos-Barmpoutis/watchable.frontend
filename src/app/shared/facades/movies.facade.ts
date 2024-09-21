import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { MovieDetails } from '../../core/models/movies/details.model';
import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { DEFAULT } from '../constants/defaults.constant';
import { MovieGateway } from '../gateways/movie.gateway';

export interface AllMovies {
    nowPlaying: PaginatedMovies;
    popular: PaginatedMovies;
    topRated: PaginatedMovies;
    upcoming: PaginatedMovies;
}

@Injectable({
    providedIn: 'root',
})
export class MoviesFacade {
    constructor(private movieGateway: MovieGateway) {}

    public getNowPlaying(page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.movieGateway.getNowPlaying(page);
    }

    public getPopular(page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.movieGateway.getPopular(page);
    }

    public getTopRated(page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.movieGateway.getTopRated(page);
    }

    public getUpcoming(page: number = DEFAULT.page): Observable<PaginatedMovies> {
        return this.movieGateway.getUpcoming(page);
    }

    public getDetails(id: number): Observable<MovieDetails> {
        return this.movieGateway.getDetails(id);
    }

    public getAllMovies(): Observable<AllMovies> {
        return forkJoin({
            nowPlaying: this.getNowPlaying(),
            popular: this.getPopular(),
            topRated: this.getTopRated(),
            upcoming: this.getUpcoming(),
        });
    }
}
