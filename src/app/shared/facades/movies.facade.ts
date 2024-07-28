import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
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
    private DEFAULT_PAGE = 1;

    constructor(private movieGateway: MovieGateway) {}

    public getNowPlaying(page: number): Observable<PaginatedMovies> {
        return this.movieGateway.getNowPlaying(page);
    }

    public getPopular(page: number): Observable<PaginatedMovies> {
        return this.movieGateway.getPopular(page);
    }

    public getTopRated(page: number): Observable<PaginatedMovies> {
        return this.movieGateway.getTopRated(page);
    }

    public getUpcoming(page: number): Observable<PaginatedMovies> {
        return this.movieGateway.getUpcoming(page);
    }

    public getAllMovies(): Observable<AllMovies> {
        return forkJoin({
            nowPlaying: this.getNowPlaying(this.DEFAULT_PAGE),
            popular: this.getPopular(this.DEFAULT_PAGE),
            topRated: this.getTopRated(this.DEFAULT_PAGE),
            upcoming: this.getUpcoming(this.DEFAULT_PAGE),
        });
    }
}
