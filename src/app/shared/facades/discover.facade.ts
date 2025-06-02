import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { DiscoverGateway } from '../gateways/discover.gateway';
import { PaginatedMovies } from '../models/movie.model';
import { PaginatedTvShows } from '../models/tv-show.model';

export interface AllMovies {
    action: PaginatedMovies;
    adventure: PaginatedMovies;
    animation: PaginatedMovies;
    comedy: PaginatedMovies;
    crime: PaginatedMovies;
    documentary: PaginatedMovies;
    drama: PaginatedMovies;
    family: PaginatedMovies;
    fantasy: PaginatedMovies;
    history: PaginatedMovies;
    horror: PaginatedMovies;
    music: PaginatedMovies;
    mystery: PaginatedMovies;
    romance: PaginatedMovies;
    scienceFinction: PaginatedMovies;
    thriller: PaginatedMovies;
    war: PaginatedMovies;
    western: PaginatedMovies;
}
@Injectable({
    providedIn: 'root',
})
export class TrendingFacade {
    constructor(private discoverGateway: DiscoverGateway) {}

    public getMovies(page: number = DEFAULT.page, genreId: number): Observable<PaginatedMovies> {
        return this.discoverGateway.getMovies(page, genreId);
    }

    public getTvShows(page: number = DEFAULT.page, genreId: number): Observable<PaginatedTvShows> {
        return this.discoverGateway.getTvShows(page, genreId);
    }

    public getAllMovies(): Observable<AllMovies> {
        return forkJoin({
            action: this.getMovies(DEFAULT.page, 28),
            adventure: this.getMovies(DEFAULT.page, 12),
            animation: this.getMovies(DEFAULT.page, 16),
            comedy: this.getMovies(DEFAULT.page, 35),
            crime: this.getMovies(DEFAULT.page, 89),
            documentary: this.getMovies(DEFAULT.page, 99),
            drama: this.getMovies(DEFAULT.page, 18),
            family: this.getMovies(DEFAULT.page, 10751),
            fantasy: this.getMovies(DEFAULT.page, 14),
            history: this.getMovies(DEFAULT.page, 36),
            horror: this.getMovies(DEFAULT.page, 27),
            music: this.getMovies(DEFAULT.page, 10402),
            mystery: this.getMovies(DEFAULT.page, 9648),
            romance: this.getMovies(DEFAULT.page, 10749),
            scienceFinction: this.getMovies(DEFAULT.page, 878),
            thriller: this.getMovies(DEFAULT.page, 53),
            war: this.getMovies(DEFAULT.page, 10752),
            western: this.getMovies(DEFAULT.page, 37),
        });
    }
}
