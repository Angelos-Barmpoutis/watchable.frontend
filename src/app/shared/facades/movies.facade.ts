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
    constructor(private movieGateway: MovieGateway) {}

    public getNowPlaying(): Observable<PaginatedMovies> {
        return this.movieGateway.getNowPlaying();
    }

    public getPopular(): Observable<PaginatedMovies> {
        return this.movieGateway.getPopular();
    }

    public getTopRated(): Observable<PaginatedMovies> {
        return this.movieGateway.getTopRated();
    }

    public getUpcoming(): Observable<PaginatedMovies> {
        return this.movieGateway.getUpcoming();
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
