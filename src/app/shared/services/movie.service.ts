import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NowPlayingResponse } from '../../core/models/movies/responses/now-playing.model';
import { PopularResponse } from '../../core/models/movies/responses/popular.model';
import { TopRatedResponse } from '../../core/models/movies/responses/top-rated.model';
import { TrendingResponse } from '../../core/models/movies/responses/trending.model';
import { UpcomingResponse } from '../../core/models/movies/responses/upcoming.model';
import { HttpService } from '../../core/services/http.service';
import { UrlService } from '../../core/services/url.service';

@Injectable()
export class MovieService {
    constructor(
        private httpService: HttpService,
        private urlService: UrlService,
    ) {}

    getTrending(): Observable<TrendingResponse> {
        return this.httpService.get<TrendingResponse>(this.urlService.urlFor(['trending', 'movie', 'day']));
    }

    getNowPlaying(): Observable<NowPlayingResponse> {
        return this.httpService.get(this.urlService.urlFor(['movie', 'now_playing']));
    }

    getPopular(): Observable<PopularResponse> {
        return this.httpService.get<PopularResponse>(this.urlService.urlFor(['movie', 'popular']));
    }

    getTopRated(): Observable<TopRatedResponse> {
        return this.httpService.get<TopRatedResponse>(this.urlService.urlFor(['movie', 'top_rated']));
    }

    getUpcoming(): Observable<UpcomingResponse> {
        return this.httpService.get<UpcomingResponse>(this.urlService.urlFor(['movie', 'upcoming']));
    }
}
