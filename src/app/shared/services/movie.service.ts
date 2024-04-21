import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedMovies } from '../../core/models/movies/paginated-movies.model';
import { HttpService } from '../../core/services/http.service';
import { UrlService } from '../../core/services/url.service';

@Injectable()
export class MovieService {
    constructor(
        private httpService: HttpService,
        private urlService: UrlService,
    ) {}

    getTrending(trendingFilter: string): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(this.urlService.urlFor(['trending', 'movie', trendingFilter]));
    }

    getAiringToday(): Observable<PaginatedMovies> {
        return this.httpService.get(this.urlService.urlFor(['movie', 'now_playing']));
    }

    getPopular(): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(this.urlService.urlFor(['movie', 'popular']));
    }

    getTopRated(): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(this.urlService.urlFor(['movie', 'top_rated']));
    }

    getUpcoming(): Observable<PaginatedMovies> {
        return this.httpService.get<PaginatedMovies>(this.urlService.urlFor(['movie', 'upcoming']));
    }
}
